'use client'

import { SupportFaqClient } from '@/components/feature/support'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function SupportFaqPage() {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className="space-y-6 pb-2">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-title-color dark:text-white title-color leading-[1.1]">
            {t('knowledge_base')}
          </h1>
        </div>
      </div>
      <SupportFaqClient />
    </div>
  )
}
