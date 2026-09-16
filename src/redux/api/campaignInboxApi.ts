import { baseApi } from './baseApi'

export const campaignInboxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignConversations: builder.query<
      any,
      {
        page?: number
        limit?: number
        search?: string
        platform?: string
        source?: string
        status?: string
        assignee?: string
        channel?: string
      }
    >({
      query: ({ page = 1, limit = 50, search = '', platform, source, status, assignee, channel } = {}) => {
        let queryString = `page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        if (platform && platform !== 'All' && platform !== 'All Platforms') {
          queryString += `&platform=${encodeURIComponent(platform)}`
        }
        if (source && source !== 'All' && source !== 'All Platforms') {
          queryString += `&source=${encodeURIComponent(source)}`
        }
        if (channel && channel !== 'All' && channel !== 'All Platforms') {
          queryString += `&channel=${encodeURIComponent(channel)}`
        }
        if (status && status !== 'All' && status !== 'all') {
          queryString += `&status=${encodeURIComponent(status)}`
        }
        if (assignee && assignee !== 'All' && assignee !== 'All Assignees') {
          queryString += `&assignee=${encodeURIComponent(assignee)}`
        }
        return {
          url: `/broadcast-inbox/list?${queryString}`,
          method: 'GET',
        }
      },
      providesTags: ['CampaignInbox'],
    }),

    getCampaignConversationHistory: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/broadcast-inbox/${conversationId}/history`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'CampaignInbox', id }],
    }),

    campaignInboxReply: builder.mutation<
      any,
      { conversationId: string; message: string; files?: File[]; isNote?: boolean }
    >({
      query: ({ conversationId, message, files, isNote }) => {
        const formData = new FormData()
        if (message) formData.append('message', message)
        if (isNote) formData.append('isNote', 'true')
        if (files && files.length > 0) {
          files.forEach((file) => formData.append('files', file))
        }
        return {
          url: `/broadcast-inbox/${conversationId}/reply`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'CampaignInbox', id: conversationId }, 'CampaignInbox'],
    }),

    updateConversationStatus: builder.mutation<any, { conversationId: string; status: string }>({
      query: ({ conversationId, status }) => ({
        url: `/broadcast-inbox/${conversationId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'CampaignInbox', id: conversationId }, 'CampaignInbox'],
    }),

    updateConversationDetails: builder.mutation<
      any,
      {
        conversationId: string
        firstName?: string
        lastName?: string
        email?: string
        phone?: string
        assignee?: string
        teamRouter?: string
        aiCopilotEnabled?: boolean
        tags?: string[]
        isMuted?: boolean
      }
    >({
      query: ({ conversationId, ...body }) => ({
        url: `/broadcast-inbox/${conversationId}/details`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'CampaignInbox', id: conversationId }, 'CampaignInbox'],
    }),

    deleteCampaignConversation: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: `/broadcast-inbox/delete`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['CampaignInbox'],
    }),
  }),
})

export const {
  useGetCampaignConversationsQuery,
  useGetCampaignConversationHistoryQuery,
  useCampaignInboxReplyMutation,
  useUpdateConversationStatusMutation,
  useUpdateConversationDetailsMutation,
  useDeleteCampaignConversationMutation,
} = campaignInboxApi

