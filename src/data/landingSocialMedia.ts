import {
  BarChart2,
  Bird,
  BriefcaseBusiness,
  Calendar,
  Camera,
  Clock,
  Globe,
  Hash,
  Image as ImageIcon,
  PenLine,
  Repeat2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react'

export const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Platforms', href: '#platforms' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

export const platforms = [
  {
    name: 'Instagram',
    handle: 'instagram',
    color: '#E1306C',
    gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    bgGrad: 'from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10',
    description:
      'Create stunning Instagram posts, reels, and stories with AI-powered captions, hashtags, and visuals. Schedule them directly to your connected account.',
    features: ['AI Caption Generator', 'Hashtag Suggestions', 'Reel Scripts', 'Story Templates'],
    icon: Camera,
  },
  {
    name: 'Facebook',
    handle: 'facebook',
    color: '#1877F2',
    gradient: 'from-[#1877F2] to-[#0C5FCC]',
    bgGrad: 'from-[#1877F2]/10 to-[#0C5FCC]/10',
    description:
      'Create engaging Facebook posts and ads that connect with your audience. From status updates to promotions and article shares—AI handles the hard work.',
    features: ['Post & Ad Copy', 'Audience Targeting Tips', 'Video Script', 'Facebook Headlines'],
    icon: ThumbsUp,
  },
  {
    name: 'LinkedIn',
    handle: 'linkedin',
    color: '#0A66C2',
    gradient: 'from-[#0A66C2] to-[#004182]',
    bgGrad: 'from-[#0A66C2]/10 to-[#004182]/10',
    description:
      'Strengthen your professional presence with polished LinkedIn posts, articles, and thought-leadership content that engages your network and builds authority.',
    features: ['LinkedIn Posts', 'Professional Articles', 'Thought Leadership', 'Connection Outreach'],
    icon: BriefcaseBusiness,
  },
  {
    name: 'Twitter / X',
    handle: 'twitter',
    color: '#1DA1F2',
    gradient: 'from-[#1DA1F2] to-[#0d7abf]',
    bgGrad: 'from-[#1DA1F2]/10 to-[#0d7abf]/10',
    description:
      'Craft engaging tweets and threads in seconds. Let AI help you drive conversations, boost engagement, and grow your presence on X',
    features: ['Tweet Generator', 'Thread Creator', 'Viral Tweet Ideas', 'Engagement Hooks'],
    icon: Bird,
  },
]

export const socialMediaFeatures = [
  {
    title: 'AI Post Generator',
    description: 'Generate platform-optimised captions, headlines and post copy for any social network in one click.',
    icon: PenLine,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Smart Scheduler',
    description: 'Plan weeks of content in advance. Set the perfect posting time by platform, timezone and audience.',
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'AI Image & Visual',
    description: 'Generate on-brand images, thumbnails and creatives using AI — no design skills required.',
    icon: ImageIcon,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    title: 'Performance Analytics',
    description: 'Track reach, engagement, clicks and follower growth across all platforms in a unified dashboard.',
    icon: BarChart2,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Content Repurposing',
    description: 'Turn one blog post into tweets, LinkedIn articles, Instagram captions and Facebook posts instantly.',
    icon: Repeat2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Hashtag Intelligence',
    description: 'Get AI-curated hashtag sets ranked by relevancy and trending score for each post.',
    icon: Hash,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'Team Collaboration',
    description: 'Invite your team, assign content approvals, and manage multiple brand accounts together.',
    icon: Users,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    title: 'Global Reach',
    description: 'AI translates and adapts your posts for different languages and regional audiences automatically.',
    icon: Globe,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
]

export const howItWorks = [
  {
    num: '01',
    title: 'Connect Your Accounts',
    description: 'Link your Instagram, Facebook, LinkedIn and Twitter/X accounts securely in under two minutes.',
    icon: Users,
  },
  {
    num: '02',
    title: 'Generate AI Content',
    description: 'Describe your post idea. AI instantly crafts platform-optimised copy, visuals and hashtags.',
    icon: Sparkles,
  },
  {
    num: '03',
    title: 'Schedule & Publish',
    description: 'Pick the best time slot and publish. Our system posts automatically while you focus on growth.',
    icon: Clock,
  },
  {
    num: '04',
    title: 'Analyse & Improve',
    description: 'Review real-time engagement data, learn what works, and let AI refine your future content strategy.',
    icon: TrendingUp,
  },
]

export const testimonials = [
  {
    quote:
      'We run social media for 24 luxury real estate agents. Siegfried Outreach cut our content creation time by 80% while our listing views on Instagram and LinkedIn quadrupled.',
    name: 'Verónica G.',
    role: 'Head of Social Media · Skyline Estates',
    rating: 5,
    score: '5.0',
    platform: 'Instagram & LinkedIn',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    initials: 'VG',
  },
  {
    quote:
      'Scheduling a whole month of luxury property walkthroughs, market analyses, and video reels in one afternoon is effortless. Our buyer inquiries went up 300%.',
    name: 'Marcus Vance',
    role: 'Principal Broker · Vanguard Realty',
    rating: 5,
    score: '5.0',
    platform: 'Multi-Platform',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'MV',
  },
  {
    quote:
      'The AI real estate content repurposing is unmatched. One property shoot gives us 12 social posts, an email digest, and a Telegram alert in 2 minutes.',
    name: 'Elena Rostova',
    role: 'Top Producer · Sotheby’s Premier',
    rating: 5,
    score: '5.0',
    platform: 'YouTube & Facebook',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    initials: 'ER',
  },
  {
    quote:
      'Our commercial real estate team booked 14 high-value tenant meetings in 3 weeks by automating LinkedIn and Twitter industry insights with Siegfried Outreach.',
    name: 'Carlos Mendez',
    role: 'Commercial Leasing VP · Metro Spaces',
    rating: 5,
    score: '4.9',
    platform: 'LinkedIn',
    initials: 'CM',
  },
]

export const marqueeItems = [
  'Precision & Speed',
  'Affiliate Marketing',
  'Boost Engagement',
  '10x Faster Content',
  '150% Subscriber Growth',
  'Adaptive Intelligence',
  'AI Brand Voice',
  'Smart Scheduling',
]

export const ctaBanner = ['No credit card needed', 'Free 14-day trial', 'Cancel anytime']

export const footerLinks = [
  { title: 'Platform', links: ['Dashboard', 'Features', 'Pricing', 'API'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'SLA'] },
]

export { campaignHubFaqs as socialMediaFaqs, campaignHubFaqs } from './landingCampaignHub'

