'use client'

import { ContactGroupModal } from '@/components/feature/contact-group/ContactGroupModal'
import { ManageContactGroupModal } from '@/components/feature/contact-group/ManageContactListModal'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useDeleteContactGroupsMutation, useGetContactGroupsQuery } from '@/redux/api/contactGroupApi'
import { ApiError, ContactGroup } from '@/types'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ContactListPage = () => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as 'email' | 'whatsapp') || undefined
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [selectedList, setSelectedList] = useState<ContactGroup | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idsToDelete, setIdsToDelete] = useState<string[]>([])

  const { data, isLoading } = useGetContactGroupsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sortColumn,
    sortOrder,
    type,
  })
  const [deleteLists, { isLoading: isDeleting }] = useDeleteContactGroupsMutation()

  const handleEdit = (list: ContactGroup) => {
    setSelectedList(list)
    setIsModalOpen(true)
  }

  const handleDelete = (ids: string[]) => {
    setIdsToDelete(ids)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await deleteLists(idsToDelete).unwrap()
      toast.success(res.message || t('contact_group_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleBulkDelete = async (selectedRows: ContactGroup[]) => {
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

  // Derive titles based on type
  const pageTitle =
    type === 'email'
      ? t('email_contact_groups', { defaultValue: 'Email Contact Groups' })
      : type === 'whatsapp'
        ? t('whatsapp_contact_groups', { defaultValue: 'WhatsApp Contact Groups' })
        : t('contact_groups')

  const pageDesc =
    type === 'email'
      ? t('manage_email_contact_groups', { defaultValue: 'Manage your email contact groups' })
      : type === 'whatsapp'
        ? t('manage_whatsapp_contact_groups', { defaultValue: 'Manage your WhatsApp contact groups' })
        : t('manage_contact_groups')

  const columns: Column<ContactGroup>[] = [
    {
      header: t('name'),
      className: 'xl1199:min-w-[300px] min-w-[200px]',
      accessorKey: 'name',
      sortable: true,
      cell: (list) => (
        <div>
          <p className="font-medium text-foreground">{list.name}</p>
          {list.description && (
            <p className="text-xs text-muted-foreground truncate max-w-[300px]">{list.description}</p>
          )}
        </div>
      ),
    },
    {
      header: t('contacts'),
      className: 'xl1199:min-w-[180px] min-w-[150px]',
      accessorKey: 'count',
      sortable: true,
      cell: (list) => (
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full border border-primary/20">
          {list.count} {t('contacts')}
        </span>
      ),
    },
    {
      header: t('actions'),
      className: 'xl1199:min-w-[200px] min-w-[150px]',
      cell: (list) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
            onClick={() => handleEdit(list)}
            title={t('edit')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive h-8 w-8 bg-destructive/10  hover:bg-destructive hover:text-white "
            onClick={() => handleDelete([list.id])}
            title={t('delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <TableLayout
        title={t(pageTitle)}
        subtitle={t(pageDesc)}
        primaryAction={{
          label: t('create'),
          onClick: () => {
            setSelectedList(null)
            setIsModalOpen(true)
          },
          icon: <Plus className="w-4 h-4" strokeWidth={3} />,
        }}
        columns={columns}
        data={data?.lists || []}
        totalResults={data?.totalLists || 0}
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
        searchPlaceholder={t('search_contact_groups')}
      />

      <ContactGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} list={selectedList} type={type} />

      <ManageContactGroupModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        list={selectedList}
      />

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

export default ContactListPage
