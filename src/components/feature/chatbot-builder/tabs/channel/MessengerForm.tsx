'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { MessengerFormProps } from '@/types'
import { useTranslation } from 'react-i18next'

const MessengerForm = ({ data, onChange }: MessengerFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-5 py-4">
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('app_id', { defaultValue: 'App ID' })}
        </Label>
        <Input
          placeholder="Enter App ID"
          value={data.appId}
          onChange={(e) => onChange({ ...data, appId: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('app_secret', { defaultValue: 'App Secret' })}
        </Label>
        <PasswordInput
          placeholder="Enter App Secret"
          value={data.appSecret}
          onChange={(e) => onChange({ ...data, appSecret: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('page_id', { defaultValue: 'Page ID' })}
        </Label>
        <Input
          placeholder="Enter Page ID"
          value={data.pageId}
          onChange={(e) => onChange({ ...data, pageId: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('page_name', { defaultValue: 'Page Name' })}
        </Label>
        <Input
          placeholder="Enter Page Name"
          value={data.pageName}
          onChange={(e) => onChange({ ...data, pageName: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('access_token', { defaultValue: 'Access Token' })}
        </Label>
        <Input
          placeholder="Enter Access Token"
          value={data.accessToken}
          onChange={(e) => onChange({ ...data, accessToken: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">
          {t('verify_token', { defaultValue: 'Verify token' })}
        </Label>
        <Input
          placeholder="Enter Verify Token"
          value={data.verifyToken}
          onChange={(e) => onChange({ ...data, verifyToken: e.target.value })}
          className="rounded-[8px] border-input-border-color focus:ring-primary/20 glass-dark-card h-12"
        />
      </div>
    </div>
  )
}

export default MessengerForm
