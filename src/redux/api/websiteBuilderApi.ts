import { baseApi } from './baseApi'

export interface WebsiteTemplate {
  _id: string
  name: string
  businessType: string
  category: string
  description: string
  previewUrl: string
  thumbnailUrl: string
  features: string[]
  creditCost: number
  popularity: number
  rating: number
  isNew?: boolean
  isPremium?: boolean
  createdAt: string
}

export interface GeneratedWebsite {
  _id: string
  userId: string
  templateId: string
  businessId: string
  status: 'generating' | 'draft' | 'ready' | 'published' | 'live'
  progress: number
  title: string
  description: string
  sections: WebsiteSection[]
  seoMeta?: { title: string; description: string; keywords: string[] }
  previewUrl?: string
  liveUrl?: string
  createdAt: string
  updatedAt: string
}

export interface WebsiteSection {
  id: string
  type: 'hero' | 'about' | 'services' | 'portfolio' | 'testimonials' | 'contact' | 'faq' | 'cta' | 'gallery' | 'pricing' | 'team' | 'blog' | 'custom'
  title: string
  content: string
  mediaUrls?: string[]
  order: number
  isVisible: boolean
}

export const websiteBuilderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWebsiteTemplates: builder.query<{ templates: WebsiteTemplate[] }, { businessType?: string; category?: string }>({
      query: (params) => ({ url: '/ai-employees/website-builder/templates', params }),
      providesTags: ['WebsiteBuilder'],
    }),
    generateWebsite: builder.mutation<{ website: GeneratedWebsite }, { templateId: string; businessId: string; customizations?: Record<string, any> }>({
      query: (data) => ({ url: '/ai-employees/website-builder/generate', method: 'POST', body: data }),
      invalidatesTags: ['WebsiteBuilder', 'AiEmployeeCredits'],
    }),
    getGeneratedWebsites: builder.query<{ websites: GeneratedWebsite[] }, void>({
      query: () => '/ai-employees/website-builder/websites',
      providesTags: ['WebsiteBuilder'],
    }),
    getWebsitePreview: builder.query<{ website: GeneratedWebsite }, string>({
      query: (id) => `/ai-employees/website-builder/websites/${id}`,
      providesTags: ['WebsiteBuilder'],
    }),
    updateWebsiteSection: builder.mutation<{ website: GeneratedWebsite }, { websiteId: string; sectionId: string; content: Partial<WebsiteSection> }>({
      query: ({ websiteId, sectionId, ...body }) => ({ url: `/ai-employees/website-builder/websites/${websiteId}/sections/${sectionId}`, method: 'PUT', body }),
      invalidatesTags: ['WebsiteBuilder'],
    }),
    publishWebsite: builder.mutation<{ website: GeneratedWebsite }, string>({
      query: (id) => ({ url: `/ai-employees/website-builder/websites/${id}/publish`, method: 'POST' }),
      invalidatesTags: ['WebsiteBuilder'],
    }),
  }),
})

export const {
  useGetWebsiteTemplatesQuery,
  useGenerateWebsiteMutation,
  useGetGeneratedWebsitesQuery,
  useGetWebsitePreviewQuery,
  useUpdateWebsiteSectionMutation,
  usePublishWebsiteMutation,
} = websiteBuilderApi
