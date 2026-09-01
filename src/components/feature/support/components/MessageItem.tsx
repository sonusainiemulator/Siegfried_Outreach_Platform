'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SupportMessageItemProps } from '@/types/components/support'
import { getMediaUrl } from '@/utils'
import { downloadFile } from '@/utils/download'
import { format } from 'date-fns'
import { Copy, Download } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import MessageAttachment from './MessageAttachment'

const MessageItem = ({ msg, isAgent, conversation, activeHighlightId, onImageClick, messageRef }: SupportMessageItemProps) => {
  const { t } = useTranslation()

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)
  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url)

  const handleDownload = async (url: string, filename: string) => {
    downloadFile(url, filename)
  }

  const renderContent = () => {
    if (!msg.content) return null

    const fullUrl = getMediaUrl(msg.content)
    if (!fullUrl) return <p className="leading-relaxed whitespace-break-spaces break-all">{msg.content}</p>

    // Check if it's an image or video path
    const isImageContent =
      (msg.content.startsWith('/uploads/') || msg.content.startsWith('http') || msg.content.startsWith('uploads/')) && isImageUrl(fullUrl)
    const isVideoContent =
      (msg.content.startsWith('/uploads/') || msg.content.startsWith('http') || msg.content.startsWith('uploads/')) && isVideoUrl(fullUrl)

    if (isImageContent) {
      return (
        <div
          className="mt-1 cursor-pointer group/img-msg overflow-hidden rounded-xl border border-white/10 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] relative"
          onClick={() => onImageClick?.(fullUrl)}
        >
          <Image  src={fullUrl} alt="Message content" width={100} height={100} unoptimized className="max-w-[200px] h-auto object-cover" loading="lazy" />
          <div className="absolute top-2 right-2 opacity-0 group-hover/img-msg:opacity-100 transition-opacity z-10">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-lg bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(fullUrl, 'image.jpg')
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }

    if (isVideoContent) {
      return (
        <div className="mt-1">
          <video src={fullUrl} controls className="max-w-full h-auto rounded-xl border border-white/10 shadow-md" />
        </div>
      )
    }

    return <p className="leading-relaxed whitespace-break-spaces break-all">{msg.content}</p>
  }

  return (
    <div
      className={cn(
        'flex flex-col group animate-in slide-in-from-bottom-2 duration-300',
        isAgent ? 'items-end' : 'items-start',
      )}
    >
      <div
        ref={messageRef}
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-border-radius shadow-sm text-sm transition-all duration-300 relative group/msg',
          isAgent
            ? 'bg-primary text-primary-foreground rounded-tr-none hover:shadow-primary/20 hover:shadow-md'
            : 'bg-primary/20 text-primary rounded-tl-none',
          (activeHighlightId === msg.id || activeHighlightId === msg._id) &&
            'ring-4 ring-primary ring-offset-2 scale-105',
        )}
      >
        {renderContent()}
        {msg.attachments?.map((att: any, ai: number) => (
          <MessageAttachment key={ai} attachment={att} onImageClick={onImageClick} />
        ))}

        {!(
          (msg.content?.startsWith('/uploads/') || msg.content?.startsWith('http')) &&
          (isImageUrl(msg.content) || isVideoUrl(msg.content))
        ) &&
          msg.content && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity z-10',
                isAgent ? 'end-full me-2 flex-row-reverse' : 'start-full ms-2',
              )}
            >
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(msg.content)
                  toast.success(t('copied_to_clipboard'))
                }}
                className="p-1.5! rounded-[8px] hover:bg-muted text-muted-foreground hover:text-primary transition-colors  border border-glass-border"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
      </div>
      <div className="flex items-center gap-2 mt-1 px-1">
        <span className="text-[10px] font-bold text-muted-foreground/60 ">
          {isAgent ? msg.senderName || 'Agent' : conversation.userName}
        </span>
        <span className="text-[10px] text-muted-foreground/40 font-medium">
          {msg.timestamp ? format(new Date(msg.timestamp), 'hh:mm a') : ''}
        </span>
      </div>
    </div>
  )
}

export default MessageItem
