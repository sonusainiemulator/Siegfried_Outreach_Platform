export interface TikTokCampaignRecord {
  id: string
  campaignId: string
  name: string
  objective: 'LEAD_GENERATION' | 'PRODUCT_SALES' | 'VIDEO_VIEWS' | 'TRAFFIC' | 'APP_INSTALLS' | 'REACH'
  status: 'ACTIVE' | 'PAUSED' | 'IN_REVIEW' | 'COMPLETED'
  budgetMode: 'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL'
  budget: number
  bidType: 'BID_TYPE_NO_BID' | 'BID_TYPE_COST_CAP'
  targetCpa?: number
  isSmartPlus?: boolean
  isSparkAd?: boolean
  sparkAdAuthCode?: string
  creative: {
    hook: string
    caption: string
    callToAction: string
    videoUrl?: string
    coverUrl?: string
    soundTitle?: string
    hashtags: string[]
    brandHandle?: string
    landingPageUrl?: string
  }
  insights: {
    spend: number
    impressions: number
    videoViews: number
    videoViews2s: number
    videoViews6s: number
    videoCompletionRate: number
    clicks: number
    cpc: number
    cpm: number
    ctr: number
    conversions: number
    cpa: number
    roas: number
    likes: number
    shares: number
    comments: number
    lastSyncedAt: string
  }
  targetAudience?: {
    countries: string[]
    ageMin: number
    ageMax: number
    genders: string
    interests: string[]
    hashtags: string[]
    placements: string[]
  }
  createdAt: string
}

