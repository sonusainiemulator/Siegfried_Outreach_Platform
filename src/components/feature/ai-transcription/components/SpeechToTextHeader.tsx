'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { SpeechToTextHeaderProps } from '@/types'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const SpeechToTextHeader = ({ onClear, showClear }: SpeechToTextHeaderProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="relative overflow-hidden ">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
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
            <h1 className="text-3xl font-bold tracking-tight text-title-color title-color dark:text-white leading-[1.1]">
              {t('ai_transcription')}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {showClear && (
            <Button
              variant="outline"
              onClick={onClear}
              className="rounded-[8px] sm:h-12 h-10 p-button-padding! glass-dark-card bg-light-gray text-light-text-color  dark:text-white font-medium gap-3 text-sm tracking-widest backdrop-blur-xl transition-all active:scale-95"
            >
              <Trash2 className="w-5 h-5" />
              {t('clear')}
            </Button>
          )}
          <CreditLimitPill />
        </div>
      </div>
    </div>
  )
}

export default SpeechToTextHeader
