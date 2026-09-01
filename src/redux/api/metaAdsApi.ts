import { baseApi } from './baseApi'

export interface MetaAdAccount {
  id: string
  adAccountId: string
  accountName: string
  businessId?: string
  currency: string
  accountStatus: string
  amountSpent: number
  spendCap: number
  isDefault: boolean
}

export interface MetaCampaign {
  id: string
  campaignId: string
  name: string
  objective: string
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'COMPLETED'
  dailyBudget: number
  insights: {
    spend: number
    impressions: number
    reach: number
    clicks: number
    cpc: number
    ctr: number
    leads: number
    cpl: number
    conversions: number
    roas: number
    lastSyncedAt: string
  }
  createdAt: string
}

export interface MetaDashboardSummary {
  kpis: {
    totalSpend: number
    totalImpressions: number
    totalReach: number
    totalClicks: number
    totalLeads: number
    avgCtr: number
    avgCpc: number
    avgCpl: number
    avgRoas: number
    activeCampaigns: number
    totalCampaigns: number
  }
  chartTimeline: Array<{
    date: string
    spend: number
    clicks: number
    leads: number
    roas: number
  }>
  platformBreakdown: {
    facebook: { spendPercent: number; leadsPercent: number; ctr: number }
    instagram: { spendPercent: number; leadsPercent: number; ctr: number }
  }
  placementBreakdown: Array<{
    name: string
    percentage: number
    icon: string
  }>
}

export const metaAdsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdAccounts: builder.query<{ success: boolean; data: MetaAdAccount[] }, void>({
      query: () => '/meta-ads/accounts',
      providesTags: ['MetaAds'],
    }),

    getMetaDashboardSummary: builder.query<{ success: boolean; data: MetaDashboardSummary }, void>({
      query: () => '/meta-ads/dashboard',
      providesTags: ['MetaAds', 'MetaCampaigns'],
    }),

    getMetaCampaigns: builder.query<{ success: boolean; data: MetaCampaign[] }, { status?: string; search?: string }>({
      query: (params) => ({
        url: '/meta-ads/campaigns',
        params,
      }),
      providesTags: ['MetaCampaigns'],
    }),

    launch1ClickCampaign: builder.mutation<any, {
      campaignName: string
      objective: string
      dailyBudget: number
      targetCountries?: string[]
      ageMin?: number
      ageMax?: number
      genders?: string
      interests?: string[]
      placements?: string[]
      format?: string
      creative: {
        primaryText: string
        headline: string
        description?: string
        callToAction: string
        mediaUrls?: string[]
        destinationUrl?: string
      }
    }>({
      query: (body) => ({
        url: '/meta-ads/campaigns/launch',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MetaAds', 'MetaCampaigns'],
    }),

    toggleCampaignStatus: builder.mutation<any, { id: string; status?: string }>({
      query: ({ id, status }) => ({
        url: `/meta-ads/campaigns/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['MetaCampaigns', 'MetaAds'],
    }),

    deleteMetaCampaign: builder.mutation<any, string>({
      query: (id) => ({
        url: `/meta-ads/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MetaCampaigns', 'MetaAds'],
    }),

    generateAIAdCopy: builder.mutation<{ success: boolean; data: any }, {
      productOrService: string
      objective?: string
      targetAudience?: string
    }>({
      query: (body) => ({
        url: '/meta-ads/ai/generate-copy',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetAdAccountsQuery,
  useGetMetaDashboardSummaryQuery,
  useGetMetaCampaignsQuery,
  useLaunch1ClickCampaignMutation,
  useToggleCampaignStatusMutation,
  useDeleteMetaCampaignMutation,
  useGenerateAIAdCopyMutation,
} = metaAdsApi
