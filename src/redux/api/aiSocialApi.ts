import { baseApi } from './baseApi'

export const aiSocialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessProfile: builder.query({ query: () => '/ai-social/business/profile', providesTags: ['AiSocialBusiness'] as any }),
    saveBusinessProfile: builder.mutation({ query: (data: any) => ({ url: '/ai-social/business/profile', method: 'POST', body: data }), invalidatesTags: ['AiSocialBusiness'] as any }),
    getBusinessProducts: builder.query({ query: (businessId: string) => `/ai-social/business/${businessId}/products`, providesTags: ['AiSocialProducts'] as any }),
    saveBusinessProducts: builder.mutation({ query: (data: any) => ({ url: '/ai-social/business/products', method: 'POST', body: data }), invalidatesTags: ['AiSocialProducts'] as any }),
    generatePlan: builder.mutation({ query: (data: any) => ({ url: '/ai-social/ai/generate-plan', method: 'POST', body: data }), invalidatesTags: ['AiSocialCalendar'] as any }),
    generateCaption: builder.mutation({ query: (data: any) => ({ url: '/ai-social/ai/generate-caption', method: 'POST', body: data }), invalidatesTags: ['AiSocialCalendar'] as any }),
    generateCreative: builder.mutation({ query: (data: any) => ({ url: '/ai-social/ai/generate-creative', method: 'POST', body: data }), invalidatesTags: ['AiSocialCalendar'] as any }),
    generateInsights: builder.mutation({ query: ({ businessId, month, year }: any) => ({ url: `/ai-social/ai/generate-insights/${businessId}?month=${month}&year=${year}`, method: 'POST' }), invalidatesTags: ['AiSocialAnalytics'] as any }),
    getContentCalendar: builder.query({ query: ({ businessId, month, year }: any) => `/ai-social/content/calendar?businessId=${businessId}&month=${month}&year=${year}`, providesTags: ['AiSocialCalendar'] as any }),
    updateContentStatus: builder.mutation({ query: ({ id, status, rejectionNote }: any) => ({ url: `/ai-social/content/${id}/status`, method: 'PUT', body: { status, rejectionNote } }), invalidatesTags: ['AiSocialCalendar'] as any }),
    scheduleContent: builder.mutation({ query: (id: string) => ({ url: `/ai-social/content/${id}/schedule`, method: 'POST' }), invalidatesTags: ['AiSocialCalendar'] as any }),
    getTemplates: builder.query({ query: (params?: any) => ({ url: '/ai-social/templates', params }), providesTags: ['AiSocialTemplates'] as any }),
    createTemplate: builder.mutation({ query: (data: any) => ({ url: '/ai-social/templates', method: 'POST', body: data }), invalidatesTags: ['AiSocialTemplates'] as any }),
    updateTemplate: builder.mutation({ query: ({ id, ...data }: any) => ({ url: `/ai-social/templates/${id}`, method: 'PUT', body: data }), invalidatesTags: ['AiSocialTemplates'] as any }),
    deleteTemplate: builder.mutation({ query: (id: string) => ({ url: `/ai-social/templates/${id}`, method: 'DELETE' }), invalidatesTags: ['AiSocialTemplates'] as any }),
    useTemplate: builder.mutation({ query: ({ id, ...data }: any) => ({ url: `/ai-social/templates/${id}/use`, method: 'POST', body: data }), invalidatesTags: ['AiSocialCalendar'] as any }),
    getCreditBalance: builder.query({ query: () => '/ai-social/credits/balance', providesTags: ['AiSocialCredits'] as any }),
    getCreditHistory: builder.query({ query: (params?: any) => ({ url: '/ai-social/credits/history', params }), providesTags: ['AiSocialCredits'] as any }),
    addCredits: builder.mutation({ query: (data: any) => ({ url: '/ai-social/credits/add', method: 'POST', body: data }), invalidatesTags: ['AiSocialCredits'] as any }),
    getAiModels: builder.query({ query: () => '/ai-social/ai/models', providesTags: ['AiSocialModels'] as any }),
    updateAiModels: builder.mutation({ query: (data: any) => ({ url: '/ai-social/ai/models', method: 'POST', body: data }), invalidatesTags: ['AiSocialModels'] as any }),
    getAnalyticsDashboard: builder.query({ query: ({ businessId, month, year }: any) => `/ai-social/analytics/business/${businessId}?month=${month}&year=${year}`, providesTags: ['AiSocialAnalytics'] as any }),
  }),
})

export const {
  useGetBusinessProfileQuery, useSaveBusinessProfileMutation,
  useGetBusinessProductsQuery, useSaveBusinessProductsMutation,
  useGeneratePlanMutation, useGenerateCaptionMutation,
  useGenerateCreativeMutation, useGenerateInsightsMutation,
  useGetContentCalendarQuery, useUpdateContentStatusMutation,
  useScheduleContentMutation, useGetTemplatesQuery,
  useCreateTemplateMutation, useUpdateTemplateMutation,
  useDeleteTemplateMutation, useUseTemplateMutation,
  useGetCreditBalanceQuery, useGetCreditHistoryQuery,
  useAddCreditsMutation, useGetAiModelsQuery, useUpdateAiModelsMutation,
  useGetAnalyticsDashboardQuery,
} = aiSocialApi

