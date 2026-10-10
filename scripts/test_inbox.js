const mongoose = require('mongoose');
require('dotenv').config({ path: '/www/wwwroot/api.siegfriedoutreach.com/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('conversations');

  const validSocialChannels = [
    'facebook', 'messenger', 'instagram', 'whatsapp', 'whatsapp_meta',
    'tiktok', 'telegram', 'email', 'facebook_comment', 'instagram_comment'
  ];

  const filter = {
    $or: [
      { channel: { $in: validSocialChannels } },
      { platform: { $in: validSocialChannels } },
      { 'metadata.source': { $in: validSocialChannels } }
    ]
  };

  const results = await col.find(filter).toArray();
  console.log('Social Broadcast Conversations Count:', results.length);
  results.forEach(r => {
    console.log('ID:', r._id, '| Channel:', r.channel || r.metadata?.source, '| Last Msg:', r.messages?.[r.messages.length - 1]?.content);
  });
  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
