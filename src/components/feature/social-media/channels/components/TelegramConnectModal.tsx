'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { useConnectSocialAccountMutation } from '@/redux/api/socialMediaApi'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'
import SetupGuideTooltip from '../../social-settings/social/SetupGuideTooltip'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface TelegramConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnected: () => void
}

export default function TelegramConnectModal({ isOpen, onClose, onConnected }: TelegramConnectModalProps) {
  const { t } = useTranslation()
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [connectAccount, { isLoading: isConnecting }] = useConnectSocialAccountMutation()

  const handleConnect = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      toast.error('Bot Token and Chat/Channel ID are required.')
      return
    }

    try {
      const res = await connectAccount({
        platform: 'telegram',
        accountId: chatId.trim(),
        accountName: 'Telegram Feed', // backend will fetch the real name
        accessToken: botToken.trim()
      }).unwrap()

      toast.success(res.message || 'Telegram connected successfully!')
      setBotToken('')
      setChatId('')
      onConnected()
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to connect Telegram channel.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-white dark:bg-[#0c101d] border border-neutral-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Connect Telegram Channel</DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Link your Telegram channel or group to publish posts using your AI scheduler.
                </DialogDescription>
              </div>
            </div>
            
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
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs leading-relaxed space-y-2 text-neutral-600 dark:text-neutral-300">
            <p className="font-bold flex items-center gap-1.5 text-primary">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Setup Instructions:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a bot using Telegram's <strong>@BotFather</strong> to get a Bot Token.</li>
              <li>Add your Bot as an <strong>Administrator</strong> in your Channel or Group.</li>
              <li>Provide your Channel username (e.g. <code>@mychannel</code>) or Chat ID below.</li>
            </ol>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Telegram Bot Token</Label>
              <PasswordInput
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsT..."
                className="h-10 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Channel Username / Chat ID</Label>
              <Input
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="@mychannel or -100123456789"
                className="h-10 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl font-semibold h-11"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl font-semibold h-11 bg-primary text-white"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                'Link Channel'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
