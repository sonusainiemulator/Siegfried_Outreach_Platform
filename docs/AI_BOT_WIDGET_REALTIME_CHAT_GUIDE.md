---
title: AI Bot Widget Real-Time Chat & Live Handover (AI बॉट विजेट रियल-टाइम एडमिन चैट)
description: Complete step-by-step bilingual manual, real-time Ably/Socket.io delivery architecture, live agent takeover, and industry case studies for the Siegfried Outreach AI Bot Widget.
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

## ⚡ AI Bot Widget Real-Time Chat & Live Agent Handover

The **Siegfried Outreach AI Bot Widget** integrates an autonomous artificial intelligence assistant with a **zero-latency real-time human takeover system**. Website visitors can chat with an AI trained on your business documents and instantly transition to a live human admin whenever complex inquiries or high-value purchase decisions arise.

---

## 🏗️ Architectural Overview & Real-Time Data Pipeline (सिस्टम आर्किटेक्चर)

<Tabs items={['English Technical Architecture', 'हिंदी तकनीकी आर्किटेक्चर']}>
  <Tab value="English Technical Architecture">
    The platform employs a **dual-channel real-time pipeline**:
    
    1. **Visitor-Facing Pub/Sub (Ably Realtime)**:
       - The embeddable widget (`chatbot-widget.js`) dynamically renders an isolated sandboxed iframe.
       - The client subscribes to an encrypted Ably channel: `chat:[chatbotId]:[sessionId]`.
       - When an admin sends a reply from the dashboard, it is pushed directly to this channel and renders in the visitor's widget within **under 80ms** without polling or page refreshes.
    
    2. **Internal Staff Real-Time Mesh (Socket.io)**:
       - Admin dashboards connect to the primary WebSocket server (`NEXT_PUBLIC_SOCKET_URL`).
       - Each admin joins their personal authenticated room (`user_[adminUserId]`).
       - When a visitor requests an agent or sends a message, the server emits `receive-message` and `conversation-updated` events.
       - The frontend hook (`useSocketHandlers.ts`) plays an immediate audio chime, requests desktop push notification, and moves the chat thread to the top of the queue.

    ```
    +------------------+         REST POST          +-----------------------+
    |  Website Visitor | -------------------------> |  Backend API Server   |
    |  (Widget Iframe) | <------------------------- | (Express + MongoDB)   |
    +------------------+     Ably Realtime Pub      +-----------------------+
            ^                 chat:botId:sessionId              |
            |                                                   | Socket.io
            |                                                   | user_[adminId]
            |                                                   v
            |           POST /agent/conversation/reply      +-----------------------+
            +---------------------------------------------- | Admin Live Dashboard  |
                                                            | (/ai-live-agent)      |
                                                            +-----------------------+
    ```
  </Tab>

  <Tab value="हिंदी तकनीकी आर्किटेक्चर">
    यह सिस्टम दोहरे रियल-टाइम आर्किटेक्चर पर काम करता है:
    
    1. **विजिटर चैनल (Ably Realtime)**:
       - आपकी वेबसाइट पर लगा विजेट (`chatbot-widget.js`) एक सुरक्षित आईफ्रेम खोलता है।
       - यह विजेट एक प्राइवेट चैनल `chat:[chatbotId]:[sessionId]` से जुड़ा होता है।
       - जैसे ही एडमिन अपने डैशबोर्ड से जवाब भेजता है, मैसेज बिना पेज रीलोड किए **1 सेकंड से भी कम समय** में विजिटर की स्क्रीन पर लाइव दिख जाता है।
    
    2. **एडमिन टीम मैश (Socket.io)**:
       - एडमिन डैशबोर्ड वेबसॉकेट (`Socket.io`) से हमेशा कनेक्ट रहता है।
       - जब भी कोई ग्राहक लाइव एजेंट मांगता है, एडमिन को तुरंत ऑडियो टोन (Chime Alert) बजती है और डेस्कटॉप नोटिफिकेशन मिलता है।
       - कन्वर्सेशन अपने आप लिस्ट में सबसे ऊपर आ जाती है।
  </Tab>
</Tabs>

---

## 🎛️ Interaction Modes: Autonomous vs. Hybrid vs. Human-Only

In **AI Bot Studio ➔ Configure ➔ Interaction Type**, you can switch between three modes:

| Mode | Behavior | Best Used For |
| :--- | :--- | :--- |
| **`ai_only`** | AI bot handles 100% of incoming questions using trained knowledge base (PDFs, URLs, Q&A). | Standard product information, after-hours FAQ handling, automated documentation lookup. |
| **`hybrid`** *(Recommended)* | AI bot answers automatically until an escalation keyword is triggered or the visitor asks for a human. An alert is sent to admins for instant takeover. | E-Commerce checkout assistance, high-intent lead qualification, complex customer service. |
| **`human_only`** | Bypasses AI response generation completely. All incoming questions route directly to waiting support staff. | VIP concierge desks, dedicated technical support tiers, medical consultations. |

---

## 🛠️ Step-by-Step Guide: How Admins Chat in Real Time

