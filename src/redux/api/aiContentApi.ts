import { baseApi } from './baseApi'

export const aiContentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    generateSocialMediaImage: builder.mutation<any, {
      prompt: string
      platform?: string
      format?: string
      style?: string
      numImages?: number
    }>({
      query: (body) => ({
        url: '/ai-content/social-image',
        method: 'POST',
        body,
      }),
    }),
    analyzeImageForCaption: builder.mutation<any, any>({
      query: (body) => {
        if (body instanceof FormData) {
          return {
            url: '/ai-content/analyze-image',
            method: 'POST',
            body,
          }
        }
        return {
          url: '/ai-content/analyze-image',
          method: 'POST',
          body,
        }
      },
    }),
    generateCode: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/generate/code',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    analyzeContent: builder.mutation<any, { text: string; title?: string }>({
      query: (body) => ({
        url: '/ai-content/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateKeywords: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/article/keywords',
        method: 'POST',
        body,
      }),
    }),

    generateTitles: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/article/titles',
        method: 'POST',
        body,
      }),
    }),

    generateOutlines: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/article/outlines',
        method: 'POST',
        body,
      }),
    }),

    generateArticleImage: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/article/generate-image',
        method: 'POST',
        body,
      }),
    }),

    generateArticle: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/generate/article',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateCarousel: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ai-content/generate/carousel',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateSocialCaption: builder.mutation<any, {
      action?: 'generate_full' | 'enhance_caption' | 'add_hashtags' | 'add_cta' | 'generate_titles'
      topic?: string
      existingTitle?: string
      existingContent?: string
      platforms?: string[]
      tone?: string
      goal?: string
      includeHashtags?: boolean
      includeEmojis?: boolean
    }>({
      query: (body) => ({
        url: '/ai-content/generate/social-caption',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateBatchCalendar: builder.mutation<any, {
      sourceType?: "topic" | "youtube_url" | "article_url" | "transcript"
      sourceValue: string
      daysCount?: number
      platforms?: string[]
      tone?: string
      niche?: string
      startDate?: string
      postTime?: string
      frequency?: "daily" | "weekdays" | "alternate"
      includeHashtags?: boolean
      includeEmojis?: boolean
    }>({
      query: (body) => ({
        url: "/ai-content/generate/batch-calendar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AiContent"],
    }),

    getAiHistory: builder.query<any, { type?: string; limit?: number }>({
      query: (params) => ({
        url: '/ai-content/history',
        method: 'GET',
        params,
      }),
      providesTags: ['AiContent'],
    }),

    deleteAiContent: builder.mutation<any, string>({
      query: (id) => ({
        url: `/ai-content/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AiContent'],
    }),

    transcribeAudio: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/ai-content/transcribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),
    getCodeHistory: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/ai-content/code/history',
        method: 'GET',
        params,
      }),
      providesTags: ['AiContent'],
    }),
    getTranscribeHistory: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/ai-content/transcribe/history',
        method: 'GET',
        params,
      }),
      providesTags: ['AiContent'],
    }),
  }),
})

export const {
  useGenerateCodeMutation,
  useAnalyzeContentMutation,
  useGenerateKeywordsMutation,
  useGenerateTitlesMutation,
  useGenerateOutlinesMutation,
  useGenerateArticleImageMutation,
  useGenerateArticleMutation,
  useGenerateCarouselMutation,
  useGenerateSocialCaptionMutation,
  useAnalyzeImageForCaptionMutation,
  useGenerateSocialMediaImageMutation,
  useGenerateBatchCalendarMutation,
  useGetAiHistoryQuery,
  useDeleteAiContentMutation,
  useTranscribeAudioMutation,
  useGetCodeHistoryQuery,
  useGetTranscribeHistoryQuery,
} = aiContentApi
