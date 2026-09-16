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
  Clock,
  SlidersHorizontal,
  Play,
  Pause,
  FileText,
  Video,
  ChevronDown,
  UserCheck,
  Star,
  Bookmark,
  Share2,
  Film
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

// Meta Business Suite category tabs
type CategoryTab =
  | 'all'
  | 'messenger'
  | 'instagram'
  | 'whatsapp'
  | 'facebook_comments'
  | 'instagram_comments'
  | 'tiktok'
  | 'telegram'

type QuickFilter = 'all' | 'unread' | 'priority' | 'ad_replies' | 'follow_up'

interface TabConfig {
  id: CategoryTab
  label: string
  badge?: string
  icon: React.ReactNode
}

const CATEGORY_TABS: TabConfig[] = [
  { id: 'all', label: 'All messages', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'messenger', label: 'Messenger', icon: <Facebook className="w-4 h-4 text-blue-500" /> },
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
  { id: 'whatsapp', label: 'WhatsApp', badge: 'New', icon: <MessageCircle className="w-4 h-4 text-emerald-500" /> },
  { id: 'facebook_comments', label: 'Facebook comments', icon: <Facebook className="w-4 h-4 text-blue-600" /> },
  { id: 'instagram_comments', label: 'Instagram comments', icon: <Instagram className="w-4 h-4 text-purple-500" /> },
  { id: 'tiktok', label: 'TikTok DMs', icon: <Film className="w-4 h-4 text-black dark:text-white" /> },
  { id: 'telegram', label: 'Telegram', icon: <Send className="w-4 h-4 text-sky-500" /> },
]

const QUICK_REPLIES = [
  'Hello! How can we help you today?',
  'Thank you for reaching out! We will review your request right away.',
  'Could you please share your email or phone number so we can assist you better?',
  'Our team is reviewing your inquiry and will follow up shortly!',
  'You can check our latest plans and services directly on our website.',
]

