'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ShadcnInput from '@/components/ui/input'
import { ChatShareModalProps } from '@/types'
import { Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ChatShareModal: React.FC<ChatShareModalProps> = ({ isOpen, onClose, sessionId }) => {
  const { t } = useTranslation()
  const [generatedLink, setGeneratedLink] = useState('')

  const handleGenerateLink = () => {
    const url = new URL(window.location.href)
    if (sessionId) {
      url.searchParams.set('sessionId', sessionId)
    }
    setGeneratedLink(url.toString())
  }

  useEffect(() => {
    if (isOpen) {
      handleGenerateLink()
    }
  }, [isOpen, sessionId])

  const handleCopyLink = () => {
    if (!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    toast.success(t('copied_to_clipboard'))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none shadow-2xl bg-light-body rounded-border-radius">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between border-b border-border/50">
          <DialogTitle className="text-xl font-medium text-title-color dark:text-white">{t('chat_share')}</DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 space-y-6">
          <div className="relative group">
            <ShadcnInput
              readOnly
              value={generatedLink || t('please_generate_link')}
              className="w-full h-12 pl-5 pr-14 rounded-[8px] bg-accent/20 glass-card glass-dark-card border border-border/50 focus:outline-none text-sm text-foreground/80 font-medium placeholder:text-muted-foreground/50 transition-all group-hover:bg-accent/30 focus-visible:ring-0"
            />
            <Button
              size="icon"
              variant="ghost"
              disabled={!generatedLink}
              onClick={handleCopyLink}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-accent/50 text-muted-foreground transition-all"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleCopyLink}
              className="flex-1 h-12 rounded-xl bg-primary! hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4 mr-2" />
              {t('copy_link', { defaultValue: 'Copy Link' })}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 px-6 h-12 rounded-xl border-glass-border font-bold text-sm transition-all active:scale-95"
            >
              {t('close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatShareModal
