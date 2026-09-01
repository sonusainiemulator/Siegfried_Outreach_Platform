'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useFileManagement } from '@/hooks/useFileManagement'
import { useDeleteTelegramGroupsMutation, useGetTelegramGroupsQuery } from '@/redux/api/chatbotApi'
import { ApiError, TelegramGroup } from '@/types'
import { formatDate } from '@/utils'
import { Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TelegramGroupsPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, refetch } = useGetTelegramGroupsQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })
  const [deleteGroups] = useDeleteTelegramGroupsMutation()
  const { downloadFile, uploadFile } = useFileManagement()

  const groups = data?.data || []

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
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
      await deleteGroups([idToDelete]).unwrap()
      toast.success(t('groups_deleted_successfully'))
      setIdToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    } finally {
      setIsDeleting(false)
    }
  }

  const typeColors: Record<string, string> = {
    channel: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    supergroup: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    group: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  }

  const columns: Column<TelegramGroup>[] = [
    {
      header: t('chat_id'),
      accessorKey: 'chatId',
      sortable: true,
      className: 'xl1199:min-w-[150px] min-w-[120px] font-mono text-xs',
    },
    {
      header: t('title'),
      accessorKey: 'title',
      sortable: true,
      className: 'font-medium xl1199:min-w-[250px] min-w-[200px]',
    },
    {
      header: t('type'),
      accessorKey: 'type',
      sortable: true,
      cell: (g) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${typeColors[g.type] || ''}`}
        >
          {g.type}
        </span>
      ),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
    },
    {
      header: t('members'),
      accessorKey: 'memberCount',
      sortable: true,
      cell: (g) => (
        <span className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
          <Users className="w-3 h-3" /> {g.memberCount.toLocaleString()}
        </span>
      ),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
    },
    {
      header: t('created_at'),
      accessorKey: 'createdAt',
      sortable: true,
      cell: (g) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(g.createdAt)}
        </span>
      ),
      className: 'xl1199:min-w-[160px] min-w-[130px]',
    },
    {
      header: t('actions'),
      accessorKey: 'actions' as any,
      cell: (g) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-white hover:bg-destructive h-8 w-8 bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation()
            setIdToDelete(g.id)
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
        title={t('telegram_groups')}
        subtitle={t('manage_telegram_groups_desc', {
          defaultValue: 'Manage Telegram groups and channels for your broadcasts.',
        })}
        columns={columns}
        data={groups}
        totalResults={data?.total || 0}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_telegram_groups_found', { defaultValue: 'No Telegram groups found.' })}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={true}
        onBulkDelete={(rows) => {
          const ids = rows.map((r) => r.id)
          deleteGroups(ids)
            .unwrap()
            .then(() => toast.success(t('groups_deleted_successfully')))
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
        searchPlaceholder={t('search_groups', { defaultValue: 'Search groups...' })}
        onExportExcel={() =>
          downloadFile(
            '/api/telegram/groups/export',
            { format: 'xlsx', ...(debouncedSearch ? { search: debouncedSearch } : {}) },
            'telegram_groups',
          )
        }
        onExportCSV={() =>
          downloadFile(
            '/api/telegram/groups/export',
            { format: 'csv', ...(debouncedSearch ? { search: debouncedSearch } : {}) },
            'telegram_groups',
          )
        }
        onImport={async (file: File) => {
          await uploadFile('/api/telegram/groups/import', file).catch(() => {})
          refetch()
        }}
      />

      <DeleteConfirmationModal
        isOpen={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        onConfirm={handleSingleDelete}
        title={t('delete_telegram_group', { defaultValue: 'Delete Telegram Group' })}
        description={t('delete_group_warning', {
          defaultValue: 'Are you sure you want to delete this Telegram group? This action cannot be undone.',
        })}
        isLoading={isDeleting}
      />
    </>
  )
}

export default TelegramGroupsPage
