export interface GoogleCampaignRecord {
  id: string
  campaignId: string
  name: string
  channelType: 'SEARCH' | 'PERFORMANCE_MAX' | 'DISPLAY' | 'YOUTUBE_VIDEO' | 'SHOPPING' | 'APP'
  objective: 'SALES' | 'LEADS' | 'WEBSITE_TRAFFIC' | 'BRAND_CONSIDERATION' | 'APP_PROMOTION'
  status: 'ACTIVE' | 'PAUSED' | 'REMOVED' | 'ENDED'
  dailyBudget: number
  biddingStrategy: 'MAXIMIZE_CONVERSIONS' | 'TARGET_CPA' | 'TARGET_ROAS' | 'MAXIMIZE_CLICKS'
  targetCpa?: number
  targetRoas?: number
  qualityScore: number
  searchImpressionShare: number
  creative: {
    headlines: string[]
    descriptions: string[]
    finalUrl: string
    displayPath1?: string
    displayPath2?: string
    sitelinks?: Array<{ text: string; description: string; url: string }>
    callouts?: string[]
    businessName?: string
    mediaUrls?: string[]
  }
  targetKeywords?: Array<{
    keyword: string
    matchType: 'EXACT' | 'PHRASE' | 'BROAD'
  }>
  negativeKeywords?: string[]
  targetLocations?: string[]
  insights: {
    spend: number
    impressions: number
    clicks: number
    cpc: number
    cpm: number
    ctr: number
    conversions: number
    cpa: number
    conversionRate: number
    roas: number
    lastSyncedAt: string
  }
  createdAt: string
}

