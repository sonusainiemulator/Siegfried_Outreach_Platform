'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Radio } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SetupGuideTooltip from './SetupGuideTooltip'

const AblyConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px] bg-ably/10 text-ably">
          <Radio className="w-5 h-5 fill-current" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color  dark:text-white">{t('social_ably_platform')}</h3>
        <SetupGuideTooltip
          title="Ably Realtime Setup"
          steps={[
            'Create an app in the Ably dashboard.',
            'Open API Keys and create a key with publish/subscribe capabilities.',
            'Copy the full API key in key:secret format.',
            'Paste the key here and save settings.',
            'Test realtime updates from your social inbox after saving.',
          ]}
          links={[
            { label: 'Ably Dashboard', url: 'https://ably.com/dashboard' },
            { label: 'API Key Docs', url: 'https://ably.com/docs/auth/api-keys' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 inner-card glass-dark-card rounded-border-radius!">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="ably_api_key" className="text-sm font-medium text-foreground">
            {t('api_key')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="ably_api_key"
              placeholder={t('social_ably_placeholder')}
              {...formik.getFieldProps('ably_api_key')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.ably_api_key && formik.errors.ably_api_key && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.ably_api_key}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AblyConfig
