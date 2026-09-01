import { baseApi } from './baseApi'

export const adminSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSettings: builder.query({
      query: () => ({
        url: '/setting',
      }),
      providesTags: ['AdminSettings'],
    }),
    getPublicSettings: builder.query({
      query: () => ({
        url: '/setting/public',
      }),
      providesTags: ['AdminSettings'],
    }),
    updateAdminSettings: builder.mutation({
      query: (data) => ({
        url: '/setting/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminSettings', 'Language'],
    }),
    sendTestMail: builder.mutation({
      query: (data) => ({
        url: '/setting/send-test-email',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useGetAdminSettingsQuery, useGetPublicSettingsQuery, useUpdateAdminSettingsMutation, useSendTestMailMutation } = adminSettingApi
