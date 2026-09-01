'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useFileManagement } from '@/hooks/useFileManagement'
import { useDeleteTelegramSubscribersMutation, useGetTelegramSubscribersQuery } from '@/redux/api/chatbotApi'
import { ApiError, TelegramSubscriber } from '@/types'
import { formatDate } from '@/utils'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TelegramSubscribersPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, refetch } = useGetTelegramSubscribersQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })
  const [deleteSubscribers] = useDeleteTelegramSubscribersMutation()
  const { downloadFile, uploadFile } = useFileManagement()

  const subscribers = data?.data || []

  const handleSort = (col: string) => {
    if (sortColumn === col) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else {
      setSortColumn(col)
      setSortOrder('asc')
    }
    setPage(1)
  }
  const [isDeleting, setIsDeleting] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleSingleDelete = async () => {
    if (!idToDelete) return
    try {
      setIsDeleting(true)
      await deleteSubscribers([idToDelete]).unwrap()
      toast.success(t('subscribers_deleted_successfully'))
      setIdToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    } finally {
      setIsDeleting(false)
    }
  }

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    blocked: 'bg-destructive/10 text-destructive border-destructive/20',
    unsubscribed: 'bg-muted text-muted-foreground border-border',
  }

  const columns: Column<TelegramSubscriber>[] = [
    {
      header: t('telegram_id'),
      accessorKey: 'telegramId',
      sortable: true,
      cell: (s) => <span className="font-mono text-xs text-muted-foreground">{s.telegramId}</span>,
      className: 'xl1199:min-w-[150px] min-w-[120px]',
    },
    {
      header: t('name'),
      accessorKey: 'name',
      sortable: true,
      cell: (s) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{[s.firstName, s.lastName].filter(Boolean).join(' ') || '-'}</span>
          {s.username && <span className="text-xs text-muted-foreground">@{s.username}</span>}
        </div>
      ),
      className: 'xl1199:min-w-[300px] min-w-[200px]',
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      cell: (s) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusColors[s.status] || ''}`}
        >
          {s.status}
        </span>
      ),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
    },
    {
      header: t('joined'),
      accessorKey: 'createdAt',
      sortable: true,
      cell: (s) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(s.createdAt)}
        </span>
      ),
      className: 'xl1199:min-w-[160px] min-w-[130px]',
    },
    {
      header: t('actions'),
      accessorKey: 'actions' as any,
      cell: (s) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-white hover:bg-destructive h-8 w-8 bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation()
            setIdToDelete(s.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
      className: 'w-[80px]',
    },
  ]

  return (
    <>
      <TableLayout
        title={t('telegram_subscribers')}
        subtitle={t('manage_telegram_subscribers_desc', {
          defaultValue: 'Manage Telegram subscribers who receive your broadcasts.',
        })}
        columns={columns}
        data={subscribers}
        totalResults={data?.total || 0}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_telegram_subscribers_found', { defaultValue: 'No Telegram subscribers found.' })}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={true}
        onBulkDelete={(rows) => {
          const ids = rows.map((r) => r.id)
          deleteSubscribers(ids)
            .unwrap()
            .then(() => toast.success(t('subscribers_deleted_successfully')))
            .catch((err) => toast.error(err?.data?.message || t('something_went_wrong')))
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_subscribers', { defaultValue: 'Search subscribers...' })}
        onExportExcel={() =>
          downloadFile(
            '/api/telegram/subscribers/export',
            { format: 'xlsx', ...(debouncedSearch ? { search: debouncedSearch } : {}) },
            'telegram_subscribers',
          )
        }
        onExportCSV={() =>
          downloadFile(
            '/api/telegram/subscribers/export',
            { format: 'csv', ...(debouncedSearch ? { search: debouncedSearch } : {}) },
            'telegram_subscribers',
          )
        }
        onImport={async (file: File) => {
          await uploadFile('/api/telegram/subscribers/import', file).catch(() => {})
          refetch()
        }}
      />

      <DeleteConfirmationModal
        isOpen={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        onConfirm={handleSingleDelete}
        title={t('delete_telegram_subscriber', { defaultValue: 'Delete Telegram Subscriber' })}
        description={t('delete_subscriber_warning', {
          defaultValue: 'Are you sure you want to delete this Telegram subscriber? This action cannot be undone.',
        })}
        isLoading={isDeleting}
      />
    </>
  )
}

export default TelegramSubscribersPage
