'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserSubscriptionOverviewProps } from '@/types'
import { formatDate } from '@/utils'
import { AlertCircle, Ban, Calendar, Clock, Wallet } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

const UserSubscriptionOverview = ({
  sub,
  amountPaid,
  daysRemaining,
  isCancelDialogOpen,
  setIsCancelDialogOpen,
  handleCancel,
  isCancelling,
  t,
}: UserSubscriptionOverviewProps) => {
  if (!sub) return null

  // Safely extract the plan object if it's populated
  const plan = typeof sub.plan_id === 'object' ? sub.plan_id : null

  return (
    <div className=" rounded-border-radius glass-card glass-dark-card border border-border overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <h2 className="text-xl font-medium text-title-colo dark:text-white">{t('current_subscription')}</h2>
        <p className="text-sm text-subtitle-color mt-0.5">{t('active_subscription_details')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-border">
        <div className="p-5 space-y-1.5">
          <p className="text-xs text-muted-foreground font-bold">{t('plan_name')}</p>
          <p className="text-base font-medium text-foreground truncate" title={plan?.name}>
            {plan?.name || '—'}
          </p>
        </div>

        <div className="p-5 space-y-1.5">
          <p className="text-xs text-muted-foreground font-bold">{t('status')}</p>
          <StatusBadge status={sub.status} />
        </div>

        <div className="p-5 space-y-1.5">
          <p className="text-xs text-muted-foreground font-bold">{t('member_count')}</p>
          <p className="text-base font-bold text-foreground">{sub.member_count || 1}</p>
        </div>

        <div className="p-5 space-y-1.5">
          <p className="text-xs text-muted-foreground font-bold">{t('billing_cycle')}</p>
          <p className="text-base font-bold text-foreground capitalize">{t(sub.billing_cycle)}</p>
        </div>

        <div className="p-5 space-y-1.5 border-t sm:border-t-0">
          <p className="text-xs text-muted-foreground font-bold">{t('amount_paid')}</p>
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <p className="text-base font-bold text-foreground">${amountPaid.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-5 space-y-1.5 border-t sm:border-t-0">
          <p className="text-xs text-muted-foreground font-bold">
            {plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime'
              ? t('validity_days')
              : t('days_remaining')}
          </p>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-red-500" />
            <p className="text-sm font-bold text-red-500">
              {plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime'
                ? t('days_count', { count: plan?.validity_days || 0, defaultValue: '{{count}} days' })
                : t('days_count', { count: daysRemaining, defaultValue: '{{count}} days' })}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-1.5 border-t sm:border-t-0">
          <p className="text-xs text-muted-foreground font-bold">{t('subscription_date')}</p>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-primary whitespace-nowrap">
              {formatDate(sub.current_period_start)}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-1.5 border-t sm:border-t-0">
          <p className="text-xs text-muted-foreground font-bold">{t('expiry_date')}</p>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-red-500" />
            <p className="text-sm font-semibold text-red-500 whitespace-nowrap">{formatDate(sub.current_period_end)}</p>
          </div>
        </div>
      </div>

      {!sub.cancel_at_period_end && (sub.status === 'active' || sub.status === 'incomplete') && (
        <div className="px-6 py-4 flex justify-end border-t border-border bg-muted/10">
          <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="sm:h-12 h-10 rounded-[8px] font-medium gap-2 px-5 w-full sm:w-auto"
              >
                <Ban className="w-4 h-4" />
                {t('cancel_subscription')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>{t('cancel_subscription')}</DialogTitle>
                <DialogDescription>
                  {t('retain_access_until', {
                    date: formatDate(sub.current_period_end),
                  })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="rounded-[8px] bg-light-gray font-medium p-button-padding text-base sm:h-12 h-10">
                  {t('keep_subscription')}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="rounded-[8px] font-medium bg-primary! text-white text-base sm:h-12 h-10"
                >
                  {isCancelling ? `${t('cancelling')}...` : t('confirm_cancellation')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {sub.cancel_at_period_end && (
        <div className="px-6 py-3 flex items-center gap-2 bg-red-50 dark:bg-[unset] dark:border-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            {t('cancel_at_period_end_desc', {
              date: formatDate(sub.current_period_end),
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default UserSubscriptionOverview
