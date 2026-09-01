import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ResultsDisplayProps } from '@/types'
import { LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SemiCircleGauge from '../SemiCircleGauge'

const ResultsDisplay = ({ result, aiScore, plagScore }: ResultsDisplayProps) => {
  const { t } = useTranslation()
  if (!result) {
    return (
      <Card className="rounded-border-radius glass-card glass-dark-card border-2 border-dashed border-border bg-card/40 sm:p-6 p-4 flex flex-col items-center justify-center text-center h-auto min-h-100 lg:h-131">
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-[8px] glass-card glass-dark-card bg-primary/10 flex items-center justify-center mb-4 md:mb-6 border border-border">
          <LayoutDashboard className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        </div>
        <h3 className="text-base md:text-lg font-medium text-title-color dark:text-white mb-1 ">{t('report_standby')}</h3>
        <p className="text-xs md:text-sm text-subtitle-color max-w-62.5 md:max-w-none mx-auto">
          {t('generate_forensic_report')}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
      <Card className="rounded-border-radius glass-dark-card glass-card p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
          <ShieldCheck className="h-40 w-40" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
            <div className="flex flex-col items-center">
              <SemiCircleGauge value={aiScore} label="AI Probability" type="ai" size={180} />
              <div
                className={cn(
                  'mt-4 md:mt-6 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] font-medium border transition-all duration-500',
                  aiScore > 50
                    ? 'bg-destructive/10 border-destructive/20 text-destructive'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
                )}
              >
                {aiScore > 50 ? 'AI Generated' : 'Human Author'}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <SemiCircleGauge value={plagScore} label="Plagiarism Link" type="plag" size={180} />
              <div
                className={cn(
                  'mt-4 md:mt-6 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] font-medium border transition-all duration-500',
                  plagScore > 30
                    ? 'bg-destructive/10 border-destructive/20 text-destructive'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
                )}
              >
                {plagScore > 30 ? 'High Risk' : 'Highly Unique'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-6 border-t border-border">
            <div className="p-3 md:p-4 rounded-border-radius glass-card glass-dark-card  text-center">
              <span className="text-sm font-medium text-subtitle-color block mb-1">
                {t('human_score')}
              </span>
              <h4 className="text-xl md:text-2xl font-black text-emerald-500 leading-none">
                {result.aiDetection?.humanWriting || '0%'}
              </h4>
            </div>
            <div className="p-3 md:p-4 rounded-border-radius glass-card glass-dark-card  text-center">
              <span className="text-sm font-medium text-subtitle-color block mb-1">
                {t('uniqueness')}
              </span>
              <h4 className="text-xl md:text-2xl font-black text-primary leading-none">
                {result.plagiarismReport?.unique || '0%'}
              </h4>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ResultsDisplay
