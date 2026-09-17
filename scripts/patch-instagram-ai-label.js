const fs = require('fs');
const path = require('path');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

function backupAndWrite(filePath, content) {
  const backupPath = `${filePath}.bak-${Date.now()}`;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up ${filePath} -> ${backupPath}`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

console.log('=== Step 1: Patching models/socialPost.model.js ===');
const socialPostModelPath = path.join(BACKEND_DIR, 'models/socialPost.model.js');
let socialPostModelCode = fs.readFileSync(socialPostModelPath, 'utf8');

if (!socialPostModelCode.includes('isAiGenerated:')) {
  // Add isAiGenerated in platform schema and root post schema
  socialPostModelCode = socialPostModelCode.replace(
    `    engagement: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      lastUpdated: Date
    }
  }],`,
    `    engagement: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      lastUpdated: Date
    },
    isAiGenerated: {
      type: Boolean,
      default: false
    }
  }],
  isAiGenerated: {
    type: Boolean,
    default: false
  },`
  );
  backupAndWrite(socialPostModelPath, socialPostModelCode);
} else {
  console.log('models/socialPost.model.js already contains isAiGenerated');
}

console.log('=== Step 2: Patching controllers/social-post.controller.js ===');
const socialPostCtrlPath = path.join(BACKEND_DIR, 'controllers/social-post.controller.js');
let socialPostCtrlCode = fs.readFileSync(socialPostCtrlPath, 'utf8');

// 1. Destructure isAiGenerated in createSocialPost
if (!socialPostCtrlCode.includes('let { title, content, mediaUrls, scheduledDateTime, platformAccounts, tags, visibility, isImmediate = false, autoReplyConfig, postTypes, isAiGenerated }')) {
  socialPostCtrlCode = socialPostCtrlCode.replace(
    'let { title, content, mediaUrls, scheduledDateTime, platformAccounts, tags, visibility, isImmediate = false, autoReplyConfig, postTypes } = req.body;',
    `let { title, content, mediaUrls, scheduledDateTime, platformAccounts, tags, visibility, isImmediate = false, autoReplyConfig, postTypes, isAiGenerated } = req.body;
    if (typeof isAiGenerated === 'string') {
      isAiGenerated = isAiGenerated.toLowerCase() === 'true';
    } else {
      isAiGenerated = Boolean(isAiGenerated);
    }`
  );
}

// 2. Set isAiGenerated on socialPost and in platform objects
if (!socialPostCtrlCode.includes('isAiGenerated: Boolean(isAiGenerated)')) {
  socialPostCtrlCode = socialPostCtrlCode.replace(
    `    const socialPost = new SocialPost({
      userId,
      title: title.trim(),
      content: content.trim(),
      mediaUrls: mediaUrls || [],
      scheduledDateTime: postScheduledDateTime,`,
    `    const socialPost = new SocialPost({
      userId,
      title: title.trim(),
      content: content.trim(),
      mediaUrls: mediaUrls || [],
      scheduledDateTime: postScheduledDateTime,
      isAiGenerated: Boolean(isAiGenerated),`
  );

  socialPostCtrlCode = socialPostCtrlCode.replace(
    `        return {
          socialAccountId: account._id,
          platform: account.platform,
          accountName: account.accountName,
          postType
        };`,
    `        return {
          socialAccountId: account._id,
          platform: account.platform,
          accountName: account.accountName,
          postType,
          isAiGenerated: Boolean(isAiGenerated)
        };`
  );

  // Return isAiGenerated in createSocialPost response
  socialPostCtrlCode = socialPostCtrlCode.replace(
    `        status: populatedPost.status,
        isImmediate: isImmediate,`,
    `        status: populatedPost.status,
        isImmediate: isImmediate,
        isAiGenerated: Boolean(populatedPost.isAiGenerated),`
  );

  // Return isAiGenerated in getUserSocialPosts response
  socialPostCtrlCode = socialPostCtrlCode.replace(
    `        isImmediate: !post.scheduledDateTime,
        autoReplyConfig: post.autoReplyConfig,`,
    `        isImmediate: !post.scheduledDateTime,
        isAiGenerated: Boolean(post.isAiGenerated),
        autoReplyConfig: post.autoReplyConfig,`
  );

  // Return isAiGenerated in getSocialPostById response
  socialPostCtrlCode = socialPostCtrlCode.replace(
    `        isImmediate: !socialPost.scheduledDateTime,
        platforms: socialPost.platforms.map`,
    `        isImmediate: !socialPost.scheduledDateTime,
        isAiGenerated: Boolean(socialPost.isAiGenerated),
        platforms: socialPost.platforms.map`
  );

  // Handle isAiGenerated in updateSocialPost
  socialPostCtrlCode = socialPostCtrlCode.replace(
    'if (visibility) updateData.visibility = visibility;',
    `if (visibility) updateData.visibility = visibility;
    if (req.body.isAiGenerated !== undefined) {
      updateData.isAiGenerated = typeof req.body.isAiGenerated === 'string'
        ? req.body.isAiGenerated.toLowerCase() === 'true'
        : Boolean(req.body.isAiGenerated);
    }`
  );

  backupAndWrite(socialPostCtrlPath, socialPostCtrlCode);
} else {
  console.log('controllers/social-post.controller.js already patched with isAiGenerated');
}

console.log('=== Step 3: Patching services/socialMediaApis.js ===');
const socialMediaApisPath = path.join(BACKEND_DIR, 'services/socialMediaApis.js');
let socialMediaApisCode = fs.readFileSync(socialMediaApisPath, 'utf8');

if (!socialMediaApisCode.includes('publishToInstagram(accessToken, accountId, content, mediaUrls = [], postType = \'post\', isAiGenerated = false)')) {
  // Update function signature
  socialMediaApisCode = socialMediaApisCode.replace(
    "async publishToInstagram(accessToken, accountId, content, mediaUrls = [], postType = 'post') {",
    "async publishToInstagram(accessToken, accountId, content, mediaUrls = [], postType = 'post', isAiGenerated = false) {"
  );

  // Log with AI label status
  socialMediaApisCode = socialMediaApisCode.replace(
    "console.log(`[Instagram] Publishing to account ${accountId} with ${mediaUrls.length} media items, format: ${postType}`);",
    "console.log(`[Instagram] Publishing to account ${accountId} with ${mediaUrls.length} media items, format: ${postType}, isAiGenerated: ${Boolean(isAiGenerated)}`);"
  );

  // Include is_ai_generated in createContainer
  const oldCreateContainerPayload = `        let payload = {
          access_token: accessToken
        };`;

  const newCreateContainerPayload = `        let payload = {
          access_token: accessToken
        };
        if (isAiGenerated) {
          payload.is_ai_generated = true;
        }`;

  socialMediaApisCode = socialMediaApisCode.replace(oldCreateContainerPayload, newCreateContainerPayload);

  // Safe retry for single / reel container if is_ai_generated is rejected by Meta API
  const oldContainerTryCatch = `        try {
          const response = await axios.post( \`https://graph.facebook.com/\${this.instagramApiVersion}/\${accountId}/media\`, payload );
          console.log(\`[Instagram] Container created: \${response.data.id}\`);
          return response.data.id;

        } catch (containerErr) {
          const igError = containerErr.response?.data?.error;
          const msg = igError?.message || containerErr.message;
          console.error(\`[Instagram] Failed to create container for \${publicMediaUrl}:\`, containerErr.response?.data || containerErr.message);
          throw new Error(\`Failed to create Instagram media container: \${msg}\`);
        }`;

  const newContainerTryCatch = `        try {
          const response = await axios.post( \`https://graph.facebook.com/\${this.instagramApiVersion}/\${accountId}/media\`, payload );
          console.log(\`[Instagram] Container created: \${response.data.id} (is_ai_generated: \${Boolean(isAiGenerated)})\`);
          return response.data.id;

        } catch (containerErr) {
          if (payload.is_ai_generated && (containerErr.response?.data?.error?.message?.includes('is_ai_generated') || containerErr.response?.data?.error?.error_user_msg?.includes('is_ai_generated'))) {
            console.warn('[Instagram] is_ai_generated parameter rejected by Meta API, retrying container without it:', containerErr.response?.data?.error?.message);
            const retryPayload = { ...payload };
            delete retryPayload.is_ai_generated;
            const retryResponse = await axios.post( \`https://graph.facebook.com/\${this.instagramApiVersion}/\${accountId}/media\`, retryPayload );
            return retryResponse.data.id;
          }
          const igError = containerErr.response?.data?.error;
          const msg = igError?.message || containerErr.message;
          console.error(\`[Instagram] Failed to create container for \${publicMediaUrl}:\`, containerErr.response?.data || containerErr.message);
          throw new Error(\`Failed to create Instagram media container: \${msg}\`);
        }`;

  socialMediaApisCode = socialMediaApisCode.replace(oldContainerTryCatch, newContainerTryCatch);

  // Also include is_ai_generated on Carousel album container
  const oldCarouselPost = `      try {
        const carouselResponse = await axios.post(
          \`https://graph.facebook.com/\${this.instagramApiVersion}/\${accountId}/media\`,
          {
            media_type: 'CAROUSEL',
            caption: content,
            children: childIds,
            access_token: accessToken
          }
        );`;

  const newCarouselPost = `      try {
        const carouselPayload = {
          media_type: 'CAROUSEL',
          caption: content,
          children: childIds,
          access_token: accessToken
        };
        if (isAiGenerated) {
          carouselPayload.is_ai_generated = true;
        }

        let carouselResponse;
        try {
          carouselResponse = await axios.post(
            \`https://graph.facebook.com/\${this.instagramApiVersion}/\${accountId}/media\`,
            carouselPayload
          );
        } catch (cErr) {
          if (carouselPayload.is_ai_generated && (cErr.response?.data?.error?.message?.includes('is_ai_generated') || cErr.response?.data?.error?.error_user_msg?.includes('is_ai_generated'))) {
            console.warn('[Instagram] Carousel is_ai_generated rejected by Meta API, retrying without it...');
            delete carouselPayload.is_ai_generated;
            carouselResponse = await axios.post(
              \`https://graph.facebook.com/\${this.instagramApiVersion}/\${accountId}/media\`,
              carouselPayload
            );
          } else {
            throw cErr;
          }
        }`;

  socialMediaApisCode = socialMediaApisCode.replace(oldCarouselPost, newCarouselPost);

  backupAndWrite(socialMediaApisPath, socialMediaApisCode);
} else {
  console.log('services/socialMediaApis.js already patched with isAiGenerated support');
}

console.log('=== Step 4: Patching services/queue.js ===');
const queuePath = path.join(BACKEND_DIR, 'services/queue.js');
let queueCode = fs.readFileSync(queuePath, 'utf8');

if (!queueCode.includes('const isAiGen = Boolean(')) {
  const oldQueueInstagramCall = `          case 'instagram':
            if (!mediaUrls || mediaUrls.length === 0) {
              throw new Error('Instagram requires at least one image or video.');
            }
            result = await SocialMediaApis.publishToInstagram(
              decryptedToken,
              platformAccountId,
              content,
              mediaUrls,
              platformInfo.postType || 'post'
            );
            break;`;

  const newQueueInstagramCall = `          case 'instagram':
            if (!mediaUrls || mediaUrls.length === 0) {
              throw new Error('Instagram requires at least one image or video.');
            }
            const isAiGen = Boolean(
              socialPost.isAiGenerated ||
              platformInfo.isAiGenerated ||
              (Array.isArray(socialPost.tags) && socialPost.tags.includes('ai-generated'))
            );
            result = await SocialMediaApis.publishToInstagram(
              decryptedToken,
              platformAccountId,
              content,
              mediaUrls,
              platformInfo.postType || 'post',
              isAiGen
            );
            break;`;

  queueCode = queueCode.replace(oldQueueInstagramCall, newQueueInstagramCall);
  backupAndWrite(queuePath, queueCode);
} else {
  console.log('services/queue.js already patched with isAiGen pass-through');
}

console.log('=== Step 5: Patching services/autonomousPublisher.js ===');
const autoPubPath = path.join(BACKEND_DIR, 'services/autonomousPublisher.js');
let autoPubCode = fs.readFileSync(autoPubPath, 'utf8');

if (!autoPubCode.includes('isAiGenerated: true')) {
  // When autonomous publisher creates a post, set postType correctly for reels and auto-enable isAiGenerated
  const oldAutoPostSnippet = `              const socialPost = new SocialPost({
                userId: business.user,
                title: item.topic || 'Autonomous Post',
                content: \`\${item.caption || ''}\\n\\n\${item.cta || ''}\\n\\n\${(item.hashtags || []).map(h => \`#\${h}\`).join(' ')}\`,
                mediaUrls: item.creativeUrl ? [item.creativeUrl] : [],
                status: 'scheduled',
                scheduledDateTime: new Date(),
                platforms: [{
                  socialAccountId: socialAccount._id,
                  platform: socialAccount.platform,
                  accountName: socialAccount.accountName,
                  status: 'pending'
                }]
              });`;

  const newAutoPostSnippet = `              const formatLower = (item.format || 'post').toLowerCase();
              const autoPostType = formatLower === 'reel' ? 'reel' : (formatLower === 'carousel' ? 'carousel' : 'post');
              const socialPost = new SocialPost({
                userId: business.user,
                title: item.topic || 'Autonomous Post',
                content: \`\${item.caption || ''}\\n\\n\${item.cta || ''}\\n\\n\${(item.hashtags || []).map(h => \`#\${h}\`).join(' ')}\`,
                mediaUrls: item.creativeUrl ? [item.creativeUrl] : [],
                status: 'scheduled',
                scheduledDateTime: new Date(),
                isAiGenerated: true, // Automatically enable AI Label for AI autonomous publishing
                platforms: [{
                  socialAccountId: socialAccount._id,
                  platform: socialAccount.platform,
                  accountName: socialAccount.accountName,
                  postType: autoPostType,
                  isAiGenerated: true,
                  status: 'pending'
                }]
              });`;

  autoPubCode = autoPubCode.replace(oldAutoPostSnippet, newAutoPostSnippet);
  backupAndWrite(autoPubPath, autoPubCode);
} else {
  console.log('services/autonomousPublisher.js already patched with isAiGenerated: true');
}

console.log('=== Step 6: Patching controllers/ai-team.controller.js ===');
const aiTeamPath = path.join(BACKEND_DIR, 'controllers/ai-team.controller.js');
let aiTeamCode = fs.readFileSync(aiTeamPath, 'utf8');

if (!aiTeamCode.includes('isAiGenerated: true')) {
  aiTeamCode = aiTeamCode.replace(
    `    const post = await SocialPost.create({
      userId: req.user._id,
      title: title || (employee.name + ' draft'),
      content,
      mediaUrls: mediaUrls || [],
      platforms: configs,
      status: 'draft'
    });`,
    `    const post = await SocialPost.create({
      userId: req.user._id,
      title: title || (employee.name + ' draft'),
      content,
      mediaUrls: mediaUrls || [],
      platforms: configs.map(c => ({ ...c, isAiGenerated: true })),
      status: 'draft',
      isAiGenerated: true // AI Team generated draft auto-labels AI Content
    });`
  );
  backupAndWrite(aiTeamPath, aiTeamCode);
} else {
  console.log('controllers/ai-team.controller.js already patched with isAiGenerated: true');
}

console.log('=== All backend patches applied successfully! ===');
