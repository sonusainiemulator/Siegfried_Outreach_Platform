'use client'

import { InquiryDetailModal } from '@/components/feature/inquiries/InquiryDetailModal'
import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import {
  useDeleteContactInquiriesMutation,
  useGetContactInquiriesQuery,
} from '@/redux/api/contactInquiryApi'
import { ApiError, ContactInquiry } from '@/types'
import { formatDate } from '@/utils'
import { Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function ContactInquiryPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Inquiries', 'write')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading } = useGetContactInquiriesQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const [deleteInquiries, { isLoading: isDeleting }] = useDeleteContactInquiriesMutation()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)
  const [viewInquiryId, setViewInquiryId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteInquiries([idToDelete]).unwrap()
      toast.success(res.message || t('contact_inquiry_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_inquiry'))
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

  const columns: Column<ContactInquiry>[] = [
    {
      header: t('name'),
      accessorKey: 'name',
      className: 'font-medium xl1199:min-w-[150px] min-w-[120px]',
      sortable: true,
    },
    {
      header: t('email'),
      accessorKey: 'email',
      className: 'xl1199:min-w-[200px] min-w-[150px]',
      sortable: true,
      cell: (row) => <CopyEmailCell email={row.email} />,
    },
    {
      header: t('subject'),
      accessorKey: 'subject',
      className: 'xl1199:min-w-[180px] min-w-[150px]',
      sortable: true,
    },
    {
      header: t('message'),
      className: 'xl1199:min-w-[250px] min-w-[200px]',
      accessorKey: 'message',
      cell: (row) => (
        <span className="line-clamp-2 text-muted-foreground whitespace-normal break-words" title={row.message}>
          {row.message}
        </span>
      ),
    },
    {
      header: t('last_updated'),
      accessorKey: 'created_at',
      className: 'xl1199:min-w-[160px] min-w-[130px]',
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      header: t('actions'),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary bg-primary/10 hover:bg-primary hover:text-white"
            onClick={() => setViewInquiryId(row.id)}
            title={t('view')}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {canManage ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive bg-destructive/10 hover:bg-destructive hover:text-white"
              onClick={() => handleDelete(row.id)}
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground italic px-2">{t('view_only')}</span>
          )}
        </div>
      ),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
    },
  ]

  return (
    <>
      <TableLayout
        title={t('contact_inquiry_title')}
        subtitle={t('contact_inquiry_desc')}
        columns={columns}
        data={data?.inquiries || []}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_inquiries_found')}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onBulkDelete={async (rows) => {
          const ids = rows.map((r) => r.id)
          try {
            const res = await deleteInquiries(ids).unwrap()
            toast.success(res.message || t('inquiries_deleted_successfully'))
          } catch (error) {
            const apiError = error as ApiError
            toast.error(apiError?.data?.message || t('failed_to_delete_inquiries'))
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
        searchPlaceholder={t('search_inquiries')}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_inquiry_title') || t('delete_confirmation')}
        description={t('delete_inquiry_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />

      <InquiryDetailModal
        isOpen={!!viewInquiryId}
        inquiryId={viewInquiryId}
        onClose={() => setViewInquiryId(null)}
      />
    </>
  )
}
