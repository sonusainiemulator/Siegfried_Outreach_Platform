import { Language, LanguageResponse } from '@/types/language'
import { baseApi } from './baseApi'

export const languageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query<LanguageResponse, any>({
      query: (params) => ({
        url: '/language',
        params,
      }),
      providesTags: ['Language'],
    }),
    getActiveLanguages: builder.query<LanguageResponse, any>({
      query: (params) => ({
        url: '/language/active',
        params,
      }),
      providesTags: ['Language'],
    }),
    createLanguage: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/language/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Language'],
    }),
    updateLanguage: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/language/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Language'],
    }),
    updateLanguageStatus: builder.mutation<any, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/language/${id}/update/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Language'],
    }),
    deleteLanguages: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: '/language/delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Language'],
    }),
    getTranslationFile: builder.query<any, { locale: string }>({
      query: ({ locale }) => ({
        url: `/language/${locale}/translation`,
      }),
    }),
  }),
})

export const {
  useGetLanguagesQuery,
  useGetActiveLanguagesQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useUpdateLanguageStatusMutation,
  useDeleteLanguagesMutation,
  useLazyGetTranslationFileQuery,
} = languageApi
