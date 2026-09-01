'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { echoDelay, getInitialMessages, scrollThreshold } from '@/data/aiChatbot'
import { cn } from '@/lib/utils'
import { AvatarContentProps, ChatbotPreviewProps, InteractionMessage } from '@/types'
import { formatTimestamp, resolveAvatarUrl } from '@/utils/chatUtils'
import { ArrowDown, Bot, MessageCircle, Paperclip, RefreshCw, Send, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const AvatarContent = ({ avatarUrl, name, size = 'md' }: AvatarContentProps) =>
  avatarUrl ? (
    <Image src={avatarUrl} alt="Avatar" width={50} height={50} className="w-full h-full object-cover" />
  ) : name ? (
    <>{name.charAt(0).toUpperCase()}</>
  ) : (
    <Bot className={size === 'sm' ? 'h-3 w-3' : 'h-5 w-5'} />
  )

const ChatbotPreview = ({ formData }: ChatbotPreviewProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [messages, setMessages] = useState<InteractionMessage[]>(() => getInitialMessages(formData.welcomeMessage, t))
  const scrollRef = useRef<HTMLDivElement>(null)
  const avatarUrl = resolveAvatarUrl(formData.avatarUrl)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      setTimeout(() => {
        setShowScrollBtn(false)
      }, 100)
    }
  }, [messages, isTyping])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop > el.clientHeight + scrollThreshold)
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      setShowScrollBtn(false)
    }
  }, [])

  const handleRefresh = () => setMessages(getInitialMessages(formData.welcomeMessage, t))

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: InteractionMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: formatTimestamp(),
    }

    setMessages((prev) => [...prev, userMsg])
    const currentInput = input
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: currentInput,
          timestamp: formatTimestamp(),
        },
      ])
    }, echoDelay)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="relative w-full h-125 sm:h-137.5 md:h-150 bg-muted/5 transition-all duration-300">
      {/* Background label */}
      <div className="absolute inset-0 flex items-center justify-center p-8 opacity-50 pointer-events-none">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-border-radius dark:bg-primary/10 bg-muted shadow-sm transform -rotate-6">
            <MessageCircle className="h-8 w-8 text-muted-foreground/50 dark:text-primary" />
          </div>
          <p className="text-sm font-medium text-title-color dark:text-white">
            {t('widget_preview_area', { defaultValue: 'Widget Preview Area' })}
          </p>
        </div>
      </div>

      <div className="relative h-full w-full flex items-center justify-center glass-card glass-dark-card rounded-border-radius sm:p-4 p-0 overflow-hidden">
        {/* Full Chat Window */}
        <div
          className={cn(
            'relative w-full max-w-[95%] sm:max-w-[400px] md:max-w-95 overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] glass-card glass-dark-card origin-center z-20',
            isOpen ? 'h-[420px] sm:h-[480px] md:h-135 scale-100 opacity-100' : 'h-0 scale-0 opacity-0 pointer-events-none',
          )}
          style={{ borderRadius: formData.borderRadius }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between relative overflow-hidden shrink-0 select-none"
            style={{
              background: `linear-gradient(135deg, ${formData.primaryColor}E6, ${formData.primaryColor}CC)`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-lg font-bold shadow-lg border border-white/30 overflow-hidden">
                  <AvatarContent avatarUrl={avatarUrl} name={formData.name} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-sm text-white leading-tight drop-shadow-sm max-w-[150px] truncate">
                  {formData.name || t('chatbot_builder', { defaultValue: 'Chatbot Builder' })}
                </p>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  {t('online', { defaultValue: 'Online' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                onClick={handleRefresh}
                title={t('restart_chat', { defaultValue: 'Restart Chat' })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar relative"
            style={{ backgroundColor: formData.backgroundColor }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2 max-w-[92%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300',
                  message.role === 'user' ? 'ml-auto flex-row-reverse' : '',
                )}
              >
                {message.role === 'bot' && (
                  <div
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm overflow-hidden"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    <AvatarContent avatarUrl={avatarUrl} name={formData.name} size="sm" />
                  </div>
                )}
                <div
                  className={cn(
                    'p-3 shadow-sm relative text-sm',
                    message.role === 'user' ? 'text-white' : 'bg-card border border-border/50 text-foreground',
                  )}
                  style={{
                    backgroundColor: message.role === 'user' ? formData.primaryColor : formData.secondaryColor,
                    color: message.role === 'user' ? 'var(--white)' : formData.textColor,
                    borderRadius:
                      message.role === 'user'
                        ? `${formData.borderRadius} ${formData.borderRadius} 0 ${formData.borderRadius}`
                        : `${formData.borderRadius} ${formData.borderRadius} ${formData.borderRadius} 0`,
                  }}
                >
                  <p className="leading-snug">{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 opacity-50 ml-8 animate-in fade-in">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.32s]" />
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.16s]" />
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {showScrollBtn && (
              <div className="sticky bottom-2 w-full flex justify-center z-20 pointer-events-none">
                <Button
                  onClick={scrollToBottom}
                  className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-green-success! text-white shadow-lg hover:scale-105 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 glass-card shrink-0 glass-dark-card bg-white">
            <div
              className="flex items-center gap-2 px-3 py-2 border border-border/20 transition-all focus-within:ring-2 focus-within:ring-primary/20"
              style={{
                backgroundColor: formData.inputBackgroundColor,
                borderRadius: `calc(${formData.borderRadius} / 1.5)`,
              }}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5 rounded-lg opacity-40 shrink-0">
                <Paperclip className="h-4 w-4 text-black" />
              </Button>
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t('type_message', { defaultValue: 'Type a message...' })}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground p-0 selection:bg-primary/20 h-auto shadow-none focus-visible:ring-0"
                style={{ color: formData.textColor }}
              />
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all',
                  input.trim() ? 'opacity-100 hover:scale-105 active:scale-95' : 'opacity-40 cursor-default',
                )}
                style={{ backgroundColor: formData.buttonColor }}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Chat Icon (Visible when closed) */}
        {!isOpen && (
          <Button
            variant="ghost"
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 animate-in zoom-in-50 fade-in-0 z-10 p-0"
            style={{
              backgroundColor: formData.primaryColor,
              boxShadow: `0 8px 30px -4px ${formData.primaryColor}66`,
            }}
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-8 w-8" />
            <div className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ChatbotPreview
