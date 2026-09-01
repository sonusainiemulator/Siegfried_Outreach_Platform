'use client'

import { FaqModal } from '@/components/feature/faqs/FaqModal'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useDeleteFaqsMutation, useGetFaqsQuery, useUpdateFaqStatusMutation } from '@/redux/api/faqApi'
import { ApiError, Faq } from '@/types'
import { formatDate } from '@/utils'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function HelpCenterPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage FAQs', 'write')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading } = useGetFaqsQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const [deleteFaqs, { isLoading: isDeleting }] = useDeleteFaqsMutation()
  const [updateFaqStatus] = useUpdateFaqStatusMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedFaq(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteFaqs([idToDelete]).unwrap()
      toast.success(res.message || t('faq_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_faq'))
    }
  }

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      const res = await updateFaqStatus({ id, status: !currentStatus }).unwrap()
      toast.success(res.message || t(!currentStatus ? 'faq_activated' : 'faq_deactivated'))
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

  const columns: Column<Faq>[] = [
    {
      header: t('title'),
      accessorKey: 'title',
      className: 'font-medium w-[20%] [@media(max-width:1580px)]:min-w-[200px]',
      sortable: true,
    },
    {
      header: t('description'),
      accessorKey: 'description',
      cell: (row) => (
        <span className="line-clamp-2 text-subtitle-color" title={row.description}>
          {row.description}
        </span>
      ),
      className: 'w-[30%] [@media(max-width:1580px)]:min-w-[180px]',
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <Switch checked={row.status} onCheckedChange={() => handleStatusChange(row.id, row.status)} />
          ) : (
            <Switch checked={row.status} disabled />
          )}
        </div>
      ),
      className: 'w-[20%]',
    },
    {
      header: t('last_updated'),
      className: '[@media(max-width:1580px)]:min-w-[240px] w-[15%]',
      accessorKey: 'updated_at',
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.updated_at)}
        </span>
      ),
    },
    {
      header: t('actions'),
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
                onClick={() => handleEdit(row)}
                title={t('edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white"
                onClick={() => handleDelete(row.id)}
                title={t('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic px-2">{t('view_only')}</span>
          )}
        </div>
      ),
      className: 'text-right w-[10%]',
    },
  ]

  return (
    <>
      <TableLayout
        title={t('faq')}
        subtitle={t('faq_desc')}
        primaryAction={
          canManage
            ? {
                label: t('add_faq'),
                onClick: handleCreate,
                icon: <Plus className="h-4 w-4 " strokeWidth={3}/>,
                className: 'dark:bg-light-button',
              }
            : undefined
        }
        columns={columns}
        data={data?.faqs || []}
        totalResults={data?.total || 0}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_faqs_found')}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onBulkDelete={async (rows) => {
          const ids = rows.map((r) => r.id)
          try {
            const res = await deleteFaqs(ids).unwrap()
            toast.success(res.message || t('faqs_deleted_successfully'))
          } catch (error) {
            const apiError = error as ApiError
            toast.error(apiError?.data?.message || t('failed_to_delete_faqs'))
          }
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_faqs')}
      />

      <FaqModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} faq={selectedFaq} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_faq_title') || t('delete_confirmation')}
        description={t('delete_faq_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />
    </>
  )
}
