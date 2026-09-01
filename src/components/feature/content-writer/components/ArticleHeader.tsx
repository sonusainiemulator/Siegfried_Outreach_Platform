'use client'

import { ConfirmationModal } from '@/components/reusable/ConfirmationModal'
import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArticleHeaderProps } from '@/types'
import { ArrowLeft, History, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ArticleHistory from './ArticleHistory'

const ArticleHeader = ({ onReset, onSelectArticle, historyOpen, setHistoryOpen }: ArticleHeaderProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [showConfirm, setShowConfirm] = useState(false)

  const handleResetClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmReset = () => {
    setShowConfirm(false)
    onReset()
  }

  return (
    <div className="relative overflow-hidden ">
      <div className="relative z-10 flex  flex-wrap items-center justify-between gap-6 lg:gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-11 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all shrink-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Button>
            <div className="flex items-start flex-col">
              <h1 className="text-3xl font-bold title-color">
                {t('blog_writer_ai', { defaultValue: 'AI Blog Writer' })}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 w-full lg:w-auto">
          <Button
            onClick={handleResetClick}
            variant="outline"
            className="flex-1 sm:flex-none h-10 sm:h-12 rounded-[8px] inner-card! glass-dark-card  text-black dark:text-white font-medium gap-2 sm:gap-3 text-xs sm:text-sm backdrop-blur-xl transition-all"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            {t('start_over')}
          </Button>

          <ConfirmationModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleConfirmReset}
            title={t('new_article_title', { defaultValue: 'Start New Article?' })}
            description={t('are_you_sure_reset', {
              defaultValue: 'Are you sure you want to start over? All current progress will be lost.',
            })}
            confirmText={t('start_over', { defaultValue: 'Start Over' })}
          />

          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none h-10 sm:h-12 rounded-[8px] btn-color text-white  font-medium gap-2 sm:gap-3 text-sm backdrop-blur-xl transition-all"
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5 " />
                {t('article_history', 'History')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! dark:bg-modal-bg-color max-h-[85vh] overflow-hidden rounded-border-radius border-border/40 backdrop-blur-2xl p-0!">
              <DialogHeader className="p-4 sm:p-6 pr-12 sm:pr-16 border-b border-border/10">
                <DialogTitle className="text-xl font-medium flex items-center gap-2 sm:gap-3">
                  <History className="w-5 h-5 text-primary" />
                  {t('recent_articles', 'Recent Articles')}
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 sm:p-6 pt-0! overflow-y-auto max-h-[calc(85vh-80px)] custom-scrollbar">
                <ArticleHistory
                  onSelect={(article: Record<string, unknown>) => {
                    onSelectArticle(article)
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
          <CreditLimitPill />
        </div>
      </div>
    </div>
  )
}

export default ArticleHeader
