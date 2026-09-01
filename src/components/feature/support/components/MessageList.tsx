'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { SupportMessageListProps } from '@/types/components/support'
import { ArrowDown, History, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MessageItem from './MessageItem'

const MessageList = ({
  scrollRef,
  onScroll,
  isViewingHistory,
  onBackToActive,
  isHistoryLoading,
  messages,
  conversation,
  activeHighlightId,
  showScrollButton,
  scrollToBottom,
  onImageClick,
  messageRefs,
}: SupportMessageListProps) => {

  const { t } = useTranslation()

  return (
    <div className="flex-1 relative flex flex-col min-h-0">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 relative custom-scrollbar"
      >
        {isViewingHistory && (
          <div className="sticky top-0 z-10 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-md flex items-center justify-between animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 text-amber-600">
              <History className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {t('viewing_history', { defaultValue: 'Viewing Historical Chat' })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToActive}
              className="h-7 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-all"
            >
              {t('back_to_active', { defaultValue: 'Back to Active' })}
            </Button>
          </div>
        )}

        {isHistoryLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-50">
            <div className="p-4 rounded-3xl bg-muted/50">
              <User className="w-12 h-12" />
            </div>
            <p className="font-medium">
              {t('no_messages_history', { defaultValue: 'Conversation history is empty' })}
            </p>
          </div>
        ) : (
          messages.map((msg: any, index: number) => {
            const isAgent = msg.role === 'assistant' || msg.senderName === 'Human Agent'
            return (
              <MessageItem
                key={index}
                msg={msg}
                isAgent={isAgent}
                conversation={conversation}
                activeHighlightId={activeHighlightId}
                onImageClick={onImageClick}
                messageRef={(el) => {
                  if (el) {
                    messageRefs?.current.set(msg.id || msg._id, el)
                  } else {
                    messageRefs?.current.delete(msg.id || msg._id)
                  }
                }}
              />

            )
          })
        )}
      </div>

      {showScrollButton && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <Button
            onClick={scrollToBottom}
            className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-primary! text-white  transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <ArrowDown className="w-5 h-5 font-black" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default MessageList
