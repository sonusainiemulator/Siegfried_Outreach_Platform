'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  MessageSquare,
  Search,
  Send,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Instagram,
  Facebook,
  MessageCircle,
  Paperclip,
  Image as ImageIcon,
  Check,
  CheckCheck,
  User,
  Sparkles,
  ArrowLeft,
  X,
  ExternalLink,
  ShieldCheck,
  Radio,
  Clock
} from 'lucide-react'

import {
  useGetCampaignConversationsQuery,
  useGetCampaignConversationHistoryQuery,
  useCampaignInboxReplyMutation,
  useDeleteCampaignConversationMutation,
} from '@/redux/api/campaignInboxApi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  playDmAlertSound,
  isSoundAlertEnabled,
  setSoundAlertEnabled,
} from '@/utils/audioAlert'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { ImageLightbox } from '@/components/feature/support/components'
import { getMediaUrl } from '@/utils'

type PlatformFilter = 'All' | 'instagram' | 'facebook' | 'whatsapp' | 'telegram' | 'twitter'

interface PlatformInfo {
  id: PlatformFilter
  label: string
  icon: React.ReactNode
  color: string
  bgLight: string
  borderColor: string
}

const PLATFORMS: PlatformInfo[] = [
  {
    id: 'All',
    label: 'All Platforms',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-primary',
    bgLight: 'bg-primary/10',
    borderColor: 'border-primary/20',
  },
  {
    id: 'instagram',
    label: 'Instagram Direct',
    icon: <Instagram className="w-4 h-4 text-pink-500" />,
    color: 'text-pink-500',
    bgLight: 'bg-gradient-to-r from-pink-500/10 to-purple-500/10',
    borderColor: 'border-pink-500/30',
  },
  {
    id: 'facebook',
    label: 'Facebook Messenger',
    icon: <Facebook className="w-4 h-4 text-blue-500" />,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Business',
    icon: <MessageCircle className="w-4 h-4 text-emerald-500" />,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: <Send className="w-4 h-4 text-sky-500" />,
    color: 'text-sky-500',
    bgLight: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
  },
]

const QUICK_REPLIES = [
  'Hello! How can we help you today?',
  'Thank you for reaching out! We will review your request right away.',
  'Could you please share your email or phone number so we can assist you better?',
  'Our team is reviewing your inquiry and will follow up shortly!',
  'You can check our latest plans and pricing directly on our website.',
]

export default function SocialInboxDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialConvId = searchParams.get('conversationId')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConvId)
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [desktopAlertsGranted, setDesktopAlertsGranted] = useState<boolean>(false)

  // Modals & Lightbox
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [convToDelete, setConvToDelete] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sound preference init
  useEffect(() => {
    setSoundEnabled(isSoundAlertEnabled())
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setDesktopAlertsGranted(Notification.permission === 'granted')
    }
  }, [])

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    setSoundAlertEnabled(next)
    if (next) {
      playDmAlertSound(true)
      toast.success('Sound alerts enabled! You will hear a chime on new DMs.')
    } else {
      toast.info('Sound alerts disabled.')
    }
  }

  const handleTestSound = () => {
    playDmAlertSound(true)
    toast.success('Playing notification chime 🎵')
  }

  const requestDesktopPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser desktop notifications are not supported in this browser.')
      return
    }
    try {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        setDesktopAlertsGranted(true)
        toast.success('Desktop alerts enabled! You will be alerted when new DMs arrive.')
        new Notification('Siegfried Social DM Alerts Active', {
          body: 'You are now ready to receive real-time social direct messages!',
          icon: '/favicon.ico',
        })
      } else {
        setDesktopAlertsGranted(false)
        toast.error('Notification permission was not granted.')
      }
    } catch (e) {
      toast.error('Could not request notification permissions.')
    }
  }

  // Fetch conversations with platform and search query
  const {
    data: listData,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useGetCampaignConversationsQuery({
    search: searchQuery,
    platform: activePlatform,
  })

  // Fetch single conversation messages history
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useGetCampaignConversationHistoryQuery(selectedConversationId!, {
    skip: !selectedConversationId,
  })

  const [sendReply, { isLoading: isReplying }] = useCampaignInboxReplyMutation()
  const [deleteConversation, { isLoading: isDeleting }] = useDeleteCampaignConversationMutation()

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [historyData?.conversation?.messages])

  // Sync route param with state
  useEffect(() => {
    const paramId = searchParams.get('conversationId')
    if (paramId && paramId !== selectedConversationId) {
      setSelectedConversationId(paramId)
    }
  }, [searchParams])

  const conversations = (listData?.conversations || []).filter((conv: any) => {
    if (activePlatform !== 'All') {
      const convSource = (conv.source || conv.platform || '').toLowerCase()
      if (activePlatform === 'whatsapp' && !convSource.includes('whatsapp')) return false
      if (activePlatform === 'facebook' && !convSource.includes('facebook') && !convSource.includes('messenger')) return false
      if (activePlatform === 'instagram' && !convSource.includes('instagram')) return false
      if (activePlatform === 'telegram' && !convSource.includes('telegram')) return false
      if (activePlatform === 'twitter' && !convSource.includes('twitter')) return false
    }
    return true
  })

  const selectedConversation = conversations.find(
    (c: any) => c.id === selectedConversationId
  ) || (historyData?.conversation?.id === selectedConversationId ? historyData.conversation : null)

  const messages = historyData?.conversation?.messages || []

  const handleSelectConv = (convId: string) => {
    setSelectedConversationId(convId)
    router.push(`/social-media/inbox?conversationId=${convId}`, { scroll: false })
  }

  const handleSendReply = async () => {
    if (!replyText.trim() && attachedFiles.length === 0) return
    if (!selectedConversationId || isReplying) return

    try {
      await sendReply({
        conversationId: selectedConversationId,
        message: replyText.trim(),
        files: attachedFiles,
      }).unwrap()

      setReplyText('')
      setAttachedFiles([])
      toast.success('Reply dispatched directly to customer!')
      refetchHistory()
      refetchList()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to dispatch reply')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleConfirmDelete = async () => {
    if (!convToDelete) return
    try {
      await deleteConversation({ ids: [convToDelete] }).unwrap()
      toast.success('Conversation deleted.')
      if (selectedConversationId === convToDelete) {
        setSelectedConversationId(null)
      }
      setIsDeleteModalOpen(false)
      setConvToDelete(null)
      refetchList()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete conversation')
    }
  }

  const getChannelBadge = (source: string) => {
    const s = (source || '').toLowerCase()
    if (s.includes('instagram')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
          <Instagram className="w-3 h-3" /> Instagram
        </span>
      )
    }
    if (s.includes('facebook') || s.includes('messenger')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <Facebook className="w-3 h-3" /> Messenger
        </span>
      )
    }
    if (s.includes('whatsapp')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <MessageCircle className="w-3 h-3" /> WhatsApp
        </span>
      )
    }
    if (s.includes('telegram')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
          <Send className="w-3 h-3" /> Telegram
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
        <MessageSquare className="w-3 h-3" /> Direct
      </span>
    )
  }

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-500">
      {/* Top Bar / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-3 rounded-2xl glass-card glass-dark-card border border-glass-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary/30 to-purple-500/20 text-primary border border-primary/20 shadow-inner">
            <Radio className="w-6 h-6 animate-pulse text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Unified Social DM Inbox
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Read & respond to Instagram, Messenger, WhatsApp, and Telegram direct messages all in one place.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Desktop Alerts Toggle */}
          <Button
            variant={desktopAlertsGranted ? 'outline' : 'default'}
            size="sm"
            onClick={requestDesktopPermission}
            className={cn(
              'h-9 rounded-xl text-xs font-semibold gap-1.5 transition-all shadow-sm',
              desktopAlertsGranted
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-primary text-white hover:bg-primary/90'
            )}
          >
            {desktopAlertsGranted ? (
              <>
                <Bell className="w-3.5 h-3.5 text-emerald-500" />
                Desktop Alerts Active
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                Enable Desktop Alerts
              </>
            )}
          </Button>

          {/* Sound Alert Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            className={cn(
              'h-9 rounded-xl text-xs font-semibold gap-1.5 border border-glass-border shadow-sm',
              soundEnabled
                ? 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/30'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
            title={soundEnabled ? 'Click to mute chime alerts' : 'Click to enable chime alerts'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                Chime On
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                Chime Muted
              </>
            )}
          </Button>

          {/* Test Sound */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTestSound}
            className="h-9 rounded-xl text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Preview DM notification chime sound"
          >
            Test Chime 🎵
          </Button>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              refetchList()
              if (selectedConversationId) refetchHistory()
              toast.info('Inbox refreshed')
            }}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Refresh inbox"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden rounded-2xl glass-card glass-dark-card border border-glass-border shadow-md">
        {/* Left Column: Platform Tabs & Conversation List */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-glass-border bg-background/50 backdrop-blur-sm shrink-0">
          {/* Platform Filters */}
          <div className="p-3 border-b border-glass-border">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PLATFORMS.map((pf) => {
                const isActive = activePlatform === pf.id
                return (
                  <button
                    key={pf.id}
                    onClick={() => setActivePlatform(pf.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
                      isActive
                        ? 'bg-primary text-white shadow-sm border-primary shadow-primary/20'
                        : 'bg-background/80 text-muted-foreground hover:bg-primary/5 hover:text-primary border-glass-border'
                    )}
                  >
                    <span className={isActive ? 'text-white' : ''}>{pf.icon}</span>
                    <span>{pf.id === 'All' ? 'All Channels' : pf.label.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-glass-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contact, username, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-background/70 border-glass-border focus-visible:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-glass-border">
            {isListLoading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-2 text-muted-foreground">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs">Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 text-muted-foreground">
                <div className="p-3 rounded-2xl bg-muted/30 border border-glass-border">
                  <MessageSquare className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No messages found</p>
                  <p className="text-xs mt-1">
                    {searchQuery
                      ? 'No conversations matched your search.'
                      : 'Incoming DMs from your connected social accounts will stream in live.'}
                  </p>
                </div>
              </div>
            ) : (
              conversations.map((conv: any) => {
                const isSelected = conv.id === selectedConversationId
                const source = conv.source || conv.platform || 'social'
                const displayName = conv.userName || conv.username || conv.title || conv.sessionId
                const lastMsgText = conv.lastMessage?.content || 'Sent an attachment'
                const timeAgo = formatTimestamp(conv.lastActivity || conv.lastMessage?.timestamp)

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={cn(
                      'p-3.5 cursor-pointer transition-all flex items-start gap-3 relative group hover:bg-primary/5',
                      isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-11 h-11 border border-glass-border shadow-sm">
                        {conv.profilePic ? (
                          <AvatarImage src={conv.profilePic} alt={displayName} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-purple-500/20 text-primary font-bold text-xs">
                          {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Platform Icon Overlay */}
                      <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-background border border-glass-border shadow-xs">
                        {source.includes('instagram') ? (
                          <Instagram className="w-3 h-3 text-pink-500" />
                        ) : source.includes('facebook') || source.includes('messenger') ? (
                          <Facebook className="w-3 h-3 text-blue-500" />
                        ) : source.includes('whatsapp') ? (
                          <MessageCircle className="w-3 h-3 text-emerald-500" />
                        ) : source.includes('telegram') ? (
                          <Send className="w-3 h-3 text-sky-500" />
                        ) : (
                          <MessageSquare className="w-3 h-3 text-primary" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-foreground truncate">{displayName}</h4>
                        <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo}</span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate mb-1.5">
                        {conv.lastMessage?.role === 'assistant' && (
                          <span className="text-primary font-medium">You: </span>
                        )}
                        {lastMsgText}
                      </p>

                      <div className="flex items-center justify-between">
                        {getChannelBadge(source)}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setConvToDelete(conv.id)
                            setIsDeleteModalOpen(true)
                          }}
                          className="h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat History & Composer */}
        <div className="flex-1 flex flex-col bg-background/30 overflow-hidden relative">
          {selectedConversationId && selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-glass-border flex items-center justify-between bg-background/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-glass-border shadow-sm">
                    {selectedConversation.profilePic ? (
                      <AvatarImage src={selectedConversation.profilePic} />
                    ) : null}
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                      {(selectedConversation.userName || selectedConversation.title || 'U').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">
                        {selectedConversation.userName || selectedConversation.title}
                      </h3>
                      {getChannelBadge(selectedConversation.source || selectedConversation.platform)}
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Session ID: {selectedConversation.sessionId}
                      {selectedConversation.accountName && (
                        <span>• via {selectedConversation.accountName}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchHistory()}
                    className="h-8 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setConvToDelete(selectedConversation.id)
                      setIsDeleteModalOpen(true)
                    }}
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
                {isHistoryLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                    <MessageSquare className="w-8 h-8 opacity-40" />
                    <p className="text-xs">No messages yet in this conversation.</p>
                  </div>
                ) : (
                  messages.map((msg: any, index: number) => {
                    const isAssistant = msg.role === 'assistant'
                    return (
                      <div
                        key={msg.id || index}
                        className={cn(
                          'flex items-end gap-2 max-w-[80%] md:max-w-[70%]',
                          isAssistant ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        )}
                      >
                        {!isAssistant && (
                          <Avatar className="w-7 h-7 shrink-0 border border-glass-border">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                              {(msg.senderName || 'U').slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="space-y-1">
                          <div
                            className={cn(
                              'p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs',
                              isAssistant
                                ? 'bg-primary text-white rounded-br-xs shadow-primary/20'
                                : 'bg-background dark:bg-zinc-800 text-foreground border border-glass-border rounded-bl-xs'
                            )}
                          >
                            {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                {msg.attachments.map((att: any, attIdx: number) => {
                                  const fileUrl = getMediaUrl(att.url)
                                  const isImg = att.fileType?.includes('image') || /\.(jpg|jpeg|png|webp|gif)/i.test(att.url || '')
                                  if (isImg && fileUrl) {
                                    return (
                                      <div
                                        key={attIdx}
                                        className="relative rounded-xl overflow-hidden cursor-pointer group/img max-w-xs"
                                        onClick={() => {
                                          setLightboxImages([fileUrl])
                                          setLightboxIndex(0)
                                          setLightboxOpen(true)
                                        }}
                                      >
                                        <img
                                          src={fileUrl}
                                          alt="Attachment"
                                          className="w-full h-auto object-cover max-h-48 rounded-xl group-hover/img:scale-105 transition-transform"
                                        />
                                      </div>
                                    )
                                  }
                                  return (
                                    <a
                                      key={attIdx}
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={cn(
                                        'flex items-center gap-2 p-2 rounded-lg text-[11px] underline',
                                        isAssistant ? 'text-white/90 bg-white/10' : 'text-primary bg-primary/5'
                                      )}
                                    >
                                      <Paperclip className="w-3 h-3" />
                                      {att.name || 'Download Attachment'}
                                    </a>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          <div
                            className={cn(
                              'flex items-center gap-1 text-[10px] text-muted-foreground px-1',
                              isAssistant ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <span>
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                            {isAssistant && <CheckCheck className="w-3 h-3 text-primary" />}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions */}
              <div className="px-4 py-2 bg-background/50 border-t border-glass-border overflow-x-auto flex items-center gap-2 no-scrollbar">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Quick:
                </span>
                {QUICK_REPLIES.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(qr)}
                    className="px-2.5 py-1 rounded-xl bg-background border border-glass-border hover:border-primary/40 text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap transition-all shadow-xs"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="px-4 py-2 bg-background/80 border-t border-glass-border flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input Area */}
              <div className="p-4 bg-background/80 backdrop-blur-md border-t border-glass-border space-y-2">
                <div className="flex items-end gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileAttach}
                    multiple
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0 border border-glass-border"
                    title="Attach image or file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Reply to ${selectedConversation.userName || 'customer'}... (Enter to send, Shift+Enter for new line)`}
                    className="flex-1 p-3 rounded-xl text-xs bg-background/90 border border-glass-border focus:border-primary/40 focus:outline-hidden resize-none"
                  />

                  <Button
                    onClick={handleSendReply}
                    disabled={isReplying || (!replyText.trim() && attachedFiles.length === 0)}
                    className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 shrink-0"
                  >
                    {isReplying ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Dispatches directly to {selectedConversation.source || selectedConversation.platform || 'customer'}
                  </span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-4">
              <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 shadow-inner">
                <MessageSquare className="w-12 h-12 text-primary" />
              </div>
              <div className="max-w-sm space-y-1.5">
                <h3 className="text-base font-bold text-foreground">Select a Social Conversation</h3>
                <p className="text-xs leading-relaxed">
                  Choose any customer conversation from the list to read their incoming messages, view attachments, and dispatch instant replies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setConvToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}
