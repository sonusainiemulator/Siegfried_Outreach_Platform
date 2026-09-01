# 📋 Changelog — Siegfried Outreach Platform

All notable changes, fixes, and feature additions are documented in this file.

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
