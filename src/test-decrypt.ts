import axios from 'axios';
import * as mpdParser from 'mpd-parser';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import path from 'path';

const BATCH_ID = '684aa87530e932e1745d63a3';
const TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc'; // Use the token from research.md for POC

const HEADERS = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': TOKEN,
    'cache-control': 'no-cache',
    'client-id': '5eb393ee95fab7468a79d189',
    'client-type': 'WEB',
    'client-version': '200',
    'content-type': 'application/json',
    'devicememory': '8192',
    'devicetype': 'desktop',
    'networktype': '3g',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'randomid': '948f0288-e2ea-4cd4-80eb-56503c8a2c10',
    'sec-ch-ua': '"Chromium";v="141", "Not?A_Brand";v="8"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'Referer': 'https://www.pw.live/',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
};

async function testDecrypt() {
    const lectureId = '6867e3ff61028091e7220283'; // From research.md Step 5

    console.log('--- Step 1: Fetching video URL details ---');
    const urlDetailsRes = await axios.get(`https://api.penpencil.co/v1/videos/video-url-details?type=BATCHES&videoContainerType=DASH&reqType=query&childId=${lectureId}&parentId=${BATCH_ID}&clientVersion=201`, { headers: HEADERS });
    
    const { url, signedUrl, drmDetails } = urlDetailsRes.data.data;
    const mpdUrl = url + signedUrl;
    console.log('MPD URL (Signed):', mpdUrl);
    console.log('DRM Content ID:', drmDetails.contentId);

    console.log('\n--- Step 2: Fetching and parsing MPD ---');
    const mpdRes = await axios.get(mpdUrl, { headers: HEADERS });
    const parsedMpd = mpdParser.parse(mpdRes.data, { manifestUri: mpdUrl });
    
    // console.log('Parsed MPD:', JSON.stringify(parsedMpd, null, 2));
    console.log('Playlists found:', parsedMpd.playlists?.length || 0);
    if (parsedMpd.playlists) {
        parsedMpd.playlists.forEach((p, i) => {
            console.log(`Playlist ${i}:`, p.attributes);
        });
    }

    // Pick the highest bandwidth video representation
    // Note: mpd-parser seems to return uppercase attributes in this environment
    const videoPlaylist = parsedMpd.playlists.find(p => p.attributes.BANDWIDTH === Math.max(...parsedMpd.playlists.map(m => m.attributes.BANDWIDTH || 0)));
    if (!videoPlaylist) throw new Error('No video playlist found');
    
    // The signature must be appended to ALL chunk URLs
    const signature = signedUrl; 
    const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
    const initUrl = baseUrl + videoPlaylist.segments[0].map.uri + signature;
    const chunkUrl = baseUrl + videoPlaylist.segments[0].uri + signature;

    console.log('Video Init URL:', initUrl);
    console.log('Video Chunk URL:', chunkUrl);

    // Find audio playlist
    // In mpd-parser, parsedMpd.mediaGroups.AUDIO contains audio groups
    let audioUrl = '';
    let audioInitUrl = '';
    const audioGroup = parsedMpd.mediaGroups.AUDIO;
    if (audioGroup) {
        const group = Object.values(audioGroup)[0] as any;
        const playlist = Object.values(group)[0] as any;
        if (playlist && playlist.playlists && playlist.playlists[0]) {
            const ap = playlist.playlists[0];
            audioInitUrl = baseUrl + ap.segments[0].map.uri + signature;
            audioUrl = baseUrl + ap.segments[0].uri + signature;
        }
    }

    console.log('Audio Init URL:', audioInitUrl);
    console.log('Audio Chunk URL:', audioUrl);

    // Extract PSSH from MPD
    const psshMatch = mpdRes.data.match(/<cenc:pssh>(.*?)<\/cenc:pssh>/);
    const pssh = psshMatch ? psshMatch[1] : null;
    if (!pssh) throw new Error('PSSH not found in MPD');
    console.log('PSSH:', pssh);

    console.log('\n--- Step 3: Getting decryption key from CDRM-Project ---');
    const decryptRes = await axios.post('https://cdrm-project.com/api/decrypt', {
        pssh: pssh,
        licurl: drmDetails.licenseUrl,
        headers: JSON.stringify({
            'authorization': TOKEN,
            'pallycon-customdata-v2': drmDetails.licenseToken,
            ...HEADERS
        }),
        device: 'default'
    });

    if (decryptRes.data.status !== 'success') {
        throw new Error('Failed to get decryption key: ' + JSON.stringify(decryptRes.data));
    }

    const keyString = decryptRes.data.message; // format: KID:KEY
    console.log('Decryption Key:', keyString);
    const key = keyString.split(':')[1];

    console.log('\n--- Step 4: Downloading chunks ---');
    const tempDir = path.join(process.cwd(), 'temp_poc');
    await fs.ensureDir(tempDir);

    const vInitPath = path.join(tempDir, 'v_init.mp4');
    const vChunkPath = path.join(tempDir, 'v_chunk1.m4s');
    const aInitPath = path.join(tempDir, 'a_init.mp4');
    const aChunkPath = path.join(tempDir, 'a_chunk1.m4s');
    
    const vCombinedPath = path.join(tempDir, 'v_combined.mp4');
    const aCombinedPath = path.join(tempDir, 'a_combined.mp4');
    
    const vDecryptedPath = path.join(tempDir, 'v_decrypted.mp4');
    const aDecryptedPath = path.join(tempDir, 'a_decrypted.mp4');
    const finalPath = path.join(tempDir, 'final.mp4');

    // Download Video Chunks
    const vInitData = await axios.get(initUrl, { responseType: 'arraybuffer', headers: HEADERS });
    const vChunkData = await axios.get(chunkUrl, { responseType: 'arraybuffer', headers: HEADERS });
    await fs.writeFile(vCombinedPath, Buffer.concat([Buffer.from(vInitData.data), Buffer.from(vChunkData.data)]));

    // Download Audio Chunks
    if (audioUrl) {
        const aInitData = await axios.get(audioInitUrl, { responseType: 'arraybuffer', headers: HEADERS });
        const aChunkData = await axios.get(audioUrl, { responseType: 'arraybuffer', headers: HEADERS });
        await fs.writeFile(aCombinedPath, Buffer.concat([Buffer.from(aInitData.data), Buffer.from(aChunkData.data)]));
    }

    console.log('\n--- Step 5: Decrypting using ffmpeg ---');
    try {
        console.log('Decrypting video...');
        execSync(`ffmpeg -y -decryption_key ${key} -i ${vCombinedPath} -codec copy ${vDecryptedPath}`, { stdio: 'inherit' });
        
        if (audioUrl) {
            console.log('Decrypting audio...');
            execSync(`ffmpeg -y -decryption_key ${key} -i ${aCombinedPath} -codec copy ${aDecryptedPath}`, { stdio: 'inherit' });
            
            console.log('Merging video and audio...');
            execSync(`ffmpeg -y -i ${vDecryptedPath} -i ${aDecryptedPath} -codec copy ${finalPath}`, { stdio: 'inherit' });
            console.log('\nSUCCESS! Final file created at:', finalPath);
        } else {
            console.log('\nSUCCESS! Decrypted (video only) file created at:', vDecryptedPath);
        }
        
    } catch (err) {
        console.error('ffmpeg decryption/merge failed.');
        console.error(err);
    }
}

testDecrypt().catch(console.error);
