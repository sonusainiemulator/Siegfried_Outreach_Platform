import { baseApi } from './baseApi'
import { ContactGroup, ContactGroupQueryParams, ContactGroupResponse } from '@/types'

export const contactListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactGroups: builder.query<ContactGroupResponse, ContactGroupQueryParams | void>({
      query: (params) => ({
        url: '/contact-group',
        params: params || {},
      }),
      providesTags: ['ContactGroup'],
    }),
    getContactGroup: builder.query<ContactGroup, string>({
      query: (id) => `/contact-group/${id}`,
      transformResponse: (response: { list: ContactGroup }) => response.list,
      providesTags: (result, error, id) => [{ type: 'ContactGroup', id }],
    }),
    createContactGroup: builder.mutation<ContactGroup, Partial<ContactGroup>>({
      query: (body) => ({
        url: '/contact-group',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { list: ContactGroup }) => response.list,
      invalidatesTags: ['ContactGroup'],
    }),
    updateContactGroup: builder.mutation<ContactGroup, Partial<ContactGroup> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/contact-group/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { list: ContactGroup }) => response.list,
      invalidatesTags: (result, error, { id }) => ['ContactGroup', { type: 'ContactGroup', id }],
    }),
    deleteContactGroups: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/contact-group',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['ContactGroup'],
    }),
    addContactsToList: builder.mutation<any, { id: string; contactIds: string[] }>({
      query: ({ id, contactIds }) => ({
        url: `/contact-group/${id}/add`,
        method: 'POST',
        body: { contactIds },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ContactGroup', id: id }, 'Contact'],
    }),
    removeContactsFromList: builder.mutation<any, { id: string; contactIds: string[] }>({
      query: ({ id, contactIds }) => ({
        url: `/contact-group/${id}/remove`,
        method: 'POST',
        body: { contactIds },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ContactGroup', id: id }, 'Contact'],
    }),
  }),
})

export const {
  useGetContactGroupsQuery,
  useGetContactGroupQuery,
  useCreateContactGroupMutation,
  useUpdateContactGroupMutation,
  useDeleteContactGroupsMutation,
  useAddContactsToListMutation,
  useRemoveContactsFromListMutation,
} = contactListApi
