'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { dashboardItemVariants } from '@/data/dashboard'
import { PlanCardProps } from '@/types/components/campaignHub'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const DashboardPlanCard = ({ currentPurchasePlan, t }: PlanCardProps) => {
  const router = useRouter()

  const calculateDaysLeft = (createdAt: string, cycle: string) => {
    if (!createdAt) return 0
    const created = new Date(createdAt)
    const now = new Date()
    const expiry = new Date(created)

    if (cycle === 'monthly') {
      expiry.setDate(expiry.getDate() + 30)
    } else if (cycle === 'yearly') {
      expiry.setDate(expiry.getDate() + 365)
    } else {
      return 0
    }

    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysLeft = currentPurchasePlan
    ? calculateDaysLeft(currentPurchasePlan.created_at, currentPurchasePlan.billing_cycle)
    : 0

  return (
    <motion.section className="col-span-1" variants={dashboardItemVariants}>
      <Card
        onClick={() => router.push(ROUTES.PLANS)}
        className="h-full glass-dark-card border border-white/10 rounded-border-radius transition-all duration-700 hover:border-white/20 relative overflow-hidden group/card cursor-pointer"
      >
        <div className="relative z-10 sm:p-5 p-4 flex flex-col h-full space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-[8px] transition-transform duration-700 group-hover/card:scale-110 ring-1 ring-white/10 bg-primary/10 text-primary">
              <Rocket className="w-6 h-6 rtl:-scale-x-100" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-title-color dark:text-white mb-0 tracking-tight">
                {t('active_plan', { defaultValue: 'Subscribed Plan' })}
              </h3>
              <div className="flex gap-4">
                <p className="text-xs text-subtitle-color dark:text-slate-300 font-medium leading-relaxed line-clamp-1 opacity-90">
                  {currentPurchasePlan?.name || t('no_plan', { defaultValue: 'No active plan' })}
                </p>
                {currentPurchasePlan && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none tracking-widest text-[10px] font-medium">
                    {t('active')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {currentPurchasePlan ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {t('total_credits')}:{' '}
                  {currentPurchasePlan.total_credits === -1
                    ? t('unlimited', { defaultValue: 'Unlimited' })
                    : currentPurchasePlan.total_credits || 0}
                </div>
                {currentPurchasePlan.chatbot_creation_limit !== 0 && (
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t('chatbot_limit', { defaultValue: 'Chatbot Limit' })}:{' '}
                    {currentPurchasePlan.chatbot_creation_limit === -1
                      ? t('unlimited', { defaultValue: 'Unlimited' })
                      : currentPurchasePlan.chatbot_creation_limit}
                  </div>
                )}
                {currentPurchasePlan.publish_post_per_day !== 0 && (
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t('social_post_limit', { defaultValue: 'Social Post Daily' })}:{' '}
                    {currentPurchasePlan.publish_post_per_day === -1
                      ? t('unlimited', { defaultValue: 'Unlimited' })
                      : currentPurchasePlan.publish_post_per_day}
                  </div>
                )}
                {currentPurchasePlan.campaign_per_day !== 0 && (
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t('campaign_limit', { defaultValue: 'Broadcast Daily' })}:{' '}
                    {currentPurchasePlan.campaign_per_day === -1
                      ? t('unlimited', { defaultValue: 'Unlimited' })
                      : currentPurchasePlan.campaign_per_day}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {t('billing_cycle')}: <span className="capitalize">{currentPurchasePlan.billing_cycle}</span>
                </div>
              </div>
            ) : (
              <div className="py-2 flex justify-center items-center flex-1 min-h-[60px] w-full">
                <Image src="/images/plan.png" alt="No Plan Image" width={100} height={100} unoptimized className="max-h-20 object-contain opacity-80" />
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
              {currentPurchasePlan ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-xl font-medium text-title-color dark:text-white tabular-nums tracking-tighter">
                      {currentPurchasePlan.currency === 'INR' ? '₹' : '$'}
                      {currentPurchasePlan.amount}
                    </span>
                    <span className="text-[11px] capitalize tracking-widest text-muted-foreground">
                      /{currentPurchasePlan.billing_cycle === 'monthly' ? t('month') : t('year')}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-[11px] font-bold text-rose-500 capitalize block mb-0">
                      {daysLeft} {t('days_left')}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">{t('remaining')}</span>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <Link href={ROUTES.PLANS} className="w-full block" onClick={(e) => e.stopPropagation()}>
                    <Button variant="premium" className="w-full h-10 text-sm font-semibold">
                      {t('get_plan', { defaultValue: 'Get a Plan' })}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  )
}
