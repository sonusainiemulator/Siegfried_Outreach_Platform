'use client'

import { Button } from '@/components/ui/button'
import { LanguageHeaderProps } from '@/types'
import { ArrowLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export const LanguageHeader = ({ onAddClick, canManage }: Partial<LanguageHeaderProps>) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Button>
          <h1 className="text-3xl font-medium tracking-tight text-title-color dark:text-white capitalize line-clamp-1">
            {t('languages_management')}
          </h1>
        </div>
        <p className="text-subtitle-color font-medium text-sm sm:text-base ml-1">{t('manage_languages_desc')}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">

        {canManage && (
          <Button
            onClick={onAddClick}
            className="h-12 w-full md:w-auto px-6 rounded-[8px]! bg-primary! text-white text-base p-button-padding whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {t('add_language')}
          </Button>
        )}
      </div>
    </div>
  )
}
