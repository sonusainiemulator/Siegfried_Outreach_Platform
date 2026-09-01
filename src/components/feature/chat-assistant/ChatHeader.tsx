import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import Input from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { ChatHeaderProps } from '@/types'
import { getMediaUrl } from '@/utils'
import { ArrowLeft, Bot, Check, ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChatShareModal from './ChatShareModal'

const ChatHeader = ({
  chatbot,
  allChatbots,
  searchQuery,
  setSearchQuery,
  sessionId,
  messages,
  onNewConversation,
}: ChatHeaderProps & { onToggleSidebar?: () => void; onNewConversation?: () => void }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const filteredChatbots = allChatbots.filter((bot) => bot.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const direction = useAppDirection()

  return (
    <div className="flex items-center flex-wrap gap-3 justify-between p-4 px-6 inner-card glass-dark-card rounded-border-radius md:h-20 shrink-0 sticky top-0 z-20">
      <div className="flex gap-4 items-center min-w-0">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-[8px] bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-90"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </Button>

        <div className="flex items-center gap-4 min-w-0">
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer group min-w-0">
                <div className="relative shrink-0">
                  {chatbot?.avatar ? (
                    <div className="w-11 h-11 rounded-[8px] border-2 border-primary/20 overflow-hidden group-hover:border-primary/50 transition-all p-0.5">
                      <Image
                        src={getMediaUrl(chatbot?.avatar) || ''}
                        width={44}
                        height={44}
                        unoptimized
                        alt={chatbot?.name || 'chatbot'}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-[8px] bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <span className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-dark-muted rounded-full" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg leading-tight truncate">{chatbot.name}</h2>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[11px] font-bold text-emerald-500 tracking-wider uppercase">
                    {t('online', { defaultValue: 'Online' })}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[320px] rounded-[10px] border-glass-border bg-white dark:bg-dark-muted shadow-2xl p-0 overflow-hidden"
            >
              <div className="p-4 border-b border-glass-border">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('search_chatbots', { defaultValue: 'Search chatbot...' })}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="ps-10 h-11 focus-visible:ring-primary/20 rounded-[8px] font-medium"
                  />
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredChatbots.map((bot) => (
                  <DropdownMenuItem
                    key={bot.id}
                    onClick={() => {
                      if (bot.id !== chatbot.id) {
                        router.push(`${ROUTES.CHAT_ASSISTANT.LIST}/${bot.id}`)
                      }
                    }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-[8px] cursor-pointer hover:bg-primary/5 transition-all mb-1',
                      bot.id === chatbot.id && 'bg-primary/5 border border-primary/10',
                    )}
                  >
                    {bot?.avatar ? (
                      <Image
                        src={getMediaUrl(bot?.avatar) || ''}
                        width={40}
                        height={40}
                        unoptimized
                        alt={bot?.name || 'chatbot'}
                        className="rounded-full h-10 w-10 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-[8px] bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 text-start flex-1">
                      <p className="font-bold text-sm truncate">{bot.name}</p>
                      <p className="text-xs text-muted-foreground truncate font-medium">
                        {bot.description || t('ai_assistant', { defaultValue: 'AI Assistant' })}
                      </p>
                    </div>
                    {bot.id === chatbot.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-3">


        {onNewConversation && (
          <Button
            className="rounded-full h-11 p-button-padding font-medium btn-color text-base text-white shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            onClick={onNewConversation}
            disabled={messages.length <= 1}
          >
            <span className="text-base leading-none ">+</span>
            {t('new_chat', { defaultValue: 'New Chat' })}
          </Button>
        )}
      </div>

      <ChatShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} sessionId={sessionId} />
    </div>
  )
}

export default ChatHeader
