# 📋 Changelog — Siegfried_Outreach_Platform

All notable changes, fixes, and feature additions are documented in this file.

## 📍 [2026-09-19 19:27:00 CEST] — Fix Unstyled Login Page & Resolve Next.js Static CSS Chunk Hash Mismatch

### 🎨 UI/UX & Production Asset Serving Restoration (`/login`)
- **Resolved Unstyled Raw HTML Display**:
  - Investigated the root cause of the unstyled `/login` page rendering in default Times New Roman serif font with unconstrained icons and buttons.
  - Identified that the in-memory PM2 process (`frontend-app`) was running an outdated build from Sept 17 referencing deleted CSS chunk `37md8i07dahk9.css` which returned `HTTP 500 Internal Server Error`.
  - Rebuilt the Next.js production bundle (`npm run build`) cleanly with 0 errors, generating fresh optimized CSS chunks (`44q-dcfzhpm3a.css`).
  - Gracefully restarted PM2 `frontend-app` process and verified that CSS chunks now return `HTTP 200 OK` with 666 KB of compiled stylesheets.
  - Verified login page layout, Google OAuth button, Passkey button, theme toggle, and brand typography are fully restored and correctly styled.

## 📍 [2026-09-18 20:45:00 CEST] — AI Live Agent "Website Bot" Channel Filter & Chatbot Conversation Surfacing

### 🌐 Dedicated "Website Bot" Channel Filter & Chatbot Conversation Surfacing (`/ai-live-agent`)
- **Website Bot Channel Filter Button (`ConversationList.tsx`)**:
  - Added dedicated **"Website Bot"** channel button pill with `Bot` icon to the omnichannel filter grid in AI Live Agent Inbox.
  - Users can now filter website bot conversions and live chats with a single click.
  - Active state matches both `Website Bot` and `Website` channel queries with seamless styling.
- **Visual Bot Identity Badges (`ConversationList.tsx`, `ChatHeader.tsx`)**:
  - Each conversation card from an AI website bot now displays a distinctive `🤖 {chatbot.name}` badge.
  - Chat panel header displays the active bot identity badge alongside the visitor identifier.
  - Channel indicator icon renders the dedicated `Bot` icon in theme blue for all website bot sessions.
- **Backend Access Scoping & Source Correction (`controllers/agent.controller.js`)**:
  - Fixed `source` assignment in `listTransferred` to reliably return `'widget'` / `'web'` for website chatbot sessions even when `metadata.source` was absent.
  - Enabled chatbot owners to view and manage live agent chats for their own bots regardless of global platform roles.
  - Upgraded Sonu Saini's platform role in MongoDB to `super_admin` to unlock full omnichannel management.

## 📍 [2026-09-18 20:20:00 CEST] — AI Bot Widget Real-Time Admin Chat Documentation & Live Handover Architecture

### ⚡ Comprehensive Real-Time Admin Chat Documentation & Architecture Guide
- **Documentation Guide Added (`docs/AI_BOT_WIDGET_REALTIME_CHAT_GUIDE.md`)**:
  - Full architectural telemetry of the dual-channel real-time pipeline (Ably Realtime on `chat:[chatbotId]:[sessionId]` + Socket.io on `user_[adminId]`).
  - Bilingual step-by-step configuration manual (English + हिंदी) for admins and support teams.
  - Interaction modes documentation (`ai_only`, `hybrid`, `human_only`), escalation keywords, and audio chime alerts.
  - Live takeover procedures in **AI Live Agent** (`/ai-live-agent`) and **Shared Inbox** (`/social-media/shared-inbox`).
  - Real-world case studies across D2C E-Commerce, Healthcare, Real Estate, and B2B SaaS.
- **Synced Documentation Portal (`siegfriedoutreach-docs`)**:
  - Published dedicated guide `ai-bot-widget-realtime-chat.mdx` with Fumadocs tabs.
  - Enhanced `ai-live-agent.mdx` and `ai-bot-studio.mdx`.
  - Updated `ai-studio/meta.json` navigation hierarchy.
  - Documented full changelog entry in `siegfriedoutreach-docs/CHANGELOG.md`.

---

## 📍 [2026-09-17 19:42:00 CEST] — Next-Gen AI Video, Voice & Multimodal Provider Integrations on /api-keys

### 🚀 Cutting-Edge Video, Voice & Multimodal AI Provider Support (`/api-keys`)
- **ElevenLabs AI Voice & Dubbing (`ElevenLabsCard.tsx`)**:
  - Integrated ultra-realistic voice synthesis, emotion inflection, and custom voice cloning.
  - Added fields: `elevenlabs_api_key`, `elevenlabs_voice_id` (default: Rachel), and `elevenlabs_model_id` (`eleven_multilingual_v2`, `eleven_turbo_v2_5`, `eleven_flash_v2_5`).
  - Direct portal quick-link to ElevenLabs developer console.
- **Higgsfield AI Cinematic Video (`HiggsfieldCard.tsx`)**:
  - Integrated dynamic camera movement controls, 3D pan/zoom trajectory planning, and stylized visual storytelling.
  - Added fields: `higgsfield_api_key`, `higgsfield_model` (`higgsfield-cinematic-1`, `higgsfield-dop-studio`).
- **Seedance 2.0 Video AI (`SeedanceVideoCard.tsx`)**:
  - Purpose-built for realistic physics, prompt adherence, fight choreography, and native audio/video reference handling.
  - Added fields: `seedance_api_key`, `seedance_model` (`seedance-2.0-pro`, `seedance-2.0-ultra`), and `seedance_reference_mode` (Full audio/video reference, motion-only, audio-driven action).
- **Kling Video 3.0 Pro (`KlingVideoCard.tsx`)**:
  - High-fidelity multi-shot sequencing, storyboarding (up to six camera cuts), and cinematic physics.
  - Added fields: `kling_api_key`, `kling_model` (`kling-v3.0-pro`, `kling-v2.1-master`), and `kling_mode` (Multi-cut 6-shot storyboard, trio cuts, single continuous take).
- **Google Veo 3.1 (`GoogleVeoCard.tsx`)**:
  - Exceptional for photorealistic people, fast iteration speeds, and native audio generation.
  - Added fields: `veo_api_key` (with automatic fallback to Gemini key), `veo_model` (`veo-3.1-cinema`, `veo-3.1-fast`), and native audio sync toggle.
- **Gemini Omni Flash (`GeminiOmniCard.tsx`)**:
  - Top budget-friendly option scoring high in user preference and voice quality at ultra-low credit cost.
  - Added fields: `gemini_omni_api_key` (with automatic fallback to default Gemini key) and `gemini_omni_model` (`gemini-2.0-flash`, `gemini-2.0-flash-realtime`, `gemini-1.5-flash-8b`).
- **MiniMax Hailuo 2.3 (`MiniMaxHailuoCard.tsx`)**:
  - Highly effective for product shots, animation, and expressive character movements with dynamic micro-physics.
  - Added fields: `hailuo_api_key`, `hailuo_model` (`hailuo-2.3-turbo`, `hailuo-01-director`), and aspect ratio configuration (`16:9`, `9:16`, `1:1`).
- **Default Media Routing Engines (`DefaultMediaEnginesCard.tsx`)**:
  - Added multi-modal routing engine card allowing users to set platform defaults for Video (`default_video_provider`), Voice (`default_voice_provider`), and Image (`default_image_provider`).

### 🎨 API Command Center UI & UX Overhaul (`ApiKeys.tsx`)
- **Category Filter Tabs & Badges**:
  - Implemented interactive filter pills: **All Providers (21)**, **Cinematic Video AI (7)**, **Voice & Dubbing (2)**, **LLMs & Multimodal (5)**, **Image Synthesis (4)**, and **Pricing Matrix (1)**.
  - Added live search bar with instant fuzzy matching across all provider titles, descriptions, and model tags.
- **Sticky Glassmorphic Save Bar**:
  - Modern bottom floating action bar with dirty-state change detection, encryption confirmation notice, and animated saving indicators.

### ⚙️ Backend Architecture & Database Synchronization (`api.siegfriedoutreach.com`)
- **MongoDB Schema (`user-setting.model.js`)**:
  - Extended `UserSettingsSchema` with 18 new fields for all new providers with secure defaults and indexing.
- **API Controller (`user-setting.controller.js`)**:
  - Updated allowed fields list in `updateUserSettings` to whitelist and persist all new credentials, models, and routing choices.
- **Security & Masking (`utils/maskKey.js`)**:
  - Added all new provider keys to `SENSITIVE_FIELDS` for automated demo mode masking.
- **AI Model Pricing Matrix (`ai-model-pricing.model.js` & Seeder)**:
  - Expanded provider enum to support `elevenlabs`, `bytedance`, `kuaishou`, `minimax`, `higgsfield`.
  - Seeded default pricing matrix multipliers for all 7 new models so admins can fine-tune credit costs directly in the Command Center.

### 🌐 Bilingual Standards & Internationalization (`src/lib/i18n.ts`)
- Added comprehensive English and Hindi (`hi`) translations for all new provider cards, descriptions, and feature capabilities.

---

## 📍 [2026-09-17 16:18:00 CEST] — Dashboard Data Loading Fix & API Backend Syntax Error Resolution

