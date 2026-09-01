export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  hasNextPage?: boolean
  hasPrevPage?: boolean
  rowsPerPage?: number
  onRowsPerPageChange?: (rows: number) => void
  showRowsPerPage?: boolean
  totalResults?: number
}
