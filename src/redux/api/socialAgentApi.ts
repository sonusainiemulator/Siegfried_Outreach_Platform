import { baseApi } from './baseApi'

export type SocialContentType = 'post_image' | 'post_reel' | 'post_video' | 'post_carousel'

export interface SocialContentIdea {
  _id: string
  title: string
  description: string
  contentType: SocialContentType
  platform: string
  trendScore: number
  viralPotential: 'low' | 'medium' | 'high' | 'viral'
  hashtags: string[]
  creditCost: number
  isSelected?: boolean
}

export interface CompetitorInsight {
  _id: string
  competitorName: string
  platform: string
  topPosts: { content: string; engagement: number; date: string }[]
  contentStrategy: string
  postFrequency: string
  strengths: string[]
  gaps: string[]
  updatedAt: string
}

export interface TrendingTopic {
  _id: string
  topic: string
  platform: string
  trendScore: number
  category: string
  relatedHashtags: string[]
  expiresAt: string
}

export interface GeneratedContent {
  _id: string
  userId: string
  contentType: SocialContentType
  platform: string
  caption: string
  hashtags: string[]
  mediaUrl?: string
  thumbnailUrl?: string
  status: 'generating' | 'ready' | 'scheduled' | 'posted' | 'failed'
  scheduledAt?: string
  postedAt?: string
  engagement?: { likes: number; comments: number; shares: number; views: number }
  creditCost: number
  createdAt: string
}

export const socialAgentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateContentIdeas: builder.mutation<{ ideas: SocialContentIdea[] }, { businessType: string; platform?: string; count?: number }>({
      query: (data) => ({ url: '/ai-employees/social-agent/ideas', method: 'POST', body: data }),
      invalidatesTags: ['SocialAgent'],
    }),
    analyzeCompetitors: builder.mutation<{ insights: CompetitorInsight[] }, { competitorUrls: string[]; platform: string }>({
      query: (data) => ({ url: '/ai-employees/social-agent/competitors', method: 'POST', body: data }),
      invalidatesTags: ['SocialAgent'],
    }),
    getTrendingTopics: builder.query<{ topics: TrendingTopic[] }, { platform?: string; category?: string }>({
      query: (params) => ({ url: '/ai-employees/social-agent/trends', params }),
      providesTags: ['SocialAgent'],
    }),
    generateSocialContent: builder.mutation<{ content: GeneratedContent }, { contentType: SocialContentType; platform: string; topic: string; style?: string; caption?: string }>({
      query: (data) => ({ url: '/ai-employees/social-agent/generate', method: 'POST', body: data }),
      invalidatesTags: ['SocialAgent', 'AiEmployeeCredits'],
    }),
    getContentQueue: builder.query<{ contents: GeneratedContent[] }, { status?: string; platform?: string }>({
      query: (params) => ({ url: '/ai-employees/social-agent/queue', params }),
      providesTags: ['SocialAgent'],
    }),
    scheduleContent: builder.mutation<{ content: GeneratedContent }, { contentId: string; scheduledAt: string; platforms: string[] }>({
      query: (data) => ({ url: '/ai-employees/social-agent/schedule', method: 'POST', body: data }),
      invalidatesTags: ['SocialAgent'],
    }),
    publishContent: builder.mutation<{ content: GeneratedContent }, { contentId: string; platforms: string[] }>({
      query: (data) => ({ url: '/ai-employees/social-agent/publish', method: 'POST', body: data }),
      invalidatesTags: ['SocialAgent', 'AiEmployeeCredits'],
    }),
    getContentResource: builder.query<{ resources: { type: SocialContentType; templates: { name: string; previewUrl: string; creditCost: number }[] }[] }, { businessType: string }>({
      query: (params) => ({ url: '/ai-employees/social-agent/resources', params }),
      providesTags: ['SocialAgent'],
    }),
  }),
})

export const {
  useGenerateContentIdeasMutation,
  useAnalyzeCompetitorsMutation,
  useGetTrendingTopicsQuery,
  useGenerateSocialContentMutation,
  useGetContentQueueQuery,
  useScheduleContentMutation: useScheduleSocialContentMutation,
  usePublishContentMutation,
  useGetContentResourceQuery,
} = socialAgentApi