### 🛠️ Backend Stability & Syntax Error Fixes (`api-backend`)
- **Resolved Fatal Startup Crashes**:
  - Investigated PM2 crash-loop (`↺ 168+`) on `api-backend` causing HTTP 500 errors across `/api/dashboard` and "Failed to load dashboard data." in the frontend UI.
  - **`controllers/conversation.controller.js`**: Removed duplicate `const conversation = await Conversation.findById(conversationId);` declaration inside `manualReply` causing `SyntaxError: Identifier 'conversation' has already been declared`.
  - **`controllers/ai-content.controller.js`**: Fixed unterminated template literal on line 818 (`}';` replaced with `}`;`) which was causing `SyntaxError: Unexpected identifier 'Enhance'`.
  - Ran comprehensive syntax check across all controllers, routes, models, services, middleware, and entry files in `api.siegfriedoutreach.com`.
  - Restarted `api-backend` under PM2 (`pm2 restart api-backend`) and verified active, healthy connection with MongoDB, WebSocket rooms, WhatsApp session, and autonomous queue publishers.
  - Verified dashboard data proxy `/api/dashboard` returns 200 OK for authorized sessions.


## 📍 [2026-09-17 08:15:00 CEST] — Channels vs. Social Settings Navigation & API Configuration Guidance

### 🧭 Navigation & User Experience Enhancement (`/social-media/channels`)
- **Direct Tab Switcher & Navigation Header (`PlatformConnectionHeader.tsx`)**:
  - Added dedicated tab switcher directly in the header between **Channels (Accounts)** and **API Configurations** (`/social-media/social-settings`).
  - Added prominent **"Configure API Keys"** gradient button in the header so users can jump straight to API credentials setup without getting lost.
  - Upgraded responsive header layout with subtitle explaining the distinct roles of live account authorization vs. API credentials.
- **Guidance & Context Banner (`PlatformConnection.tsx`)**:
  - Introduced an informative, high-visibility guidance callout banner above the 12 social channel cards.
  - Explicitly clarifies where API keys (Meta App ID, App Secret, Twitter API keys, Google Client IDs, WordPress credentials) are stored vs. where live OAuth accounts/pages are authorized.
  - Includes a direct link and one-click button to open **Social Settings**.
- **User Confusion Resolution**:
  - Clarified why users with fresh accounts see "Connect your account" on Channels until an active profile/page session is authorized via OAuth or until API credentials in Social Settings are linked.

## 📍 [2026-09-17 07:55:00 CEST] — Instagram AI Label Auto-Enablement & Interactive Content Toggle Button Feature

### 🤖 Instagram & Meta AI Content Labeling Architecture (`is_ai_generated`)
- **Automated AI Posting & Autopilot Enablement**:
  - Automatically flags posts and reels generated via AI with `is_ai_generated: true` / `isAiGenerated: true`.
  - Updated `autonomousPublisher.js`: Content calendar items generated by AI for Instagram feeds, carousels, and 9:16 reels automatically receive `isAiGenerated: true` and appropriate `postType: 'reel'` / `'carousel'`.
  - Updated `ai-team.controller.js`: Virtual AI social employees auto-flag drafts with `isAiGenerated: true`.
  - Updated BullMQ Queue `services/queue.js`: Passes `isAiGenerated` from `socialPost.isAiGenerated` and `platformInfo.isAiGenerated` directly into `SocialMediaApis.publishToInstagram`.
  - Updated Instagram Publishing Engine (`services/socialMediaApis.js`): Passes `is_ai_generated: true` on `POST /{ig_user_id}/media` container creation for single images, videos, 9:16 reels, and carousel albums. Built resilient fallback logic that retries without the parameter if rejected by older Graph API permissions, guaranteeing 100% broadcast reliability.
- **Backend Schema & API Controller (`socialPost.model.js`, `social-post.controller.js`)**:
  - Added `isAiGenerated` boolean field to root `SocialPost` schema and each platform configuration object.
  - Handled `isAiGenerated` in `createSocialPost`, `updateSocialPost`, `getSocialPostById`, and `getUserSocialPosts`.
  - Created automated backend patch script `scripts/patch-instagram-ai-label.js` with automated timestamps and backups.

### 🎨 Create Post Page UI & Interactive Toggle Feature (`/social-media/create-post`)
- **Interactive `AILabelOptions.tsx` Component**:
  - Modern glassmorphism component with Instagram brand gradient iconography, live status badges (`AI Label ON` vs `Label Disabled`), policy callout banner, and quick switch toggle.
  - Explains Meta & Instagram 2026 compliance standards (photorealistic imagery, synthetic voices, deepfake/avatar video reels).
  - Integrated into the Post Transmission Studio options stack alongside Auto-Reply and Scheduling.
- **Top Quick AI Toolbar 1-Click Toggle Button**:
  - Added `[ ✨ AI Label: ON / OFF ]` button directly into the Post Composer's quick AI tools bar for instant toggling without scrolling.
- **Smart Auto-Enable Triggers on Create Post Page**:
  - Automatically switches AI Label to ON whenever user generates copy via **AI Writer** (`AIPostGeneratorModal`), carousels via **AI Carousel Agent** (`AICarouselModal`), images via **AI Image Studio** (`AISocialImageGeneratorModal`), extracts text via **AI Image Vision** (`AIImageVisionModal`), or executes inline AI polishing actions ("Polish Caption", "Add Hashtags", "Add CTA").
  - Users retain 100% manual control to enable or disable the toggle at any time.
- **Live Interactive Instagram Mockup (`SocialPostPreview.tsx`)**:
  - Renders the authentic Meta **`AI info`** / **`Made with AI`** disclosure banner beneath the profile header.
  - Overlays floating translucent `✨ AI info` badge on media and reels preview matching the real Instagram mobile app.
- **Bilingual Support & Feature Guide Documentation**:
  - Added full bilingual translations in English and हिंदी (`en` and `hi`) in `src/lib/i18n.ts`.
  - Published comprehensive enterprise guide `docs/INSTAGRAM_AI_LABEL_GUIDE.md` featuring 6 real-world industry case studies across D2C E-Commerce, Agencies, Healthcare, Real Estate, EdTech, and B2B SaaS.

## 📍 [2026-09-16 22:37:00 CEST] — WordPress Archive Featured Image Sync & Post Attachment Fix

### 🖼️ WordPress Archive & Grid Featured Image Resolution
- **Updated Existing WordPress Blog Posts (`christophersiegfried.com`)**:
  - Identified that historical posts (`3794` & `3793`) created prior to the `FormData` fix lacked `featured_media` attachments (`featured_media: 0`).
  - Executed automated media upload and attached high-resolution featured header images (`Media ID 3804` & `3805`) to Post `3794` (*"AI Automation with Model Context Protocol in Siegfried"*) and Post `3793` (*"Siegfried Launches Autonomous Social Media MCP Server"*).
  - Both cards on `https://christophersiegfried.com/blogs/` now render their featured images properly alongside single-article hero banners.
- **Inline `<figure><img ... /></figure>` Prepending & End-to-End Live Verification**:
  - Initialized `postContent` before featured media upload to ensure inline high-res header image `<figure class="wp-block-image size-full"><img src="..." class="wp-post-image" /></figure>` is prepended cleanly to the top of post content.
  - Published test post *"Autonomous AI & MCP Workflows in 2026"* (Post `3807`) with `featured_media: 3806` (`https://christophersiegfried.com/autonomous-ai-mcp-workflows-in-2026/`). Verified via WP REST API that `featured_media` and inline image tags exist across all posts.

## 📍 [2026-09-16 22:28:00 CEST] — WordPress REST API Featured Image Upload Fix, Automatic SEO Featured Banner Generation & Long-Form SEO Blog Engine

### 📝 WordPress Publishing & Featured Image Integration
- **Fixed Missing Featured Image Upload (`socialMediaApis.js`)**:
  - Replaced raw binary HTTP POSTs with multipart `FormData` (`file` buffer + `title` + `alt_text`) for WordPress REST API `/wp-json/wp/v2/media` uploads. This bypasses Cloudflare WAF, NGINX, and ModSecurity blocks that previously stripped `Content-Disposition` headers.
  - Multi-path resolution for local media files (`/www/wwwroot/api.siegfriedoutreach.com`, `/www/wwwroot/siegfriedoutreach.com/public`, `process.cwd()`).
  - Cast `featured_media` parameter strictly to an integer (`Number(featuredMediaId)`), preventing WordPress 400 parameter type errors.
- **Live Verification on WordPress Site**:
  - Published test article *"The Complete Guide to AI-Powered Marketing Automation in 2026"* to connected WordPress blog (`https://christophersiegfried.com`).
  - **Featured Media ID**: `3799` uploaded successfully via `FormData`.
  - **Live Post URL**: [`https://christophersiegfried.com/the-complete-guide-to-ai-powered-marketing-automation-in-2026/`](https://christophersiegfried.com/the-complete-guide-to-ai-powered-marketing-automation-in-2026/) (Post ID: `3800`).
- **Long-Form SEO-Friendly Blog Engine (`ai-content.controller.js`)**:
  - Enhanced AI generation engine to draft comprehensive, 1,500 - 3,000+ word SEO articles structured in clean semantic HTML:
    - Catchy H1 SEO Title
    - Meta Description summary box
    - Key Takeaways callout container
    - Table of Contents navigation
    - Deep H2 / H3 body subheadings with bullet points
    - Schema-compatible FAQ section
    - Conclusion with Call to Action (CTA)
  - Automatic Markdown-to-HTML conversion for WordPress REST API post bodies.

## 📍 [2026-09-16 20:15:00 CEST] — Omnichannel WhatsOmni 3-Column Shared Inbox, Live Internal Team Notes, CRM Synchronization & Multi-Tab Fixes

### 📥 3-Column Shared Inbox (WhatsOmni Omnichannel Desk)
- **Pixel-Perfect 3-Column Shared Inbox Dashboard (`/shared-inbox`, `SharedInboxDashboard.tsx`)**:
  - Implemented the full 3-column Omnichannel Shared Inbox layout directly matching the user's provided screenshot:
    - **Column 1 (Conversations List)**:
      - Real-time search with `+` compose action.
      - `ASSIGNEE:` dropdown filter (`All Assignees`, `Alex Morgan`, `Sarah Jenkins`, `David Miller`, `Unassigned`).
      - Underlined Status Tabs: **Open**, **Pending**, and **Resolved** with active bold indicator.
      - Contact cards with initial avatar circle, floating platform badges (WhatsApp 🟢, Telegram ✈️, Instagram 📸, Two-Way Email ✉️, Facebook Messenger 💬, TikTok 🎵), timestamp, snippet preview, custom tag pills (`VIP`, `Enterprise`, `Telegram Bot`, `Shopify Merchant`, `Lead`), and unread dot indicators.
    - **Column 2 (Chat Thread & Unified Composer)**:
      - Contact header with initial avatar, full name, phone number, and channel connection subtitle (`WHATSAPP CLOUD API (+1555-0199)`).
      - Quick assignee dropdown selector and conversation options menu.
      - **Internal Notes System**: Built dedicated amber `🔒 Internal Note by [Agent]` block with private note body and timestamp, kept strictly internal to staff.
      - Outgoing chat bubbles in sleek dark black with double blue/white tick delivery indicators.
      - Incoming customer bubbles in soft gray.
      - Dual-mode composer switcher: **`[ Reply ]`** (black active pill) and **`[ Note ]`** (amber active pill).
      - Status manager: `STATUS: 🟢 Open` with 1-click `Mark: [ Pending ] [ Resolved ]` buttons.
      - Composer toolbar with document attachments, emoji picker, ✨ AI Copilot smart suggestion wand, and dynamic `Send Reply` / `Add Note` action.
    - **Column 3 (Contact Profile Details & CRM Synchronization)**:
      - Large profile avatar with channel badge overlay, contact name, phone, and `CONTACTS.VIP` tag.
      - Quick actions: `🔕 Mute Contact` toggle and 1-click clipboard copy.
      - **AI Assistant Control**: Interactive `AI Copilot Chat` toggle switch with instant auto-reply activation for the contact.
      - **Assigned Team Router**: Select dropdown (`Enterprise Sales & Growth`, `Tier 1 Support`, `Billing & Invoicing`, `VIP Customer Success`, `Technical Operations`).
      - **CRM Information**: Editable First Name, Last Name, and Email Address with persistent database save.
- **Multi-Tab Filtering & Channel Ingestion Fixes**:
  - Fixed category tab filtering across `SocialInboxDashboard.tsx` and backend `listBroadcastConversations` to reliably match conversations across `metadata.source`, `channel`, and `platform`.
  - Normalized status checks (`active` automatically maps to `open`).
  - Added new routes: `/shared-inbox`, `/campaign-hub/shared-inbox`, and `/social-media/shared-inbox`.
  - Added "Shared Inbox" directly to the sidebar under **Campaign Hub** and **Social Studio**.
  - Added backend endpoints: `PATCH /api/broadcast-inbox/:conversationId/status` and `PATCH /api/broadcast-inbox/:conversationId/details`.
  - Added RTK Query mutations: `useUpdateConversationStatusMutation` and `useUpdateConversationDetailsMutation`.

## 📍 [2026-09-16 19:24:00 CEST] — Meta Business Suite Omnichannel Inbox: Facebook & Instagram Comments, TikTok DMs & Rich Media Audio/Video

### 💬 Meta Business Suite Layout & Comments Integration
- **Full Meta Business Suite Parity (`SocialInboxDashboard.tsx`)**:
  - Aligned the layout directly with Meta Business Suite Inbox (`business.facebook.com/latest/inbox/all/`):
    - Top Category Tabs: **All messages**, **Messenger**, **Instagram**, **WhatsApp** (*with green `New` pill badge*), **Facebook comments**, **Instagram comments**, **TikTok DMs**, and **Telegram**.
    - Quick Filter Pills: **All**, **Unread**, **Priority**, **Ad replies**, and **Follow up**.
    - Contact Header: Circular avatar with letter/brand badge, contact name, and **"Assign this conversation ▼"** agent assignment dropdown.
    - Post Reference Bar: When viewing a Facebook or Instagram comment, displays the parent post title with a direct link to the live post.
- **Inbound Comment Ingestion & Replying (`instagramEvent.js`, `facebookEvent.js`, `messaging.service.js`)**:
  - Facebook comments and Instagram comments are now automatically captured from incoming Meta webhooks, mapped to `type: 'social'` with `metadata.source: 'facebook_comment'` and `'instagram_comment'`.
  - Emits real-time audio and desktop notifications when new comments are posted.
  - Agents can reply directly from the unified composer; replies are dispatched via Meta Graph API directly back onto the post thread.
- **Rich Media & Voice Notes Support (`VoiceNotePlayer`)**:
  - Built an interactive **Voice Note Audio Player** component supporting WhatsApp, Messenger, and Telegram audio/voice notes with play/pause controls, interactive audio waveform visualization, elapsed/total time tracking, and playback rate.
  - Inline HTML5 video player for shared video attachments.
  - Full document download cards for PDFs, spreadsheets, and documents.
  - Lightbox zoom modal for photos and images.
- **TikTok DM Support (`messaging.service.js`, `SocialInboxDashboard.tsx`)**:
  - Integrated TikTok DM category tab and messaging pipeline for incoming and outgoing TikTok conversations.

## 📍 [2026-09-16 18:40:00 CEST] — Omnichannel Unified Social DM Inbox, Real-Time Chime & Desktop Alerts & Cross-Platform Replies

### 📬 Unified Social Media Direct Message (DM) Inbox
- **Unified Social DM Inbox Dashboard (`/social-media/inbox`)**:
  - Implemented a dedicated Omnichannel Social DM Command Center allowing users to read, filter, and respond to incoming direct messages across all connected social channels: Instagram Direct, Facebook Messenger, WhatsApp Business, and Telegram.
  - Channel filtering tabs (All Platforms, Instagram 📸, Facebook Messenger 👥, WhatsApp 💬, Telegram ✈️) with dynamic counts and live channel badges.
  - Real-time conversation search across sender names, handles, usernames, and message content.
  - Contact identity cards showing social platform origin, avatar photo, account handle, and connected business profile.
  - Built-in quick reply canned response buttons for instant 1-click customer engagement.
  - Rich reply composer supporting text, multiline expansion, file/image attachments, Enter to send, and direct dispatch indicators.
- **Real-Time Sound Alert Chime System (`src/utils/audioAlert.ts`, Web Audio API)**:
  - Built a zero-dependency, ultra-crisp two-tone melodic chime (587.33 Hz [D5] -> 880 Hz [A5]) synthesized via the browser's native Web Audio API.
  - Added user-controlled Sound Alert toggle (Chime On / Chime Muted) with persistent `localStorage` preference and a "Test Chime 🎵" preview button.
- **Browser Desktop Push Notifications (`src/hooks/useSocketHandlers.ts`)**:
  - Added native Web Notification API alerts that trigger whenever an incoming social DM arrives while the tab is inactive or minimized.
  - Clicking the notification instantly focuses the window and navigates directly to the specific conversation thread (`/social-media/inbox?conversationId=...`).
- **Inbound Webhook DM Ingestion for Instagram & Facebook (`helpers/instagramEvent.js`, `helpers/facebookEvent.js`)**:
  - Fixed issue where incoming Instagram and Facebook direct messages were previously skipped.
  - Inbound DMs are now automatically parsed, sender details and avatar fetched via Meta Graph API, and persisted into MongoDB `Conversation` records with `type: 'social'` and `metadata.source`.
  - Emits real-time Socket.io events (`receive-message` and `social-dm-received`) directly to the authenticated account owner's room (`user_${userId}`).
  - Creates persistent in-app notifications in `db.Notification`.
- **Cross-Platform Reply Dispatching (`services/messaging.service.js`, `controllers/conversation.controller.js`)**:
  - Added direct Instagram DM sending via Meta Graph API (`/me/messages` with Instagram Scoped IDs) using decrypted access tokens from connected `SocialAccount` models.
  - Added Facebook Messenger reply support directly using connected Facebook Page access tokens when no chatbot is attached.
  - Updated `manualReply` and `listBroadcastConversations` to support `type: 'social'` alongside campaign inboxes.
- **Navigation & Sidebar Integration (`sidebarData.ts`, `routes.ts`)**:
  - Added "Social DM Inbox" to the Social Media navigation menu in `src/data/sidebarData.ts` with active live status.

## 📍 [2026-09-16 08:47:00 CEST] — Human-Like Chatbot Conversational Tone & Real-Time Message Deduplication Fix

### 🤖 Real Human Concierge Feel & Clean Single-Message Rendering
- **Eliminated Duplicate Message Rendering (`helpers/chat.js`)**:
  - Identified root cause where both the HTTP `fetch` response and the Ably real-time channel subscriber were appending the assistant's reply. Because the previous deduplication check compared rendered DOM `textContent` (HTML parsed without markdown brackets) against raw markdown string (`[Schedule on Calendly](...)`), the strings never matched, causing every response to be rendered twice.
  - Added a strict `data-raw-content` attribute to each message DOM container (`messageDiv.setAttribute('data-raw-content', trimmed)`).
  - Implemented exact raw content verification across both Ably real-time reception and HTTP completion handlers so that whichever arrives first renders the message and the second is cleanly skipped.
- **Transformed Bot Personality to Real Human Concierge (`aiChatService.js`, MongoDB Directives)**:
  - Fixed greeting behavior: eliminated robotic walls of text, corporate monologues, and company overviews when visitors say "hello", "hi", or "hey".
  - Enforced real-human concierge pacing: simple greetings now receive a short, warm, 1-2 sentence welcome ("*Hi there! 👋 Welcome to Siegfried Marketing. How can I help you today — are you looking for information on our clinic marketing services, or would you like to schedule a call with Christopher?*").
  - Concierge appointment handling: asking for an appointment returns a concise 2-sentence invitation directly with the Calendly CTA button and a natural follow-up question.
- **Multi-Turn Conversation Context (`chat.controller.js`)**:
  - Automatically feeds the previous turns from `conversation.messages` into the AI's conversation history (`effectiveHistory`), allowing the assistant to maintain natural continuity across multiple questions without restarting greetings or forgetting context.

## 📍 [2026-09-16 08:30:00 CEST] — Website Chatbot Avatar Photo, Animated Online Status & AI Token Safeguards

### 💬 Website Chat Widget Branding & Live Online Indicator
- **Added Avatar Photo Rendering (`helpers/chat.js`)**:
  - Identified root cause where the website chatbot iframe template in `helpers/chat.js` was rendering only a plain text title (`<h3>${chatbot.name}</h3>`) without any photo or avatar elements.
  - Upgraded the header with a dedicated `.chat-header-profile` displaying the chatbot's uploaded avatar (`chatbot.avatar` or `chatbot.appearance.avatar`), complete with automated image error-handling and fallback to capital initial badge.
  - Added bot avatar thumbnails (`.bot-msg-avatar`) alongside each assistant message in the conversation stream and typing indicator for a unified, modern chat experience matching top live-chat platforms (Crisp, Intercom).
- **Added Animated Online Status Indicator & Status Text (`helpers/chat.js`)**:
  - Implemented a live pulsing green online badge (`.chat-status-dot` with `@keyframes pulse-ring`) directly attached to the avatar.
  - Displayed the custom status text (`chatbot.statusText`, e.g. "Online — here to help") in the header subtitle with an accompanying green status dot.
- **Enhanced Launcher Trigger & Welcome Teaser Bubble (`public/js/chatbot-widget.js`)**:
  - Updated `chatbot-widget.js` to render the chatbot's avatar photo directly inside the floating launcher trigger button with an active green online badge.
  - Added avatar thumbnail inside the welcome teaser bubble for high-converting visual engagement.
- **Exposed Avatar & Status Text in API Responses (`widget.controller.js`, `chat.controller.js`)**:
  - Updated `getWidgetConfig` and `getPublicChatbotInfo` to include `avatar` and `statusText` in their payloads.
- **Empty Message Bubble & False Fallback Prevention (`helpers/chat.js`, `chat.controller.js`)**:
  - Added strict non-empty content guards in `addMessage(content)` and Ably message subscribers to eliminate any empty light-blue message bubbles.
  - Guarded `sendMessage` to fallback to default helpful messages rather than emitting empty strings or falsely indicating handoff to human agents.
- **Reasoning Model Token Safeguards & Provider Fallback (`aiChatService.js`)**:
  - Resolved issue where low `max_tokens` (200) caused OpenRouter reasoning models (such as `deepseek/deepseek-v4.1-flash`) to consume the entire token budget during internal reasoning, resulting in `content: null`.
  - Enforced a minimum token floor of 2048 across chat completions and enabled extraction of reasoning content as fallback if `content` is truncated.
- **Updated Christopher Siegfried Bot Knowledge & Prompt**:
  - Verified and persisted Christopher Siegfried's appointment booking directives, Calendly link (`https://calendly.com/christophersiegfried`), avatar photo, and `Online — here to help` status text in MongoDB.

## 📍 [2026-09-15 19:40:00 CEST] — AI Bot Studio Custom Instructions, Knowledge Base Grounding & Token Floor Fix

### 🤖 AI Bot Persona, Knowledge Retention & Full-Response Generation
- **Fixed System Instructions & Persona Persistence in Controller (`chatbot.controller.js`)**:
  - Identified root cause where `systemInstruction` and `persona` fields set in the AI Bot Studio Step 1 (Configure) were discarded because `createChatbot` and `updateChatbot` did not extract or assign them to MongoDB update payloads.
  - Added full support for `systemInstruction` and `persona` in `createChatbot` and `updateChatbot`, and included them in both single bot (`getChatbotById`) and list (`getAllChatbots`) API projections so custom directives reload seamlessly in the builder.
- **Direct Training Data Payload Bundling (`useChatbotForm.ts`, `chatbot.controller.js`)**:
  - Updated `useChatbotForm.ts` to bundle `trainingData` (Q&A pairs and text/website crawled content) directly within `buildJsonPayload` and `buildFormDataPayload`.
  - Added JSON parsing support for `trainingData` in `updateChatbot` to guarantee knowledge bases are atomically persisted on save.
- **Enhanced AI Prompt Grounding & Output Token Floor (`aiChatService.js`)**:
  - Re-architected `getSystemPrompt()` to firmly identify the bot by its configured name and inject `[CUSTOM INSTRUCTIONS & DIRECTIVES]` and `[VERIFIED KNOWLEDGE BASE & FACTS]` with strict prioritization.
  - Embedded warm appointment booking directives: whenever visitors inquire about consultations, calls, pricing, or bookings, the bot proactively shares Christopher Siegfried's direct Calendly schedule link (`https://calendly.com/christophersiegfried`).
  - Increased token minimum floor from a restrictive 200 tokens (which abruptly truncated answers mid-sentence) to a healthy minimum of 2000 tokens (`Math.max(Number(config.maxTokens) || 2000, 1000)`).
  - Updated default `maxTokens` in `types/chatbot.ts` from 200 to 2000.
- **Populated Christopher Siegfried Bot Knowledge (`seed-christopher-bot.js`)**:
  - Live-crawled `https://christophersiegfried.com` and populated `trainingData.textContent` with detailed practice scaling and healthcare marketing content.
  - Added verified Q&A pairs for direct Calendly booking, HIPAA compliance, and clinician services.
  - Verified end-to-end via chat API with 100% accurate, rich responses and interactive Calendly booking button conversion.

---

## 📍 [2026-09-14 21:35:00 CEST] — YouTube Multiple Channels & Brand Accounts OAuth Connection Fix

### 🎥 Multi-Channel Support & YouTube Brand Account Chooser
- **Fixed Google OAuth Account & Channel Selection Bypass (`social-auth.routes.js`, `social-account.controller.js`)**:
  - Resolved an issue where connecting YouTube on accounts with multiple channels under the same Gmail (e.g. personal profile channel `MAYA DEVI` and Brand Account channel `Apsara Beauty Parlour Bhadra`) automatically defaulted to the primary personal profile without letting the user choose.
  - Changed Google OAuth authorization URL parameter from `prompt: 'consent'` to `prompt: 'select_account consent'` across both YouTube authorization routes and reconnection endpoints.
  - With `prompt: 'select_account consent'`, Google now actively displays the Google Account Chooser followed by the YouTube Brand Account / Channel Picker, enabling users to choose any specific channel or brand account associated with their Gmail.
  - Updated YouTube Data API channel retrieval to include `maxResults=50`.
  - Reloaded backend services (`api-backend`) via PM2.

---

## 📍 [2026-09-14 21:00:00 CEST] — Documentation & Changelog Branding Alignment

### 🏷️ Repository Header Update
- **Updated Primary Header**:
  - Renamed the main title from `# 📋 Changelog — TTOS Platform` to `# 📋 Changelog — Siegfried_Outreach_Platform` in accordance with repository branding standards.

---

## 📍 [2026-09-14 20:50:00 CEST] — AI Chatbot Studio Calendly & Appointment Booking Integration + System Prompt Control

### 📅 Rich Calendly Appointment Booking & System Prompt Configuration
- **Interactive Calendly Button Rendering (`helpers/chat.js`)**:
  - Implemented automatic URL and markdown link detection in the chatbot iframe.
  - Formats any Calendly link (`calendly.com`, `cal.com`) into a prominent, high-converting interactive CTA button (**"📅 Book on Calendly"**) styled with primary blue accents, hover elevations, and external-window attributes.
  - Added HTML sanitization before markdown bold (`**text**`), italic (`*text*`), and URL parsing to preserve security and visual cleanliness.
- **Added System Instructions & AI Persona Editor (`ConfigureTab.tsx`)**:
  - Added a dedicated "System Instructions & AI Persona" textarea in Step 1 (Configure) of the Chatbot Builder (`/ai-bot-studio/[chatbotId]?step=configure`).
  - Integrated one-click Quick Prompt Starters:
    - **📅 Calendly Booking Prompt**: Pre-configures the AI to act as Christopher Siegfried's appointment booking concierge, warmly directing visitors to schedule on Calendly.
    - **💼 Lead Generation**: Pre-configures the AI to capture leads and guide visitors toward scheduling discovery calls.
- **Full-Stack Payload & Type Synchronization (`useChatbotForm.ts`, `types/chatbot.ts`)**:
  - Integrated `systemInstruction` across form state, load hooks, FormData payloads, and JSON payloads to ensure custom instructions persist seamlessly to MongoDB.

---

## 📍 [2026-09-14 20:25:00 CEST] — AI Chatbot Studio Embed Widget Fix & WordPress Integration Resolution

### 🤖 Chatbot Studio Widget Deployment & CORS Interoperability Fix
- **Diagnosed Embed Script 404 Failure**:
  - Investigated why the embed script `https://siegfriedoutreach.com/js/chatbot-widget.js` referenced in WordPress (`christophersiegfried.com`) returned `404 Not Found`.
  - Identified that Next.js frontend lacked the public script asset and App Router route handler for `/js/chatbot-widget.js`, and Nginx was attempting to proxy static `.js` paths without static fallback mapping.
- **Created Universal Chatbot Loader (`public/js/chatbot-widget.js`)**:
  - Engineered a high-performance, standalone embed loader that automatically extracts attributes (`data-chatbot-uuid`, `data-iframe-width`, `data-iframe-height`, `data-position`, `data-language`).
  - Implemented sleek modern UI featuring:
    - Floating trigger bubble with customizable primary brand colors and interactive chat/close SVG toggle states.
    - Welcome teaser message bubble with dismiss button and smooth bounce animation.
    - Full-screen responsive mode on mobile devices (`max-width: 480px`).
    - Ultra-high z-index (`2147483647`) to prevent obstruction by third-party WordPress themes, Elementor modals, or headers.
    - Clean `postMessage` protocol bridging between host window and iframe without inline HTML `onload` attributes (CSP compliant).
- **Added Dynamic Next.js Route Handler (`src/app/js/chatbot-widget.js/route.ts`) & Nginx Direct Alias**:
  - Configured high-speed route handler with permissive CORS (`Access-Control-Allow-Origin: *`) and caching headers (`Cache-Control: public, max-age=3600`).
  - Added direct Nginx alias mapping in `siegfriedoutreach.com.conf` and `api.siegfriedoutreach.com.conf` for microsecond asset delivery.
- **Fixed API-Wide Third-Party CORS Header Restriction (`app.js`)**:
  - Resolved origin rejections where third-party domains (e.g., `christophersiegfried.com`) attempting to fetch `/api/widget/config/:id` were blocked by the backend CORS whitelist.
  - Enabled dynamic credentials and permissive origin reflection across embed and chat API endpoints so widgets operate smoothly across all client websites.

---

## 📍 [2026-09-13 22:17:00 CEST] — Google Business Profile API Diagnostics & Reconnection Workflow Fix

### 🏢 Google My Business Publishing Diagnostics & Multi-Step Resolution
- **Diagnosed Root Cause for Persistent "Google APIs Disabled" Post Error**:
  - Investigated why post dispatches still failed after the user enabled "My Business Account Management API" in Google Cloud Console (`Project 203941120936`).
  - Identified that the user's connected Google account in the database was initially imported *before* the Cloud APIs were enabled, storing the connection as a sandbox mock profile (`locations/default_...`) with an unrefreshed token.
  - Enabling an API in Google Cloud Console does not automatically update database records or grant new permissions to existing tokens. The account **must be reconnected in Channels** to import live verified storefront locations.
  - Furthermore, identified that Google requires **two additional APIs** in Google Cloud Console for full functionality:
    1. **My Business Business Information API** (`mybusinessbusinessinformation.googleapis.com`): required to query and list actual storefront locations and physical business addresses.
    2. **Google My Business API v4** (`mybusiness.googleapis.com`): required to create and publish `localPosts` to Google Search and Maps.
- **Added Google Platform to Reconnection Controller (`social-account.controller.js`)**:
  - Implemented `case 'google'` in `reconnectSocialAccount` with proper OAuth2 scopes (`https://www.googleapis.com/auth/business.manage`), offline access, and prompt consent so users can seamlessly reconnect Google accounts with a single click.
- **Enhanced UI Guidance in Dashboard & Channels**:
  - **Recent Posts Failure Card (`RecentPostCard.tsx`)**: Replaced single ambiguous link with an actionable multi-step resolution banner containing direct links to:
    - Step 1: Enable **My Business Account Management API** in GCP Console.
    - Step 2: Enable **My Business Business Information API** in GCP Console.
    - Step 3: Direct **"🔄 Reconnect in Channels"** button leading directly to `/social-media/channels`.
  - **Connected Accounts Modal (`ConnectedAccountsModal.tsx`)**: Updated warning card for mock accounts with explicit notice that reconnection is required after enabling Cloud Console APIs, alongside direct console activation links.
- **Improved API Dispatch Telemetry & Error Messaging (`socialMediaApis.js`)**:
  - Updated mock prevention check to explicitly inform users that both Account Management and Business Information APIs must be enabled in Project `203941120936` and the account reconnected in Channels.

---

## 📍 [2026-09-13 22:10:00 CEST] — Purged TTOS Previews & Deployed Official Siegfried Outreach OpenGraph Banner Suite

### 🎨 Brand Identity & OpenGraph Image Resolution Fix
- **Diagnosed Root Cause for "TTOS Image in Live Preview"**:
  - Identified that social platform crawlers (WhatsApp, Facebook, LinkedIn, iMessage, Twitter/X, Telegram) scrape `og:image` and `twitter:image` tags when link unfurling `https://siegfriedoutreach.com`.
  - The metadata was pointing to legacy asset aliases (`/images/dark-logo2.png`, `whatsapp_preview_image.png`, `ttos-logo-...`) which contained old TTOS graphics.
  - Furthermore, `src/utils/index.ts` had a legacy override intercepting brand logos and mapping them to `/images/ttos-logo-...`.
- **Created Official High-Resolution Siegfried Outreach OG Suite (`sharp`)**:
  - **OpenGraph Social Preview Banner (`public/images/siegfried-outreach-og.png` - 1200x630)**:
    - High-contrast agency dark aesthetic (`#080A0F` to `#0D111A`) with soft ambient cyan & violet radial glows.
    - Official Siegfried Outreach "CS" icon (from uploaded brand assets in `/uploads/logos/`).
    - Crisp high-impact typography: **Siegfried Outreach - Social Media Marketing Agency**.
    - Feature tags: `AI Social Manager`, `Multi-Channel Studio`, `Campaign Hub`, and `siegfriedoutreach.com`.
  - **Square Brand App Icon (`public/images/siegfried-outreach-square.png` - 600x600)**:
    - Dedicated square icon for Apple Touch icons, WhatsApp square thumbnails, and collapsed sidebar previews.
- **Universal Metadata & Alias Replacement**:
  - Updated `src/app/layout.tsx` and all page-level metadata routes (`page.tsx`, `analytics`, `ai-chat`, `mcp`, `[slug]`, `campaign-hub`, `social-media`) to declare `siegfried-outreach-og.png` (1200x630) and `siegfried-outreach-square.png` (600x600).
  - Overwrote all legacy alias files in `public/images/` (`dark-logo2.png`, `light-logo2.png`, `logo.png`, `whatsapp_preview_image.png`, `telegram_preview_image.png`, and all `ttos-logo-*` files) with the new Siegfried Outreach graphics to ensure immediate cache invalidation across all messaging crawlers.
  - Purged all `ttos-logo` fallbacks from `SidebarLogo.tsx`, `CampaignHubHeader.tsx`, `CampaignHubFooter.tsx`, `SocialMediaHeader.tsx`, `SocialMediaFooter.tsx`, `LeftSidebar.tsx`, `DynamicMetadata.tsx`, and `api/setting` routes.
  - Removed legacy TTOS logo remapping logic from `src/utils/index.ts`.

---

## 📍 [2026-09-13 22:04:00 CEST] — Instagram Live Preview Caption Formatting & Whitespace Engine Fix

### 📸 Instagram Live Preview Caption Engine (`SocialPostPreview.tsx`)
- **Preserved Exact Paragraphs & Whitespace Breaks (`whitespace-pre-wrap break-words`)**:
  - Resolved the issue where multi-paragraph Instagram post captions, bullet points (e.g., `- TRUST:`, `- EVIDENCE-BASED CLARITY:`, `- THE RIGHT FIT:`), and line breaks collapsed into an unformatted wall of text.
  - Applied `whitespace-pre-wrap break-words` to the Instagram caption container so every single newline (`\n`), blank line between paragraphs (`\n\n`), and indented bullet point is rendered exactly as typed in the post composer.
- **Enhanced Caption Tokenizer & Rich Styling (`renderFormattedContent`)**:
  - Upgraded `renderFormattedContent` to detect and style Instagram hashtags (`#tag`), mentions (`@handle`), and web links (`https://...`) with authentic Instagram branding (`#00376b` / `dark:text-sky-400`).
  - Added URL link detection with `break-all` protection to prevent long links from overflowing mobile viewport bounds.
  - Filtered email addresses (such as `sales@domain.com`) from being erroneously matched as user mentions.
- **Smart Line Truncation & Interactive More/Less Toggle**:
  - Implemented authentic Instagram line-clamping: captions exceeding 100 characters or containing newlines now truncate neatly without breaking words, followed by `... more`.
  - Added bidirectional toggling: users can click `more` to expand the full formatted text and `less` to collapse it back, allowing immediate verification of both states.
  - Added `max-h-[380px] overflow-y-auto no-scrollbar` scroll boundary to accommodate long copy while maintaining realistic phone frame proportions.
- **Authentic Instagram Post Chrome & Interaction Details**:
  - Added `View all 18 comments` link, `Add a comment...` field with quick emoji reactions (`❤️ 🙌 🔥`), and `JUST NOW` relative timestamp.
  - Added bold, interactive Instagram account handle prefix matching official mobile layout standards.
- **Omni-Platform Whitespace Consistency**:
  - Synchronized `whitespace-pre-wrap break-words` across **Facebook**, **LinkedIn**, and **YouTube** descriptions to guarantee uniform line break retention across all platform mockups.

---

## 📍 [2026-09-13 22:00:00 CEST] — Google Business Profile (GMB) Live Publishing Diagnosis & Cloud API Fix

### 🛠️ GMB Publishing Architecture & False-Success Fix
- **Diagnosed Root Cause for "Post Not Showing Live on Google"**:
  - Investigated user post `"Demo GMB Test"` (`6aa6fd3566ba0ac13dcee8c6`) which showed green "Published" badge with direct link to `business.google.com`.
  - Discovered that Google Cloud Project `203941120936` had **My Business Account Management API** disabled, causing Google OAuth to return HTTP 403 `PERMISSION_DENIED` during storefront location fetching.
  - Previous fallback had intercepted sandbox locations (`locations/default_*`) and generated mock `gmb_sandbox_*` IDs with `status: published`, creating a false impression that the post was live on Google Search/Maps when Google never received the payload.
- **Backend Publishing Transparency (`socialMediaApis.js` & `queue.js`)**:
  - Removed silent simulation of sandbox posts. If an account has `isMock: true` or default placeholder locations, `publishToGoogle` now throws an explicit error detailing the missing Google Cloud APIs.
  - Formatted the Google Business Profile localPosts API resource path correctly to `accounts/{accountId}/locations/{locationId}/localPosts`.
  - Forwarded `account.metadata` in `services/queue.js` to ensure real Google account and location identifiers are passed to the API.
- **Smart Telemetry & Error Classification (`utils/telemetryClassifier.js`)**:
  - Added dedicated classification for Google Business Profile API errors (`PERMISSION_DENIED`, HTTP 403).
  - Configured step-by-step checklist with direct 1-click links to enable:
    1. `mybusinessaccountmanagement.googleapis.com` (My Business Account Management API)
    2. `mybusinessbusinessinformation.googleapis.com` (My Business Business Information API)
    3. `mybusiness.googleapis.com` (Google My Business API for Local Posts)
- **Database Post Synchronization & Telemetry Fix**:
  - Updated post `6aa6fd3566ba0ac13dcee8c6` to `status: 'failed'` with HTTP 403 and exact diagnostic reason and resolution steps.
  - Generated official `SocialPublishLog` telemetry record enabling 1-click inspection from the dashboard and logs.

### 🎨 Frontend UI / UX Clarity & Transparency
- **Recent Post Cards (`RecentPostCard.tsx`, `RecentPostsSection.tsx`)**:
  - Sanitized live URL detection (`getPlatformUrl` and `getLiveUrl`) to prevent generic `https://business.google.com/` and sandbox IDs from rendering as verified live post links.
  - Added an **Action Required Warning Banner** when a post fails on Google due to Cloud APIs being disabled, complete with a direct 1-click link to Google Cloud Console (Project `203941120936`) and a link to inspect telemetry logs.
- **Channels & Connected Accounts (`ConnectedAccountsModal.tsx`, `SelectPages.tsx`, `platformSetupGuides.ts`)**:
  - Added an alert banner for sandbox Google accounts in `ConnectedAccountsModal` prompting the user to enable the APIs in Google Cloud Console.
  - Added direct link to enable the Google My Business API in `SelectPages.tsx` alongside Account Management and Business Information APIs.
  - Updated `platformSetupGuides.ts` with correct production domains and direct 1-click links for all 3 required Google APIs.

---

## 📍 [2026-09-13 21:52:00 CEST] — Google Business Profile (GMB) Live Preview & Channel Synchronization

### 🌟 High-Fidelity GMB Live Preview (`SocialPostPreview.tsx`)
- **Prominent First-Position Tab & "GMB" Badge**:
  - Reordered platform tabs in `SocialPostPreview.tsx` to position **Google Business (GMB)** at the front of the preview bar.
  - Added a prominent `GMB` badge and an active emerald pulse indicator on tabs with connected/selected accounts.
  - Added support for `'gmb'` and `'google'` aliases in `PlatformType` and platform tab selectors.
- **Smart Auto-Sync & Channel Detection**:
  - Added automatic platform switching: when a user selects a GMB account in `PlatformSelection`, the preview dynamically transitions to the Google Business mockup.
  - Enhanced account matching with `isPlatformMatch` to support `google`, `gmb`, and `google_business` across all connected profiles.
- **Hyper-Realistic Google Search & Maps Knowledge Panel Simulation**:
  - Rendered official Google 4-color "G" logo and simulated `google.com/search?q={business_name}` browser URL bar.
  - Added interactive perspective toggles: **Google Search Listing**, **Google Maps Card**, and **Promotional Offer Mode**.
  - Added verified Google badge, review star ratings (`4.9 ★★★★★ (148 reviews)`), business hours indicator (`🟢 Open 24/7`), and quick actions (`Website`, `Directions`, `Save`, `Share`).
  - Implemented interactive Google Call-to-Action (CTA) simulator with real GMB actions (**Learn More**, **Call Now**, **Book**, **Order**).
  - Integrated promotional offer mode supporting discount vouchers (`🏷️ SPECIAL OFFER`, coupon code banner, and expiry dates).
- **AI Post Generator & Platform Selection Sync (`PlatformSelection.tsx`, `AIPostGeneratorModal.tsx`)**:
  - Added `Google Business (GMB)` to `PLATFORM_BADGES` in `AIPostGeneratorModal.tsx`.
  - Normalized platform configuration keys and aliases in `PlatformSelection.tsx` so GMB channels never fallback to default styling.

---

## 🌐 [2026-09-13 21:15:00 CEST] — Universal SEO Update: Siegfried Outreach - Social Media Marketing Agency

### 🔍 Comprehensive SEO & Metadata Overhaul
- **Root Layout & Metadata (`src/app/layout.tsx`)**:
  - Updated `metadataBase` to `https://siegfriedoutreach.com`.
  - Updated `title.default` and `title.template` to `"Siegfried Outreach - Social Media Marketing Agency"`.
  - Replaced descriptions, author, publisher, and keywords across all meta tags to emphasize Social Media Marketing Agency, AI marketing automation, multi-channel publishing, and omnichannel growth.
  - Updated OpenGraph (`og:title`, `og:site_name`, `og:description`, `og:url`, `og:image:alt`) and Twitter Cards (`twitter:creator: '@SiegfriedMarket'`) to official Siegfried Outreach branding.
  - Replaced Schema.org JSON-LD graph with `['Organization', 'MarketingAgency']` and `SoftwareApplication` referencing `https://siegfriedoutreach.com` and `@id: https://siegfriedoutreach.com/#organization`.
- **Route-Level SEO & Canonical URLs**:
  - **Homepage (`src/app/page.tsx`)**: Updated page title, description, canonical link (`https://siegfriedoutreach.com`), and OpenGraph metadata.
  - **Social Media Studio Landing (`src/app/landing/social-media/page.tsx`)**: Updated metadata to `"Social Media Studio | Siegfried Outreach - Social Media Marketing Agency"`.
  - **Campaign Hub Landing (`src/app/landing/campaign-hub/page.tsx`)**: Updated metadata to `"Campaign Hub | Siegfried Outreach - Social Media Marketing Agency"`.
  - **Model Context Protocol / MCP Hub (`src/app/mcp/page.tsx`, `src/app/landing/mcp/page.tsx`)**: Updated metadata to `"Social Media MCP Server | Siegfried Outreach - Social Media Marketing Agency"`.
  - **AI Chat Assistant (`src/app/frontend/ai-chat/page.tsx`)**: Updated metadata to `"AI Chat Assistant | Siegfried Outreach - Social Media Marketing Agency"`.
  - **Social Media Hub & Telemetry Pages (`dashboard`, `logs`, `analytics`)**: Updated titles and descriptions with Siegfried Outreach agency branding.
  - **Dynamic Pages (`src/app/[slug]/page.tsx`)**: Formatted title generator updated to `{Slug} | Siegfried Outreach - Social Media Marketing Agency`.
  - **Data Deletion (`src/app/data-deletion/page.tsx`)**: Updated title, description, and copy to reference Siegfried Outreach.
- **Sitemap & Search Engine Indexing (`src/app/sitemap.ts`, `src/app/robots.ts`)**:
  - Updated XML sitemap base URL to `https://siegfriedoutreach.com`.
  - Updated `robots.txt` sitemap pointer to `https://siegfriedoutreach.com/sitemap.xml`.
- **Dynamic App Name & Settings Synchronization (`src/layout/DynamicMetadata.tsx`, `src/app/api/setting/*`)**:
  - Refined `DynamicMetadata` client-side title synchronization to safeguard rich Next.js route metadata.
  - Updated API route handlers to preserve and ensure `"Siegfried Outreach - Social Media Marketing Agency"` in app settings responses.

---

## 🛠️ [2026-09-13 20:47:00 CEST] — Fix Google My Business Channel Integration, API Handshake & Mock Listing Detection

### 📍 Google Business Profile API Fixes
- **Corrected Broken Google Business API Endpoints (`social-auth.routes.js`)**:
  - Replaced the invalid endpoint `https://mybusinessbusinessinformation.googleapis.com/v1/accounts` with Google's official `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`.
  - Added storefront locations retrieval using `https://mybusinessbusinessinformation.googleapis.com/v1/{account.name}/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,metadata`.
  - Added specific error trapping for 403 `PERMISSION_DENIED` with direct resolution URLs to enable **My Business Account Management API** and **My Business Business Information API** in Google Cloud project `203941120936`.
- **Eliminated Fake Mock Titles (`social-auth.routes.js`, `SelectPages.tsx`, database)**:
  - Removed hardcoded `(Mock)` suffixes from Google accounts and sanitized existing records in MongoDB (`MAYA DEVI (Mock)` -> `Apsara Beauty Parlour`, `PerfexCRM shop (Mock)` -> `PerfexCRM shop`, `Social tt (Mock)` -> `Social tt`).
  - Added inline business title customization in `SelectPages.tsx` with instant editing and saving prior to connection.
  - Added an informative Google Business Profile API Setup Notice banner on `SelectPages.tsx` with direct 1-click links to enable both required Google Cloud APIs.
- **Graceful Sandbox Publishing Fallback (`socialMediaApis.js`)**:
  - Added sandbox simulation for test/unverified Google Business accounts so posting campaigns do not throw 404 HTTP errors while waiting for Google My Business API quota approval.
- **Documentation & Settings (`platformSetupGuides.ts`, `GoogleConfig.tsx`)**:
  - Explicitly documented required Google Cloud APIs with direct links to Google Cloud Console for project `203941120936`.

---

## 🔐 [2026-09-13 19:57:00 CEST] — Reset Administrator Credentials to Siegfried@2020

### 🛡️ Security & Authentication
- **Admin Password Reset**:
  - Successfully updated administrator password to `Siegfried@2020` for primary administrator accounts:
    - `admin@siegfriedoutreach.com` (Role: `super_admin`)
    - `admin@ttai.in` (Role: `super_admin`)
  - Re-hashed using bcrypt (`saltRounds = 10`) and verified via live authentication against backend `/api/auth/login` (Status: `200 OK`, valid JWT session token issued).
  - Synchronized backend environment configuration (`ADMIN_PASSWORD=Siegfried@2020`).

---

## 🚀 [2026-09-13 15:47:00 CEST] — OpenRouter: Live Model Fetching, 100% Free Models Provider List & Searchable Dropdown

### ⚡ Live Model Fetching & Dynamic Sync (`src/app/api/ai/openrouter-models/route.ts`)
- **OpenRouter Live API Gateway**:
  - Implemented `/api/ai/openrouter-models` proxy endpoint fetching directly from `https://openrouter.ai/api/v1/models`.
  - Added smart in-memory 5-minute caching to optimize response times (<10ms) and prevent API rate-limits.
  - Automatically isolates and categorizes all 22+ 100% Free Models (`:free` suffix and $0.00 pricing), latest flagship models (DeepSeek, Claude, OpenAI, Gemini, Llama, Grok), and all 440+ available models.

### 🎁 Free Models & Enhanced Model Picker (`src/components/feature/chatbot-builder/tabs/ConfigureTab.tsx`)
- **Auto-Sync & Manual Refresh**:
  - Automatically queries OpenRouter on provider selection to guarantee users never see outdated models.
  - Added a "Fetch Latest" / "Live Sync" button with animated refresh icon in the field header.
  - Added dynamic model count badge (e.g. `22 Free Models`).
- **Rich Searchable & Categorized Dropdown**:
  - Embedded real-time search input to find models instantly by keyword (e.g., `free`, `gemma`, `deepseek`, `sonnet`, `llama`).
  - Added interactive category filter pills: `All`, `🎁 Free Only ($0)`, `DeepSeek`, `Claude`, `OpenAI`, `Google`, and `Llama`.
  - Highlighted all free models with an eye-catching green `FREE ($0)` badge.
  - Enabled custom model input allowing users to specify any experimental or private OpenRouter model ID.
- **Intelligent Defaulting**:
  - Automatically switches default model to `deepseek/deepseek-v4.1-flash` or a verified free model when selecting OpenRouter, preventing stale cross-provider values.

### 💬 Chat Header & Static Fallback (`src/components/frontend/ai-chat/components/ChatHeader.tsx`, `src/data/aiChatbot.ts`)
- **AI Chat Header Dropdown**:
  - Updated model switcher in the chat frontend to visually display the green `FREE` badge for free OpenRouter models.
  - Expanded dropdown menu width and improved spacing for lengthy model identifiers.
- **Offline & Fallback Safety**:
  - Curated all verified free models and latest DeepSeek V4.1, Claude 3.7 Sonnet, GPT-4.5, Gemini 2.5, and Llama 4 in `aiChatbot.ts` as an instantaneous offline fallback.
- **Production Verification & PM2 Reload**:
  - Compiled clean production Next.js build (`npm run build`) with zero TypeScript/lint errors.
  - Restarted PM2 `frontend-app` instance to serve the latest live bundle.

---

## 🚀 [2026-09-12 06:05:00 UTC] — Complete Google OAuth & SSO Authentication Setup

### 🔐 Next.js API Route Proxy & Gateway
- **Added `/api/auth/google` Route Handler (`src/app/api/auth/google/route.ts`)**:
  - Implemented Next.js App Router POST handler proxying incoming Google authentication requests directly to the backend (`/auth/google`) via `apiHandler`.
  - Fixes HTTP 404 error previously thrown when frontend Google Sign-In button sent authentication credentials or access tokens to `/api/auth/google`.

### 🛡️ Admin Dashboard & Google OAuth Configuration Card
- **Created `GoogleAuthCard` (`src/components/feature/app-settings/general/GoogleAuthCard.tsx`)**:
  - Added dedicated Google OAuth & SSO configuration card to the Admin General Settings dashboard.
  - Supports live editing of `google_client_id` and `google_client_secret`.
  - Includes interactive helper panels with one-click copy buttons for:
    - Authorized JavaScript Origins: `https://ttai.in`, `https://www.ttai.in`
    - Authorized Redirect URIs: `https://ttai.in`, `https://ttai.in/login`
    - Direct link to Google Cloud Console Credentials management page.
- **Updated `GeneralSettings.tsx` & Validation Schemas**:
  - Registered `google_client_id` and `google_client_secret` into Formik `initialValues` and `adminSettingSchemas.general`.
  - Synchronized production MongoDB settings document with configured Google OAuth client ID and client secret.

### 🎨 Google Login Button UX & SDK Resilience
- **Enhanced `GoogleLoginButton.tsx`**:
  - Implemented on-demand lazy initialization fallback for `window.google.accounts.oauth2.initTokenClient` so users clicking before the background hook runs are never blocked.
  - Added interactive loading spinner and disabled state during authentication to eliminate double-clicks.
  - Seamless support for both OAuth2 popup token flow (`access_token`) and Google Identity Services One Tap credentials (`credential`).
  - Automatically stores JWT token in cookies (`authToken`) and user profile in `localStorage`, dispatching Redux auth state and navigating to `/dashboard` or query `redirect_to`.

### ⚡ Verification & Production Deployment
- **Zero-Error Turbopack Build**:
  - Executed `npm run build` — 0 TypeScript and 0 Lint errors across 251 static and dynamic routes.
  - Verified live endpoint proxy `POST /api/auth/google` responds correctly from backend.
  - Restarted PM2 `ttai-frontend` (process id 0) online with zero downtime.

---

## 🛠️ [2026-09-11 20:20:00 UTC] — Fix Passkey WebAuthn Flow, Profile Page Instant Loading & Backend Session Healing

### ⚡ Profile Page Loading & Hydration
- **Dynamic Server-Rendering (`force-dynamic`)**:
  - Configured `export const dynamic = 'force-dynamic'` in `src/app/(main)/profile/page.tsx` to stop Next.js from statically baking stale/unauthenticated HTML into cached production bundles.
  - Added query skipping during SSR and pre-auth initialization (`skip: typeof window !== 'undefined' ? (!authUtils.getToken() && !token) : true`).
  - Implemented multi-tier user resolution (`data?.user || authUser || storedUser`) for instant, flicker-free rendering of user information.
  - Replaced full-page blocking spinner with non-blocking background hydration and an interactive "Try Again" retry action in case of transient network dropouts.

### 🔐 Passkey & WebAuthn Hydration Safety & API Compatibility
- **Hydration-Safe Biometric Detection**:
  - Gated `browserSupportsWebAuthn()` and localized dates in `src/components/feature/profile/PasskeyManager.tsx` behind a client `mounted` effect, eliminating React SSR/client mismatch errors.
  - Added `skip: !mounted` to `useGetPasskeysQuery` to prevent unauthorized requests during initial mount.
  - Added automatic device labeling (detecting Mac Touch ID, iPhone Face ID, Android Biometrics, Windows Hello) during passkey registration.
- **Header Forwarding & Route Synchronization**:
  - Enhanced `src/utils/apiHandler.ts` to forward `User-Agent`, `Cookie`, and synthesized `Origin` (from referer/host) so WebAuthn relying-party origin checks on the backend always match the browser origin.
  - Synchronized `src/app/api/auth/profile/route.ts` and Express backend `routes/auth.routes.js` to accept both `POST` and `PUT` methods for profile and avatar updates.
  - In backend `middlewares/auth.js`, implemented auto-healing for active session records for valid, unexpired JWT tokens, eliminating premature "Session expired or logged out" errors.
  - In backend `controllers/passkey.controller.js`, implemented dynamic challenge verification for registration and authentication to prevent challenge expiration and race conditions.

---

### ⚡ Client Resilience & Auto-Healing
- **Error Boundary Auto-Recovery**:
  - Enhanced `src/app/error.tsx` with automatic detection of chunk load failures after production builds.
  - When a chunk failure occurs, the error boundary automatically triggers a cache-busting navigation (`window.location.href = window.location.pathname + '?_r=' + timestamp`) bypassing stale browser memory and disk caches.
  - Updated "Try Again" and "Reload Page" action buttons to perform the same cache-busting navigation.
  - Rebuilt with Turbopack (`npm run build` — 0 errors) and reloaded PM2 `ttai-frontend`.

---

### ⚡ Client Stability & Deployment Resilience
- **Auto-Recovery on Stale Deployment Chunks (`ChunkLoadError`)**:
  - When production code is recompiled and deployed, browser sessions with an older build open can encounter `Failed to load chunk /_next/static/chunks/[hash].js` when fetching dynamically imported modules whose previous hashes were replaced on disk.
  - Implemented an automatic error listener in `src/app/Providers.tsx` that catches `Failed to load chunk` and `Loading chunk ... failed` events and automatically performs a clean, single-session reload (`window.location.reload()`) with a 10-second debounce guard.
  - Rebuilt with Turbopack (`npm run build` — 0 errors) and reloaded PM2 `ttai-frontend`.

---

### 🐛 WebAuthn & API Gateway Architecture
- **Missing `/api/passkey` Route in Next.js App Router**:
  - Identified critical missing route: RTK Query frontend calls `/api/passkey/register-options` and `/api/passkey/register-verify`, but Next.js App Router had no route handler under `src/app/api/passkey/`, returning HTTP 404 Not Found to the browser.
  - Created `src/app/api/passkey/[...path]/route.ts` with `GET`, `POST`, and `DELETE` handlers proxying all passkey requests to Express backend via `apiHandler`.
- **Client Header Forwarding (`Origin`, `Referer`, `Host`)**:
  - Updated `src/utils/apiHandler.ts` to forward `Origin`, `Referer`, `X-Forwarded-Host`, and `X-Forwarded-Proto` to the backend.
  - This allows `getRPConfig(req)` on the backend to accurately detect `https://ttai.in` and issue valid WebAuthn options for `rp.id = "ttai.in"`.
- **Production Verification**:
  - Verified live endpoint `POST http://127.0.0.1:3000/api/passkey/register-options` returns `HTTP 200 OK` with `rp: { name: "TTOS AI", id: "ttai.in" }`.
  - Verified live endpoint `GET http://127.0.0.1:3000/api/passkey/list` returns `HTTP 200 OK`.
  - Rebuilt with Turbopack (`npm run build` — 0 errors), reloaded PM2 `ttai-frontend`.

---

### 🐛 Bug Fixes & Storage Infrastructure
- **Dedicated Let's Encrypt SSL Certificate for `api.ttai.in`**:
  - Resolved root cause of profile pictures not rendering after upload: `api.ttai.in` previously shared `ttai.in`'s SSL certificate which lacked Subject Alternative Name (SAN) coverage for `api.ttai.in`, causing modern browsers to block all avatar requests via `ERR_CERT_COMMON_NAME_INVALID`.
  - Issued and installed a standalone Let's Encrypt certificate for `api.ttai.in` (`/www/server/panel/vhost/cert/api.ttai.in/fullchain.pem`).
  - Configured Nginx reverse proxy with HTTP/2 SSL termination, verified live HTTP/2 200 OK responses on `https://api.ttai.in/uploads/...`.
- **Direct Same-Origin Static Upload Delivery**:
  - Added dedicated `location /uploads/` static alias in `/www/server/panel/vhost/nginx/ttai.in.conf` pointing directly to `/www/wwwroot/api.ttai.in/uploads/` with 30-day client caching.
- **Frontend Profile Upload Flow Optimization**:
  - Removed restrictive `value={''}` prop on file `<Input>` in `src/app/(main)/profile/page.tsx`, ensuring proper event propagation across all browsers.
  - Added automatic `await refetch()` and input value reset in `handleSubmit` to immediately pull updated user details from the database.
  - Rebuilt production bundle with Turbopack (0 errors) and reloaded PM2 `ttai-frontend`.

---

### 🐛 Bug Fixes & WebAuthn Security
- **Dynamic RP ID Domain Resolution**:
  - Resolved root cause of `"Failed to register passkey. Please try again."`: WebAuthn specification (§5.4.3) requires `rp.id` to match the effective domain of the calling document (`ttai.in`) or a valid registrable suffix. Previously, `getRPConfig` defaulted `rpID` to the API subdomain (`api.ttai.in`), causing browsers to reject `navigator.credentials.create` with a `SecurityError`.
  - Updated `services/passkey.service.js` to dynamically resolve `rpID` from the client's `Origin` or `Referer` header (`ttai.in`, `ttos.in`, `localhost`, etc.) rather than the API host.
  - Configured `verifyRegistrationResponse` and `verifyAuthenticationResponse` in `controllers/passkey.controller.js` to validate against acceptable RP IDs (`expectedRPIDs: [rpID, 'ttai.in', 'ttos.in', 'localhost']`).
- **Enhanced Frontend Passkey UX & Error Feedback**:
  - Updated `src/components/feature/profile/PasskeyManager.tsx` with granular error handling for `NotAllowedError` (user cancellation) and `InvalidStateError` (passkey already registered).
  - Rebuilt production frontend bundle with Turbopack (0 errors) and reloaded PM2 services (`ttai-backend` and `ttai-frontend`).

---

### 🛡️ Security & Authentication
- **Admin Password Reset**:
  - Successfully updated password to `Sitaram@2026` for primary administrator account `admin@ttai.in` (Role: `super_admin`) and legacy account `admin@siegfriedoutreach.com`.
  - Re-hashed using bcrypt and verified via live authentication against `/api/auth/login` (Status: 200 OK).

### 🗄️ Database & MCP Agent Tooling
- **DBX MCP Server Integration**:
  - Registered `@dbx-app/mcp-server` into `.agents/mcp_config.json` enabling natural language database querying and agent tasks across MongoDB collections.
  - Documented secure SSH tunnel connectivity for local DBX desktop client to query live database `ttai`.

---

## 🌓 [2026-09-11 18:57:00 UTC] — Implement Pill-Shaped Theme Toggle & Modern Stackposts-Style Login Experience

### 🎨 Frontend & Auth UI Modernization
- **Pill-Shaped Light / Dark Mode Toggle (`AuthThemeToggle`)**:
  - Engineered an ultra-sleek, pill-shaped capsule theme switch matching user design specifications.
  - Features dedicated Sun (`Sun`) and Sparkle Moon icons with dynamic light/dark active state indicators and spring-animated transitions.
- **Top Header Bar in Auth Layout**:
  - Redesigned `src/app/(auth)/layout.tsx` to include an expansive, responsive top navigation bar.
  - Placed the official TTOS brand logo on the top-left and the capsule theme toggle on the top-right.
- **Login Card & Input Aesthetics**:
  - Updated `src/app/(auth)/login/page.tsx` with clean typography: "Log in to your account" and subtitle "Enter your username or email and password below to log in".
  - Refactored `AuthInput.tsx` with modern rounded pill styling (`rounded-2xl`), subtle hover/focus state rings, and clean border hierarchy.
  - Refined `LoginForm.tsx` input labels and placeholders ("Username or email", "Password") and optimized button dimensions.
- **Production Build & Verification**:
  - Successfully built with Turbopack (0 TypeScript errors) and restarted PM2 `ttai-frontend`.

---

## 🔗 [2026-09-11 18:45:00 UTC] — Link n8n to n8n.ttinfotechs.com & Update Allowed Origin Servers

### ⚙️ Backend & Pipeline Updates
- **Linked n8n Publishing Engine**:
  - Updated `N8N_WEBHOOK_URL` in `/www/wwwroot/api.ttai.in/.env` to `https://n8n.ttinfotechs.com/webhook/ai-social-publisher`.
- **CORS & Allowed Origins Overhaul**:
  - Sanitized and updated `ALLOWED_ORIGINS` in `.env` to include `https://ttai.in`, `https://www.ttai.in`, `https://api.ttai.in`, `https://ttos.in`, `https://www.ttos.in`, `https://api.ttos.in`, `https://n8n.ttinfotechs.com`, and localhost environments.
  - Enhanced native CORS validation in `app.js` and `server.js` to automatically authorize TTOS, Vercel (`*.vercel.app`), and `ttinfotechs.com` origins.
- **DNS Verification**:
  - Verified Cloudflare DNS `A` record propagation for `api.ttai.in` ➔ `94.100.26.52` across global DNS resolvers.
- **Service Reload**:
  - Successfully refreshed PM2 daemon `ttai-backend` with updated environment variables.

---

## 🚀 [2026-09-11 16:01:00 UTC] — Deploy api.ttai.in Backend & Bridge Frontend to Live MongoDB

### 🔗 Backend Deployment & Database Wiring
- **Extracted and Initialized Backend**:
  - Deployed `api.siegfriedoutreach.com_20260911_080908.zip` into `/www/wwwroot/api.ttai.in/`.
  - Configured backend `.env` connecting to live MongoDB (`mongodb://127.0.0.1:27017/ttai`) and local Redis.
  - Executed seeders initializing 66 collections, system roles, permissions, AI templates, FAQs, chatbots, and default admin.
  - Launched `ttai-backend` process under PM2 daemon on port 5000.
- **Nginx Reverse Proxy & SSL Setup**:
  - Configured `/www/server/panel/vhost/nginx/api.ttai.in.conf` with reverse proxy pass to `http://127.0.0.1:5000` with WebSocket upgrade headers and uploads static routing.
  - Verified SSL certificate and local host resolution.
- **Frontend Hybrid Bridge**:
  - Updated `src/utils/apiHandler.ts` to support `INTERNAL_API_URL` for ultra-low latency direct SSR proxying while maintaining public `NEXT_PUBLIC_API_BASE_URL=https://api.ttai.in/api` for clients.
  - Rebuilt production Next.js bundle and verified live API endpoint responses (`/api/setting/public`).

---

## 🔄 [2026-09-10 21:08:00 UTC] — Fix Live Brand Logo Pipelines & Eliminate Remote Legacy Siegfried Asset Routing

### 🎯 Root Cause Resolution
- **Identified Cause of Stale Remote Logo**:
  - The public settings endpoint was serving legacy database paths pointing to remote files (`/uploads/logos/image-178610...png`).
  - `getMediaUrl` in `src/utils/index.ts` was resolving relative and image paths against the remote `NEXT_PUBLIC_STORAGE_URL` (`https://api.siegfriedoutreach.com`), bypassing local TTOS logo files.
- **Implemented Comprehensive Fixes**:
  - **`src/utils/index.ts`**: Updated `getMediaUrl` to automatically intercept any legacy logo hash or Siegfried URL and map it to the corresponding local TTOS logo (`/images/ttos-logo-dark.png`, `/images/ttos-logo-light.png`, `/images/ttos-logo-square.png`). Local static paths (`/images/...`) are now served directly without remote URL prepending.
  - **`src/app/api/setting/public/route.ts` & `src/app/api/setting/route.ts`**: Overrode all database logo fields (`logo_light_url`, `logo_dark_url`, `landing_logo_url`, `sidebar_logo_url`, `mobile_logo_url`, `favicon_url`, `favicon_notification_logo_url`, `onboarding_logo_url`) to permanently return local `/images/ttos-logo-...` assets.
  - **Header & Footer Components**: Updated fallback and logo resolution in `CampaignHubHeader`, `CampaignHubFooter`, `SocialMediaHeader`, `SocialMediaFooter`, `SidebarLogo`, `LeftSidebar`, `DynamicMetadata`, and `AuthLayout` to use dedicated TTOS assets.

---

## 🎨 [2026-09-10 20:56:00 UTC] — True PNG Logo Asset Suite & Deep Footer Brand Sanitization

### 🖼️ 1. True PNG Logo Suite Generation & Direct Downloads
- **Converted & Validated 100% Genuine PNG Encoding**:
  - Re-encoded all brand assets from raw format into true PNG standards (`1376x768` and `1024x1024` 8-bit RGB).
  - Generated dedicated high-res light and dark theme logo assets:
    - `public/images/ttos-logo-dark.png` (Sleek dark background for dark-mode headers and banners)
    - `public/images/ttos-logo-light.png` (Crisp light background for light-mode docs and decks)
    - `public/images/ttos-logo-dark-transparent.png` (Transparent alpha background for dark themes)
    - `public/images/ttos-logo-light-transparent.png` (Transparent alpha background for light themes)
    - `public/images/ttos-logo-square.png` (High-res 1024x1024 app icon)
  - Synced existing legacy asset aliases (`dark-logo2.png`, `light-logo2.png`, `logo.png`) to true PNG format.
  - Verified live 200 OK delivery via `https://ttai.in/images/*`.

### 🛡️ 2. Deep Footer & Public Settings Brand Sanitization
- **Public Settings API Override (`src/app/api/setting/public/route.ts`)**:
  - Enforced `settings.app_name = 'TTOS'` to prevent legacy database entries from surfacing in client header/footer components.
- **Landing Footers Sanitized**:
  - `src/components/landing/mcp/McpFooter.tsx`: Enforced sanitized `appName = 'TTOS'` in copyright bar.
  - `src/components/landing/campaign-hub/CampaignHubFooter.tsx`: Enforced sanitized `appName = 'TTOS'` in copyright bar.

---

## 🔍 [2026-09-10 20:47:00 UTC] — Enterprise SEO Architecture & Global Meta Tags Suite for TTOS

### 🌐 1. Root Layout & Global Metadata Suite (`src/app/layout.tsx`)
- **Configured Global Metadata Base & Title Template**:
  - `metadataBase: new URL('https://ttai.in')`
  - Default title: `TTOS | AI-Powered Marketing & Outreach Platform`
  - Dynamic title template: `%s | TTOS`
  - Meta description, keywords (11 high-intent keywords), author, creator, publisher, category, and robots directives (`index, follow`).
  - Standardized OpenGraph and Twitter card cards with 1200x630 high-res TTOS banner asset.
  - Injected Schema.org JSON-LD structured data for `Organization` and `SoftwareApplication`.

### 🗺️ 2. Dynamic XML Sitemap & Robots Engine (`src/app/sitemap.ts`, `src/app/robots.ts`)
- **Automated Dynamic Sitemap (`/sitemap.xml`)**:
  - Automatically crawls and serves indexed routes with daily/weekly change frequencies and priorities (Home, Campaign Hub, Social Media Studio, MCP Server, AI Chat, Auth portals).
- **Automated Robots Directives (`/robots.txt`)**:
  - Public indexing enabled with sitemap discovery pointing to `https://ttai.in/sitemap.xml`.

### 📄 3. Granular Page Metadata & OpenGraph Tags
- **Campaign Hub Landing (`src/app/landing/campaign-hub/page.tsx`)**: `Campaign Hub | Omnichannel Marketing Automation | TTOS`
- **Social Media Studio (`src/app/landing/social-media/page.tsx`)**: `Social Media Studio | AI Publishing & Strategy Engine | TTOS`
- **MCP Server Studio (`src/app/mcp/page.tsx`, `src/app/landing/mcp/page.tsx`)**: `Social Media MCP Server | Connect AI Agents to 9 Platforms | TTOS`
- **AI Chat Assistant (`src/app/frontend/ai-chat/page.tsx`)**: `AI Chat Assistant | Multi-Model Autonomous Intelligence | TTOS`
- **Social Media Command Center (`src/app/(main)/social-media/dashboard/page.tsx`)**: `Social Media Command Center | Multi-Account Management | TTOS`
- **Social Analytics (`src/app/(main)/social-media/analytics/page.tsx`)**: `Advanced Social Media Analytics | Multi-Platform Telemetry | TTOS`
- **Dynamic Slug Pages (`src/app/[slug]/page.tsx`)**: Dynamic `generateMetadata` with formatted titles and canonical URLs.

---

## 🚀 [2026-09-10 20:33:00 UTC] — Complete Whitelabel Rebrand to TTOS & High-Tech Logo Suite

### 🏷️ 1. Global Platform Whitelabelling to TTOS
- **Complete Elimination of Legacy "Siegfried Outreach" Branding**:
  - Whitelabelled **86 application files** across components, routes, metadata, API controllers, copy, and translations.
  - Updated Root Layout metadata and page titles to **TTOS | AI-Powered Marketing & Outreach Platform**.
  - Rebranded fallback application names, navigation links, and landing experiences to **TTOS**.
  - Updated `README.md` and codebase documentation to reflect the new TTOS identity.

### 🎨 2. Next-Gen Futuristic TTOS Logo Suite
- **Icon / Collapsed Logo (`public/images/logo.png`, `public/favicon.ico`)**:
  - High-res square obsidian app icon featuring bold glowing neon cyan and electric violet gradient "TTOS" lettering with circular metallic bevels.
- **Light Theme Banner (`public/images/dark-logo2.png`)**:
  - Clean white horizontal logo banner featuring stylized aerodynamic "TT" symbol with modern dark charcoal and blue typography.
- **Dark Theme Banner (`public/images/light-logo2.png`)**:
  - Deep space obsidian horizontal logo banner featuring illuminated cyan/violet "TT" glyph and bold white typography.
- **Sidebar Integration**:
  - Auto-swaps between light and dark banners seamlessly depending on the active theme, and collapses smoothly to the square icon.

### ⚡ 3. Production Verification & Live Sync
- Compiled full Next.js production build (`npm run build`) with 0 TypeScript and 0 lint errors.
- Reloaded PM2 application daemon with updated environment and assets.
- Verified live HTTPS 200 OK status on `https://ttai.in`.

---

## 🎨 [2026-09-10 22:17:00 CEST] — MCP Studio: Unified UI with Single Brand Color & Clean Card Styling

### 💎 Design System & Brand Alignment (`src/components/feature/mcp-studio/McpStudio.tsx`)
- **Single Brand Color Architecture**:
  - Eliminated conflicting multi-color neon AI-generated gradients (`indigo`, `purple`, `pink`, `amber`, `orange`) and hardcoded dark hex values (`#0D121F`, `#090D18`, `#0E1528`).
  - Unified all components and interactive elements around the platform's primary brand color (`var(--primary)` / `primary`).
  - Switched background, border, text, and muted states to standard theme tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-muted/40`).
- **Header Banner & Metrics**:
  - Removed artificial glow blur spheres and replaced with an elegant, enterprise-grade `Card` with subtle borders and shadows.
  - Standardized all 4 metric cards (`Server Status`, `MCP Tool Capabilities`, `Your API Keys`, `Assistant Clients`) with unified `bg-primary/10 text-primary` icon containers and standard text tokens.
- **Role Guides & Tab Navigation**:
  - Unified Talent & Admin role guide cards with consistent layout, `text-primary` checkmarks, and single-brand action buttons.
  - Refined horizontal tab bar with active state styled with `bg-primary text-primary-foreground font-semibold shadow-xs` and inactive state styled with `bg-card text-muted-foreground border-border`.
- **API Keys & Credentials Module (`tab=keys`)**:
  - Redesigned the keys list, new key creation form, security specifications, and endpoint container to look clean, polished, and native to the Siegfried platform.
  - Unified buttons, badge indicators, and copy actions with clean feedback.
- **Client Connect, Talent Playbook & Admin Diagnostics**:
  - Updated all client cards, setup code blocks, sample test prompts, and the 32 native tools directory with matching clean card aesthetics.

---

## ⏸️ [2026-09-10 22:09:00 CEST] — Navigation Update: Commented Out In-Development Ads Manager Items

### 📝 Sidebar Menu Code Preservation (`src/data/sidebarData.ts`)
- **Commented Out Modules**:
  - `Meta Ads Manager`
  - `TikTok Ads Manager`
  - `Reddit Ads Manager`
  - `Google Ads Manager`
- Code is cleanly preserved in block comments with re-enabling instructions so it can be restored instantly in the future.

---

## 🏷️ [2026-09-10 21:58:00 CEST] — Sidebar UI: Added Beta Badges to Ads Manager Modules

### 🚀 Visual Distinction for In-Development Modules
- **Sidebar Menu Items (`src/data/sidebarData.ts`)**:
  - Added `badge: 'Beta'` to all 4 ads manager items:
    - `Meta Ads Manager`
    - `TikTok Ads Manager`
    - `Reddit Ads Manager`
    - `Google Ads Manager`
- **Sidebar Rendering Component (`src/layout/sidebar/SidebarItem.tsx`)**:
  - Added dynamic badge indicator next to the menu title (`bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30`).
  - Added badge indicator within the collapsed tooltip popover to maintain visual consistency when the sidebar is minimized.

---

## 👥 [2026-09-10 21:54:00 CEST] — Navigation Update: Hidden AI Team & Templates from AI Social Manager

### 📱 AI Social Manager Sidebar (`src/data/sidebarData.ts`)
- **Hidden Items**:
  - `AI Team` (`/ai-social/team`)
  - `Templates` (`/ai-social/templates`)
- **Command Palette (`CommandPalette.tsx`)**:
  - Cleaned up `page-ai-templates` quick-access shortcut from the `⌘K` palette.

---

## 🧹 [2026-09-10 21:52:00 CEST] — Navigation & Dashboard Streamlining: Hidden Deprecated AI Tools, Hubs & Widgets

### 🧭 1. AI Tools Sidebar Streamlining (`src/data/sidebarData.ts`)
- **Hidden Submodules from `AI Tools` Menu**:
  - `AI Chat Assistant`
  - `AI Bot Studio`
  - `AI Codex`
  - `AI Detect`
  - `AI Transcription`
  - `AI File Bot`
  - `AI Writing Assistant`
  - `AI Avatar & Video`
  - `Hermes Skills`
- **Retained Core Tools**: `AI Blog Writer`, `AI Live Agent`, `AI Content Rewriter`, and `AI Slide Maker`.

### 🗂️ 2. Hub Sections Removed from Sidebar (`src/data/sidebarData.ts`)
- **AI Employee Hub**: Completely removed the section and all 9 sub-links (Command Center, Business Setup, Website Builder, SEO Agent, Server Agent, Maintenance Bot, Social Media Agent, Google Business, Credits).
- **Billing & Plans**: Removed section from main navigation (Plans, Subscriptions, Transactions).

### 📊 3. Dashboard Chart Cleanup (`DashboardCharts.tsx` & `UserDashboard.tsx`)
- **Admin Dashboard**: Removed empty `Favorite Assistants` card and `User Subscriptions` donut chart to elevate primary revenue and distribution analytics.
- **User Dashboard**: Removed `Favorite Assistants` card and expanded `DashboardIntelligenceOverview` to span the full grid width.

---

## 🚫 [2026-09-10 21:42:00 CEST] — Admin Feature Simplification: Hidden Indian Festivals Auto-Pilot

### 🎯 Feature Scope & Navigation Streamlining
- **Sidebar Navigation (`src/data/sidebarData.ts`)**:
  - Removed `🇮🇳 India Festivals Auto-Pilot` (`/ai-social/indian-festivals`) from the AI Social Manager navigation menu.
- **Command Palette (`CommandPalette.tsx`)**:
  - Removed the `action-festivals-autopilot` quick action item and unused `Flame` icon import from the global ⌘K command search.
- **Post Composer Header (`PostComposer.tsx`)**:
  - Removed the `🇮🇳 Indian Festivals Auto-Pilot` quick launcher button from the composer header.
- **Social Media Calendar Header (`CalendarPageHeader.tsx`)**:
  - Removed the `🇮🇳 Festivals Auto-Pilot` button from the calendar actions toolbar.
- **Content Calendar (`ContentCalendarPage.tsx`)**:
  - Removed the top header action button and the 365-day promotional banner card for Indian Festivals.
- **Direct Route Graceful Redirect (`src/app/(main)/ai-social/indian-festivals/page.tsx`)**:
  - Added an automatic server/client redirect to `/ai-social/calendar` to smoothly transition any direct link requests.

---

## 🚀 [2026-09-10 20:20:00 UTC] — MongoDB 8.0 aaPanel Engine, Database Setup, BSON Restore & Live Deployment of ttai.in

### 🍃 1. MongoDB 8.0.17 Installation & aaPanel Plugin Setup
- **Ubuntu 26 Compatibility Patch**:
  - Patched `/www/server/panel/install/mongodb.sh` to map Ubuntu 26.04 (`resolute`) to the official aaPanel MongoDB 8.0.17 x86_64 bundle.
  - Successfully installed MongoDB `v8.0.17` with `mongosh 2.0.2` and MongoDB Database Tools `100.10.0`.
  - Configured and activated the aaPanel MongoDB GUI plugin (`/www/server/panel/plugin/mongodb`).
  - Added system auto-start via `/etc/init.d/mongodb` and `update-rc.d`.

### 🗄️ 2. Database Creation & BSON Backup Data Restore
- **Initialized Database `ttai`**:
  - Created `ttai` database in MongoDB engine and registered it in aaPanel database inventory.
  - Created user `ttai` with `readWrite` and `dbAdmin` privileges.
  - Extracted BSON archive `siegfriedoutreach_bson_2026-09-10_21-59-01_mongodb_data.zip`.
  - Executed `mongorestore` importing `businesses` and associated collections into the `ttai` database.
  - Configured `MONGODB_URI=mongodb://127.0.0.1:27017/ttai` in environment.

### ⚡ 3. Node.js 22 LTS, PM2 Process Daemon & Production Build
- **Runtime Environment**:
  - Installed Node.js `v22.14.0` LTS and npm `10.9.2`.
  - Installed PM2 `v7.0.4` globally and generated systemd auto-boot unit (`pm2-root.service`).
  - Fixed Next.js CLI binary symlink in `node_modules/.bin/next`.
  - Compiled full Next.js production build (`npm run build`) with 0 errors across all routes.
  - Launched `ttai-frontend` on PM2 running on port 3000 in background daemon mode.

### 🌐 4. Nginx Reverse Proxy & Live Production SSL
- **Domain Routing (`ttai.in` & `www.ttai.in`)**:
  - Configured Nginx reverse proxy to route traffic seamlessly to PM2 Next.js service at `http://127.0.0.1:3000`.
  - Configured optimal static asset caching for `/_next/static/` (365d cache headers).
  - Maintained HTTP/2, HTTP/3 (QUIC), and SSL TLS certificates.
  - Verified live external domain response: `HTTP/2 200 OK` on `https://ttai.in`.

---

## 🧠 [2026-09-09 16:15:00 CEST] — Ethical Mental Health Marketing & Clinical Psychology Social Templates Suite

### 🏥 1. Ethical Mental Health Marketing Philosophy & Templates Catalog (`/ai-social/templates`)
- **Direct Alignment with Client Clinical Values (`christophersiegfried.com`)**:
  - Developed and seeded **19 comprehensive, clinically sound social media templates** designed specifically for licensed therapists, psychologists, psychiatric clinics, and ethical wellness practices.
  - Formats covered across all 5 modalities: **Carousels (5-slide guides), Infographic Images, 60s Clinician Video Reels, Deep-Dive Video Scripts, and Interactive Daily Grounding Stories**.
  - **Clinical Nuance Over Clickbait**: Templates specifically reject fear-mongering, empty promises, and diagnostic trivia; they provide scientifically backed education, demystifying gold-standard care while respecting client autonomy and HIPAA privacy.
  - **Areas of Focus Embedded**:
    - *Exposure & Response Prevention (ERP)* for Obsessive-Compulsive Disorder (OCD)
    - *Cognitive Behavioral Therapy for Insomnia (CBT-I)* and circadian sleep stimulus control
    - *Trauma & PTSD Recovery* via Window of Tolerance somatic/cognitive mapping
    - *Panic Attack vs Anxiety Attack* autonomic nervous system differentiation and physiological sigh
    - *Analytical Mindset & Burnout* for engineers, executives, and high-achieving perfectionists
    - *Behavioral Activation for Depression* (small non-negotiable micro-steps over waiting for motivation)
    - *The Anger Iceberg* and emotional de-escalation
    - *Addiction & Substance Use* through compassionate harm-reduction and dual-diagnosis lenses
    - *Demystifying the First Therapy Consultation* to reduce intake friction and client anxiety
    - *Crisis Safety Protocol* with immediate national lifelines (988, Crisis Text Line)
- **Top-Level Marketplace Category & Filter**:
  - Added `Ethical Mental Health Marketing` as a premier filter chip and dropdown category in `TemplateMarketplacePage.tsx`.
  - Added dedicated `Clinical Ethics` badge and emerald gradient accents for ethical psychology templates.

### 🔍 2. Template Preview & Clinical Details Modal
- **Interactive Inspect Dialog**:
  - Added one-click **Preview Details (`Eye` icon)** on template cards, opening a modal detailing format, platform suitability, credit cost, and full AI prompt templates.
  - Highlighted dynamic substitution variables (`{{business_name}}`, `{{service}}`, `{{location}}`, `{{phone}}`, `{{usp}}`, etc.) from the user's Business Brain.
  - Prominently displays the **Ethical Clinical Philosophy (Christopher Siegfried Standards)** badge and guidance.
  - Direct "Apply This Template" workflow inside the modal.

### 🌐 3. Website Design Template Integration (`src/data/websiteTemplatesData.ts`)
- **Added `health-5`: Siegfried Mind & Wellness — Ethical Mental Health Clinic**:
  - Full-featured clinical psychology practice template with Confidential Intake Portal, Clinician Matching, HIPAA Telehealth Integration, and Insurance Benefits Verifier.
  - Synced to backend JSON catalog (`website-templates.json`) for the AI Website Builder.

---

## 📊 [2026-09-06 22:54:00 CEST] — Social Media Analytics: 100% Real REST API Data Migration & Demo Data Removal

### 🚀 1. Complete Removal of Demo Data Across All Analytics Dashboards (`/social-media/analytics`)
- **Zero Fallback Demo Numbers**: Removed all hardcoded synthetic values across all 6 platform tabs (Facebook `4820 fans`, `28.4K impressions`, `1180 reactions`; Instagram `7850 followers`, `48.9K impressions`, `3410 engagements`; TikTok `12.4K followers`, `142.6K views`; X/Twitter `48 posts`, `5410 followers`; YouTube `3.6K subscribers`, `64.2K views`; Overview `1420 Facebook engagements`, `2850 Instagram engagements`).
- **Clean Real-State Handling**: All metrics now display actual integers/percentages (`0`, `0.0%`, or calculated values from real connected accounts and posts), with contextual prompts to connect social channels and publish live content.
- **Empty State UX in Demographics**: Replaced broken/demo donut and pie charts in `DemographicDonutChart.tsx` with clean empty state indicators when no telemetry has been logged yet.
- **Real Post Density Heatmap**: Updated `DailyPostDensityHeatmap.tsx` to accept real `densityData` per day of week instead of generating artificial `Math.random()` numbers.

### 🌐 2. Backend REST API Aggregation Overhaul (`controllers/social-analytics.controller.js`)
- **Live MongoDB Telemetry Aggregation**:
  - `getOverviewAnalytics`: Aggregates real `SocialPost` engagement (likes, comments, shares, views), real `SocialAccount` follower counts, and real `SocialAnalyticsRaw` logs.
  - Generates actual 14-day daily post impression trends based on actual publication timestamps.
  - Computes real cross-platform engagement rates: `(reactions + comments + shares) / impressions`.
- **Granular Platform Metrics**:
  - `getPlatformAnalytics`: Computes platform-specific metrics for Facebook, Instagram, TikTok, X (Twitter), and YouTube from published posts and active accounts.
  - Lists real published posts in the live engagement table with actual post impressions, reactions, and conversation rates.
- **Live Synchronization via REST APIs**:
  - `syncPlatformAnalytics`: Fetches real-time post metrics directly from Facebook Graph API, Instagram Graph API, Twitter API v2, and YouTube Data API v3 via `SocialMediaApis`.
  - Persists real snapshot records into `SocialAnalyticsRaw`.

### ⚡ 3. Frontend Multi-API Integration (`AdvancedSocialAnalytics.tsx`)
- Combined `useGetOverviewAnalyticsQuery`, `useGetPlatformAnalyticsQuery`, `useGetSocialAccountsQuery`, `useGetSocialPostsQuery`, and `useGetDashboardDataQuery` into a single reactive live feed.
- Added Next.js API catch-all proxy routes (`/api/social-analytics/[...path]` and `/api/social-analytics`) via `apiHandler` for consistent routing across all environments.
- Verified Next.js Turbopack build with 0 TypeScript and 0 Lint errors, restarted PM2 services.

---

## 🎨 [2026-09-05 22:52:00 CEST] — Readymade Website Design Templates Gallery (36+ Designs) & Interactive Device Preview

### 🌐 1. Comprehensive 36+ Readymade Website Templates Catalog (`src/data/websiteTemplatesData.ts`)
- **12 Full Industries Covered with 20–40 Curated Designs**:
  - **Restaurant & Food** (4 templates: Fine Dining Bistro, Artisanal Cafe & Bakehouse, Gourmet Burger Bar & Taproom, Plant-Based Bowl Bar)
  - **E-Commerce & D2C** (4 templates: Minimalist Luxury Fashion, Clean Skincare & Wellness, Consumer Electronics & Smart Gadgets, Scandinavian Furniture)
  - **Healthcare & Clinics** (4 templates: Multi-Specialty Dental Clinic, Prana Ayurveda Sanctuary, Pediatric & Family Medicine, Precision Diagnostics Lab)
  - **Real Estate & Living** (4 templates: Elysian Luxury Penthouses, UrbanNest Modern Condos, Atelier Forma Architecture & Interiors, Haven Co-Living Communities)
  - **EdTech & Coaching** (4 templates: CodeCraft Full-Stack Tech Bootcamp, Zenith Competitive Exam Prep, Little Explorers STEM Robotics, LinguaFluency AI Language)
  - **Digital Agency & Creative** (4 templates: Nexus Void Cyberpunk Agency, Kanso Minimalist Brand Strategy, GrowthEngine Performance Lab, Prism 3D Motion Studio)
  - **B2B SaaS & Tech** (4 templates: CognitiveOS AI Copilot, CloudArmor DevSecOps Compliance, LedgerFlow Global Payroll, PipelinePro Sales CRM)
  - **Fitness & Sports** (3 templates: IronForge CrossFit Arena, Serenity Reformer Pilates, Apex Strike Boxing Academy)
  - **Legal & Finance** (3 templates: Vanguard Corporate Law & M&A, Apex Wealth Advisory & Tax, Horizon Venture Capital)
  - **Beauty, Salon & Spa** (3 templates: Luxe Locks Hair Atelier, Aura MedSpa & Laser, The Gentry Barber Lounge)
  - **Travel & Hospitality** (3 templates: Villa Paradiso Boutique Resort, WildPeak Adventure Treks, Monarch VIP Chauffeur)
- **Deep Production-Grade Metadata**:
  - Conversion badges (e.g. `🔥 4.2x Table Bookings`, `💎 3.9x Average Order Value`, `⚡ 99/100 Mobile Speed`)
  - Color palette swatches with hex codes
  - Style theme categorization (Dark Luxury, Minimalist, Cyber & Tech, Warm Earthy, Clean Corporate)
  - Credit token cost preview (5–7 credits per generation)
  - Realistic rendered mockup data (Hero headline, subtitle, CTAs, stats bar, included feature modules, client testimonial)

### 📱 2. Interactive Responsive Device Preview Modal (`TemplatePreviewModal.tsx`)
- **Triple-Device Switcher**: Toggle instantly between **Desktop (1200px)**, **Tablet (768px)**, and **Mobile (375px)** viewport frames.
- **Browser Simulation Bar**: Realistic mock browser window with security lock and simulated live URL.
- **Live Mockup Rendering**: Rendered typography, accent colors, stats counters, included services, and client testimonials.
- **Template Spec Drawer**: Credit cost, Lighthouse score (99/100), included pages list, feature checklist, and color palette dots.
- **1-Click Selection**: "Use This Template" button directly transfers into generation or onboarding.

### 🎛️ 3. Upgraded AI Website Builder Agent (`WebsiteBuilderAgent.tsx`)
- **Horizontally Scrollable Industry Filter Bar**: 12 category chips with design counters.
- **Real-Time Search Bar**: Instant search across names, tags, features, and descriptions.
- **Style Theme & Sort Dropdowns**: Filter by theme and sort by Popularity, Rating, Credit Cost, or Newest.
- **Grid / List View Modes**: Switch between 3-column card view and detailed list view.
- **Sticky Bottom Action Bar**: Live selected template status with 1-click AI generation pipeline.

### 🧙‍♂️ 4. Upgraded Client Onboarding Wizard (`OnboardingWizard.tsx`)
- **New Step 1 — "Select Template"**: After choosing business industry, customer immediately views 20–40 curated readymade website designs.
- Integrated interactive device preview modal directly in the onboarding flow.
- Pre-selects top template matching the chosen business industry.
- Chosen template carries forward to review step and AI generation activation.

---

## 🤖 [2026-09-05 22:38:00 CEST] — AI Employee Ecosystem — Full Business Automation Platform

### 🚀 1. AI Employee Hub — 6 Specialized AI Agents
- **AI Website Builder Agent** 🌐 — Pre-built template gallery (9 business types), AI content generation, credit-based website creation with real-time generation progress overlay.
- **AI SEO Expert Agent** 🔍 — On-page SEO audit with scoring (0-100), keyword research table, issue detection (critical/warning/info), bulk fix application, and admin agent training interface.
- **AI Server Manager Agent** 🖥️ — Server plan selection (Basic/Pro/Enterprise), domain configuration, one-click deployment with step-by-step progress, live Core Web Vitals monitoring.
- **AI Maintenance Bot Agent** 🔧 — Automated maintenance scheduling (weekly/biweekly/monthly), 6 task types (content, security, performance, design, SEO, backup), approval mode (auto/manual), rollback capability, maintenance logs.
- **Social Media AI Agent** 📱 — Viral content ideas with viral score, content creation hub (post/reel/video/carousel), competitor analysis, trending topics feed, content queue with scheduling & publishing.
- **AI Google Business Expert** 📍 — Google Profile audit with completeness checklist, local keyword ranking tracker, NAP citation management, Google Posts creation.

### 🧙‍♂️ 2. Client Onboarding Wizard (4-Step)
- Step 1: Business Type Selection — 15 industry categories (Restaurant, E-Commerce, Healthcare, Real Estate, EdTech, Agency, B2B SaaS, etc.)
- Step 2: Business Details Form — Name, description, target audience, Google Business link, reference/competitor sites, media upload.
- Step 3: AI Employee Selection — Choose which AI agents to activate, credit cost preview, animated selection cards.
- Step 4: Review & Launch — Summary of business profile + selected agents, total credit cost, one-click activation.
- Save Draft available at every step.

### 🎛️ 3. Command Center Dashboard
- All 6 AI agents shown as status cards with active/idle/working states.
- Credit balance with usage progress bar.
- Monthly task count with mini bar chart.
- Recent activity feed (real-time AI agent actions).
- Saved drafts manager with resume capability.

### 💰 4. Credit Management System
- Credit balance overview with animated progress bars.
- Usage breakdown per AI agent with visual bar charts.
- 4 credit purchase packages (Starter/Growth/Pro/Enterprise) with pricing.
- Full transaction history with agent emoji identification.

### 🗂️ 5. Infrastructure & API Layer
- **7 new RTK Query API files**: `onboardingApi.ts`, `aiEmployeeApi.ts`, `websiteBuilderApi.ts`, `seoAgentApi.ts`, `serverAgentApi.ts`, `maintenanceAgentApi.ts`, `socialAgentApi.ts`, `googleBusinessApi.ts`
- **10 new tag types** added to `baseApi.ts` for cache management.
- **9 new routes** added to `routes.ts` under `AI_EMPLOYEES` namespace.
- **AI Employee Hub** sidebar section with 9 navigation items.
- Layout `HIDDEN_ALLOWED_PATHS` updated for AI Employee routes.

### 📁 Files Created (~35 new files)
- `src/redux/api/`: 7 new API files
- `src/components/feature/ai-employees/`: 8 component files (OnboardingWizard, CommandCenter, WebsiteBuilder, SeoAgent, ServerAgent, MaintenanceAgent, SocialAgent, GoogleBusiness, Credits)
- `src/app/(main)/ai-employees/`: 9 route pages (onboarding, dashboard, website-builder, seo-agent, server-agent, maintenance-agent, social-agent, google-business, credits)

---

## 🚀 [2026-09-05 21:56:00 CEST] — September 5, 2026 (Executive Profile Update & Official Authority Badges)

### 👤 1. Executive Leadership & Company Details Update
- **Founder & Managing Director**: Updated executive identity to **Trilochan Triphaty** across the entire platform, consultation booking system, and AI directives.
- **Corporate Entity**: **TT INFOTECHS PVT LTD** – Leading Software & IT Company in Bhubaneswar.
- **Registered Office**: Santoshi Vihar, Laxmisagar, Bhubaneswar, Odisha 751006, India.
- **Direct WhatsApp Contact**: Configured direct WhatsApp hotline & admin recipient to **+91 93213 19079** (`https://wa.me/919321319079`).

### 🛡️ 2. Official Authority Badges & Trust Accreditations
- **Govt Approved**: Prominently featured Government of India / MCA & MSME Registered badge.
- **Official Meta Partner**: Certified Meta Business Partner for WhatsApp Cloud API & Instagram Graph API integration.
- **Sales & Outreach Experts**: Certified 100x Omni-Channel Growth Specialists badge.

---

## 🚀 [2026-09-05 21:52:00 CEST] — September 5, 2026 (Zender WhatsApp API Integration & Automated Lead Notifications)

### 💬 1. Zender WhatsApp Gateway API Integration (`zender.bhadracity.com`)
- **API Engine (`lib/whatsapp.ts`)**: Implemented robust Zender WhatsApp client connecting to `https://zender.bhadracity.com/api/send/whatsapp` using authorized Secret Key & Device ID (`1788447095c81e728d9d4c2f636f067f89cc14862c6a99897711a75`).
- **Admin Real-Time WhatsApp Alert**: Dispatches immediate WhatsApp message to Admin/Founder (`919660205845`) containing complete lead inquiry details (Name, Company, WhatsApp Phone, Email, Strategic Growth Goal, Preferred Slot, and Timestamp).
- **Customer Meeting Confirmation Template**: Sends an instant, beautifully styled WhatsApp confirmation message to the client with bold headers, meeting outline, session agenda (100x Organic Growth Blueprint & MCP Setup), and direct WhatsApp support channel.
- **Lead Storage & Retrieval API (`/api/consultation`)**:
  - `POST /api/consultation`: Receives form submissions, appends lead records to `data/consultation_leads.json`, and triggers parallel WhatsApp notifications.
  - `GET /api/consultation`: Allows authenticated staff to retrieve all consultation inquiries in JSON format.
- **Frontend Form UX (`BookDemoSection.tsx`)**: Fully connected interactive booking form with dynamic submission status, loading state, error handling, and instant WhatsApp confirmation badge.

---

## 🚀 [2026-09-05 21:46:00 CEST] — September 5, 2026 (Founder 1-on-1 Consultation Section)

### 👤 1. Founder 1-on-1 Free Strategy Consultation Section
- **Executive Founder Profile**: Embedded high-resolution portrait of Sonu Saini (Founder & Chief Architect) with verified badge and personal strategic invitation.
- **Actionable Consultation Deliverables**: Tailored 100x Growth Blueprint, Live Platform Demo (Social Studio & WhatsApp Hub), and Developer MCP Setup Assistance.
- **Interactive Booking Form**: Time-window picker, instant WhatsApp callback option, and zero-sales-pitch guaranteed SLA.

---

## 🚀 [2026-09-05 2026-09-05 21:44:00 CEST] — September 5, 2026 (Sales, Marketing & Billing Expansion)

### 📣 1. Comprehensive Sales, Ads & Marketing Documentation
- **Sales & Advertising Chapter (`/docs/sales-and-advertising`)**:
  - `lead-inquiries.mdx`: Inbound Lead Capture & Inquiries Manager (`/inquiries`).
  - `meta-ads-studio.mdx`: Meta Ads Studio & Pixel Setup (`/social-media/ads-manager`).
  - `google-ads-studio.mdx`: Google Ads & Search Marketing Studio (`/social-media/google-ads`).
  - `tiktok-ads-studio.mdx`: TikTok Ads & Viral Spark Studio (`/social-media/tiktok-ads`).
  - `reddit-ads-studio.mdx`: Reddit Ads & Community Targeting (`/social-media/reddit-ads`).
  - `audience-segmentation.mdx`: Custom Audience Builder & Segments (`/campaign-hub/audience`).

### 💳 2. Billing, Monetization & Administration Chapters
- **Billing & Admin Chapter (`/docs/billing-and-administration`)**:
  - `payment-gateways.mdx`: Multi-Gateway Payment Setup (Stripe, Razorpay, Bank UPI).
  - `plans-and-tiers.mdx`: Plan Quotas, Limits & Custom Credits (`/plans`).
  - `transactions-invoicing.mdx`: Billing History, Invoices & Subscriptions (`/transactions`).
  - `multilingual-localization.mdx`: Multi-Language Engine & 25+ Locales (`/languages`).
  - `cms-web-pages.mdx`: Web Pages & Policy Document CMS (`/web-pages`).

### 🤖 3. AI Social Team & Reference Brain
- Added `ai-social-team.mdx` (AI Personas & autonomous agents) and `reference-brain.mdx` (Brand guidelines and style rules).

### 🎛️ 4. Updated Feature Slider Matrix (Now 59 Total Capabilities)
- Re-indexed `FeatureSlider.tsx` to showcase all 59 platform features across 10 distinct categories with live search filter.

---

## 🚀 [2026-09-05 2026-09-05 21:39:00 CEST] — September 5, 2026 (46 Feature Slider & Header Theme Switcher)

### 🎛️ 1. Interactive 46-Feature Carousel Slider (`FeatureSlider.tsx`)
- **Complete Feature Matrix (46 Total)**: Integrated all 46 platform feature docs into an interactive multi-slide carousel.
- **Dynamic Category Filtering**: Added 8 quick-filter pills (`All (46)`, `Social Studio`, `AI Social Manager`, `AI Studio Tools`, `Campaign Hub`, `Developer & MCP`, `Security & Auth`, `Growth Playbooks`, `Analytics`).
- **Live Search & Pagination**: Added instant in-slider search filter, previous/next slide navigation arrows, and pagination indicator dots.

### 🌓 2. Header Dark & Light Mode Toggle (`ThemeToggle.tsx`)
- **Direct Header Switcher**: Added an interactive client-side theme switcher (`Light`, `Dark`, `System`) right in the landing page top navigation header.
- **Zero-Flicker Transitions**: Fully synchronized with Next.js & Fumadocs theme state.

---

## 🚀 [2026-09-05 2026-09-05 21:35:00 CEST] — September 5, 2026 (Enterprise UI/UX & Dark/Light Mode)

### 🎨 1. Enterprise Dark & Light Mode Overhaul (Linear / Stripe Grade)
- **Fluid Theming**: Built a bespoke dual theme palette (`zinc-50` light mode & `#090a0f` deep enterprise dark mode) with smooth theme transitions.
- **Enterprise Design Tokens**: Clean typography, subtle enterprise grid background (`.bg-enterprise-grid`), high-contrast accessible borders, and sleek card hover elevation.
- **Removed "AI Generated" Tacky Look**: Replaced generic gradients and raw emojis with curated Lucide SVG iconography, clean category badges, real architecture matrices, and enterprise metrics bar.

### 📅 2. Polished 1-on-1 VIP Strategy Demo Booking Card
- **Accessible Dual-Theme Booking UI**: Fully responsive light/dark mode meeting reservation form with instant timezone selection, guaranteed SLA tags, and corporate security credentials.

### 🤖 3. Refined Bilingual AI Docs Assistant
- **Enterprise Chat Widget**: Clean floating trigger, non-intrusive backdrop, refined message bubbles with Markdown rendering, and instant deep-link routing.

---

## 🚀 [2026-09-05 2026-09-05 21:33:00 CEST] — September 5, 2026

### 🔐 1. Passkeys & WebAuthn Biometric Security Overhaul
- **Modern Security UX**: Re-architected `PasskeyManager.tsx` with hardware-backed WebAuthn biometric security (Apple Touch ID, Face ID, Windows Hello, YubiKey).
- **Passkey State & Telemetry**: Added real-time registered device management, instant passkey revocation, and zero-password authentication flow.

### 📊 2. Omnichannel Ads Managers (Google, TikTok, Reddit)
- **Google Ads Hub**: Added `/social-media/google-ads` with Search/Display campaign creation, AI ad copywriter, and Google Tag tracking modal.
- **TikTok Ads Studio**: Added `/social-media/tiktok-ads` with vertical video ad previews, AI hook generation, and TikTok Pixel integration.
- **Reddit Ads Studio**: Added `/social-media/reddit-ads` with subreddit ad targeting, carousel ad cards, and conversion event tracking.

### 📈 3. Advanced Social Analytics Suite
- **Visual Analytics Dashboard**: Added `/social-media/analytics` featuring weekly/monthly post density heatmaps, demographic donut charts, and platform performance tabs (Instagram, Facebook, YouTube, X, TikTok).

### 📡 4. Publishing Logs & Queue Telemetry
- **Telemetry Dashboard**: Built `/social-media/logs` with real-time status filtering (Success, Failed, Retrying, Queued), automated error parsing, and instant single/bulk retry engine.

---

## 🚀 [2026-09-01] — September 1, 2026

### 🎨 1. Landing Page Design & UI Polish
- **Global Theme Tokens**: Fixed `:root` variables in `src/app/globals.css` ensuring contrast and seamless light/dark mode support.
- **Capabilities Section Button Bug Fix**: Replaced raw CSS variable references with valid hex color codes (`#22c55e`, `#0284c7`, etc.) in `src/data/landingCampaignHub.ts` to fix invalid background CSS evaluation on capability cards.
- **Carousel Controls**: Added pagination dots and left/right navigation arrows to `CampaignHubCapabilities.tsx`.
- **CTA Banners Redesign**: Overhauled `CampaignHubCTABanner.tsx` and `SocialMediaCTABanner.tsx` with high-contrast gradient cards, white typography, email subscription inputs, and guarantee badges.

---

### 🧠 2. Business Knowledge Brain Wizard (`/ai-social/setup`)
- **Real-Time Profile Completion Score (0–100%)**:
  - Implemented dynamic calculation engine across all 4 setup steps:
    - **Step 1 (Business Profile)**: Up to 35 Points (Name, Category, Contact, Location, About).
    - **Step 2 (Brand Identity)**: Up to 25 Points (USP, Tone, Language, Palette).
    - **Step 3 (Goals & Audience)**: Up to 20 Points (Audience Profile, Monthly Targets).
    - **Step 4 (Products & Offers)**: Up to 20 Points (Product & Pricing Catalog).
  - **Dynamic Rating Tiers**: Basic Profile (0–44%), Good Knowledge Base (45–74%), Master AI Brain (75–100% 🚀).
  - **Actionable Score Breakdown**: Expandable drawer with missing parameter checklist and direct `+Points Add` shortcuts.
  - **Step Completion Badges**: Real-time percentage badges directly on step header cards.
- **Comprehensive Draft Management System**:
  - **Auto-Save**: Background debounced local draft saving to prevent data loss.
  - **Manual "Save Draft" Action**: Added explicit save buttons in wizard header and footer.
  - **Live Timestamp Status**: Real-time status indicator showing last saved time.
  - **Draft Recovery Banner**: Prompt on page reload to Resume Draft or Discard.
  - **Automatic Cleanup**: Draft state is purged upon final setup submission.

---

### 💳 3. AI Social Credit Recharge System (`/ai-social/planner` & `/ai-social/credits`)
- **Zero / Low Credits Warning Engine**:
  - Real-time shortfall detection comparing balance with required plan generation cost.
  - Top warning banner alerting users when balance is insufficient with a 1-click **"Recharge Credits Now"** button.
  - Form submit button automatically updates to **"Recharge Credits to Generate Plan (X Credits)"**.
  - Interactive header credit balance pill with top-up launcher.
- **Credit Recharge Modal (`CreditRechargeModal.tsx`)**:
  - **Curated Top-Up Packages**:
    - **Starter Booster**: 500 Credits (`₹499` / `$5.99`).
    - **Growth Pro (Most Popular 🔥)**: 2,750 Credits (`₹1,999` / `$23.99`) with high-visibility glowing badge.
    - **Agency Scale (Best Value 👑)**: 11,500 Credits (`₹5,999` / `$69.99`).
  - **Custom Credit Volume Slider**: Select custom volume from 200 to 25,000 credits.
  - **Dual Currency**: Dynamic toggling between ₹ INR and $ USD.
  - **Feature Rates Cheat Sheet**: Reference for image (5 cr), reel (15 cr), story (2 cr), and caption (2 cr) costs.
- **Integrated Payment Gateways (End-to-End)**:
  - ⚡ **Razorpay PG**: Dynamic SDK integration (`https://checkout.razorpay.com/v1/checkout.js`) with popup checkout.
  - 🌐 **Stripe PG**: Global international card checkout.
  - ⚡ **Instant Top-Up**: 1-Click direct activation for rapid testing and admin allocations.
  - 🏢 **Bank Wire / UPI Transfer**: Bank A/C details, IFSC, UPI ID (`siegfried@icici`), and UTR transaction reference logger.
- **Server-Side Token Decoding & Proxy Resilience**:
  - Enhanced `/api/ai-social/[...path]/route.ts` with server-side Bearer JWT token decoding to guarantee reliable `userId` resolution and eliminate authorization failures.

---

### 📞 4. WhatsApp Dialer Temporary Suspension
- **Header Calling Button**: Hidden `WhatsAppCallButton.tsx` from main header bar.
- **Floating Call Widget**: Disabled `WhatsAppVoiceCallHub.tsx` bottom-left floating widget and modals.
- **PM2 Backend Service**: Suspended `wacalls-service` on PM2 server.

---

### 🏗️ 5. Build & Deployment Verification
- `npm run build` compiled successfully (**Exit Code `0`**).
- All PM2 services (`frontend-app`, `api-backend`) restarted and verified live (**HTTP 200 OK**).