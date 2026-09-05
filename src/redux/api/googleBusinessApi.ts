import { baseApi } from './baseApi'

export interface GoogleProfileAudit {
  _id: string
  websiteId: string
  googleBusinessUrl: string
  overallScore: number
  napConsistency: { score: number; issues: string[] }
  localKeywords: LocalKeyword[]
  citationOpportunities: Citation[]
  reviewSummary: { totalReviews: number; averageRating: number; suggestions: string[] }
  status: 'analyzing' | 'complete'
  createdAt: string
  updatedAt: string
}

export interface LocalKeyword {
  keyword: string
  searchVolume: number
  localRelevance: number
  currentRank?: number
  targetRank?: number
  isApplied: boolean
  type: 'primary' | 'geo_modified' | 'service_area' | 'long_tail'
}

export interface Citation {
  platform: string
  url: string
  status: 'claimed' | 'unclaimed' | 'inconsistent'
  priority: 'high' | 'medium' | 'low'
}

export interface GooglePost {
  _id: string
  title: string
  content: string
  mediaUrl?: string
  callToAction?: { type: string; url: string }
  status: 'draft' | 'scheduled' | 'published'
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
}

export const googleBusinessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    analyzeGoogleProfile: builder.mutation<{ audit: GoogleProfileAudit }, { googleBusinessUrl: string; websiteId?: string }>({
      query: (data) => ({ url: '/ai-employees/google-business/analyze', method: 'POST', body: data }),
      invalidatesTags: ['GoogleBusiness', 'AiEmployeeCredits'],
    }),
    getGoogleAudit: builder.query<{ audit: GoogleProfileAudit }, string>({
      query: (websiteId) => `/ai-employees/google-business/audit/${websiteId}`,
      providesTags: ['GoogleBusiness'],
    }),
    getLocalKeywords: builder.query<{ keywords: LocalKeyword[] }, { websiteId: string; industry?: string; location?: string }>({
      query: (params) => ({ url: '/ai-employees/google-business/local-keywords', params }),
      providesTags: ['GoogleBusiness'],
    }),
    applyLocalKeywords: builder.mutation<{ message: string }, { websiteId: string; keywords: string[] }>({
      query: (data) => ({ url: '/ai-employees/google-business/apply-keywords', method: 'POST', body: data }),
      invalidatesTags: ['GoogleBusiness', 'AiEmployeeCredits'],
    }),
    optimizeContent: builder.mutation<{ message: string }, { websiteId: string; optimizations: Record<string, any> }>({
      query: (data) => ({ url: '/ai-employees/google-business/optimize', method: 'POST', body: data }),
      invalidatesTags: ['GoogleBusiness', 'AiEmployeeCredits'],
    }),
    createGooglePost: builder.mutation<{ post: GooglePost }, Partial<GooglePost>>({
      query: (data) => ({ url: '/ai-employees/google-business/posts', method: 'POST', body: data }),
      invalidatesTags: ['GoogleBusiness', 'AiEmployeeCredits'],
    }),
    getGooglePosts: builder.query<{ posts: GooglePost[] }, { status?: string }>({
      query: (params) => ({ url: '/ai-employees/google-business/posts', params }),
      providesTags: ['GoogleBusiness'],
    }),
    getLocalRankings: builder.query<{ rankings: { keyword: string; rank: number; change: number; date: string }[] }, string>({
      query: (websiteId) => `/ai-employees/google-business/rankings/${websiteId}`,
      providesTags: ['GoogleBusiness'],
    }),
  }),
})

export const {
  useAnalyzeGoogleProfileMutation,
  useGetGoogleAuditQuery,
  useGetLocalKeywordsQuery,
  useApplyLocalKeywordsMutation,
  useOptimizeContentMutation,
  useCreateGooglePostMutation,
  useGetGooglePostsQuery,
  useGetLocalRankingsQuery,
} = googleBusinessApi
