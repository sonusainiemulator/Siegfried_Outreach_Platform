'use client'

import { ConfirmationModal } from '@/components/reusable/ConfirmationModal'
import { Button } from '@/components/ui/button'
import { ArticleStatsProps } from '@/types'
import { CheckCircle2, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ArticleStats = ({ articleHtml, onReset, generationTime }: ArticleStatsProps) => {
  const { t } = useTranslation()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmReset = () => {
    setShowConfirm(false)
    onReset()
  }

  return (
    <div className="w-full lg:w-80 space-y-6">
      <div className="p-4 sm:p-6 rounded-border-radius glass-card glass-dark-card bg-muted/10 border border-border/40 space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-medium text-muted-foreground px-1">{t('content_analytics')}</span>
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
            <div className="p-3 sm:p-6 rounded-border-radius glass-card glass-dark-card border border-border/40 flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all">
              <span className="text-[10px] sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1 ">{t('words_label')}</span>
              <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter">
                {Math.round(articleHtml.split(' ').length)}
              </span>
            </div>
            <div className="p-3 sm:p-6 rounded-border-radius glass-card glass-dark-card border border-border/40 flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all">
              <span className="text-[10px] sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1 ">{t('time_label')}</span>
              <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter">
                {Math.ceil(articleHtml.split(' ').length / 200)}m
              </span>
            </div>
            {generationTime !== undefined && (
              <div className="p-3 sm:p-6 rounded-border-radius glass-card glass-dark-card border border-border/40 flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all col-span-2 xl:col-span-1">
                <span className="text-[10px] sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1 ">{t('generation_time', { defaultValue: 'Gen Time' })}</span>
                <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter">
                  {typeof generationTime === 'number' ? `${generationTime.toFixed(1)}s` : generationTime}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-border/20" />

        <div className="space-y-4">
          <div className="flex items-center gap-3.5 px-2">
            <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-sm text-foreground opacity-60">{t('status')}</p>
              <p className="text-sm font-medium text-success">{t('ready_for_publication')}</p>
            </div>
          </div>
          <Button className="w-full sm:h-12 h-10 rounded-[8px] btn-color text-white font-medium text-sm gap-3 active:scale-95 transition-all">
            <Share2 className="w-5 h-5" />
            {t('distribute')}
          </Button>
        </div>
      </div>



      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmReset}
        title={t('new_article_title', { defaultValue: 'Start New Article?' })}
        description={t('are_you_sure_reset', { defaultValue: 'Are you sure you want to start over? All current progress will be lost.' })}
        confirmText={t('start_over', { defaultValue: 'Start Over' })}
        variant="primary"
      />
    </div>
  )
}

export default ArticleStats
