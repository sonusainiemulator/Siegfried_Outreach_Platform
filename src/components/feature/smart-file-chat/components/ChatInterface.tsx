import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ShadcnInput from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChatInterfaceProps } from '@/types'
import { ArrowDown, Bot, Loader2, Menu, Paperclip, Send } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

const ChatInterface = ({
  messages,
  isSending,
  isHistoryLoading,
  onSendMessage,
  activeSession,
  canChat,
  onScrollChange,
  initialScrollPos,
  onToggleSidebar,
}: ChatInterfaceProps) => {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const prevSessionId = useRef<string | null>(null)
  const skipNextScrollUpdate = useRef(false)
  const [fallbackTimestamp, setFallbackTimestamp] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFallbackTimestamp(Date.now())
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
      setShowScrollBtn(false)
    }
  }, [])

  useLayoutEffect(() => {
    if (!isHistoryLoading && activeSession?.id) {
      if (prevSessionId.current !== activeSession?.id) {
        prevSessionId.current = activeSession.id

        const restorePos = initialScrollPos ?? -1
        const el = scrollContainerRef.current

        if (el) {
          if (restorePos !== -1) {
            el.scrollTop = restorePos
            skipNextScrollUpdate.current = true
          } else {
            el.scrollTop = el.scrollHeight
          }
        }
      }
    }
  }, [isHistoryLoading, activeSession?.id, initialScrollPos])

  useEffect(() => {
    if (!isHistoryLoading && prevSessionId.current === activeSession?.id && !skipNextScrollUpdate.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    skipNextScrollUpdate.current = false
  }, [messages.length, isSending, isHistoryLoading, activeSession?.id])

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 60
    setShowScrollBtn(!isAtBottom)

    onScrollChange?.(el.scrollTop)
  }, [onScrollChange])


  const handleSend = () => {
    if (input.trim() && !isSending) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatDateIndicator = (dateInput: string | number) => {
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
    <div className="flex-1 flex flex-col glass-card glass-dark-card bg-glass-bg backdrop-blur-xl border border-glass-border rounded-border-radius shadow-sm overflow-hidden relative h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-glass-border flex items-center justify-between bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button
              onClick={onToggleSidebar}
              variant="outline"
              size="icon"
              className="h-10 w-10 min-w-[40px] rounded-[8px] border-glass-border bg-white dark:bg-dark-muted shadow-sm hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center p-0!"
              title={t('toggle_sidebar', { defaultValue: 'Toggle Sidebar' })}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="h-10 w-10 rounded-[8px] bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm leading-tight truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-md text-foreground/90">
              {activeSession?.metadata?.fileName || activeSession?.title || 'File Analysis'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {activeSession?.isArchived && (
                <Badge
                  variant="outline"
                  className="text-[9px] py-0 h-4 rounded-md border-amber-500/20 text-amber-500 font-bold shrink-0"
                >
                  {t('ai_archive', { defaultValue: 'AI ARCHIVE' })}
                </Badge>
              )}
              {!activeSession?.isArchived && (activeSession?.metadata?.fileName || activeSession?.title)?.includes('.') && (
                <Badge
                  variant="outline"
                  className="text-[9px] py-0 h-4 rounded-md border-primary/20 text-primary font-bold shrink-0 uppercase"
                >
                  {(activeSession?.metadata?.fileName || activeSession?.title)?.split('.').pop()?.substring(0, 4)}
                </Badge>
              )}
              <span
                className={cn(
                  'w-1 h-1 rounded-full shrink-0',
                  activeSession?.isArchived ? 'bg-amber-500' : 'bg-emerald-500'
                )}
              />
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                {activeSession?.isArchived
                  ? t('archived_session', { defaultValue: 'Archived Session' })
                  : t('active_analysis', { defaultValue: 'Active Analysis' })}
              </span>
            </div>

          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto custom-scrollbar opacity-100"
        >
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {isHistoryLoading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="h-8 w-8 text-primary/40 animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">{t('loading_history')}</p>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {t('welcome_to_file_chat', { defaultValue: 'Neural File Analysis' })}
                </h4>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  {t('ask_anything_about_file', {
                    defaultValue: 'I have analyzed your file. Ask me anything about its contents, data, or structure.',
                  })}
                </p>
              </div>
            ) : (
              (() => {
                const groupedMessages = messages.reduce((groups: any[], msg: any) => {
                  const date = new Date(msg.timestamp || fallbackTimestamp!).toDateString()
                  const lastGroup = groups[groups.length - 1]
                  if (lastGroup && lastGroup.date === date) {
                    lastGroup.messages.push(msg)
                  } else {
                    groups.push({ date, messages: [msg], originalTimestamp: msg.timestamp || fallbackTimestamp! })
                  }
                  return groups
                }, [])

                return groupedMessages.map((group: any) => (
                  <div key={group.date} className="relative space-y-4 md:space-y-6 pb-4 last:pb-0">
                    <div className="flex justify-center my-2 md:my-4 sticky top-0 z-20 pointer-events-none">
                      <div className="border border-glass-border bg-white dark:bg-dark-muted px-4 py-1 rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pointer-events-auto">
                          {formatDateIndicator(group.originalTimestamp)}
                        </span>
                      </div>
                    </div>
                    {group.messages.map((msg: any, i: number) => {
                      const isUser = msg.role === 'user'
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500',
                            isUser ? 'flex-row-reverse' : 'flex-row',
                          )}
                        >
                          <div
                            className={cn(
                              'h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-white shadow-lg overflow-hidden',
                              isUser ? 'bg-accent dark:bg-modal-bg-color glass-dark-card text-accent-foreground' : 'bg-primary',
                            )}
                          >
                            {isUser ? <div className="font-bold text-xs uppercase">{t('me')}</div> : <Bot className="w-5 h-5" />}
                          </div>

                          <div className={cn('max-w-[85%] md:max-w-[75%] space-y-1.5', isUser ? 'text-end' : '')}>
                            <div
                              className={cn(
                                'p-4 text-sm leading-relaxed shadow-sm overflow-hidden text-start',
                                isUser
                                  ? 'bg-primary text-primary-foreground rounded-border-radius rounded-se-none'
                                  : 'bg-primary/10 border border-glass-border rounded-border-radius rounded-ss-none',
                              )}
                            >
                              <div
                                className={cn(
                                  'prose prose-sm max-w-none break-words',
                                  isUser ? 'text-primary-foreground prose-invert' : 'dark:prose-invert',
                                )}
                              >
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                                    a: ({ href, children }: any) => (
                                      <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        {children}
                                      </Link>
                                    ),
                                    pre: ({ children }: any) => (
                                      <pre className="bg-black/10 p-2 rounded-lg overflow-x-auto my-2">{children}</pre>
                                    ),
                                    code: ({ children }: any) => (
                                      <code className="bg-black/10 px-1 py-0.5 rounded text-xs">{children}</code>
                                    ),
                                  }}
                                >
                                  {msg.content || msg.text || ''}
                                </ReactMarkdown>
                              </div>
                            </div>
                            {(msg.timestamp || fallbackTimestamp) && (
                              <span className="text-[9px] font-bold text-muted-foreground/40 px-2 uppercase tracking-wider">
                                {new Date(msg.timestamp || fallbackTimestamp!).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))
              })()
            )}
            {isSending && (
              <div className="flex gap-4 animate-in fade-in">
                <div className="h-10 w-10 rounded-2xl bg-primary shrink-0 flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-background border border-glass-border rounded-3xl rounded-ss-none p-4 flex gap-1.5 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {showScrollBtn && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <Button
              onClick={scrollToBottom}
              className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-primary! text-primary-foreground  hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-2 duration-200"
              title="Scroll to bottom"
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 pt-2 shrink-0">
        <div className="w-full">
          <div className="relative group  glass-dark-card backdrop-blur-md p-1.5 rounded-border-radius border border-glass-border focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-[8px] bg-primary  shrink-0 text-white transition-all active:scale-95"
                onClick={() => toast.info(t('file_attachment_enabled_during_initial_upload'))}
                disabled={!canChat}
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              <ShadcnInput
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={canChat ? t('ask_anything_about_file', { defaultValue: 'Ask anything about your file...' }) : t('view_only_chat', { defaultValue: 'View only mode' })}
                disabled={!canChat}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground px-2 h-auto shadow-none focus-visible:ring-0"
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isSending || !canChat}
                className={cn(
                  'h-10 w-10 text-white rounded-full shrink-0 bg-primary! transition-all active:scale-95',
                  input.trim() && canChat ? 'opacity-100' : 'opacity-40',
                )}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
