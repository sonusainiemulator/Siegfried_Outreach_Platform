export interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export interface RowsPerPageSelectorProps {
  rowsPerPage: number
  onRowsPerPageChange: (rows: number) => void
}