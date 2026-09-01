'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { WhatsappFormProps } from '@/types'
import { useTranslation } from 'react-i18next'

const WhatsappForm = ({ data, onChange }: WhatsappFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-5 py-4">
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('whatsapp_sid', { defaultValue: 'Whatsapp sid' })}
        </Label>
        <Input
          placeholder=""
          value={data.sid}
          onChange={(e) => onChange({ ...data, sid: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('whatsapp_token', { defaultValue: 'Whatsapp token' })}
        </Label>
        <PasswordInput
          placeholder=""
          value={data.token}
          onChange={(e) => onChange({ ...data, token: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('whatsapp_phone', { defaultValue: 'Whatsapp phone' })}
        </Label>
        <Input
          placeholder=""
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('whatsapp_sandbox_phone', { defaultValue: 'Whatsapp sandbox phone' })}
        </Label>
        <Input
          placeholder=""
          value={data.sandboxPhone}
          onChange={(e) => onChange({ ...data, sandboxPhone: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('environment', { defaultValue: 'Environment' })}
        </Label>
        <select
          value={data.environment}
          onChange={(e) =>
            onChange({ ...data, environment: e.target.value as 'sandbox' | 'production' })
          }
          className="w-full rounded-[8px] glass-card glass-dark-card border border-input-border-color h-12 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <option value="sandbox">{t('sandbox', { defaultValue: 'SANDBOX' })}</option>
          <option value="production">{t('production', { defaultValue: 'PRODUCTION' })}</option>
        </select>
      </div>
    </div>
  )
}

export default WhatsappForm
