'use client'

import PageForm from '@/components/feature/app-settings/WebPageForm'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useDeletePagesMutation, useGetPagesQuery, useUpdatePageStatusMutation } from '@/redux/api/pageApi'
import { ApiError, Page } from '@/types'
import { ViewType } from '@/types/components/pages'
import { formatDate } from '@/utils'
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function SettingsPagesPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Pages', 'write')

  const [view, setView] = useState<ViewType>('list')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading } = useGetPagesQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  })

  const [deletePages, { isLoading: isDeleting }] = useDeletePagesMutation()
  const [updateStatus] = useUpdatePageStatusMutation()

  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleEdit = (p: Page) => {
    setSelectedPage(p)
    setView('edit')
  }

  const handleCreate = () => {
    setSelectedPage(null)
    setView('create')
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deletePages([idToDelete]).unwrap()
      toast.success(res.message || t('page_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_page'))
    }
  }

  const handleStatusChange = async (id: string) => {
    try {
      const res = await updateStatus({ id }).unwrap()
      toast.success(res.message || t('status_updated_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status'))
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const columns: Column<Page>[] = [
    {
      header: t('title'),
      accessorKey: 'title',
      className: 'font-semibold text-foreground min-w-[200px]',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-primary/5 text-primary dark:bg-light-button flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-bold truncate" title={row.title}>
            {row.title}
          </span>
        </div>
      ),
    },
    {
      header: t('slug'),
      accessorKey: 'slug',
      className: 'min-w-[150px]',
      cell: (row) => (
        <Badge
          variant="outline"
          className="font-mono text-[10px] bg-muted/50 border-border/50 rounded-lg px-3 py-1 text-light-title-color whitespace-nowrap"
        >
          /{row.slug}
        </Badge>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      className: 'min-w-[100px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <Switch checked={row.status} onCheckedChange={() => handleStatusChange(row._id || row.id)} />
          ) : (
            <Switch checked={row.status} disabled />
          )}
        </div>
      ),
    },
    {
      header: t('created_at'),
      accessorKey: 'created_at',
      sortable: true,
      className: 'min-w-[150px]',
      cell: (row) => (
        <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      header: t('actions'),
      className: 'text-right min-w-[120px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-edit h-8 w-8 bg-edit-color/10 hover:text-white hover:bg-edit-color"
            onClick={() => handleEdit(row)}
            title={t('edit')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {canManage && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white"
              onClick={() => handleDelete(row._id || row.id)}
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (view !== 'list') {
    return <PageForm page={selectedPage} onClose={() => setView('list')} />
  }

  return (
    <>
      <TableLayout
        title={t('pages_title')}
        subtitle={t('pages_desc')}
        primaryAction={
          canManage
            ? {
                label: t('add_page'),
                onClick: handleCreate,
                icon: <Plus className="h-5 w-5" strokeWidth={3} />,
              }
            : undefined
        }
        columns={columns}
        data={data?.pages || []}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_pages_found')}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        rowsPerPage={limit}
        onBulkDelete={async (rows) => {
          const ids = rows.map((r) => r._id || r.id)
          try {
            const res = await deletePages(ids).unwrap()
            toast.success(res.message || t('pages_deleted_successfully'))
          } catch (error) {
            const apiError = error as ApiError
            toast.error(apiError?.data?.message || t('failed_to_delete_pages'))
          }
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_pages')}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_page_title') || t('delete_confirmation')}
        description={t('delete_page_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />
    </>
  )
}