export const INITIAL_TIKTOK_CAMPAIGNS: TikTokCampaignRecord[] = [
  {
    id: 'tt_camp_001',
    campaignId: '73981290348123',
    name: '🔥 Viral Hooks - Summer Collection Spark Ad',
    objective: 'PRODUCT_SALES',
    status: 'ACTIVE',
    budgetMode: 'BUDGET_MODE_DAY',
    budget: 65,
    bidType: 'BID_TYPE_NO_BID',
    isSmartPlus: true,
    isSparkAd: true,
    sparkAdAuthCode: 'tiktok://spark/auth/v849204812',
    creative: {
      hook: 'Stop scrolling! This 1 gadget sold out 4 times in 48 hours...',
      caption: 'The viral secret everyone on #TikTokMadeMeBuyIt is obsessed with! ⚡ Tap Shop Now for 25% OFF Summer flash discount!',
      callToAction: 'SHOP_NOW',
      soundTitle: 'Original Sound - Siegfried Viral Beats (Trending)',
      hashtags: ['#TikTokMadeMeBuyIt', '#SummerStyle', '#ViralProduct', '#MustHave'],
      brandHandle: '@siegfried_outreach',
      landingPageUrl: 'https://siegfriedoutreach.com/shop',
      videoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    },
    insights: {
      spend: 1845.50,
      impressions: 489200,
      videoViews: 412500,
      videoViews2s: 345000,
      videoViews6s: 218000,
      videoCompletionRate: 48.2,
      clicks: 14820,
      cpc: 0.12,
      cpm: 3.77,
      ctr: 3.03,
      conversions: 384,
      cpa: 4.81,
      roas: 4.85,
      likes: 38400,
      shares: 4920,
      comments: 1180,
      lastSyncedAt: new Date().toISOString()
    },
    targetAudience: {
      countries: ['US', 'CA', 'GB', 'AU'],
      ageMin: 18,
      ageMax: 35,
      genders: 'ALL',
      interests: ['E-Commerce & Online Shopping', 'Apparel & Accessories', 'Viral Trends'],
      hashtags: ['#TikTokMadeMeBuyIt', '#FashionHacks'],
      placements: ['TikTok Feed', 'TikTok Search Ads']
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tt_camp_002',
    campaignId: '73981290348124',
    name: '🚀 B2B SaaS Growth & Lead Generation Instant Form',
    objective: 'LEAD_GENERATION',
    status: 'ACTIVE',
    budgetMode: 'BUDGET_MODE_DAY',
    budget: 80,
    bidType: 'BID_TYPE_COST_CAP',
    targetCpa: 6.50,
    isSmartPlus: true,
    isSparkAd: false,
    creative: {
      hook: 'How 500+ agency founders automated 90% of their outreach in 2026...',
      caption: 'Unlock our free multi-channel AI automation masterclass. Instant 1-tap form submission 👇',
      callToAction: 'SIGN_UP',
      soundTitle: 'Trending Tech Beat - LoFi Focus',
      hashtags: ['#TechTok', '#AgencyLife', '#Automation', '#AIOutreach'],
      brandHandle: '@siegfried_outreach',
      landingPageUrl: 'https://siegfriedoutreach.com/demo',
    },
    insights: {
      spend: 1420.00,
      impressions: 295000,
      videoViews: 248000,
      videoViews2s: 198000,
      videoViews6s: 142000,
      videoCompletionRate: 52.1,
      clicks: 8940,
      cpc: 0.16,
      cpm: 4.81,
      ctr: 3.03,
      conversions: 245,
      cpa: 5.80,
      roas: 3.90,
      likes: 19200,
      shares: 2150,
      comments: 640,
      lastSyncedAt: new Date().toISOString()
    },
    targetAudience: {
      countries: ['US', 'GB', 'DE', 'FR'],
      ageMin: 22,
      ageMax: 54,
      genders: 'ALL',
      interests: ['Software & SaaS', 'Marketing & Advertising', 'Entrepreneurship'],
      hashtags: ['#TechTok', '#BusinessHacks'],
      placements: ['TikTok Feed', 'Pangle']
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tt_camp_003',
    campaignId: '73981290348125',
    name: '🎵 UGC Influencer Mashup - Brand Awareness & Reach',
    objective: 'VIDEO_VIEWS',
    status: 'PAUSED',
    budgetMode: 'BUDGET_MODE_DAY',
    budget: 40,
    bidType: 'BID_TYPE_NO_BID',
    isSmartPlus: false,
    isSparkAd: true,
    sparkAdAuthCode: 'tiktok://spark/auth/v910293841',
    creative: {
      hook: 'Watch what happens when 5 creators try this AI tool for 7 days!',
      caption: 'Real reactions, zero fluff. Check out why millions are switching this month 🔥',
      callToAction: 'LEARN_MORE',
      soundTitle: 'Siegfried Hype Remix (Bass Boosted)',
      hashtags: ['#CreatorEconomy', '#UGC', '#TechReview', '#AITools'],
      brandHandle: '@siegfried_outreach',
      landingPageUrl: 'https://siegfriedoutreach.com',
    },
    insights: {
      spend: 640.20,
      impressions: 380000,
      videoViews: 355000,
      videoViews2s: 310000,
      videoViews6s: 230000,
      videoCompletionRate: 64.8,
      clicks: 6400,
      cpc: 0.10,
      cpm: 1.68,
      ctr: 1.68,
      conversions: 86,
      cpa: 7.44,
      roas: 2.70,
      likes: 54200,
      shares: 8900,
      comments: 2410,
      lastSyncedAt: new Date().toISOString()
    },
    targetAudience: {
      countries: ['US', 'CA', 'GB'],
      ageMin: 18,
      ageMax: 34,
      genders: 'ALL',
      interests: ['Digital Creators', 'Entertainment', 'Social Media'],
      hashtags: ['#UGC', '#TechTok'],
      placements: ['TikTok Feed']
    },
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tt_camp_004',
    campaignId: '73981290348126',
    name: '📱 Mobile App Installs - Direct iOS & Android Funnel',
    objective: 'APP_INSTALLS',
    status: 'ACTIVE',
    budgetMode: 'BUDGET_MODE_DAY',
    budget: 50,
    bidType: 'BID_TYPE_COST_CAP',
    targetCpa: 2.20,
    isSmartPlus: true,
    isSparkAd: false,
    creative: {
      hook: 'The AI assistant you actually need on your phone in 2026...',
      caption: 'Manage WhatsApp, Instagram, Telegram & TikTok all from your pocket. Download now free! 📲',
      callToAction: 'INSTALL_NOW',
      soundTitle: 'Cyberpunk Synthwave - High Energy',
      hashtags: ['#AppStore', '#ProductivityApp', '#MobileAI', '#TechTok'],
      brandHandle: '@siegfried_outreach',
      landingPageUrl: 'https://apps.apple.com/app/siegfried-outreach',
    },
    insights: {
      spend: 920.00,
      impressions: 210000,
      videoViews: 185000,
      videoViews2s: 154000,
      videoViews6s: 112000,
      videoCompletionRate: 54.0,
      clicks: 11400,
      cpc: 0.08,
      cpm: 4.38,
      ctr: 5.43,
      conversions: 420,
      cpa: 2.19,
      roas: 4.10,
      likes: 21400,
      shares: 3100,
      comments: 730,
      lastSyncedAt: new Date().toISOString()
    },
    targetAudience: {
      countries: ['US', 'GB', 'CA', 'AU', 'SG'],
      ageMin: 18,
      ageMax: 44,
      genders: 'ALL',
      interests: ['Mobile Applications', 'Productivity', 'Smartphones'],
      hashtags: ['#AppsYouNeed', '#TechHacks'],
      placements: ['TikTok Feed', 'Pangle']
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let campaignsState: TikTokCampaignRecord[] = [...INITIAL_TIKTOK_CAMPAIGNS]

export function getTikTokCampaignsStore(): TikTokCampaignRecord[] {
  return campaignsState
}

export function addTikTokCampaignToStore(campaign: TikTokCampaignRecord): TikTokCampaignRecord {
  campaignsState = [campaign, ...campaignsState]
  return campaign
}

export function updateTikTokCampaignStatusInStore(id: string, status?: string): TikTokCampaignRecord | null {
  const item = campaignsState.find(c => c.id === id || c.campaignId === id)
  if (!item) return null
  if (status) {
    item.status = status as any
  } else {
    item.status = item.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
  }
  return item
}

export function deleteTikTokCampaignFromStore(id: string): boolean {
  const initialLen = campaignsState.length
  campaignsState = campaignsState.filter(c => c.id !== id && c.campaignId !== id)
  return campaignsState.length < initialLen
}
