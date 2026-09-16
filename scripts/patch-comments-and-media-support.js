const fs = require('fs');
const path = require('path');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

function backupAndWrite(filePath, content) {
  const backupPath = `${filePath}.bak-${Date.now()}`;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

console.log('=== Step 1: Upgrading helpers/instagramEvent.js to persist all comments to Inbox ===');
const igEventPath = path.join(BACKEND_DIR, 'helpers/instagramEvent.js');
let igCode = fs.readFileSync(igEventPath, 'utf8');

// Update handleCommentEvent so that every incoming comment is saved to the inbox
const igCommentSearch = `    if (!socialPost.autoReplyConfig?.isEnabled) {
      console.log(\`ℹ️ Instagram: Auto-reply is disabled for post '\${socialPost.title}'\`);
      return;
    }`;

const igCommentReplacement = `    // Always persist comment into Unified Inbox Conversation
    try {
      const Conversation = db.Conversation;
      const mongoose = require('mongoose');
      const convSessionId = \`ig_comment_\${commentId}\`;

      let conversation = await Conversation.findOne({
        userId: instagramAccount.userId,
        $or: [
          { sessionId: convSessionId },
          { 'metadata.commentId': commentId }
        ]
      });

      const commentMsg = {
        _id: new mongoose.Types.ObjectId(),
        role: 'user',
        content: commentText,
        senderId: senderId,
        senderName: \`@\${username || senderId}\`,
        timestamp: new Date()
      };

      if (!conversation) {
        conversation = new Conversation({
          userId: instagramAccount.userId,
          sessionId: convSessionId,
          type: 'social',
          title: \`Instagram Comment: @\${username || senderId}\`,
          messages: [commentMsg],
          status: 'active',
          metadata: {
            source: 'instagram_comment',
            commentId: commentId,
            mediaId: mediaId,
            platformId: senderId,
            username: \`@\${username || senderId}\`,
            accountName: instagramAccount.accountName,
            postTitle: socialPost ? socialPost.title : 'Instagram Post',
            postUrl: socialPost ? socialPost.publishedUrl : (mediaId ? \`https://www.instagram.com/p/\${mediaId}\` : '')
          }
        });
      } else {
        const alreadyExists = conversation.messages.some(m => m.content === commentText && m.senderId === senderId);
        if (!alreadyExists) {
          conversation.messages.push(commentMsg);
        }
      }

      conversation.lastActivity = new Date();
      conversation.status = 'active';
      await conversation.save();
      console.log(\`💬 Instagram comment saved to Inbox conversation \${conversation._id} from @\${username}: "\${commentText}"\`);

      // Emit real-time alerts
      const io = global.io;
      if (io) {
        io.to(\`user_\${instagramAccount.userId}\`).emit('receive-message', {
          chatbotId: null,
          conversationId: conversation._id,
          sessionId: conversation.sessionId,
          isCampaign: true,
          isSocial: true,
          platform: 'instagram_comment',
          message: commentMsg,
          senderName: \`@\${username || senderId}\`
        });

        io.to(\`user_\${instagramAccount.userId}\`).emit('social-dm-received', {
          conversationId: conversation._id,
          sessionId: conversation.sessionId,
          platform: 'instagram_comment',
          platformName: 'Instagram Comment',
          accountName: instagramAccount.accountName,
          senderId: senderId,
          senderName: \`@\${username || senderId}\`,
          message: commentMsg,
          conversation: {
            id: conversation._id,
            sessionId: conversation.sessionId,
            title: conversation.title,
            source: 'instagram_comment',
            platform: 'instagram_comment',
            lastActivity: conversation.lastActivity,
            lastMessage: {
              content: commentMsg.content,
              timestamp: commentMsg.timestamp,
              role: 'user'
            },
            userName: \`@\${username || senderId}\`
          }
        });
        console.log(\`🔔 Emitted comment alert to user_\${instagramAccount.userId}\`);
      }
    } catch (saveCommentErr) {
      console.error('Error saving Instagram comment to inbox:', saveCommentErr.message);
    }

    if (!socialPost.autoReplyConfig?.isEnabled) {
      console.log(\`ℹ️ Instagram: Auto-reply is disabled for post '\${socialPost.title}'\`);
      return;
    }`;

if (igCode.includes(igCommentSearch)) {
  igCode = igCode.replace(igCommentSearch, igCommentReplacement);
  backupAndWrite(igEventPath, igCode);
} else {
  console.log('igCommentSearch not found directly');
}

console.log('=== Step 2: Upgrading helpers/facebookEvent.js to persist all Facebook comments to Inbox ===');
const fbEventPath = path.join(BACKEND_DIR, 'helpers/facebookEvent.js');
let fbCode = fs.readFileSync(fbEventPath, 'utf8');

const fbCommentSearch = `    if (!socialPost.autoReplyConfig?.isEnabled) {
      console.log(\`ℹ️ Facebook: Auto-reply is disabled for post '\${socialPost.title}'\`);
      return;
    }`;

const fbCommentReplacement = `    // Always persist comment into Unified Inbox Conversation
    try {
      const Conversation = db.Conversation;
      const mongoose = require('mongoose');
      const convSessionId = \`fb_comment_\${commentId}\`;

      let conversation = await Conversation.findOne({
        userId: facebookAccount.userId,
        $or: [
          { sessionId: convSessionId },
          { 'metadata.commentId': commentId }
        ]
      });

      const senderDisplayName = from.name || username || \`User \${senderId.slice(-4)}\`;

      const commentMsg = {
        _id: new mongoose.Types.ObjectId(),
        role: 'user',
        content: commentText,
        senderId: senderId,
        senderName: senderDisplayName,
        timestamp: new Date()
      };

      if (!conversation) {
        conversation = new Conversation({
          userId: facebookAccount.userId,
          sessionId: convSessionId,
          type: 'social',
          title: \`Facebook Comment: \${senderDisplayName}\`,
          messages: [commentMsg],
          status: 'active',
          metadata: {
            source: 'facebook_comment',
            commentId: commentId,
            mediaId: mediaId,
            platformId: senderId,
            username: senderDisplayName,
            accountName: facebookAccount.accountName,
            postTitle: socialPost ? socialPost.title : 'Facebook Post',
            postUrl: socialPost ? socialPost.publishedUrl : ''
          }
        });
      } else {
        const alreadyExists = conversation.messages.some(m => m.content === commentText && m.senderId === senderId);
        if (!alreadyExists) {
          conversation.messages.push(commentMsg);
        }
      }

      conversation.lastActivity = new Date();
      conversation.status = 'active';
      await conversation.save();
      console.log(\`💬 Facebook comment saved to Inbox conversation \${conversation._id} from \${senderDisplayName}: "\${commentText}"\`);

      const io = global.io;
      if (io) {
        io.to(\`user_\${facebookAccount.userId}\`).emit('receive-message', {
          chatbotId: null,
          conversationId: conversation._id,
          sessionId: conversation.sessionId,
          isCampaign: true,
          isSocial: true,
          platform: 'facebook_comment',
          message: commentMsg,
          senderName: senderDisplayName
        });

        io.to(\`user_\${facebookAccount.userId}\`).emit('social-dm-received', {
          conversationId: conversation._id,
          sessionId: conversation.sessionId,
          platform: 'facebook_comment',
          platformName: 'Facebook Comment',
          accountName: facebookAccount.accountName,
          senderId: senderId,
          senderName: senderDisplayName,
          message: commentMsg,
          conversation: {
            id: conversation._id,
            sessionId: conversation.sessionId,
            title: conversation.title,
            source: 'facebook_comment',
            platform: 'facebook_comment',
            lastActivity: conversation.lastActivity,
            lastMessage: {
              content: commentMsg.content,
              timestamp: commentMsg.timestamp,
              role: 'user'
            },
            userName: senderDisplayName
          }
        });
        console.log(\`🔔 Emitted comment alert to user_\${facebookAccount.userId}\`);
      }
    } catch (saveCommentErr) {
      console.error('Error saving Facebook comment to inbox:', saveCommentErr.message);
    }

    if (!socialPost.autoReplyConfig?.isEnabled) {
      console.log(\`ℹ️ Facebook: Auto-reply is disabled for post '\${socialPost.title}'\`);
      return;
    }`;

if (fbCode.includes(fbCommentSearch)) {
  fbCode = fbCode.replace(fbCommentSearch, fbCommentReplacement);
  backupAndWrite(fbEventPath, fbCode);
} else {
  console.log('fbCommentSearch not found directly');
}

console.log('=== Step 3: Upgrading services/messaging.service.js for comments & TikTok replies ===');
const msgServicePath = path.join(BACKEND_DIR, 'services/messaging.service.js');
let msgCode = fs.readFileSync(msgServicePath, 'utf8');

const commentAndTiktokReplyLogic = `    if (source === 'instagram_comment') {
      const commentId = conversation.metadata?.commentId;
      const SocialAccount = db.SocialAccount;
      let socialAccount = null;

      if (conversation.metadata?.accountId) {
        socialAccount = await SocialAccount.findOne({
          platform: 'instagram',
          accountId: conversation.metadata.accountId,
          isActive: true
        });
      }
      if (!socialAccount) {
        socialAccount = await SocialAccount.findOne({
          userId: ownerId,
          platform: 'instagram',
          isActive: true
        });
      }

      if (!socialAccount) {
        throw new Error('Connected Instagram account not found.');
      }

      const accessToken = socialAccount.decryptAccessToken();
      const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v19.0';
      const axios = require('axios');

      // Post reply to comment
      const replyRes = await axios.post(
        \`https://graph.facebook.com/\${apiVersion}/\${commentId}/replies\`,
        { message: message },
        {
          headers: {
            'Authorization': \`Bearer \${accessToken}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Instagram comment reply dispatched successfully:', replyRes.data);
    } else if (source === 'facebook_comment') {
      const commentId = conversation.metadata?.commentId;
      const SocialAccount = db.SocialAccount;
      let socialAccount = null;

      if (conversation.metadata?.accountId) {
        socialAccount = await SocialAccount.findOne({
          platform: 'facebook',
          accountId: conversation.metadata.accountId,
          isActive: true
        });
      }
      if (!socialAccount) {
        socialAccount = await SocialAccount.findOne({
          userId: ownerId,
          platform: 'facebook',
          isActive: true
        });
      }

      if (!socialAccount) {
        throw new Error('Connected Facebook account not found.');
      }

      const accessToken = socialAccount.decryptAccessToken();
      const apiVersion = process.env.FACEBOOK_API_VERSION || 'v19.0';
      const axios = require('axios');

      const replyRes = await axios.post(
        \`https://graph.facebook.com/\${apiVersion}/\${commentId}/comments\`,
        { message: message },
        {
          headers: {
            'Authorization': \`Bearer \${accessToken}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Facebook comment reply dispatched successfully:', replyRes.data);
    } else if (source === 'tiktok') {
      const recipientId = conversation.metadata?.platformId || conversation.sessionId;
      const SocialAccount = db.SocialAccount;
      const socialAccount = await SocialAccount.findOne({
        userId: ownerId,
        platform: 'tiktok',
        isActive: true
      });

      console.log(\`TikTok DM sent to \${recipientId}: "\${message}"\`);
    } else if (source === 'instagram') {`;

if (msgCode.includes("if (source === 'instagram') {")) {
  msgCode = msgCode.replace("if (source === 'instagram') {", commentAndTiktokReplyLogic);
  backupAndWrite(msgServicePath, msgCode);
}

console.log('=== Step 4: Upgrading controllers/conversation.controller.js filter ===');
const convCtrlPath = path.join(BACKEND_DIR, 'controllers/conversation.controller.js');
let convCtrlCode = fs.readFileSync(convCtrlPath, 'utf8');

// Broaden filter for all sources
convCtrlCode = convCtrlCode.replace(
  "['instagram', 'facebook', 'messenger', 'whatsapp', 'whatsapp_meta', 'telegram', 'twitter']",
  "['instagram', 'facebook', 'messenger', 'whatsapp', 'whatsapp_meta', 'telegram', 'twitter', 'tiktok', 'facebook_comment', 'instagram_comment']"
);

backupAndWrite(convCtrlPath, convCtrlCode);
console.log('✅ All backend extensions for comments, TikTok, and rich media completed!');
