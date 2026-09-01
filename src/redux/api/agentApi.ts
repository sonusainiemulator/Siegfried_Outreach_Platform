import { baseApi } from './baseApi'

export const agentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    getTransferredConversations: builder.query<any, { page?: number; limit?: number; search?: string; filterStatus?: string }>({
      query: ({ page = 1, limit = 20, search = '', filterStatus = 'all' } = {}) => ({
        url: `/agent/conversation/fetch?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}${filterStatus && filterStatus !== 'all' ? `&filterStatus=${filterStatus}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['AgentChat'],
    }),


    getAgentConversationHistory: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/agent/conversation/${conversationId}/history`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'AgentChat', id }],
    }),


    getUserHistory: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/agent/conversation/${conversationId}/user-history`,
        method: 'GET',
      }),
    }),


    agentReply: builder.mutation<any, { conversationId: string; message: string; files?: File[] }>({
      query: ({ conversationId, message, files }) => {
        const formData = new FormData()
        formData.append('message', message || '')

        if (files && files.length > 0) {
          files.forEach((file) => formData.append('files', file))
        }
        return {
          url: `/agent/conversation/${conversationId}/reply`,
          method: 'POST',
          body: formData,
        }
      },
    }),


    resolveConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/agent/conversation/${conversationId}/resolve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'AgentChat', id }, 'AgentChat'],
    }),


    listAgents: builder.query<{ agents: any[] }, void>({
      query: () => ({
        url: '/agent/conversation/get-available-agents',
        method: 'GET',
      }),
    }),


    assignAgent: builder.mutation<any, { conversationId: string; agentId: string | null }>({
      query: (body) => ({
        url: `/agent/conversation/assign`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'AgentChat', id: conversationId }, 'AgentChat'],
    }),

    deleteConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/agent/conversation/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AgentChat'],
    }),


    toggleAgentPinConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/agent/conversation/${conversationId}/pin`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AgentChat'],
    }),
  }),
})

export const {
  useGetTransferredConversationsQuery,
  useGetAgentConversationHistoryQuery,
  useGetUserHistoryQuery,
  useAgentReplyMutation,
  useResolveConversationMutation,
  useListAgentsQuery,
  useAssignAgentMutation,
  useDeleteConversationMutation,
  useToggleAgentPinConversationMutation,
} = agentApi
