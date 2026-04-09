import { Command } from 'commander';
import { Database } from 'bun:sqlite';
import { Discovery } from './lib/discovery';
import { Downloader } from './lib/downloader';
import path from 'path';
import fs from 'fs-extra';
import * as dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program
    .name('pwdl')
    .description('PhysicsWallah Batch Downloader')
    .version('1.0.0');

const dbPath = path.join(process.cwd(), 'batch_progress.db');
const db = new Database(dbPath);

// Initialize DB schema
const schemaFile = path.join(process.cwd(), 'src/db/schema.sql');
if (fs.existsSync(schemaFile)) {
    db.run(fs.readFileSync(schemaFile, 'utf8'));
}

program
    .command('discover')
    .description('Discover all subjects, topics, and lectures in the batch')
    .action(async () => {
        const batchId = process.env.BATCH_ID;
        const token = process.env.TOKEN;

        if (!batchId || !token) {
            console.error('Please set BATCH_ID and TOKEN in your .env file');
            process.exit(1);
        }

        console.log('--- Starting Discovery Phase ---');
        const discovery = new Discovery(db, token, batchId);
        await discovery.discoverAll();

        const stats = db.query('SELECT status, COUNT(*) as count FROM lectures GROUP BY status').all() as any[];
        console.log('\nDiscovery Complete. Batch Structure:');
        console.table(stats);
    });

program
    .command('download')
    .description('Download all pending lectures')
    .option('-c, --concurrency <number>', 'Number of concurrent lectures', process.env.CONCURRENCY || '1')
    .option('-C, --chunk-concurrency <number>', 'Number of concurrent chunks per lecture', process.env.CHUNK_CONCURRENCY || '5')
    .option('-l, --limit <number>', 'Limit the number of lectures to download')
    .option('-i, --id <string>', 'Download a specific lecture by ID')
    .option('-t, --storage-threshold <number>', 'Storage threshold percentage to pause at', process.env.STORAGE_THRESHOLD || '95')
    .action(async (options) => {
        const batchId = process.env.BATCH_ID;
        const token = process.env.TOKEN;
        const downloadDir = process.env.DOWNLOAD_DIR || 'downloads';
        const preferredRes = parseInt(process.env.PREFERRED_RESOLUTION || '720');
        const cdrMUrl = process.env.CDRM_URL || 'https://cdrm-project.com/api/decrypt';

        if (!batchId || !token) {
            console.error('Please set BATCH_ID and TOKEN in your .env file');
            process.exit(1);
        }

        console.log(`--- Starting Download Phase (L-Concurrency: ${options.concurrency}, C-Concurrency: ${options.chunkConcurrency}, Res: ${preferredRes}p) ---`);
        console.log(`--- CDRM endpoint: ${cdrMUrl} ---`);
        console.log(`--- Storage threshold: ${options.storageThreshold}% ---\n`);
        
        const downloader = new Downloader(
            db,
            token,
            batchId,
            parseInt(options.concurrency),
            parseInt(options.chunkConcurrency),
            downloadDir,
            preferredRes,
            cdrMUrl,
            parseInt(options.storageThreshold)
        );

        const { Dashboard } = require('./lib/dashboard');
        const dashboard = new Dashboard(db);
        dashboard.setDownloadDir(downloadDir);
        dashboard.setStorageThreshold(parseInt(options.storageThreshold));
        dashboard.start();

        // Sync paused state to dashboard every 2 seconds
        const syncInterval = setInterval(() => {
            try {
                dashboard.setPaused(downloader.isStoragePaused());
            } catch (e) {}
        }, 2000);

        await downloader.downloadAll(
            options.limit ? parseInt(options.limit) : undefined,
            options.id
        );
        
        clearInterval(syncInterval);
        dashboard.stop();
        console.log('Download phase finished.');
    });

program.parse();
