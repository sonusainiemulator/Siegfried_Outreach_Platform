'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { TelegramFormProps } from '@/types'
import { useTranslation } from 'react-i18next'

const TelegramForm = ({ data, onChange }: TelegramFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-5 py-4">
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('bot_username', { defaultValue: 'Bot Username' })}
        </Label>
        <Input
          placeholder="@your_bot_username"
          value={data.botName}
          onChange={(e) => onChange({ ...data, botName: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('bot_token', { defaultValue: 'Bot Token' })}
        </Label>
        <PasswordInput
          placeholder="Enter Bot Token"
          value={data.botToken}
          onChange={(e) => onChange({ ...data, botToken: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
    </div>
  )
}

export default TelegramForm
