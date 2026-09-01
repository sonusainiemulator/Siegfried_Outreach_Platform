'use client'

import { ContactModal } from '@/components/feature/contacts/ContactModal'
import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useFileManagement } from '@/hooks/useFileManagement'
import { usePermission } from '@/hooks/usePermission'
import { getAvatarColorClass } from '@/lib/utils'
import { useDeleteContactsMutation, useGetContactsQuery } from '@/redux/api/contactApi'
import { ApiError, Contact } from '@/types'
import { formatDate } from '@/utils'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ContactsPage = () => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as 'email' | 'whatsapp') || undefined
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Contacts', 'write')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idsToDelete, setIdsToDelete] = useState<string[]>([])
  const { downloadFile, downloadTemplate, uploadFile } = useFileManagement()

  const { data, isLoading, refetch } = useGetContactsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy: sortColumn,
    sortOrder,
    type,
  })

  const [deleteContacts, { isLoading: isDeleting }] = useDeleteContactsMutation()

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleDelete = (ids: string[]) => {
    setIdsToDelete(ids)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await deleteContacts(idsToDelete).unwrap()
      toast.success(res.message || t('status_updated_successfully'))
      setIsDeleteModalOpen(false)
      setIdsToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleBulkDelete = async (selectedRows: Contact[]) => {
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
  const pageTitle = type === 'email'
    ? t('email_contacts', { defaultValue: 'Email Contacts' })
    : type === 'whatsapp'
      ? t('whatsapp_contacts', { defaultValue: 'WhatsApp Contacts' })
      : t('contacts')

  const pageDesc = type === 'email'
    ? t('manage_email_contacts', { defaultValue: 'Manage your email contacts' })
    : type === 'whatsapp'
      ? t('manage_whatsapp_contacts')
      : t('manage_contacts')

  const columns: Column<Contact>[] = [
    {
      header: t('name'),
      className: 'xl1199:min-w-[270px] min-w-[200px]',
      accessorKey: 'name' as keyof Contact,
      sortable: true,
      cell: (contact) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-bold text-xs uppercase ${getAvatarColorClass(contact.name)}`}>
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{contact.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: type === 'whatsapp' ? t('phone') : t('email'),
      className: 'xl1199:min-w-[200px] min-w-[150px]',
      accessorKey: (type === 'whatsapp' ? 'phone' : 'email') as keyof Contact,
      sortable: true,
      cell: (contact) => {
        if (type === 'whatsapp') {
          return <span>{contact.phone ? `+${contact.phone}` : '-'}</span>
        }
        return <CopyEmailCell email={contact.email ?? ''} />
      },
    },
    ...(type === 'whatsapp'
      ? [
          {
            header: t('created_at'),
            className: 'xl1199:min-w-[180px] min-w-[150px]',
            accessorKey: 'createdAt' as keyof Contact,
            sortable: true,
            cell: (contact: Contact) => <span>{formatDate(contact.createdAt)}</span>,
          },
        ]
      : [
          {
            header: t('tags'),
            className: 'xl1199:min-w-[220px] min-w-[180px]',
            accessorKey: 'tags' as keyof Contact,
            cell: (contact: Contact) => (
              <div className="flex flex-wrap gap-1">
                {contact.tags && contact.tags.length > 0 ? (
                  contact.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-muted text-[11px] rounded-full border border-border">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs italic">{t('no_tags', { defaultValue: '-' })}</span>
                )}
              </div>
            ),
          },
        ]),
    {
      header: t('actions'),
      cell: (contact) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
                onClick={() => handleEdit(contact)}
                title={t('edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className=" text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white"
                onClick={() => handleDelete([contact.id])}
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
      className: 'xl1199:min-w-[150px] min-w-[120px]',
    },
  ]

  return (
    <>
      <TableLayout
        title={t(pageTitle)}
        subtitle={t(pageDesc)}
        primaryAction={
          canManage
            ? {
                label: t('create'),
                onClick: () => {
                  setSelectedContact(null)
                  setIsModalOpen(true)
                },
                icon: <Plus className="w-4 h-4" strokeWidth={3}/>,
              }
            : undefined
        }
        columns={columns}
        data={data?.contacts || []}
        totalResults={data?.totalContacts || 0}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        isLoading={isLoading}
        emptyMessage={t('no_results')}
        enableSelection={canManage}
        onBulkDelete={handleBulkDelete}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_contacts')}
        onExportExcel={() =>
          downloadFile(
            '/api/contact/export',
            {
              format: 'xlsx',
              ...(debouncedSearch ? { search: debouncedSearch } : {}),
              ...(type ? { type } : {}),
            },
            'contacts',
          )
        }
        onExportCSV={() =>
          downloadFile(
            '/api/contact/export',
            {
              format: 'csv',
              ...(debouncedSearch ? { search: debouncedSearch } : {}),
              ...(type ? { type } : {}),
            },
            'contacts',
          )
        }
        onImport={async (file: File) => {
          await uploadFile(`/api/contact/import${type ? `?type=${type}` : ''}`, file).catch(() => {})
          refetch()
        }}
        onDownloadTemplate={() => downloadTemplate('/api/contact/import-template', type, 'contacts_template')}
      />

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} contact={selectedContact} type={type} />

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

export default ContactsPage
