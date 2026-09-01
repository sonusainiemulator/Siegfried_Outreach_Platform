'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { EmailTestModalProps } from '@/types'
import { Loader2, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EmailTestModal = ({ show, onClose, onSend, testEmail, setTestEmail, isTesting }: EmailTestModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="border-glass-border bg-light-body dark:bg-modal-bg-color backdrop-blur-2xl rounded-border-radius sm:p-6 p-4 sm:max-w-lg! max-w-[calc(100%-2rem)]! shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
        <DialogHeader className="space-y-3">

          <DialogTitle className="text-xl font-medium">{t('send_test_email')}</DialogTitle>
          <DialogDescription className="font-medium text-left rtl:text-right">{t('enter_test_email_desc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="testEmail" className="text-sm font-medium ml-1">
              {t('recipient_email')}
            </Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="h-12 rounded-[8px] glass-card glass-dark-card focus:ring-primary/20"
            />
          </div>
        </div>
        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            variant="ghost"
            className="rounded-[8px] mr-1.75 rtl:mr-0 rtl:ml-1.75 w-full sm:h-12 h-10 font-medium text-sm bg-light-gray text-light-text-color dark:text-white dark:hover:bg-light-gray!"
            onClick={onClose}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={onSend}
            disabled={isTesting || !testEmail}
            variant="premium"
            className="rounded-[8px] w-full sm:h-12 h-10 px-8 font-medium text-sm  shadow-none"
          >
            {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {t('send_test')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmailTestModal
