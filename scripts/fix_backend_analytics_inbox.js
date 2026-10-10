const fs = require('fs');
const path = require('path');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

function backup(filePath) {
  const ts = Date.now();
  const bak = `${filePath}.bak-${ts}`;
  fs.copyFileSync(filePath, bak);
  console.log(`Backed up ${filePath} -> ${bak}`);
}

// 1. Update routes/broadcast-inbox.routes.js
function fixBroadcastInboxRoutes() {
  const file = path.join(BACKEND_DIR, 'routes/broadcast-inbox.routes.js');
  backup(file);
  let content = fs.readFileSync(file, 'utf8');

  // Replace permissions to include Manage Posts
  content = content.replace(
    /router\.get\('\/list', checkAnyPermission\(\[\{ name: 'Manage Conversation', access: 'read' \}\]\)/g,
    "router.get('/list', checkAnyPermission([{ name: 'Manage Conversation', access: 'read' }, { name: 'Manage Posts', access: 'read' }])"
  );
  content = content.replace(
    /router\.get\('\/:conversationId\/history', checkAnyPermission\(\[\{ name: 'Manage Conversation', access: 'read' \}\]\)/g,
    "router.get('/:conversationId/history', checkAnyPermission([{ name: 'Manage Conversation', access: 'read' }, { name: 'Manage Posts', access: 'read' }])"
  );
  content = content.replace(
    /router\.post\('\/:conversationId\/reply', checkDemoMode, uploadFiles\('replies', 'files'\), checkAnyPermission\(\[\{ name: 'Reply Conversation', access: 'write' \}\]\)/g,
    "router.post('/:conversationId/reply', checkDemoMode, uploadFiles('replies', 'files'), checkAnyPermission([{ name: 'Reply Conversation', access: 'write' }, { name: 'Manage Conversation', access: 'write' }, { name: 'Manage Posts', access: 'write' }])"
  );
  content = content.replace(
    /router\.patch\('\/:conversationId\/status', checkDemoMode, checkAnyPermission\(\[\{ name: 'Manage Conversation', access: 'write' \}\]\)/g,
    "router.patch('/:conversationId/status', checkDemoMode, checkAnyPermission([{ name: 'Manage Conversation', access: 'write' }, { name: 'Manage Posts', access: 'write' }])"
  );
  content = content.replace(
    /router\.patch\('\/:conversationId\/details', checkDemoMode, checkAnyPermission\(\[\{ name: 'Manage Conversation', access: 'write' \}\]\)/g,
    "router.patch('/:conversationId/details', checkDemoMode, checkAnyPermission([{ name: 'Manage Conversation', access: 'write' }, { name: 'Manage Posts', access: 'write' }])"
  );
  content = content.replace(
    /router\.delete\('\/delete', checkDemoMode, checkAnyPermission\(\[\{ name: 'Manage Conversation', access: 'write' \}\]\)/g,
    "router.delete('/delete', checkDemoMode, checkAnyPermission([{ name: 'Manage Conversation', access: 'write' }, { name: 'Manage Posts', access: 'write' }])"
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed routes/broadcast-inbox.routes.js');
}

// 2. Update services/messaging.service.js error handling
function fixMessagingService() {
  const file = path.join(BACKEND_DIR, 'services/messaging.service.js');
  backup(file);
  let content = fs.readFileSync(file, 'utf8');

  // Ensure catch returns both message and error property
  content = content.replace(
    /return \{ success: false, message: error\.message \};/g,
    "return { success: false, message: error.message, error: error.message };"
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed services/messaging.service.js');
}

// 3. Update controllers/conversation.controller.js
function fixConversationController() {
  const file = path.join(BACKEND_DIR, 'controllers/conversation.controller.js');
  backup(file);
  let content = fs.readFileSync(file, 'utf8');

  // Insert isUserAdmin helper if not present
  if (!content.includes('const isUserAdmin =')) {
    content = content.replace(
      "const mongooseInstance = mongoose;",
      `const mongooseInstance = mongoose;

const isUserAdmin = (user) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'superadmin' || user.userType === 'admin') return true;
  if (user.roleId && (user.roleId.name === 'super_admin' || user.roleId.name === 'admin' || user.roleId.toString() === '6a42769e4c60005adff13f5a')) return true;
  return false;
};`
    );
  }

  // Update listBroadcastConversations filter
  const oldFilterSnippet = `    let filter = {
      $or: [
        { userId: req.user._id },
        { user_id: req.user._id }
      ]
    };`;

  const newFilterSnippet = `    const isAdmin = isUserAdmin(req.user);
    let filter = {};
    if (!isAdmin) {
      filter.$or = [
        { userId: req.user._id },
        { user_id: req.user._id },
        { userId: null },
        { userId: { $exists: false } }
      ];
    }`;

  if (content.includes(oldFilterSnippet)) {
    content = content.replace(oldFilterSnippet, newFilterSnippet);
  }

  // Update targetPlatform filter in listBroadcastConversations
  const oldPlatSnippet = `    const targetPlatform = platform || source;
    if (targetPlatform && targetPlatform.toLowerCase() !== 'all' && targetPlatform.toLowerCase() !== 'all platforms') {
      const p = targetPlatform.toLowerCase();
      if (p === 'whatsapp') {
        filter['metadata.source'] = { $in: ['whatsapp', 'whatsapp_meta'] };
      } else if (p === 'facebook' || p === 'messenger') {
        filter['metadata.source'] = { $in: ['facebook', 'messenger'] };
      } else {
        filter['metadata.source'] = p;
      }
    }`;

  const newPlatSnippet = `    const targetPlatform = platform || source || channel;
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

  if (content.includes(oldPlatSnippet)) {
    content = content.replace(oldPlatSnippet, newPlatSnippet);
  }

  // Update error response in manualReply
  content = content.replace(
    /return res\.status\(502\)\.json\(\{ message: deliveryResult\.error \|\| 'Failed to send message\.' \}\);/g,
    "return res.status(502).json({ message: deliveryResult.message || deliveryResult.error || 'Failed to send message.' });"
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed controllers/conversation.controller.js');
}

// 4. Update controllers/social-analytics.controller.js
function fixSocialAnalyticsController() {
  const file = path.join(BACKEND_DIR, 'controllers/social-analytics.controller.js');
  backup(file);
  let content = fs.readFileSync(file, 'utf8');

  // Replace resolveUserQuery with robust isUserAdmin
  const oldResolveSnippet = `// Helper to resolve user scope (supports admin looking at all or specific workspace)
const resolveUserQuery = async (req) => {
  const currentUserId = req.user._id;
  const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin' || req.user.userType === 'admin';
  const { targetUserId } = req.query;

  if (isAdmin && targetUserId) {
    if (targetUserId === 'all') {
      return { isAdmin: true, queryUserId: null };
    }
    if (isValidObjectId(targetUserId)) {
      return { isAdmin: true, queryUserId: targetUserId };
    }
  }

  return { isAdmin, queryUserId: currentUserId };
};`;

  const newResolveSnippet = `const isUserAdmin = (user) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'superadmin' || user.userType === 'admin') return true;
  if (user.roleId && (user.roleId.name === 'super_admin' || user.roleId.name === 'admin' || user.roleId.toString() === '6a42769e4c60005adff13f5a')) return true;
  return false;
};

// Helper to resolve user scope (supports admin looking at all or specific workspace)
const resolveUserQuery = async (req) => {
  const currentUserId = req.user._id;
  const isAdmin = isUserAdmin(req.user);
  const { targetUserId } = req.query;

  if (isAdmin) {
    if (!targetUserId || targetUserId === 'all') {
      return { isAdmin: true, queryUserId: null };
    }
    if (isValidObjectId(targetUserId)) {
      return { isAdmin: true, queryUserId: targetUserId };
    }
  }

  return { isAdmin, queryUserId: currentUserId };
};`;

  if (content.includes(oldResolveSnippet)) {
    content = content.replace(oldResolveSnippet, newResolveSnippet);
  }

  // Fix getWorkspaces isAdmin check
  content = content.replace(
    /const isAdmin = req\.user\.role === 'admin' \|\| req\.user\.role === 'superadmin' \|\| req\.user\.userType === 'admin';/g,
    "const isAdmin = isUserAdmin(req.user);"
  );

  // Fix dailyPostImpressionTrend timeframe usage in getOverviewAnalytics
  const oldTrendSnippet = `    // Generate real 14-day daily post impression progression
    const dailyPostImpressionTrend = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {`;

  const newTrendSnippet = `    const { timeframe = '30d' } = req.query;
    let daysCount = 30;
    if (timeframe === '7d') daysCount = 7;
    else if (timeframe === '30d') daysCount = 30;
    else if (timeframe === '90d') daysCount = 90;
    else if (timeframe === '1y') daysCount = 365;

    // Generate real timeframe daily post impression progression
    const dailyPostImpressionTrend = [];
    const now = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {`;

  if (content.includes(oldTrendSnippet)) {
    content = content.replace(oldTrendSnippet, newTrendSnippet);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed controllers/social-analytics.controller.js');
}

// 5. Update controllers/social-account.controller.js
function fixSocialAccountController() {
  const file = path.join(BACKEND_DIR, 'controllers/social-account.controller.js');
  backup(file);
  let content = fs.readFileSync(file, 'utf8');

  // Insert isUserAdmin helper if not present
  if (!content.includes('const isUserAdmin =')) {
    content = content.replace(
      "const SocialMediaApis = require('../services/socialMediaApis');",
      `const SocialMediaApis = require('../services/socialMediaApis');

const isUserAdmin = (user) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'superadmin' || user.userType === 'admin') return true;
  if (user.roleId && (user.roleId.name === 'super_admin' || user.roleId.name === 'admin' || user.roleId.toString() === '6a42769e4c60005adff13f5a')) return true;
  return false;
};`
    );
  }

  // In getUserSocialAccounts, if admin and query does not specify a different userId, allow all or admin's
  const oldGetAccounts = `    const userId = req.user._id;
    const { platform, isActive } = req.query;

    let query = { userId };`;

  const newGetAccounts = `    const userId = req.user._id;
    const { platform, isActive, targetUserId } = req.query;
    const isAdmin = isUserAdmin(req.user);

    let query = {};
    if (targetUserId && targetUserId !== 'all' && isValidObjectId(targetUserId)) {
      query.userId = targetUserId;
    } else if (!isAdmin) {
      query.userId = userId;
    }`;

  if (content.includes(oldGetAccounts)) {
    content = content.replace(oldGetAccounts, newGetAccounts);
  }

  // Ensure response includes both socialAccounts and data
  const oldResp = `    res.status(200).json({
      socialAccounts: socialAccounts.map(account => ({`;

  const newResp = `    const mapped = socialAccounts.map(account => ({`;

  if (content.includes(oldResp)) {
    content = content.replace(oldResp, newResp);
    content = content.replace(
      `        updatedAt: account.updated_at
      }))
    });`,
      `        updatedAt: account.updated_at
      }));

    res.status(200).json({
      socialAccounts: mapped,
      data: mapped
    });`
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed controllers/social-account.controller.js');
}

try {
  fixBroadcastInboxRoutes();
  fixMessagingService();
  fixConversationController();
  fixSocialAnalyticsController();
  fixSocialAccountController();
  console.log('ALL BACKEND FIXES APPLIED SUCCESSFULLY!');
} catch (e) {
  console.error('Error applying backend fixes:', e);
  process.exit(1);
}