// Audio Player Component for Voice Notes
function VoiceNotePlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${mins}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-glass-border min-w-[220px]">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 transition-transform active:scale-95 shadow-sm"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="flex-1 space-y-1">
        {/* Waveform bars simulation */}
        <div className="flex items-center gap-0.5 h-4">
          {[40, 70, 30, 85, 100, 60, 45, 90, 75, 50, 65, 80, 40, 95, 70, 30].map((height, i) => {
            const progress = duration > 0 ? (currentTime / duration) * 16 : 0
            const isPlayed = i <= progress
            return (
              <span
                key={i}
                style={{ height: `${height}%` }}
                className={cn(
                  'w-1 rounded-full transition-colors',
                  isPlayed ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{formatSecs(currentTime)}</span>
          <span>{duration > 0 ? formatSecs(duration) : 'Voice note'}</span>
        </div>
      </div>
    </div>
  )
}

export default function SocialInboxDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialConvId = searchParams.get('conversationId')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConvId)
  const [activeTab, setActiveTab] = useState<CategoryTab>('all')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [desktopAlertsGranted, setDesktopAlertsGranted] = useState<boolean>(false)
  const [assignedAgent, setAssignedAgent] = useState<string>('Christopher Siegfried')

  // Modals & Lightbox
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [convToDelete, setConvToDelete] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      toast.success('Sound alerts enabled!')
    } else {
      toast.info('Sound alerts muted.')
    }
  }

  const handleTestSound = () => {
    playDmAlertSound(true)
    toast.success('Playing notification chime 🎵')
  }

  const requestDesktopPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser notifications are not supported.')
      return
    }
    try {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        setDesktopAlertsGranted(true)
        toast.success('Desktop alerts enabled!')
        new Notification('Siegfried Social Inbox Alerts Active', {
          body: 'You are now ready to receive real-time direct messages and comments!',
          icon: '/favicon.ico',
        })
      }
    } catch {
      toast.error('Could not request notification permissions.')
    }
  }

  // Fetch list
  const {
    data: listData,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useGetCampaignConversationsQuery({
    search: searchQuery,
  })

  // Fetch history
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useGetCampaignConversationHistoryQuery(selectedConversationId!, {
    skip: !selectedConversationId,
  })

  const [sendReply, { isLoading: isReplying }] = useCampaignInboxReplyMutation()
  const [deleteConversation, { isLoading: isDeleting }] = useDeleteCampaignConversationMutation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [historyData?.conversation?.messages])

  useEffect(() => {
    const paramId = searchParams.get('conversationId')
    if (paramId && paramId !== selectedConversationId) {
      setSelectedConversationId(paramId)
    }
  }, [searchParams])

  // Filter conversations based on CategoryTab and QuickFilter
  const conversations = (listData?.conversations || []).filter((conv: any) => {
    const source = (conv.channel || conv.source || conv.platform || conv.metadata?.source || '').toLowerCase()

    // Tab filter
    if (activeTab === 'messenger') {
      if (!source.includes('messenger') && !source.includes('facebook')) return false
      if (source === 'facebook_comment') return false
    } else if (activeTab === 'instagram') {
      if (!source.includes('instagram') || source === 'instagram_comment') return false
    } else if (activeTab === 'whatsapp') {
      if (!source.includes('whatsapp')) return false
    } else if (activeTab === 'facebook_comments') {
      if (!source.includes('facebook_comment') && !source.includes('facebook comment')) return false
    } else if (activeTab === 'instagram_comments') {
      if (!source.includes('instagram_comment') && !source.includes('instagram comment')) return false
    } else if (activeTab === 'tiktok') {
      if (!source.includes('tiktok')) return false
    } else if (activeTab === 'telegram') {
      if (!source.includes('telegram')) return false
    }

    // Quick filter
    if (quickFilter === 'unread') {
      if (conv.status === 'resolved') return false
      if (conv.unreadCount === 0 && conv.status !== 'active' && conv.status !== 'open') return false
    }
    if (quickFilter === 'priority' && !conv.isPinned && !conv.tags?.includes('VIP')) return false
    if (quickFilter === 'follow_up' && conv.status !== 'pending') return false

    return true
  })

  const selectedConversation =
    conversations.find((c: any) => c.id === selectedConversationId) ||
    (historyData?.conversation?.id === selectedConversationId ? historyData.conversation : null)

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
      toast.success('Reply dispatched directly!')
      refetchHistory()
      refetchList()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send reply')
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

  const getPlatformIcon = (source: string) => {
    const s = (source || '').toLowerCase()
    if (s === 'instagram_comment') {
      return (
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xs" title="Instagram Comment">
          <MessageSquare className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (s === 'facebook_comment') {
      return (
        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs" title="Facebook Comment">
          <MessageSquare className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (s.includes('instagram')) {
      return (
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xs" title="Instagram Direct">
          <Instagram className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (s.includes('facebook') || s.includes('messenger')) {
      return (
        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-xs" title="Facebook Messenger">
          <Facebook className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (s.includes('whatsapp')) {
      return (
        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs" title="WhatsApp Business">
          <MessageCircle className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (s.includes('tiktok')) {
      return (
        <div className="w-4 h-4 rounded-full bg-black dark:bg-zinc-800 flex items-center justify-center text-white shadow-xs" title="TikTok DM">
          <Film className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (s.includes('telegram')) {
      return (
        <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-xs" title="Telegram">
          <Send className="w-2.5 h-2.5" />
        </div>
      )
    }
    return (
      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shadow-xs">
        <MessageSquare className="w-2.5 h-2.5" />
      </div>
    )
  }

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    if (diffDays === 1) return 'Yesterday'
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${d.getDate()} ${months[d.getMonth()]}`
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Meta Business Suite Header */}
      <div className="border-b border-glass-border bg-background/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inbox</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Respond to messages, comments, set up automations and more.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Alerts */}
          <Button
            variant={desktopAlertsGranted ? 'outline' : 'default'}
            size="sm"
            onClick={requestDesktopPermission}
            className={cn(
              'h-8 rounded-lg text-xs font-medium gap-1.5 shadow-xs',
              desktopAlertsGranted
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-primary text-white'
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            {desktopAlertsGranted ? 'Alerts Active' : 'Enable Desktop Alerts'}
          </Button>

          {/* Sound Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            className={cn(
              'h-8 rounded-lg text-xs font-medium gap-1.5 border-glass-border shadow-xs',
              soundEnabled ? 'text-primary bg-primary/5 border-primary/20' : 'text-muted-foreground'
            )}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-primary" /> : <VolumeX className="w-3.5 h-3.5" />}
            {soundEnabled ? 'Chime On' : 'Muted'}
          </Button>

          {/* Test Chime */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTestSound}
            className="h-8 rounded-lg text-xs text-muted-foreground hover:text-primary"
          >
            Test Chime 🎵
          </Button>

          {/* Switch to 3-Column Shared Inbox */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/shared-inbox')}
            className="h-8 rounded-lg text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            <span>Shared Inbox (3-Col)</span>
            <ExternalLink className="w-3 h-3" />
          </Button>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              refetchList()
              if (selectedConversationId) refetchHistory()
            }}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Category Tabs (All messages, Messenger, Instagram, WhatsApp New, Facebook comments, Instagram comments, TikTok DMs) */}
      <div className="border-b border-glass-border px-6 flex items-center gap-2 overflow-x-auto no-scrollbar bg-background/80">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 relative',
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white uppercase leading-tight shadow-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Body: Left Conversations Sidebar + Right Chat Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Search, Filters, and Conversation List */}
        <div className="w-full md:w-80 lg:w-[380px] flex flex-col border-r border-glass-border bg-background shrink-0">
          {/* Search + Manage button */}
          <div className="p-3.5 pb-2 border-b border-glass-border space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-lg bg-muted/20 border-glass-border focus-visible:ring-primary/20"
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

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-medium rounded-lg border-glass-border gap-1.5 shadow-xs shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                Manage
              </Button>
            </div>

            {/* Quick Filter Pills (All, Unread, Priority, Ad replies, Follow up) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'priority', label: 'Priority' },
                  { id: 'ad_replies', label: 'Ad replies' },
                  { id: 'follow_up', label: 'Follow up' },
                ] as const
              ).map((f) => {
                const isSelected = quickFilter === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setQuickFilter(f.id)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border',
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-muted/30 text-muted-foreground border-glass-border hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-glass-border">
            {isListLoading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-2 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                <p className="text-xs">Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center space-y-3 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted/40 border border-glass-border flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 opacity-40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No conversations found</p>
                  <p className="text-xs mt-1 text-muted-foreground max-w-[220px]">
                    Direct messages and comments from your connected social channels will appear here in real-time.
                  </p>
                </div>
              </div>
            ) : (
              conversations.map((conv: any) => {
                const isSelected = conv.id === selectedConversationId
                const source = conv.source || conv.platform || 'social'
                const displayName = conv.userName || conv.username || conv.title || conv.sessionId
                const lastMsg = conv.lastMessage?.content || (conv.messages?.[conv.messages.length - 1]?.content) || 'You sent an attachment.'
                const timeAgo = formatTimestamp(conv.lastActivity || conv.lastMessage?.timestamp)

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={cn(
                      'p-3.5 cursor-pointer transition-all flex items-start gap-3 relative group hover:bg-muted/20',
                      isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                    )}
                  >
                    {/* Rounded Circular Avatar with Platform Badge */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-primary text-white flex items-center justify-center text-lg font-bold shadow-sm">
                        {displayName.slice(0, 1).toUpperCase()}
                      </div>
                      {/* Attached bottom-right badge icon */}
                      <div className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-background border border-glass-border shadow-xs">
                        {getPlatformIcon(source)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-sm font-semibold text-foreground truncate">{displayName}</h4>
                        <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo}</span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {conv.lastMessage?.role === 'assistant' ? 'You: ' : ''}
                        {lastMsg}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="capitalize text-primary font-medium">
                          {source.replace('_', ' ')}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setConvToDelete(conv.id)
                            setIsDeleteModalOpen(true)
                          }}
                          className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
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

        {/* Right Column: Chat History & Reply Area */}
        <div className="flex-1 flex flex-col bg-background/50 overflow-hidden relative">
          {selectedConversationId && selectedConversation ? (
            <>
              {/* Chat Header matching Meta Business Suite */}
              <div className="p-4 border-b border-glass-border flex items-center justify-between bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-primary text-white flex items-center justify-center text-lg font-bold shadow-sm">
                      {(selectedConversation.userName || selectedConversation.title || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-background border border-glass-border shadow-xs">
                      {getPlatformIcon(selectedConversation.source || selectedConversation.platform)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {selectedConversation.userName || selectedConversation.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Assign dropdown */}
                      <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                        <span>Assign to {assignedAgent}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {selectedConversation.accountName && (
                        <span className="text-xs text-muted-foreground">
                          • via {selectedConversation.accountName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchHistory()}
                    className="h-8 rounded-lg text-xs gap-1.5 text-muted-foreground hover:text-foreground"
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
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Post reference bar if comment */}
              {(selectedConversation.source === 'instagram_comment' || selectedConversation.source === 'facebook_comment') && (
                <div className="px-4 py-2 bg-primary/5 border-b border-glass-border flex items-center justify-between text-xs text-primary">
                  <span className="font-semibold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Comment on Post: {selectedConversation.postTitle || selectedConversation.metadata?.postTitle || 'Social Post'}
                  </span>
                  {selectedConversation.metadata?.postUrl && (
                    <a
                      href={selectedConversation.metadata.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline flex items-center gap-1 text-[11px]"
                    >
                      View Live Post <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Messages History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/5">
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
                          'flex items-end gap-2 max-w-[85%] md:max-w-[75%]',
                          isAssistant ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        )}
                      >
                        {!isAssistant && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {(msg.senderName || 'U').slice(0, 1).toUpperCase()}
                          </div>
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

                            {/* Rich Media Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {msg.attachments.map((att: any, attIdx: number) => {
                                  const fileUrl = getMediaUrl(att.url)
                                  const fileType = (att.fileType || '').toLowerCase()
                                  const isAudio = fileType.includes('audio') || /\.(mp3|ogg|wav|m4a)/i.test(att.url || '')
                                  const isVideo = fileType.includes('video') || /\.(mp4|mov|webm)/i.test(att.url || '')
                                  const isImg = fileType.includes('image') || /\.(jpg|jpeg|png|webp|gif)/i.test(att.url || '')

                                  if (isAudio && fileUrl) {
                                    return <VoiceNotePlayer key={attIdx} url={fileUrl} />
                                  }

                                  if (isVideo && fileUrl) {
                                    return (
                                      <div key={attIdx} className="rounded-xl overflow-hidden max-w-sm">
                                        <video controls src={fileUrl} className="w-full h-auto max-h-60 rounded-xl" />
                                      </div>
                                    )
                                  }

                                  if (isImg && fileUrl) {
                                    return (
                                      <div
                                        key={attIdx}
                                        className="relative rounded-xl overflow-hidden cursor-pointer max-w-sm group"
                                        onClick={() => {
                                          setLightboxImages([fileUrl])
                                          setLightboxIndex(0)
                                          setLightboxOpen(true)
                                        }}
                                      >
                                        <img
                                          src={fileUrl}
                                          alt="Attachment"
                                          className="w-full h-auto object-cover max-h-52 rounded-xl group-hover:scale-105 transition-transform"
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
                                        'flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border shadow-xs',
                                        isAssistant ? 'bg-white/10 text-white border-white/20' : 'bg-background border-glass-border text-primary'
                                      )}
                                    >
                                      <FileText className="w-4 h-4" />
                                      <span className="truncate">{att.name || 'Download Document'}</span>
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

              {/* Quick Replies Chips */}
              <div className="px-4 py-2 bg-background/50 border-t border-glass-border overflow-x-auto flex items-center gap-2 no-scrollbar">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Quick:
                </span>
                {QUICK_REPLIES.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(qr)}
                    className="px-3 py-1 rounded-lg bg-background border border-glass-border hover:border-primary/40 text-xs text-muted-foreground hover:text-foreground whitespace-nowrap transition-all shadow-xs"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="px-4 py-2 bg-background border-t border-glass-border flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[160px]">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="hover:text-destructive">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Composer */}
              <div className="p-4 bg-background border-t border-glass-border space-y-2">
                <div className="flex items-end gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileAttach}
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground border border-glass-border shrink-0"
                    title="Attach images, videos, voice notes, or documents"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Write a response to ${selectedConversation.userName || 'contact'}... (Enter to send)`}
                    className="flex-1 p-3 rounded-lg text-xs bg-muted/20 border border-glass-border focus:border-primary/40 focus:outline-hidden resize-none"
                  />

                  <Button
                    onClick={handleSendReply}
                    disabled={isReplying || (!replyText.trim() && attachedFiles.length === 0)}
                    className="h-10 px-4 rounded-lg text-xs font-semibold gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-sm shrink-0"
                  >
                    {isReplying ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Dispatches directly to {selectedConversation.source?.replace('_', ' ') || 'contact'}
                  </span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/40 border border-glass-border flex items-center justify-center">
                <MessageSquare className="w-8 h-8 opacity-40" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="text-base font-bold text-foreground">Select a conversation</h3>
                <p className="text-xs text-muted-foreground">
                  Choose any conversation or comment thread from the sidebar to view message history and send replies.
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
