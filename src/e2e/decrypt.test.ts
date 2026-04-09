import axios from 'axios';
// @ts-ignore
import * as mpdParser from 'mpd-parser';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import path from 'path';
import 'dotenv/config';
import { expect, test } from 'bun:test';

const BATCH_ID = process.env.BATCH_ID || '';
const TOKEN = process.env.TOKEN || '';
const CDRM_URL = process.env.CDRM_URL || 'https://cdrm-project.com/api/decrypt';
const TEST_LECTURE_ID = process.env.TEST_LECTURE_ID || '';

const HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": TOKEN,
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "200",
    "content-type": "application/json",
    "devicememory": "8192",
    "devicetype": "desktop",
    "networktype": "3g",
    "priority": "u=1, i",
    "randomid": "eef9790f-d777-496a-9c79-dc2eb7da5a75",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://www.pw.live/",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
};

const tempDir = path.join(process.cwd(), 'temp_e2e_test');

async function fetchVideoDetails(lectureId: string) {
    const res = await axios.get(
        `https://api.penpencil.co/v1/videos/video-url-details?type=BATCHES&videoContainerType=DASH&reqType=query&childId=${lectureId}&parentId=${BATCH_ID}&clientVersion=201`,
        { headers: HEADERS }
    );
    const { url, signedUrl, drmDetails } = res.data.data;
    return { url, signedUrl, drmDetails };
}

async function fetchAndParseMpd(url: string, signedUrl: string) {
    const mpdUrl = url.includes('?') ? (url + signedUrl.replace('?', '&')) : (url + signedUrl);
    const res = await axios.get(mpdUrl, { headers: HEADERS });
    const parsed = mpdParser.parse(res.data, { manifestUri: mpdUrl });

    const psshMatch = res.data.match(/<cenc:pssh>(.*?)<\/cenc:pssh>/);
    const pssh = psshMatch ? psshMatch[1] : null;

    return { parsed, pssh, baseUrl: url.substring(0, url.lastIndexOf('/') + 1), signature: signedUrl };
}

async function getDecryptionKey(pssh: string, drmDetails: any) {
    const res = await axios.post(CDRM_URL, {
        pssh,
        licurl: drmDetails.licenseUrl,
        headers: JSON.stringify({
            'pallycon-customdata-v2': drmDetails.licenseToken,
            ...HEADERS
        }),
        device: 'default'
    });

    if (res.data.status !== 'success') {
        throw new Error(`CDRM failed: ${res.data.message}`);
    }

    const keyString = res.data.message;
    const keyMatch = keyString.match(/^([a-f0-9]{32}):([a-f0-9]{32})$/);
    if (!keyMatch) {
        throw new Error(`Invalid key format: ${keyString}`);
    }

    return { keyString, key: keyMatch[2] };
}

async function downloadChunk(url: string, filePath: string) {
    const res = await axios.get(url, { responseType: 'arraybuffer', headers: HEADERS });
    await fs.writeFile(filePath, Buffer.from(res.data));
    const stats = await fs.stat(filePath);
    return stats.size;
}

async function mergeChunks(initPath: string, chunkPath: string, outputPath: string) {
    const initData = await fs.readFile(initPath);
    const chunkData = await fs.readFile(chunkPath);
    await fs.writeFile(outputPath, Buffer.concat([initData, chunkData]));
    const stats = await fs.stat(outputPath);
    return stats.size;
}

async function decryptFile(inputPath: string, outputPath: string, key: string) {
    execSync(`ffmpeg -y -decryption_key ${key} -i "${inputPath}" -codec copy "${outputPath}" 2>&1`, {
        stdio: 'pipe'
    });
    const stats = await fs.stat(outputPath);
    return stats.size;
}

async function mergeVideoAudio(videoPath: string, audioPath: string, outputPath: string) {
    execSync(`ffmpeg -y -i "${videoPath}" -i "${audioPath}" -codec copy "${outputPath}" 2>&1`, {
        stdio: 'pipe'
    });
    const stats = await fs.stat(outputPath);
    return stats.size;
}

