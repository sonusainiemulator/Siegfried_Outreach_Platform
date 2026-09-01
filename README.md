<div align="center">

# 🚀 Siegfried Outreach Platform
### Autonomous AI Marketing & Omnichannel Growth Engine

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-Proprietary-amber?style=for-the-badge)](https://siegfriedoutreach.com)

**[Explore Live Platform](https://siegfriedoutreach.com)** • **[API Documentation](https://api.siegfriedoutreach.com)** • **[Contact Support](#-contact--support)**

---

</div>

## 📖 Overview

**Siegfried Outreach** is an all-in-one, enterprise-grade AI marketing and omnichannel broadcast platform. It empowers businesses, marketing agencies, and growth teams to automate entire 30-day content strategies, generate hyper-contextual social copy, manage cross-platform publishing, and broadcast high-converting campaigns across WhatsApp, Telegram, and Email.

---

## ✨ Key Features

### 🧠 1. Business Knowledge Brain (`/ai-social/setup`)
- **Real-Time Profile Completion Score (0% – 100%)**: Dynamic 4-step scoring meter evaluating business fundamentals, USP, brand tone, target audience, and catalog items.
- **Smart AI Brain Tiers**: Basic Profile, Strong AI Memory, and Master AI Brain (75%+ Ready 🚀).
- **Interactive Checklist & Recommendations**: 1-click jump-to-field shortcuts to boost AI generation accuracy.
- **Resilient Draft Management**: Background debounced auto-saving, manual "Save Draft", and reload recovery banner.

### 📅 2. AI Marketing Strategy Planner (`/ai-social/planner`)
- **30-Day Autonomous Campaign Generation**: Generates balanced content mixes (Educational, Promotional, Authority, Testimonials, FAQs, Festival hooks).
- **Multimodal Output**: Auto-generates captions, hashtags, image creative prompts, and video reel scripts.
- **Lead & Conversion Targeting**: Set specific monthly inquiry and appointment targets.

### 💳 3. Credit Recharge & Billing Engine (`/ai-social/credits`)
- **Zero-Credit Shortfall Detection**: Automated warnings and protected action triggers when credit balances are low.
- **Instant Top-Up Packages**: Starter Booster (500 credits), Growth Pro (2,750 credits 🔥), Agency Scale (11,500 credits 👑), and custom volume sliders.
- **Integrated Payment Gateways**:
  - ⚡ **Razorpay**: UPI, GPay, PhonePe, Cards, NetBanking, Wallets.
  - 🌐 **Stripe**: Global card checkout (Visa, MasterCard, Amex).
  - ⚡ **Instant Direct Activation**: 1-Click test & admin allocation.
  - 🏢 **Bank Wire / UPI**: Bank account details with UTR reference logger.
- **Audit Ledger**: Comprehensive audit trail recording allocations, usage, reserves, and refunds.

### 📢 4. Omnichannel Campaign Hub (`/campaign-hub`)
- **Multi-Channel Broadcasts**: Unified broadcast engine for WhatsApp, Telegram, and Email.
- **Audience Segmentation & Tags**: Group contacts by tags, demographics, and buying intent.
- **Unified Message Inbox**: Centralized message stream with real-time websocket updates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 15 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) |
| **Language & Types** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Design System** | [TailwindCSS](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons |
| **State Management & API** | [Redux Toolkit](https://redux-toolkit.js.org/), RTK Query |
| **Realtime & Sockets** | [Socket.io Client](https://socket.io/) |
| **Backend Service** | Node.js, Express.js, MongoDB, Redis Queue |
| **Payment Gateways** | Razorpay, Stripe, PayPal, Bank Wire / UPI |
| **Process Management** | PM2 |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **npm** or **yarn** or **pnpm**
- **MongoDB** instance
- **Redis** server (for queues)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/siegfriedoutreach-platform.git
cd siegfriedoutreach-platform
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.siegfriedoutreach.com/api
NEXT_PUBLIC_STORAGE_URL=https://api.siegfriedoutreach.com
NEXT_PUBLIC_SOCKET_URL=https://api.siegfriedoutreach.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production & Deploy
```bash
npm run build
pm2 start npm --name "frontend-app" -- start
```

---

## 📁 Project Structure

```
siegfriedoutreach.com/
├── src/
│   ├── app/                    # Next.js 15 App Router pages & API routes
│   │   ├── (main)/             # Authenticated dashboard & application layouts
│   │   ├── api/                # Next.js serverless proxy endpoints
│   │   └── globals.css         # Design tokens & theme variables
│   ├── components/
│   │   ├── feature/            # Feature-specific components (ai-social, plans, etc.)
│   │   │   ├── ai-social/      # Planner, Setup Wizard, CreditRechargeModal, Credits
│   │   │   └── plans/          # Billing, PaymentModal, GatewaySelector
│   │   ├── landing/            # High-conversion marketing landing pages
│   │   ├── reusable/           # PageHeader, Modals, Forms
│   │   └── ui/                 # Accessible Radix UI components (Button, Dialog, Card)
│   ├── data/                   # Menu, static content & pricing configurations
│   ├── redux/                  # Redux slices, store & RTK Query API endpoints
│   ├── types/                  # TypeScript interface definitions
│   └── utils/                  # Auth helpers, API handlers & storage utilities
├── CHANGELOG.md                # Chronological record of release updates
└── README.md                   # Project documentation & overview
```

---

## 📞 Contact & Support

We are dedicated to providing enterprise support and continuous platform enhancements. Reach out to our team through any of the channels below:

<div align="center">

| Channel | Details |
|---|---|
| 🌐 **Official Website** | [https://siegfriedoutreach.com](https://siegfriedoutreach.com) |
| 📧 **Official Email** | [support@siegfriedoutreach.com](mailto:support@siegfriedoutreach.com) / [contact@siegfriedoutreach.com](mailto:contact@siegfriedoutreach.com) |
| 💬 **WhatsApp Support** | [+91 98765 43210](https://wa.me/919876543210) |
| ✈️ **Telegram Channel** | [@SiegfriedOutreach](https://t.me/SiegfriedOutreach) |
| 📍 **Headquarters** | Siegfried Technologies Pvt. Ltd., Tech Park, Pune, Maharashtra, India |

</div>

<br/>

<div align="center">

Made with ❤️ by the **Siegfried Outreach Engineering Team**  
*Copyright © 2026 Siegfried Outreach. All Rights Reserved.*

</div>
