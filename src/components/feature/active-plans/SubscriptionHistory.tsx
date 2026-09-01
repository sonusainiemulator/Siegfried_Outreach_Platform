'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { Button } from '@/components/ui/button'
import { subscription_history_filters } from '@/data/subscription'
import { cn } from '@/lib/utils'
import { HistoryRow, SubscriptionHistoryProps } from '@/types'
import { formatDate } from '@/utils'
import { HistoryStatusBadge } from './StatusBadge'

const SubscriptionHistory = ({
  filteredHistory,
  historyFilter,
  setHistoryFilter,
  sub,
  t,
}: SubscriptionHistoryProps) => {
  const columns: Column<HistoryRow>[] = [
    {
      header: t('plan'),
      accessorKey: 'plan',
      className: 'font-semibold text-foreground truncate max-w-[200px] min-w-[150px]',
    },
    {
      header: t('members'),
      accessorKey: 'members',
      className: 'text-muted-foreground min-w-[100px]',
    },
    {
      header: t('billing_cycle'),
      accessorKey: 'billing_cycle',
      className: 'text-muted-foreground capitalize min-w-[120px]',
      cell: (row) => t(row.billing_cycle),
    },
    {
      header: t('amount'),
      accessorKey: 'amount',
      className: 'font-semibold text-foreground whitespace-nowrap min-w-[100px]',
      cell: (row) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: t('status'),
      accessorKey: 'status',
      className: 'min-w-[130px]',
      cell: (row) => <HistoryStatusBadge status={row.status} isCanceled={row.cancel_at_period_end} />,
    },
    {
      header: t('subscription_date'),
      accessorKey: 'subscription_date',
      className: 'text-muted-foreground whitespace-nowrap min-w-[150px]',
      cell: (row) => formatDate(row.subscription_date),
    },
    {
      header: t('expiry_date'),
      accessorKey: 'expiry_date',
      className: 'text-muted-foreground whitespace-nowrap min-w-[150px]',
      cell: (row) => formatDate(row.expiry_date),
    },
  ]

  return (
    <div className=" rounded-border-radius glass-card glass-dark-card   overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <h2 className="text-xl font-medium text-title-color dark:text-white">{t('subscription_history')}</h2>
        <p className="text-sm text-subtitle-color mt-0.5">{t('past_subscriptions')}</p>
      </div>

      <div className="px-6 pt-4 pb-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground mr-1">{t('filter_by_status')}</span>
        {subscription_history_filters.map((f) => (
          <Button
            key={f}
            onClick={() => setHistoryFilter(f as any)}
            className={cn(
              'px-4 py-1 rounded-full text-xs w-auto min-w-20 font-bold border transition-all',
              historyFilter === f
                ? 'bg-primary! text-primary-foreground border-primary'
                : ' border-border text-subtitle-color',
            )}
          >
            {t(f)}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredHistory}
        emptyMessage={t('no_subscription_history')}
        isLoading={false}
      />
    </div>
  )
}

export default SubscriptionHistory
