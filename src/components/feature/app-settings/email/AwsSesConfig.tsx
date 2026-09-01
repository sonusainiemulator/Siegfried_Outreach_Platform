'use client'

import TextInput from '@/components/shared/form-fields/TextInput'
import { useTranslation } from 'react-i18next'

const AwsSesConfig = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 p-8 rounded-border-radius inner-card glass-dark-card bg-accent/5 border border-glass-border/50 animate-in slide-in-from-top-4 duration-500">
      <h3 className="font-medium text-base text-primary/60">AWS SES Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <TextInput name="config.aws_ses_region" label="AWS Region" placeholder="e.g. us-east-1" />
        <TextInput name="config.aws_ses_access_key" label="Access Key ID" placeholder="AKIA..." type="password" />
        <div className="sm:col-span-2">
          <TextInput name="config.aws_ses_secret_key" label="Secret Access Key" placeholder="..." type="password" />
        </div>
      </div>
    </div>
  )
}

export default AwsSesConfig