<Tabs items={['English Walkthrough', 'हिंदी गाइड']}>
  <Tab value="English Walkthrough">
    ### Step 1: Configure Escalation in AI Bot Studio
    1. Open **AI Bot Studio** (`/ai-bot-studio`) and select your chatbot.
    2. Go to the **Configure** tab and set **Interaction Type** to `Hybrid (AI + Human Handover)`.
    3. Specify your **Escalation Keywords**:
       - Default triggers: `human`, `agent`, `support`, `representative`, `talk to someone`, `help`.
       - Add custom triggers: `pricing`, `manager`, `refund`, `urgent`, `custom quote`.
    4. Set your **AI Handoff Message**:
       - e.g., *"Connecting you with a senior product specialist now. Please hold on for a moment."*
    5. Set your **Fallback Message** for times when no human agents are currently online.

    ### Step 2: Embed the Universal Widget
    1. Open the **Embed** tab in AI Bot Studio.
    2. Copy the snippet and paste it right before the `</body>` tag on your website:
       ```html
       <script 
         src="https://siegfriedoutreach.com/js/chatbot-widget.js" 
         data-chatbot-uuid="YOUR_CHATBOT_ID" 
         data-position="bottom-right" 
         async>
       </script>
       ```

    ### Step 3: Monitor Inbound Requests in AI Live Agent (`/ai-live-agent`)
    1. Navigate to **AI Live Agent** (`/ai-live-agent`) or the **Shared Inbox** (`/social-media/shared-inbox`).
    2. When a visitor triggers escalation:
       - An audible **chime alert** plays immediately.
       - A browser notification displays the visitor's first message and location.
       - The conversation row highlights in real time with an `Online` pulse indicator.

    ### Step 4: Live Messaging & Takeover
    1. Select the conversation to review the visitor's full dialogue history with the AI bot.
    2. Type your message in the reply input box.
    3. **Send Attachments**: Click the paperclip icon to send product brochures, invoices, screenshots, or PDF guides.
    4. **AI Copilot Suggestions**: Click the ✨ **AI Suggest** button to generate an instant context-aware smart response draft, review it, edit if necessary, and dispatch.
    5. **Internal Team Notes**: Toggle the composer to `Note` to leave private internal comments (marked with 🔒) visible only to your staff.

    ### Step 5: Resolve and Hand Back to AI
    1. Once the customer's query is fulfilled, click **Resolve Chat**.
    2. The system sends a resolution confirmation notice and switches `isHandedOffToHuman` back to `false`.
    3. Future inquiries by the visitor will once again be handled automatically by the AI bot unless escalated again.
  </Tab>

  <Tab value="हिंदी गाइड">
    ### स्टेप 1: AI बॉट स्टूडियो में लाइव हैंडओवर चालू करें
    1. **AI Bot Studio** (`/ai-bot-studio`) में जाकर अपना बॉट चुनें।
    2. **Configure** टैब में जाएं और **Interaction Type** को `Hybrid` चुनें।
    3. **Escalation Keywords** दर्ज करें (जैसे: `agent`, `human`, `support`, `मदद`, `बात करनी है`, `डिस्काउंट`)।
    4. जब ग्राहक इनमें से कोई शब्द लिखेगा, बॉट तुरंत चैट को एडमिन को ट्रांसफर कर देगा।

    ### स्टेप 2: वेबसाइट पर विजेट कोड लगाएं
    1. **Embed** टैब से स्क्रिप्ट कोड कॉपी करें और वेबसाइट के HTML में `</body>` से पहले पेस्ट करें।

    ### स्टेप 3: लाइव एजेंट डैशबोर्ड (`/ai-live-agent`) में चैट रिसीव करें
    1. जैसे ही कोई ग्राहक चैट ट्रांसफर ट्रिगर करता है, एडमिन पोर्टल पर घंटी (ऑडियो अलर्ट) बजती है।
    2. चैट लिस्ट में ग्राहक का नाम और मैसेज सबसे ऊपर दिखने लगता है।

    ### स्टेप 4: रियल-टाइम में चैट करें
    1. चैट पर क्लिक करें और ग्राहक की पिछली बातें देखें।
    2. नीचे मैसेज बॉक्स में टाइप करके भेजें — ग्राहक के पास तुरंत मैसेज पहुंच जाएगा।
    3. **AI Copilot**: ✨ बटन दबाकर AI से तैयार जवाब का सुझाव लें और 1-क्लिक में भेजें।
    4. **इंटरनल नोट (🔒)**: स्टाफ के लिए प्राइवेट नोट्स लिखें जो ग्राहक को नहीं दिखेंगे।

    ### स्टेप 5: चैट क्लोज करें (Resolve)
    1. काम पूरा होने पर **Resolve Chat** पर क्लिक करें। बॉट दोबारा एक्टिव हो जाएगा और अगले सवालों के जवाब खुद देगा।
  </Tab>
</Tabs>

---

## 🏢 Real-World Industry Use Cases & Case Studies (वास्तविक उद्योग केस स्टडीज)

<Tabs items={['English Case Studies', 'हिंदी केस स्टडीज']}>
  <Tab value="English Case Studies">
    ### 🛍️ 1. D2C E-Commerce Brand (High-Ticket Fashion & Luxury Watches)
    - **Challenge**: Visitors browsing luxury watches ($1,500+) abandoned cart when having doubts about warranty, sizing, or international shipping.
    - **Solution**: The AI Bot handled standard catalog queries. If a customer spent more than 3 minutes on checkout or typed *"discount on bulk purchase"*, the bot handed off the chat to an online sales manager.
    - **Impact**: Increased checkout conversions by **42%** and recovered **$28,000** in abandoned cart revenue within the first 30 days.

    ### 🏥 2. Multi-Specialty Hospital & Dental Clinic (Critical Patient Triage)
    - **Challenge**: Patients asking about post-surgical pain or urgent appointment slots needed immediate human attention instead of generic bot answers.
    - **Solution**: Configured keywords like *"pain"*, *"emergency"*, *"doctor unavailable"*, and *"bleeding"* to instantly bypass AI and ring the emergency nursing desk.
    - **Impact**: Patient response time dropped from **18 minutes to 12 seconds**, achieving a 99.4% patient satisfaction rating.

    ### 🏢 3. Real Estate Agency (Luxury Villas & Commercial Office Leasing)
    - **Challenge**: High-net-worth buyers required confidential pricing, customized payment schedules, and private weekend site visit bookings.
    - **Solution**: The AI Bot collected buyer budget, preferred locality, and phone number. Once qualified as an accredited buyer, the senior property broker took over the live widget chat in real time.
    - **Impact**: Closed 7 commercial lease agreements worth **$180,000 ARR** directly through the live chat widget takeover.

    ### 💻 4. B2B Enterprise SaaS Platform (Security & Custom SLAs)
    - **Challenge**: Enterprise buyers asked bespoke compliance questions (SOC2 Type II, HIPAA, Dedicated VPC hosting) that standard knowledge bases couldn't answer conclusively.
    - **Solution**: Hybrid handoff routed compliance queries directly to the solutions architect on duty, with AI Copilot drafting answers from the internal technical handbook.
    - **Impact**: Shortened enterprise sales cycle from **45 days down to 14 days**.
  </Tab>

  <Tab value="हिंदी केस स्टडीज">
    ### 🛍️ 1. ई-कॉमर्स और ऑनलाइन स्टोर (महंगे प्रोडक्ट्स की बिक्री)
    - **समस्या**: ग्राहक 10,000+ रुपये के प्रोडक्ट्स खरीदते समय साइज, वारंटी और डिलीवरी को लेकर संकोच करते थे और वेबसाइट छोड़ देते थे।
    - **समाधान**: बॉट ने सामान्य सवालों के जवाब दिए। जैसे ही ग्राहक ने *"डिस्काउंट"* या *"तुरंत डिलीवरी"* पूछा, सेल्स एडमिन ने लाइव चैट टेकओवर करके स्पेशल कूपन कोड दिया।
    - **परिणाम**: बिक्री में **42% की बढ़ोतरी** और कार्ट अबैंडनमेंट में भारी कमी।

    ### 🏥 2. हॉस्पिटल और क्लिनिक (इमरजेंसी मरीज सहायता)
    - **समाधान**: *"दर्द"*, *"इमरजेंसी"*, *"डॉक्टर से बात करनी है"* जैसे शब्दों पर बॉट ने तुरंत अस्पताल के रिसेप्शनिस्ट को अलर्ट भेजा। 
    - **परिणाम**: मरीज को 15 सेकंड के भीतर इंसानी मदद मिली।

    ### 🏢 3. रियल एस्टेट और प्रॉपर्टी ब्रोकर्स (प्लॉट और फ्लैट्स की बुकिंग)
    - **समाधान**: बॉट ने ग्राहक का बजट और पसंदीदा लोकेशन पूछी। सीरियस खरीदार मिलते ही एजेंट ने लाइव चैट शुरू करके साइट विजिट का समय तय कर लिया।
    - **परिणाम**: 1 महीने में 7 बड़ी प्रॉपर्टीज की फाइनल डील लॉक हुई।
  </Tab>
</Tabs>

---

## 🛡️ Security, Privacy & Team Permissions

1. **Role-Based Access Control (RBAC)**:
   - Only staff with **`Reply Queries`** permission can view conversation threads and dispatch replies.
   - Only staff with **`Manage Agents`** permission can reassign chats or modify interaction modes.
2. **Encrypted Live Channels**:
   - Each session uses a cryptographically unique `sessionId` matching device fingerprints to prevent message tampering or cross-session leakage.
3. **Audit Log & Agent Attribution**:
   - Every message sent by an admin records the staff member's `senderId`, name, and timestamp for quality assurance and compliance auditing.

---

## 🏷️ Related Feature Keywords & Search Tags

<div className="flex flex-wrap gap-2 pt-2">
  `#AIBotWidget` `#RealtimeAdminChat` `#LiveAgentTakeover` `#HumanInTheLoop` `#AblyRealtime` `#SocketIO` `#OmnichannelInbox` `#EscalationKeywords` `#AICopilot` `#CustomerSupport`
</div>
