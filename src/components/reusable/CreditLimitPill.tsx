'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ROUTES } from '@/constants/routes'
import { creditFields } from '@/data/setting'
import { cn } from '@/lib/utils'
import { useGetProfileQuery } from '@/redux/api/authApi'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useAppSelector } from '@/redux/hooks'
import { CreditLimitPillProps } from '@/types'
import { ShieldAlert } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '../ui/button'

export const CreditLimitPill = ({ className }: CreditLimitPillProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // Fetch latest data to ensure accurate limits
  const { data: profileResp } = useGetProfileQuery(undefined, {
    pollingInterval: 30000,
    skip: !isAuthenticated,
  })
  const { data: statsResp } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 15000,
    skip: !isAuthenticated,
  })

  const currentUser = profileResp?.user || user
  const role = currentUser?.role
  const systemLimits = statsResp?.systemLimits
  const moduleUsage = statsResp?.moduleUsage

  // Mapping of current path to a module name defined in creditFields
  const activeModule = useMemo(() => {
    // Exact and partial path matching for modules
    if (pathname.includes(ROUTES.CONTENT_WRITER)) return 'article_generate_credit'
    if (pathname.includes(ROUTES.SMART_WRITER)) return 'smart_writer_credit'
    if (pathname.includes(ROUTES.CHATBOT_BUILDER)) return 'chatbot_creation_limit'
    if (
      pathname.includes(ROUTES.SOCIAL_MEDIA.DASHBOARD) ||
      pathname.includes(ROUTES.SOCIAL_MEDIA.CREATE_POST) ||
      pathname.includes(ROUTES.SOCIAL_MEDIA.POST_QUEUE)
    )
      return 'publish_post_per_day_limit'
    if (pathname.includes(ROUTES.CAMPAIGN_HUB.BROADCASTS.HOME)) return 'campaign_per_day_limit'
    if (pathname.includes(ROUTES.CONTENT_REWRITER)) return 'ai_rewriter_credit'
    if (pathname.includes(ROUTES.CODE_ASSISTANT)) return 'code_generate_credit'
    if (pathname.includes(ROUTES.DETECT_AI)) return 'analyze_content_credit'
    if (pathname.includes(ROUTES.SLIDE_MAKER)) return 'presentation_generate_credit'
    if (pathname.includes(ROUTES.AI_AVATAR)) return 'avatar_image_credit'
    if (pathname.includes(ROUTES.CAMPAIGN_HUB.BROADCASTS.CREATE.EMAIL)) return 'generate_email_credit'
    if (pathname.includes(ROUTES.AI_TRANSCRIPTION)) return 'speech_text_credit'
    if (pathname.includes(ROUTES.SMART_FILE_CHAT)) return 'file_chat_credit'

    return null
  }, [pathname])

  const moduleData = useMemo(() => {
    if (!activeModule) return null

    const field = creditFields.find((f) => f.name === activeModule)
    if (!field) return null

    const used = moduleUsage?.[activeModule] || 0

    // Mapping frontend module names to backend plan field names
    const planFieldMapping: Record<string, string> = {
      chatbot_creation_limit: 'chatbot_creation_limit',
      publish_post_per_day_limit: 'publish_post_per_day',
      campaign_per_day_limit: 'campaign_per_day',
    }

    const planField = planFieldMapping[activeModule]
    const planLimit = planField ? (statsResp?.currentPurchasePlan as any)?.[planField] : null

    // Prioritize Plan Limit, then fall back to System Limit provided in dashboard response
    let total = 0
    if (planLimit !== undefined && planLimit !== null) {
      total = Number(planLimit)
    } else {
      total = Number(systemLimits?.[activeModule]) || 0
    }

    const isUnlimited = total === -1
    const isCredit = !!field.isCredit
    const remaining = isUnlimited ? Infinity : Math.max(0, total - used)
    const percentage = isUnlimited ? 0 : total > 0 ? (used / total) * 100 : used > 0 ? 100 : 0

    // For credit-based features, 'remaining' is the user's overall balance
    // and 'total' is the cost per generation
    const effectiveRemaining = isCredit ? currentUser?.remaining_credits || 0 : remaining
    const effectiveUsed = isCredit ? currentUser?.used_credits || 0 : used

    return {
      label: field.label,
      icon: field.icon,
      color: field.color,
      used: effectiveUsed,
      total,
      remaining: effectiveRemaining,
      percentage,
      isUnlimited,
      isCredit,
    }
  }, [activeModule, moduleUsage, systemLimits, statsResp?.currentPurchasePlan, currentUser])

  // Auto-open logic when module changes
  useEffect(() => {
    if (activeModule) {
      setIsOpen(true)
      const timer = setTimeout(() => setIsOpen(false), 5000)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [activeModule])

  // Show alert if limit is reached
  useEffect(() => {
    if (role === 'user' && moduleData && moduleData.total > 0 && moduleData.remaining <= 0) {
      toast.error(
        t('module_limit_reached', {
          module: moduleData.label,
          defaultValue: `Capacity reached for ${moduleData.label}. Please upgrade your plan.`,
        }),
        {
          id: `limit-${activeModule}`,
          duration: 5000,
          className: 'bg-rose-950 border-rose-500/50 text-white font-medium rounded-border-radius p-4 border',
          icon: <ShieldAlert className="w-6 h-6 text-rose-500" />,
        },
      )
    }
  }, [moduleData?.remaining, moduleData?.total, moduleData?.label, activeModule, role, t])

  // Visibility logic: only for standard users
  if (role === 'super_admin' || role === 'admin') return null

  // If no specific module is detected for this page, or data is missing, don't show the pill
  if (!moduleData) return null

  return (
    <div className={cn('relative', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'group/pill flex items-center gap-1 px-3 h-10 sm:h-12 rounded-[8px] transition-all duration-300 border backdrop-blur-md cursor-pointer',
              moduleData.remaining <= moduleData.total * 0.1
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-primary/5 border-primary/20 hover:border-primary/40 dark:border-primary/40 text-primary',
            )}
          >
            <div className={cn('transition-transform duration-300 group-hover/pill:scale-110', moduleData.color)}>
              {moduleData.icon}
            </div>
            {!moduleData.isCredit && (
              <span className="text-xs font-bold tabular-nums">
                {moduleData.used} / {moduleData.isUnlimited ? '∞' : moduleData.total}
              </span>
            )}
            {moduleData.isCredit && (
              <span className="text-xs font-bold tabular-nums">
                {moduleData.remaining}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="end"
          sideOffset={8}
          className="w-72 p-0 overflow-hidden glass-card bg-white dark:bg-modal-bg-color rounded-2xl border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50"
        >
          {/* Header */}
          <div className="p-4 bg-linear-to-b from-white/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className={cn('rounded-xl bg-white/5 ', moduleData.color)}>
                {moduleData.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-foreground">
                  {moduleData.label}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse', 
                    moduleData.isUnlimited || moduleData.remaining > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  )} />
                  <span className="text-xs font-medium opacity-60">
                    {moduleData.isUnlimited || moduleData.remaining > 0 
                      ? t('neural_active', { defaultValue: 'Active' }) 
                      : t('exhausted', { defaultValue: 'Exhausted' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Body */}
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-[8px] bg-primary/5 border border-primary/10 space-y-1">
                <p className="text-sm font-medium text-subtitle-color">
                  {moduleData.isCredit ? t('used_credits', { defaultValue: 'Used' }) : t('usage_stats', { defaultValue: 'Usage' })}
                </p>
                <p className="text-sm font-black tabular-nums tracking-tight">
                  {moduleData.used}
                </p>
              </div>
              <div className="p-3 rounded-[8px] bg-primary/5 border border-primary/10 space-y-1">
                <p className="text-sm font-medium text-subtitle-color">
                  {moduleData.isCredit ? t('your_balance', { defaultValue: 'Balance' }) : t('remaining_quota', { defaultValue: 'Remaining' })}
                </p>
                <p className={cn("text-sm font-black tabular-nums tracking-tight", 
                  !moduleData.isUnlimited && moduleData.remaining <= moduleData.total * 0.1 ? 'text-rose-500' : 'text-primary'
                )}>
                  {moduleData.isUnlimited ? '∞' : moduleData.remaining}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {!moduleData.isUnlimited && !moduleData.isCredit && (
              <div>
                <div className="flex justify-between text-xs font-medium text-subtitle-color">
                  <span>{t('total_limit', { defaultValue: 'Total Limit' })}</span>
                  <span className='text-xs'>{moduleData.total}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
                  <div
                    className={cn(
                      'h-full transition-all duration-1000 ease-out',
                      moduleData.remaining <= moduleData.total * 0.1 ? 'bg-rose-500' : 'bg-primary',
                    )}
                    style={{ width: `${Math.min(100, moduleData.percentage)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer / Tip */}
          <div className="px-4 pb-3 min-h-[44px] flex items-center">
            <p className="text-[11px] font-medium opacity-60 leading-relaxed">
              {t('credit_info_tip', { defaultValue: 'Limits reset based on your current subscription plan cycles.' })}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
