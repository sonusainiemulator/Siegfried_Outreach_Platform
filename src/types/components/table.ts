import { ReactNode } from 'react'

export interface Column<T> {
  header: string | ReactNode
  accessorKey?: keyof T
  cell?: (row: T, index: number) => ReactNode
  className?: string
  sortable?: boolean
  sortKey?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  currentPage?: number
  totalPages?: number
  totalResults?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  emptyMessage?: string
  sortColumn?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string) => void
  enableSelection?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  onBulkDelete?: (selectedRows: T[]) => void
  onRowsPerPageChange?: (rows: number) => void
  rowsPerPage?: number
  showRowsPerPageAtTop?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  onExportPDF?: () => void
  onExportExcel?: () => void
  onExportCSV?: () => void
  onImport?: (file: File) => void
  onDownloadTemplate?: () => void
}
