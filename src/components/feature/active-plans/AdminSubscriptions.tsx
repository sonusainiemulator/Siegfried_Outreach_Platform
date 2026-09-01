'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import { subscriptionStatus } from '@/data/subscription'
import { useAppDirection } from '@/hooks/useAppDirection'
import {
  useApproveOfflineSubscriptionMutation,
  useDeleteSubscriptionsMutation,
  useGetAllSubscriptionsQuery,
  useRejectOfflineSubscriptionMutation,
} from '@/redux/api/subscriptionApi'
import { Column, Subscription } from '@/types'
import { formatDate } from '@/utils'
import { downloadExport } from '@/utils/exportUtils'
import { Check, CreditCard, Filter, User as UserIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { StatusBadge } from './StatusBadge'

const AdminSubscriptions = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const direction = useAppDirection()

  const { data: subscriptionsData, isLoading } = useGetAllSubscriptionsQuery({
    page,
    limit,
    search,
    status: statusFilter,
  })

  const [deleteSubscriptions] = useDeleteSubscriptionsMutation()
  const [approveOffline, { isLoading: isApproving }] = useApproveOfflineSubscriptionMutation()
  const [rejectOffline, { isLoading: isRejecting }] = useRejectOfflineSubscriptionMutation()

  const subscriptions = subscriptionsData?.data || []
  const pagination = subscriptionsData?.pagination

  const handleApprove = async (id: string) => {
    try {
      await approveOffline(id).unwrap()
      toast.success('Offline subscription approved successfully!')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve subscription')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectOffline(id).unwrap()
      toast.success('Offline subscription request rejected.')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reject subscription')
    }
  }

  const columns: Column<Subscription>[] = [
    {
      header: t('user'),
      className: 'xl1199:min-w-[220px] min-w-[180px]',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary dark:bg-light-button flex items-center justify-center">
            {row.user?.avatar ? (
              <Image src={row.user.avatar} alt={row.user.name} width={40} height={40} unoptimized className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="lucide lucide-package w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate">{row.user?.name || t('unknown_user')}</span>
            {row.user?.email ? <CopyEmailCell email={row.user.email} /> : null}
          </div>
        </div>
      ),
    },
    {
      header: t('plan'),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
      cell: (row: any) => (
        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold whitespace-nowrap">
          {row.plan?.name || t('unknown_plan')}
        </Badge>
      ),
    },
    {
      header: t('amount'),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
      cell: (row: Subscription) => (
        <div className="font-bold text-sm whitespace-nowrap">
          ${row.total_amount || row.amount}{' '}
          <span className="text-muted-foreground text-[10px] font-medium uppercase">/ {row.billing_cycle}</span>
        </div>
      ),
    },
    {
      header: t('status'),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
      cell: (row: Subscription) => <StatusBadge status={row.status} />,
    },
    {
      header: t('gateway'),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
      cell: (row: Subscription) => (
        <div className="flex items-center gap-2 capitalize text-sm font-medium whitespace-nowrap">
          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
          {row.payment_gateway}
        </div>
      ),
    },
    {
      header: 'Reference & Actions',
      className: 'xl1199:min-w-[200px] min-w-[160px]',
      cell: (row: any) => (
        <div className="flex flex-col gap-1.5 py-1">
          {row.offline_payment_reference && (
            <span className="font-mono text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit" title={row.offline_payment_notes || 'Offline reference'}>
              Ref: {row.offline_payment_reference}
            </span>
          )}
          {row.status === 'pending_approval' && (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                disabled={isApproving || isRejecting}
                onClick={() => handleApprove(row.id || row._id)}
                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px]"
              >
                <Check className="w-3 h-3 mr-1" /> Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={isApproving || isRejecting}
                onClick={() => handleReject(row.id || row._id)}
                className="h-7 px-2.5 font-bold text-xs rounded-[6px]"
              >
                <X className="w-3 h-3 mr-1" /> Reject
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      header: t('next_billing'),
      className: 'xl1199:min-w-[140px] min-w-[120px]',
      cell: (row: Subscription) => (
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
          {formatDate(row.current_period_end)}
        </div>
      ),
    },
  ]

  return (
    <TableLayout
      title={t('subscriptions')}
      subtitle={t('manage_user_subscriptions')}
      endContent={
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:h-12 h-10 px-4 btn-color text-white p-button-padding rounded-[8px]">
              <Filter className="w-4 h-4" />
              {statusFilter ? t(statusFilter) : t('all_status')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-[8px] bg-white dark:bg-modal-bg-color">
            {subscriptionStatus.map((s) => {
              const isActive = statusFilter === s
              return (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`cursor-pointer rounded-md ${
                    isActive
                      ? 'bg-primary text-white focus:bg-primary focus:text-white rounded-[8px]'
                      : 'rounded-[8px]'
                  }`}
                >
                  {s ? t(s) : t('all_status')}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      }
      columns={columns}
      data={subscriptions}
      currentPage={page}
      totalPages={pagination?.total_pages || 0}
      onPageChange={setPage}
      isLoading={isLoading}
      enableSelection={true}
      onBulkDelete={(rows) => {
        const ids = rows.map((r) => r.id)
        deleteSubscriptions(ids)
          .unwrap()
          .then(() => toast.success(t('subscriptions_deleted_successfully')))
          .catch((err) => toast.error(err?.data?.message || t('something_went_wrong')))
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
        downloadExport('/api/subscription/export', 'excel', 'subscriptions', {
          ...(search ? { search } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        })
      }
      onExportCSV={() =>
        downloadExport('/api/subscription/export', 'csv', 'subscriptions', {
          ...(search ? { search } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        })
      }
    />
  )
}

export default AdminSubscriptions
