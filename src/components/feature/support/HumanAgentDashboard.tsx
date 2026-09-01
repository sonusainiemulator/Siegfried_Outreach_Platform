'use client'

import { Button } from '@/components/ui/button'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  agentApi,
  useAgentReplyMutation,
  useAssignAgentMutation,
  useGetAgentConversationHistoryQuery,
  useGetTransferredConversationsQuery,
  useGetUserHistoryQuery,
  useListAgentsQuery,
  useResolveConversationMutation,
} from '@/redux/api/agentApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { ApiError } from '@/types'
import type { ActiveTab, Agent, SupportConversation } from '@/types/components/support'
import { Menu, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ChatPanel from './ChatPanel'
import { ImageLightbox } from './components'
import ConversationList from './ConversationList'
import CustomerDetailsSidebar from './CustomerDetailsSidebar'

const HumanAgentDashboard = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { direction } = useAppSelector((state) => state.layout)
  const isRtl = direction === 'rtl'
  const { hasPermission, role, user } = usePermission()
  const BASE_API_URL = process.env.NEXT_PUBLIC_STORAGE_URL
  const canReply = hasPermission('Reply Queries', 'write')
  const canManageAgents = hasPermission('Manage Agents', 'write')

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [displayedConversationId, setDisplayedConversationId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('details')
  const [replyText, setReplyText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [channelFilter, setChannelFilter] = useState('All Platforms')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isListOpen, setIsListOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const urlConversationId = searchParams.get('conversationId')
  const urlMessageId = searchParams.get('messageId')

  const { data: listData, isLoading: isListLoading } = useGetTransferredConversationsQuery({ search: searchQuery, filterStatus: statusFilter })
  const { data: agentsData } = useListAgentsQuery(undefined, { skip: !canManageAgents })
  const { data: historyData, isLoading: isHistoryLoading } = useGetAgentConversationHistoryQuery(
    displayedConversationId!,
    { skip: !displayedConversationId },
  )
  const { data: userHistoryData } = useGetUserHistoryQuery(selectedConversationId!, { skip: !selectedConversationId })

  const [sendReply, { isLoading: isReplying }] = useAgentReplyMutation()
  const [resolveChat] = useResolveConversationMutation()
  const [assignAgent] = useAssignAgentMutation()

  const [prevSelectedConversationId, setPrevSelectedConversationId] = useState(selectedConversationId)
  if (selectedConversationId !== prevSelectedConversationId) {
    setPrevSelectedConversationId(selectedConversationId)
    setDisplayedConversationId(selectedConversationId)
    if (selectedConversationId) {
      setIsDetailsOpen(false)
      setIsListOpen(false)
    }
  }

  const [prevUrlConversationId, setPrevUrlConversationId] = useState(urlConversationId)
  if (urlConversationId !== prevUrlConversationId) {
    setPrevUrlConversationId(urlConversationId)
    if (urlConversationId) {
      setSelectedConversationId(urlConversationId)
    }
  }

  useEffect(() => {
    if (!canManageAgents) return
    const interval = setInterval(() => dispatch(agentApi.util.invalidateTags(['AgentChat'])), 30000)
    return () => clearInterval(interval)
  }, [canManageAgents, dispatch])

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

  const agents = (agentsData?.agents || []).filter((a: Agent) => a.role !== 'super_admin')
  const selectedConversation = conversations.find(
    (c: SupportConversation) => c.id === (selectedConversationId || displayedConversationId),
  )
  const messages = historyData?.conversation?.messages || []
  const historicalConversations = userHistoryData?.conversations || []

  const imageUrls = useMemo(() => {
    const urls: string[] = []
    messages.forEach((msg: any) => {
      // Check msg.content - it might be a direct image path from backend
      if (msg.content) {
        if (msg.content.startsWith('/uploads/')) {
          urls.push(`${BASE_API_URL}${msg.content}`)
        } else if (/^https?:\/\//i.test(msg.content)) {
          // If content itself is a URL and is an image
          if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(msg.content)) {
            urls.push(msg.content)
          }
        }
      }
      // Check msg.attachments
      if (msg.attachments && Array.isArray(msg.attachments)) {
        msg.attachments.forEach((att: any) => {
          if (att.url) {
            const fullUrl = att.url.startsWith('http')
              ? att.url
              : `${BASE_API_URL}${att.url.startsWith('/') ? '' : '/'}${att.url}`
            if (att.fileType === 'image' || /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(fullUrl)) {
              urls.push(fullUrl)
            }
          }
        })
      }
    })
    return Array.from(new Set(urls))
  }, [messages, BASE_API_URL])

  const handleImageClick = (url: string) => {
    const index = imageUrls.indexOf(url)
    if (index !== -1) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const handleAssignAgent = async (agentId: string | null) => {
    if (!selectedConversationId || !canManageAgents) return
    try {
      const res = await assignAgent({ conversationId: selectedConversationId, agentId }).unwrap()
      toast.success(res.message || (agentId ? 'Agent assigned' : 'Agent unassigned'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to assign agent')
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() && attachedFiles.length === 0) return
    if (!selectedConversationId || isReplying || !canReply) return
    try {
      const response = await sendReply({
        conversationId: selectedConversationId,
        message: replyText,
        files: attachedFiles,
      }).unwrap()
      const actualMessage = response.conversation.messages[response.conversation.messages.length - 1]

      dispatch(
        agentApi.util.updateQueryData('getAgentConversationHistory', selectedConversationId, (draft) => {
          if (draft?.conversation) {
            if (!draft.conversation.messages) draft.conversation.messages = []
            const exists = draft.conversation.messages.some((m: any) => {
              const idMatch =
                (m.id && actualMessage.id && m.id === actualMessage.id) ||
                (m._id && actualMessage._id && m._id === actualMessage._id)
              if (idMatch) return true
              return (
                m.content === actualMessage.content &&
                Math.abs(new Date(m.timestamp).getTime() - new Date(actualMessage.timestamp).getTime()) < 5000
              )
            })
            if (!exists) draft.conversation.messages.push(actualMessage)
          }
        }),
      )

      dispatch(
        agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
          if (draft?.conversations) {
            const idx = draft.conversations.findIndex((c: any) => c.id === selectedConversationId)
            if (idx !== -1) {
              const conv = draft.conversations[idx]
              conv.lastMessage = {
                content: actualMessage.content,
                timestamp: actualMessage.timestamp,
                role: actualMessage.role,
              }
              conv.lastActivity = actualMessage.timestamp
              draft.conversations.splice(idx, 1)
              draft.conversations.unshift(conv)
            }
          }
        }),
      )

      setReplyText('')
      setAttachedFiles([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_send_reply'))
    }
  }

  const handleResolve = async () => {
    if (!selectedConversationId) return
    if (role !== 'super_admin' && selectedConversation?.assignedAgent?.id !== user?.id) {
      toast.error('You are not authorized to resolve this conversation')
      return
    }
    try {
      const res = await resolveChat(selectedConversationId).unwrap()
      dispatch(
        agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
          const conv = draft?.conversations?.find((c: any) => c.id === selectedConversationId)
          if (conv) conv.status = 'resolved'
        }),
      )
      toast.success(res.message || 'Conversation resolved')
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to resolve conversation')
    }
  }

  return (
    <div className="flex h-full min-h-0 relative overflow-hidden rounded-border-radius border border-glass-border">
      <div
        className={cn(
          'lg991:absolute lg991:bg-white dark:lg991:bg-modal-bg-color lg991:!border-0 lg991:inset-y-0 lg991:z-50 lg991:w-[350px] transition-all duration-300 ease-in-out glass-dark-card',
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
          role={role}
          channelFilter={channelFilter}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onSelect={(id) => {
            setSelectedConversationId(id)
            setIsListOpen(false)
          }}
          onChannelFilter={setChannelFilter}
          onStatusFilter={setStatusFilter}
          onAgentFilter={() => {}}
          onSearch={setSearchQuery}
          className="w-full lg991:border-r-0"
          onClose={() => setIsListOpen(false)}
        />
      </div>

      <div className={cn('flex-1 flex flex-col  relative overflow-hidden', 'flex')}>
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
            agents={agents}
            role={role}
            userId={user?.id}
            scrollRef={scrollRef}
            attachedFiles={attachedFiles}
            highlightMessageId={urlMessageId}
            onReplyChange={setReplyText}
            onSendReply={handleSendReply}
            onResolve={handleResolve}
            onAssignAgent={handleAssignAgent}
            onBackToActive={() => setDisplayedConversationId(selectedConversationId)}
            onAttachedFilesChange={setAttachedFiles}
            onBackToList={() => setSelectedConversationId(null)}
            onToggleDetails={() => setIsDetailsOpen(!isDetailsOpen)}
            onToggleList={() => setIsListOpen(!isListOpen)}
            onImageClick={handleImageClick}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 space-y-6 animate-in fade-in zoom-in duration-700 relative">
            <div className={cn('absolute top-4 lg991:block hidden', isRtl ? 'right-4' : 'left-4')}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsListOpen(true)}
                className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-glass-border shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="relative p-6 glass-card glass-dark-card rounded-border-radius border border-glass-border ">
                <User className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium text-title-color dark:text-white">
                {t('select_chat_title', { defaultValue: 'Select a Conversation' })}
              </h3>
              <p className=" text-sm text-subtitle-color">
                {t('select_chat_desc', {
                  defaultValue: 'Choose a conversation from the sidebar to start chatting with the customer.',
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedConversation && (
        <CustomerDetailsSidebar
          conversation={selectedConversation}
          activeTab={activeTab}
          historicalConversations={historicalConversations}
          displayedConversationId={displayedConversationId}
          baseApiUrl={BASE_API_URL}
          onTabChange={setActiveTab}
          onViewHistory={setDisplayedConversationId}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}

      {lightboxOpen && (
        <ImageLightbox images={imageUrls} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  )
}

const HumanAgentDashboardWithSuspense = () => (
  <Suspense
    fallback={
      <div className="flex h-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }
  >
    <HumanAgentDashboard />
  </Suspense>
)

export default HumanAgentDashboardWithSuspense
