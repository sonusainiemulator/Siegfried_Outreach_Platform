'use client'

import RoleModal from '@/components/feature/permissions/RoleModal'
import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { cn, getAvatarColorClass } from '@/lib/utils'
import {
  useCreateRoleMutation,
  useDeleteRolesMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from '@/redux/api/roleApi'
import { ApiError } from '@/types'
import { Role } from '@/types/role'
import { formatDate } from '@/utils'
import { Pencil, Plus, Trash2, User, UserCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const RolesPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Roles', 'write')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [rolesToDelete, setRolesToDelete] = useState<string[]>([])

  const { data, isLoading } = useGetRolesQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation()
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation()
  const [deleteRoles, { isLoading: isDeleting }] = useDeleteRolesMutation()

  const handleSaveRole = async (roleData: Partial<Role>) => {
    try {
      if (selectedRole) {
        const response = await updateRole({ id: selectedRole.id, data: roleData }).unwrap()
        toast.success(response.message || t('role_updated_successfully'))
      } else {
        const response = await createRole(roleData).unwrap()
        toast.success(response.message || t('role_created_successfully'))
      }
      setIsModalOpen(false)
      setSelectedRole(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteRoles({ ids: rolesToDelete }).unwrap()
      toast.success(response.message || t('roles_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setRolesToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const columns: Column<Role>[] = [
    {
      header: t('name'),
      className: 'xl1570:min-w-[200px]',
      accessorKey: 'name',
      sortable: true,
      cell: (row: Role) => (
        <div className="flex items-center gap-3">
          <div
            className={cn('w-10 h-10 rounded-[6px] flex items-center justify-center text-3xl! font-semibold',
              getAvatarColorClass(row.name),
            )}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="font-medium text-base dark:text-white">{t(row.name)}</span>
        </div>
      ),
    },
    {
      header: t('description'),
      className: 'xl1570:min-w-[330px] max-w-[360px]',
      accessorKey: 'description',
      cell: (row: Role) => <span className="text-muted-foreground text-sm line-clamp-2 break-all whitespace-normal">{row.description || '-'}</span>,
    },
    {
      header: t('created_at'),
      className: 'xl1570:min-w-[160px]',
      accessorKey: 'created_at',
      sortable: true,
      cell: (row: Role) => (
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: t('permissions'),
      className: 'xl1570:min-w-[165px]',
      accessorKey: 'permissionCount',
      sortable: true,
      cell: (row: Role) => {
        return (
          <Badge className="gap-1.5 px-3 font-semibold rounded-full border shadow-none bg-primary/5 text-primary border-primary/10">
            {row.permissionCount || 0} {t('permissions')}
          </Badge>
        )
      },
    },
    {
      header: t('action'),
      className: 'xl1570:min-w-[145px]',
      cell: (row: Role) => {
        return (
          <div className="flex items-center gap-2">
            {canManage ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t('assign_permissions')}
                  disabled={row.system_reserved}
                  className={cn(
                    "text-primary h-8 w-8 bg-primary/10  hover:bg-primary hover:text-white",
                    row.system_reserved && "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  onClick={() => router.push(`${ROUTES.PERMISSIONS}/${row.id}/permissions`)}
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t('edit_role')}
                  disabled={row.system_reserved}
                  className={cn(
                    "h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color",
                    row.system_reserved && "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  onClick={() => {
                    setSelectedRole(row)
                    setIsModalOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t('delete_role')}
                  disabled={row.system_reserved || row.name === 'super_admin'}
                  className={cn(
                    "text-destructive h-8 w-8  bg-destructive/10  hover:bg-destructive hover:text-white",
                    (row.system_reserved || row.name === 'super_admin') && "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  onClick={() => {
                    setRolesToDelete([row.id])
                    setIsDeleteModalOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground italic px-2">{t('view_only')}</span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="space-y-8">
        <TableLayout
          title={t('roles_management')}
          subtitle={t('manage_user_roles_and_permissions')}
          primaryAction={
            canManage
              ? {
                label: t('add_role'),
                onClick: () => {
                  setSelectedRole(null)
                  setIsModalOpen(true)
                },
                icon: <Plus className="w-5 h-5" />,
                className: 'btn-color text-white',
              }
              : undefined
          }
          columns={columns}
          data={data?.roles || []}
          totalResults={data?.total || 0}
          currentPage={page}
          totalPages={data?.totalPages || 0}
          onPageChange={setPage}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          onSort={(col) => {
            if (sortColumn === col) {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            } else {
              setSortColumn(col)
              setSortOrder('asc')
            }
          }}
          enableSelection={canManage}
          onBulkDelete={(rows) => {
            const ids = rows.filter((r) => !r.system_reserved && r.name !== 'super_admin').map((r) => r.id)
            if (ids.length > 0) {
              deleteRoles({ ids })
                .unwrap()
                .then((res) => toast.success(res.message || t('roles_deleted_successfully')))
                .catch((err) => toast.error(err?.data?.message || t('something_went_wrong')))
            } else {
              toast.error(t('cannot_delete_system_reserved_roles'))
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
          searchPlaceholder={t('search_roles')}
        />

        <RoleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedRole(null)
          }}
          onSave={handleSaveRole}
          role={selectedRole}
          isLoading={isCreating || isUpdating}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setRolesToDelete([])
          }}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title={t('delete_role_title')}
          description={t('delete_role_description')}
        />
      </div>
    </>
  )
}

export default RolesPage
