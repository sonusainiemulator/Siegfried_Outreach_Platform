'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BACKEND_API_URL } from '@/constants'
import { ViewBroadcastModalProps } from '@/types'
import { format } from 'date-fns'
import { Calendar, Mail, MessageSquare, Phone, Send } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'

export const ViewBroadcastModal = ({ isOpen, onClose, broadcast }: ViewBroadcastModalProps) => {
  const { t } = useTranslation()

  if (!broadcast) return null

  const sanitizeContent = DOMPurify.sanitize(broadcast?.htmlTemplate as any || "", {
   ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
 })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
      case 'published':
        return 'bg-primary/10 text-primary border border-primary/20'
      case 'sending':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
      case 'failed':
        return 'bg-destructive/10 text-destructive border border-destructive/20'
      case 'scheduled':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
      default:
        return 'bg-muted text-muted-foreground border border-border'
    }
  }

  const getChannelIcon = () => {
    switch (broadcast.channel) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'whatsapp':
        return <Phone className="h-4 w-4" />
      case 'telegram':
        return <Send className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {getChannelIcon()}
            </div>
            <DialogTitle>{broadcast.name}</DialogTitle>
          </div>
          <DialogDescription>
            {t('broadcast_details_desc', { defaultValue: 'Detailed information about this broadcast campaign' })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('status')}</span>
              <div className="flex">
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusStyles(broadcast.status)}`}>
                  {t(broadcast.status)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('scheduled_at')}</span>
              <div className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {broadcast.scheduledAt ? format(new Date(broadcast.scheduledAt), 'dd-MM-yyyy hh:mm a') : t('instantly')}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('sent_count', { defaultValue: 'Sent Count' })}</span>
              <div className="text-sm font-semibold">{broadcast.sentCount || 0}</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('channel')}</span>
              <div className="text-sm capitalize">{broadcast.channel}</div>
            </div>
          </div>

          {broadcast.channel === 'email' && broadcast.subject && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('subject')}</span>
              <div className="text-sm font-medium p-3 rounded-md bg-muted/50 border border-border/50">
                {broadcast.subject}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">{t('content')}</span>
            <div className="mt-2 rounded-md border border-border/50 bg-muted/30 overflow-hidden">
              {broadcast.channel === 'email' && broadcast.htmlTemplate ? (
                <div 
                  className="p-4 text-sm max-h-[300px] overflow-y-auto bg-white dark:bg-zinc-900"
                  dangerouslySetInnerHTML={{ __html: sanitizeContent }}
                />
              ) : (
                <div className="p-4 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {broadcast.content || broadcast.prompt || t('no_content_available')}
                </div>
              )}
            </div>
          </div>

          {broadcast.media && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('media')}</span>
              <div className="mt-2">
                <Image
                  src={broadcast.media.startsWith('http') || broadcast.media.startsWith('data:') ? broadcast.media : `${BACKEND_API_URL}/${broadcast.media}`} 
                  alt="Media" 
                  className="max-w-full h-auto rounded-md border border-border/50 shadow-sm"
                  width={200}
                  height={200}
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
