import { baseApi } from './baseApi'

export const smartWriterApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getTemplates: builder.query<any, { category?: string }>({
            query: (params) => ({
                url: '/smart-writer/templates',
                method: 'GET',
                params,
            }),
            providesTags: ['AiContent'],
        }),

        getTemplateBySlug: builder.query<any, string>({
            query: (slug) => ({
                url: `/smart-writer/templates/${slug}`,
                method: 'GET',
            }),
        }),

        getFavorites: builder.query<any, void>({
            query: () => ({
                url: '/smart-writer/favorites',
                method: 'GET',
            }),
            providesTags: ['AiContent'],
        }),

        toggleTemplateFavorite: builder.mutation<any, { templateId: string }>({
            query: (body) => ({
                url: '/smart-writer/toggle-favorite',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AiContent'],
        }),
        generateContent: builder.mutation<any, { templateSlug: string; inputs: any; modelName?: string; numResults?: number }>({
            query: (body) => ({
                url: '/smart-writer/generate',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AiContent'],
        }),
        getTemplateHistory: builder.query<any, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/smart-writer/history',
                method: 'GET',
                params,
            }),
            providesTags: ['AiContent'],
        }),
        rewriteContent: builder.mutation<any, { content: string; mode: string; language?: string; modelName?: string }>({
            query: (body) => ({
                url: '/smart-writer/rewrite',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AiContent'],
        }),
        saveContent: builder.mutation<any, { title?: string; content: string; templateId?: string; prompt?: string; feature?: string; metadata?: any }>({
            query: (body) => ({
                url: '/smart-writer/save',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AiContent'],
        }),
        getRewriterModes: builder.query<any, void>({
            query: () => ({
                url: '/smart-writer/rewriter-modes',
                method: 'GET',
            }),
        }),
        getRewriterHistory: builder.query<any, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/smart-writer/rewriter-history',
                method: 'GET',
                params,
            }),
            providesTags: ['AiContent'],
        }),
    }),
})

export const {
    useGetTemplatesQuery,
    useGetTemplateBySlugQuery,
    useGetFavoritesQuery,
    useToggleTemplateFavoriteMutation,
    useGenerateContentMutation,
    useGetTemplateHistoryQuery,
    useRewriteContentMutation,
    useGetRewriterModesQuery,
    useSaveContentMutation,
    useGetRewriterHistoryQuery,
} = smartWriterApi
