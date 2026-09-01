'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SetupGuideTooltip from './SetupGuideTooltip'

const TelegramConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-sky-500/10 text-sky-500">
          <Send className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_telegram', { defaultValue: 'Telegram Bot' })}</h3>
        <SetupGuideTooltip
          title="Telegram Developer & Bot Setup"
          steps={[
            'Create bot via @BotFather in Telegram.',
            'Add bot as Admin in target channel/group with Send permissions.',
            'Get Chat ID: query Telegram /getUpdates API after sending a test message.',
            'Local Webhook: POST to /api/ai-agents/webhook/telegram/:chatbotId.'
          ]}
          links={[
            { label: 'Bot API Core', url: 'https://core.telegram.org/bots/api' },
            { label: 'Developer Setup Guide', url: 'file:///www/wwwroot/api.siegfriedoutreach.com/docs/TELEGRAM_DEVELOPER_GUIDE.md' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card border border-glass-border/50">
        <p className="md:col-span-2 text-xs text-muted-foreground -mt-2">
          {t('social_telegram_settings_desc', {
            defaultValue:
              'Optional: save default Telegram Bot Token credentials here to enable automated fallback channel publishing and 24/7 autonomous chatbot sync.',
          })}
        </p>

        <div className="space-y-2 group/input flex flex-col md:col-span-2">
          <Label htmlFor="telegram_bot_token" className="text-sm font-medium text-foreground">
            {t('telegram_bot_token', { defaultValue: 'Telegram Bot Token' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="telegram_bot_token"
              placeholder="123456789:ABCdefGhIJKlmNoPQRsT..."
              {...formik.getFieldProps('telegram_bot_token')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.telegram_bot_token && formik.errors.telegram_bot_token && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.telegram_bot_token}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TelegramConfig;
