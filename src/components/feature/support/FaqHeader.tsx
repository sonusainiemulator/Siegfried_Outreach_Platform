'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export const FaqHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div>
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-6 ">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
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
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-title-color title-color dark:text-white leading-none">
                {t('support_and_faq')}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
