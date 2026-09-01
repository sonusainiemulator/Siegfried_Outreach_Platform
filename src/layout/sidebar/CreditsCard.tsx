import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useGetCurrentSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { useAppSelector } from '@/redux/hooks'
import { isBrowser } from '@/utils/environment'
import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CreditsCard = ({ isCollapsed }: { isCollapsed?: boolean }) => {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const { data: subData } = useGetCurrentSubscriptionQuery()
  const currentPlan = subData?.subscription?.plan
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')

  useEffect(() => {
    if (isBrowser) {
      const observer = new MutationObserver(() => {
        setDir(document.documentElement.dir as 'ltr' | 'rtl' || 'ltr')
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })
      setTimeout(() => {
        setDir(document.documentElement.dir as 'ltr' | 'rtl' || 'ltr')
      }, 100)
      return () => observer.disconnect()
    }
  }, [])

  if (user?.role !== 'user') return null

  const total = user?.total_credits || 0
  const remaining = user?.remaining_credits || 0
  const progress = total > 0 ? (remaining / total) * 100 : 0

  const CardContent = (
    <Card variant="glass" className={cn('p-6 relative overflow-hidden group shadow-2xl rounded-3xl transition-all duration-500', isCollapsed ? 'p-3' : 'p-6')}>
      <div className="absolute top-[-20%] end-[-20%] w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
      <div className="absolute bottom-[-20%] start-[-20%] w-32 h-32 bg-mix-primary-2/20 rounded-full blur-3xl group-hover:bg-mix-primary-2/30 transition-all duration-700"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className={cn('flex items-center gap-3 mb-5 w-full transition-all duration-500', isCollapsed ? 'mb-0 justify-center' : 'mb-5')}>
          <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-500 overflow-hidden truncate">
              <span className="text-sm font-medium text-primary   block mb-0.5 truncate">
                {currentPlan?.name || t('free_plan')}
              </span>
              <span className="text-xs font-bold text-foreground uppercase tracking-widest opacity-80 truncate">
                {t('credits')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className={cn('mt-8 px-2 transition-all duration-300', isCollapsed && 'px-0')}>
      {isCollapsed ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {CardContent}
            </TooltipTrigger>
            <TooltipContent side={dir === 'rtl' ? 'left' : 'right'} sideOffset={10} className="font-bold">
              {remaining.toLocaleString()} / {total.toLocaleString()} {t('credits')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        CardContent
      )}
    </div>
  )
}

export default CreditsCard