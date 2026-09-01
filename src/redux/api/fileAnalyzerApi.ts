import { baseApi } from './baseApi'

export const fileAnalyzerApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadAndAnalyze: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/file-analyzer/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Conversation'],
    }),
    chatWithFile: builder.mutation<any, { conversationId: string; prompt: string }>({
      query: ({ conversationId, prompt }) => ({
        url: `/file-analyzer/chat/${conversationId}`,
        method: 'POST',
        body: { prompt },
      }),
      invalidatesTags: ['Conversation'],
    }),
    getFileHistory: builder.query<any, { isArchived?: boolean; search?: string } | void>({
      query: (params) => {
        const isArchived = params && typeof params === 'object' ? !!params.isArchived : false
        const search = params && typeof params === 'object' && params.search ? params.search : ''
        return `/file-analyzer/history?isArchived=${isArchived}&search=${search}`
      },
      providesTags: ['Conversation'],
      transformResponse: (response: any) => response.history,
    }),
    getConversationDetails: builder.query<any, string>({
      query: (id) => `/file-analyzer/history/${id}`,
      providesTags: ['Conversation'],
      transformResponse: (response: any) => response.conversation,
    }),
    deleteConversation: builder.mutation<any, string[]>({
      query: (ids) => ({
        url: `/conversations/chatbot/delete?source=fileAnalyzer`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Conversation'],
    }),
    archiveConversation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/conversations/archive/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversation'],
    }),
    togglePinFileConversation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/conversations/pin/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
})

export const {
  useUploadAndAnalyzeMutation,
  useChatWithFileMutation,
  useGetFileHistoryQuery,
  useGetConversationDetailsQuery,
  useDeleteConversationMutation,
  useArchiveConversationMutation,
  useTogglePinFileConversationMutation,
} = fileAnalyzerApi
