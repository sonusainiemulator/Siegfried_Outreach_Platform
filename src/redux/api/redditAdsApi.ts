import { baseApi } from './baseApi'

export interface RedditAdAccount {
  id: string
  adAccountId: string
  accountName: string
  currency: string
  timezone: string
  balance: number
  accountStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  isDefault: boolean
  businessName: string
}

export interface RedditPixel {
  id: string
  pixelId: string
  pixelName: string
  status: 'ACTIVE' | 'INACTIVE'
  lastActive: string
  eventsCount: number
  eventsTracked: string[]
}

export interface RedditCampaign {
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

export interface RedditDashboardSummary {
  kpis: {
    totalSpend: number
    totalImpressions: number
    totalUpvotes: number
    totalComments: number
    totalClicks: number
    totalConversions: number
    avgCtr: number
    avgCpc: number
    avgCpm: number
    avgCpa: number
    avgRoas: number
    activeCampaigns: number
    totalCampaigns: number
  }
  chartTimeline: Array<{
    date: string
    spend: number
    clicks: number
    upvotes: number
    conversions: number
    roas: number
  }>
  subredditBreakdown: Array<{
    name: string
    percentage: number
    subscribers: string
    ctr: number
  }>
  placementBreakdown: Array<{
    name: string
    percentage: number
    icon: string
  }>
}

export interface LaunchRedditCampaignPayload {
  campaignName: string
  objective: string
  budgetMode: 'DAILY' | 'LIFETIME'
  dailyBudget: number
  targetSubreddits: string[]
  targetInterests: string[]
  targetCountries?: string[]
  creative: {
    title: string
    bodyMarkdown?: string
    callToAction: string
    destinationUrl: string
    thumbnailUrl?: string
    authorHandle?: string
    flairText?: string
    format?: 'PROMOTED_LINK' | 'PROMOTED_IMAGE' | 'FREEFORM_POST' | 'PROMOTED_VIDEO'
  }
}

export interface RedditAICopyPayload {
  productOrService: string
  targetSubreddits?: string[]
  objective?: string
  tone?: string
}

export interface RedditAICopyResponse {
  campaignName: string
  headline: string
  bodyMarkdown: string
  callToAction: string
  flairText: string
  suggestedSubreddits: string[]
  redditCommunityAdvice: string
}

export const redditAdsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRedditAdAccounts: builder.query<{ success: boolean; data: RedditAdAccount[] }, void>({
      query: () => '/reddit-ads/accounts',
      providesTags: ['RedditAds'],
    }),

    getRedditDashboardSummary: builder.query<{ success: boolean; data: RedditDashboardSummary }, void>({
      query: () => '/reddit-ads/dashboard',
      providesTags: ['RedditAds', 'RedditCampaigns'],
    }),

    getRedditCampaigns: builder.query<{ success: boolean; data: RedditCampaign[] }, { status?: string; search?: string; objective?: string }>({
      query: (params) => ({
        url: '/reddit-ads/campaigns',
        params,
      }),
      providesTags: ['RedditCampaigns'],
    }),

    getRedditPixels: builder.query<{ success: boolean; data: RedditPixel[] }, void>({
      query: () => '/reddit-ads/pixels',
      providesTags: ['RedditAds'],
    }),

    launchRedditCampaign: builder.mutation<{ success: boolean; data: RedditCampaign; message?: string }, LaunchRedditCampaignPayload>({
      query: (body) => ({
        url: '/reddit-ads/campaigns/launch',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RedditAds', 'RedditCampaigns'],
    }),

    toggleRedditCampaignStatus: builder.mutation<{ success: boolean; data: RedditCampaign }, { id: string; status?: string }>({
      query: ({ id, status }) => ({
        url: `/reddit-ads/campaigns/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['RedditCampaigns', 'RedditAds'],
    }),

    deleteRedditCampaign: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/reddit-ads/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RedditCampaigns', 'RedditAds'],
    }),

    generateRedditAICopy: builder.mutation<{ success: boolean; data: RedditAICopyResponse }, RedditAICopyPayload>({
      query: (body) => ({
        url: '/reddit-ads/ai/generate-copy',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetRedditAdAccountsQuery,
  useGetRedditDashboardSummaryQuery,
  useGetRedditCampaignsQuery,
  useGetRedditPixelsQuery,
  useLaunchRedditCampaignMutation,
  useToggleRedditCampaignStatusMutation,
  useDeleteRedditCampaignMutation,
  useGenerateRedditAICopyMutation,
} = redditAdsApi
