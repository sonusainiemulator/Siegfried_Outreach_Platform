import { baseApi } from './baseApi'

export const dataManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    exportData: builder.query<{ blob: Blob; filename: string }, { url: string; params?: any; defaultFilename: string }>({
      query: ({ url, params }) => ({
        url,
        params,
        responseHandler: async (response) => {
          const blob = await response.blob()
          const contentDisposition = response.headers.get('Content-Disposition')
          let filename = ''
          if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|([^;\n]*))/
            const matches = filenameRegex.exec(contentDisposition)
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '')
            }
          }
          return { blob, filename }
        },
      }),
    }),
    importData: builder.mutation<{ message: string; results?: any }, { url: string; file: File; fieldName?: string }>({
      query: ({ url, file, fieldName = 'file' }) => {
        const formData = new FormData()
        formData.append(fieldName, file)
        return {
          url,
          method: 'POST',
          body: formData,
        }
      },
    }),
    downloadTemplate: builder.query<Blob, { url: string; type?: string }>({
      query: ({ url, type }) => ({
        url,
        params: type ? { type } : {},
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
})

export const {
  useLazyExportDataQuery,
  useImportDataMutation,
  useLazyDownloadTemplateQuery,
} = dataManagementApi
