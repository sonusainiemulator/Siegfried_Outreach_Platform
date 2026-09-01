'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingApi'
import { ApiError } from '@/types'
import { useFormik } from 'formik'
import { Loader2, Save } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'
import AblyConfig from './social/AblyConfig'
import FacebookConfig from './social/FacebookConfig'
import GoogleConfig from './social/GoogleConfig'
import LinkedinConfig from './social/LinkedinConfig'
import RedditConfig from './social/RedditConfig'
import ThreadsConfig from './social/ThreadsConfig'
import TikTokConfig from './social/TikTokConfig'
import TwitterConfig from './social/TwitterConfig'
import WhatsAppConfig from './social/WhatsAppConfig'
import TelegramConfig from './social/TelegramConfig'
import YouTubeConfig from './social/YouTubeConfig'
import WordPressConfig from './social/WordPressConfig'

export default function SocialMediaConfig() {
  const { t } = useTranslation()
  const { data: userData, isLoading } = useGetUserSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation()

  const formik = useFormik({
    initialValues: {
      app_id: '',
      app_secret: '',
      linkedin_client_id: '',
      linkedin_client_secret: '',
      google_client_id: '',
      google_client_secret: '',
      tiktok_client_key: '',
      tiktok_client_secret: '',
      twitter_client_id: '',
      twitter_client_secret: '',
      twitter_consumer_key: '',
      twitter_consumer_secret: '',
      twitter_oauth_token: '',
      twitter_oauth_token_secret: '',
      reddit_client_id: '',
      reddit_client_secret: '',
      threads_app_id: '',
      threads_app_secret: '',
      whatsapp_access_token: '',
      whatsapp_phone_number_id: '',
      whatsapp_business_account_id: '',
      ably_api_key: '',
      telegram_bot_token: '',
      wordpress_site_url: '',
      wordpress_username: '',
      wordpress_app_password: '',
    },
    validationSchema: Yup.object({
      app_id: Yup.string(),
      app_secret: Yup.string(),
      linkedin_client_id: Yup.string(),
      linkedin_client_secret: Yup.string(),
      google_client_id: Yup.string(),
      google_client_secret: Yup.string(),
      tiktok_client_key: Yup.string(),
      tiktok_client_secret: Yup.string(),
      twitter_client_id: Yup.string(),
      twitter_client_secret: Yup.string(),
      twitter_consumer_key: Yup.string(),
      twitter_consumer_secret: Yup.string(),
      twitter_oauth_token: Yup.string(),
      twitter_oauth_token_secret: Yup.string(),
      reddit_client_id: Yup.string(),
      reddit_client_secret: Yup.string(),
      threads_app_id: Yup.string(),
      threads_app_secret: Yup.string(),
      whatsapp_access_token: Yup.string(),
      whatsapp_phone_number_id: Yup.string(),
      whatsapp_business_account_id: Yup.string(),
      ably_api_key: Yup.string(),
      telegram_bot_token: Yup.string(),
      wordpress_site_url: Yup.string().url('Must be a valid URL (include https://)'),
      wordpress_username: Yup.string(),
      wordpress_app_password: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          telegramConfig: {
            botToken: values.telegram_bot_token
          }
        };
        const res = await updateSettings(payload).unwrap()
        toast.success(res.message || t('social_settings_updated'))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('social_settings_failed'))
      }
    },
  })

  useEffect(() => {
    if (userData?.setting) {
      formik.resetForm({
        values: {
          app_id: userData.setting.app_id || '',
          app_secret: userData.setting.app_secret || '',
          linkedin_client_id: userData.setting.linkedin_client_id || '',
          linkedin_client_secret: userData.setting.linkedin_client_secret || '',
          google_client_id: userData.setting.google_client_id || '',
          google_client_secret: userData.setting.google_client_secret || '',
          tiktok_client_key: userData.setting.tiktok_client_key || '',
          tiktok_client_secret: userData.setting.tiktok_client_secret || '',
          twitter_client_id: userData.setting.twitter_client_id || '',
          twitter_client_secret: userData.setting.twitter_client_secret || '',
          twitter_consumer_key: userData.setting.twitter_consumer_key || '',
          twitter_consumer_secret: userData.setting.twitter_consumer_secret || '',
          twitter_oauth_token: userData.setting.twitter_oauth_token || '',
          twitter_oauth_token_secret: userData.setting.twitter_oauth_token_secret || '',
          reddit_client_id: userData.setting.reddit_client_id || '',
          reddit_client_secret: userData.setting.reddit_client_secret || '',
          threads_app_id: userData.setting.threads_app_id || '',
          threads_app_secret: userData.setting.threads_app_secret || '',
          whatsapp_access_token: userData.setting.whatsapp_access_token || '',
          whatsapp_phone_number_id: userData.setting.whatsapp_phone_number_id || '',
          whatsapp_business_account_id: userData.setting.whatsapp_business_account_id || '',
          ably_api_key: userData.setting.ably_api_key || '',
          telegram_bot_token: userData.setting.telegramConfig?.botToken || '',
          wordpress_site_url: userData.setting.wordpress_site_url || '',
          wordpress_username: userData.setting.wordpress_username || '',
          wordpress_app_password: userData.setting.wordpress_app_password || '',
        },
      })
    }
  }, [userData])

  if (isLoading) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  return (
    <div className="animate-in fade-in duration-700">
      <Card className="border-glass-border glass-dark-card bg-glass-bg backdrop-blur-xl rounded-border-radius group hover:shadow-primary/5 transition-all duration-500">
        <CardContent className="sm:p-6 p-4 pt-6">
          <form onSubmit={formik.handleSubmit} className="space-y-10">
            <FacebookConfig formik={formik} />
            <TwitterConfig formik={formik} />
            <LinkedinConfig formik={formik} />
            <GoogleConfig formik={formik} />
            <YouTubeConfig formik={formik} />
            <TikTokConfig formik={formik} />
            <RedditConfig formik={formik} />
            <ThreadsConfig formik={formik} />
            <WhatsAppConfig formik={formik} />
            <TelegramConfig formik={formik} />
            <AblyConfig formik={formik} />
            <WordPressConfig formik={formik} />

            <div className="flex justify-end pt-6 border-t border-glass-border/30">
              <Button
                type="submit"
                disabled={isUpdating || !formik.dirty}
                variant="premium"
                className="sm:h-12 h-10 p-button-padding! btn-color  font-medium text-base group active:scale-95 transition-all shadow-none bg-primary text-white"
              >
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {t('social_sync_platform')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
