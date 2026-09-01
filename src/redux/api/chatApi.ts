import { baseApi } from './baseApi'
import { 
  SendMessageRequest, 
  SendMessageResponse, 
  PublicChatbotInfo, 
  SuggestionResponse, 
  ValidateChatbotResponse 
} from '@/types'

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ id, ...body }) => ({
        url: `/chat/chatbot/${id}`,
        method: 'POST',
        body,
      }),
    }),

    getPublicChatbotInfo: builder.query<PublicChatbotInfo, string>({
      query: (id) => `/chat/chatbot/${id}/info`,
    }),

    getChatbotSuggestions: builder.query<SuggestionResponse, string>({
      query: (id) => `/chat/chatbot/${id}/suggestions`,
    }),

    getChatbotIframe: builder.query<{ html: string }, string>({
      query: (id) => `/chat/chatbot/${id}/iframe`,
    }),

    validateChatbot: builder.query<ValidateChatbotResponse, string>({
      query: (id) => `/chat/validate/${id}`,
    }),

    getConversationHistory: builder.query<any, { id: string; sessionId: string }>({
      query: ({ id, sessionId }) => `/conversations/chatbot/${id}/history?sessionId=${sessionId}`,
    }),

    startNewConversation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/conversations/chatbot/${id}/new`,
        method: 'POST',
      }),
      invalidatesTags: ['Conversation'],
    }),

    getUserConversations: builder.query<any, string>({
      query: (id) => `/conversations/chatbot/${id}/conversation`,
      providesTags: ['Conversation'],
    }),

    deleteConversations: builder.mutation<any, { chatbotId: string; conversationIds: string[] }>({
      query: ({ chatbotId, conversationIds }) => ({
        url: `/conversations/chatbot/delete`,
        method: 'DELETE',
        body: { ids: conversationIds },
      }),
      invalidatesTags: ['Conversation'],
    }),

    updateConversationTitle: builder.mutation<any, { chatbotId: string; conversationId: string; title: string }>({
      query: ({ chatbotId, conversationId, title }) => ({
        url: `/conversations/update/${conversationId}`,
        method: 'PUT',
        body: { title },
      }),
      invalidatesTags: ['Conversation'],
    }),

    togglePinConversation: builder.mutation<any, { chatbotId: string; conversationId: string }>({
      query: ({ conversationId }) => ({
        url: `/conversations/pin/${conversationId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversation'],
    }),

    toggleArchiveConversation: builder.mutation<any, { chatbotId: string; conversationId: string }>({
      query: ({ conversationId }) => ({
        url: `/conversations/archive/${conversationId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversation'],
    }),

    getArchivedConversations: builder.query<any, void>({
      query: () => '/conversations/archived',
      providesTags: ['Conversation'],
    }),
  }),
})

export const {
  useSendMessageMutation,
  useGetPublicChatbotInfoQuery,
  useGetChatbotSuggestionsQuery,
  useGetChatbotIframeQuery,
  useValidateChatbotQuery,
  useGetConversationHistoryQuery,
  useStartNewConversationMutation,
  useGetUserConversationsQuery,
  useDeleteConversationsMutation,
  useUpdateConversationTitleMutation,
  useTogglePinConversationMutation,
  useToggleArchiveConversationMutation,
  useGetArchivedConversationsQuery,
} = chatApi
