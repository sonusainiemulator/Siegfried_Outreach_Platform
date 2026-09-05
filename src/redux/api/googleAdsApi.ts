import { baseApi } from './baseApi'

export interface GoogleAdAccount {
  id: string
  customerId: string
  accountName: string
  currency: string
  timeZone: string
  balance: number
  accountStatus: 'ACTIVE' | 'CANCELLED' | 'SUSPENDED'
  isDefault: boolean
  managerAccountId?: string
}

export interface GoogleTag {
  id: string
  tagId: string
  tagName: string
  status: 'ACTIVE' | 'INACTIVE'
  enhancedConversionsEnabled: boolean
  lastPing: string
  conversionActionsCount: number
  actions: Array<{
    name: string
    category: string
    conversionsCount: number
  }>
}

export interface GoogleCampaign {
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
  qualityScore: number // 1 - 10
  searchImpressionShare: number // percentage
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

export interface GoogleDashboardSummary {
  kpis: {
    totalSpend: number
    totalImpressions: number
    totalClicks: number
    totalConversions: number
    avgCtr: number
    avgCpc: number
    avgCpm: number
    avgCpa: number
    avgRoas: number
    avgQualityScore: number
    searchImpressionShare: number
    activeCampaigns: number
    totalCampaigns: number
  }
  chartTimeline: Array<{
    date: string
    spend: number
    clicks: number
    conversions: number
    roas: number
  }>
  channelBreakdown: Array<{
    channel: string
    name: string
    percentage: number
    spend: number
    roas: number
    icon: string
  }>
  topKeywords: Array<{
    keyword: string
    matchType: string
    clicks: number
    ctr: number
    cpc: number
    conversions: number
    qualityScore: number
  }>
}

export interface LaunchGoogleCampaignPayload {
  campaignName: string
  channelType: 'SEARCH' | 'PERFORMANCE_MAX' | 'DISPLAY' | 'YOUTUBE_VIDEO' | 'SHOPPING' | 'APP'
  objective: string
  dailyBudget: number
  biddingStrategy: 'MAXIMIZE_CONVERSIONS' | 'TARGET_CPA' | 'TARGET_ROAS' | 'MAXIMIZE_CLICKS'
  targetCpa?: number
  targetRoas?: number
  targetLocations?: string[]
  targetKeywords?: Array<{ keyword: string; matchType: 'EXACT' | 'PHRASE' | 'BROAD' }>
  negativeKeywords?: string[]
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
}

export interface GoogleAICopyPayload {
  productOrService: string
  objective?: string
  targetAudience?: string
  websiteUrl?: string
}

export interface GoogleAICopyResponse {
  campaignName: string
  headlines: string[]
  descriptions: string[]
  suggestedKeywords: Array<{ keyword: string; matchType: 'EXACT' | 'PHRASE' | 'BROAD' }>
  negativeKeywords: string[]
  sitelinks: Array<{ text: string; description: string; url: string }>
  callouts: string[]
  pMaxOptimizationTip: string
}

export const googleAdsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGoogleAdAccounts: builder.query<{ success: boolean; data: GoogleAdAccount[] }, void>({
      query: () => '/google-ads/accounts',
      providesTags: ['GoogleAds'],
    }),

    getGoogleDashboardSummary: builder.query<{ success: boolean; data: GoogleDashboardSummary }, void>({
      query: () => '/google-ads/dashboard',
      providesTags: ['GoogleAds', 'GoogleCampaigns'],
    }),

    getGoogleCampaigns: builder.query<{ success: boolean; data: GoogleCampaign[] }, { status?: string; search?: string; channelType?: string }>({
      query: (params) => ({
        url: '/google-ads/campaigns',
        params,
      }),
      providesTags: ['GoogleCampaigns'],
    }),

    getGoogleTags: builder.query<{ success: boolean; data: GoogleTag[] }, void>({
      query: () => '/google-ads/tags',
      providesTags: ['GoogleAds'],
    }),

    launchGoogleCampaign: builder.mutation<{ success: boolean; data: GoogleCampaign; message?: string }, LaunchGoogleCampaignPayload>({
      query: (body) => ({
        url: '/google-ads/campaigns/launch',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GoogleAds', 'GoogleCampaigns'],
    }),

    toggleGoogleCampaignStatus: builder.mutation<{ success: boolean; data: GoogleCampaign }, { id: string; status?: string }>({
      query: ({ id, status }) => ({
        url: `/google-ads/campaigns/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['GoogleCampaigns', 'GoogleAds'],
    }),

    deleteGoogleCampaign: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/google-ads/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GoogleCampaigns', 'GoogleAds'],
    }),

    generateGoogleAICopy: builder.mutation<{ success: boolean; data: GoogleAICopyResponse }, GoogleAICopyPayload>({
      query: (body) => ({
        url: '/google-ads/ai/generate-copy',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetGoogleAdAccountsQuery,
  useGetGoogleDashboardSummaryQuery,
  useGetGoogleCampaignsQuery,
  useGetGoogleTagsQuery,
  useLaunchGoogleCampaignMutation,
  useToggleGoogleCampaignStatusMutation,
  useDeleteGoogleCampaignMutation,
  useGenerateGoogleAICopyMutation,
} = googleAdsApi
