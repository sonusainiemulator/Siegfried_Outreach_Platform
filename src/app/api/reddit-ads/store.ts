export interface RedditCampaignRecord {
  id: string
  campaignId: string
  name: string
  objective: 'TRAFFIC' | 'CONVERSIONS' | 'LEAD_GENERATION' | 'BRAND_AWARENESS' | 'VIDEO_VIEWS' | 'APP_INSTALLS'
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'COMPLETED'
  budgetMode: 'DAILY' | 'LIFETIME'
  dailyBudget: number
  targetSubreddits: string[]
  targetInterests: string[]
  creative: {
    title: string
    bodyMarkdown?: string
    callToAction: string
    destinationUrl: string
    thumbnailUrl?: string
    authorHandle: string
    flairText?: string
    format: 'PROMOTED_LINK' | 'PROMOTED_IMAGE' | 'FREEFORM_POST' | 'PROMOTED_VIDEO'
  }
  insights: {
    spend: number
    impressions: number
    upvotes: number
    comments: number
    shares: number
    clicks: number
    cpc: number
    cpm: number
    ctr: number
    conversions: number
    cpa: number
    roas: number
    lastSyncedAt: string
  }
  createdAt: string
}

export const INITIAL_REDDIT_CAMPAIGNS: RedditCampaignRecord[] = [
  {
    id: 'rdt_camp_001',
    campaignId: 't3_948201948',
    name: '🚀 r/SaaS & r/startups Founder Automation Case Study',
    objective: 'CONVERSIONS',
    status: 'ACTIVE',
    budgetMode: 'DAILY',
    dailyBudget: 45,
    targetSubreddits: ['r/SaaS', 'r/startups', 'r/entrepreneur', 'r/sideproject'],
    targetInterests: ['Software Engineering', 'Venture Capital & Startups', 'B2B Marketing'],
    creative: {
      title: 'How our small dev team scaled to 10k users without spending thousands on SDRs (Free architecture breakdown inside)',
      bodyMarkdown: 'Hey r/SaaS! Most outreach tools are bloated and break your domain reputation. We built Siegfried to automate multi-channel sequences across Email, WhatsApp & Telegram while keeping delivery rates at 99.4%. Live demo is ungated below.',
      callToAction: 'TRY_FREE',
      destinationUrl: 'https://siegfriedoutreach.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      authorHandle: 'u/you',
      flairText: '🛠️ Tool & Case Study',
      format: 'FREEFORM_POST'
    },
    insights: {
      spend: 1240.50,
      impressions: 345000,
      upvotes: 1840,
      comments: 294,
      shares: 112,
      clicks: 11240,
      cpc: 0.11,
      cpm: 3.59,
      ctr: 3.26,
      conversions: 310,
      cpa: 4.00,
      roas: 4.60,
      lastSyncedAt: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rdt_camp_002',
    campaignId: 't3_948201949',
    name: '💻 r/webdev & r/programming AI Agent Integration Guide',
    objective: 'TRAFFIC',
    status: 'ACTIVE',
    budgetMode: 'DAILY',
    dailyBudget: 35,
    targetSubreddits: ['r/webdev', 'r/programming', 'r/node', 'r/reactjs'],
    targetInterests: ['Web Development', 'Artificial Intelligence', 'APIs & Microservices'],
    creative: {
      title: 'We open-sourced an SDK to connect WhatsApp, Telegram, and Social APIs directly into Next.js & Python apps',
      bodyMarkdown: 'Zero headless scrapers. 100% official APIs. Check the docs and start sending automated broadcasts in 5 lines of code.',
      callToAction: 'LEARN_MORE',
      destinationUrl: 'https://siegfriedoutreach.com/docs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      authorHandle: 'u/siegfried_devs',
      flairText: '🚀 SDK Release',
      format: 'PROMOTED_LINK'
    },
    insights: {
      spend: 890.00,
      impressions: 290000,
      upvotes: 920,
      comments: 145,
      shares: 68,
      clicks: 9800,
      cpc: 0.09,
      cpm: 3.06,
      ctr: 3.38,
      conversions: 195,
      cpa: 4.56,
      roas: 3.85,
      lastSyncedAt: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rdt_camp_003',
    campaignId: 't3_948201950',
    name: '📈 r/marketing & r/ecommerce Multi-Channel Growth Promo',
    objective: 'BRAND_AWARENESS',
    status: 'PAUSED',
    budgetMode: 'DAILY',
    dailyBudget: 25,
    targetSubreddits: ['r/marketing', 'r/ecommerce', 'r/digitalmarketing'],
    targetInterests: ['Digital Marketing', 'E-Commerce', 'Brand Scaling'],
    creative: {
      title: 'The exact multi-channel stack top DTC brands use to recover 30% of abandoned leads',
      bodyMarkdown: 'Direct integration with Shopify, Meta Ads, and TikTok Shop. See how our clients generate 4.8x ROAS.',
      callToAction: 'SIGN_UP',
      destinationUrl: 'https://siegfriedoutreach.com/ecommerce',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      authorHandle: 'u/siegfried_outreach',
      flairText: '📊 Marketing Strategy',
      format: 'PROMOTED_IMAGE'
    },
    insights: {
      spend: 520.00,
      impressions: 180000,
      upvotes: 480,
      comments: 68,
      shares: 32,
      clicks: 4600,
      cpc: 0.11,
      cpm: 2.88,
      ctr: 2.55,
      conversions: 84,
      cpa: 6.19,
      roas: 2.90,
      lastSyncedAt: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let redditCampaignsState: RedditCampaignRecord[] = [...INITIAL_REDDIT_CAMPAIGNS]

export function getRedditCampaignsStore(): RedditCampaignRecord[] {
  return redditCampaignsState
}

export function addRedditCampaignToStore(campaign: RedditCampaignRecord): RedditCampaignRecord {
  redditCampaignsState = [campaign, ...redditCampaignsState]
  return campaign
}

export function updateRedditCampaignStatusInStore(id: string, status?: string): RedditCampaignRecord | null {
  const item = redditCampaignsState.find(c => c.id === id || c.campaignId === id)
  if (!item) return null
  if (status) {
    item.status = status as any
  } else {
    item.status = item.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
  }
  return item
}

export function deleteRedditCampaignFromStore(id: string): boolean {
  const initialLen = redditCampaignsState.length
  redditCampaignsState = redditCampaignsState.filter(c => c.id !== id && c.campaignId !== id)
  return redditCampaignsState.length < initialLen
}
