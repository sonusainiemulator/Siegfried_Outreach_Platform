import { baseApi } from './baseApi'

export const socialMediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => '/social-accounts/dashboard',
      providesTags: ['SocialAccount', 'SocialPost'],
    }),
    getSocialAccounts: builder.query({
      query: (params) => ({
        url: '/social-accounts',
        params,
      }),
      providesTags: ['SocialAccount'],
    }),
    connectSocialAccount: builder.mutation({
      query: (data) => ({
        url: '/social-accounts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAccount'],
    }),
    disconnectSocialAccount: builder.mutation({
      query: (id) => ({
        url: `/social-accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SocialAccount'],
    }),
    connectWhatsAppOfficial: builder.mutation({
      query: (data) => ({
        url: '/social-auth/whatsapp/connect',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAccount'],
    }),
    startWhatsAppQrSession: builder.mutation({
      query: () => ({
        url: '/social-auth/whatsapp/qr/start',
        method: 'POST',
      }),
    }),
    getWhatsAppQrStatus: builder.query({
      query: (sessionId) => `/social-auth/whatsapp/qr/${sessionId}/status`,
    }),
    cancelWhatsAppQrSession: builder.mutation({
      query: (sessionId) => ({
        url: `/social-auth/whatsapp/qr/${sessionId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['SocialAccount'],
    }),
    getSocialPosts: builder.query({
      query: (params) => ({
        url: '/social-posts',
        params,
      }),
      providesTags: ['SocialPost'],
    }),
    createSocialPost: builder.mutation({
      query: (data) => ({
        url: '/social-posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialPost'],
    }),
    updateSocialPost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/social-posts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SocialPost'],
    }),
    deleteSocialPost: builder.mutation({
      query: (id) => ({
        url: `/social-posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SocialPost'],
    }),
    batchScheduleSocialPosts: builder.mutation({
      query: (data) => ({
        url: "/social-posts/batch-schedule",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SocialPost"],
    }),

    getSocialPost: builder.query({
      query: (id) => `/social-posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'SocialPost', id }],
    }),

    getCalendarNotes: builder.query<
      { success: boolean; notes: any[] },
      { startDate?: string; endDate?: string; category?: string; search?: string } | void
    >({
      query: (params) => ({
        url: '/calendar-notes',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.notes.map(({ id }) => ({ type: 'CalendarNote' as const, id })),
              { type: 'CalendarNote', id: 'LIST' },
            ]
          : [{ type: 'CalendarNote', id: 'LIST' }],
    }),

    createCalendarNote: builder.mutation<
      { success: boolean; message: string; note: any },
      {
        targetDate: string | Date
        title: string
        content?: string
        category?: string
        color?: string
        checklist?: Array<{ id?: string; text: string; completed?: boolean }>
        isPinned?: boolean
      }
    >({
      query: (data) => ({
        url: '/calendar-notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'CalendarNote', id: 'LIST' }],
    }),

    updateCalendarNote: builder.mutation<
      { success: boolean; message: string; note: any },
      {
        id: string
        data: {
          targetDate?: string | Date
          title?: string
          content?: string
          category?: string
          color?: string
          checklist?: Array<{ id?: string; text: string; completed?: boolean }>
          isPinned?: boolean
        }
      }
    >({
      query: ({ id, data }) => ({
        url: `/calendar-notes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'CalendarNote', id },
        { type: 'CalendarNote', id: 'LIST' },
      ],
    }),

    deleteCalendarNote: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/calendar-notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'CalendarNote', id },
        { type: 'CalendarNote', id: 'LIST' },
      ],
    }),

    toggleChecklistItem: builder.mutation<
      { success: boolean; message: string; note: any },
      { id: string; itemId: string; completed: boolean }
    >({
      query: ({ id, itemId, completed }) => ({
        url: `/calendar-notes/${id}/checklist/${itemId}/toggle`,
        method: 'PATCH',
        body: { completed },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'CalendarNote', id },
        { type: 'CalendarNote', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetDashboardDataQuery,
  useGetSocialAccountsQuery,
  useConnectSocialAccountMutation,
  useDisconnectSocialAccountMutation,
  useConnectWhatsAppOfficialMutation,
  useStartWhatsAppQrSessionMutation,
  useGetWhatsAppQrStatusQuery,
  useCancelWhatsAppQrSessionMutation,
  useGetSocialPostsQuery,
  useGetSocialPostQuery,
  useCreateSocialPostMutation,
  useUpdateSocialPostMutation,
  useDeleteSocialPostMutation,
  useBatchScheduleSocialPostsMutation,
  useGetCalendarNotesQuery,
  useCreateCalendarNoteMutation,
  useUpdateCalendarNoteMutation,
  useDeleteCalendarNoteMutation,
  useToggleChecklistItemMutation,
} = socialMediaApi
