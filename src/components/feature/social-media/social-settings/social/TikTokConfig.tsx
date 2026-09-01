'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const TikTokConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px] bg-pink-500/10 text-pink-500">
          <Video className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">
          {t('social_tiktok_platform') || 'TikTok Platform'}
        </h3>
        <SetupGuideTooltip
          title={platformSetupGuides.tiktok.title}
          steps={platformSetupGuides.tiktok.steps}
          links={platformSetupGuides.tiktok.links}
          redirectUri={platformSetupGuides.tiktok.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 inner-card glass-dark-card rounded-border-radius!">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="tiktok_client_key" className="text-sm font-medium text-foreground">
            {t('social_tiktok_client_key') || 'TikTok Client Key'}
          </Label>
          <div className="relative">
            <PasswordInput
              id="tiktok_client_key"
              placeholder={t('social_tiktok_client_key_placeholder') || 'Enter TikTok Client Key'}
              {...formik.getFieldProps('tiktok_client_key')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.tiktok_client_key && formik.errors.tiktok_client_key && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {String(formik.errors.tiktok_client_key)}
            </p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="tiktok_client_secret" className="text-sm font-medium text-foreground">
            {t('social_tiktok_client_secret') || 'TikTok Client Secret'}
          </Label>
          <div className="relative">
            <PasswordInput
              id="tiktok_client_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('tiktok_client_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.tiktok_client_secret && formik.errors.tiktok_client_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {String(formik.errors.tiktok_client_secret)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TikTokConfig
