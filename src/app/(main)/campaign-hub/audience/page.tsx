'use client'

import { SegmentCount } from '@/components/feature/segment/SegmentCount'
import { SegmentModal } from '@/components/feature/segment/SegmentModal'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useDeleteSegmentsMutation, useGetSegmentsQuery } from '@/redux/api/segmentApi'
import { ApiError, Segment } from '@/types'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const SegmentPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idsToDelete, setIdsToDelete] = useState<string[]>([])

  const { data, isLoading } = useGetSegmentsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sortColumn,
    sortOrder,
  })
  const [deleteSegments, { isLoading: isDeleting }] = useDeleteSegmentsMutation()

  const handleEdit = (segment: Segment) => {
    setSelectedSegment(segment)
    setIsModalOpen(true)
  }

  const handleDelete = (ids: string[]) => {
    setIdsToDelete(ids)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await deleteSegments(idsToDelete).unwrap()
      toast.success(res.message || t('segment_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleBulkDelete = async (selectedRows: Segment[]) => {
    const ids = selectedRows.map((r) => r.id)
    handleDelete(ids)
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

  const columns: Column<Segment>[] = [
    {
      header: t('name'),
      accessorKey: 'name',
      sortable: true,
      cell: (segment) => (
        <div>
          <p className="font-medium text-foreground">{segment.name}</p>
          {segment.description && (
            <p className="text-xs text-muted-foreground truncate max-w-75">{segment.description}</p>
          )}
        </div>
      ),
      className: 'xl1199:min-w-[300px] min-w-[200px]',
    },
    {
      header: t('contacts'),
      accessorKey: 'count',
      cell: (segment) => (
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full border border-primary/20">
          <SegmentCount conditions={segment.conditions} /> {t('contacts')}
        </span>
      ),
      className: 'xl1199:min-w-[180px] min-w-[150px]',
    },
    {
      header: t('actions'),
      cell: (segment) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-edit h-8 w-8 bg-edit-color/10 hover:text-white hover:bg-edit-color"
            onClick={() => handleEdit(segment)}
            title={t('edit')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white"
            onClick={() => handleDelete([segment.id])}
            title={t('delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'xl1199:min-w-[150px] min-w-[120px]',
    },
  ]

  return (
    <>
      <TableLayout
        title={t('audiences')}
        subtitle={t('manage_audiences')}
        primaryAction={{
          label: t('create'),
          onClick: () => {
            setSelectedSegment(null)
            setIsModalOpen(true)
          },
          icon: <Plus className="w-4 h-4" strokeWidth={3} />,
        }}
        columns={columns}
        data={data?.segments || []}
        totalResults={data?.totalSegments || 0}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        isLoading={isLoading}
        emptyMessage={t('no_results')}
        enableSelection={true}
        onBulkDelete={handleBulkDelete}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_audiences')}
      />

      <SegmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} segment={selectedSegment} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_confirmation')}
        description={t('delete_confirmation_message')}
        isLoading={isDeleting}
      />
    </>
  )
}

export default SegmentPage
