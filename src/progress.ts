import { Database } from 'bun:sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'batch_progress.db');
const db = new Database(dbPath);

function showProgress() {
    const totalLectures = db.query('SELECT COUNT(*) as count FROM lectures').get() as any;
    const stats = db.query('SELECT status, COUNT(*) as count FROM lectures GROUP BY status').all() as any[];
    
    console.log('\n--- Batch Download Progress ---');
    console.log(`Total Lectures: ${totalLectures.count}`);
    
    const tableData = stats.map(s => ({
        Status: s.status,
        Count: s.count,
        Percentage: ((s.count / totalLectures.count) * 100).toFixed(2) + '%'
    }));
    
    console.table(tableData);

    const completed = stats.find(s => s.status === 'COMPLETED')?.count || 0;
    const progress = (completed / totalLectures.count) * 100;
    
    // Simple ASCII progress bar
    const barWidth = 40;
    const filledWidth = Math.round((progress / 100) * barWidth);
    const bar = '[' + '='.repeat(filledWidth) + ' '.repeat(barWidth - filledWidth) + ']';
    
    console.log(`\nOverall Progress: ${bar} ${progress.toFixed(2)}%\n`);

    // Show recent activity
    const recent = db.query('SELECT name, status, updated_at FROM lectures WHERE status != "PENDING" ORDER BY updated_at DESC LIMIT 5').all() as any[];
    if (recent.length > 0) {
        console.log('Recent Activity:');
        recent.forEach(r => console.log(`- ${r.name}: ${r.status} (${r.updated_at})`));
    }
}

showProgress();
setInterval(showProgress, 30000); // Update every 30 seconds
