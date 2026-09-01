import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { sectionItems } from '@/data/userSetting'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useAppSelector } from '@/redux/hooks'
import { AdminSettings } from '@/types/app'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const CreditsDropdown = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: statsResp } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 15000,
    skip: !isAuthenticated,
  })
  const settings = (statsResp?.systemLimits || {}) as AdminSettings
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  if (user?.role !== 'user') return null

  const totalCredits = user.total_credits ?? 0
  const remainingCredits = user.remaining_credits ?? 0
  const creditsUsed = totalCredits - remainingCredits
  const usagePercentage = totalCredits > 0 ? Math.min((creditsUsed / totalCredits) * 100, 100) : 0

  return (
    <div onMouseEnter={() => setIsPopoverOpen(true)} onMouseLeave={() => setIsPopoverOpen(false)} className="relative">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className=" group px-2 sm:px-4 py-2 h-11 glass-dark-card  flex cursor-pointer md575:hidden" size="sm">
            <span className="btn-lining-content text-xs sm:text-sm whitespace-nowrap dark:text-white flex items-center gap-1.5 sm:gap-2">
              <span className="hidden min-[400px]:inline">{t('credits')}: </span>
              {creditsUsed}
              <span className="hidden sm:inline"> / {totalCredits}</span>
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={8}
          className="w-80 p-0 overflow-hidden glass-card bg-white dark:bg-modal-bg-color rounded-border-radius animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="p-3 border-b border-border/20 ">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-medium text-primary">{t('credits_overview')}</h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">{t('usage_progress')}</span>
                <span>{usagePercentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <CreditStat label={t('total')} value={totalCredits} />
              <CreditStat label={t('remaining')} value={remainingCredits} highlight />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{t('limits_per_section')}</p>
              <div className="h-[7.5rem] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {sectionItems.map(({ label, settingKey, icon: Icon, isLimit, isCredit }) => (
                  <div
                    key={settingKey}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-primary/60" />
                      <span className="text-xs font-bold text-foreground/80">{label}</span>
                    </div>
                    <span className="text-xs font-medium text-primary">
                      {settings[settingKey] || 0} {isLimit ? t('limit', { defaultValue: 'limit' }) : isCredit ? t('credits', { defaultValue: 'Credits' }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Small helper to avoid repeating the stat card markup
const CreditStat = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className="p-3 rounded-border-radius bg-primary/10 items-center border border-border/20">
    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
    <p className={`text-sm font-black ${highlight ? 'text-primary' : ''}`}>{value}</p>
  </div>
)

export default CreditsDropdown
