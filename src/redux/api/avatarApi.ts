'use client'

import { baseApi } from './baseApi'

export interface AvatarEngine {
  id: string
  name: string
  badge: string
  desc: string
  category: string
  speed: string
  resolution: string
}

export interface AvatarStyle {
  id: string
  name: string
  description: string
  promptModifier: string
  category: string
  previewUrl: string
}

export interface PresetAvatar {
  id: string
  name: string
  gender: string
  role: string
  style: string
  imageUrl: string
  defaultVoice: string
}

export interface PresetVoice {
  id: string
  name: string
  language: string
  gender: string
  accent: string
}

export interface BackgroundOption {
  id: string
  name: string
  type: string
  color?: string
}

export interface SampleScript {
  title: string
  text: string
}

export interface InfluencerNiche {
  id: string
  name: string
  desc: string
}

export interface VariationScene {
  id: string
  name: string
  prompt: string
}

export interface ProductTemplate {
  id: string
  name: string
  badge: string
  desc: string
  defaultScript: string
}

export interface SocialPreset {
  id: string
  name: string
  format: string
  duration: string
}

export interface AvatarOptionsResponse {
  engines?: AvatarEngine[]
  styles: AvatarStyle[]
  presetAvatars: PresetAvatar[]
  voices: PresetVoice[]
  backgrounds: BackgroundOption[]
  sampleScripts: SampleScript[]
  influencerNiches: InfluencerNiche[]
  variationScenes: VariationScene[]
  productTemplates: ProductTemplate[]
  socialPresets: SocialPreset[]
}

export interface AvatarItem {
  _id: string
  title: string
  type: 'avatar' | 'avatar_video' | 'influencer' | 'product_video' | 'short_video'
  platform: string
  prompt: string
  content: string
  images: string[]
  metadata: {
    rawPrompt?: string
    style?: string
    aspectRatio?: string
    gender?: string
    age?: string
    expression?: string
    lighting?: string
    attire?: string
    width?: number
    height?: number
    script?: string
    voice?: PresetVoice
    background?: BackgroundOption
    speechRate?: number
    speechPitch?: number
    estimatedDurationSeconds?: number
    avatarUrl?: string
    avatarId?: string
    status?: string
    name?: string
    niche?: string
    ethnicity?: string
    variations?: string[]
    productName?: string
    productType?: string
    productImageUrl?: string
    template?: ProductTemplate
    ctaText?: string
    discountBadge?: string
    mode?: string
  }
  created_at: string
}

export interface AvatarHistoryResponse {
  data: AvatarItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const avatarApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAvatarOptions: builder.query<AvatarOptionsResponse, void>({
      query: () => ({
        url: '/ai-avatar/options',
        method: 'GET',
      }),
    }),

    generateAvatarImage: builder.mutation<{ message: string; data: AvatarItem }, any>({
      query: (body) => ({
        url: '/ai-avatar/generate-image',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateAvatarVideo: builder.mutation<{ message: string; data: AvatarItem }, any>({
      query: (body) => ({
        url: '/ai-avatar/generate-video',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateInfluencer: builder.mutation<{ message: string; data: AvatarItem }, any>({
      query: (body) => ({
        url: '/ai-avatar/influencer/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateInfluencerVariations: builder.mutation<{ message: string; data: { imageUrl: string; scene: string; influencerId: string } }, any>({
      query: (body) => ({
        url: '/ai-avatar/influencer/variations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    generateProductVideo: builder.mutation<{ message: string; data: AvatarItem }, any>({
      query: (body) => ({
        url: '/ai-avatar/product-video/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiContent'],
    }),

    getAvatarHistory: builder.query<AvatarHistoryResponse, { page?: number; limit?: number; type?: string; search?: string }>({
      query: (params) => ({
        url: '/ai-avatar/history',
        method: 'GET',
        params,
      }),
      providesTags: ['AiContent'],
    }),

    deleteAvatar: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/ai-avatar/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AiContent'],
    }),
  }),
})

export const {
  useGetAvatarOptionsQuery,
  useGenerateAvatarImageMutation,
  useGenerateAvatarVideoMutation,
  useGenerateInfluencerMutation,
  useGenerateInfluencerVariationsMutation,
  useGenerateProductVideoMutation,
  useGetAvatarHistoryQuery,
  useDeleteAvatarMutation,
} = avatarApi
