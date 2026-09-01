import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { planFeatureKeys } from '@/data/plan'
import { cn } from '@/lib/utils'
import { Check, Info, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

export const PlanCard = ({
  plan,
  price,
  billingCycleLabel,
  isPro,
  isActive,
  isDisabled,
  onSubscribe,
  t,
  buttonText,
  isLanding = false,
}: any) => {
  const translate = t || ((key: string, options?: any) => options?.defaultValue || key)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  return (
    <div
      className={cn(
        'relative flex flex-col p-4 sm:p-6 rounded-border-radius glass-dark-card border mt-7 border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 backdrop-blur-sm w-full h-full',
        plan.is_default && 'pt-10 sm:pt-12',
        isPro ? 'shadow-xl shadow-primary/10' : 'glass-card glass-dark-card hover:border-primary/30',
        !isLanding && 'dashboard-plan-card shadow-2xl shadow-primary/5',
      )}
    >
      {plan.is_default && (
        <div className="absolute -top-3 left-[50%] transform -translate-x-1/2 bg-amber-400 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 z-20 border-2 border-white/20 whitespace-nowrap">
          <Sparkles className="w-3 h-3" />
          {translate('most_popular', { defaultValue: 'Most Popular' })}
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={cn('text-xl font-black font-medium leading-tight', isPro ? 'text-foreground' : '')}>
            {plan.name}
          </h3>
        </div>
        <p className="text-subtitle-color text-sm md:text-base min-h-[3rem] overflow-hidden text-ellipsis line-clamp-2 mt-1">
          {plan.description}
        </p>
      </div>

      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tight">
          {plan.currency === 'INR' ? '₹' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'}
          {price}
        </span>
        <span className="text-muted-foreground font-medium">/{billingCycleLabel}</span>
      </div>

      <div className="space-y-4 mb-4">
        <div className="flex items-center gap-2 text-base font-medium text-foreground/80">
          <div
            className={cn('rounded-full p-1', isPro ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}
          >
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="flex items-center gap-1.5">
            {translate('access_features', {
              count: plan.module_access?.length || 0,
              defaultValue: `Access ${plan.module_access?.length || 0} Features`,
            })}
            <Popover open={isInfoOpen} onOpenChange={setIsInfoOpen}>
              <PopoverTrigger asChild>
                <div
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  onMouseEnter={() => setIsInfoOpen(true)}
                  onMouseLeave={() => setIsInfoOpen(true)}
                >
                  <Info className="w-4 h-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-64 p-4 ${!isLanding ? 'dark:bg-modal-bg-color bg-white' : 'bg-black text-primary'
                  } border-glass-border`}
              >
                <div className="space-y-3">
                  <p className="text-sm font-bold border-b border-border/50 pb-2 mb-2">
                    {translate('module_access', { defaultValue: 'Module Access' })}
                  </p>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                    {Array.isArray(plan.module_access) && plan.module_access.length > 0 ? (
                      plan.module_access.map((mod: any, i: number) => {
                        const moduleName = typeof mod === 'object' ? mod.module : mod
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="capitalize">{String(moduleName).replace(/_/g, ' ')}</span>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        {translate('no_modules_specified', { defaultValue: 'Full Platform Access' })}
                      </p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </span>
        </div>

        {planFeatureKeys.map((feat) => (
          <div key={feat.key} className="flex items-center gap-2 text-base font-medium text-foreground/80">
            <div
              className={cn(
                'rounded-full p-1',
                isPro ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
              )}
            >
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>
              {translate(feat.label, { defaultValue: String(feat.label).replace(/_/g, ' ') })}:{' '}
              <span className="font-bold">{plan[feat.key] || 0}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-border/20 my-6" />

      <ul className="space-y-4 flex-1">
        {Object.entries(plan.features || {}).map(([key, value]) => (
          <li key={key} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
            <div
              className={cn(
                'mt-0.5 rounded-full p-0.5',
                isPro ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground',
              )}
            >
              <Check className="w-3 h-3" />
            </div>
            <span className="capitalize">
              {String(key).replace(/_/g, ' ')}: <span className="text-foreground font-black">{String(value)}</span>
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSubscribe}
        disabled={isDisabled}
        className={cn(
          'w-full h-12 rounded-[8px] font-nedium text-base btn-color border-none transition-transform active:scale-95',
          isActive
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
            : isPro
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              : ' border-2 border-primary/10 hover:border-primary text-white',
        )}
      >
        {buttonText
          ? buttonText
          : isActive
            ? translate('subscribed', { defaultValue: 'Subscribed' })
            : plan.trial_period_days > 0 && plan.plan_type === 'subscription'
              ? translate('start_free_trial', { defaultValue: `Start ${plan.trial_period_days}-day free trial` })
              : translate('subscribe_now', { defaultValue: 'Subscribe Now' })}
      </Button>
    </div>
  )
}
