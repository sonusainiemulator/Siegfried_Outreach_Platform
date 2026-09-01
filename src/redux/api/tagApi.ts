import { baseApi } from './baseApi'

export interface Tag {
    id: string
    name: string
    description?: string
    status: boolean
    created_at: string
    updated_at: string
}

export interface TagResponse {
    message: string
    tags: Tag[]
    total: number
    totalPages: number
    page: number
    limit: number
}

export interface TagQueryParams {
    page?: number
    limit?: number
    search?: string
    sort_by?: string
    sort_order?: 'ASC' | 'DESC'
}

export const tagApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<TagResponse, TagQueryParams>({
            query: (params) => ({
                url: '/tag/all',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [...result.tags.map(({ id }) => ({ type: 'Tag' as const, id })), { type: 'Tag', id: 'LIST' }]
                    : [{ type: 'Tag', id: 'LIST' }],
        }),
        getTagById: builder.query<{ message: string; tag: Tag }, string>({
            query: (id) => ({
                url: `/tag/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Tag', id }],
        }),
        createTag: builder.mutation<{ message: string; tag: Tag }, Partial<Tag>>({
            query: (body) => ({
                url: '/tag/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
        }),
        updateTag: builder.mutation<{ message: string; tag: Tag }, Partial<Tag> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/tag/update/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tag', id },
                { type: 'Tag', id: 'LIST' },
            ],
        }),
        updateTagStatus: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/tag/status/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Tag', id },
                { type: 'Tag', id: 'LIST' },
            ],
        }),
        deleteTags: builder.mutation<{ message: string; deletedCount: number }, string[]>({
            query: (ids) => ({
                url: '/tag/delete',
                method: 'DELETE',
                body: { ids },
            }),
            invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
        }),
    }),
})

export const {
    useGetTagsQuery,
    useGetTagByIdQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useUpdateTagStatusMutation,
    useDeleteTagsMutation,
} = tagApi
