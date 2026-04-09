import { Database } from 'bun:sqlite';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

function formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let size = bytes;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export class Dashboard {
    private db: Database;
    private interval: any;
    private downloadDir: string = 'downloads';
    private storageThreshold: number = 95;
    private isPaused: boolean = false;

    constructor(db: Database) {
        this.db = db;
    }

    setDownloadDir(dir: string) {
        this.downloadDir = dir;
    }

    setStorageThreshold(threshold: number) {
        this.storageThreshold = threshold;
    }

    setPaused(paused: boolean) {
        this.isPaused = paused;
    }

    private getStorageInfo(): { percent: number; free: number; total: number } {
        const dir = path.resolve(this.downloadDir);
        if (!fs.existsSync(dir)) {
            fs.ensureDirSync(dir);
        }

        try {
            const output = execSync(`df -B1 "${dir}"`, { encoding: 'utf8' });
            const lines = output.trim().split('\n');
            if (lines.length >= 2) {
                const line = lines[1] ?? '';
                if (line) {
                    const line = lines[1] ?? '';
                    const parts = line.split(/\s+/);
                    const total = parseInt(parts[1] ?? '0', 10) || 0;
                    const used = parseInt(parts[2] ?? '0', 10) || 0;
                    const free = parseInt(parts[3] ?? '0', 10) || 0;
                    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
                    return { percent, free, total };
                }
            }
        } catch (e) {
            // Ignore
        }
        return { percent: 0, free: 0, total: 0 };
    }

    start() {
        this.render();
        this.interval = setInterval(() => {
            try {
                this.render();
            } catch (e) {
                // Ignore busy errors in dashboard
            }
        }, 2000);
    }

    stop() {
        if (this.interval) clearInterval(this.interval);
        try {
            this.render();
        } catch (e) { }
        console.log('\nDownload complete or paused.');
    }

    private render() {
        const stats = this.db.query('SELECT status, COUNT(*) as count FROM lectures GROUP BY status').all() as any[];
        const totalRow = this.db.query('SELECT COUNT(*) as count FROM lectures').get() as any;
        const total = totalRow ? totalRow.count : 0;
        const processing = this.db.query('SELECT id, name FROM lectures WHERE status = "PROCESSING"').all() as any[];

        // Clear screen and move to top
        process.stdout.write('\x1Bc');

        console.log('=== Batch Video Downloader Dashboard ===\n');

        // Storage Info
        const storage = this.getStorageInfo();
        const storageColor = storage.percent >= this.storageThreshold ? '🔴' : (storage.percent >= 80 ? '🟡' : '🟢');
        console.log(`${storageColor} Storage: ${storage.percent}% used | ${formatBytes(storage.free)} free of ${formatBytes(storage.total)}`);
        if (this.isPaused) {
            console.log(`   ⏸️  PAUSED - Storage threshold hit (${this.storageThreshold}%). Free up space to resume.\n`);
        } else {
            console.log();
        }

        // Overall Progress
        const completed = stats.find(s => s.status === 'COMPLETED')?.count || 0;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        const barWidth = 50;
        const filled = Math.round((progress / 100) * barWidth);
        const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

        console.log(`Overall: [${bar}] ${progress.toFixed(1)}% (${completed}/${total})`);
        console.log(`Status: ${stats.map(s => `${s.status}: ${s.count}`).join(', ')}\n`);

        if (processing.length > 0) {
            console.log('--- Active Downloads ---');
            for (const lecture of processing) {
                const chunkStats = this.db.query(`
                    SELECT 
                        type, 
                        resolution,
                        COUNT(*) as total,
                        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
                    FROM chunks 
                    WHERE lecture_id = ? 
                    GROUP BY type, resolution
                `).all(lecture.id) as any[];

                let progressLine = `➔ ${lecture.name.substring(0, 70)}`;
                if (lecture.error_message) {
                    progressLine += ` (Error: ${lecture.error_message.substring(0, 30)}...)`;
                }
                console.log(progressLine);

                for (const cs of chunkStats) {
                    const perc = cs.total > 0 ? (cs.completed / cs.total) * 100 : 0;
                    const cBarWidth = 20;
                    const cFilled = Math.round((perc / 100) * cBarWidth);
                    const cBar = '■'.repeat(cFilled) + '□'.repeat(cBarWidth - cFilled);
                    const typeLabel = cs.type === 'v' ? `Video (${cs.resolution}p)` : `Audio`;
                    console.log(`   └─ ${typeLabel.padEnd(15)}: [${cBar}] ${perc.toFixed(1)}% (${cs.completed}/${cs.total})`);
                }
            }
        } else {
            console.log('No active downloads.');
        }

        console.log('\n(Press Ctrl+C to stop)');
    }
}
