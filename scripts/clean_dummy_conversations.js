const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '/www/wwwroot/api.siegfriedoutreach.com/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('conversations');

  const all = await col.find({}).toArray();

  const dummyIds = [];
  const dummyDocs = [];

  for (const c of all) {
    const jsonStr = JSON.stringify(c);
    const isCurl = c.metadata?.userAgent?.includes('curl');
    const isTestMsg = jsonStr.includes('RESTORE TEST') || 
                      jsonStr.includes('OK1') || 
                      jsonStr.includes('OK2') || 
                      jsonStr.includes('V41FLASH') || 
                      jsonStr.includes('FREE_OK') || 
                      jsonStr.includes('FINAL_OK') || 
                      jsonStr.includes('PAID_FALLBACK_OK') || 
                      jsonStr.includes('FREE3_OK');
    const isMockSeed = jsonStr.includes('WhatsOmni') || 
                       jsonStr.includes('Ultra-Glide') || 
                       jsonStr.includes('Apex') || 
                       jsonStr.includes('Air Cargo') || 
                       jsonStr.includes('Product Hunt') || 
                       jsonStr.includes('Thank you Alex! Please send over the master service agreement') ||
                       jsonStr.includes('Summer 2026 Collection Launch') ||
                       jsonStr.includes('sample1');

    if (isCurl || isTestMsg || isMockSeed) {
      dummyIds.push(c._id);
      dummyDocs.push(c);
    }
  }

  console.log('Identified dummy conversations:', dummyIds.length);

  // Backup to scripts/backups/
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupFilePath = path.join(backupDir, `dummy_conversations_backup_${Date.now()}.json`);
  fs.writeFileSync(backupFilePath, JSON.stringify(dummyDocs, null, 2));
  console.log(`Backup saved to ${backupFilePath}`);

  // Delete
  const delRes = await col.deleteMany({ _id: { $in: dummyIds } });
  console.log('Successfully deleted count:', delRes.deletedCount);

  const remaining = await col.countDocuments({});
  console.log('Remaining conversations in database:', remaining);

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
