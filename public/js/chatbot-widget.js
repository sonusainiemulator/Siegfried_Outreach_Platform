/**
 * Siegfried Outreach - Universal Chatbot Widget Loader
 * https://siegfriedoutreach.com
 */
(function () {
  'use strict';

  // Prevent multiple initializations on the same page
  if (window.__SO_CHATBOT_WIDGET_LOADED__) return;
  window.__SO_CHATBOT_WIDGET_LOADED__ = true;

  function init() {
    const scriptTag = (function () {
      if (document.currentScript) return document.currentScript;
      const scripts = document.querySelectorAll('script[data-chatbot-uuid]');
      return scripts[scripts.length - 1];
    })();

    if (!scriptTag) {
      console.error('[Siegfried Chatbot] Script tag with data-chatbot-uuid not found.');
      return;
    }

    const chatBotUuid = scriptTag.getAttribute('data-chatbot-uuid');
    if (!chatBotUuid) {
      console.error('[Siegfried Chatbot] data-chatbot-uuid is required.');
      return;
    }

    const iframeWidthAttr = scriptTag.getAttribute('data-iframe-width');
    const iframeHeightAttr = scriptTag.getAttribute('data-iframe-height');
    const positionAttr = scriptTag.getAttribute('data-position'); // 'bottom-right' or 'bottom-left'
    let language = scriptTag.getAttribute('data-language') || 'en';

    if (document.querySelector('html')?.getAttribute('lang')) {
      const htmlLang = document.querySelector('html').getAttribute('lang');
      if (htmlLang) language = htmlLang;
    }

    let hostOrigin;
    try {
      hostOrigin = new URL(scriptTag.src).origin;
    } catch (e) {
      hostOrigin = 'https://siegfriedoutreach.com';
    }

    const configUrl = hostOrigin + '/api/widget/config/' + chatBotUuid;
    const iFrameUrl = hostOrigin + '/api/chat/chatbot/' + chatBotUuid + '/iframe';

    // Fetch config asynchronously
    fetch(configUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load widget configuration');
        return res.json();
      })
      .catch(function (err) {
        console.warn('[Siegfried Chatbot] Using fallback configuration:', err);
        return {};
      })
      .then(function (config) {
        buildWidget(config || {});
      });

    function buildWidget(config) {
      const primaryColor = config.primaryColor || config.buttonColor || '#3b82f6';
      const welcomeMsg = config.bubble_message || config.welcomeMessage || '';
      const title = config.title || 'Chat with us';
      const avatar = config.avatar || '';

      let avatarUrl = '';
      if (avatar) {
        if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
          avatarUrl = avatar;
        } else {
          avatarUrl = hostOrigin + '/' + avatar.replace(/^\/+/, '');
        }
      }

      // Dimensions
      let width = iframeWidthAttr ? (iframeWidthAttr.endsWith('px') ? iframeWidthAttr : iframeWidthAttr + 'px') : '400px';
      let height = iframeHeightAttr ? (iframeHeightAttr.endsWith('px') ? iframeHeightAttr : iframeHeightAttr + 'px') : '580px';

      if (!iframeWidthAttr && !iframeHeightAttr) {
        if (config.size === 'small') {
          width = '320px';
          height = '460px';
        } else if (config.size === 'large') {
          width = '460px';
          height = '640px';
        }
      }

      const position = positionAttr || config.position || 'bottom-right';
      const isLeft = position.indexOf('left') !== -1;

      // Create container wrapper
      const wrap = document.createElement('div');
      wrap.id = 'lqd-ext-chatbot-wrap';
      wrap.setAttribute('data-window-state', 'closed');
      wrap.setAttribute('data-pos-x', isLeft ? 'left' : 'right');
      wrap.setAttribute('data-pos-y', 'bottom');

      // Stylesheet
      const style = document.createElement('style');
      style.textContent = `
        #lqd-ext-chatbot-wrap {
          position: fixed;
          bottom: 24px;
          ${isLeft ? 'left: 24px;' : 'right: 24px;'}
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          align-items: ${isLeft ? 'flex-start' : 'flex-end'};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          color: #0f172a;
          line-height: 1.5;
          pointer-events: none;
        }

        #lqd-ext-chatbot-wrap * {
          box-sizing: border-box;
          pointer-events: auto;
        }

        /* Iframe Window Wrap */
        #lqd-ext-chatbot-iframe-wrap {
          width: ${width};
          height: ${height};
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 100px);
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px -10px rgba(15, 23, 42, 0.25), 0 10px 25px -5px rgba(15, 23, 42, 0.15);
          display: none;
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(12px) scale(0.96);
          transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: ${isLeft ? 'bottom left' : 'bottom right'};
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        #lqd-ext-chatbot-wrap[data-window-state='open'] #lqd-ext-chatbot-iframe-wrap {
          display: block;
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        #lqd-ext-chatbot-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: transparent;
        }

        /* Welcome Message Teaser Bubble */
        #lqd-ext-chatbot-trigger-bubble {
          position: relative;
          margin-bottom: 12px;
          background: #ffffff;
          color: #1e293b;
          padding: 12px 18px 12px 14px;
          border-radius: 14px;
          box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 8px -2px rgba(0, 0, 0, 0.08);
          font-size: 13.5px;
          font-weight: 500;
          max-width: 280px;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        #lqd-ext-chatbot-trigger-bubble:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.16);
        }

        #lqd-ext-chatbot-trigger-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          ${isLeft ? 'left: 24px;' : 'right: 24px;'}
          width: 12px;
          height: 12px;
          background: #ffffff;
          transform: rotate(45deg);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          ${isLeft ? 'border-left: 1px solid rgba(0, 0, 0, 0.06);' : 'border-right: 1px solid rgba(0, 0, 0, 0.06);'}
        }

        #lqd-ext-chatbot-trigger-bubble p {
          margin: 0;
          flex: 1;
        }

        .lqd-bubble-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .lqd-bubble-close:hover {
          color: #475569;
          background: #f1f5f9;
        }

        #lqd-ext-chatbot-wrap[data-window-state='open'] #lqd-ext-chatbot-trigger-bubble {
          display: none !important;
        }

        /* Floating Trigger Button */
        .lqd-ext-chatbot-trigger {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: none;
          background: ${primaryColor};
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background 0.2s ease;
          outline: none;
          padding: 0;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .lqd-ext-chatbot-trigger:hover {
          transform: scale(1.06);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
        }

        .lqd-ext-chatbot-trigger:active {
          transform: scale(0.95);
        }

        .lqd-icon-chat, .lqd-icon-close {
          width: 26px;
          height: 26px;
          transition: transform 0.2s ease;
        }

        .lqd-trigger-avatar-wrap {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lqd-trigger-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .lqd-trigger-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 13px;
          height: 13px;
          background: #10b981;
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          z-index: 2;
        }

        .lqd-trigger-online-dot::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 1.5px solid #10b981;
          animation: lqd-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes lqd-pulse {
          0% { transform: scale(0.9); opacity: 1; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .lqd-bubble-avatar {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        #lqd-ext-chatbot-wrap[data-window-state='closed'] .lqd-icon-chat,
        #lqd-ext-chatbot-wrap[data-window-state='closed'] .lqd-trigger-avatar-wrap,
        #lqd-ext-chatbot-wrap[data-window-state='closed'] .lqd-trigger-online-dot {
          display: flex;
        }
        #lqd-ext-chatbot-wrap[data-window-state='closed'] .lqd-icon-close {
          display: none !important;
        }

        #lqd-ext-chatbot-wrap[data-window-state='open'] .lqd-icon-chat,
        #lqd-ext-chatbot-wrap[data-window-state='open'] .lqd-trigger-avatar-wrap,
        #lqd-ext-chatbot-wrap[data-window-state='open'] .lqd-trigger-online-dot {
          display: none !important;
        }
        #lqd-ext-chatbot-wrap[data-window-state='open'] .lqd-icon-close {
          display: block !important;
        }

        /* Mobile Screen Adaptations */
        @media (max-width: 480px) {
          #lqd-ext-chatbot-wrap[data-window-state='open'] {
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            padding: 0 !important;
          }
          #lqd-ext-chatbot-wrap[data-window-state='open'] #lqd-ext-chatbot-iframe-wrap {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            margin-bottom: 0 !important;
            border: none !important;
          }
          #lqd-ext-chatbot-wrap[data-window-state='open'] .lqd-ext-chatbot-trigger {
            display: none !important;
          }
        }
      `;

      // Build inner HTML safely
      wrap.appendChild(style);

      // 1. Iframe Container
      const iframeWrap = document.createElement('div');
      iframeWrap.id = 'lqd-ext-chatbot-iframe-wrap';

      const iframe = document.createElement('iframe');
      iframe.id = 'lqd-ext-chatbot-iframe';
      iframe.name = 'lqd-ext-chatbot-iframe';
      iframe.src = iFrameUrl;
      iframe.title = title;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('crossorigin', 'anonymous');

      iframe.addEventListener('load', function () {
        try {
          iframe.contentWindow.postMessage(
            { type: 'lqd-ext-chatbot-request-styling' },
            hostOrigin
          );
        } catch (e) {}
      });

      iframeWrap.appendChild(iframe);
      wrap.appendChild(iframeWrap);

      // 2. Welcome Message Teaser Bubble
      if (welcomeMsg && welcomeMsg.trim() !== '') {
        const bubble = document.createElement('div');
        bubble.id = 'lqd-ext-chatbot-trigger-bubble';
        
        if (avatarUrl) {
          const bubbleAvatar = document.createElement('img');
          bubbleAvatar.src = avatarUrl;
          bubbleAvatar.alt = title;
          bubbleAvatar.className = 'lqd-bubble-avatar';
          bubbleAvatar.onerror = function () { this.style.display = 'none'; };
          bubble.appendChild(bubbleAvatar);
        }

        const bubbleText = document.createElement('p');
        bubbleText.textContent = welcomeMsg;
        bubble.appendChild(bubbleText);

        const bubbleClose = document.createElement('button');
        bubbleClose.className = 'lqd-bubble-close';
        bubbleClose.innerHTML = '&times;';
        bubbleClose.setAttribute('aria-label', 'Close message');
        bubbleClose.addEventListener('click', function (e) {
          e.stopPropagation();
          bubble.remove();
        });
        bubble.appendChild(bubbleClose);

        bubble.addEventListener('click', function () {
          toggleWidget(true);
        });

        wrap.appendChild(bubble);
      }

      // 3. Floating Trigger Button
      const triggerBtn = document.createElement('button');
      triggerBtn.className = 'lqd-ext-chatbot-trigger';
      triggerBtn.setAttribute('aria-label', 'Open chat');

      triggerBtn.innerHTML = `
        ${avatarUrl ? `
          <div class="lqd-trigger-avatar-wrap">
            <img class="lqd-trigger-avatar" src="${avatarUrl}" alt="${title}" onerror="this.parentNode.style.display='none'; this.closest('button').querySelector('.lqd-icon-chat').style.display='block';" />
          </div>
          <svg class="lqd-icon-chat" style="display: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        ` : `
          <svg class="lqd-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        `}
        <span class="lqd-trigger-online-dot"></span>
        <svg class="lqd-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;

      function toggleWidget(forceOpen) {
        const isCurrentlyOpen = wrap.getAttribute('data-window-state') === 'open';
        const nextState = forceOpen !== undefined ? (forceOpen ? 'open' : 'closed') : (isCurrentlyOpen ? 'closed' : 'open');
        wrap.setAttribute('data-window-state', nextState);
        triggerBtn.setAttribute('aria-label', nextState === 'open' ? 'Close chat' : 'Open chat');
      }

      triggerBtn.addEventListener('click', function () {
        toggleWidget();
      });

      wrap.appendChild(triggerBtn);
      document.body.appendChild(wrap);

      // Listen for postMessage from inside the chatbot iframe
      window.addEventListener('message', function (event) {
        if (event.origin !== hostOrigin) return;

        if (event.data && event.data.type === 'lqd-ext-chatbot-toggle-window') {
          toggleWidget(false);
        } else if (event.data && event.data.type === 'lqd-ext-chatbot-response-styling') {
          // Additional custom styles if provided by iframe
          if (event.data.data && event.data.data.styles) {
            const styles = event.data.data.styles;
            for (const key in styles) {
              if (Object.prototype.hasOwnProperty.call(styles, key)) {
                wrap.style.setProperty(key, styles[key]);
              }
            }
          }
        }
      });
    }
  }

  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
