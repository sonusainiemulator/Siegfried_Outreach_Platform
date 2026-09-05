import { baseApi } from './baseApi'

export const socialAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewAnalytics: builder.query<any, { targetUserId?: string; timeframe?: string } | void>({
      query: (params) => ({
        url: '/social-analytics/overview',
        params: params || {},
      }),
      providesTags: ['SocialAnalytics'],
    }),

    getPlatformAnalytics: builder.query<
      any,
      { platform: string; targetUserId?: string; accountId?: string; timeframe?: string }
    >({
      query: ({ platform, ...params }) => ({
        url: `/social-analytics/platform/${platform}`,
        params,
      }),
      providesTags: ['SocialAnalytics'],
    }),

    getAnalyticsWorkspaces: builder.query<any, void>({
      query: () => '/social-analytics/workspaces',
    }),

    getRawData: builder.query<
      any,
      { platform?: string; search?: string; page?: number; limit?: number; targetUserId?: string }
    >({
      query: (params) => ({
        url: '/social-analytics/raw-data',
        params,
      }),
      providesTags: ['SocialAnalytics'],
    }),

    addRawData: builder.mutation<any, any>({
      query: (data) => ({
        url: '/social-analytics/raw-data',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAnalytics'],
    }),

    importRawData: builder.mutation<any, { platform: string; records: any[] }>({
      query: (data) => ({
        url: '/social-analytics/raw-data/import',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAnalytics'],
    }),

    syncPlatformAnalytics: builder.mutation<any, { platform: string; socialAccountId?: string }>({
      query: (data) => ({
        url: '/social-analytics/sync',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAnalytics'],
    }),

    getAnalyticsSettings: builder.query<any, void>({
      query: () => '/social-analytics/settings',
      providesTags: ['SocialAnalytics'],
    }),

    updateAnalyticsSettings: builder.mutation<any, { settings: any }>({
      query: (data) => ({
        url: '/social-analytics/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SocialAnalytics'],
    }),
  }),
})

export const {
  useGetOverviewAnalyticsQuery,
  useGetPlatformAnalyticsQuery,
  useGetAnalyticsWorkspacesQuery,
  useGetRawDataQuery,
  useAddRawDataMutation,
  useImportRawDataMutation,
  useSyncPlatformAnalyticsMutation,
  useGetAnalyticsSettingsQuery,
  useUpdateAnalyticsSettingsMutation,
} = socialAnalyticsApi
