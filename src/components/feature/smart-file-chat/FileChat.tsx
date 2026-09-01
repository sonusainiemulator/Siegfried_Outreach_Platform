'use client'

import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useChatWithFileMutation,
  useGetConversationDetailsQuery,
  useGetFileHistoryQuery,
  useUploadAndAnalyzeMutation,
} from '@/redux/api/fileAnalyzerApi'
import { ApiError } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ChatInterface from './components/ChatInterface'
import FileChatHeader from './components/FileChatHeader'
import FileHistorySidebar from './components/FileHistorySidebar'
import FileUploadLanding from './components/FileUploadLanding'

const FileChat = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage File Conversations', 'write')
  const canManageArchived = hasPermission('Manage Archived File Conversations', 'write')

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [typingConversationId, setTypingConversationId] = useState<string | null>(null)
  const [conversationsMessages, setConversationsMessages] = useState<Record<string, any[]>>({})
  const scrollPositions = useRef<Record<string, number>>({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data: historyData, isLoading: isHistoryLoading, refetch: refetchHistory } = useGetFileHistoryQuery()
  const { data: sessionDetails, isFetching: isSessionFetching } = useGetConversationDetailsQuery(conversationId || '', {
    skip: !conversationId,
    refetchOnMountOrArgChange: true,
  })

  const [uploadAndAnalyze, { isLoading: isUploading }] = useUploadAndAnalyzeMutation()
  const [chatWithFile, { isLoading: isSending }] = useChatWithFileMutation()

  useEffect(() => {
    if (conversationId && sessionDetails?.messages) {
      setConversationsMessages((prev) => {
        if (typingConversationId === conversationId) {
          return prev
        }
        return {
          ...prev,
          [conversationId]: sessionDetails.messages,
        }
      })
    } else if (conversationId && !isSessionFetching && !conversationsMessages[conversationId]) {
      setConversationsMessages((prev) => ({
        ...prev,
        [conversationId]: [],
      }))
    }
  }, [sessionDetails, conversationId, isSessionFetching, typingConversationId])

  const handleFileUpload = async (file: File) => {
    if (!canManage) return
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await uploadAndAnalyze(formData).unwrap()
      const newConvId = response.conversation.id
      setConversationId(newConvId)
      setConversationsMessages((prev) => ({
        ...prev,
        [newConvId]: response.conversation.messages || [],
      }))
      refetchHistory()
      toast.success(response.message || t('analysis_completed'))
      setIsSidebarOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_analyze'))
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!canManage || !conversationId) return

    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }
    setConversationsMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), userMessage],
    }))
    setTypingConversationId(conversationId)

    try {
      const response = await chatWithFile({ conversationId, prompt: message }).unwrap()
      if (response.messages) {
        setConversationsMessages((prev) => {
          const currentMessages = prev[conversationId] || []
          const filtered = currentMessages.filter((m) => m.timestamp !== userMessage.timestamp)
          return {
            ...prev,
            [conversationId]: [...filtered, ...response.messages],
          }
        })
      }
      refetchHistory()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
      // Remove the optimistic message on error
      setConversationsMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter((m) => m.timestamp !== userMessage.timestamp),
      }))
    } finally {
      setTypingConversationId(null)
    }
  }

  const handleNewChat = () => {
    setConversationId(null)
    if (window.innerWidth < 992) setIsSidebarOpen(false)
  }

  const handleSessionSelect = (id: string) => {
    if (id === conversationId) {
      if (window.innerWidth < 992) setIsSidebarOpen(false)
      return
    }
    setConversationId(id)
    if (window.innerWidth < 992) setIsSidebarOpen(false)
  }

  // Set sidebar open by default on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setIsSidebarOpen(true)
    }
  }, [])

  const handleScrollChange = (pos: number) => {
    if (conversationId) {
      scrollPositions.current[conversationId] = pos
    }
  }

  const currentSession = historyData?.find((chat: any) => chat.id === conversationId)
  const currentMessages = conversationId ? conversationsMessages[conversationId] || [] : []

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
      <FileChatHeader onNewChat={handleNewChat} onOpenHistory={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={cn('flex h-screen overflow-hidden relative transition-all duration-300', isSidebarOpen ? 'gap-4' : 'gap-0')}>
        <div
          className={cn(
            'hidden [@media(min-width:992px)]:block h-full overflow-hidden transition-all duration-300',
            isSidebarOpen ? 'w-75 opacity-100' : 'w-0 opacity-0'
          )}
        >
          <FileHistorySidebar
            history={historyData || []}
            isLoading={isHistoryLoading}
            activeSessionId={conversationId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            refetchHistory={refetchHistory}
            canManage={canManage}
            canManageArchived={canManageArchived}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 min-h-0 w-full h-full relative">
          {conversationId ? (
            <ChatInterface
              messages={currentMessages}
              isSending={isSending && typingConversationId === conversationId}
              isHistoryLoading={isSessionFetching && !currentMessages.length}
              onSendMessage={handleSendMessage}
              activeSession={currentSession || sessionDetails}
              canChat={canManage}
              initialScrollPos={scrollPositions.current[conversationId]}
              onScrollChange={handleScrollChange}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          ) : (
            <FileUploadLanding 
              onFileUpload={handleFileUpload} 
              isAnalyzing={isUploading} 
              canUpload={canManage} 
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          )}
        </div>

        <div
          className={cn(
            'absolute inset-0 z-50 transition-all duration-300 [@media(min-width:992px)]:hidden',
            isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          )}
        >
          <div
            className={cn(
              'absolute top-0 inset-inline-start-0 h-full w-75 rounded-border-radius! rounded-ss-none! rounded-es-none! max-w-[85vw] shadow-2xl transition-transform duration-300 ease-in-out z-50',
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full',
            )}
          >
            <FileHistorySidebar
              history={historyData || []}
              isLoading={isHistoryLoading}
              activeSessionId={conversationId}
              onSessionSelect={handleSessionSelect}
              onNewChat={handleNewChat}
              refetchHistory={refetchHistory}
              isModal={true}
              canManage={canManage}
              canManageArchived={canManageArchived}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileChat
