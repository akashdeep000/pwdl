import axios from 'axios';
// @ts-ignore
import * as mpdParser from 'mpd-parser';
import { Database } from 'bun:sqlite';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import https from 'https';

const DEBUG = process.env.DEBUG === '1';

function log(lectureId: string, step: string, message: string, data?: any) {
    if (!DEBUG) return;
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${lectureId}] [${step}] ${message}`;
    console.log(logLine + (data ? ` ${JSON.stringify(data)}` : ''));
}

function getDiskUsage(dir: string): { total: number; used: number; free: number; percent: number } {
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
        fs.ensureDirSync(dir);
    }

    try {
        const output = execSync(`df -B1 "${dir}"`, { encoding: 'utf8' });
        const lines = output.trim().split('\n');
        if (lines.length >= 2) {
            const line = lines[1] ?? '';
            const parts = line.split(/\s+/);
            const total = parseInt(parts[1] ?? '0', 10) || 0;
            const used = parseInt(parts[2] ?? '0', 10) || 0;
            const free = parseInt(parts[3] ?? '0', 10) || 0;
            const percent = total > 0 ? Math.round((used / total) * 100) : 0;
            return { total, used, free, percent };
        }
    } catch (e: any) {
        console.error('Failed to get disk usage:', e.message);
    }
    return { total: 0, used: 0, free: 0, percent: 0 };
}

function formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let size = bytes;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export class Downloader {
    private db: Database;
    private token: string;
    private batchId: string;
    private headers: any;
    private downloadDir: string;
    private lectureQueue: PQueue;
    private chunkConcurrency: number;
    private preferredResolution: number;
    private agent: https.Agent;
    private cdrMUrl: string;
    private storageThreshold: number = 95;
    private isPaused: boolean = false;
    private pauseResolve: (() => void) | null = null;
    private diskCheckInterval: NodeJS.Timeout | null = null;

    constructor(db: Database, token: string, batchId: string, lectureConcurrency: number = 3, chunkConcurrency: number = 5, downloadDir: string = 'downloads', preferredRes: number = 720, cdrMUrl: string = 'https://cdrm-project.com/api/decrypt', storageThreshold: number = 95) {
        this.db = db;
        this.token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        this.batchId = batchId;
        this.downloadDir = path.resolve(downloadDir);
        this.lectureQueue = new PQueue({ concurrency: lectureConcurrency });
        this.chunkConcurrency = chunkConcurrency;
        this.preferredResolution = preferredRes;
        this.cdrMUrl = cdrMUrl;
        this.storageThreshold = storageThreshold;

        // Persistent agent for better performance at high concurrency
        this.agent = new https.Agent({
            keepAlive: true,
            maxSockets: 64,
            timeout: 60000
        });

        this.headers = {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": this.token,
            "client-id": "5eb393ee95fab7468a79d189",
            "client-type": "WEB",
            "content-type": "application/json",
            "priority": "u=1, i",
            "randomid": "eef9790f-d777-496a-9c79-dc2eb7da5a75",
            "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-sdk-version": "0.0.16"
        };
    }

    private async checkAndPauseForStorage() {
        const usage = getDiskUsage(this.downloadDir);

        if (!this.isPaused && usage.percent >= this.storageThreshold) {
            console.log(`\n⚠️  STORAGE: ${usage.percent}% used (threshold: ${this.storageThreshold}%)`);
            console.log(`    Total: ${formatBytes(usage.total)} | Used: ${formatBytes(usage.used)} | Free: ${formatBytes(usage.free)}`);
            console.log(`    ⏸️  Pausing downloads... Please free up space to resume.\n`);
            this.isPaused = true;
            this.lectureQueue.pause();
            this.startStorageMonitor();
        }

        return usage;
    }

    private startStorageMonitor() {
        if (this.diskCheckInterval) return;

        this.diskCheckInterval = setInterval(() => {
            const usage = getDiskUsage(this.downloadDir);

            console.log(`🔄 STORAGE CHECK: ${usage.percent}% used | Free: ${formatBytes(usage.free)}`);

            if (this.isPaused && usage.percent < this.storageThreshold) {
                console.log(`\n✅ STORAGE: Space available (${usage.percent}%) - Resuming downloads...\n`);
                this.isPaused = false;
                this.lectureQueue.start();
                if (this.diskCheckInterval) {
                    clearInterval(this.diskCheckInterval);
                    this.diskCheckInterval = null;
                }
            }
        }, 5000);
    }

    public getStorageStatus() {
        const usage = getDiskUsage(this.downloadDir);
        return {
            ...usage,
            isPaused: this.isPaused,
            threshold: this.storageThreshold
        };
    }

    public printStorageStatus() {
        const usage = getDiskUsage(this.downloadDir);
        console.log(`💾 STORAGE: ${usage.percent}% used | ${formatBytes(usage.free)} free of ${formatBytes(usage.total)}`);
        if (this.isPaused) {
            console.log(`    ⏸️  Downloads PAUSED (threshold: ${this.storageThreshold}%)`);
        }
        return usage;
    }

    public isStoragePaused(): boolean {
        return this.isPaused;
    }

    async downloadAll(limit?: number, specificId?: string) {
        console.log(`\n💾 STORAGE: Checking disk space before download...`);
        await this.printStorageStatus();

        let query = 'SELECT l.*, t.name as topic_name, s.name as subject_name FROM lectures l JOIN topics t ON l.topic_id = t.id JOIN subjects s ON t.subject_id = s.id WHERE l.status != "COMPLETED"';
        if (specificId) {
            query += ` AND l.id = "${specificId}"`;
        } else if (limit) {
            query += ` LIMIT ${limit}`;
        }
        const lectures = this.db.query(query).all() as any[];

        console.log(`[DOWNLOADER] Found ${lectures.length} lectures to download`);

        const tasks = lectures.map(lecture => () => pRetry(() => this.downloadLecture(lecture), {
            retries: 3,
            onFailedAttempt: (error: any) => {
                console.log(`[${lecture.id.substring(0, 8)}] LECTURE_RETRY ${error.attemptNumber}/3: ${error.message}`);
                this.db.run('UPDATE lectures SET error_message = ? WHERE id = ?', [error.message, lecture.id]);
            }
        }));

        await this.lectureQueue.addAll(tasks);
    }

    private async downloadLecture(lecture: any) {
        // Check storage before starting each lecture
        await this.checkAndPauseForStorage();

        const topicDir = path.join(this.downloadDir, lecture.subject_name.replace(/[/\\?%*:|"<>]/g, '_'), lecture.topic_name.replace(/[/\\?%*:|"<>]/g, '_'));
        const finalPath = path.join(topicDir, `${lecture.name.replace(/[/\\?%*:|"<>]/g, '_')}.mp4`);
        const lid = lecture.id.substring(0, 8);

        log(lid, 'START', `Starting download: ${lecture.name}`);

        if (await fs.pathExists(finalPath)) {
            log(lid, 'SKIP', 'File already exists');
            this.db.run('UPDATE lectures SET status = "COMPLETED", local_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [finalPath, lecture.id]);
            return;
        }

        this.db.run('UPDATE lectures SET status = "PROCESSING", error_message = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [lecture.id]);

        log(lid, 'API', 'Fetching video-url-details');
        let urlDetailsRes;
        try {
            urlDetailsRes = await axios.get(`https://api.penpencil.co/v1/videos/video-url-details?type=BATCHES&videoContainerType=DASH&reqType=query&childId=${lecture.id}&parentId=${this.batchId}&clientVersion=201`, {
                headers: this.headers,
                httpsAgent: this.agent,
                timeout: 30000
            });
            log(lid, 'API', 'video-url-details response status', { status: urlDetailsRes.status, hasData: !!urlDetailsRes.data.data });
        } catch (e: any) {
            const errMsg = `video-url-details failed: ${e.message} (${e.response?.status || 'no status'})`;
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw e;
        }

        log(lid, 'CHECK', 'Checking response structure', {
            hasData: !!urlDetailsRes.data?.data,
            hasUrl: !!urlDetailsRes.data?.data?.url,
            keys: urlDetailsRes.data?.data ? Object.keys(urlDetailsRes.data.data) : []
        });

        if (!urlDetailsRes.data?.data || !urlDetailsRes.data?.data?.url) {
            const errMsg = `No URL in response. Response: ${JSON.stringify(urlDetailsRes.data).substring(0, 500)}`;
            log(lid, 'SKIP', errMsg);
            this.db.run('UPDATE lectures SET status = "SKIPPED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            return;
        }

        const { url, signedUrl, drmDetails } = urlDetailsRes.data.data;
        log(lid, 'CHECK', 'Checking DRM details', { hasDrmDetails: !!drmDetails, hasLicenseUrl: !!drmDetails?.licenseUrl });

        if (!drmDetails) {
            const errMsg = `No DRM details in response. url: ${url ? 'present' : 'missing'}`;
            log(lid, 'SKIP', errMsg);
            this.db.run('UPDATE lectures SET status = "SKIPPED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            return;
        }

        let mpdUrl = url;
        if (signedUrl) {
            mpdUrl = url.includes('?') ? (url + signedUrl.replace('?', '&')) : (url + signedUrl);
        }
        log(lid, 'MPD', `Fetching MPD: ${mpdUrl.substring(0, 100)}...`);

        let mpdRes;
        try {
            mpdRes = await axios.get(mpdUrl, {
                headers: this.headers,
                httpsAgent: this.agent,
                timeout: 30000
            });
            log(lid, 'MPD', 'MPD fetched successfully', { length: mpdRes.data?.length });
        } catch (e: any) {
            const errMsg = `MPD fetch failed: ${e.message} (${e.response?.status || 'no status'})`;
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw e;
        }

        const parsedMpd = mpdParser.parse(mpdRes.data, { manifestUri: mpdUrl });

        const availablePlaylists = (parsedMpd.playlists as any[]).sort((a, b) => (b.attributes.RESOLUTION?.height || 0) - (a.attributes.RESOLUTION?.height || 0));
        log(lid, 'MPD', 'Available resolutions', { resolutions: availablePlaylists.map(p => p.attributes.RESOLUTION?.height) });

        let videoPlaylist = availablePlaylists.find(p => p.attributes.RESOLUTION?.height === this.preferredResolution);
        if (!videoPlaylist) {
            videoPlaylist = availablePlaylists.find(p => p.attributes.RESOLUTION?.height < this.preferredResolution) || availablePlaylists[availablePlaylists.length - 1];
        }
        if (!videoPlaylist) {
            const errMsg = 'No video playlist found in MPD';
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw new Error(errMsg);
        }
        const vRes = videoPlaylist.attributes.RESOLUTION?.height.toString() || 'unknown';

        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        const signature = signedUrl;

        const psshMatch = mpdRes.data.match(/<cenc:pssh>(.*?)<\/cenc:pssh>/);
        const pssh = psshMatch ? psshMatch[1] : null;
        if (!pssh) {
            const errMsg = 'PSSH not found in MPD';
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw new Error(errMsg);
        }
        log(lid, 'DRM', 'PSSH extracted', { psshLength: pssh.length });

        log(lid, 'CDRM', `Requesting decryption key from ${this.cdrMUrl}`, { pssh: pssh.substring(0, 50) + '...' });
        let decryptRes;
        try {
            decryptRes = await pRetry(async () => {
                return axios.post(this.cdrMUrl, {
                    pssh: pssh,
                    licurl: drmDetails.licenseUrl,
                    headers: JSON.stringify({
                        'authorization': this.token,
                        'pallycon-customdata-v2': drmDetails.licenseToken,
                        ...this.headers
                    }),
                    device: 'default'
                }, {
                    timeout: 60000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }, {
                retries: 3,
                minTimeout: 5000,
                factor: 2,
                onFailedAttempt: (error: any) => {
                    log(lid, 'CDRM_RETRY', `Retry ${error.attemptNumber}/3: ${error.message}`, {
                        code: error.code,
                        status: error.response?.status
                    });
                }
            });
            log(lid, 'CDRM', 'CDRM response', { status: decryptRes.data?.status, message: decryptRes.data?.message?.substring(0, 100) });
        } catch (e: any) {
            const errMsg = `CDRM API failed after retries: ${e.message} (code: ${e.code || 'no code'}, status: ${e.response?.status || 'no status'})`;
            log(lid, 'ERROR', errMsg);
            log(lid, 'ERROR', 'CDRM error details', {
                status: e.response?.status,
                statusText: e.response?.statusText,
                data: JSON.stringify(e.response?.data)?.substring(0, 500),
                code: e.code,
                name: e.name
            });
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw e;
        }

        if (decryptRes.data.status !== 'success') {
            const errMsg = `CDRM returned failure: ${decryptRes.data.message}`;
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw new Error(errMsg);
        }
        const key = decryptRes.data.message.split(':')[1];
        log(lid, 'DRM', 'Key obtained successfully', { keyLength: key?.length });

        await fs.ensureDir(topicDir);
        const tempDir = path.join(topicDir, `temp_${lecture.id}`);
        await fs.ensureDir(tempDir);

        const prepareChunks = (type: string, res: string, playlist: any) => {
            const segments = playlist.segments;
            this.db.transaction(() => {
                this.db.run('INSERT OR IGNORE INTO chunks (lecture_id, type, resolution, segment_index, status) VALUES (?, ?, ?, ?, ?)', [lecture.id, type, res, -1, 'PENDING']);
                for (let i = 0; i < segments.length; i++) {
                    this.db.run('INSERT OR IGNORE INTO chunks (lecture_id, type, resolution, segment_index, status) VALUES (?, ?, ?, ?, ?)', [lecture.id, type, res, i, 'PENDING']);
                }
            })();
        };

        prepareChunks('v', vRes, videoPlaylist);

        let audioPlaylist: any = null;
        const audioGroup = parsedMpd.mediaGroups.AUDIO;
        if (audioGroup) {
            const group = Object.values(audioGroup)[0] as any;
            const topLevelPlaylist = Object.values(group)[0] as any;
            if (topLevelPlaylist && topLevelPlaylist.playlists && topLevelPlaylist.playlists[0]) {
                audioPlaylist = topLevelPlaylist.playlists[0];
                prepareChunks('a', 'audio', audioPlaylist);
            }
        }

        const chunkQueue = new PQueue({ concurrency: this.chunkConcurrency });

        const downloadChunkTask = (type: string, res: string, i: number, segment: any) => () => pRetry(async () => {
            // Check storage before each chunk download
            await this.checkAndPauseForStorage();

            const row = this.db.query('SELECT status FROM chunks WHERE lecture_id = ? AND type = ? AND resolution = ? AND segment_index = ?').get(lecture.id, type, res, i) as any;
            if (row.status !== 'COMPLETED') {
                const chunkUrl = i === -1 ? (baseUrl + segment.map.uri + signature) : (baseUrl + segment.uri + signature);
                const chunkName = i === -1 ? `${type}_${res}_init.mp4` : `${type}_${res}_chunk_${i}.m4s`;
                const chunkPath = path.join(tempDir, chunkName);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000);

                try {
                    const resp = await axios.get(chunkUrl, {
                        responseType: 'arraybuffer',
                        headers: this.headers,
                        httpsAgent: this.agent,
                        signal: controller.signal
                    });
                    await fs.writeFile(chunkPath, Buffer.from(resp.data));
                    this.db.run('UPDATE chunks SET status = "COMPLETED", local_path = ?, error_message = NULL WHERE lecture_id = ? AND type = ? AND resolution = ? AND segment_index = ?', [chunkPath, lecture.id, type, res, i]);
                } catch (e: any) {
                    const errMsg = `Chunk download failed: ${e.message}`;
                    log(lid, 'CHUNK_ERR', errMsg, { type, res, index: i, url: chunkUrl.substring(0, 100) });
                    this.db.run('UPDATE chunks SET error_message = ? WHERE lecture_id = ? AND type = ? AND resolution = ? AND segment_index = ?', [e.message, lecture.id, type, res, i]);
                    throw e;
                } finally {
                    clearTimeout(timeoutId);
                }
            }
        }, {
            retries: 5,
            minTimeout: 2000,
            factor: 2,
            onFailedAttempt: (error: any) => {
                log(lid, 'CHUNK_RETRY', `Retry ${error.attemptNumber}/5: ${error.message}`, { type, res, index: i });
            }
        });

        const vTasks = [downloadChunkTask('v', vRes, -1, videoPlaylist.segments[0])];
        videoPlaylist.segments.forEach((s: any, i: number) => vTasks.push(downloadChunkTask('v', vRes, i, s)));

        const aTasks: any[] = [];
        if (audioPlaylist) {
            aTasks.push(downloadChunkTask('a', 'audio', -1, audioPlaylist.segments[0]));
            audioPlaylist.segments.forEach((s: any, i: number) => aTasks.push(downloadChunkTask('a', 'audio', i, s)));
        }

        try {
            await chunkQueue.addAll([...vTasks, ...aTasks]);
        } catch (e) {
            const stats = this.db.query('SELECT status, COUNT(*) as count FROM chunks WHERE lecture_id = ? GROUP BY status').all(lecture.id) as any[];
            const completed = stats.find(s => s.status === 'COMPLETED')?.count || 0;
            const total = (vTasks.length + aTasks.length);
            if (completed / total >= 0.99) {
                this.db.run('UPDATE lectures SET error_message = ? WHERE id = ?', [`Force Proceed (~${(completed / total * 100).toFixed(1)}% chunks)`, lecture.id]);
            } else {
                throw e;
            }
        }

        // Merge and Decrypt
        const mergeStream = async (type: string, res: string, segments: any[]) => {
            const combinedFile = path.join(tempDir, `${type}_${res}_combined.mp4`);
            const writeStream = fs.createWriteStream(combinedFile);
            const chunkList = [path.join(tempDir, `${type}_${res}_init.mp4`)];
            for (let i = 0; i < segments.length; i++) {
                const f = path.join(tempDir, `${type}_${res}_chunk_${i}.m4s`);
                if (await fs.pathExists(f)) chunkList.push(f);
            }
            for (const f of chunkList) {
                const readStream = fs.createReadStream(f);
                await new Promise((resolve, reject) => {
                    readStream.pipe(writeStream, { end: false });
                    readStream.on('end', resolve);
                    readStream.on('error', reject);
                });
            }
            writeStream.end();
            await new Promise(r => writeStream.on('finish', r));
            return combinedFile;
        };

        const vCombined = await mergeStream('v', vRes, videoPlaylist.segments);
        let aCombined = '';
        if (audioPlaylist) {
            aCombined = await mergeStream('a', 'audio', audioPlaylist.segments);
        }

        const vDecrypted = path.join(tempDir, 'v_decrypted.mp4');
        const aDecrypted = path.join(tempDir, 'a_decrypted.mp4');

        log(lid, 'FFMPEG', 'Decrypting video', { input: vCombined, output: vDecrypted });
        let ffmpegResult;
        try {
            ffmpegResult = execSync(`ffmpeg -y -decryption_key ${key} -i "${vCombined}" -codec copy "${vDecrypted}" 2>&1`, {
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: 300000
            });
        } catch (e: any) {
            const errMsg = `Video decryption ffmpeg failed: ${e.message}\nOutput: ${e.stdout?.toString()?.substring(0, 500)}\nError: ${e.stderr?.toString()?.substring(0, 500)}`;
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw new Error(errMsg);
        }
        if (!await fs.pathExists(vDecrypted)) {
            const errMsg = 'Video decrypted file not created';
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw new Error(errMsg);
        }

        if (audioPlaylist) {
            log(lid, 'FFMPEG', 'Decrypting audio', { input: aCombined, output: aDecrypted });
            try {
                ffmpegResult = execSync(`ffmpeg -y -decryption_key ${key} -i "${aCombined}" -codec copy "${aDecrypted}" 2>&1`, {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 300000
                });
            } catch (e: any) {
                const errMsg = `Audio decryption ffmpeg failed: ${e.message}\nOutput: ${e.stdout?.toString()?.substring(0, 500)}\nError: ${e.stderr?.toString()?.substring(0, 500)}`;
                log(lid, 'ERROR', errMsg);
                this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
                throw new Error(errMsg);
            }
            log(lid, 'FFMPEG', 'Merging video + audio', { video: vDecrypted, audio: aDecrypted, output: finalPath });
            try {
                ffmpegResult = execSync(`ffmpeg -y -i "${vDecrypted}" -i "${aDecrypted}" -codec copy "${finalPath}" 2>&1`, {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 300000
                });
            } catch (e: any) {
                const errMsg = `Merge ffmpeg failed: ${e.message}\nOutput: ${e.stdout?.toString()?.substring(0, 500)}\nError: ${e.stderr?.toString()?.substring(0, 500)}`;
                log(lid, 'ERROR', errMsg);
                this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
                throw new Error(errMsg);
            }
        } else {
            log(lid, 'FFMPEG', 'Moving decrypted video', { input: vDecrypted, output: finalPath });
            try {
                ffmpegResult = execSync(`ffmpeg -y -i "${vDecrypted}" -codec copy "${finalPath}" 2>&1`, {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 300000
                });
            } catch (e: any) {
                const errMsg = `Final ffmpeg failed: ${e.message}\nOutput: ${e.stdout?.toString()?.substring(0, 500)}\nError: ${e.stderr?.toString()?.substring(0, 500)}`;
                log(lid, 'ERROR', errMsg);
                this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
                throw new Error(errMsg);
            }
        }

        if (!await fs.pathExists(finalPath)) {
            const errMsg = 'Final file not created after ffmpeg';
            log(lid, 'ERROR', errMsg);
            this.db.run('UPDATE lectures SET status = "FAILED", error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [errMsg, lecture.id]);
            throw new Error(errMsg);
        }

        await fs.remove(tempDir);
        log(lid, 'DONE', 'Download completed successfully');
        this.db.run('UPDATE lectures SET status = "COMPLETED", local_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [finalPath, lecture.id]);
    }
}
