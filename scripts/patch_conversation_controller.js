const fs = require('fs');

const targetFile = '/www/wwwroot/api.siegfriedoutreach.com/controllers/conversation.controller.js';
let content = fs.readFileSync(targetFile, 'utf8');

// Backup
fs.writeFileSync(targetFile + '.bak-' + Date.now(), content);

// 1. Refine targetPlatform logic to only match social channels and avoid widget chats
const oldPlatformLogic = `    const targetPlatform = platform || source || channel;
    if (targetPlatform && targetPlatform.toLowerCase() !== 'all' && targetPlatform.toLowerCase() !== 'all platforms') {
      const p = targetPlatform.toLowerCase();
      let pMatches = [p];
      if (p === 'whatsapp') {
        pMatches = ['whatsapp', 'whatsapp_meta'];
      } else if (p === 'facebook' || p === 'messenger') {
        pMatches = ['facebook', 'messenger'];
      } else if (p === 'instagram') {
        pMatches = ['instagram'];
      }
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { 'metadata.source': { $in: pMatches } },
          { channel: { $in: pMatches } },
          { platform: { $in: pMatches } }
        ]
      });
    }`;

const newPlatformLogic = `    const targetPlatform = platform || source || channel;
    const validSocialChannels = [
      'facebook', 'messenger', 'instagram', 'whatsapp', 'whatsapp_meta',
      'tiktok', 'telegram', 'email', 'facebook_comment', 'instagram_comment'
    ];

    if (targetPlatform && targetPlatform.toLowerCase() !== 'all' && targetPlatform.toLowerCase() !== 'all platforms') {
      const p = targetPlatform.toLowerCase();
      let pMatches = [p];
      if (p === 'whatsapp') {
        pMatches = ['whatsapp', 'whatsapp_meta'];
      } else if (p === 'facebook' || p === 'messenger') {
        pMatches = ['facebook', 'messenger'];
      } else if (p === 'instagram') {
        pMatches = ['instagram'];
      }
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { 'metadata.source': { $in: pMatches } },
          { channel: { $in: pMatches } },
          { platform: { $in: pMatches } }
        ]
      });
    } else {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { channel: { $in: validSocialChannels } },
          { platform: { $in: validSocialChannels } },
          { 'metadata.source': { $in: validSocialChannels } }
        ]
      });
    }`;

if (content.includes(oldPlatformLogic)) {
  content = content.replace(oldPlatformLogic, newPlatformLogic);
  console.log('Platform filter logic replaced successfully.');
} else {
  console.log('oldPlatformLogic not matched exactly, checking variants.');
}

// 2. Remove default fake tags and hardcoded Alex Morgan
const oldDefaults = `      const rawChannel = conv.metadata?.source || conv.channel || 'whatsapp';
      let cleanChannel = rawChannel.toLowerCase();
      if (cleanChannel.includes('whatsapp')) cleanChannel = 'whatsapp';
      else if (cleanChannel.includes('telegram')) cleanChannel = 'telegram';
      else if (cleanChannel === 'instagram_comment') cleanChannel = 'instagram_comment';
      else if (cleanChannel.includes('instagram')) cleanChannel = 'instagram';
      else if (cleanChannel === 'facebook_comment') cleanChannel = 'facebook_comment';
      else if (cleanChannel.includes('facebook') || cleanChannel.includes('messenger')) cleanChannel = 'facebook';
      else if (cleanChannel.includes('email') || cleanChannel.includes('mail')) cleanChannel = 'email';
      else if (cleanChannel.includes('tiktok')) cleanChannel = 'tiktok';

      const normStatus = (conv.status === 'active' || conv.status === 'open') ? 'open' : (conv.status || 'open');

      const defaultTags = cleanChannel === 'whatsapp' ? ['VIP', 'Enterprise'] :
        cleanChannel === 'telegram' ? ['Telegram Bot', 'Engineering Lead'] :
        cleanChannel === 'instagram' ? ['Instagram Lead', 'Product Hunt Launch'] :
        cleanChannel === 'email' ? ['Two-Way Email', 'Enterprise Logistics'] :
        cleanChannel === 'facebook' ? ['Facebook Messenger', 'Agency Partner'] :
        ['Lead', 'Enterprise'];`;

const newDefaults = `      const rawChannel = conv.channel || conv.metadata?.source || conv.platform || 'social';
      let cleanChannel = rawChannel.toLowerCase();
      if (cleanChannel.includes('whatsapp')) cleanChannel = 'whatsapp';
      else if (cleanChannel.includes('telegram')) cleanChannel = 'telegram';
      else if (cleanChannel === 'instagram_comment') cleanChannel = 'instagram_comment';
      else if (cleanChannel.includes('instagram')) cleanChannel = 'instagram';
      else if (cleanChannel === 'facebook_comment') cleanChannel = 'facebook_comment';
      else if (cleanChannel.includes('facebook') || cleanChannel.includes('messenger')) cleanChannel = 'facebook';
      else if (cleanChannel.includes('email') || cleanChannel.includes('mail')) cleanChannel = 'email';
      else if (cleanChannel.includes('tiktok')) cleanChannel = 'tiktok';

      const normStatus = (conv.status === 'active' || conv.status === 'open') ? 'open' : (conv.status || 'open');

      const defaultTags = conv.metadata?.tags || [];`;

if (content.includes(oldDefaults)) {
  content = content.replace(oldDefaults, newDefaults);
  console.log('Channel fallback and fake tags replaced successfully.');
}

// 3. Replace hardcoded assignee
content = content.replace(
  "assignee: conv.metadata?.assignee || 'Alex Morgan',",
  "assignee: conv.metadata?.assignee || conv.assignedStaff || conv.assignedAgent || 'Unassigned',"
);

content = content.replace(
  "teamRouter: conv.metadata?.teamRouter || 'Enterprise Sales & Growth',",
  "teamRouter: conv.metadata?.teamRouter || 'Social Inbox',"
);

fs.writeFileSync(targetFile, content);
console.log('Updated conversation.controller.js written successfully.');
