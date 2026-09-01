import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import Input from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { Column, DataTableProps } from '@/types'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { ImportModal } from './ImportModal'
import { Pagination } from './Pagination'
import Spinner from './Spinner'

export type { Column, DataTableProps }

export function DataTable<T>({
  columns,
  data,
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onPageChange,
  isLoading = false,
  emptyMessage,
  sortColumn,
  sortOrder,
  onSort,
  enableSelection = false,
  onSelectionChange,
  onBulkDelete,
  onRowsPerPageChange,
  rowsPerPage,
  showRowsPerPageAtTop = false,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onImport,
  onDownloadTemplate,
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const direction = useAppDirection()

  const defaultEmptyMessage = emptyMessage || t('no_results')

  const hasExport = !!(onExportPDF || onExportExcel || onExportCSV)
  const hasImport = !!onImport
  const showToolbar = !!(onSearchChange || hasExport || hasImport || showRowsPerPageAtTop)

  useEffect(() => {
    onSelectionChange?.(selectedRows)
  }, [selectedRows, onSelectionChange])

  useEffect(() => {
    setTimeout(() => {
      setSelectedRows([])
    }, 10)
  }, [data])

  const handleHeaderClick = (col: Column<T>) => {
    if (col.sortable && onSort) {
      const key = col.sortKey || (col.accessorKey as string)
      if (key) {
        onSort(key)
      }
    }
  }

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null

    const key = col.sortKey || (col.accessorKey as string)
    if (!key) return null

    if (sortColumn === key) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
    }

    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
  }

  const toggleAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows([...data])
    }
  }

  const toggleRow = (row: T) => {
    const rowId = (row as any).id || (row as any)._id
    const isSelected = selectedRows.some((r: any) => {
      const rId = r.id || r._id
      if (rowId && rId) return rId === rowId
      return r === row
    })

    if (isSelected) {
      setSelectedRows(
        selectedRows.filter((r: any) => {
          const rId = r.id || r._id
          if (rowId && rId) return rId !== rowId
          return r !== row
        }),
      )
    } else {
      setSelectedRows([...selectedRows, row])
    }
  }

  const isRowSelected = (row: T) => {
    const rowId = (row as any).id || (row as any)._id
    return selectedRows.some((r: any) => {
      const rId = r.id || r._id
      if (rowId && rId) return rId === rowId
      return r === row
    })
  }

  return (
    <div className="space-y-3">
      {/* Toolbar Card: Search + Rows-per-page + Export */}
      {showToolbar && (
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            {onSearchChange && (
              <div
                className={cn(
                  'relative transition-all duration-300 ease-in-out',
                  isSearchFocused ? 'w-full sm:w-[1000px]' : 'w-full sm:w-[700px]',
                )}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder || t('search')}
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-9 h-10 sm:h-12 w-full inner-card glass-dark-card"
                />
              </div>
            )}

            {/* Bulk Delete - Always visible if selection enabled */}
            {enableSelection && (
              <div className="flex items-center gap-3 animate-in fade-in duration-200">
                <Button
                  variant={selectedRows.length > 0 ? 'destructive' : 'outline'}
                  size="sm"
                  className={cn(
                    'rounded-[8px] p-3 font-bold cursor-pointer transition-all duration-200',
                    selectedRows.length === 0 ? 'bg-light-gray! dark:bg-light-button! text-muted-foreground/90 border-none!' : '',
                  )}
                  onClick={() => selectedRows.length > 0 && setShowDeleteConfirm(true)}
                  disabled={selectedRows.length === 0}
                >
                  <Trash2 className={cn('w-4 h-4', selectedRows.length === 0 && 'opacity-90')} />
                  <span className="hidden sm:inline">{t('bulk_delete', { defaultValue: 'Bulk Delete' })}</span>
                </Button>
                <span
                  className={cn(
                    'text-sm font-medium whitespace-nowrap transition-colors duration-200',
                    selectedRows.length > 0 ? 'text-destructive' : 'text-muted-foreground/60',
                  )}
                >
                  {selectedRows.length} {t('items_selected', { defaultValue: 'items selected' })}
                </span>

              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Import Button */}
            {hasImport && (
              <>
                <Button
                  variant="outline"
                  className="sm:h-12 h-10 px-4 gap-2 rounded-[8px] text-subtitle-color inner-card glass-dark-card font-medium text-sm whitespace-nowrap cursor-pointer"
                  onClick={() => setShowImportModal(true)}
                >
                  <Upload className="w-4 h-4" />
                  {t('import', { defaultValue: 'Import' })}
                </Button>
                <ImportModal
                  isOpen={showImportModal}
                  onClose={() => setShowImportModal(false)}
                  onImport={(file) => {
                    onImport!(file)
                    setShowImportModal(false)
                  }}
                  onDownloadTemplate={onDownloadTemplate}
                  title={t('import_data', { defaultValue: 'Import Data' })}
                />
              </>
            )}

            {/* Export Dropdown */}
            {hasExport && (
              <DropdownMenu dir={direction}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="sm:h-12 h-10 px-4 gap-2 rounded-[8px] text-subtitle-color inner-card glass-dark-card font-medium text-sm whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    {t('export', { defaultValue: 'Export' })}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-[8px] bg-white dark:bg-modal-bg-color">
                  {onExportPDF && (
                    <DropdownMenuItem onClick={onExportPDF} className="gap-2 cursor-pointer">
                      <FileText className="w-4 h-4 text-red-500" />
                      {t('export_pdf', { defaultValue: 'Export as PDF' })}
                    </DropdownMenuItem>
                  )}
                  {onExportExcel && (
                    <DropdownMenuItem onClick={onExportExcel} className="gap-2 cursor-pointer">
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      {t('export_excel', { defaultValue: 'Export as Excel' })}
                    </DropdownMenuItem>
                  )}
                  {onExportCSV && (
                    <DropdownMenuItem onClick={onExportCSV} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4 text-blue-500" />
                      {t('export_csv', { defaultValue: 'Export as CSV' })}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <div className="rounded-border-radius border border-glass-border text-foreground overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {enableSelection && (
                <TableHead className="w-[60px] h-14  text-center px-6">
                  <div className="flex justify-center items-center">
                    <Checkbox
                      checked={data.length > 0 && selectedRows.length === data.length}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                      onChange={toggleAll}
                    />
                  </div>
                </TableHead>
              )}
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    'h-14 text-sm  font-semibold text-subtitle-color! uppercase px-6',
                    col.className,
                    col.sortable && 'cursor-pointer select-none',
                  )}
                  onClick={() => handleHeaderClick(col)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[13px] font-semiblod whitespace-nowrap text-subtitle-color/60">
                      {col.header}
                    </span>
                    {renderSortIcon(col)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-32 text-center">
                  <Spinner className="min-h-32" size="md" />
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, rowIndex) => (
                <TableRow
                  key={(row as any).id || (row as any)._id || rowIndex}
                  className={cn(
                    'group h-10 hover:bg-[var(--primary)/0.04] dark:hover:bg-black-jet',
                    isRowSelected(row) && 'bg-primary/5',
                  )}
                >
                  {enableSelection && (
                    <TableCell className="py-3 text-center w-[60px] px-6">
                      <div className="flex justify-center items-center">
                        <Checkbox checked={isRowSelected(row)} onChange={() => toggleRow(row)} />
                      </div>
                    </TableCell>
                  )}
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className={cn('py-3 text-sm font-medium px-6', col.className)}>
                      {col.cell
                        ? col.cell(row, rowIndex)
                        : col.accessorKey
                          ? (row[col.accessorKey] as ReactNode)
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {defaultEmptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {onPageChange && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowsPerPage={!showRowsPerPageAtTop}
          totalResults={totalResults || (totalPages <= 1 ? data.length : 0)}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onBulkDelete?.(selectedRows)
          setShowDeleteConfirm(false)
          setSelectedRows([])
        }}
        title={t('confirm_bulk_delete', { defaultValue: 'Confirm Bulk Delete' })}
        description={t('bulk_delete_warning', {
          count: selectedRows.length,
          defaultValue: `Are you sure you want to delete ${selectedRows.length} selected items? This action cannot be undone.`,
        })}
      />
    </div>
  )
}
