'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const RedditConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-orange-500/10 text-orange-500">
          <MessageCircle className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_reddit', { defaultValue: 'Reddit' })}</h3>
        <SetupGuideTooltip
          title={platformSetupGuides.reddit.title}
          steps={platformSetupGuides.reddit.steps}
          links={platformSetupGuides.reddit.links}
          redirectUri={platformSetupGuides.reddit.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card  border border-glass-border/50">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="reddit_client_id" className="text-sm font-medium text-foreground">
            {t('social_reddit_client_id', { defaultValue: 'Reddit Client ID' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="reddit_client_id"
              placeholder={t('social_reddit_client_id_placeholder', { defaultValue: 'Enter Reddit Client ID' })}
              {...formik.getFieldProps('reddit_client_id')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.reddit_client_id && formik.errors.reddit_client_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.reddit_client_id}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="reddit_client_secret" className="text-sm font-medium text-foreground">
            {t('social_reddit_client_secret', { defaultValue: 'Reddit Client Secret' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="reddit_client_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('reddit_client_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.reddit_client_secret && formik.errors.reddit_client_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.reddit_client_secret}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RedditConfig
