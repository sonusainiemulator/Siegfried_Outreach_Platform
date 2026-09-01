import { baseApi } from './baseApi'
import { Page, PageResponse, PageQueryParams } from '@/types'

export const pageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query<PageResponse, PageQueryParams>({
      query: (params) => ({
        url: '/page',
        params,
      }),
      providesTags: ['Page'],
    }),
    getPageBySlug: builder.query<{ message: string; page: Page }, string>({
      query: (slug) => ({
        url: `/page/slug/${slug}`,
      }),
      providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
    }),
    createPage: builder.mutation<{ message: string; page: Page }, Partial<Page>>({
      query: (body) => ({
        url: '/page/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Page'],
    }),
    updatePage: builder.mutation<{ message: string; page: Page }, Partial<Page> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/page/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => ['Page', { type: 'Page', id }],
    }),
    updatePageStatus: builder.mutation<{ message: string; page: Page }, { id: string }>({
      query: ({ id }) => ({
        url: `/page/${id}/update/status`,
        method: 'PUT',
      }),
      invalidatesTags: ['Page'],
    }),
    deletePages: builder.mutation<{ message: string; deletedCount: number }, string[]>({
      query: (ids) => ({
        url: '/page/delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Page'],
    }),
  }),
})

export const {
  useGetPagesQuery,
  useGetPageBySlugQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useUpdatePageStatusMutation,
  useDeletePagesMutation,
} = pageApi
