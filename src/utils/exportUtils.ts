import { ApiError } from '@/types'
import { authUtils } from './index'
import { toast } from 'sonner'

type ExportFormat = 'excel' | 'csv' | 'pdf'

/**
 * Downloads an export file from a backend export endpoint.
 * The endpoint must stream the file as a binary response.
 *
 * @param url        - API path e.g. '/api/user/export'
 * @param format     - 'excel' | 'csv' | 'pdf'
 * @param filename   - base filename without extension e.g. 'users'
 * @param extraParams - additional query params
 */
export async function downloadExport(
  url: string,
  format: ExportFormat,
  filename: string,
  extraParams: Record<string, string> = {},
): Promise<void> {
  try {
    const token = authUtils.getToken()
    const params = new URLSearchParams({ format, ...extraParams })
    const fullUrl = `${url}?${params.toString()}`

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }

    const blob = await response.blob()
    const extension = format === 'excel' ? 'xlsx' : format
    const objectUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `${filename}_${Date.now()}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)
  } catch (error) {
    const apiError = error as ApiError
    console.error('Export error:', error)
    toast.error(apiError?.data?.message || 'Export failed. Please try again.')
  }
}

/**
 * Uploads a file to an import endpoint.
 * The backend endpoint should accept multipart/form-data with a `file` field.
 *
 * @param url       - API path e.g. '/api/user/import'
 * @param file      - The File object to upload
 * @param fieldName - Form-data field name (defaults to 'file')
 */
export async function uploadImport(
  url: string,
  file: File,
  fieldName = 'file',
): Promise<void> {
  try {
    const token = authUtils.getToken()
    const formData = new FormData()
    formData.append(fieldName, file)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const json = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(json?.message || `Import failed: ${response.statusText}`)
    }

    toast.success(json?.message || 'Imported successfully.')
  } catch (error) {
    const apiError = error as ApiError
    console.error('Import error:', error)
    toast.error(apiError?.data?.message || 'Import failed. Please try again.')
  }
}

/**
 * Client-side export from in-memory data (for tables without a backend export endpoint).
 * For Excel/CSV we generate from data rows; for PDF we open print dialog.
 */
export function clientSideExport<T extends Record<string, any>>(
  data: T[],
  columns: { header: string; key: string }[],
  filename: string,
  format: ExportFormat,
): void {
  if (format === 'csv') {
    const headers = columns.map((c) => c.header).join(',')
    const rows = data.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key]
          const str = val !== undefined && val !== null ? String(val) : ''
          return `"${str.replace(/"/g, '""')}"`
        })
        .join(','),
    )
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else if (format === 'excel') {
    // For Excel without a backend, export as CSV with .xlsx  - simple approach
    const headers = columns.map((c) => c.header).join('\t')
    const rows = data.map((row) =>
      columns.map((c) => (row[c.key] !== undefined && row[c.key] !== null ? String(row[c.key]) : '')).join('\t'),
    )
    const content = [headers, ...rows].join('\n')
    const blob = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_${Date.now()}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else if (format === 'pdf') {
    // Simple print-to-PDF approach
    const tableHtml = `
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: var(--muted); padding: 8px; text-align: left; border: 1px solid var(--switch-background); font-weight: 600; }
            td { padding: 8px; border: 1px solid var(--switch-background); }
            tr:nth-child(even) { background: var(--accent-foreground); }
          </style>
        </head>
        <body>
          <h2>${filename.replace(/_/g, ' ')}</h2>
          <table>
            <thead><tr>${columns.map((c) => `<th>${c.header}</th>`).join('')}</tr></thead>
            <tbody>
              ${data
        .map(
          (row) =>
            `<tr>${columns.map((c) => `<td>${row[c.key] !== undefined && row[c.key] !== null ? String(row[c.key]) : '-'}</td>`).join('')}</tr>`,
        )
        .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(tableHtml)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }
}
