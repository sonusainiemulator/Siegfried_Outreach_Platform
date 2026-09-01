import { Button } from '@/components/ui/button'
import { BACKEND_API_URL } from '@/constants'
import { dots } from '@/data/aiAnalysis'
import { cn } from '@/lib/utils'
import { InteractionMessage } from '@/types'
import { MessageListProps } from '@/types/aiChatFrontend'
import { motion } from 'framer-motion'
import { Copy, Edit2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BotAvatar } from './BotAvatar'
import { MsgContent } from './MsgContent'

export const MessageList = ({
  messages,
  selectedBot,
  authUser,
  openLightbox,
  setInput,
  setMessages,
  isSending,
}: MessageListProps) => {
  const { t } = useTranslation()
  return (
    <>
      {messages.map((msg: InteractionMessage, i: number) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('flex gap-3 group', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
        >
          <div className="shrink-0 flex items-end">
            {msg.role === 'bot' ? (
              <BotAvatar bot={selectedBot} size="sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center overflow-hidden">
                {authUser?.avatar ? (
                  <Image
                    src={`${BACKEND_API_URL}/${authUser.avatar}`}
                    alt={authUser.name || 'User'}
                    width={32}
                    height={32}
                    unoptimized
                  />
                ) : (
                  <span className="text-xs font-black text-primary">
                    {(authUser?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div
            className={cn(
              'flex flex-col gap-1.5 max-w-[80%] md:max-w-[70%]',
              msg.role === 'user' ? 'items-end' : 'items-start',
            )}
          >
            <div
              className={cn(
                'p-4 rounded-border-radius text-sm md:text-base leading-relaxed shadow-sm transition-all',
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-none shadow-primary/20'
                  : 'bg-primary/20 text-primary! border border-border/40 rounded-bl-none shadow-black/5',
              )}
            >
              <MsgContent text={msg.text} onOpenLightbox={openLightbox} />
            </div>
            <div className="px-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(msg.text)
                  toast.success(t('copied_to_clipboard'))
                }}
                className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </Button>
              {msg.role === 'user' && (
                <Button
                  onClick={() => {
                    setInput(msg.text)
                    setMessages((prev) => {
                      const idx = prev.findIndex((m) => m.id === msg.id)
                      return prev.slice(0, idx)
                    })
                  }}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  title="Edit message"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      {isSending && (
        <div className="flex gap-4">
          <BotAvatar bot={selectedBot} size="sm" />
          <div className="bg-white dark:bg-dark-bg border border-border/40 rounded-3xl rounded-bl-none p-4 flex items-center gap-1.5 shadow-sm">
            {dots.map((d: number) => (
              <motion.div
                key={d}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: d }}
                className="w-1.5 h-1.5 rounded-full bg-primary/50"
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
