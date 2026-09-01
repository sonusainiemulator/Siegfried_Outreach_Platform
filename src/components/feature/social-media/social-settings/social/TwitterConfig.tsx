'use client'

import PasswordInput from '@/components/ui/PasswordInput'
import Label from '@/components/ui/label'
import { FormikProps } from '@/types'
import { Twitter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const TwitterConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-twitter/10 text-twitter">
          <Twitter className="w-5 h-5 fill-current" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_twitter_platform')}</h3>
        <SetupGuideTooltip
          title={platformSetupGuides.twitter.title}
          steps={platformSetupGuides.twitter.steps}
          links={platformSetupGuides.twitter.links}
          redirectUri={platformSetupGuides.twitter.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card border border-glass-border/50">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="twitter_client_id" className="text-sm font-medium text-foreground">
            {t('social_twitter_client_id')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="twitter_client_id"
              placeholder={t('social_twitter_client_id_placeholder')}
              {...formik.getFieldProps('twitter_client_id')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.twitter_client_id && formik.errors.twitter_client_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.twitter_client_id}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="twitter_client_secret" className="text-sm font-medium text-foreground">
            {t('social_twitter_client_secret')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="twitter_client_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('twitter_client_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.twitter_client_secret && formik.errors.twitter_client_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.twitter_client_secret}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="twitter_consumer_key" className="text-sm font-medium text-foreground">
            {t('social_twitter_consumer_key')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="twitter_consumer_key"
              placeholder={t('social_twitter_consumer_key_placeholder')}
              {...formik.getFieldProps('twitter_consumer_key')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.twitter_consumer_key && formik.errors.twitter_consumer_key && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.twitter_consumer_key}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="twitter_consumer_secret" className="text-sm font-medium text-foreground">
            {t('social_twitter_consumer_secret')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="twitter_consumer_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('twitter_consumer_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.twitter_consumer_secret && formik.errors.twitter_consumer_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.twitter_consumer_secret}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="twitter_oauth_token" className="text-sm font-medium text-foreground">
            {t('social_twitter_access_token')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="twitter_oauth_token"
              placeholder={t('social_twitter_access_token_placeholder')}
              {...formik.getFieldProps('twitter_oauth_token')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.twitter_oauth_token && formik.errors.twitter_oauth_token && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.twitter_oauth_token}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="twitter_oauth_token_secret" className="text-sm font-medium text-foreground">
            {t('social_twitter_token_secret')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="twitter_oauth_token_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('twitter_oauth_token_secret')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.twitter_oauth_token_secret && formik.errors.twitter_oauth_token_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.twitter_oauth_token_secret}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TwitterConfig
