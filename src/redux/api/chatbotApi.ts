import { baseApi } from './baseApi'
import { Chatbot, ChatbotResponse, ChatbotQueryParams, CreateChatbotRequest, UpdateChatbotRequest, TelegramGroupsResponse, TelegramQueryParams, TelegramSubscribersResponse } from '@/types'

export const chatbotApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    getChatbots: builder.query<ChatbotResponse, ChatbotQueryParams>({
      query: (params) => ({
        url: '/ai-agents',
        params,
      }),
      providesTags: ['Chatbot'],
    }),


    getChatbotById: builder.query<{ agent: Chatbot }, string>({
      query: (id) => `/ai-agents/${id}`,
      providesTags: ['Chatbot'],
    }),


    createChatbot: builder.mutation<{ message: string; agent: Chatbot }, CreateChatbotRequest>({
      query: (body) => ({
        url: '/ai-agents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chatbot'],
    }),


    updateChatbot: builder.mutation<{ message: string; agent: Chatbot }, { id: string; data: UpdateChatbotRequest }>({
      query: ({ id, data }) => ({
        url: `/ai-agents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Chatbot'],
    }),


    deleteChatbot: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/ai-agents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chatbot'],
    }),


    toggleChatbotStatus: builder.mutation<{ message: string; isActive: boolean }, string>({
      query: (id) => ({
        url: `/ai-agents/${id}/status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Chatbot'],
    }),


    addChannel: builder.mutation<{ message: string; messenger?: any; whatsapp?: any }, { id: string; channel: string; config: any }>({
      query: ({ id, ...body }) => ({
        url: '/ai-agents/' + id + '/channel',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chatbot'],
    }),


    toggleChatbotFavorite: builder.mutation<{ message: string; isFavorite: boolean }, string>({
      query: (id) => ({
        url: `/ai-agents/${id}/favorite`,
        method: 'PATCH',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chatbotApi.util.updateQueryData('getChatbots', {}, (draft) => {
            if (draft?.agents) {
              const bot = draft.agents.find((b) => b.id === id)
              if (bot) {
                bot.isFavorite = !bot.isFavorite
              }
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['Chatbot', 'Dashboard'],
    }),


    getEmbedCode: builder.query<{ embedCode: string }, string>({
      query: (id) => `/widget/embed/${id}`,
      providesTags: ['Chatbot'],
    }),

    getTelegramGroups: builder.query<TelegramGroupsResponse, TelegramQueryParams>({
      query: (params) => ({ url: '/telegram/groups', params }),
      providesTags: ['TelegramGroup'],
    }),

    getTelegramSubscribers: builder.query<TelegramSubscribersResponse, TelegramQueryParams>({
      query: (params) => ({ url: '/telegram/subscribers', params }),
      providesTags: ['TelegramSubscriber'],
    }),
    deleteTelegramGroups: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/telegram/groups',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['TelegramGroup'],
    }),
    deleteTelegramSubscribers: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/telegram/subscribers',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['TelegramSubscriber'],
    }),
  }),
})

export const {
  useGetChatbotsQuery,
  useGetChatbotByIdQuery,
  useCreateChatbotMutation,
  useUpdateChatbotMutation,
  useDeleteChatbotMutation,
  useToggleChatbotStatusMutation,
  useToggleChatbotFavoriteMutation,
  useAddChannelMutation,
  useGetEmbedCodeQuery,
  useGetTelegramGroupsQuery,
  useGetTelegramSubscribersQuery,
  useDeleteTelegramGroupsMutation,
  useDeleteTelegramSubscribersMutation,
} = chatbotApi
