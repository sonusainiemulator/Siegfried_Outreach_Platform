const fs = require('fs');
const path = require('path');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

function applyFixes() {
  console.log('--- 1. Patch helpers/chat.js for duplicate prevention ---');
  const chatHelperPath = path.join(BACKEND_DIR, 'helpers/chat.js');
  let chatCode = fs.readFileSync(chatHelperPath, 'utf8');

  // Add deduplication variables before addMessage
  const addMessageTarget = `            function addMessage(content, isUser = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                if (isUser) {
                    messageDiv.textContent = content;
                } else {
                    messageDiv.innerHTML = formatMessage(content);
                }
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }`;

  const addMessageReplacement = `            let lastRenderedAssistantMessage = '';
            let lastRenderedTime = 0;

            function addMessage(content, isUser = false) {
                if (!content) return;
                const now = Date.now();
                if (!isUser) {
                    if (content === lastRenderedAssistantMessage && (now - lastRenderedTime) < 10000) {
                        return; // Prevent duplicate assistant messages within 10s
                    }
                    lastRenderedAssistantMessage = content;
                    lastRenderedTime = now;
                }

                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                messageDiv.dataset.raw = content;
                if (isUser) {
                    messageDiv.textContent = content;
                } else {
                    messageDiv.innerHTML = formatMessage(content);
                }
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }`;

  if (chatCode.includes(addMessageTarget)) {
    chatCode = chatCode.replace(addMessageTarget, addMessageReplacement);
    console.log('addMessage deduplication added.');
  }

  // Exact target replacement for sendMessage block
  const oldSendMessageBlock = `            async function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;
                
                addMessage(message, true);
                userInput.value = '';
                
                showTypingIndicator();
                
                try {
                    const response = await fetch(\`\${BACKEND_URL}/api/chat/chatbot/\${chatbotId}?sessionId=\${sessionId}\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Device-Fingerprint': deviceFingerprint
                        },
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    
                    hideTypingIndicator();
                    
                    if (response.ok) {
                        if (data.response) {
                            addMessage(data.response);
                        } else {
                            addMessage('Message sent! A live agent will get back to you shortly.', false);
                        }
                    } else {
                        addMessage('Sorry, I encountered an error. Please try again.');
                    }
                } catch (error) {
                    hideTypingIndicator();
                    addMessage('Sorry, I encountered an error. Please try again.');
                }
            }
            
            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });`;

  const newSendMessageBlock = `            let isSending = false;
            async function sendMessage() {
                if (isSending) return;
                const message = userInput.value.trim();
                if (!message) return;
                
                isSending = true;
                sendBtn.disabled = true;
                sendBtn.style.opacity = '0.5';
                
                addMessage(message, true);
                userInput.value = '';
                
                showTypingIndicator();
                
                try {
                    const response = await fetch(\`\${BACKEND_URL}/api/chat/chatbot/\${chatbotId}?sessionId=\${sessionId}\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Device-Fingerprint': deviceFingerprint
                        },
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    
                    hideTypingIndicator();
                    
                    if (response.ok) {
                        if (data.response) {
                            addMessage(data.response, false);
                        } else {
                            addMessage('Message sent! A live agent will get back to you shortly.', false);
                        }
                    } else {
                        addMessage('Sorry, I encountered an error. Please try again.', false);
                    }
                } catch (error) {
                    hideTypingIndicator();
                    addMessage('Sorry, I encountered an error. Please try again.', false);
                } finally {
                    isSending = false;
                    sendBtn.disabled = false;
                    sendBtn.style.opacity = '1';
                }
            }
            
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sendMessage();
            });
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });`;

  if (chatCode.includes(oldSendMessageBlock)) {
    chatCode = chatCode.replace(oldSendMessageBlock, newSendMessageBlock);
    console.log('sendMessage debounce & lock added.');
  }

  // Update Ably subscriber to deduplicate
  const ablyTarget = `                    channel.subscribe('message', (message) => {
                        if (message.data.role === 'assistant') {
                            const lastMsg = chatMessages.lastElementChild;
                            if (!lastMsg || lastMsg.textContent !== message.data.content) {
                                addMessage(message.data.content, false);
                            }
                        }
                    });`;

  const ablyReplacement = `                    channel.subscribe('message', (message) => {
                        if (message.data.role === 'assistant') {
                            const incoming = message.data.content;
                            const lastMsg = chatMessages.lastElementChild;
                            const lastRaw = lastMsg ? (lastMsg.dataset.raw || lastMsg.textContent) : '';
                            if (incoming && incoming !== lastRaw && incoming !== lastRenderedAssistantMessage) {
                                addMessage(incoming, false);
                            }
                        }
                    });`;

  if (chatCode.includes(ablyTarget)) {
    chatCode = chatCode.replace(ablyTarget, ablyReplacement);
    console.log('Ably subscriber deduplication added.');
  }

  fs.writeFileSync(chatHelperPath, chatCode, 'utf8');
  console.log('helpers/chat.js saved successfully.');

  console.log('--- 2. Patch aiChatService.js for short & concise answers ---');
  const aiServicePath = path.join(BACKEND_DIR, 'services/aiChatService.js');
  let aiCode = fs.readFileSync(aiServicePath, 'utf8');

  // Token window for concise replies: default around 350 tokens
  aiCode = aiCode.replace(
    /this\.maxTokens = Math\.max\(Number\(chatbotConfig\.config\?\.maxTokens\) \|\| \d+, \d+\);/,
    `this.maxTokens = Math.min(Math.max(Number(chatbotConfig.config?.maxTokens) || 350, 150), 600);`
  );

  const oldGuidelines = `[COMMUNICATION GUIDELINES]
1. Provide helpful, direct, and well-structured responses using markdown formatting.
2. If the user asks about booking, appointments, scheduling a call, pricing, or consulting, warmly provide the appointment link (e.g., Calendly) if available in your instructions or knowledge base.
3. Maintain high professionalism and warmth.`;

  const newGuidelines = `[COMMUNICATION GUIDELINES — SHORT & CONCISE REPLIES MANDATORY]
1. ALWAYS KEEP REPLIES SHORT, CRISP, AND TO THE POINT.
2. Limit your entire response to 2 to 3 concise sentences (or a short 3-bullet list maximum). Never exceed 60-80 words.
3. DO NOT write long essays, extensive guides, or overwhelming paragraphs.
4. When the user asks about booking an appointment, scheduling a call, pricing, or consulting, warmly give a brief 1-2 sentence invite with the direct Calendly link: https://calendly.com/christophersiegfried
5. Be direct, friendly, and helpful.`;

  if (aiCode.includes(oldGuidelines)) {
    aiCode = aiCode.replace(oldGuidelines, newGuidelines);
    console.log('aiChatService communication guidelines updated to short replies.');
  }

  fs.writeFileSync(aiServicePath, aiCode, 'utf8');
  console.log('aiChatService.js saved successfully.');
}

applyFixes();
