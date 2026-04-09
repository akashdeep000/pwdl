import axios from 'axios';
import { Database } from 'bun:sqlite';

export class Discovery {
    private db: Database;
    private token: string;
    private batchId: string;
    private headers: any;

    constructor(db: Database, token: string, batchId: string) {
        this.db = db;
        this.token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        this.batchId = batchId;
        this.headers = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': this.token,
            'cache-control': 'no-cache',
            'client-id': '5eb393ee95fab7468a79d189',
            'client-type': 'WEB',
            'client-version': '4.5.3',
            'origin': 'https://www.pw.live',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'randomid': '948f0288-e2ea-4cd4-80eb-56503c8a2c10',
            'referer': 'https://www.pw.live/',
            'sec-ch-ua': '"Chromium";v="141", "Not?A_Brand";v="8"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'x-sdk-version': '0.0.16'
        };
    }

    async discoverAll() {
        console.log(`--- Starting Discovery Phase (V3 API) ---`);
        console.log(`Discovering batch: ${this.batchId}`);
        
        // 1. Fetch Subjects and Batch Info
        const progressRes = await axios.get(`https://api.penpencil.co/uxncc-be-go/stats/v1/batch/${this.batchId}/subject/progress?page=1&limit=50`, { headers: this.headers });
        const subjectIds = progressRes.data.data.map((s: any) => s.subjectId);

        // Map subject IDs to names
        let subjectMap: Record<string, string> = {};
        let batchName = `Batch_${this.batchId}`;
        try {
            const batchRes = await axios.get(`https://api.penpencil.co/batch-service/v2/batches/${this.batchId}`, { headers: this.headers });
            batchName = batchRes.data.data.name;
            batchRes.data.data.subjects.forEach((s: any) => {
                subjectMap[s._id] = s.subjectId.name;
            });
        } catch (e) {}

        this.db.run('INSERT OR IGNORE INTO batches (id, name) VALUES (?, ?)', [this.batchId, batchName]);
        console.log(`[BATCH] ${batchName}`);

        let totalLectures = 0;
        let totalSeconds = 0;

        for (const subjectId of subjectIds) {
            const subjectName = subjectMap[subjectId] || `Subject_${subjectId}`;
            this.db.run('INSERT OR IGNORE INTO subjects (id, batch_id, name) VALUES (?, ?, ?)', [subjectId, this.batchId, subjectName]);
            console.log(`[SUBJECT] ${subjectName}`);

            // 2. Fetch Topics
            const topicsRes = await axios.get(`https://api.penpencil.co/batch-service/v1/batch-tags/${this.batchId}/subject/${subjectId}/topics?page=1&batchTagType=UNITS&limit=50&enabled=true`, { headers: this.headers });
            const topics = topicsRes.data.data;

            for (const topic of topics) {
                const topicId = topic._id;
                const topicName = topic.name;
                this.db.run('INSERT OR IGNORE INTO topics (id, subject_id, name) VALUES (?, ?, ?)', [topicId, subjectId, topicName]);
                console.log(`  [TOPIC] ${topicName}`);

                // ... [V3 Content API logic]
                let skip = 0;
                let hasMore = true;
                while (hasMore) {
                    const contentsUrl = `https://api.penpencil.co/batch-service/v3/batch-subject-schedules/${this.batchId}/subject/${subjectId}/contents?skip=${skip}&limit=50&contentType=LECTURES&tagId=${topicId}`;
                    const contentsRes = await axios.get(contentsUrl, { headers: this.headers });
                    const contentList = contentsRes.data.data;
                    
                    if (!contentList || contentList.length === 0) break;

                    for (const item of contentList) {
                        if (!item.data.isVideoLecture) continue;

                        const lectureId = item._id;
                        const lectureName = item.data.topic;
                        let durationStr = item.data.videoDetails?.duration || "00:00:00";
                        
                        // Parse "HH:MM:SS" to seconds for accumulation
                        const parts = durationStr.split(':').map(Number);
                        if (parts.length === 3) {
                            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                        }

                        this.db.run('INSERT OR IGNORE INTO lectures (id, topic_id, name, duration, status) VALUES (?, ?, ?, ?, ?)', [lectureId, topicId, lectureName, durationStr, 'PENDING']);
                        totalLectures++;
                    }
                    
                    skip += 50;
                    if (contentList.length < 50) hasMore = false;
                }
            }
        }

        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        
        console.log('\n--- Discovery Phase Complete ---');
        console.log(`Total Lectures: ${totalLectures}`);
        console.log(`Total Duration: ${h}:${m}:${s}`);
    }
}