function verifyPlayable(filePath: string) {
    const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`, {
        encoding: 'utf8'
    });
    const duration = parseFloat(output.trim());
    return duration > 0;
}

async function cleanup() {
    if (await fs.pathExists(tempDir)) {
        await fs.remove(tempDir);
    }
}

const outputDir = path.join(process.cwd(), 'test_output');

test('E2E video decryption flow', async () => {
    expect(TOKEN, 'TOKEN must be set in .env').toBeTruthy();
    expect(TEST_LECTURE_ID, 'TEST_LECTURE_ID must be set in .env').toBeTruthy();
    expect(BATCH_ID, 'BATCH_ID must be set in .env').toBeTruthy();

    console.log('\n=== E2E Decryption Test ===');
    console.log(`Batch: ${BATCH_ID}`);
    console.log(`Lecture: ${TEST_LECTURE_ID}`);
    console.log(`CDRM: ${CDRM_URL}\n`);

    await cleanup();
    await fs.ensureDir(tempDir);
    await fs.ensureDir(outputDir);

    try {
        console.log('Step 1: Fetch video-url-details');
        const { url, signedUrl, drmDetails } = await fetchVideoDetails(TEST_LECTURE_ID);
        expect(url).toBeTruthy();
        expect(signedUrl).toBeTruthy();
        expect(drmDetails).toBeTruthy();
        console.log('  ✓ DRM details obtained');

        console.log('Step 2: Fetch and parse MPD');
        const { parsed, pssh, baseUrl, signature } = await fetchAndParseMpd(url, signedUrl);
        expect(pssh).toBeTruthy();

        const videoPlaylist = (parsed.playlists as any[]).sort((a, b) =>
            (b.attributes.RESOLUTION?.height || 0) - (a.attributes.RESOLUTION?.height || 0)
        )[0];
        expect(videoPlaylist).toBeTruthy();
        console.log(`  ✓ Video: ${videoPlaylist.attributes.RESOLUTION?.height}p`);

        let audioPlaylist: any = null;
        const audioGroup = parsed.mediaGroups.AUDIO;
        if (audioGroup) {
            const group = Object.values(audioGroup)[0] as any;
            const topLevel = Object.values(group)[0] as any;
            if (topLevel?.playlists?.[0]) {
                audioPlaylist = topLevel.playlists[0];
                console.log('  ✓ Audio: found');
            }
        }

        console.log('Step 3: Get decryption key from CDRM');
        const { keyString, key } = await getDecryptionKey(pssh, drmDetails);
        expect(key).toBeDefined();
        expect(key.length).toBe(32);
        console.log(`  ✓ Key obtained: ${keyString.substring(0, 20)}...`);

        console.log('Step 4: Download init + chunk 0');
        const vInitUrl = baseUrl + videoPlaylist.segments[0].map.uri + signature;
        const vChunkUrl = baseUrl + videoPlaylist.segments[0].uri + signature;

        const vInitPath = path.join(tempDir, 'v_init.mp4');
        const vChunkPath = path.join(tempDir, 'v_chunk_0.m4s');

        const vInitSize = await downloadChunk(vInitUrl, vInitPath);
        const vChunkSize = await downloadChunk(vChunkUrl, vChunkPath);
        expect(vInitSize).toBeGreaterThan(0);
        expect(vChunkSize).toBeGreaterThan(0);
        console.log(`  ✓ Video: ${vInitSize + vChunkSize} bytes`);

        let aInitSize = 0, aChunkSize = 0;
        if (audioPlaylist) {
            const aInitUrl = baseUrl + audioPlaylist.segments[0].map.uri + signature;
            const aChunkUrl = baseUrl + audioPlaylist.segments[0].uri + signature;

            const aInitPath = path.join(tempDir, 'a_init.mp4');
            const aChunkPath = path.join(tempDir, 'a_chunk_0.m4s');

            aInitSize = await downloadChunk(aInitUrl, aInitPath);
            aChunkSize = await downloadChunk(aChunkUrl, aChunkPath);
            expect(aInitSize).toBeGreaterThan(0);
            expect(aChunkSize).toBeGreaterThan(0);
            console.log(`  ✓ Audio: ${aInitSize + aChunkSize} bytes`);
        }

        console.log('Step 5: Merge init + chunk');
        const vCombinedPath = path.join(tempDir, 'v_combined.mp4');
        const vCombinedSize = await mergeChunks(vInitPath, vChunkPath, vCombinedPath);
        expect(vCombinedSize).toBeGreaterThan(0);
        console.log(`  ✓ Video combined: ${vCombinedSize} bytes`);

        let aCombinedPath = '';
        if (audioPlaylist) {
            aCombinedPath = path.join(tempDir, 'a_combined.mp4');
            const aCombinedSize = await mergeChunks(
                path.join(tempDir, 'a_init.mp4'),
                path.join(tempDir, 'a_chunk_0.m4s'),
                aCombinedPath
            );
            expect(aCombinedSize).toBeGreaterThan(0);
            console.log(`  ✓ Audio combined: ${aCombinedSize} bytes`);
        }

        console.log('Step 6: Decrypt video');
        const vDecryptedPath = path.join(tempDir, 'v_decrypted.mp4');
        const vDecryptedSize = await decryptFile(vCombinedPath, vDecryptedPath, key);
        expect(vDecryptedSize).toBeGreaterThan(0);
        console.log(`  ✓ Video decrypted: ${vDecryptedSize} bytes`);

        let aDecryptedPath = '';
        if (audioPlaylist) {
            console.log('Step 6b: Decrypt audio');
            aDecryptedPath = path.join(tempDir, 'a_decrypted.mp4');
            const aDecryptedSize = await decryptFile(aCombinedPath, aDecryptedPath, key);
            expect(aDecryptedSize).toBeGreaterThan(0);
            console.log(`  ✓ Audio decrypted: ${aDecryptedSize} bytes`);
        }

        console.log('Step 7: Merge video + audio');
        const finalPath = path.join(tempDir, 'final.mp4');
        if (audioPlaylist) {
            await mergeVideoAudio(vDecryptedPath, aDecryptedPath, finalPath);
        } else {
            execSync(`ffmpeg -y -i "${vDecryptedPath}" -codec copy "${finalPath}" 2>&1`, { stdio: 'pipe' });
        }

        const finalStats = await fs.stat(finalPath);
        expect(finalStats.size).toBeGreaterThan(0);
        console.log(`  ✓ Final: ${finalStats.size} bytes`);

        console.log('Step 8: Verify playable');
        const isPlayable = verifyPlayable(finalPath);
        expect(isPlayable).toBe(true);
        console.log('  ✓ Playable');

        const outputPath = path.join(outputDir, 'decrypt_test_final.mp4');
        await fs.copy(finalPath, outputPath);
        console.log(`\n=== TEST PASSED ===`);
        console.log(`Output: ${outputPath}`);

    } finally {
        await cleanup();
    }
});