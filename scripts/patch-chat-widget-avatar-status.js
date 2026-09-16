const fs = require('fs');
const path = require('path');
const mongoose = require('/www/wwwroot/api.siegfriedoutreach.com/node_modules/mongoose');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

async function main() {
  console.log('=== Step 1: Patching helpers/chat.js ===');
  const chatHelperPath = path.join(BACKEND_DIR, 'helpers/chat.js');
  let chatHelperCode = fs.readFileSync(chatHelperPath, 'utf8');

  // Replace getIframeHtml function with our comprehensive version
  const newGetIframeHtml = `function getIframeHtml(chatbot, ablyEnabled, ablyApiKey){
    const rawAvatar = chatbot.avatar || chatbot.appearance?.avatar || '';
    const statusText = (chatbot.statusText || 'Online — here to help').replace(/'/g, "\\\\'");
    const botName = (chatbot.name || 'Assistant').replace(/'/g, "\\\\'");
    const botInitial = (chatbot.name ? chatbot.name.charAt(0) : 'A').toUpperCase();
    const primaryColor = chatbot.appearance?.primaryColor || '#3b82f6';
    const secondaryColor = chatbot.appearance?.secondaryColor || '#e0f0ff';
    const textColor = chatbot.appearance?.textColor || '#0f172a';
    const borderRadius = chatbot.appearance?.borderRadius || '8px';

    let avatarUrl = '';
    if (rawAvatar) {
        if (rawAvatar.startsWith('http://') || rawAvatar.startsWith('https://') || rawAvatar.startsWith('data:')) {
            avatarUrl = rawAvatar;
        } else {
            avatarUrl = '/' + rawAvatar.replace(/^\\/+/, '');
        }
    }

    return \`
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>\${botName}</title>
      <script src='https://cdn.ably.com/lib/ably.min-1.js'></script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: \${chatbot.appearance?.backgroundColor || '#ffffff'};
          color: \${textColor};
          overflow: hidden;
          height: 100%;
        }
        * {
          box-sizing: border-box;
        }
        #chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          max-width: 100%;
          background-color: \${chatbot.appearance?.backgroundColor || '#ffffff'};
        }
        #chat-header {
          background: \${primaryColor};
          color: white;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          flex-shrink: 0;
        }
        
        .chat-header-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }
        
        .chat-avatar-wrapper {
          position: relative;
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.25);
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        
        .chat-header-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }
        
        .chat-avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
        }
        
        .chat-status-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 11px;
          height: 11px;
          background: #10b981;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        
        .chat-status-dot::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 1.5px solid #10b981;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        
        .chat-header-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        
        .chat-header-title {
          font-size: 14.5px;
          font-weight: 700;
          color: white;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .chat-header-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }
        
        .chat-status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          display: inline-block;
          flex-shrink: 0;
        }
        
        .chat-status-text {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1;
        }

        #chat-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .chat-action-btn {
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: white;
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 11.5px;
          font-weight: 500;
          transition: background 0.15s ease;
          white-space: nowrap;
        }
        
        .chat-action-btn:hover {
          background: rgba(255, 255, 255, 0.28);
        }

        .chat-close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          padding: 2px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.15s ease;
          opacity: 0.85;
        }

        .chat-close-btn:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.18);
        }
            
        #chat-messages {
          flex: 1;
          padding: 14px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 12px;
          width: 100%;
        }

        .user-row {
          justify-content: flex-end;
        }

        .bot-row {
          justify-content: flex-start;
        }

        .bot-msg-avatar {
          width: 28px;
          height: 28px;
          min-width: 28px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 2px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .bot-msg-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .bot-msg-fallback {
          background: \${primaryColor};
          color: white;
          font-weight: 700;
          font-size: 11px;
        }
        
        .message {
          padding: 9px 13px;
          border-radius: \${borderRadius};
          max-width: 82%;
          word-break: break-word;
          font-size: 13.5px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
            
        .user-message {
          background: \${primaryColor};
          color: white;
          border-bottom-right-radius: 2px;
        }
        
        .bot-message {
          background: \${secondaryColor};
          color: \${textColor};
          line-height: 1.5;
          border-bottom-left-radius: 2px;
        }
        .chat-calendly-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          padding: 8px 14px;
          margin: 6px 0;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .chat-calendly-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .chat-link {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
          word-break: break-word;
        }
        .chat-link:hover {
          color: #1d4ed8;
        }
            
        #input-area {
          padding: 12px;
          background: \${chatbot.appearance?.backgroundColor || '#ffffff'};
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
            
        #input-row {
          display: flex;
        }
            
        #user-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: \${borderRadius};
          outline: none;
          background: \${chatbot.appearance?.inputBackgroundColor || '#f0fdf4'};
          color: \${textColor};
          font-size: 13.5px;
        }
        
        #send-btn {
          margin-left: 8px;
          padding: 10px 16px;
          background: \${chatbot.appearance?.buttonColor || primaryColor};
          color: white;
          border: none;
          border-radius: \${borderRadius};
          cursor: pointer;
          font-weight: 600;
          font-size: 13.5px;
          transition: opacity 0.15s ease;
        }

        #send-btn:hover {
          opacity: 0.92;
        }
            
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: \${secondaryColor};
          border-radius: \${borderRadius};
          border-bottom-left-radius: 2px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #64748b;
          animation: typing-bounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      </style>
    </head>
    <body>
        <div id='chat-container'>
          <div id='chat-header'>
            <div class='chat-header-profile'>
              <div class='chat-avatar-wrapper'>
                \${avatarUrl ? \`
                  <img class='chat-header-avatar' src='\${avatarUrl}' alt='\${botName}' onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
                  <div class='chat-avatar-fallback' style='display: none;'>\${botInitial}</div>
                \` : \`
                  <div class='chat-avatar-fallback'>\${botInitial}</div>
                \`}
                <span class='chat-status-dot' title='Online'></span>
              </div>
              <div class='chat-header-meta'>
                <div class='chat-header-title'>\${botName}</div>
                <div class='chat-header-status'>
                  <span class='chat-status-indicator'></span>
                  <span class='chat-status-text'>\${statusText}</span>
                </div>
              </div>
            </div>
            <div id='chat-actions'>
              <button id='new-chat-btn' class='chat-action-btn' title='Start New Chat'>New Chat</button>
              <button id='load-history-btn' class='chat-action-btn' title='View History'>History</button>
              <button id='close-btn' class='chat-close-btn' aria-label='Close Chat'>&times;</button>
            </div>
          </div>
            
            <div id='chat-messages'>
                <div class='message-row bot-row'>
                    \${avatarUrl ? \`
                    <div class='bot-msg-avatar'>
                        <img src='\${avatarUrl}' alt='\${botName}' onerror="this.parentNode.textContent='\${botInitial}'" />
                    </div>\` : \`
                    <div class='bot-msg-avatar bot-msg-fallback'>\${botInitial}</div>
                    \`}
                    <div class='message bot-message'>
                        \${chatbot.welcomeMessage || 'Hello! How can I assist you today?'}
                    </div>
                </div>
            </div>
            
            <div id='input-area'>
                <div id='input-row'>
                    <input type='text' id='user-input' placeholder='\${(chatbot.config?.placeholder || 'Type your message...').replace(/'/g, '&quot;')}' />
                    <button id='send-btn'>Send</button>
                </div>
            </div>
        </div>
    
        <script>
            const BACKEND_URL = \\\`\\\${window.location.protocol}//\\\${window.location.host}\\\`.includes('file:') ? 'http://localhost:3000' : \\\`\\\${window.location.protocol}//\\\${window.location.host}\\\`;
            
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('sessionId') || localStorage.getItem('chatbot_sessionId') || 'session_\${Date.now()}_\${Math.random().toString(36).slice(2, 8)}';
    
            localStorage.setItem('chatbot_sessionId', sessionId);
    
            function getDeviceFingerprint() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = 'rgb(100, 100, 100)';
                ctx.fillRect(100, 100, 100, 100);
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillText('Canvas fingerprint', 10, 10);
                
                const canvasData = canvas.toDataURL();
                const plugins = Array.from(navigator.plugins).map(p => p.name).join(',');
                const mimeTypes = Array.from(navigator.mimeTypes).map(mt => mt.type).join(',');
                
                const fingerprint = btoa(
                    navigator.userAgent + 
                    screen.width + 
                    screen.height + 
                    screen.colorDepth + 
                    plugins + 
                    mimeTypes + 
                    navigator.language + 
                    canvasData
                ).substring(0, 32);
                
                return fingerprint;
            }
            
            let deviceFingerprint = localStorage.getItem('device_fingerprint');
            if (!deviceFingerprint) {
                deviceFingerprint = getDeviceFingerprint();
                localStorage.setItem('device_fingerprint', deviceFingerprint);
            }
            
            const chatbotId = '\${chatbot._id}';
            const ablyEnabled = \${ablyEnabled};
            const ablyApiKey = '\${ablyApiKey}';
            const avatarUrl = '\${avatarUrl}';
            const botName = '\${botName}';
            const botInitial = '\${botInitial}';
    
            const chatMessages = document.getElementById('chat-messages');
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');
            const closeBtn = document.getElementById('close-btn');
            const newChatBtn = document.getElementById('new-chat-btn');
            const loadHistoryBtn = document.getElementById('load-history-btn');
            
            function formatMessage(raw) {
                if (!raw) return '';
                var safe = raw
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                
                safe = safe.replace(/\\\\*\\\\*(.*?)\\\\*\\\\*/g, '<strong>$1</strong>');
                safe = safe.replace(/\\\\*(.*?)\\\\*/g, '<em>$1</em>');
                
                safe = safe.replace(/\\\\[([^\\\\]]+)\\\\]\\\\((https?:\\\\/\\\\/[^\\\\s)]+)\\\\)/g, function(match, text, url) {
                    var isCal = url.indexOf('calendly.com') !== -1 || url.indexOf('cal.com') !== -1;
                    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="' + (isCal ? 'chat-calendly-btn' : 'chat-link') + '">' + (isCal ? '📅 ' : '') + text + '</a>';
                });

                safe = safe.replace(/(^|[\\\\s(])(https?:\\\\/\\\\/[^\\\\s<)]+)/g, function(match, prefix, url) {
                    var isCal = url.indexOf('calendly.com') !== -1 || url.indexOf('cal.com') !== -1;
                    return prefix + '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="' + (isCal ? 'chat-calendly-btn' : 'chat-link') + '">' + (isCal ? '📅 Book on Calendly' : url) + '</a>';
                });

                safe = safe.replace(/\\\\n/g, '<br>');
                return safe;
            }

            function addMessage(content, isUser = false) {
                if (!content || !content.trim()) return;

                const row = document.createElement('div');
                row.className = isUser ? 'message-row user-row' : 'message-row bot-row';

                if (!isUser) {
                    const avatarDiv = document.createElement('div');
                    avatarDiv.className = 'bot-msg-avatar' + (avatarUrl ? '' : ' bot-msg-fallback');
                    if (avatarUrl) {
                        avatarDiv.innerHTML = '<img src="' + avatarUrl + '" alt="' + botName + '" onerror="this.parentNode.textContent=\\\\\\'' + botInitial + '\\\\\'" />';
                    } else {
                        avatarDiv.textContent = botInitial;
                    }
                    row.appendChild(avatarDiv);
                }

                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                if (isUser) {
                    messageDiv.textContent = content;
                } else {
                    messageDiv.innerHTML = formatMessage(content);
                }
                row.appendChild(messageDiv);
                chatMessages.appendChild(row);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            function showTypingIndicator() {
                if (document.getElementById('typing-indicator-row')) return;
                const row = document.createElement('div');
                row.className = 'message-row bot-row';
                row.id = 'typing-indicator-row';

                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'bot-msg-avatar' + (avatarUrl ? '' : ' bot-msg-fallback');
                if (avatarUrl) {
                    avatarDiv.innerHTML = '<img src="' + avatarUrl + '" alt="' + botName + '" onerror="this.parentNode.textContent=\\\\\\'' + botInitial + '\\\\\'" />';
                } else {
                    avatarDiv.textContent = botInitial;
                }
                row.appendChild(avatarDiv);

                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-indicator';
                typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
                row.appendChild(typingDiv);

                chatMessages.appendChild(row);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            function hideTypingIndicator() {
                const row = document.getElementById('typing-indicator-row');
                if (row) {
                    row.remove();
                }
            }
            
            async function loadConversationHistory() {
                try {
                    const response = await fetch(\\\`\\\${BACKEND_URL}/api/conversations/chatbot/\\\${chatbotId}/history?sessionId=\\\${sessionId}\\\`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Device-Fingerprint': deviceFingerprint
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const messages = data.conversation?.messages;
                        if (messages && messages.length > 0) {
                            chatMessages.innerHTML = '';
                            messages.forEach(msg => {
                                if (msg.content && msg.content.trim()) {
                                    addMessage(msg.content, msg.role === 'user');
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error loading conversation history:', error);
                }
            }
            
            async function startNewConversation() {
                try {
                    const response = await fetch(\\\`\\\${BACKEND_URL}/api/conversations/chatbot/\\\${chatbotId}/new\\\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Device-Fingerprint': deviceFingerprint
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        chatMessages.innerHTML = '';
                        
                        const welcomeMsg = '\${(chatbot.welcomeMessage || 'Hello! How can I assist you today?').replace(/'/g, "\\\\'") }';
                        addMessage(welcomeMsg, false);
                        
                        const newSessionId = data.conversation.sessionId;
                        localStorage.setItem('chatbot_sessionId', newSessionId);
                    }
                } catch (error) {
                    console.error('Error starting new conversation:', error);
                }
            }
            
            async function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;
                
                addMessage(message, true);
                userInput.value = '';
                
                showTypingIndicator();
                
                try {
                    const response = await fetch(\\\`\\\${BACKEND_URL}/api/chat/chatbot/\\\${chatbotId}?sessionId=\\\${sessionId}\\\`, {
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
                        if (data.response && data.response.trim()) {
                            addMessage(data.response, false);
                        } else if (data.message && data.message.includes('human agent')) {
                            addMessage('Message sent! A live agent will get back to you shortly.', false);
                        } else {
                            addMessage('Sorry, I encountered an error. Please try again.', false);
                        }
                    } else {
                        addMessage('Sorry, I encountered an error. Please try again.', false);
                    }
                } catch (error) {
                    hideTypingIndicator();
                    addMessage('Sorry, I encountered an error. Please try again.', false);
                }
            }
            
            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            newChatBtn.addEventListener('click', startNewConversation);
            loadHistoryBtn.addEventListener('click', loadConversationHistory);
            
            closeBtn.addEventListener('click', () => {
                window.parent.postMessage({
                    type: 'lqd-ext-chatbot-toggle-window'
                }, '*');
            });
            
            window.addEventListener('message', event => {
                if (event.data.type === 'lqd-ext-chatbot-request-styling') {
                    event.source.postMessage({
                        type: 'lqd-ext-chatbot-response-styling',
                        data: {
                            styles: {
                                '--lqd-ext-chat-primary': '\${primaryColor}',
                                '--lqd-ext-chat-primary-foreground': 'white',
                                '--lqd-ext-chat-window-w': '100%',
                                '--lqd-ext-chat-window-h': '100vh',
                            },
                            attrs: {
                                'data-window-state': 'closed'
                            }
                        }
                    }, '*');
                }
            });
            
            if (ablyEnabled && ablyApiKey) {
                try {
                    const ably = new Ably.Realtime(ablyApiKey);
                    const channel = ably.channels.get('chat:' + chatbotId + ':' + sessionId);
                    
                    channel.subscribe('message', (message) => {
                        if (message.data && message.data.role === 'assistant') {
                            if (!message.data.content || !message.data.content.trim()) return;
                            const lastBotMsg = chatMessages.querySelector('.bot-row:last-child .bot-message');
                            if (!lastBotMsg || lastBotMsg.textContent !== message.data.content) {
                                addMessage(message.data.content, false);
                            }
                        }
                    });
                } catch (err) {
                    console.error('Ably connection error:', err);
                }
            }
            
            loadConversationHistory();
        </script>
    </body>
    </html>\`;
}`;

  // Replace everything from "function getIframeHtml(" to the end of the module
  const getIframeIdx = chatHelperCode.indexOf('function getIframeHtml(');
  if (getIframeIdx !== -1) {
    const endModuleExports = `module.exports = {\n    containsEscalationKeyword,\n    findAvailableAgent,\n    getIframeHtml\n};`;
    chatHelperCode = chatHelperCode.substring(0, getIframeIdx) + newGetIframeHtml + '\n\n' + endModuleExports;
    fs.writeFileSync(chatHelperPath, chatHelperCode, 'utf8');
    console.log('helpers/chat.js patched successfully.');
  } else {
    console.error('Could not find getIframeHtml in helpers/chat.js');
  }

  console.log('=== Step 2: Patching controllers/widget.controller.js ===');
  const widgetCtrlPath = path.join(BACKEND_DIR, 'controllers/widget.controller.js');
  let widgetCtrlCode = fs.readFileSync(widgetCtrlPath, 'utf8');
  
  if (!widgetCtrlCode.includes('avatar: chatbot.avatar || chatbot.appearance?.avatar || null')) {
    widgetCtrlCode = widgetCtrlCode.replace(
      /title: chatbot\.name\s*\};(\s*const config = \{)/g,
      `title: chatbot.name,\n      avatar: chatbot.avatar || chatbot.appearance?.avatar || null,\n      statusText: chatbot.statusText || 'Online — here to help'\n    };$1`
    );
    widgetCtrlCode = widgetCtrlCode.replace(
      /\.\.\.chatbot\.config\s*\};(\s*res\.json\(config\);)/g,
      `...chatbot.config,\n      avatar: chatbot.avatar || chatbot.appearance?.avatar || null,\n      statusText: chatbot.statusText || 'Online — here to help'\n    };$1`
    );
    fs.writeFileSync(widgetCtrlPath, widgetCtrlCode, 'utf8');
    console.log('controllers/widget.controller.js patched successfully.');
  }

  console.log('=== Step 3: Patching controllers/chat.controller.js ===');
  const chatCtrlPath = path.join(BACKEND_DIR, 'controllers/chat.controller.js');
  let chatCtrlCode = fs.readFileSync(chatCtrlPath, 'utf8');

  // Ensure getPublicChatbotInfo returns avatar and statusText
  if (!chatCtrlCode.includes('avatar: chatbot.avatar')) {
    chatCtrlCode = chatCtrlCode.replace(
      /welcomeMessage: chatbot\.welcomeMessage,\s*interactionType: chatbot\.interactionType,/,
      `welcomeMessage: chatbot.welcomeMessage,\n        interactionType: chatbot.interactionType,\n        avatar: chatbot.avatar || chatbot.appearance?.avatar || null,\n        statusText: chatbot.statusText || 'Online — here to help',`
    );
  }

  // Ensure sendMessage falls back if response is empty string
  if (!chatCtrlCode.includes('if (!response || !response.trim())')) {
    chatCtrlCode = chatCtrlCode.replace(
      /conversation\.messages\.push\(\{\s*role: 'assistant',\s*content: response,/,
      `if (!response || !response.trim()) {\n      response = chatbot.errorMessage || 'Hello! How can I assist you today? Feel free to ask me anything or schedule an appointment.';\n    }\n\n    conversation.messages.push({\n      role: 'assistant',\n      content: response,`
    );
  }

  fs.writeFileSync(chatCtrlPath, chatCtrlCode, 'utf8');
  console.log('controllers/chat.controller.js patched successfully.');

  console.log('=== Step 4: Patching services/aiChatService.js for max_tokens and reasoning ===');
  const aiServicePath = path.join(BACKEND_DIR, 'services/aiChatService.js');
  let aiServiceCode = fs.readFileSync(aiServicePath, 'utf8');

  // In openRouterRequest, make sure max_tokens is at least 2048 and check reasoning if content is empty
  const oldOpenRouterCreate = `    const completion = await openrouter.chat.completions.create({
      messages: messages,
      model: modelName,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
    });`;

  const newOpenRouterCreate = `    const completion = await openrouter.chat.completions.create({
      messages: messages,
      model: modelName,
      temperature: this.temperature,
      max_tokens: Math.max(Number(this.maxTokens) || 2048, 2048),
      top_p: this.topP,
    });`;

  if (aiServiceCode.includes(oldOpenRouterCreate)) {
    aiServiceCode = aiServiceCode.replace(oldOpenRouterCreate, newOpenRouterCreate);
  }

  const oldOpenRouterReturn = `    return completion.choices[0]?.message?.content || '';`;
  const newOpenRouterReturn = `    let content = completion.choices[0]?.message?.content;
    if (!content && completion.choices[0]?.message?.reasoning) {
      content = completion.choices[0]?.message?.reasoning;
    }
    return (content || '').trim();`;

  if (aiServiceCode.includes(oldOpenRouterReturn)) {
    aiServiceCode = aiServiceCode.replace(oldOpenRouterReturn, newOpenRouterReturn);
  }

  fs.writeFileSync(aiServicePath, aiServiceCode, 'utf8');
  console.log('services/aiChatService.js patched successfully.');

  console.log('=== Step 5: Update Database for Christopher Siegfried Chatbot ===');
  require('/www/wwwroot/api.siegfriedoutreach.com/node_modules/dotenv').config({ path: '/www/wwwroot/api.siegfriedoutreach.com/.env' });
  const { db, connectDB } = require('/www/wwwroot/api.siegfriedoutreach.com/models');
  await connectDB();

  const botId = new mongoose.Types.ObjectId('6a4ba7c65165b7df2307840f');
  
  // Parse trainingData if string
  const rawBot = await db.Chatbot.collection.findOne({ _id: botId });
  let parsedTrainingData = rawBot?.trainingData;
  if (typeof parsedTrainingData === 'string') {
    try {
      parsedTrainingData = JSON.parse(parsedTrainingData);
    } catch (e) {}
  }
  if (!parsedTrainingData || typeof parsedTrainingData !== 'object') {
    parsedTrainingData = { pdfFiles: [], textContent: [], qaPairs: [] };
  }

  const systemInstruction = `You are Christopher Siegfried's dedicated appointment booking and consultation concierge for Siegfried Marketing (christophersiegfried.com).

Your primary directives:
1. Warmly welcome visitors, clinicians, healthcare directors, and practice owners.
2. Answer inquiries about our medical clinic & mental health practice marketing services, HIPAA-compliant patient acquisition, and SEO strategies.
3. Whenever a visitor inquires about booking an appointment, scheduling a consultation, setting up a call, meeting with Christopher Siegfried, pricing, or getting started, warmly invite them to book directly via the Calendly link:
   "You can book an appointment directly on Christopher Siegfried's calendar here: [Schedule on Calendly](https://calendly.com/christophersiegfried) — pick any date and time that fits your schedule!"
4. Never tell the user that you cannot book appointments or that you don't have access. Always provide the Calendly link above.
5. Keep responses warm, concise, professional, and helpful.`;

  await db.Chatbot.collection.updateOne(
    { _id: botId },
    {
      $set: {
        avatar: 'uploads/chatbot/image-1789308649379-0uglli.jpg',
        statusText: 'Online — here to help',
        'appearance.avatar': 'uploads/chatbot/image-1789308649379-0uglli.jpg',
        'appearance.primaryColor': '#3b82f6',
        'appearance.secondaryColor': '#e0f0ff',
        'appearance.buttonColor': '#3b82f6',
        'config.maxTokens': 2048,
        systemInstruction: systemInstruction,
        trainingData: parsedTrainingData
      }
    }
  );
  console.log('Bot 6a4ba7c65165b7df2307840f updated with photo, statusText, maxTokens 2048, and Calendly prompt!');

  // Clean up empty assistant messages in recent conversations
  const convs = await db.Conversation.collection.find({ chatbotId: botId }).toArray();
  for (const conv of convs) {
    if (conv.messages && conv.messages.length > 0) {
      const initialLen = conv.messages.length;
      const cleanedMessages = conv.messages.filter(m => m.content && m.content.trim() !== '');
      if (cleanedMessages.length !== initialLen) {
        await db.Conversation.collection.updateOne(
          { _id: conv._id },
          { $set: { messages: cleanedMessages } }
        );
        console.log('Cleaned up ' + (initialLen - cleanedMessages.length) + ' empty messages from conversation ' + conv._id);
      }
    }
  }

  console.log('=== All Patches Completed Successfully! ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Patch execution failed:', err);
  process.exit(1);
});
