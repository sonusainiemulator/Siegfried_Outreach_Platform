const mongoose = require('mongoose');
require('dotenv').config({ path: '/www/wwwroot/api.siegfriedoutreach.com/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('conversations');

  const all = await col.find({}).toArray();
  console.log('Total count in conversations col:', all.length);

  const breakdown = {};
  for (const c of all) {
    const jsonStr = JSON.stringify(c);
    let category = 'Other';
    if (c.metadata?.userAgent?.includes('curl') || jsonStr.includes('RESTORE TEST') || jsonStr.includes('OK1') || jsonStr.includes('OK2') || jsonStr.includes('V41FLASH') || jsonStr.includes('FREE_OK')) {
      category = 'Curl / Automation Tests';
    } else if (jsonStr.includes('WhatsOmni') || jsonStr.includes('Ultra-Glide') || jsonStr.includes('Apex') || jsonStr.includes('Air Cargo') || jsonStr.includes('Product Hunt')) {
      category = 'WhatsOmni / Mock Seed Conversations';
    } else if (jsonStr.includes('Summer 2026 Collection Launch') || jsonStr.includes('sample1')) {
      category = 'Sample Comment Tests';
    } else if (c.metadata?.userAgent?.includes('Mozilla') && (c.channel === 'widget' || !c.channel)) {
      category = 'Website Chatbot Widget Chats';
    } else if (c.channel) {
      category = `Social DM: ${c.channel}`;
    }
    breakdown[category] = (breakdown[category] || 0) + 1;
  }

  console.log('Breakdown by category:', breakdown);

  // Check what listBroadcastConversations returns right now!
  const query = {
    channel: { $ne: 'widget' }
  };
  const broadcastList = await col.find(query).toArray();
  console.log('\nMatches in broadcast inbox query:', broadcastList.length);

  const broadcastBreakdown = {};
  for (const c of broadcastList) {
    const jsonStr = JSON.stringify(c);
    let category = 'Real / Unclassified';
    if (c.metadata?.userAgent?.includes('curl') || jsonStr.includes('RESTORE TEST') || jsonStr.includes('OK1') || jsonStr.includes('OK2') || jsonStr.includes('V41FLASH') || jsonStr.includes('FREE_OK')) {
      category = 'Curl / Automation Tests';
    } else if (jsonStr.includes('WhatsOmni') || jsonStr.includes('Ultra-Glide') || jsonStr.includes('Apex') || jsonStr.includes('Air Cargo') || jsonStr.includes('Product Hunt')) {
      category = 'WhatsOmni / Mock Seed Conversations';
    } else if (jsonStr.includes('Summer 2026 Collection Launch') || jsonStr.includes('sample1')) {
      category = 'Sample Comment Tests';
    } else if (!c.channel && !c.metadata?.source) {
      category = 'Widget / No Channel (Empty)';
    }
    broadcastBreakdown[category] = (broadcastBreakdown[category] || 0) + 1;
  }
  console.log('Broadcast inbox breakdown:', broadcastBreakdown);

  console.log('\n--- Unclassified / Other Conversations ---');
  for (const c of all) {
    const jsonStr = JSON.stringify(c);
    const isMock = c.metadata?.userAgent?.includes('curl') || 
                   jsonStr.includes('RESTORE TEST') || 
                   jsonStr.includes('OK1') || 
                   jsonStr.includes('OK2') || 
                   jsonStr.includes('V41FLASH') || 
                   jsonStr.includes('FREE_OK') || 
                   jsonStr.includes('WhatsOmni') || 
                   jsonStr.includes('Ultra-Glide') || 
                   jsonStr.includes('Apex') || 
                   jsonStr.includes('Air Cargo') || 
                   jsonStr.includes('Product Hunt') || 
                   jsonStr.includes('Summer 2026 Collection Launch');
    if (!isMock) {
      console.log('ID:', c._id, '| Channel:', c.channel, '| Source:', c.metadata?.source, '| Contact:', c.contactName || c.participantName, '| Msgs:', c.messages?.length);
      const last = c.messages?.[c.messages.length - 1];
      console.log('  Last Msg:', (last?.content || last?.text || '').slice(0, 80));
    }
  }

  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
