'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CurrentSubscriptionCardProps } from '@/types'
import { formatDate } from '@/utils'
import { motion } from 'framer-motion'
import { AlertTriangle, Calendar, History, Loader2, Rocket, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CurrentSubscriptionCard = ({ subscription, isCanceling, onCancel }: CurrentSubscriptionCardProps) => {
  const { t } = useTranslation()

  if (!subscription) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto bg-card rounded-[2.5rem] border border-glass-border overflow-hidden shadow-sm"
    >
      <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between bg-primary/[0.02]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[1.75rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Rocket className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">{t('manage_subscription')}</h2>
              <Badge
                className="gap-1.5 px-3 font-bold rounded-full border shadow-none bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest text-[10px]"
              >
                {subscription.status}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {t('subscription_active')}{' '}
              <span className="text-foreground font-bold">{formatDate(subscription.current_period_end)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-glass-border font-bold gap-2">
            <History className="w-4 h-4" />
            {t('billing_history')}
          </Button>
          {!subscription.cancel_at_period_end ? (
            <Button
              onClick={onCancel}
              disabled={isCanceling}
              variant="ghost"
              className="sm:h-12 h-10 rounded-[8px] text-destructive hover:bg-destructive/10 font-medium gap-2"
            >
              {isCanceling ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              {t('cancel_subscription')}
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              {t('canceled_expires')} {formatDate(subscription.current_period_end)}
            </div>
          )}
        </div>
      </div>

      {!subscription.cancel_at_period_end && (
        <div className="px-10 py-4 bg-muted/20 border-t border-glass-border flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {t('renew_automatically')} <span className="text-foreground font-bold">({subscription.billing_cycle})</span>
        </div>
      )}
    </motion.div>
  )
}

export default CurrentSubscriptionCard
