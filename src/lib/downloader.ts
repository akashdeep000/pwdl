import axios from 'axios';
import * as mpdParser from 'mpd-parser';
import { Database } from 'bun:sqlite';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import https from 'https';

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

    constructor(db: Database, token: string, batchId: string, lectureConcurrency: number = 3, chunkConcurrency: number = 5, downloadDir: string = 'downloads', preferredRes: number = 720) {
        this.db = db;
        this.token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        this.batchId = batchId;
        this.downloadDir = path.resolve(downloadDir);
        this.lectureQueue = new PQueue({ concurrency: lectureConcurrency });
        this.chunkConcurrency = chunkConcurrency;
        this.preferredResolution = preferredRes;
        
        // Persistent agent for better performance at high concurrency
        this.agent = new https.Agent({
            keepAlive: true,
            maxSockets: 64,
            timeout: 60000
        });

        this.headers = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': this.token,
            'cache-control': 'no-cache',
            'client-id': '5eb393ee95fab7468a79d189',
            'client-type': 'WEB',
            'client-version': '4.5.3',
            'randomid': '948f0288-e2ea-4cd4-80eb-56503c8a2c10',
            'referer': 'https://www.pw.live/',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'x-sdk-version': '0.0.16'
        };
    }

    async downloadAll(limit?: number, specificId?: string) {
        let query = 'SELECT l.*, t.name as topic_name, s.name as subject_name FROM lectures l JOIN topics t ON l.topic_id = t.id JOIN subjects s ON t.subject_id = s.id WHERE l.status != "COMPLETED"';
        if (specificId) {
            query += ` AND l.id = "${specificId}"`;
        } else if (limit) {
            query += ` LIMIT ${limit}`;
        }
        const lectures = this.db.query(query).all() as any[];

        const tasks = lectures.map(lecture => () => pRetry(() => this.downloadLecture(lecture), { 
            retries: 3,
            onFailedAttempt: (error: any) => {
                this.db.run('UPDATE lectures SET error_message = ? WHERE id = ?', [error.message, lecture.id]);
            }
        }));

        await this.lectureQueue.addAll(tasks);
    }

    private async downloadLecture(lecture: any) {
        const topicDir = path.join(this.downloadDir, lecture.subject_name.replace(/[/\\?%*:|"<>]/g, '_'), lecture.topic_name.replace(/[/\\?%*:|"<>]/g, '_'));
        const finalPath = path.join(topicDir, `${lecture.name.replace(/[/\\?%*:|"<>]/g, '_')}.mp4`);

        if (await fs.pathExists(finalPath)) {
            this.db.run('UPDATE lectures SET status = "COMPLETED", local_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [finalPath, lecture.id]);
            return;
        }

        this.db.run('UPDATE lectures SET status = "PROCESSING", error_message = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [lecture.id]);

        const urlDetailsRes = await axios.get(`https://api.penpencil.co/v1/videos/video-url-details?type=BATCHES&videoContainerType=DASH&reqType=query&childId=${lecture.id}&parentId=${this.batchId}&clientVersion=201`, { headers: this.headers, httpsAgent: this.agent });
        if (!urlDetailsRes.data.data || !urlDetailsRes.data.data.url) {
            this.db.run('UPDATE lectures SET status = "SKIPPED", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [lecture.id]);
            return;
        }

        const { url, signedUrl, drmDetails } = urlDetailsRes.data.data;
        if (!drmDetails) {
            this.db.run('UPDATE lectures SET status = "SKIPPED", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [lecture.id]);
            return;
        }

        let mpdUrl = url;
        if (signedUrl) {
            mpdUrl = url.includes('?') ? (url + signedUrl.replace('?', '&')) : (url + signedUrl);
        }

        const mpdRes = await axios.get(mpdUrl, { headers: this.headers, httpsAgent: this.agent });
        const parsedMpd = mpdParser.parse(mpdRes.data, { manifestUri: mpdUrl });
        
        const availablePlaylists = (parsedMpd.playlists as any[]).sort((a, b) => (b.attributes.RESOLUTION?.height || 0) - (a.attributes.RESOLUTION?.height || 0));
        let videoPlaylist = availablePlaylists.find(p => p.attributes.RESOLUTION?.height === this.preferredResolution);
        if (!videoPlaylist) {
            videoPlaylist = availablePlaylists.find(p => p.attributes.RESOLUTION?.height < this.preferredResolution) || availablePlaylists[availablePlaylists.length - 1];
        }
        if (!videoPlaylist) throw new Error('No video playlist found');
        const vRes = videoPlaylist.attributes.RESOLUTION?.height.toString() || 'unknown';

        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        const signature = signedUrl;

        const psshMatch = mpdRes.data.match(/<cenc:pssh>(.*?)<\/cenc:pssh>/);
        const pssh = psshMatch ? psshMatch[1] : null;
        if (!pssh) throw new Error('PSSH not found in MPD');

        const decryptRes = await axios.post('https://cdrm-project.com/api/decrypt', {
            pssh: pssh,
            licurl: drmDetails.licenseUrl,
            headers: JSON.stringify({
                'authorization': this.token,
                'pallycon-customdata-v2': drmDetails.licenseToken,
                ...this.headers
            }),
            device: 'default'
        });

        if (decryptRes.data.status !== 'success') throw new Error('Failed to get key: ' + decryptRes.data.message);
        const key = decryptRes.data.message.split(':')[1];

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
             const row = this.db.query('SELECT status FROM chunks WHERE lecture_id = ? AND type = ? AND resolution = ? AND segment_index = ?').get(lecture.id, type, res, i) as any;
             if (row.status !== 'COMPLETED') {
                 const chunkUrl = i === -1 ? (baseUrl + segment.map.uri + signature) : (baseUrl + segment.uri + signature);
                 const chunkName = i === -1 ? `${type}_${res}_init.mp4` : `${type}_${res}_chunk_${i}.m4s`;
                 const chunkPath = path.join(tempDir, chunkName);
                 
                 const controller = new AbortController();
                 const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s hard timeout
                 
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
                     this.db.run('UPDATE chunks SET error_message = ? WHERE lecture_id = ? AND type = ? AND resolution = ? AND segment_index = ?', [e.message, lecture.id, type, res, i]);
                     throw e; 
                 } finally {
                     clearTimeout(timeoutId);
                 }
             }
        }, { 
            retries: 5,
            minTimeout: 2000,
            factor: 2
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
                this.db.run('UPDATE lectures SET error_message = ? WHERE id = ?', [`Force Proceed (~${(completed/total*100).toFixed(1)}% chunks)`, lecture.id]);
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

        execSync(`ffmpeg -y -decryption_key ${key} -i "${vCombined}" -codec copy "${vDecrypted}"`, { stdio: 'ignore' });
        if (audioPlaylist) {
            execSync(`ffmpeg -y -decryption_key ${key} -i "${aCombined}" -codec copy "${aDecrypted}"`, { stdio: 'ignore' });
            execSync(`ffmpeg -y -i "${vDecrypted}" -i "${aDecrypted}" -codec copy "${finalPath}"`, { stdio: 'ignore' });
        } else {
            execSync(`ffmpeg -y -i "${vDecrypted}" -codec copy "${finalPath}"`, { stdio: 'ignore' });
        }

        await fs.remove(tempDir);
        this.db.run('UPDATE lectures SET status = "COMPLETED", local_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [finalPath, lecture.id]);
    }
}
