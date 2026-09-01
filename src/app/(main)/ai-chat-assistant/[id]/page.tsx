'use client'

import ChatArea from '@/components/feature/chat-assistant/ChatArea'
import ChatHeader from '@/components/feature/chat-assistant/ChatHeader'
import ChatShareModal from '@/components/feature/chat-assistant/ChatShareModal'
import ChatSidebar from '@/components/feature/chat-assistant/ChatSidebar'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useGetConversationHistoryQuery,
  useGetUserConversationsQuery,
  useSendMessageMutation
} from '@/redux/api/chatApi'
import { useGetChatbotByIdQuery, useGetChatbotsQuery } from '@/redux/api/chatbotApi'
import { ApiError, ChatPageProps } from '@/types'
import { Conversation } from '@/types/chat'
import { InteractionMessage } from '@/types/chatbot'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AIChatDetailPage = ({ params }: ChatPageProps) => {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const urlSessionId = searchParams.get('sessionId')
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canManageChat = hasPermission('Manage Chat Conversations', 'write')
  const canManagePrompts = hasPermission('Manage Prompts', 'write')

  const { data, isLoading } = useGetChatbotByIdQuery(id)
  const chatbot = data?.agent
  const { data: chatbotsData } = useGetChatbotsQuery({ page: 1, limit: 100 })
  const allChatbots = chatbotsData?.agents || []
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<InteractionMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatbotSearchQuery, setChatbotSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showEscalationButton, setShowEscalationButton] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mutations & Queries
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const { data: conversationsData, refetch: refetchConversations } = useGetUserConversationsQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  })
  const conversations: Conversation[] = conversationsData?.conversations || []

  const { data: historyData } = useGetConversationHistoryQuery(
    { id, sessionId: sessionId! },
    {
      skip: !id || !sessionId,
      refetchOnMountOrArgChange: true,
    },
  )

  // Load or create sessionId
  const generateLocalSessionId = useCallback(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const storageKey = `chat_session_${id}`
    setSessionId(newSessionId)
    localStorage.setItem(storageKey, newSessionId)
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        text: chatbot?.welcomeMessage || t('default_welcome_message'),
      },
    ])
    return newSessionId
  }, [id, chatbot, t])

  // Load or create sessionId
  useEffect(() => {
    if (!id) return

    if (urlSessionId) {
      setTimeout(() => {
        setSessionId(urlSessionId)
      }, 100)
      return
    }

    const storageKey = `chat_session_${id}`
    const storedSessionId = localStorage.getItem(storageKey)

    if (storedSessionId) {
      setTimeout(() => {
        setSessionId(storedSessionId)
      }, 100)
    } else {
      setTimeout(() => {
        generateLocalSessionId()
      }, 100)
    }
  }, [id, urlSessionId, generateLocalSessionId])

  // Open sidebar by default on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setIsSidebarOpen(true)
    }
  }, [])

  // Sync messages with history data
  useEffect(() => {
    if (historyData?.conversation?.messages && historyData.conversation.messages.length > 0) {
      const loadedMessages = historyData.conversation.messages.map((msg: any) => ({
        id: msg.id || msg._id || Date.now().toString(),
        role: msg.role === 'assistant' ? 'bot' : msg.role,
        text: msg.content,
      }))
      setTimeout(() => {
        setMessages(loadedMessages)
      }, 100)

      if (historyData.conversation.metadata?.isHandedOffToHuman) {
        setTimeout(() => {
          setShowEscalationButton(false)
        }, 100)
      }
    } else if (historyData && (!historyData.conversation?.messages || historyData.conversation.messages.length === 0)) {
      if (chatbot) {
        setTimeout(() => {
          setMessages([
            {
              id: 'welcome',
              role: 'bot',
              text: chatbot?.welcomeMessage || t('default_welcome_message'),
            },
          ])
        }, 10)
      }
    }
  }, [historyData, chatbot, t])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isSending])

  const handleSend = async (messageOverride?: string) => {
    const textToSend = typeof messageOverride === 'string' ? messageOverride : input

    if (!textToSend.trim() || !chatbot || isSending || !sessionId || !canManageChat) return

    const userMsg: InteractionMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
    }

    setMessages((prev) => [...prev, userMsg])
    if (input === textToSend) {
      setInput('')
    }
    setInput('')
    setSelectedFiles([])

    try {
      const response = await sendMessage({
        id: chatbot.id,
        message: textToSend,
        sessionId: sessionId,
        history: messages.map((m) => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.text,
        })),
      }).unwrap()

      const botMsg: InteractionMessage = {
        id: Date.now().toString(),
        role: 'bot',
        text: response.answer || response.response || '',
      }
      setMessages((prev) => [...prev, botMsg])

      if (response.showEscalationButton) {
        setShowEscalationButton(true)
      } else {
        setShowEscalationButton(false)
      }

      if (response.isHandedOffToHuman || historyData?.conversation?.metadata?.isHandedOffToHuman) {
        toast.info(
          response.message ||
            t('handed_off_to_human', { defaultValue: 'An agent has been notified and will join shortly.' }),
        )
        setShowEscalationButton(false)
      }

      await refetchConversations()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('error_sending_message'))
    }
  }

  const handleEscalate = () => {
    handleSend('Talk to Agent')
    setShowEscalationButton(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }

  const handleEditMessage = (msg: InteractionMessage) => {
    const msgIndex = messages.findIndex((m) => m.id === msg.id)
    if (msgIndex !== -1) {
      // Set input to the message text
      setInput(msg.text)

      // Truncate messages to before this one
      const newMessages = messages.slice(0, msgIndex)
      setMessages(newMessages)

      toast.info(t('editing_message', { defaultValue: 'Editing message... Make changes and send to regenerate.' }))
    }
  }

  const handleNewConversation = async () => {
    if (!canManageChat) return
    try {
      generateLocalSessionId()
      setShowEscalationButton(false)

      toast.success(t('new_conversation_started', { defaultValue: 'New conversation started' }))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('error_starting_conversation'))
    }
  }

  const handleSwitchConversation = (conversationSessionId: string) => {
    if (conversationSessionId === sessionId) return

    const storageKey = `chat_session_${id}`
    localStorage.setItem(storageKey, conversationSessionId)

    setSessionId(conversationSessionId)
    setShowEscalationButton(false)
  }

  if (isLoading) {
    return <Spinner className="min-h-[80vh]" />
  }

  if (!chatbot) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">{t('chatbot_not_found', { defaultValue: 'Chatbot not found' })}</h2>
        <Link href={ROUTES.CHAT_ASSISTANT.LIST}>
          <Button variant="outline" className="shadow-none bg-primary text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_list', { defaultValue: 'Back to List' })}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 animate-in fade-in duration-500 max-w-full overflow-hidden">
      <div className="relative">
        <ChatHeader
          chatbot={chatbot}
          allChatbots={allChatbots}
          searchQuery={chatbotSearchQuery}
          setSearchQuery={setChatbotSearchQuery}
          messages={messages}
          sessionId={sessionId}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onNewConversation={handleNewConversation}
        />
      </div>

      <div className={cn('flex h-screen relative overflow-hidden transition-all duration-300', isSidebarOpen ? 'gap-3 sm:gap-4' : 'gap-0')}>
        <ChatSidebar
          chatbotId={id}
          sessionId={sessionId}
          conversations={conversations}
          refetchConversations={refetchConversations}
          onNewConversation={handleNewConversation}
          onSwitchConversation={(sid) => {
            handleSwitchConversation(sid)
            setIsSidebarOpen(false)
          }}
          canManageChat={canManageChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          messages={messages}
          chatbotName={chatbot.name}
          onShare={() => setIsShareModalOpen(true)}
        />

        <ChatArea
          messages={messages}
          isSending={isSending}
          chatbot={chatbot}
          scrollRef={scrollRef}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyPress={handleKeyPress}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          showEscalationButton={showEscalationButton}
          onEscalate={handleEscalate}
          canManageChat={canManageChat}
          canManagePrompts={canManagePrompts}
          onEdit={handleEditMessage}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>
      <ChatShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} sessionId={sessionId} />
    </div>
  )
}

export default AIChatDetailPage
