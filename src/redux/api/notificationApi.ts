import { baseApi } from './baseApi'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{ success: boolean; notifications: any[]; unreadCount: number }, void>({
      query: () => '/notification',
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/notification/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    sendCustomPushNotification: builder.mutation<{ success: boolean; message: string; recipientCount?: number; pusherStatus?: any }, { target: 'all' | 'selected'; user_ids?: string[]; title: string; message: string; link?: string; send_pusher?: boolean }>({
      query: (body) => ({
        url: '/notification/send-custom-push',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),
    getPusherSettings: builder.query<{ success: boolean; data: { pusher_app_id: string; pusher_key: string; pusher_secret: string; pusher_cluster: string; pusher_enabled: boolean } }, void>({
      query: () => '/notification/pusher-settings',
      providesTags: ['UserSettings'],
    }),
    updatePusherSettings: builder.mutation<{ success: boolean; message: string; data: any }, { pusher_app_id: string; pusher_key: string; pusher_secret?: string; pusher_cluster: string; pusher_enabled: boolean }>({
      query: (body) => ({
        url: '/notification/pusher-settings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserSettings'],
    }),
    testPusherConfig: builder.mutation<{ success: boolean; message: string }, { pusher_app_id?: string; pusher_key?: string; pusher_secret?: string; pusher_cluster?: string }>({
      query: (body) => ({
        url: '/notification/test-pusher',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useSendCustomPushNotificationMutation,
  useGetPusherSettingsQuery,
  useUpdatePusherSettingsMutation,
  useTestPusherConfigMutation,
} = notificationApi
