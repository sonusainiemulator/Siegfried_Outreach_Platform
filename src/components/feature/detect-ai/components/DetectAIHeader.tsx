'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { DetectAIHeaderProps } from '@/types'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const DetectAIHeader = ({ onClear }: DetectAIHeaderProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="relative overflow-hidden  ">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-8 mb-4">
        <div className="flex items-center gap-4">
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
              <div className="flex items-start  flex-col">
                <h1 className="text-3xl font-bold title-color leading-tight">
                  {t('ai')} <span className="text-primary">{t('detect')}</span>
                </h1>

              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onClear}
            className="flex-1 sm:flex-none rounded-[8px] border-primary bg-light-gray text-light-text-color dark:text-white glass-dark-card p-button-padding! font-medium gap-2 text-sm backdrop-blur-xl transition-all sm:h-12 h-10 active:scale-95"
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            {t('clear')}
          </Button>
          <CreditLimitPill />
        </div>
      </div>
      <div className="flex items-start  flex-col">
        <h6 className="text-lg font-medium text-black leading-tight dark:text-white/60">
          {t('content_verification')}
        </h6>
        <p className='text-subtitle-color text-base dark:text-white/60'>
          {t('content_verification_desc')}
        </p>

      </div>
    </div>

  )
}

export default DetectAIHeader
