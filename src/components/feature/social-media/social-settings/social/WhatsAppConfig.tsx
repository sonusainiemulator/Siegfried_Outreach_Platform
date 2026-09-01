'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const WhatsAppConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-emerald-500/10 text-emerald-500">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_whatsapp', { defaultValue: 'WhatsApp' })}</h3>
        <SetupGuideTooltip
          title={platformSetupGuides.whatsapp.title}
          steps={platformSetupGuides.whatsapp.steps}
          links={platformSetupGuides.whatsapp.links}
          redirectUri={platformSetupGuides.whatsapp.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card  border border-glass-border/50">
        <p className="md:col-span-2 text-xs text-muted-foreground -mt-2">
          {t('social_whatsapp_settings_desc', {
            defaultValue:
              'Optional: save default Meta Cloud API credentials here so they pre-fill the "Official API" tab when connecting WhatsApp on the Channels page. QR-code linking does not need any credentials.',
          })}
        </p>

        <div className="space-y-2 group/input flex flex-col md:col-span-2">
          <Label htmlFor="whatsapp_access_token" className="text-sm font-medium text-foreground">
            {t('whatsapp_access_token', { defaultValue: 'Meta System User Access Token' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="whatsapp_access_token"
              placeholder="EAAG..."
              {...formik.getFieldProps('whatsapp_access_token')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.whatsapp_access_token && formik.errors.whatsapp_access_token && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.whatsapp_access_token}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="whatsapp_phone_number_id" className="text-sm font-medium text-foreground">
            {t('whatsapp_phone_number_id', { defaultValue: 'WhatsApp Phone Number ID' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="whatsapp_phone_number_id"
              placeholder="1029384756..."
              {...formik.getFieldProps('whatsapp_phone_number_id')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.whatsapp_phone_number_id && formik.errors.whatsapp_phone_number_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.whatsapp_phone_number_id}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="whatsapp_business_account_id" className="text-sm font-medium text-foreground">
            {t('whatsapp_business_account_id', { defaultValue: 'WhatsApp Business Account ID (Optional)' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="whatsapp_business_account_id"
              placeholder="1029384756..."
              {...formik.getFieldProps('whatsapp_business_account_id')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.whatsapp_business_account_id && formik.errors.whatsapp_business_account_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.whatsapp_business_account_id}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WhatsAppConfig
