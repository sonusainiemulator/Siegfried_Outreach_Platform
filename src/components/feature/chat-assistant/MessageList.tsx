import { Button } from '@/components/ui/button'
import { InteractionMessage, MessageListProps } from '@/types'
import { ArrowDown, Bot, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageItem } from './MessageItem'

export const MessageList = ({
  messages,
  isSending,
  chatbot,
  scrollRef,
  backendApiUrl,
  onImageClick,
  onEdit,
}: MessageListProps) => {
  const { t } = useTranslation()
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const checkScroll = (el: HTMLDivElement) => {
    const isScrollable = el.scrollHeight > el.clientHeight
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 60
    setShowScrollBtn(isScrollable && !isAtBottom)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    checkScroll(e.currentTarget)
  }

  const scrollToBottom = () => {
    if (scrollRef && 'current' in scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
      setShowScrollBtn(false)
    }
  }

  useEffect(() => {
    if (scrollRef && 'current' in scrollRef && scrollRef.current) {
      const timer = setTimeout(() => {
        if (scrollRef.current) checkScroll(scrollRef.current)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, scrollRef])

  const formatDateIndicator = (dateInput?: string) => {
    if (!dateInput) return null
    const date = new Date(dateInput)
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return t('today', { defaultValue: 'Today' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('yesterday', { defaultValue: 'Yesterday' })
    } else {
      return date.toLocaleDateString([], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden sm:p-10 p-5 sm:px-18 pt-10 space-y-8 custom-scrollbar scroll-smooth relative bg-slate-50/30 dark:bg-transparent"
    >
      {/* Bot Info Header Card */}
      <div className="flex flex-col items-center justify-center mb-16 animate-in fade-in zoom-in duration-1000 max-w-lg mx-auto text-center px-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-primary to-primary-foreground p-[2px] shadow-2xl shadow-primary/20 rotate-3">
            <div className="w-full h-full rounded-[24px] bg-white dark:bg-black p-1 overflow-hidden -rotate-3">
              {chatbot?.avatar ? (
                <Image
                  src={backendApiUrl + '/' + chatbot.avatar}
                  alt={chatbot.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="w-full h-full object-cover rounded-[20px]"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center rounded-[20px]">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-dark-muted shadow-lg flex items-center justify-center border border-glass-border">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-black title-color mb-2 leading-tight tracking-tight">
          {chatbot.name}
        </h2>
        <div className="flex items-center gap-1.5 justify-center mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest leading-none">{t('active_now', { defaultValue: 'Active Now' })}</span>
        </div>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-base">
          {chatbot.description || t('ai_assistant_intro', { defaultValue: 'Your dedicated AI assistant ready to help with your complex tasks and conversations.' })}
        </p>
      </div>

      {(() => {
        const groupedMessages = messages.reduce((groups: any[], msg: InteractionMessage) => {
          const date = msg.timestamp ? new Date(msg.timestamp).toDateString() : 'unknown'
          const lastGroup = groups[groups.length - 1]
          if (lastGroup && lastGroup.date === date) {
            lastGroup.messages.push(msg)
          } else {
            groups.push({ date, messages: [msg], originalTimestamp: msg.timestamp })
          }
          return groups
        }, [])

        return groupedMessages.map((group: any) => (
          <div key={group.date} className="relative space-y-8 pb-8 last:pb-0">
            {group.originalTimestamp && (
              <div className="flex justify-center my-4 sticky top-0 z-20 pointer-events-none">
                <div className="bg-white dark:bg-dark-muted backdrop-blur-md border border-glass-border px-4 py-1.5 rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pointer-events-auto">
                    {formatDateIndicator(group.originalTimestamp)}
                  </span>
                </div>
              </div>
            )}
            {group.messages.map((message: any) => (
              <MessageItem
                key={message.id}
                message={message}
                chatbot={chatbot}
                backendApiUrl={backendApiUrl}
                onImageClick={onImageClick}
                onEdit={onEdit}
              />
            ))}
          </div>
        ))
      })()}

      {isSending && (
        <div className="flex gap-4 animate-in fade-in items-end">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 shrink-0 flex items-center justify-center text-primary shadow-lg border border-primary/20">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-white dark:bg-dark-muted border border-glass-border rounded-[22px] rounded-ss-[4px] py-4 px-6 flex gap-1.5 items-center shadow-lg border-primary/10">
            <span
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
              style={{ animationDelay: '200ms' }}
            />
            <span
              className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"
              style={{ animationDelay: '400ms' }}
            />
          </div>
        </div>
      )}

      {/* Scroll to bottom floating button */}
      {showScrollBtn && (
        <div className=" bottom-13 fixed right-32 rtl:left-32 rtl:right-auto flex z-20 pointer-events-none">
          <Button
            onClick={scrollToBottom}
            className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full! outline outline-offset-2 outline-primary bg-primary! text-white hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-2 duration-200"
            title="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
