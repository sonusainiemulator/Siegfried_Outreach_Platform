const fs = require('fs');
const path = require('path');
const mongoose = require('/www/wwwroot/api.siegfriedoutreach.com/node_modules/mongoose');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

async function main() {
  console.log('=== Step 1: Patching helpers/chat.js for 100% Robust Deduplication ===');
  const chatHelperPath = path.join(BACKEND_DIR, 'helpers/chat.js');
  let chatHelperCode = fs.readFileSync(chatHelperPath, 'utf8');

  // 1. Update addMessage to set data-raw-content and prevent duplicates
  const oldAddMessage = `            function addMessage(content, isUser = false) {
                if (!content || !content.trim()) return;

                const row = document.createElement('div');`;

  const newAddMessage = `            function addMessage(content, isUser = false) {
                if (!content || !content.trim()) return;

                const trimmed = content.trim();

                // Prevent rendering duplicate bot messages
                if (!isUser) {
                    const lastBotMsg = chatMessages.querySelector('.bot-row:last-child .bot-message');
                    if (lastBotMsg && lastBotMsg.getAttribute('data-raw-content') === trimmed) {
                        return;
                    }
                }

                const row = document.createElement('div');`;

  if (chatHelperCode.includes(oldAddMessage)) {
    chatHelperCode = chatHelperCode.replace(oldAddMessage, newAddMessage);
  }

  // 2. Set data-raw-content on messageDiv
  const oldMessageDiv = `                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                if (isUser) {`;

  const newMessageDiv = `                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                messageDiv.setAttribute('data-raw-content', trimmed);
                if (isUser) {`;

  if (chatHelperCode.includes(oldMessageDiv)) {
    chatHelperCode = chatHelperCode.replace(oldMessageDiv, newMessageDiv);
  }

  // 3. Update Ably subscriber deduplication
  const oldAblySub = `                    channel.subscribe('message', (message) => {
                        if (message.data && message.data.role === 'assistant') {
                            if (!message.data.content || !message.data.content.trim()) return;
                            const lastBotMsg = chatMessages.querySelector('.bot-row:last-child .bot-message');
                            if (!lastBotMsg || lastBotMsg.textContent !== message.data.content) {
                                addMessage(message.data.content, false);
                            }
                        }
                    });`;

  const newAblySub = `                    channel.subscribe('message', (message) => {
                        if (message.data && message.data.role === 'assistant') {
                            const raw = (message.data.content || '').trim();
                            if (!raw) return;

                            const lastBotMsg = chatMessages.querySelector('.bot-row:last-child .bot-message');
                            if (lastBotMsg && lastBotMsg.getAttribute('data-raw-content') === raw) {
                                return;
                            }

                            hideTypingIndicator();
                            addMessage(raw, false);
                        }
                    });`;

  if (chatHelperCode.includes(oldAblySub)) {
    chatHelperCode = chatHelperCode.replace(oldAblySub, newAblySub);
  }

  // 4. Update sendMessage fetch response check
  const oldFetchResp = `                    if (response.ok) {
                        if (data.response && data.response.trim()) {
                            addMessage(data.response, false);
                        } else if (data.message && data.message.includes('human agent')) {`;

  const newFetchResp = `                    if (response.ok) {
                        if (data.response && data.response.trim()) {
                            const raw = data.response.trim();
                            const lastBotMsg = chatMessages.querySelector('.bot-row:last-child .bot-message');
                            if (!lastBotMsg || lastBotMsg.getAttribute('data-raw-content') !== raw) {
                                addMessage(raw, false);
                            }
                        } else if (data.message && data.message.includes('human agent')) {`;

  if (chatHelperCode.includes(oldFetchResp)) {
    chatHelperCode = chatHelperCode.replace(oldFetchResp, newFetchResp);
  }

  fs.writeFileSync(chatHelperPath, chatHelperCode, 'utf8');
  console.log('helpers/chat.js deduplication patched successfully.');

  console.log('=== Step 2: Patching controllers/chat.controller.js for Conversation Context & History ===');
  const chatCtrlPath = path.join(BACKEND_DIR, 'controllers/chat.controller.js');
  let chatCtrlCode = fs.readFileSync(chatCtrlPath, 'utf8');

  // Pass conversation.messages as effectiveHistory so AI remembers previous turns
  const oldSendMessageAiCall = `            const userId = req.user ? req.user._id : null;
            const aiService = new AIChatService(chatbot, userId);
            response = await aiService.sendMessage(message, history);`;

  const newSendMessageAiCall = `            const conversationHistory = conversation.messages
              .slice(0, -1)
              .map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
              }))
              .filter(m => m.content && m.content.trim() !== '');

            const effectiveHistory = (history && history.length > 0) ? history : conversationHistory.slice(-8);
            const userId = req.user ? req.user._id : null;
            const aiService = new AIChatService(chatbot, userId);
            response = await aiService.sendMessage(message, effectiveHistory);`;

  if (chatCtrlCode.includes(oldSendMessageAiCall)) {
    // Replace all occurrences of oldSendMessageAiCall
    chatCtrlCode = chatCtrlCode.split(oldSendMessageAiCall).join(newSendMessageAiCall);
    fs.writeFileSync(chatCtrlPath, chatCtrlCode, 'utf8');
    console.log('controllers/chat.controller.js history patched successfully.');
  }

  console.log('=== Step 3: Patching services/aiChatService.js for Human Conversational Tone ===');
  const aiServicePath = path.join(BACKEND_DIR, 'services/aiChatService.js');
  let aiServiceCode = fs.readFileSync(aiServicePath, 'utf8');

  const oldGuidelines = `    prompt += \`\\n\\n[COMMUNICATION GUIDELINES]
1. Provide helpful, direct, and well-structured responses using markdown formatting.
2. If the user asks about booking, appointments, scheduling a call, pricing, or consulting, warmly provide the appointment link (e.g., Calendly) if available in your instructions or knowledge base.
3. Maintain high professionalism and warmth.\`;`;

  const newGuidelines = `    prompt += \`\\n\\n[CRITICAL CONVERSATIONAL & HUMAN BEHAVIOR GUIDELINES]
1. REAL HUMAN CONCIERGE PACING:
   - When the user sends a greeting (such as "hello", "hi", "hey", "hii", "good morning"):
     Respond like a friendly, real human receptionist in 1 to 2 short sentences.
     Example: "Hi there! 👋 Welcome to Siegfried Marketing. How can I help you today? Are you looking for information on our clinic marketing services, or would you like to schedule a call with Christopher?"
     DO NOT dump paragraphs, bullet points, essays, or full website overviews on a simple greeting!
2. NATURAL APPOINTMENT SCHEDULING:
   - When the user asks to book an appointment, schedule a consultation, or have a call:
     Be warm, natural, and concise in 2 to 3 sentences maximum. Give the Calendly link directly:
     "I'd love to help you get that scheduled! You can pick a convenient time on Christopher Siegfried's calendar here: [Schedule on Calendly](https://calendly.com/christophersiegfried). Is there a specific service or clinic goal you'd like to discuss?"
     DO NOT write a long essay with 5 bullet points when simply asked for an appointment.
3. CONVERSATIONAL & ENGAGING:
   - Keep answers concise, human, and empathetic (2-4 sentences or short bullet points when specifically asked about services).
   - End answers with a natural, friendly question to keep the dialogue flowing.
   - Never sound like an AI assistant reciting a template.\`;`;

  if (aiServiceCode.includes(oldGuidelines)) {
    aiServiceCode = aiServiceCode.replace(oldGuidelines, newGuidelines);
    fs.writeFileSync(aiServicePath, aiServiceCode, 'utf8');
    console.log('services/aiChatService.js guidelines patched successfully.');
  }

  console.log('=== Step 4: Update Christopher Siegfried Chatbot Directives in MongoDB ===');
  require('/www/wwwroot/api.siegfriedoutreach.com/node_modules/dotenv').config({ path: '/www/wwwroot/api.siegfriedoutreach.com/.env' });
  const { db, connectDB } = require('/www/wwwroot/api.siegfriedoutreach.com/models');
  await connectDB();

  const botId = new mongoose.Types.ObjectId('6a4ba7c65165b7df2307840f');

  const naturalSystemInstruction = `You are Christopher Siegfried's official virtual concierge for Siegfried Marketing (christophersiegfried.com).

YOUR PERSONA:
You are warm, articulate, friendly, concise, and professional — like an experienced, welcoming executive concierge sitting at the front desk of a high-end medical clinic marketing agency.

CONVERSATIONAL RULES:
1. GREETINGS ("hello", "hi", "hey", "good morning"):
   Respond warmly in 1 or 2 friendly sentences. E.g.: "Hi there! 👋 Welcome to Siegfried Marketing. How can I assist you today? Are you looking for practice growth strategies, or would you like to set up a quick chat with Christopher?"
   NEVER dump long essays, company history, or multi-point lists on a simple greeting!

2. APPOINTMENT BOOKING ("book appointment", "schedule consultation", "call"):
   Direct visitors warmly and concisely to book on Calendly:
   "I'd be glad to help with that! You can pick a date and time that fits your schedule directly on Christopher Siegfried's calendar: [Schedule on Calendly](https://calendly.com/christophersiegfried). What type of clinic or practice do you run?"
   Never say you cannot book appointments. Always provide the Calendly link with warmth and brevity.

3. SERVICES & INQUIRIES:
   When asked about services, provide a concise, readable summary (2-3 focused bullet points) on medical clinic marketing, mental health marketing, SEO, and HIPAA-compliant patient acquisition. End with an engaging question.`;

  await db.Chatbot.collection.updateOne(
    { _id: botId },
    {
      $set: {
        welcomeMessage: 'Hello! How can I help you today?',
        systemInstruction: naturalSystemInstruction,
        'config.temperature': 0.3,
        statusText: 'Online — here to help'
      }
    }
  );
  console.log('Chatbot updated with human concierge directives in MongoDB.');

  console.log('=== Patch Complete! ===');
  process.exit(0);
}

main().catch(err => {
  console.error('Patch error:', err);
  process.exit(1);
});
