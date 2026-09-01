import { useImportDataMutation, useLazyDownloadTemplateQuery, useLazyExportDataQuery } from '@/redux/api/dataManagementApi'
import { ApiError } from '@/types'
import { useCallback } from 'react'
import { toast } from 'sonner'

export const useFileManagement = () => {
  const [triggerExport, { isFetching: isExporting }] = useLazyExportDataQuery()
  const [triggerTemplate, { isFetching: isDownloadingTemplate }] = useLazyDownloadTemplateQuery()
  const [importData, { isLoading: isImporting }] = useImportDataMutation()

  const handleDownload = useCallback(async (blob: Blob, filename: string, anchorRef?: React.RefObject<HTMLAnchorElement | null>) => {
    const url = window.URL.createObjectURL(blob)

    if (anchorRef?.current) {
      anchorRef.current.href = url
      anchorRef.current.download = filename
      anchorRef.current.click()
    } else {
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    window.URL.revokeObjectURL(url)
  }, [])

  const downloadFile = useCallback(async (url: string, params: Record<string, string | number | boolean>, defaultFilename: string) => {
    try {
      // Remove /api prefix if present as baseApi already includes it
      const cleanUrl = url.startsWith('/api') ? url.replace('/api', '') : url
      const result = await triggerExport({ url: cleanUrl, params, defaultFilename }).unwrap()
      if (result.blob) {
        const extension = params.format || 'xlsx'
        const finalFilename = result.filename || `${defaultFilename}_${Date.now()}.${extension}`
        await handleDownload(result.blob, finalFilename)
      }
    } catch (error) {
      const apiError = error as ApiError
      console.error('Download error:', error)
      toast.error(apiError?.data?.message || 'Download failed. Please try again.')
    }
  }, [triggerExport, handleDownload])

  const downloadTemplate = useCallback(async (url: string, type?: string, defaultFilename = 'template') => {
    try {
      const cleanUrl = url.startsWith('/api') ? url.replace('/api', '') : url
      const blob = await triggerTemplate({ url: cleanUrl, type }).unwrap()
      const extension = 'csv'
      await handleDownload(blob, `${defaultFilename}.${extension}`)
    } catch (error) {
      const apiError = error as ApiError
      console.error('Template download error:', error)
      toast.error(apiError?.data?.message || 'Template download failed.')
    }
  }, [triggerTemplate, handleDownload])

  const uploadFile = useCallback(async (url: string, file: File, fieldName = 'file') => {
    try {
      const cleanUrl = url.startsWith('/api') ? url.replace('/api', '') : url
      const res = await importData({ url: cleanUrl, file, fieldName }).unwrap()
      toast.success(res.message || 'Imported successfully.')
      return res
    } catch (error) {
      const apiError = error as ApiError
      console.error('Import error:', error)
      toast.error(apiError?.data?.message || 'Import failed.')
      throw error
    }
  }, [importData])

  return {
    downloadFile,
    downloadTemplate,
    uploadFile,
    isExporting,
    isImporting,
    isDownloadingTemplate,
  }
}
