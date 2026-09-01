import { baseApi } from './baseApi'
import { Contact, ContactResponse, ContactQueryParams } from '@/types'

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<ContactResponse, ContactQueryParams, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20, search, sortBy, sortOrder, listId, type }) => {
        let url = `/contact?page=${page}&limit=${limit}`
        if (search) url += `&search=${encodeURIComponent(search)}`
        if (sortBy) url += `&sortBy=${sortBy}`
        if (sortOrder) url += `&sortOrder=${sortOrder}`
        if (listId) url += `&listId=${listId}`
        if (type) url += `&type=${type}`
        return { url, method: 'GET' }
      },
      providesTags: ['Contact'],
    }),
    createContact: builder.mutation<{ message: string; contact: Contact }, Partial<Contact>>({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation<{ message: string; contact: Contact }, Partial<Contact> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/contact/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Contact'],
    }),
    deleteContacts: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/contact',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Contact'],
    }),
    importContacts: builder.mutation<{ message: string; result: any }, { contacts: Partial<Contact>[] }>({
      query: (body) => ({
        url: '/contact/import',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
})

export const {
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactsMutation,
  useImportContactsMutation,
} = contactApi
