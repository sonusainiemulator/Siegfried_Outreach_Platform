const { io } = require('socket.io-client');
const axios = require('axios');
const mongoose = require('mongoose');

const USER_ID = '6a427ef002dedd73a26f8a3d'; // Christopher Siegfried
const SOCKET_URL = 'http://localhost:3001';
const WEBHOOK_URL = 'http://localhost:3001/api/social-auth/instagram/events';

async function runTest() {
  console.log('🚀 Connecting Socket.IO client to server at', SOCKET_URL);

  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: false
  });

  const eventsReceived = [];

  socket.on('connect', () => {
    console.log('✅ Socket connected with ID:', socket.id);
    // Use the official event 'join-room'
    socket.emit('join-room', USER_ID);
    console.log(`✅ Emitted join-room for user: ${USER_ID}`);
  });

  socket.on('receive-message', (data) => {
    console.log('\n💬 [EVENT: receive-message]', {
      platform: data.platform,
      senderName: data.senderName,
      message: data.message?.content,
      conversationId: data.conversationId
    });
    eventsReceived.push({ type: 'receive-message', data });
  });

  socket.on('social-dm-received', (data) => {
    console.log('\n🔔 [EVENT: social-dm-received]', {
      platform: data.platform,
      platformName: data.platformName,
      senderName: data.senderName,
      accountName: data.accountName,
      message: data.message?.content,
      conversationId: data.conversationId
    });
    eventsReceived.push({ type: 'social-dm-received', data });
  });

  // Wait 1 second for socket connection and room join
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n📤 Dispatching Webhook Event: Facebook Page Direct Message to', WEBHOOK_URL);
  const testCustomerName = 'Dr. Heinrich Vogel';
  const testFbPayload = {
    object: 'page',
    entry: [
      {
        id: '1229617713561939', // Siegfried Marketing Facebook Page
        time: Date.now(),
        messaging: [
          {
            sender: { id: 'fb_customer_' + Date.now() },
            recipient: { id: '1229617713561939' },
            timestamp: Date.now(),
            message: {
              mid: 'mid.fb.' + Date.now(),
              text: `Guten Tag! We need high-converting Google & Meta ad campaigns for our plastic surgery practice. Are you taking on new clients this month?`
            }
          }
        ]
      }
    ]
  };

  const fbRes = await axios.post(WEBHOOK_URL, testFbPayload);
  console.log('Webhook Response (Facebook):', fbRes.status, fbRes.statusText);

  // Wait 2 seconds for event processing and socket broadcast
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n=============================================');
  console.log(`Total Real-time Socket Events Received: ${eventsReceived.length}`);
  if (eventsReceived.length > 0) {
    console.log('🎉 SUCCESS! Real-time alerts fired and were received by client listener!');
  } else {
    console.log('ℹ️ No socket events captured in timeout window.');
  }
  console.log('=============================================');

  socket.disconnect();
  process.exit(0);
}

runTest().catch(e => {
  console.error('Test error:', e.message);
  process.exit(1);
});
