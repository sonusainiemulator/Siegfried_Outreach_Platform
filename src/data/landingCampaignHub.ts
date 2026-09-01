import { BarChart2, Building2, Calendar, Globe, Lock, Mail, MailOpen, MessageSquare, Send, Sparkles, Star, Target } from 'lucide-react'

export const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Abilities', href: '#capabilities' },
  { name: 'Autonomy', href: '#automation' },
  { name: 'Reviews', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
  { name: 'MCP Server', href: '/landing/mcp' },
  { name: 'MCP Tools', href: '/landing/mcp#tools' },
  { name: 'MCP Setup', href: '/landing/mcp#clients' },
]

export const capabilities = [
  {
    name: 'whatsapp',
    tag: 'WhatsApp',
    title: 'Send Bulk WhatsApp Messages',
    description:
      "Broadcast personalised messages to thousands of contacts in seconds. Leverage WhatsApp's 98 % open-rate to drive real engagement, not just impressions.",
    stat: '98%',
    statLabel: 'Open Rate',
    color: '#22c55e',
    icon: MessageSquare,
    highlights: ['Smart delivery windows', 'Media & rich-text support', 'Reply tracking'],
  },
  {
    name: 'telegram',
    tag: 'Telegram',
    title: 'Automated Telegram Broadcasts',
    description:
      'Schedule and send broadcasts to Telegram groups, channels and subscribers with a single click. Zero manual effort, maximum reach.',
    stat: '3x',
    statLabel: 'Higher Engagement',
    color: '#0284c7',
    icon: Send,
    highlights: ['Group & channel support', 'Bot-powered replies', 'Subscriber segmentation'],
  },
  {
    name: 'email',
    tag: 'Email',
    title: 'Professional Email Broadcasts',
    description:
      'Design HTML email broadcasts with our built-in editor, segment your list by behaviour, and track opens, clicks & conversions — all in one place.',
    stat: '4.2x',
    statLabel: 'ROI vs Social',
    color: '#3b82f6',
    icon: Mail,
    highlights: ['Drag-and-drop HTML editor', 'A/B subject-line testing', 'Detailed analytics'],
  },
  {
    tag: 'Scheduling',
    title: 'Schedule Broadcasts in Advance',
    description:
      'Plan every campaign with a visual calendar. Set delivery time by timezone, audience, or trigger — your marketing runs even while you sleep.',
    stat: '24/7',
    statLabel: 'Autopilot Mode',
    color: '#8b5cf6',
    icon: Calendar,
    highlights: ['Timezone-aware delivery', 'Trigger-based scheduling', 'Broadcast calendar view'],
  },
  {
    tag: 'Analytics',
    title: 'Track Broadcast Performance',
    description:
      'Get a unified analytics dashboard across all channels. Monitor sent, delivered, opened, clicked and converted in real time with charts you can actually understand.',
    stat: '360°',
    statLabel: 'Analytics View',
    color: '#f59e0b',
    icon: BarChart2,
    highlights: ['Real-time dashboards', 'Cross-channel comparison', 'Export to CSV'],
  },
]

