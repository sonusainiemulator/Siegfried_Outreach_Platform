const fs = require('fs');

const oauthRoutesPath = '/www/wwwroot/api.siegfriedoutreach.com/routes/oauth.routes.js';
let content = fs.readFileSync(oauthRoutesPath, 'utf8');

// Replace targetUser lookup in /api/oauth/token with code-based user extraction
const oldTargetUserBlock = `      let targetUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!targetUser) targetUser = await User.findOne({ role: 'superadmin' });
      if (!targetUser) targetUser = await User.findOne();`;

const newTargetUserBlock = `      let targetUser = null;
      if (code && typeof code === 'string' && (code.startsWith('mcp_user_') || code.startsWith('mcp_code_'))) {
        const parts = code.split('_');
        const extractedUserId = parts[2];
        if (extractedUserId && mongoose.isValidObjectId(extractedUserId)) {
          targetUser = await User.findById(extractedUserId);
        }
      }

      if (!targetUser) {
        targetUser =
          (await User.findOne({ email: process.env.ADMIN_EMAIL })) ||
          (await User.findOne({ role: 'superadmin' })) ||
          (await User.findOne());
      }`;

if (content.includes(oldTargetUserBlock)) {
  content = content.replace(oldTargetUserBlock, newTargetUserBlock);
  fs.writeFileSync(oauthRoutesPath, content, 'utf8');
  console.log('Successfully updated oauth.routes.js to bind OAuth tokens to individual authenticated users!');
} else {
  console.log('Target user block already updated or structure differs.');
}
