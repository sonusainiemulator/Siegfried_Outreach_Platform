import { baseApi } from './baseApi'
import { ContactInquiry, ContactInquiryResponse, ContactInquiryQueryParams } from '@/types'

export const contactInquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactInquiries: builder.query<ContactInquiryResponse, ContactInquiryQueryParams>({
      query: (params) => ({
        url: '/inquiry/all',
        params,
      }),
      providesTags: ['ContactInquiry'],
    }),
    getContactInquiryById: builder.query<ContactInquiry, string>({
      query: (id) => ({
        url: `/inquiry/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'ContactInquiry', id }],
    }),
    deleteContactInquiries: builder.mutation<{ message?: string }, string[]>({
      query: (ids) => ({
        url: '/inquiry/delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['ContactInquiry'],
    }),
    createContactInquiry: builder.mutation<{ message: string }, { name: string; email: string; subject: string; message: string }>({
      query: (body) => ({
        url: '/inquiry/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ContactInquiry'],
    }),
  }),
})

export const {
  useGetContactInquiriesQuery,
  useGetContactInquiryByIdQuery,
  useDeleteContactInquiriesMutation,
  useCreateContactInquiryMutation
} = contactInquiryApi
