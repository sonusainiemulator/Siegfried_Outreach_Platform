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

console.log('=== Step 1: Patching models/conversation.model.js ===');
const convModelPath = path.join(BACKEND_DIR, 'models/conversation.model.js');
let convModelCode = fs.readFileSync(convModelPath, 'utf8');
if (!convModelCode.includes("'social'")) {
  convModelCode = convModelCode.replace(
    "enum: ['chatbot', 'campaign'],",
    "enum: ['chatbot', 'campaign', 'social'],"
  );
  backupAndWrite(convModelPath, convModelCode);
} else {
  console.log('models/conversation.model.js already contains social type enum');
}

console.log('=== Step 2: Patching server.js for global.io ===');
const serverPath = path.join(BACKEND_DIR, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');
if (!serverCode.includes('global.io = io;')) {
  serverCode = serverCode.replace(
    "app.set('io', io);",
    "app.set('io', io);\n    global.io = io;"
  );
  backupAndWrite(serverPath, serverCode);
} else {
  console.log('server.js already contains global.io');
}

console.log('=== Step 3: Patching helpers/instagramEvent.js for Inbound DMs ===');
const igEventPath = path.join(BACKEND_DIR, 'helpers/instagramEvent.js');
let igEventCode = fs.readFileSync(igEventPath, 'utf8');

// Replace handleDirectMessageEvent with full ingestion and real-time alerts
const igDmOldSnippet = `async function handleDirectMessageEvent(messageData, recipientId) {
  try {
    const { sender, recipient, message, timestamp } = messageData;
    
    if (!message || !sender) {
      console.log('⚠️ Instagram DM: Message missing text or sender data');
      return;
    }

    const senderId = sender.id;
    const messageText = message.text?.trim() || '';
    const messageId = message.mid;

    const instagramAccount = await SocialAccount.findOne({
      platform: 'instagram',
      $or: [ { accountId: recipientId }, { 'metadata.pageId': recipientId } ],
      isActive: true
    });

    if (!instagramAccount) {
      console.log(\`⚠️ Instagram DM: No active Instagram account found for recipientId: \${recipientId}\`);
      return;
    }

    if (senderId === instagramAccount.accountId) {
      console.log(\`⏭️ Skipping DM from own account to prevent reply loop\`);
      return;
    }

    console.log(\`ℹ️ Instagram DM: Auto-reply via DM is not supported. Use comment triggers instead.\`);
    return;
  } catch (error) {
    console.error('Handle direct message event error:', error.response?.data || error.message);
  }
}`;

const igDmNewSnippet = `async function handleDirectMessageEvent(messageData, recipientId, app = null) {
  try {
    const { sender, recipient, message, timestamp } = messageData;
    
    if (!message || !sender) {
      console.log('⚠️ Instagram DM: Message missing text or sender data');
      return;
    }

    const senderId = sender.id;
    const messageText = message.text?.trim() || '';
    const messageId = message.mid;

    let instagramAccount = await SocialAccount.findOne({
      platform: 'instagram',
      $or: [
        { accountId: recipientId },
        { 'metadata.pageId': recipientId },
        { 'metadata.facebookPageId': recipientId }
      ],
      isActive: true
    });

    if (!instagramAccount) {
      instagramAccount = await SocialAccount.findOne({
        platform: 'instagram',
        isActive: true
      });
    }

    if (!instagramAccount) {
      console.log(\`⚠️ Instagram DM: No active Instagram account found for recipientId: \${recipientId}\`);
      return;
    }

    if (senderId === instagramAccount.accountId) {
      console.log(\`⏭️ Skipping Instagram DM from own account to prevent reply loop\`);
      return;
    }

    // Try fetching user details from Instagram/Graph API
    let senderName = \`Instagram User (\${senderId.slice(-4)})\`;
    let profilePic = '';
    try {
      const accessToken = instagramAccount.decryptAccessToken();
      const apiVersion = SocialMediaApis.instagramApiVersion || 'v19.0';
      const userRes = await axios.get(
        \`https://graph.facebook.com/\${apiVersion}/\${senderId}?fields=name,username,profile_pic&access_token=\${accessToken}\`,
        { timeout: 5000 }
      );
      if (userRes.data?.username) {
        senderName = \`@\${userRes.data.username}\`;
      } else if (userRes.data?.name) {
        senderName = userRes.data.name;
      }
      if (userRes.data?.profile_pic) {
        profilePic = userRes.data.profile_pic;
      }
    } catch (fetchErr) {
      // Graceful fallback to default name
    }

    // Process attachments
    const attachments = [];
    if (message.attachments && Array.isArray(message.attachments)) {
      for (const att of message.attachments) {
        if (att.payload?.url) {
          attachments.push({
            url: att.payload.url,
            fileType: att.type === 'image' ? 'image' : (att.type === 'video' ? 'video' : (att.type === 'audio' ? 'audio' : 'document')),
            name: att.type || 'Attachment'
          });
        }
      }
    }

    const Conversation = db.Conversation;
    const mongoose = require('mongoose');

    let conversation = await Conversation.findOne({
      userId: instagramAccount.userId,
      sessionId: senderId,
      $or: [
        { 'metadata.source': 'instagram' },
        { type: 'social' }
      ]
    });

    if (!conversation) {
      conversation = new Conversation({
        userId: instagramAccount.userId,
        sessionId: senderId,
        type: 'social',
        title: \`Instagram DM - \${senderName}\`,
        messages: [],
        status: 'active',
        metadata: {
          source: 'instagram',
          platformId: senderId,
          accountId: instagramAccount.accountId,
          accountName: instagramAccount.accountName,
          username: senderName,
          profilePic: profilePic,
          pageId: instagramAccount.metadata?.pageId
        }
      });
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      role: 'user',
      content: messageText || (attachments.length > 0 ? '[Media Attachment]' : ''),
      senderId: senderId,
      senderName: senderName,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      attachments: attachments
    };

    conversation.messages.push(newMessage);
    conversation.lastActivity = new Date();
    conversation.status = 'active';
    await conversation.save();

    console.log(\`✅ Instagram DM saved to conversation \${conversation._id} from \${senderName}: \${newMessage.content}\`);

    // Emit real-time Socket.io alerts
    const io = (app && app.get('io')) || global.io;
    if (io) {
      io.to(\`user_\${instagramAccount.userId}\`).emit('receive-message', {
        chatbotId: null,
        conversationId: conversation._id,
        sessionId: conversation.sessionId,
        isCampaign: true,
        isSocial: true,
        platform: 'instagram',
        message: newMessage,
        senderName: senderName
      });

      io.to(\`user_\${instagramAccount.userId}\`).emit('social-dm-received', {
        conversationId: conversation._id,
        sessionId: conversation.sessionId,
        platform: 'instagram',
        platformName: 'Instagram Direct',
        accountName: instagramAccount.accountName,
        senderId: senderId,
        senderName: senderName,
        profilePic: profilePic,
        message: newMessage,
        conversation: {
          id: conversation._id,
          sessionId: conversation.sessionId,
          title: conversation.title,
          source: 'instagram',
          platform: 'instagram',
          lastActivity: conversation.lastActivity,
          lastMessage: {
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            role: 'user'
          },
          userName: senderName
        }
      });
      console.log(\`🔔 Emitted social-dm-received and receive-message to user_\${instagramAccount.userId}\`);
    }

    // In-app persistent notification
    if (db.Notification) {
      try {
        await db.Notification.create({
          userId: instagramAccount.userId,
          title: \`Instagram DM from \${senderName}\`,
          message: newMessage.content,
          type: 'SOCIAL_DM',
          link: \`/social-media/inbox?conversationId=\${conversation._id}\`,
          metadata: {
            platform: 'instagram',
            conversationId: conversation._id,
            senderId: senderId
          }
        });
      } catch (notifErr) {
        console.error('Error creating Notification:', notifErr.message);
      }
    }
  } catch (error) {
    console.error('Handle direct message event error:', error.response?.data || error.message);
  }
}`;

if (igEventCode.includes(igDmOldSnippet)) {
  igEventCode = igEventCode.replace(igDmOldSnippet, igDmNewSnippet);
  backupAndWrite(igEventPath, igEventCode);
} else {
  console.log('Old snippet in helpers/instagramEvent.js not directly matched, trying regex replace');
  igEventCode = igEventCode.replace(
    /async function handleDirectMessageEvent\(messageData, recipientId\)\s*\{[\s\S]*?console\.log\(`ℹ️ Instagram DM: Auto-reply via DM is not supported[\s\S]*?\n\}/,
    igDmNewSnippet
  );
  backupAndWrite(igEventPath, igEventCode);
}

console.log('=== Step 4: Patching helpers/facebookEvent.js for Inbound Facebook DMs ===');
const fbEventPath = path.join(BACKEND_DIR, 'helpers/facebookEvent.js');
let fbEventCode = fs.readFileSync(fbEventPath, 'utf8');

const fbDmNewSnippet = `async function handleDirectMessageEvent(messageData, recipientId, app = null) {
  try {
    const { sender, recipient, message, timestamp } = messageData;
    
    if (!message || !sender) {
      console.log('⚠️ Facebook DM: Message missing text or sender data');
      return;
    }

    const senderId = sender.id;
    const messageText = message.text?.trim() || '';
    const messageId = message.mid;

    let facebookAccount = await SocialAccount.findOne({
      platform: 'facebook',
      $or: [
        { accountId: recipientId },
        { 'metadata.pageId': recipientId }
      ],
      isActive: true
    });

    if (!facebookAccount) {
      facebookAccount = await SocialAccount.findOne({
        platform: 'facebook',
        isActive: true
      });
    }

    if (!facebookAccount) {
      console.log(\`⚠️ Facebook DM: No active Facebook account found for recipientId: \${recipientId}\`);
      return;
    }

    if (senderId === facebookAccount.accountId) {
      console.log(\`⏭️ Skipping Facebook DM from own account to prevent reply loop\`);
      return;
    }

    let senderName = \`Facebook User (\${senderId.slice(-4)})\`;
    let profilePic = '';
    try {
      const accessToken = facebookAccount.decryptAccessToken();
      const apiVersion = SocialMediaApis.facebookApiVersion || 'v19.0';
      const userRes = await axios.get(
        \`https://graph.facebook.com/\${apiVersion}/\${senderId}?fields=name,first_name,last_name,profile_pic&access_token=\${accessToken}\`,
        { timeout: 5000 }
      );
      if (userRes.data?.name) {
        senderName = userRes.data.name;
      }
      if (userRes.data?.profile_pic) {
        profilePic = userRes.data.profile_pic;
      }
    } catch (fetchErr) {
      // Graceful fallback
    }

    const attachments = [];
    if (message.attachments && Array.isArray(message.attachments)) {
      for (const att of message.attachments) {
        if (att.payload?.url) {
          attachments.push({
            url: att.payload.url,
            fileType: att.type === 'image' ? 'image' : (att.type === 'video' ? 'video' : (att.type === 'audio' ? 'audio' : 'document')),
            name: att.type || 'Attachment'
          });
        }
      }
    }

    const Conversation = db.Conversation;
    const mongoose = require('mongoose');

    let conversation = await Conversation.findOne({
      userId: facebookAccount.userId,
      sessionId: senderId,
      $or: [
        { 'metadata.source': { $in: ['facebook', 'messenger'] } },
        { type: 'social' }
      ]
    });

    if (!conversation) {
      conversation = new Conversation({
        userId: facebookAccount.userId,
        sessionId: senderId,
        type: 'social',
        title: \`Messenger: \${senderName}\`,
        messages: [],
        status: 'active',
        metadata: {
          source: 'facebook',
          platformId: senderId,
          accountId: facebookAccount.accountId,
          accountName: facebookAccount.accountName,
          username: senderName,
          profilePic: profilePic,
          pageId: facebookAccount.metadata?.pageId || facebookAccount.accountId
        }
      });
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      role: 'user',
      content: messageText || (attachments.length > 0 ? '[Media Attachment]' : ''),
      senderId: senderId,
      senderName: senderName,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      attachments: attachments
    };

    conversation.messages.push(newMessage);
    conversation.lastActivity = new Date();
    conversation.status = 'active';
    await conversation.save();

    console.log(\`✅ Facebook DM saved to conversation \${conversation._id} from \${senderName}: \${newMessage.content}\`);

    const io = (app && app.get('io')) || global.io;
    if (io) {
      io.to(\`user_\${facebookAccount.userId}\`).emit('receive-message', {
        chatbotId: null,
        conversationId: conversation._id,
        sessionId: conversation.sessionId,
        isCampaign: true,
        isSocial: true,
        platform: 'facebook',
        message: newMessage,
        senderName: senderName
      });

      io.to(\`user_\${facebookAccount.userId}\`).emit('social-dm-received', {
        conversationId: conversation._id,
        sessionId: conversation.sessionId,
        platform: 'facebook',
        platformName: 'Facebook Messenger',
        accountName: facebookAccount.accountName,
        senderId: senderId,
        senderName: senderName,
        profilePic: profilePic,
        message: newMessage,
        conversation: {
          id: conversation._id,
          sessionId: conversation.sessionId,
          title: conversation.title,
          source: 'facebook',
          platform: 'facebook',
          lastActivity: conversation.lastActivity,
          lastMessage: {
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            role: 'user'
          },
          userName: senderName
        }
      });
      console.log(\`🔔 Emitted social-dm-received and receive-message to user_\${facebookAccount.userId}\`);
    }

    if (db.Notification) {
      try {
        await db.Notification.create({
          userId: facebookAccount.userId,
          title: \`Facebook DM from \${senderName}\`,
          message: newMessage.content,
          type: 'SOCIAL_DM',
          link: \`/social-media/inbox?conversationId=\${conversation._id}\`,
          metadata: {
            platform: 'facebook',
            conversationId: conversation._id,
            senderId: senderId
          }
        });
      } catch (notifErr) {
        console.error('Error creating Notification:', notifErr.message);
      }
    }
  } catch (error) {
    console.error('Handle direct message event error:', error.response?.data || error.message);
  }
}`;

fbEventCode = fbEventCode.replace(
  /async function handleDirectMessageEvent\(messageData, recipientId\)\s*\{[\s\S]*?console\.log\(`ℹ️ Facebook DM: Auto-reply via DM is not supported[\s\S]*?\n\}/,
  fbDmNewSnippet
);
backupAndWrite(fbEventPath, fbEventCode);

console.log('=== Step 5: Updating routes/social-auth.routes.js to pass req.app ===');
const socialAuthRoutesPath = path.join(BACKEND_DIR, 'routes/social-auth.routes.js');
let socialAuthCode = fs.readFileSync(socialAuthRoutesPath, 'utf8');
socialAuthCode = socialAuthCode.replace(
  "await handleFacebookDirectMessageEvent(messageEvent, entry.id);",
  "await handleFacebookDirectMessageEvent(messageEvent, entry.id, req.app);"
);
socialAuthCode = socialAuthCode.replace(
  "await handleDirectMessageEvent(messageEvent, entry.id);",
  "await handleDirectMessageEvent(messageEvent, entry.id, req.app);"
);
backupAndWrite(socialAuthRoutesPath, socialAuthCode);

console.log('=== Step 6: Updating services/messaging.service.js for Instagram & Facebook DMs ===');
const messagingServicePath = path.join(BACKEND_DIR, 'services/messaging.service.js');
let messagingCode = fs.readFileSync(messagingServicePath, 'utf8');

const igReplySupport = `
    if (source === 'instagram') {
      const recipientId = conversation.metadata?.platformId || conversation.sessionId;
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
        throw new Error('Connected Instagram account not found. Please connect your Instagram Business account.');
      }

      const accessToken = socialAccount.decryptAccessToken();
      const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v19.0';
      const axios = require('axios');

      if (message) {
        await axios.post(
          \`https://graph.facebook.com/\${apiVersion}/me/messages\`,
          {
            recipient: { id: recipientId },
            message: { text: message }
          },
          {
            headers: {
              'Authorization': \`Bearer \${accessToken}\`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      for (const att of attachments) {
        await axios.post(
          \`https://graph.facebook.com/\${apiVersion}/me/messages\`,
          {
            recipient: { id: recipientId },
            message: {
              attachment: {
                type: att.fileType === 'video' ? 'video' : 'image',
                payload: { url: att.url }
              }
            }
          },
          {
            headers: {
              'Authorization': \`Bearer \${accessToken}\`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    } else if (source === 'messenger' || source === 'facebook') {
      let pageAccessToken = chatbot?.messenger?.accessToken || (conversation.type === 'campaign' ? userSettings?.app_secret : null);
      
      if (!pageAccessToken) {
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
        if (socialAccount) {
          pageAccessToken = socialAccount.decryptAccessToken();
        }
      }

      const recipientId = conversation.metadata?.platformId || conversation.sessionId;

      if (!pageAccessToken || !recipientId) {
        throw new Error('Messenger configuration or recipient ID missing.');
      }
      
      if (message) {
        await sendFacebookMessage(pageAccessToken, recipientId, { text: message }, chatbot?.messenger?.appId || userSettings?.app_id, chatbot?.messenger?.appSecret || userSettings?.app_secret);
      }
      for (const att of attachments) {
        let attachmentType = att.fileType === 'document' ? 'file' : att.fileType;
        await sendFacebookMessage(pageAccessToken, recipientId, {
          attachment: {
            type: attachmentType,
            payload: { url: att.url }
          }
        }, chatbot?.messenger?.appId || userSettings?.app_id, chatbot?.messenger?.appSecret || userSettings?.app_secret);
      }
    }`;

// Replace messenger block in messaging.service.js
messagingCode = messagingCode.replace(
  /if \(source === 'messenger'\) \{[\s\S]*?\} else if \(source === 'whatsapp_meta' \|\| source === 'whatsapp'\)/,
  `${igReplySupport} else if (source === 'whatsapp_meta' || source === 'whatsapp')`
);
backupAndWrite(messagingServicePath, messagingCode);

console.log('=== Step 7: Updating controllers/conversation.controller.js ===');
const convCtrlPath = path.join(BACKEND_DIR, 'controllers/conversation.controller.js');
let convCtrlCode = fs.readFileSync(convCtrlPath, 'utf8');

// In manualReply: allow conversation.type === 'social'
convCtrlCode = convCtrlCode.replace(
  "if (!chatbot && conversation.type !== 'campaign')",
  "if (!chatbot && conversation.type !== 'campaign' && conversation.type !== 'social')"
);

// In listBroadcastConversations: broaden filter to include social conversations and query platform/source
const oldListFilter = `    let filter = { type: 'campaign', userId : req.user._id };    

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sessionId: { $regex: search, $options: 'i' } },
        { 'messages.senderName': { $regex: search, $options: 'i' } }
      ];
    }`;

const newListFilter = `    const { search = '', source, platform } = req.query;

    let filter = {
      userId: req.user._id,
      $or: [
        { type: { $in: ['campaign', 'social'] } },
        { 'metadata.source': { $in: ['instagram', 'facebook', 'messenger', 'whatsapp', 'whatsapp_meta', 'telegram', 'twitter'] } }
      ]
    };

    const targetPlatform = platform || source;
    if (targetPlatform && targetPlatform.toLowerCase() !== 'all' && targetPlatform.toLowerCase() !== 'all platforms') {
      const p = targetPlatform.toLowerCase();
      if (p === 'whatsapp') {
        filter['metadata.source'] = { $in: ['whatsapp', 'whatsapp_meta'] };
      } else if (p === 'facebook' || p === 'messenger') {
        filter['metadata.source'] = { $in: ['facebook', 'messenger'] };
      } else {
        filter['metadata.source'] = p;
      }
    }

    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { sessionId: { $regex: search, $options: 'i' } },
          { 'metadata.username': { $regex: search, $options: 'i' } },
          { 'metadata.accountName': { $regex: search, $options: 'i' } },
          { 'messages.content': { $regex: search, $options: 'i' } },
          { 'messages.senderName': { $regex: search, $options: 'i' } }
        ]
      });
    }`;

convCtrlCode = convCtrlCode.replace(oldListFilter, newListFilter);

// In summary mapping, enrich with source, platform, accountName, username
const oldSummaryMap = `        status: conv.status,
        source: conv.metadata?.source,
        lastActivity: conv.lastActivity,
        lastMessage: {
          content: lastMsg.content || '',
          timestamp: lastMsg.timestamp,
          role: lastMsg.role
        },
        userName: lastUserMsg.senderName || conv.sessionId,`;

const newSummaryMap = `        status: conv.status,
        source: conv.metadata?.source || 'social',
        platform: conv.metadata?.source || 'social',
        accountName: conv.metadata?.accountName,
        username: conv.metadata?.username,
        profilePic: conv.metadata?.profilePic,
        lastActivity: conv.lastActivity,
        lastMessage: {
          content: lastMsg.content || '',
          timestamp: lastMsg.timestamp,
          role: lastMsg.role
        },
        userName: lastUserMsg.senderName || conv.metadata?.username || conv.title || conv.sessionId,`;

convCtrlCode = convCtrlCode.replace(oldSummaryMap, newSummaryMap);

// In getBroadcastConversationHistory, return source, platform, accountName, username, profilePic
const oldHistConv = `        status: conversation.status,
        source: conversation.metadata?.source,
        messages: conversation.messages`;

const newHistConv = `        status: conversation.status,
        source: conversation.metadata?.source || 'social',
        platform: conversation.metadata?.source || 'social',
        accountName: conversation.metadata?.accountName,
        username: conversation.metadata?.username,
        profilePic: conversation.metadata?.profilePic,
        messages: conversation.messages`;

convCtrlCode = convCtrlCode.replace(oldHistConv, newHistConv);

backupAndWrite(convCtrlPath, convCtrlCode);

console.log('✅ Backend patching completed successfully!');
