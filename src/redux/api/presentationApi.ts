import { baseApi } from './baseApi'

export const presentationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPresentationOptions: builder.query<any, void>({
      query: () => ({
        url: '/slide-maker/options',
        method: 'GET',
      }),
    }),

    generatePresentation: builder.mutation<any, any>({
      query: (body) => ({
        url: '/slide-maker/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    getPresentationHistory: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/slide-maker/history',
        method: 'GET',
        params,
      }),
      providesTags: ['AiContent'],
    }),
    deletePresentation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/slide-maker/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AiContent'],
    }),
  }),
})

export const {
  useGetPresentationOptionsQuery,
  useGeneratePresentationMutation,
  useGetPresentationHistoryQuery,
  useDeletePresentationMutation,
} = presentationApi
