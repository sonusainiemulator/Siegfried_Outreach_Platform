'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, Settings, Share2, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const PlatformConnectionHeader = ({ onNavigateToDashboard }: { onNavigateToDashboard: () => void }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="relative overflow-hidden pb-2 border-b border-border/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Title and Back button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 hover:text-primary rounded-[8px] transition-all h-9 w-11 shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight title-color text-title-color dark:text-white truncate">
              {t('social_network_hub', { defaultValue: 'Channels & Connected Accounts' })}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('social_channels_subtitle', {
                defaultValue: 'Connect and authorize social accounts, pages, and channels via OAuth & API bridges.',
              })}
            </p>
          </div>
        </div>

        {/* Right: Direct Navigation Switcher to Social Settings / API Config */}
        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          {/* Active Tab (Channels) */}
          <div className="inline-flex items-center p-1 rounded-xl bg-background/60 border border-border/30 gap-1 text-xs">
            <span className="px-3 py-1.5 rounded-lg font-bold bg-primary text-white flex items-center gap-1.5 shadow-xs">
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('channels_tab', { defaultValue: 'Channels (Accounts)' })}</span>
            </span>

            <Link
              href={ROUTES.SOCIAL_MEDIA.SOCIAL_SETTINGS}
              className="px-3 py-1.5 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('api_config_tab', { defaultValue: 'API Configurations' })}</span>
            </Link>
          </div>

          {/* Direct CTA button to Social Settings */}
          <Link href={ROUTES.SOCIAL_MEDIA.SOCIAL_SETTINGS}>
            <Button
              type="button"
              className="h-9 px-3.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-purple-600 to-primary text-white hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 animate-spin-slow" />
              <span>{t('configure_api_keys', { defaultValue: 'Configure API Keys' })}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PlatformConnectionHeader
