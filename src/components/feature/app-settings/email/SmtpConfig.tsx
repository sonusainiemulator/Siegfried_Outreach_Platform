'use client'

import SelectField from '@/components/shared/form-fields/SelectField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { useFormikContext } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'

const SmtpConfig = () => {
  const { t } = useTranslation()
  const { setFieldValue } = useFormikContext<any>()

  return (
    <div className="space-y-8 sm:p-6 p-4 rounded-border-radius inner-card glass-dark-card bg-accent/5 border border-glass-border/50 animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-base text-primary">{t('smtp_settings')}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TextInput name="config.smtp_host" label={t('smtp_host')} placeholder="e.g. smtp.gmail.com" />
        <TextInput
          name="config.smtp_port"
          label={t('smtp_port')}
          placeholder="e.g. 587"
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (value === '' || /^\d+$/.test(value)) {
              setFieldValue('config.smtp_port', value)
            }
          }}
        />
        <SelectField
          name="config.mail_encryption"
          label={t('encryption')}
          options={[
            { label: 'TLS (Recommended)', value: 'tls' },
            { label: 'SSL (Legacy)', value: 'ssl' },
          ]}
        />
        <TextInput name="config.smtp_user" label={t('smtp_user')} placeholder="e.g. user@example.com" />
        <TextInput name="config.smtp_pass" label={t('smtp_pass')} placeholder="••••••••" type="password" />
      </div>
    </div>
  )
}

export default SmtpConfig
