import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { RewriterHeaderProps } from '@/types'
import { ArrowLeft, History as HistoryIcon, RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RewriterHeader: React.FC<RewriterHeaderProps> = ({ onReset }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <header className="bg-unset pb-4 md:pb-6 shrink-0 z-10 ">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <div className="flex items-start flex-col">
              <h1 className="text-3xl font-bold tracking-tight title-color text-title-color dark:text-white leading-[1.1]">
                {t('rewriter_title')}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.CONTENT_REWRITER_HISTORY)}
            className="flex-1 md:flex-none p-button-padding! sm:h-12 h-10 rounded-[8px] shadow-none btn-color border-none text-white hover:bg-primary hover:text-white transition-all gap-2 font-medium"
          >
            <HistoryIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm">{t('writer_history')}</span>
          </Button>
          <Button
            onClick={onReset}
            className="flex-1 md:flex-none p-button-padding! sm:h-12 h-10 rounded-[8px] btn-color text-white  gap-2 font-medium"
          >
            <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm">{t('new_generate')}</span>
          </Button>
          <CreditLimitPill />
        </div>
      </div>
    </header>
  )
}

export default RewriterHeader
