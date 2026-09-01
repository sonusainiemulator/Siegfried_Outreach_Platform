'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { SubscribePlanModalProps } from '@/types'
import { addMonths, addYears, format } from 'date-fns'
import { ArrowLeft, Calendar, Check, CreditCard, Users } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SubscribePlanModal: React.FC<SubscribePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  initialBillingCycle,
  onProceedToPayment,
}) => {
  const { t } = useTranslation()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'one-time'>(initialBillingCycle)

  if (!plan) return null

  const isOneTime = plan.plan_type !== 'subscription'
  
  const price = plan.amount

  const pricePerUserPerMonth = plan.amount

  const memberCount = 1
  const totalAmount = Number((memberCount * price).toFixed(2))

  const today = new Date()
  let periodEnd = billingCycle === 'monthly' ? addMonths(today, 1) : addYears(today, 1)
  
  if (plan.plan_type === 'prepaid' && plan.validity_days) {
    periodEnd = new Date(today.getTime() + plan.validity_days * 24 * 60 * 60 * 1000)
  } else if (plan.plan_type === 'lifetime') {
    periodEnd = addYears(today, 100) 
  }

  const features = Object.entries(plan.features || {})

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl p-0 bg-background border-border rounded-2xl overflow-hidden shadow-2xl">
        <DialogTitle className="sr-only">{t('subscribe_to')} {plan.name}</DialogTitle>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <Button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>
          <div>
            <h2 className="text-base font-bold text-foreground">{t('subscribe_to_plan')}</h2>
            <p className="text-xs text-muted-foreground">{plan.name} ({t(plan.plan_type)})</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[540px]">
          <div className="flex-1 p-6 border-r border-border">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {plan.description}
                {plan.is_default && (
                  <span className="text-primary font-medium"> {t('this_is_the_default_plan_for_all_teams')}</span>
                )}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">{t('what_you_get')}</h4>
              <ul className="space-y-2.5">
                {features.map(([key, value]) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    <span className="text-sm text-foreground/80">
                      {key}: <span className="text-foreground font-semibold">{String(value)}</span>
                    </span>
                  </li>
                ))}
                {Array.isArray(plan.module_access) && plan.module_access.map((mod: any, idx: number) => {
                  const moduleName = typeof mod === 'object' ? mod.module : mod;
                  return (
                    <li key={`mod-${idx}`} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-sm text-foreground/80 capitalize font-medium">
                        {String(moduleName).replace(/_/g, ' ').replace(/-/g, ' ')}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Right: Subscription Summary */}
          <div className="w-full md:w-80 p-6 bg-muted/10 flex flex-col">
            <h3 className="text-base font-bold text-foreground mb-1">{t('subscription_summary')}</h3>
            <p className="text-xs text-muted-foreground mb-5">{t('review_the_plan_details_before_continuing')}</p>

            {/* Billing Cycle Toggle */}
            {!isOneTime && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t('billing_cycle')}</p>
                <div className="flex rounded-lg border border-border bg-background overflow-hidden">
                  <Button
                    onClick={() => setBillingCycle('monthly')}
                    className={cn(
                      'flex-1 py-2 text-sm font-semibold transition-all',
                      billingCycle === 'monthly'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t('monthly')}
                  </Button>
                  <Button
                    onClick={() => setBillingCycle('yearly')}
                    className={cn(
                      'flex-1 py-2 text-sm font-semibold transition-all',
                      billingCycle === 'yearly'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t('yearly')}
                  </Button>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-xs text-green-600 font-medium mt-1.5">{t('save_20_with_yearly_billing')}</p>
                )}
              </div>
            )}

            {/* Total Due */}
            <div className="pb-4 mb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t('total_due_today')}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t('per user')} / {billingCycle === 'monthly' ? 'month' : 'year'}
                  </p>
                </div>
                <p className="text-2xl font-black text-foreground">
                  {plan.currency === 'INR' ? '₹' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'}
                  {totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-background rounded-xl border border-border p-4 mb-5">
              <h4 className="text-sm font-bold text-foreground mb-3">{t('cost_breakdown')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{t('member_count')}</span>
                  </div>
                  <span className="font-semibold">{memberCount}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t('price_per_user')}</span>
                  <span className="font-semibold text-foreground">
                    {plan.currency === 'INR' ? '₹' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'}
                    {pricePerUserPerMonth.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
                  <span className="font-bold text-foreground">{t('total_amount')}</span>
                  <span className="font-bold text-foreground">
                    {plan.currency === 'INR' ? '₹' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'}
                    {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Period */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {t('starts')} <span className="font-semibold text-foreground">{format(today, 'MMM dd, yyyy')}</span>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('ends')} <span className="font-semibold text-foreground">{format(periodEnd, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Proceed to Payment */}
            <Button
              onClick={() => onProceedToPayment(billingCycle)}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 mt-auto"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t('proceed_to_payment')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubscribePlanModal
