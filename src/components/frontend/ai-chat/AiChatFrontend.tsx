'use client'

import PromptLibraryModal from '@/components/feature/chat-assistant/PromptLibraryModal'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { BACKEND_API_URL } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { getModels } from '@/data/aiChatbot'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { baseApi } from '@/redux/api/baseApi'
import {
  useDeleteConversationsMutation,
  useGetConversationHistoryQuery,
  useGetUserConversationsQuery,
  useSendMessageMutation,
  useStartNewConversationMutation,
  useTogglePinConversationMutation,
} from '@/redux/api/chatApi'
import { useGetChatbotsQuery } from '@/redux/api/chatbotApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearAuth } from '@/redux/slices/authSlice'
import { ApiError, Chatbot, InteractionMessage } from '@/types'
import { authUtils } from '@/utils'
import { isBrowser } from '@/utils/environment'
import { AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ChatHeader } from './components/ChatHeader'
import { ChatInputSection } from './components/ChatInputSection'
import { ImageLightbox } from './components/ImageLightbox'
import { LeftSidebar } from './components/LeftSidebar'
import { MessageList } from './components/MessageList'
import { RightSidebar } from './components/RightSidebar'
import { WelcomeSection } from './components/WelcomeSection'

export default function AiChatFrontend() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const { hasPermission } = usePermission()

  const canManageChat = hasPermission('Manage Chat Conversations', 'write')

  const authUser = useAppSelector((state: any) => state.auth?.user)

  const { setTheme } = useTheme()

  const [dark, setDark] = useState(() => {
    if (isBrowser) {
      const stored = localStorage.getItem('pixel-chat-theme')
      return stored === 'light' ? false : true
    }
    return true
  })

  useEffect(() => {
    localStorage.setItem('pixel-chat-theme', dark ? 'dark' : 'light')
    const themeValue = dark ? 'dark' : 'light'
    setTheme(themeValue)
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark, setTheme])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1281) {
        setSidebarOpen(false)
        setRightPanelOpen(false)
      } else {
        setSidebarOpen(true)
        setRightPanelOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [selectedBot, setSelectedBot] = useState<Chatbot | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<InteractionMessage[]>([])
  const [input, setInput] = useState('')
  const [historySearch, setHistorySearch] = useState('')
  const [activeTab, setActiveTab] = useState<'history' | 'prompts'>('history')

  const [botDropOpen, setBotDropOpen] = useState(false)
  const [botSearch, setBotSearch] = useState('')
  const [modelDropOpen, setModelDropOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const [promptLibOpen, setPromptLibOpen] = useState(false)

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const isCreatingChat = useRef(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const botDropRef = useRef<HTMLDivElement>(null)
  const modelDropRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const messagesCache = useRef<Record<string, InteractionMessage[]>>({})

  const allModelsList = getModels()

  const { data: chatbotsData } = useGetChatbotsQuery({ limit: 100 })
  const chatbots = chatbotsData?.agents || []

  const { data: conversationsData, refetch: refetchConversations } = useGetUserConversationsQuery(selectedBot?.id || '', {
    skip: !selectedBot?.id,
  })
  const conversations = conversationsData?.conversations || []

  const { data: historyData, isLoading: historyLoading, isFetching: historyFetching } = useGetConversationHistoryQuery(
    { id: selectedBot?.id || '', sessionId: sessionId! },
    { skip: !selectedBot?.id || !sessionId }
  )

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [startNewConversation] = useStartNewConversationMutation()
  const [deleteConversation] = useDeleteConversationsMutation()
  const [togglePin] = useTogglePinConversationMutation()

  useEffect(() => {
    if (chatbots.length > 0 && !selectedBot) {
      setSelectedBot(chatbots[0])
    }
  }, [chatbots, selectedBot])

  useEffect(() => {
    if (!selectedBot?.id) return

    const storageKey = `chat_session_${selectedBot.id}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      setSessionId(stored)
    } else {
      const fallbackId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      setSessionId(fallbackId)
      localStorage.setItem(storageKey, fallbackId)
    }
  }, [selectedBot?.id])

  // Sync History
  useEffect(() => {
    if (!sessionId || historyFetching) return

    if (historyData && historyData.conversation?.sessionId && historyData.conversation.sessionId !== sessionId) {
      return
    }

    const cached = messagesCache.current[sessionId]
    if (cached && cached.length > 0) {
      setMessages(cached)
      return
    }

    if (historyData?.conversation?.messages && historyData.conversation.messages.length > 0) {
      const mapped = historyData.conversation.messages.map((m: any) => ({
        id: m.id || m._id || Date.now().toString(),
        role: m.role === 'assistant' ? 'bot' : m.role,
        text: m.content || m.text,
        timestamp: m.createdAt || m.timestamp,
      }))

      // Filter out the very first welcome message if history has only one message and it's from bot
      if (mapped.length === 1 && mapped[0].role === 'bot') {
        const isWelcome = mapped[0].text.toLowerCase().includes('hello') ||
          mapped[0].text.toLowerCase().includes('welcome') ||
          mapped[0].text === selectedBot?.welcomeMessage;
        if (isWelcome) {
          setMessages([])
          messagesCache.current[sessionId] = []
          return
        }
      }

      setMessages(mapped)
      messagesCache.current[sessionId] = mapped
    } else {
      setMessages([])
      messagesCache.current[sessionId] = []
    }
  }, [historyData, sessionId, selectedBot?.welcomeMessage, historyFetching])

  // Auto-scroll
  useEffect(() => {
    if (!showScrollBtn && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length, isSending])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100
      setShowScrollBtn(!isAtBottom)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
      setShowScrollBtn(false)
    }
  }

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (botDropRef.current && !botDropRef.current.contains(target)) setBotDropOpen(false)
      if (modelDropRef.current && !modelDropRef.current.contains(target)) setModelDropOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false)
    }
    if (isBrowser) {
      window.addEventListener('mousedown', fn)
    }
    return () => {
      if (isBrowser) {
        window.removeEventListener('mousedown', fn)
      }
    }
  }, [])

  const handleSend = async (overrideText?: string) => {
    const text = (typeof overrideText === 'string' ? overrideText : input).trim()
    if (!text || !selectedBot?.id || !sessionId || isSending || !canManageChat) return

    const userMsg: InteractionMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => {
      const updated = [...prev, userMsg]
      if (sessionId) messagesCache.current[sessionId] = updated
      return updated
    })
    setInput('')
    setSelectedFiles([])

    try {
      const res = await sendMessage({
        id: selectedBot.id,
        message: text,
        sessionId,
        history: messages.map((m: any) => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.text,
        })),
      }).unwrap()

      const botMsg: InteractionMessage = {
        id: Date.now().toString(),
        role: 'bot',
        text: res.answer || res.response || '',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => {
        const updated = [...prev, botMsg]
        if (sessionId) messagesCache.current[sessionId] = updated
        return updated
      })
      refetchConversations()
    } catch (err) {
      const error = err as ApiError
      toast.error(error?.data?.message || t('failed_to_send_message'))
    }
  }

  const handleLogout = () => {
    dispatch(clearAuth())
    authUtils.clearAuth()
    dispatch(baseApi.util.resetApiState())
    toast.success(t('logged_out_successfully'))
    router.push(ROUTES.AUTH.LOGIN)
  }

  const handleNewChat = async () => {
    if (!selectedBot?.id || !canManageChat) return

    if (messages.length === 0) {
      toast.info(t('you_already_have_a_new_empty_chat_ready'))
      return
    }
    if (isCreatingChat.current) return
    isCreatingChat.current = true

    try {
      const res = await startNewConversation(selectedBot.id).unwrap()
      const newSid = res.conversation.sessionId
      const storageKey = `chat_session_${selectedBot.id}`
      localStorage.setItem(storageKey, newSid)
      messagesCache.current[newSid] = []
      setSessionId(newSid)
      setMessages([])
      refetchConversations()
      toast.success(t('started_new_conversation'))
    } catch (err) {
      const error = err as ApiError
      toast.error(error?.data?.message || t('failed_to_start_new_chat'))
    } finally {
      isCreatingChat.current = false
    }
  }

  const allChatImages = React.useMemo(() => {
    const urls: string[] = []
    const isImageUrl = (t: string) => {
      const tr = t.trim()
      return (tr.startsWith('http://') || tr.startsWith('https://') || tr.startsWith('/')) &&
        /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(tr)
    }
    messages.forEach(msg => {
      msg.text?.split('\n').forEach(line => {
        const t = line.trim()
        if (isImageUrl(t)) {
          const fullUrl = t.startsWith('http') ? t : `${BACKEND_API_URL}/${t.startsWith('/') ? t.slice(1) : t}`
          urls.push(fullUrl)
        }
      })
    })
    return urls
  }, [messages])

  const openLightbox = (url: string) => {
    const idx = allChatImages.indexOf(url)
    setLightboxIndex(idx >= 0 ? idx : 0)
    setLightboxImages(allChatImages.length > 0 ? allChatImages : [url])
  }

  const handleSwitchSession = (sid: string) => {
    if (!selectedBot?.id || sid === sessionId) return
    const storageKey = `chat_session_${selectedBot.id}`
    localStorage.setItem(storageKey, sid)
    
    if (!messagesCache.current[sid]) {
      setMessages([])
    } else {
      setMessages(messagesCache.current[sid])
    }
    
    setSessionId(sid)
  }

  const handleDeleteSession = (cid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteTargetId(cid)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId || !selectedBot?.id) return
    setIsDeleting(true)
    try {
      await deleteConversation({ chatbotId: selectedBot.id, conversationIds: [deleteTargetId] }).unwrap()
      const conv = conversations.find((c: any) => c.id === deleteTargetId)
      if (conv?.sessionId) delete messagesCache.current[conv.sessionId]
      toast.success(t('conversation_deleted'))
      refetchConversations()
      if (deleteTargetId === historyData?.conversation?.id) {
        const storageKey = `chat_session_${selectedBot.id}`
        localStorage.removeItem(storageKey)
        setMessages([])
        setSessionId(null)
      }
    } catch {
      toast.error(t('failed_to_delete'))
    } finally {
      setIsDeleting(false)
      setDeleteTargetId(null)
    }
  }

  const handleTogglePin = async (cid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedBot?.id) return
    try {
      await togglePin({ chatbotId: selectedBot.id, conversationId: cid }).unwrap()
      refetchConversations()
    } catch (err) {
      toast.error(t('failed_to_pin'))
    }
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const filteredBots = chatbots.filter((b: any) => b.name.toLowerCase().includes(botSearch.toLowerCase()))
  const filteredHistory = conversations.filter((c: any) => c.title.toLowerCase().includes(historySearch.toLowerCase()))
  const currentProviderModels = (allModelsList as any)[selectedBot?.provider || 'openai'] || []

  return (
    <div className={cn('flex h-screen overflow-hidden antialiased', dark ? 'dark' : '')}>
      <div className="flex h-full w-full bg-light-body dark:bg-light-body text-foreground transition-colors duration-300">

        <LeftSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          historySearch={historySearch}
          setHistorySearch={setHistorySearch}
          filteredHistory={filteredHistory}
          sessionId={sessionId}
          handleNewChat={handleNewChat}
          handleSwitchSession={handleSwitchSession}
          handleTogglePin={handleTogglePin}
          handleDeleteSession={handleDeleteSession}
          setInput={setInput}
          setPromptLibOpen={setPromptLibOpen}
        />
        <main className="flex-1 flex flex-col min-w-0 h-full relative">

          <ChatHeader
            setSidebarOpen={setSidebarOpen}
            rightPanelOpen={rightPanelOpen}
            setRightPanelOpen={setRightPanelOpen}
            botDropRef={botDropRef}
            botDropOpen={botDropOpen}
            setBotDropOpen={setBotDropOpen}
            botSearch={botSearch}
            setBotSearch={setBotSearch}
            filteredBots={filteredBots}
            selectedBot={selectedBot}
            setSelectedBot={setSelectedBot}
            modelDropRef={modelDropRef}
            modelDropOpen={modelDropOpen}
            setModelDropOpen={setModelDropOpen}
            currentProviderModels={currentProviderModels}
            dark={dark}
            setDark={setDark}
            userMenuRef={userMenuRef}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            authUser={authUser}
            handleLogout={handleLogout}
          />

          <div className="flex-1 flex overflow-hidden">

            <div className="flex-1 flex flex-col min-w-0 h-full relative">

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar"
              >

                {messages.length === 0 && (
                  <WelcomeSection selectedBot={selectedBot} setInput={setInput} />
                )}

                {historyLoading && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t('loading_history')}</p>
                  </div>
                )}

                <MessageList
                  messages={messages}
                  selectedBot={selectedBot}
                  authUser={authUser}
                  openLightbox={openLightbox}
                  setInput={setInput}
                  setMessages={setMessages}
                  isSending={isSending}
                />
              </div>

              {showScrollBtn && (
                <div className="absolute bottom-32 left-0 right-0 flex justify-center z-20 pointer-events-none">
                  <Button
                    onClick={scrollToBottom}
                    className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-xl bg-primary! text-white! hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </Button>
                </div>
              )}

              <ChatInputSection
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                input={input}
                setInput={setInput}
                handleKey={handleKey}
                selectedBot={selectedBot}
                setPromptLibOpen={setPromptLibOpen}
                handleSend={handleSend}
                isSending={isSending}
                canManageChat={canManageChat}
              />
            </div>

            <RightSidebar
              rightPanelOpen={rightPanelOpen}
              setRightPanelOpen={setRightPanelOpen}
              selectedBot={selectedBot}
              messages={messages}
            />
          </div>
        </main>
      </div>

      <PromptLibraryModal isOpen={promptLibOpen} onClose={() => setPromptLibOpen(false)} onSelectPrompt={(p) => { setInput(p); setPromptLibOpen(false); }} />

      <DeleteConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        isLoading={isDeleting}
      />

      <AnimatePresence>
        {lightboxImages.length > 0 && (
          <ImageLightbox
            images={lightboxImages}
            startIndex={lightboxIndex}
            onClose={() => setLightboxImages([])}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
