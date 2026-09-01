import { TelegramPreviewProps } from '@/types/components/campaigns'
import { MoreVertical, Paperclip, Search, Send, Sparkles } from 'lucide-react'
import Image from 'next/image'

export const TelegramPreview = ({ values, mediaPreview, t }: TelegramPreviewProps) => {
  return (
    <div className="relative group">
      <div className="absolute -top-4 -right-6 z-30 bg-destructive text-white text-xs opacity-0 sm:opacity-100 font-medium px-3 py-1 rounded-full animate-bounce flex items-center gap-1 border-1 border-destructive dark:border-zinc-900">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        {t('live_preview')}
      </div>

      <div className="relative w-[310px] h-[620px] bg-whatsapp-light dark:bg-zinc-950 rounded-[2.2rem] border-[5px] border-zinc-900 dark:border-zinc-800 overflow-hidden shrink-0 transition-all duration-500 flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-zinc-900 rounded-b-2xl z-20 flex items-center justify-center gap-1.5 px-4 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <div className="w-12 h-1 rounded-full bg-zinc-800" />
        </div>

        {/* Telegram Header */}
        <div className="bg-telegram text-white p-4 pt-10 flex items-center gap-3 relative z-10 shadow-md">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold truncate leading-none">
              {t('platform_identity', { defaultValue: 'Siegfried Social Media Marketing Plateform' })}
            </p>
            <p className="text-[10px] opacity-80 truncate mt-0.5">
              {t('verified_partner', { defaultValue: 'Verified Partner' })}
            </p>
          </div>
          <div className="flex items-center gap-3 opacity-90">
            <Search className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Chat Body */}
        <div
          className="flex-1 h-full relative overflow-y-auto custom-scrollbar flex flex-col p-4 pb-20"
          style={{
            backgroundImage:
              "url('/images/telegram_preview_image.png')",
            backgroundSize: '400px',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" />

          {/* Message Bubble */}
          <div className="relative max-w-[85%] z-10 animate-in fade-in slide-in-from-left-4 duration-700 mt-2 self-start">
            <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm overflow-hidden border border-white/20 dark:border-white/5 p-0.5">
              {mediaPreview && (
                <div className="rounded-2xl overflow-hidden bg-zinc-100 flex justify-center aspect-video relative group/media">
                  {mediaPreview.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={mediaPreview} className="w-full h-full object-cover" />
                  ) : (
                    <Image
                      src={mediaPreview}
                      alt="Preview"
                      width={100}
                      height={100}
                      unoptimized
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105 rounded-2xl"
                    />
                  )}
                </div>
              )}

              <div className="p-3">
                <h4 className="font-bold text-telegram text-[14px] leading-tight mb-1">
                  {values.name || t('campaign_title_preview', { defaultValue: 'Broadcast Title' })}
                </h4>
                <p className="text-[14px] text-zinc-800 leading-snug whitespace-pre-wrap break-words">
                  {values.content ||
                    t('message_preview_placeholder', { defaultValue: 'Your message will appear here...' })}
                </p>
                <div className="text-[9px] text-zinc-400 text-right mt-1.5 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Input Mockup */}
        <div className="absolute bottom-4 left-4 right-4 h-11 bg-white rounded-full shadow-lg z-10 flex items-center px-4 gap-3 border border-zinc-200">
          <Paperclip className="w-5 h-5 text-zinc-400" />
          <div className="flex-1 text-zinc-400 text-sm">{t('message', { defaultValue: 'Message' })}</div>
          <Send className="w-5 h-5 text-telegram" />
        </div>
      </div>
    </div>
  )
}

