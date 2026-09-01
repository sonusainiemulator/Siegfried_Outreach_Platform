import { baseApi } from './baseApi'

export const campaignInboxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignConversations: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 20, search = '' } = {}) => ({
        url: `/broadcast-inbox/list?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: 'GET',
      }),
      providesTags: ['CampaignInbox'],
    }),

    getCampaignConversationHistory: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/broadcast-inbox/${conversationId}/history`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'CampaignInbox', id }],
    }),

    campaignInboxReply: builder.mutation<any, { conversationId: string; message: string; files?: File[] }>({
      query: ({ conversationId, message, files }) => {
        const formData = new FormData()
        if (message) formData.append('message', message)
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
  useDeleteCampaignConversationMutation,
} = campaignInboxApi
