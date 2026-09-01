'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export const EmptyPostState = () => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-border-radius border border-dashed border-border/40 py-24 text-center space-y-6 flex flex-col items-center bg-card/5">
      <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center ring-1 ring-primary/20">
        <Calendar className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-bold text-title-color dark:text-white">{t('social_no_scheduled')}</p>
        <p className="text-sm text-subtitle-color font-medium opacity-50 max-w-xs leading-relaxed">
          {t('social_no_scheduled_desc')}
        </p>
      </div>
      <Button
        className="bg-primary! text-white hover:bg-primary/90 rounded-[8px] px-10 h-11 font-bold shadow-lg shadow-primary/10"
        asChild
      >
        <Link href={ROUTES.SOCIAL_MEDIA.CREATE_POST}>{t('social_create_post')}</Link>
      </Button>
    </Card>
  )
}
