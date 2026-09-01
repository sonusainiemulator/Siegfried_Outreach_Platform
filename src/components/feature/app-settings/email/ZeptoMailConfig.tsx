'use client'

import TextInput from '@/components/shared/form-fields/TextInput'
import { useTranslation } from 'react-i18next'

const ZeptoMailConfig = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 p-8 rounded-border-radius inner-card glass-dark-card bg-accent/5 border border-glass-border/50 animate-in slide-in-from-top-4 duration-500">
      <h3 className="font-medium text-base text-primary/60">ZeptoMail API Settings</h3>
      <div className="max-w-md">
        <TextInput name="config.zeptomail_api_key" label="API Key (Send Mail Token)" placeholder="Zoho-enczapikey ..." type="password" />
      </div>
    </div>
  )
}

export default ZeptoMailConfig