export const features = [
  {
    title: 'Smart Segmentation',
    description: 'Automatically categorise your audience by behaviour, tags and location for laser-targeted messaging.',
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Email Broadcasts',
    description: 'Send beautiful HTML emails, track opens & clicks, and automate follow-up sequences with ease.',
    icon: MailOpen,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Multi-Platform Reach',
    description: 'WhatsApp, Telegram and Email from one unified dashboard — no tab-switching required.',
    icon: Globe,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'AI Content Generation',
    description: 'Generate articles, product descriptions, email copy and social captions powered by advanced AI.',
    icon: Sparkles,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Campaign Analytics',
    description: 'Real-time dashboards for delivery, open rates, CTR and conversions across every channel.',
    icon: BarChart2,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Privacy & Security',
    description: 'Enterprise-grade 256-bit SSL encryption so your customer data stays completely safe.',
    icon: Lock,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
]

export interface RealEstateTestimonial {
  id: string
  quote: string
  name: string
  role: string
  company?: string
  rating: number
  score: string
  avatar?: string
  initials: string
  color: string
  category: 'all' | 'real-estate' | 'outreach' | 'ai-bots' | 'social-media'
  feature: string
  verified: boolean
}

export const realEstateTestimonials: RealEstateTestimonial[] = [
  {
    id: '1',
    quote:
      'We broadcasted our new luxury development to 2,400 VIP investors via WhatsApp with Siegfried Outreach. We booked 18 private showings in the first 4 hours. It just converts.',
    name: 'Marcus Vance',
    role: 'Principal Broker',
    company: 'Vanguard Luxury Realty',
    rating: 5,
    score: '5.0',
    initials: 'MV',
    color: 'from-blue-600 to-indigo-600',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    category: 'real-estate',
    feature: 'WhatsApp Broadcasts',
    verified: true,
  },
  {
    id: '2',
    quote:
      'The AI Bot Studio handles initial buyer qualification 24/7. When someone messages our listings at 11 PM, the bot qualifies their budget, timeline, and books them straight into my calendar.',
    name: 'Elena Rostova',
    role: 'Top Producing Agent',
    company: 'Sotheby’s Premier Group',
    rating: 5,
    score: '5.0',
    initials: 'ER',
    color: 'from-emerald-600 to-teal-600',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    category: 'ai-bots',
    feature: '24/7 Lead Bot',
    verified: true,
  },
  {
    id: '3',
    quote:
      'Writing property descriptions used to take us hours. Now the AI writing assistant generates MLS-compliant descriptions, Instagram reels copy, and email blasts in under 30 seconds.',
    name: 'Duane D.',
    role: 'Managing Director',
    company: 'Apex Commercial Properties',
    rating: 5,
    score: '5.0',
    initials: 'DD',
    color: 'from-purple-600 to-indigo-600',
    category: 'real-estate',
    feature: 'AI Listing Generator',
    verified: true,
  },
  {
    id: '4',
    quote:
      'Our multi-channel cold email and WhatsApp campaigns to off-market property sellers generated 42 qualified acquisition leads in our first month. The delivery rate is unbelievable.',
    name: 'Vincent L.',
    role: 'Head of Acquisitions',
    company: 'Horizon Property Fund',
    rating: 5,
    score: '4.9',
    initials: 'VL',
    color: 'from-sky-600 to-blue-700',
    category: 'outreach',
    feature: 'Cold Outreach Sequences',
    verified: true,
  },
  {
    id: '5',
    quote:
      'Managing 9 social platforms for 15 luxury listings was impossible before. With the multi-platform social scheduler, our team schedules property walk-throughs across LinkedIn, IG, and Facebook in one click.',
    name: 'Verónica G.',
    role: 'Director of Marketing',
    company: 'Skyline Real Estate Group',
    rating: 5,
    score: '5.0',
    initials: 'VG',
    color: 'from-rose-600 to-pink-600',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    category: 'social-media',
    feature: 'Social Media Automation',
    verified: true,
  },
  {
    id: '6',
    quote:
      'The Perfex CRM sync and MCP integration mean every WhatsApp conversation and email lead automatically populates our deal pipeline. Zero manual data entry.',
    name: 'Jordi A.',
    role: 'Operations Lead',
    company: 'Metro Residential Partners',
    rating: 5,
    score: '4.9',
    initials: 'JA',
    color: 'from-amber-600 to-orange-600',
    category: 'ai-bots',
    feature: 'CRM & MCP Sync',
    verified: true,
  },
  {
    id: '7',
    quote:
      'Open house follow-ups are completely on autopilot now. Guests receive instant WhatsApp virtual brochures and an automated follow-up sequence. Our attendee-to-offer rate tripled.',
    name: 'Sarah Jenkins',
    role: 'Senior Realtor & Team Lead',
    company: 'Coastal Living Real Estate',
    rating: 5,
    score: '5.0',
    initials: 'SJ',
    color: 'from-violet-600 to-purple-700',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    category: 'real-estate',
    feature: 'Open House Follow-ups',
    verified: true,
  },
  {
    id: '8',
    quote:
      'I send weekly off-market investment deal digests via Telegram and Email. The 68% click-through rate we see with Siegfried Outreach has helped us close $14M in deals this quarter alone.',
    name: 'Rishabh J.',
    role: 'Real Estate Wholesaler',
    company: 'Capital Property Group',
    rating: 5,
    score: '4.8',
    initials: 'RJ',
    color: 'from-teal-600 to-cyan-700',
    category: 'outreach',
    feature: 'Telegram & Email Broadcasts',
    verified: true,
  },
  {
    id: '9',
    quote:
      'The AI Blog and Market Report writer creates high-ranking neighborhood guides that bring us organic seller leads every week. It feels like having a 5-person content team in my pocket.',
    name: 'Becky D.',
    role: 'Broker & Content Creator',
    company: 'Urban Nest Properties',
    rating: 5,
    score: '5.0',
    initials: 'BD',
    color: 'from-emerald-600 to-green-700',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
    category: 'social-media',
    feature: 'AI Content & Market Reports',
    verified: true,
  },
  {
    id: '10',
    quote:
      'Siegfried Outreach replaced 4 separate tools for email, WhatsApp, social scheduling, and AI copywriting. Cut our monthly software bill by 60% while doubling our lead velocity.',
    name: 'David K.',
    role: 'Managing Partner',
    company: 'Kensington Real Estate Advisory',
    rating: 5,
    score: '5.0',
    initials: 'DK',
    color: 'from-blue-700 to-indigo-800',
    category: 'all',
    feature: 'All-in-One Growth Stack',
    verified: true,
  },
  {
    id: '11',
    quote:
      'Our team tested 5 different outreach platforms for commercial real estate tenant prospecting. Siegfried Outreach had the highest inbox deliverability and smartest segmentation by far.',
    name: 'Carlos Mendez',
    role: 'Commercial Leasing Director',
    company: 'Prime Commercial Spaces',
    rating: 5,
    score: '4.9',
    initials: 'CM',
    color: 'from-orange-600 to-red-600',
    category: 'outreach',
    feature: 'Tenant Outreach Sequences',
    verified: true,
  },
  {
    id: '12',
    quote:
      'We launched automated price-drop notifications on Telegram & WhatsApp. Properties that were stagnant for weeks received fresh offers within 48 hours of sending the broadcast.',
    name: 'Sunny T.',
    role: 'Founder & Managing Broker',
    company: 'Elevate Realty Network',
    rating: 5,
    score: '4.9',
    initials: 'ST',
    color: 'from-pink-600 to-rose-700',
    category: 'real-estate',
    feature: 'Price Drop Broadcasts',
    verified: true,
  },
  {
    id: '13',
    quote:
      'The AI transcription and video script generator allows me to walk through a property recording voice notes, and it instantly spits out social reels, YouTube scripts, and listing blurbs.',
    name: 'Bruno T.',
    role: 'Luxury Property Marketer',
    company: 'Estate Media Lab',
    rating: 5,
    score: '4.8',
    initials: 'BT',
    color: 'from-indigo-600 to-purple-600',
    category: 'social-media',
    feature: 'Video & Reel Automation',
    verified: true,
  },
  {
    id: '14',
    quote:
      'Our agents love how simple it is to build AI bots for individual property landing pages. Buyers can ask about HOA fees, floor plans, and school districts instantly.',
    name: 'Amara Patel',
    role: 'VP of Technology',
    company: 'Ascend Brokerage Group',
    rating: 5,
    score: '5.0',
    initials: 'AP',
    color: 'from-cyan-600 to-blue-600',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
    category: 'ai-bots',
    feature: 'Listing Q&A Bot',
    verified: true,
  },
  {
    id: '15',
    quote:
      'We scheduled 60 days of real estate market commentary and listing showcases across Facebook and Instagram in one afternoon. Our engagement increased by 240%.',
    name: 'Joe G.',
    role: 'Principal Realtor',
    company: 'Modern Living Realty',
    rating: 5,
    score: '4.9',
    initials: 'JG',
    color: 'from-emerald-700 to-teal-800',
    category: 'social-media',
    feature: 'Bulk Social Scheduling',
    verified: true,
  },
  {
    id: '16',
    quote:
      'The multi-channel capability gives us an unfair advantage. When a hot deal hits the market, our high-net-worth investors receive immediate alerts. It is the ultimate real estate conversion engine.',
    name: 'Liam O’Connor',
    role: 'Real Estate Investment Director',
    company: 'Apex Capital Ventures',
    rating: 5,
    score: '5.0',
    initials: 'LO',
    color: 'from-violet-700 to-indigo-900',
    category: 'outreach',
    feature: 'VIP Deal Alerts',
    verified: true,
  },
]

// Backward compatibility alias
export const testimonials = realEstateTestimonials.slice(0, 6)

export const campaignHubStats = [
  { val: '10M+', label: 'Messages & Broadcasts Sent', icon: MessageSquare },
  { val: '4.9★', label: '850+ Verified Reviews', icon: Star },
  { val: '2,400+', label: 'Real Estate & Growth Teams', icon: Building2 },
]

export const campaignHubFaqs = [
  {
    id: 'faq-1',
    title: 'What is Siegfried Outreach and how does it help grow my business?',
    description:
      'Siegfried Outreach is an all-in-one AI marketing and multi-channel automation platform. It empowers businesses, real estate professionals, and growth teams to run high-converting broadcasts across WhatsApp, Telegram, and Email, automate social media posting across 9+ networks, and deploy 24/7 AI conversational agents that qualify leads and book appointments on autopilot.',
  },
  {
    id: 'faq-2',
    title: 'Which communication channels and social platforms are supported?',
    description:
      'You can broadcast and automate campaigns across WhatsApp, Telegram, and HTML Email (via Amazon SES, ZeptoMail, or custom SMTP). For social media management, we support 9 major networks: Instagram, Facebook, LinkedIn, X (Twitter), TikTok, YouTube, Threads, Bluesky, and Pinterest—all managed from a unified dashboard.',
  },
  {
    id: 'faq-3',
    title: 'How do the 24/7 Autonomous AI Agents work for lead generation?',
    description:
      'Our AI Agents act as round-the-clock sales and support specialists on WhatsApp, Telegram, and your website. Trained on your custom knowledge base and brand voice, they answer product or property inquiries, qualify buyer budgets and timelines, capture verified contact details, and book meetings directly into your calendar.',
  },
  {
    id: 'faq-4',
    title: 'Are my social media and messaging accounts safe from bans or restrictions?',
    description:
      'Yes, 100%. Siegfried Outreach connects strictly through official enterprise APIs, including Meta Graph API, Telegram Bot API, verified email relays, and official social network developer endpoints. We never use fragile browser scrapers or unapproved automation bots, ensuring complete platform compliance and maximum deliverability.',
  },
  {
    id: 'faq-5',
    title: 'Can I integrate Siegfried Outreach with my existing CRM and AI tools?',
    description:
      'Yes! We provide native two-way synchronization with Perfex CRM, custom webhooks, REST APIs, and a dedicated Model Context Protocol (MCP) server. You can connect your Siegfried workflows directly with Claude Code, Cursor, Windsurf, Antigravity, and n8n/Hermes autonomous pipelines with zero setup friction.',
  },
  {
    id: 'faq-6',
    title: 'How does multi-channel broadcast deliverability and analytics work?',
    description:
      'You get real-time tracking for delivery rates, opens, link clicks, and reply conversions across every campaign. Our platform includes smart delivery pacing, automated warmup tools, SPF/DKIM verification for email, and WhatsApp rate-limit controls to guarantee high sender reputation and up to 98% open rates.',
  },
  {
    id: 'faq-7',
    title: 'Do I need coding or technical skills to build campaigns and bots?',
    description:
      'Not at all. Siegfried Outreach is designed for non-technical users and growth teams. You get a visual drag-and-drop email builder, customizable message templates, an AI copywriting assistant for instant MLS descriptions and social captions, and a visual workflow editor for AI bots.',
  },
  {
    id: 'faq-8',
    title: 'Can I customize AI prompts, tone of voice, and brand guidelines?',
    description:
      'Yes. You have complete control over your AI Agent\'s persona, knowledge base, tone of voice, forbidden topics, and brand guidelines. You can train your AI with custom documents, FAQs, and property or service details to ensure every reply matches your brand perfectly.',
  },
  {
    id: 'faq-9',
    title: 'Can I collaborate with team members and assign custom permissions?',
    description:
      'Yes. Siegfried Outreach offers robust role-based access control (RBAC). You can invite team members, create custom roles (such as Campaign Manager, Content Creator, Support Agent, or Admin), and restrict permissions per channel or feature.',
  },
  {
    id: 'faq-10',
    title: 'Is there a free trial, and what happens when I sign up?',
    description:
      'We offer a 7-day risk-free trial with full access to multi-channel broadcasting, AI content generation, and autonomous bot workflows. You can test all features with your own accounts, and you are free to upgrade, downgrade, or cancel anytime with no long-term contracts.',
  },
];
