import { baseApi } from './baseApi'

export interface BusinessProfile {
  _id?: string
  userId?: string
  businessName: string
  businessType: string
  businessDescription: string
  targetAudience: string
  googleBusinessLink?: string
  referenceSites?: string[]
  mediaUrls?: string[]
  logoUrl?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  website?: string
  socialLinks?: { platform: string; url: string }[]
  onboardingCompleted?: boolean
  currentStep?: number
  selectedAgents?: string[]
  createdAt?: string
  updatedAt?: string
}

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<{ completed: boolean; currentStep: number; profile?: BusinessProfile }, void>({
      query: () => '/ai-employees/onboarding/status',
      providesTags: ['Onboarding'],
    }),
    getBusinessProfile: builder.query<{ profile: BusinessProfile }, void>({
      query: () => '/ai-employees/onboarding/profile',
      providesTags: ['Onboarding'],
    }),
    saveBusinessProfile: builder.mutation<{ profile: BusinessProfile }, Partial<BusinessProfile>>({
      query: (data) => ({ url: '/ai-employees/onboarding/profile', method: 'POST', body: data }),
      invalidatesTags: ['Onboarding'],
    }),
    uploadBusinessMedia: builder.mutation<{ urls: string[] }, FormData>({
      query: (data) => ({ url: '/ai-employees/onboarding/upload', method: 'POST', body: data }),
      invalidatesTags: ['Onboarding'],
    }),
    completeOnboarding: builder.mutation<{ message: string }, { selectedAgents: string[] }>({
      query: (data) => ({ url: '/ai-employees/onboarding/complete', method: 'POST', body: data }),
      invalidatesTags: ['Onboarding', 'AiEmployee'],
    }),
  }),
})

export const {
  useGetOnboardingStatusQuery,
  useGetBusinessProfileQuery: useGetOnboardingProfileQuery,
  useSaveBusinessProfileMutation: useSaveOnboardingProfileMutation,
  useUploadBusinessMediaMutation,
  useCompleteOnboardingMutation,
} = onboardingApi
