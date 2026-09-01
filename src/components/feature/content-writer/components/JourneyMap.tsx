'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { JourneyMapProps } from '@/types'
import { Check, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const JourneyMap = ({ steps, activeStep, setActiveStep, isFinalStepCompleted }: JourneyMapProps) => {
  const { t } = useTranslation()

  const progressPercent = isFinalStepCompleted
    ? 100
    : Math.round((activeStep / steps.length) * 100)

  return (
    <aside className="w-full lg:w-[280px] xl:w-[350px] shrink-0 lg:sticky lg:top-6 z-10">
      <div className="rounded-border-radius border border-border/40 glass-card glass-dark-card bg-card/60 p-4 sm:p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <Target className="w-5 h-5 shrink-0 text-title-color dark:text-white" />
          <span className="text-xl text-title-color dark:text-white font-medium tracking-tight">
            {t('content_journey', { defaultValue: 'Content Journey' })}
          </span>
        </div>

        {/* Timeline steps */}
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index
            const isCompleted = activeStep > index || (index === steps.length - 1 && isFinalStepCompleted)
            const isDisabled = activeStep < index
            const isLast = index === steps.length - 1

            return (
              <div key={step.id} className="flex items-stretch gap-4">

                {/* ── Left: icon node + vertical rail ── */}
                <div className="flex flex-col items-center">
                  {/* Icon box */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 transition-all duration-500 relative z-10',
                      isActive
                        ? 'bg-light-gray text-light-text-color dark:text-white shadow-md ring-2 ring-primary/30'
                        : isCompleted
                          ? 'bg-primary/10 text-primary'
                          : 'bg-light-primary text-muted-foreground opacity-50 grayscale',
                    )}
                  >
                    {isCompleted
                      ? <Check className="w-5 h-5 text-primary" />
                      : <Icon className="w-5 h-5" />
                    }

                    {/* Active pulse dot */}
                    {isActive && (
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.4)] animate-pulse z-20" />
                    )}
                  </div>

                  {/* Vertical rail line (skip for last item) */}
                  {!isLast && (
                    <div className="flex-1 mt-1 mb-1 w-[2px] rounded-full overflow-hidden bg-border/40 min-h-[24px] relative">
                      <div
                        className={cn(
                          'absolute top-0 left-0 right-0 rounded-full transition-all duration-700',
                          isCompleted ? 'bg-primary h-full' : 'h-0',
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* ── Right: step label button ── */}
                <Button
                  variant="ghost"
                  disabled={isDisabled}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    'group relative flex-1 flex flex-col items-start justify-center text-left rounded-2xl border glass-dark-card bg-card/60 transition-all duration-500 overflow-hidden hover:bg-transparent',
                    'px-4 py-3 mb-6',
                    isActive
                      ? 'border-light-border-color scale-[1.01] sm:scale-[1.02] z-10'
                      : isCompleted
                        ? 'border-primary/30 bg-card/40 opacity-100'
                        : 'border-border/40 bg-transparent opacity-40 grayscale',
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground leading-none">
                    {t('step')} 0{index + 1}
                  </p>
                  <h4
                    className={cn(
                      'font-medium text-sm sm:text-[15px] leading-snug',
                      isActive
                        ? 'text-subtitle-color'
                        : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </h4>

                  {/* Active glow */}
                  {isActive && (
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mb-12 blur-3xl animate-pulse pointer-events-none" />
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="border-t border-border/30 pt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{t('progress', { defaultValue: 'Progress' })}</span>
            <span className="text-primary font-semibold">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>
    </aside>
  )
}

export default JourneyMap
