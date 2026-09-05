import { baseApi } from './baseApi'

export interface SeoAudit {
  _id: string
  websiteId: string
  overallScore: number
  categories: SeoCategory[]
  keywords: KeywordSuggestion[]
  status: 'analyzing' | 'complete' | 'applying'
  createdAt: string
  updatedAt: string
}

export interface SeoCategory {
  name: string
  score: number
  maxScore: number
  issues: SeoIssue[]
}

export interface SeoIssue {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  description: string
  recommendation: string
  isFixed: boolean
  creditCost: number
  complexity: 'simple' | 'moderate' | 'complex'
  page?: string
}

export interface KeywordSuggestion {
  keyword: string
  searchVolume: number
  difficulty: number
  relevance: number
  isApplied: boolean
  type: 'primary' | 'secondary' | 'long_tail' | 'local'
}

export interface SeoTrainingConfig {
  _id: string
  rules: { name: string; enabled: boolean; weight: number; description: string }[]
  customPrompts: { category: string; prompt: string }[]
  industryKeywords: { industry: string; keywords: string[] }[]
  algorithms: { name: string; enabled: boolean; tier: 'simple' | 'moderate' | 'complex' }[]
}

export const seoAgentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    analyzeSeo: builder.mutation<{ audit: SeoAudit }, { websiteId: string }>({
      query: (data) => ({ url: '/ai-employees/seo-agent/analyze', method: 'POST', body: data }),
      invalidatesTags: ['SeoAgent', 'AiEmployeeCredits'],
    }),
    getSeoAudit: builder.query<{ audit: SeoAudit }, string>({
      query: (websiteId) => `/ai-employees/seo-agent/audit/${websiteId}`,
      providesTags: ['SeoAgent'],
    }),
    getKeywordSuggestions: builder.query<{ keywords: KeywordSuggestion[] }, { websiteId: string; industry?: string }>({
      query: (params) => ({ url: '/ai-employees/seo-agent/keywords', params }),
      providesTags: ['SeoAgent'],
    }),
    applySeoFix: builder.mutation<{ audit: SeoAudit }, { websiteId: string; issueId: string }>({
      query: (data) => ({ url: '/ai-employees/seo-agent/fix', method: 'POST', body: data }),
      invalidatesTags: ['SeoAgent', 'AiEmployeeCredits'],
    }),
    applyAllSeoFixes: builder.mutation<{ audit: SeoAudit }, { websiteId: string }>({
      query: (data) => ({ url: '/ai-employees/seo-agent/fix-all', method: 'POST', body: data }),
      invalidatesTags: ['SeoAgent', 'AiEmployeeCredits'],
    }),
    applyKeywords: builder.mutation<{ message: string }, { websiteId: string; keywords: string[] }>({
      query: (data) => ({ url: '/ai-employees/seo-agent/apply-keywords', method: 'POST', body: data }),
      invalidatesTags: ['SeoAgent', 'AiEmployeeCredits'],
    }),
    getSeoTrainingConfig: builder.query<{ config: SeoTrainingConfig }, void>({
      query: () => '/ai-employees/seo-agent/training',
      providesTags: ['SeoAgent'],
    }),
    updateSeoTraining: builder.mutation<{ config: SeoTrainingConfig }, Partial<SeoTrainingConfig>>({
      query: (data) => ({ url: '/ai-employees/seo-agent/training', method: 'PUT', body: data }),
      invalidatesTags: ['SeoAgent'],
    }),
  }),
})

export const {
  useAnalyzeSeoMutation,
  useGetSeoAuditQuery,
  useGetKeywordSuggestionsQuery,
  useApplySeoFixMutation,
  useApplyAllSeoFixesMutation,
  useApplyKeywordsMutation,
  useGetSeoTrainingConfigQuery,
  useUpdateSeoTrainingMutation,
} = seoAgentApi
