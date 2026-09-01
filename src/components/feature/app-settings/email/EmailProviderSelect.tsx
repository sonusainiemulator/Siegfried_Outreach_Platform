'use client'

import SelectField from '@/components/shared/form-fields/SelectField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Cpu, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EmailProviderSelect = () => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-5">
          <Cpu className="w-6 h-6 text-primary" />
          <h4 className="text-base font-medium text-title-color dark:text-white">
            {t('provider_engine')}
          </h4>
        </div>
        <SelectField
          name="emailProvider"
          label={t('email_provider')}
          options={[
            { label: 'SMTP Direct (Nodemailer)', value: 'nodemailer' },
            { label: 'SendGrid API', value: 'sendgrid' },
            { label: 'AWS SES', value: 'aws-ses' },
            { label: 'ZeptoMail API', value: 'zeptomail' },
            { label: 'Emailit API', value: 'emailit' },
          ]}
        />
      </div>

      <div className="space-y-6 md:col-span-2">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h4 className="text-base font-medium text-title-color dark:text-white">
            {t('sender_identity')}
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextInput name="fromName" label={t('from_name')} placeholder="e.g. Siegfried Social Media Marketing Plateform Support" />
          <TextInput name="fromEmail" label={t('from_email')} placeholder="e.g. support@pixelai.com" type="email" />
        </div>
      </div>
    </div>
  )
}

export default EmailProviderSelect
