'use client'

import ChatPanel from '@/components/feature/support/ChatPanel'
import ConversationList from '@/components/feature/support/ConversationList'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useCampaignInboxReplyMutation,
  useGetCampaignConversationHistoryQuery,
  useGetCampaignConversationsQuery,
} from '@/redux/api/campaignInboxApi'
import { useAppSelector } from '@/redux/hooks'
import { ApiError } from '@/types'
import type { SupportConversation } from '@/types/components/support'
import { getMediaUrl } from '@/utils'
import { Menu, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ImageLightbox } from '../support/components'

const InboxDashboard = () => {
  const { t } = useTranslation()
  const { direction } = useAppSelector((state) => state.layout)
  const isRtl = direction === 'rtl'
  const { role } = usePermission()
  const canReply = true
  const canManageAgents = false
  const searchParams = useSearchParams()
  const initialConvId = searchParams.get('conversationId')
  const initialMsgId = searchParams.get('messageId')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConvId)
  const [displayedConversationId, setDisplayedConversationId] = useState<string | null>(initialConvId)
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(initialMsgId)
  const [isListOpen, setIsListOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [channelFilter, setChannelFilter] = useState('All Platforms')
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)

  const handleImageClick = (url: string) => {
    // Collect all image URLs from all messages in the conversation
    const allImages: string[] = []
    messages.forEach((msg: any) => {
      // Check message content
      if (msg.content) {
        const fullUrl = getMediaUrl(msg.content)
        if (fullUrl && isImageUrl(fullUrl)) {
          allImages.push(fullUrl)
        }
      }
      // Check attachments
      msg.attachments?.forEach((att: any) => {
        if (att.url) {
          const attUrl = getMediaUrl(att.url)
          if (attUrl && (att.fileType?.includes('image') || isImageUrl(attUrl))) {
            allImages.push(attUrl)
          }
        }
      })
    })

    const index = allImages.indexOf(url)
    setLightboxImages(allImages.length > 0 ? allImages : [url])
    setLightboxIndex(index >= 0 ? index : 0)
    setLightboxOpen(true)
  }

  const { data: listData, isLoading: isListLoading } = useGetCampaignConversationsQuery({ search: searchQuery })
  const { data: historyData, isLoading: isHistoryLoading } = useGetCampaignConversationHistoryQuery(
    displayedConversationId!,
    { skip: !displayedConversationId },
  )

  const [sendReply, { isLoading: isReplying }] = useCampaignInboxReplyMutation()

  const [prevSelectedConversationId, setPrevSelectedConversationId] = useState(selectedConversationId)
  if (selectedConversationId !== prevSelectedConversationId) {
    setPrevSelectedConversationId(selectedConversationId)
    setDisplayedConversationId(selectedConversationId)
    if (selectedConversationId) {
      setIsListOpen(false)
    }
  }

  const convId = searchParams.get('conversationId')
  const msgId = searchParams.get('messageId')
  
  const [prevConvId, setPrevConvId] = useState(convId)
  if (convId !== prevConvId) {
    setPrevConvId(convId)
    if (convId) {
      setSelectedConversationId(convId)
    }
  }
  
  const [prevMsgId, setPrevMsgId] = useState(msgId)
  if (msgId !== prevMsgId) {
    setPrevMsgId(msgId)
    if (msgId) {
      setHighlightMessageId(msgId)
    }
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [historyData])

  const conversations = (listData?.conversations || []).filter((conv: SupportConversation) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!conv.userName?.toLowerCase().includes(q) && !conv.lastMessage?.content?.toLowerCase()?.includes(q))
        return false
    }
    if (channelFilter !== 'All Platforms' && conv.source !== channelFilter.toLowerCase()) return false
    return true
  })

  const selectedConversation = conversations.find(
    (c: SupportConversation) => c.id === (selectedConversationId || displayedConversationId),
  )
  const messages = historyData?.conversation?.messages || []

  const handleSendReply = async () => {
    if (!replyText.trim() && attachedFiles.length === 0) return
    if (!selectedConversationId || isReplying || !canReply) return
    try {
      const response = await sendReply({
        conversationId: selectedConversationId,
        message: replyText,
        files: attachedFiles,
      }).unwrap()

      // Refresh data
      setReplyText('')
      setAttachedFiles([])
      toast.success(t('reply_sent_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_send_reply'))
    }
  }

  const handleAssignAgent = async () => { }
  const handleResolve = async () => { }

  return (
    <div className="flex h-[calc(100vh-100px)] glass-card glass-dark-card overflow-hidden rounded-border-radius animate-in fade-in duration-700 relative">
      <div
        className={cn(
          'lg991:absolute lg991:inset-y-0 border-none lg991:z-50 lg991:w-[350px] lg991:bg-white dark:lg991:bg-modal-bg-color transition-all duration-300 ease-in-out',
          'w-full max-w-full md:flex-none md:w-80 lg:w-96',
          isListOpen
            ? (isRtl ? 'lg991:right-0' : 'lg991:left-0') + ' opacity-100 lg991:visible'
            : (isRtl ? 'lg991:-right-[350px]' : 'lg991:-left-[350px]') +
            ' lg991:opacity-0 lg991:pointer-events-none lg991:invisible',
          !selectedConversationId ? 'flex' : 'hidden md:flex lg991:flex',
        )}
      >
        <ConversationList
          conversations={conversations}
          isLoading={isListLoading}
          selectedId={selectedConversationId}
          role={role || 'user'}
          channelFilter={channelFilter}
          campaignHub={true}
          searchQuery={searchQuery}
          onSelect={setSelectedConversationId}
          onChannelFilter={setChannelFilter}
          onAgentFilter={() => { } }
          onSearch={setSearchQuery}
          className="w-full lg991:border-r-0" onStatusFilter={function (v: string): void { } } />
      </div>

      {/* Main Chat Area */}
      <div className={cn('flex-1 flex flex-col relative overflow-hidden', 'flex')}>
        {selectedConversation ? (
          <ChatPanel
            conversation={selectedConversation}
            messages={messages}
            isHistoryLoading={isHistoryLoading}
            isViewingHistory={displayedConversationId !== selectedConversationId}
            replyText={replyText}
            isReplying={isReplying}
            canReply={canReply}
            canManageAgents={canManageAgents}
            agents={[]}
            role={role || 'user'}
            userId={''}
            scrollRef={scrollRef}
            attachedFiles={attachedFiles}
            isCampaign={true}
            onReplyChange={setReplyText}
            onSendReply={handleSendReply}
            onResolve={handleResolve}
            onAssignAgent={handleAssignAgent}
            onBackToActive={() => setDisplayedConversationId(selectedConversationId)}
            onAttachedFilesChange={setAttachedFiles}
            onBackToList={() => setSelectedConversationId(null)}
            onToggleList={() => setIsListOpen(!isListOpen)}
            highlightMessageId={highlightMessageId}
            onImageClick={handleImageClick}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 space-y-6 animate-in fade-in zoom-in duration-700 relative">
            <div className="absolute top-4 left-4 lg991:block hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsListOpen(true)}
                className="h-10 w-10 rounded-[8px] text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-glass-border shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="relative  glass-dark-card glass-card p-4 rounded-border-radius border border-glass-border ">
                <User className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium text-foreground">
                {t('select_chat_title', { defaultValue: 'Select a Conversation' })}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed">
                {t('select_chat_desc', {
                  defaultValue: 'Choose a conversation from the sidebar to view replies.',
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      {lightboxOpen && lightboxImages.length > 0 && (
        <ImageLightbox images={lightboxImages} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  )
}

export default InboxDashboard