export const INITIAL_GOOGLE_CAMPAIGNS: GoogleCampaignRecord[] = [
  {
    id: 'ggl_camp_001',
    campaignId: '98402910481',
    name: '🔍 B2B Intent Search - High Converting Keywords',
    channelType: 'SEARCH',
    objective: 'LEADS',
    status: 'ACTIVE',
    dailyBudget: 120,
    biddingStrategy: 'TARGET_CPA',
    targetCpa: 14.50,
    qualityScore: 9,
    searchImpressionShare: 86.4,
    creative: {
      headlines: [
        'Siegfried Outreach Platform',
        'Multi-Channel AI Automation',
        'Scale Sales & Inquiries Fast',
        'Official WhatsApp & Email APIs',
        'Try Free Demo Today'
      ],
      descriptions: [
        'Automate outreach across WhatsApp, Telegram, Email & Socials with 99.4% inbox delivery.',
        'Connect your CRM and send AI-personalized broadcasts. Start your free trial today.'
      ],
      finalUrl: 'https://siegfriedoutreach.com',
      displayPath1: 'platform',
      displayPath2: 'ai-outreach',
      businessName: 'Siegfried Outreach',
      sitelinks: [
        { text: 'Live Demo', description: 'See AI agents in action', url: 'https://siegfriedoutreach.com/demo' },
        { text: 'Pricing & Plans', description: 'Transparent monthly tiers', url: 'https://siegfriedoutreach.com/pricing' },
        { text: 'Integrations', description: 'WhatsApp, Telegram, CRM', url: 'https://siegfriedoutreach.com/integrations' },
        { text: 'Case Studies', description: '4.8x average ROI', url: 'https://siegfriedoutreach.com/cases' }
      ],
      callouts: ['24/7 Priority Support', '99.4% Inbox Rate', 'Official APIs Only', 'No Setup Fee']
    },
    targetKeywords: [
      { keyword: 'ai outreach platform', matchType: 'EXACT' },
      { keyword: 'b2b lead generation software', matchType: 'PHRASE' },
      { keyword: 'automated whatsapp marketing tool', matchType: 'PHRASE' },
      { keyword: 'multi channel crm broadcasts', matchType: 'BROAD' }
    ],
    negativeKeywords: ['free crack', 'jobs', 'internship', 'login issues'],
    targetLocations: ['United States', 'United Kingdom', 'Canada', 'Germany', 'Australia'],
    insights: {
      spend: 3480.00,
      impressions: 42000,
      clicks: 3820,
      cpc: 0.91,
      cpm: 82.85,
      ctr: 9.10,
      conversions: 254,
      cpa: 13.70,
      conversionRate: 6.65,
      roas: 5.20,
      lastSyncedAt: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ggl_camp_002',
    campaignId: '98402910482',
    name: '⚡ Performance Max (PMax) - Global Multi-Channel Scale',
    channelType: 'PERFORMANCE_MAX',
    objective: 'SALES',
    status: 'ACTIVE',
    dailyBudget: 150,
    biddingStrategy: 'TARGET_ROAS',
    targetRoas: 480,
    qualityScore: 10,
    searchImpressionShare: 91.2,
    creative: {
      headlines: [
        '1-Click AI Marketing Scale',
        'Siegfried All-in-One Growth',
        'Automate Socials & Outreach'
      ],
      descriptions: [
        'Scale your customer acquisition across Google Search, YouTube, Gmail, Maps and Display.',
        'High ROAS automation powered by machine learning and official platform integrations.'
      ],
      finalUrl: 'https://siegfriedoutreach.com/scale',
      displayPath1: 'growth',
      displayPath2: 'pmax',
      businessName: 'Siegfried AI',
      mediaUrls: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
      ]
    },
    targetLocations: ['United States', 'Canada', 'European Union', 'Australia'],
    insights: {
      spend: 4850.00,
      impressions: 195000,
      clicks: 8640,
      cpc: 0.56,
      cpm: 24.87,
      ctr: 4.43,
      conversions: 412,
      cpa: 11.77,
      conversionRate: 4.77,
      roas: 4.85,
      lastSyncedAt: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ggl_camp_003',
    campaignId: '98402910483',
    name: '📺 YouTube In-Stream Video Ads - Product Walkthrough',
    channelType: 'YOUTUBE_VIDEO',
    objective: 'BRAND_CONSIDERATION',
    status: 'PAUSED',
    dailyBudget: 60,
    biddingStrategy: 'MAXIMIZE_CLICKS',
    qualityScore: 8,
    searchImpressionShare: 78.0,
    creative: {
      headlines: [
        'See How Siegfried Works in 60s',
        'Multi-Channel AI Revolution'
      ],
      descriptions: [
        'Watch the live demo of automated campaigns across 9 major platforms.'
      ],
      finalUrl: 'https://siegfriedoutreach.com/video-demo',
      displayPath1: 'watch',
      displayPath2: 'demo',
      businessName: 'Siegfried Video',
      mediaUrls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80']
    },
    targetLocations: ['United States', 'United Kingdom'],
    insights: {
      spend: 960.00,
      impressions: 124000,
      clicks: 3420,
      cpc: 0.28,
      cpm: 7.74,
      ctr: 2.76,
      conversions: 78,
      cpa: 12.30,
      conversionRate: 2.28,
      roas: 3.20,
      lastSyncedAt: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let googleCampaignsState: GoogleCampaignRecord[] = [...INITIAL_GOOGLE_CAMPAIGNS]

export function getGoogleCampaignsStore(): GoogleCampaignRecord[] {
  return googleCampaignsState
}

export function addGoogleCampaignToStore(campaign: GoogleCampaignRecord): GoogleCampaignRecord {
  googleCampaignsState = [campaign, ...googleCampaignsState]
  return campaign
}

export function updateGoogleCampaignStatusInStore(id: string, status?: string): GoogleCampaignRecord | null {
  const item = googleCampaignsState.find(c => c.id === id || c.campaignId === id)
  if (!item) return null
  if (status) {
    item.status = status as any
  } else {
    item.status = item.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
  }
  return item
}

export function deleteGoogleCampaignFromStore(id: string): boolean {
  const initialLen = googleCampaignsState.length
  googleCampaignsState = googleCampaignsState.filter(c => c.id !== id && c.campaignId !== id)
  return googleCampaignsState.length < initialLen
}
