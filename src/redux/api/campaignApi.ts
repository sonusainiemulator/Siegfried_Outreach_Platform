import { baseApi } from './baseApi'
import { Campaign, CampaignInput, CampaignResponse, CampaignQueryParams } from '@/types'

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<CampaignResponse, CampaignQueryParams>({
      query: (params) => ({
        url: '/broadcast',
        params,
      }),
      providesTags: ['Campaign'],
    }),
    getCampaign: builder.query<{ data: Campaign }, string>({
      query: (id) => `/broadcast/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: builder.mutation<{ message: string; campaign: Campaign }, CampaignInput | FormData>({
      query: (body) => ({
        url: '/broadcast/create',
        method: 'POST',
        body,
        formData: body instanceof FormData,
      }),
      invalidatesTags: ['Campaign'],
    }),
    updateCampaign: builder.mutation<{ message: string; data: Campaign }, { id: string; data: Partial<CampaignInput> | FormData }>({
      query: ({ id, data }) => ({
        url: `/broadcast/${id}`,
        method: 'PUT',
        body: data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: (result, error, { id }) => ['Campaign', { type: 'Campaign', id }],
    }),
    deleteCampaign: builder.mutation<{ message: string }, string | string[]>({
      query: (id) => {
        if (Array.isArray(id)) {
          return {
            url: '/broadcast/bulk',
            method: 'DELETE',
            body: { ids: id },
          }
        }
        return {
          url: `/broadcast/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Campaign'],
    }),
    generateEmailContent: builder.mutation<{ data: { subject: string; html: string }; message: string }, { prompt: string }>({
      query: (body) => ({
        url: '/broadcast/generate-email',
        method: 'POST',
        body,
      }),
    }),
    generateWhatsappContent: builder.mutation<{ data: string; message: string }, { prompt: string }>({
      query: (body) => ({
        url: '/broadcast/generate-whatsapp',
        method: 'POST',
        body,
      }),
    }),
    generateTelegramContent: builder.mutation<{ data: string; message: string }, { prompt: string }>({
      query: (body) => ({
        url: '/broadcast/generate-telegram',
        method: 'POST',
        body,
      }),
    }),
    getCampaignDashboard: builder.query<any, void>({
      query: () => '/broadcast/dashboard',
      providesTags: ['Campaign'],
    }),
  }),
})

export const {
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useGenerateEmailContentMutation,
  useGenerateWhatsappContentMutation,
  useGenerateTelegramContentMutation,
  useGetCampaignDashboardQuery,
} = campaignApi
