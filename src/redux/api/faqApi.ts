import { baseApi } from './baseApi'
import { Faq, FaqResponse, FaqQueryParams } from '@/types'

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<FaqResponse, FaqQueryParams>({
      query: (params) => ({
        url: '/faq/all',
        params,
      }),
      providesTags: ['Faq'],
    }),
    createFaq: builder.mutation<{message: string; data:Faq}, Partial<Faq>>({
      query: (body) => ({
        url: '/faq/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faq'],
    }),
    updateFaq: builder.mutation<{message: string; data: Faq}, Partial<Faq> & { id: string;}>({
      query: ({ id, ...body }) => ({
        url: `/faq/${id}/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Faq'],
    }),
    updateFaqStatus: builder.mutation<{message: string}, { id: string;  status: boolean }>({
      query: ({ id, status }) => ({
        url: `/faq/${id}/update/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Faq'],
    }),
    deleteFaqs: builder.mutation<{message?: string}, string[]>({
      query: (ids) => ({
        url: '/faq/delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Faq'],
    }),
  }),
})

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useUpdateFaqStatusMutation,
  useDeleteFaqsMutation,
} = faqApi
