'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { useFileManagement } from '@/hooks/useFileManagement'
import { cn } from '@/lib/utils'
import { useGetAllPaymentsQuery } from '@/redux/api/subscriptionApi'
import { Column } from '@/types'
import { formatDate } from '@/utils'
import { CreditCard, Filter, Hash, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const AdminPayments = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { downloadFile } = useFileManagement()
  const direction = useAppDirection()

  const { data: paymentsData, isLoading } = useGetAllPaymentsQuery({
    page,
    limit,
    search,
    status: statusFilter,
  })

  const payments = paymentsData?.data || []
  const pagination = paymentsData?.pagination

  const columns: Column<any>[] = [
    {
      header: t('invoice_id'),
      className: 'xl1199:min-w-[180px] min-w-[150px]',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-xs truncate">{row.invoice_id || '—'}</span>
        </div>
      ),
    },
    {
      header: t('user'),
      className: 'xl1199:min-w-[220px] min-w-[180px]',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {row.user?.avatar ? (
              <Image src={row.user.avatar} alt={row.user.name} width={100} height={100} unoptimized className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4 text-primary" />
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
          {row.plan_id?.name || row.plan?.name || t('plan')}
        </Badge>
      ),
    },
    {
      header: t('amount'),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
      cell: (row: any) => (
        <div className="font-bold text-sm whitespace-nowrap">
          {row.currency === 'INR' ? '₹' : '$'}
          {row.total_amount || row.amount}
        </div>
      ),
    },
    {
      header: t('status'),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
      cell: (row: any) => {
        const status = row.status?.toLowerCase()
        let styles = 'bg-gray-100 text-gray-700 border-gray-200';
        let dotColor = 'bg-gray-500';

        if (status === 'completed' || status === 'succeeded' || status === 'success') {
          styles = 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
          dotColor = 'bg-emerald-500';
        } else if (status === 'pending') {
          styles = 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
          dotColor = 'bg-amber-500';
        } else if (status === 'failed' || status === 'cancelled') {
          styles = 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
          dotColor = 'bg-rose-500';
        }

        return (
          <Badge className={cn('gap-1.5 px-3 font-semibold rounded-full border shadow-none capitalize', styles)}>
            {row.status}
          </Badge>
        )
      },
    },
    {
      header: t('gateway'),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
      cell: (row: any) => (
        <div className="flex items-center gap-2 capitalize text-sm font-medium whitespace-nowrap">
          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
          {row.payment_gateway}
        </div>
      ),
    },
    {
      header: t('date'),
      className: 'xl1199:min-w-[140px] min-w-[120px]',
      cell: (row: any) => (
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
          {formatDate(row.created_at)}
        </div>
      ),
    },
  ]

  return (
    <React.Fragment>
      <TableLayout
        title={t('payment_history')}
        subtitle={t('manage_transaction_history')}
        endContent={
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="sm:h-12 h-10 px-4 btn-color text-white p-button-padding rounded-[8px]">
                <Filter className="w-4 h-4" />
                {statusFilter ? t(statusFilter) : t('all_status')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-[8px] bg-white dark:bg-modal-bg-color">
              {['', 'completed', 'pending', 'failed'].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
                  {s ? t(s) : t('all_status')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
        columns={columns}
        data={payments}
        totalResults={pagination?.total || 0}
        currentPage={page}
        totalPages={pagination?.total_pages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_transactions')}
        onExportExcel={() =>
          downloadFile(
            '/api/subscription/payments/export',
            {
              format: 'xlsx',
              ...(search ? { search } : {}),
              ...(statusFilter ? { status: statusFilter } : {}),
            },
            'payments',
          )
        }
        onExportCSV={() =>
          downloadFile(
            '/api/subscription/payments/export',
            {
              format: 'csv',
              ...(search ? { search } : {}),
              ...(statusFilter ? { status: statusFilter } : {}),
            },
            'payments',
          )
        }
      />
    </React.Fragment>
  )
}

export default AdminPayments
