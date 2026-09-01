import { WhatsAppPreviewProps } from '@/types/components/campaigns'
import { ArrowLeft, CheckCheck, CheckCircle2, MoreVertical, Phone, Sparkles, Video } from 'lucide-react'
import Image from 'next/image'

export const WhatsAppPreview = ({ values, mediaPreview, t }: WhatsAppPreviewProps) => {
  return (
    <div className="relative group">
      <div className="absolute -top-4 -right-6 z-30 opacity-0 sm:opacity-100 bg-destructive text-white text-xs font-medium px-3 py-1 rounded-full animate-bounce flex items-center gap-1 border-1 border-destructive dark:border-zinc-900">
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

        {/* WhatsApp Header */}
        <div className="bg-whatsapp-teal dark:bg-whatsapp-dark text-white p-4 pt-10 flex items-center gap-3 relative z-10 shadow-md">
          <ArrowLeft className="w-5 h-5 opacity-80" />
          <div className="w-10 h-10 rounded-full bg-zinc-400 flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0">
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-[15px] font-bold truncate leading-none">
                {t('platform_identity', { defaultValue: 'Siegfried Social Media Marketing Plateform' })}
              </p>
              <CheckCircle2 className="w-3.5 h-3.5 fill-blue-400 text-white" />
            </div>
            <p className="text-[10px] opacity-80 truncate mt-0.5">
              {t('verified_partner', { defaultValue: 'Verified Partner' })}
            </p>
          </div>
          <div className="flex items-center gap-3 opacity-90">
            <Video className="w-4 h-4" />
            <Phone className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Chat Body */}
        <div
          className="flex-1 h-full relative overflow-y-auto custom-scrollbar flex flex-col p-4 pb-24"
          style={{
            backgroundColor: 'var(--whatsapp-light)',
            backgroundImage:
              "url('/images/whatsapp_preview_image.png')",
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
          }}
        >
          {/* Overlay for Dark Mode background */}
          <div className="absolute inset-0 pointer-events-none" />

          {/* Date Stamp */}
          <div className="self-center relative z-10 bg-white/60 backdrop-blur-md text-zinc-600 text-[10px] px-4 py-1 rounded-full mb-6 font-semibold shadow-sm tracking-wider">
            {t('today', { defaultValue: 'TODAY' })}
          </div>

          {/* Message Bubble */}
          <div className="relative max-w-[85%] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* The tail of the bubble */}
            <svg
              className="absolute -left-[7px] top-0 text-white  drop-shadow-sm"
              width="8"
              height="13"
              viewBox="0 0 8 13"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.53333 1.69231C0.686274 0.942308 1.2549 0 2.38235 0H8V13L1.53333 1.69231Z" />
            </svg>

            <div className="relative w-full bg-white rounded-border-radius rounded-tl-none shadow-sm overflow-hidden border-b border-black/5">
              <div className="p-1.5 pb-1 space-y-1">
                {/* Media Section */}
                {mediaPreview && (
                  <div className="rounded-2xl overflow-hidden bg-zinc-100 border border-black/5 flex justify-center aspect-video relative group/media">
                    {mediaPreview.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={mediaPreview} className="w-full h-full object-cover" />
                    ) : (
                      <Image
                        src={mediaPreview}
                        alt="Preview"
                        width={500}
                        height={500}
                        unoptimized
                        className="transition-transform duration-700 group-hover/media:scale-110 rounded-2xl object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Content Section */}
                <div className="px-1.5 pt-0.5 space-y-0.5">
                  {(values.name || !values.name) && (
                    <h4 className="whitespace-break-spaces wrap-break-word font-bold text-zinc-900  text-[14.5px] leading-tight">
                      {values.name || t('campaign_title_preview', { defaultValue: 'Broadcast Title' })}
                    </h4>
                  )}
                  <p className="text-[13.5px] text-zinc-800 leading-[1.4] whitespace-pre-wrap break-words">
                    {values.content ||
                      t('message_preview_placeholder', { defaultValue: 'Your message will appear here...' })}
                  </p>
                </div>

                {/* Time & Read Receipts */}
                <div className="flex justify-end items-center gap-1 pr-1 pb-0.5">
                  <p className="text-[10px] text-zinc-500 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <div className="flex -space-x-2">
                    <CheckCheck size={12} className="text-sky-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
