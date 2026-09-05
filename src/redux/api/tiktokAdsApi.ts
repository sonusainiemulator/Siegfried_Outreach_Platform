import { baseApi } from './baseApi'

export interface TikTokAdAccount {
  id: string
  adAccountId: string
  accountName: string
  currency: string
  timezone: string
  balance: number
  accountStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED'
  isDefault: boolean
  advertiserId: string
}

export interface TikTokPixel {
  id: string
  pixelId: string
  pixelName: string
  status: 'ACTIVE' | 'INACTIVE'
  lastActive: string
  eventsCount: number
  eventsTracked: string[]
}

export interface TikTokCampaign {
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

export interface TikTokDashboardSummary {
  kpis: {
    totalSpend: number
    totalVideoViews: number
    totalViews2s: number
    totalViews6s: number
    totalConversions: number
    totalClicks: number
    totalImpressions: number
    avgCtr: number
    avgCpc: number
    avgCpm: number
    avgCpa: number
    avgRoas: number
    totalLikes: number
    totalShares: number
    activeCampaigns: number
    totalCampaigns: number
  }
  chartTimeline: Array<{
    date: string
    spend: number
    videoViews: number
    clicks: number
    conversions: number
    roas: number
  }>
  placementBreakdown: Array<{
    name: string
    percentage: number
    icon: string
  }>
  demographics: Array<{
    ageGroup: string
    percentage: number
    ctr: number
  }>
  topCreatives: Array<{
    id: string
    name: string
    views: number
    ctr: number
    roas: number
    thumbnail: string
  }>
}

export interface LaunchTikTokCampaignPayload {
  campaignName: string
  objective: string
  budgetMode: 'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL'
  budget: number
  bidType: 'BID_TYPE_NO_BID' | 'BID_TYPE_COST_CAP'
  targetCpa?: number
  isSmartPlus?: boolean
  isSparkAd?: boolean
  sparkAdAuthCode?: string
  targetCountries?: string[]
  ageMin?: number
  ageMax?: number
  genders?: string
  interests?: string[]
  hashtags?: string[]
  placements?: string[]
  creative: {
    hook: string
    caption: string
    callToAction: string
    videoUrl?: string
    coverUrl?: string
    soundTitle?: string
    hashtags?: string[]
    brandHandle?: string
    landingPageUrl?: string
  }
}

export interface TikTokAICopyPayload {
  productOrService: string
  objective?: string
  targetAudience?: string
  tone?: string
  productUrl?: string
}

export interface TikTokAICopyResponse {
  campaignName: string
  hook: string
  caption: string
  callToAction: string
  hashtags: string[]
  scriptBreakdown: {
    second0to3: string
    second3to15: string
    second15to30: string
  }
  suggestedInterests: string[]
  sparkAdTip: string
}

export const tiktokAdsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTikTokAdAccounts: builder.query<{ success: boolean; data: TikTokAdAccount[] }, void>({
      query: () => '/tiktok-ads/accounts',
      providesTags: ['TikTokAds'],
    }),

    getTikTokDashboardSummary: builder.query<{ success: boolean; data: TikTokDashboardSummary }, void>({
      query: () => '/tiktok-ads/dashboard',
      providesTags: ['TikTokAds', 'TikTokCampaigns'],
    }),

    getTikTokCampaigns: builder.query<{ success: boolean; data: TikTokCampaign[] }, { status?: string; search?: string; objective?: string }>({
      query: (params) => ({
        url: '/tiktok-ads/campaigns',
        params,
      }),
      providesTags: ['TikTokCampaigns'],
    }),

    getTikTokPixels: builder.query<{ success: boolean; data: TikTokPixel[] }, void>({
      query: () => '/tiktok-ads/pixels',
      providesTags: ['TikTokAds'],
    }),

    launchTikTokCampaign: builder.mutation<{ success: boolean; data: TikTokCampaign; message?: string }, LaunchTikTokCampaignPayload>({
      query: (body) => ({
        url: '/tiktok-ads/campaigns/launch',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TikTokAds', 'TikTokCampaigns'],
    }),

    toggleTikTokCampaignStatus: builder.mutation<{ success: boolean; data: TikTokCampaign }, { id: string; status?: string }>({
      query: ({ id, status }) => ({
        url: `/tiktok-ads/campaigns/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['TikTokCampaigns', 'TikTokAds'],
    }),

    deleteTikTokCampaign: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/tiktok-ads/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TikTokCampaigns', 'TikTokAds'],
    }),

    generateTikTokAICopy: builder.mutation<{ success: boolean; data: TikTokAICopyResponse }, TikTokAICopyPayload>({
      query: (body) => ({
        url: '/tiktok-ads/ai/generate-copy',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetTikTokAdAccountsQuery,
  useGetTikTokDashboardSummaryQuery,
  useGetTikTokCampaignsQuery,
  useGetTikTokPixelsQuery,
  useLaunchTikTokCampaignMutation,
  useToggleTikTokCampaignStatusMutation,
  useDeleteTikTokCampaignMutation,
  useGenerateTikTokAICopyMutation,
} = tiktokAdsApi
