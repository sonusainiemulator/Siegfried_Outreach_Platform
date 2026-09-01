'use client'

import { MemberManagementModal } from '@/components/feature/members/MemberManagementModal'
import { SendCustomPushModal } from '@/components/feature/members/SendCustomPushModal'
import { ImpersonateConfirmationModal } from '@/components/feature/members/ImpersonateConfirmationModal'
import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { StatusSwitch } from '@/components/reusable/StatusSwitch'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { useFileManagement } from '@/hooks/useFileManagement'
import { usePermission } from '@/hooks/usePermission'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useDeleteUsersMutation, useGetUsersQuery, useUpdateUserStatusMutation, useLoginAsUserMutation } from '@/redux/api/userApi'
import { ApiError, Column, User } from '@/types'
import { formatDate, getMediaUrl, authUtils } from '@/utils'
import { Pencil, Plus, Trash2, LogIn, Bell, Coins, Package, Shield } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAppDispatch } from '@/redux/hooks'
import { baseApi } from '@/redux/api/baseApi'
import { setAuth } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'


export default function UsersPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Members', 'write')
  const { user: currentUser } = useSelector((state: RootState) => state.auth)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, refetch } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const [deleteUsers, { isLoading: isDeleting }] = useDeleteUsersMutation()
  const [updateUserStatus] = useUpdateUserStatusMutation()
  const [loginAsUser] = useLoginAsUserMutation()
  const dispatch = useAppDispatch()

  const [userToImpersonate, setUserToImpersonate] = useState<User | null>(null)
  const [isImpersonatingLoading, setIsImpersonatingLoading] = useState(false)
  const [isPushModalOpen, setIsPushModalOpen] = useState(false)

  const handleConfirmImpersonate = async () => {
    if (!userToImpersonate) return
    setIsImpersonatingLoading(true)
    try {
      const currentToken = authUtils.getToken()
      if (currentToken && currentUser) {
        authUtils.setOriginalAdmin(currentToken, currentUser)
      }
      const res = await loginAsUser(userToImpersonate.id).unwrap()
      authUtils.setToken(res.token)
      authUtils.setUser(res.user)
      dispatch(
        setAuth({
          token: res.token,
          user: res.user,
          isImpersonating: true,
          originalAdmin: currentUser,
          originalAdminToken: currentToken,
        }),
      )
      dispatch(baseApi.util.resetApiState())
      toast.success(res.message || t('login_successful'))
      setUserToImpersonate(null)
      window.location.href = '/dashboard'
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_impersonate_user'))
    } finally {
      setIsImpersonatingLoading(false)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const { downloadFile, downloadTemplate, uploadFile } = useFileManagement()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteUsers([idToDelete]).unwrap()
      toast.success(res.message || t('user_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_user'))
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await deleteUsers(ids).unwrap()
      toast.success(res.message || t('users_deleted_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_users'))
    }
  }

  const handleStatusChange = React.useCallback(
    async (id: string, currentStatus: boolean) => {
      try {
        const res = await updateUserStatus({ id, status: !currentStatus }).unwrap()
        toast.success(res.message || t(!currentStatus ? 'user_activated' : 'user_deactivated'))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('failed_to_update_status'))
      }
    },
    [updateUserStatus, t],
  )

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const columns: Column<User>[] = [
    {
      header: t('member'),
      className: 'xl1199:min-w-[300px] min-w-[200px]',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getMediaUrl(row.avatar)} />
            <AvatarFallback className={cn('text-xs font-semibold', getAvatarColorClass(row.name))}>
              {row.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-base text-text-color dark:text-white">{row.name}</span>
            <CopyEmailCell email={row.email} />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: t('role'),
      className: 'xl1199:min-w-[175px]',
      accessorKey: 'role',
      sortable: true,
      cell: (row) => {
        if (!row.role) return 'N/A';

        const role = row.role.toLowerCase();
        let styles = 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700';
        let dotColor = 'bg-gray-500';

        if (role.includes('admin')) {
          styles = 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
          dotColor = 'bg-purple-500';
        } else if (role.includes('assigner')) {
          styles = 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
          dotColor = 'bg-emerald-500';
        } else if (role.includes('user')) {
          styles = 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
          dotColor = 'bg-blue-500';
        }

        return (
          <Badge className={cn('gap-1.5 px-3 font-semibold rounded-full border shadow-none capitalize', styles)}>
            {t(row.role)}
          </Badge>
        );
      },
    },
    {
      header: 'AI Credits & Last Request',
      className: 'xl1199:min-w-[240px]',
      cell: (row: any) => {
        const lastReq = row.lastCreditRequest;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold font-mono text-sm text-foreground">
              <Coins className="w-4 h-4 text-amber-500" />
              {(row.creditBalance || 0).toLocaleString()} Credits
            </div>
            {lastReq ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Last: ₹{lastReq.amount}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[9px] font-bold px-1.5 py-0 uppercase',
                    lastReq.status === 'completed'
                      ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                      : lastReq.status === 'pending_approval'
                      ? 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 animate-pulse'
                      : 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/5'
                  )}
                >
                  {lastReq.status === 'pending_approval' ? 'Pending' : lastReq.status}
                </Badge>
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground italic">No recharge requests</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Plan',
      className: 'xl1199:min-w-[130px]',
      cell: (row: any) => {
        const plan = row.activePlan?.planName || 'Free';
        return (
          <Badge
            variant="outline"
            className="text-xs font-semibold uppercase tracking-wider border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5"
          >
            {plan}
          </Badge>
        );
      },
    },
    {
      header: t('status'),
      className: 'xl1199:min-w-[135px]',
      accessorKey: 'isActive',
      sortable: true,
      cell: (row) => (
        <StatusSwitch
          isActive={row.isActive}
          canManage={canManage}
          onToggle={() => handleStatusChange(row.id, row.isActive)}
        />
      ),
    },
    {
      header: t('last_login'),
      className: 'xl1199:min-w-[187px]',
      accessorKey: 'lastLogin',
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground text-sm">{row.lastLogin ? formatDate(row.lastLogin) : t('never')}</span>
      ),
    },
    {
      header: t('actions'),
      className: 'xl1199:min-w-[175px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canManage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className=" h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit  hover:bg-edit-color cursor-pointer"
                onClick={() => handleEdit(row)}
                title="Manage Member Hub"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white cursor-pointer"
                onClick={() => handleDelete(row.id)}
                title={t('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {currentUser?.id !== row.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-primary/10 hover:bg-primary hover:text-white text-primary transition-colors cursor-pointer"
                  onClick={() => setUserToImpersonate(row)}
                  title={t('login_as_member') || 'Login As Member'}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic px-2">{t('view_only')}</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <TableLayout
        title={t('members')}
        subtitle="Manage member accounts, credit balances, offline recharge proofs, and administrative actions."
        primaryAction={
          canManage
            ? {
              label: t('create_member'),
              onClick: handleCreate,
              icon: <Plus className="h-4 w-4" strokeWidth={3} />,
              className: 'btn-color',
            }
            : undefined
        }
        endContent={
          canManage ? (
            <Button
              onClick={() => setIsPushModalOpen(true)}
              className="sm:h-12 h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-[8px] flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              Send Push Notification
            </Button>
          ) : undefined
        }
        columns={columns}
        data={data?.users || []}
        totalResults={data?.total || 0}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_users_found')}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onBulkDelete={(rows) => {
          const ids = rows.map((r) => r.id)
          handleBulkDelete(ids)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_members')}
        onExportExcel={() =>
          downloadFile('/api/user/export', { format: 'excel', ...(search ? { search } : {}) }, 'users')
        }
        onExportCSV={() => downloadFile('/api/user/export', { format: 'csv', ...(search ? { search } : {}) }, 'users')}
        onImport={async (file) => {
          await uploadFile('/api/user/import', file).catch(() => { })
          refetch()
        }}
        onDownloadTemplate={() => downloadTemplate('/api/user/export-template', 'excel', 'users_template')}
      />

      <MemberManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          refetch()
        }}
        user={selectedUser}
        onImpersonate={(u) => setUserToImpersonate(u)}
      />

      <SendCustomPushModal isOpen={isPushModalOpen} onClose={() => setIsPushModalOpen(false)} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_user_title') || t('delete_confirmation')}
        description={t('delete_user_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />

      <ImpersonateConfirmationModal
        isOpen={!!userToImpersonate}
        onClose={() => setUserToImpersonate(null)}
        onConfirm={handleConfirmImpersonate}
        user={userToImpersonate}
        isLoading={isImpersonatingLoading}
      />
    </>
  )
}
