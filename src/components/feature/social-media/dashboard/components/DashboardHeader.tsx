'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const DashboardHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="relative group overflow-hidden ">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20  hover:text-primary rounded-[8px] transition-all w-11 h-9"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <div className="flex items-start flex-col">
          <h1 className="text-3xl font-bold  flex items-center gap-4 title-color">
            {t('social_media_suite')}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
