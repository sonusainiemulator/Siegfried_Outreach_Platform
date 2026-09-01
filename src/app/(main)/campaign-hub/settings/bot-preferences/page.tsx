'use client'

import BotPreferencesSettings from '@/components/feature/campaign-hub/BotPreferences'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function BotPreferencesSettingsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
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
            {t('campaign_hub_settings')}
          </h1>
        </div>
      </div>
      <BotPreferencesSettings />
    </div>
  )
}
