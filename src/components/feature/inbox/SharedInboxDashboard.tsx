'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search,
  Plus,
  MoreVertical,
  Paperclip,
  Smile,
  Sparkles,
  Send,
  Lock,
  Phone,
  Mail,
  Check,
  CheckCheck,
  Bell,
  Globe,
  X,
  Copy,
  VolumeX,
  Volume2,
  RefreshCw,
  MessageCircle,
  Instagram,
  Facebook,
  Bot,
  ChevronDown,
  Trash2,
  Archive,
  Pin,
  ExternalLink,
} from 'lucide-react'
import {
  useGetCampaignConversationsQuery,
  useGetCampaignConversationHistoryQuery,
  useCampaignInboxReplyMutation,
  useUpdateConversationStatusMutation,
  useUpdateConversationDetailsMutation,
  useDeleteCampaignConversationMutation,
} from '@/redux/api/campaignInboxApi'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { playDmAlertSound } from '@/utils/audioAlert'

type StatusTab = 'open' | 'pending' | 'resolved'
type ComposerMode = 'reply' | 'note'

interface ContactCRM {
  firstName: string
  lastName: string
  email: string
  phone: string
  assignee: string
  teamRouter: string
  aiCopilot: boolean
  isMuted: boolean
}

export default function SharedInboxDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssignee, setSelectedAssignee] = useState('All Assignees')
  const [statusTab, setStatusTab] = useState<StatusTab>('open')
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)

  // Composer state
  const [composerMode, setComposerMode] = useState<ComposerMode>('reply')
  const [messageInput, setMessageInput] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  // Details sidebar toggle
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)

  // CRM state for right panel
  const [crmState, setCrmState] = useState<ContactCRM>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    assignee: 'Alex Morgan',
    teamRouter: 'Enterprise Sales & Growth',
    aiCopilot: true,
    isMuted: false,
  })

  // Queries & mutations
  const {
    data: listData,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useGetCampaignConversationsQuery({
    search: searchQuery,
    status: statusTab,
    assignee: selectedAssignee !== 'All Assignees' ? selectedAssignee : undefined,
  })

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useGetCampaignConversationHistoryQuery(selectedConvId!, {
    skip: !selectedConvId,
  })

  const [sendReply, { isLoading: isSending }] = useCampaignInboxReplyMutation()
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateConversationStatusMutation()
  const [updateDetails, { isLoading: isUpdatingDetails }] = useUpdateConversationDetailsMutation()
  const [deleteConversation] = useDeleteCampaignConversationMutation()

  // Raw conversations from API
  const conversations = useMemo(() => {
    return listData?.conversations || []
  }, [listData])

  // Set default selection
  useEffect(() => {
    const urlId = searchParams.get('conversationId')
    if (urlId) {
      setSelectedConvId(urlId)
    } else if (conversations.length > 0 && !selectedConvId) {
      setSelectedConvId(conversations[0].id)
    }
  }, [searchParams, conversations, selectedConvId])

  // Active conversation
  const activeConv = useMemo(() => {
    if (!selectedConvId) return null
    return (
      conversations.find((c: any) => c.id === selectedConvId) ||
      (historyData?.conversation?.id === selectedConvId ? historyData.conversation : null)
    )
  }, [selectedConvId, conversations, historyData])

  // Sync CRM state when active conversation changes
  useEffect(() => {
    if (activeConv) {
      const parts = (activeConv.accountName || activeConv.userName || activeConv.title || '').split(' ')
      setCrmState({
        firstName: activeConv.firstName || parts[0] || '',
        lastName: activeConv.lastName || parts.slice(1).join(' ') || '',
        email: activeConv.email || `${(parts[0] || 'contact').toLowerCase()}@company.com`,
        phone: activeConv.phone || '+1 (555) 019-8421',
        assignee: activeConv.assignee || 'Alex Morgan',
        teamRouter: activeConv.teamRouter || 'Enterprise Sales & Growth',
        aiCopilot: activeConv.aiCopilotEnabled ?? true,
        isMuted: activeConv.isMuted ?? false,
      })
    }
  }, [activeConv])

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [historyData?.conversation?.messages])

  // Channel badge icon helper
  const renderChannelBadge = (channel: string = '') => {
    const c = channel.toLowerCase()
    if (c.includes('whatsapp')) {
      return (
        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-2 ring-background shadow-xs">
          <MessageCircle className="w-2.5 h-2.5 fill-current" />
        </div>
      )
    }
    if (c.includes('telegram')) {
      return (
        <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white ring-2 ring-background shadow-xs">
          <Send className="w-2.5 h-2.5 -translate-x-0.5" />
        </div>
      )
    }
    if (c.includes('instagram')) {
      return (
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white ring-2 ring-background shadow-xs">
          <Instagram className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (c.includes('email') || c.includes('mail')) {
      return (
        <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white ring-2 ring-background shadow-xs">
          <Mail className="w-2.5 h-2.5" />
        </div>
      )
    }
    if (c.includes('facebook') || c.includes('messenger')) {
      return (
        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white ring-2 ring-background shadow-xs">
          <Facebook className="w-2.5 h-2.5" />
        </div>
      )
    }
    return (
      <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-white ring-2 ring-background shadow-xs">
        <MessageCircle className="w-2.5 h-2.5" />
      </div>
    )
  }

  // Handle Send Reply or Internal Note
  const handleSendMessage = async () => {
    if (!selectedConvId || (!messageInput.trim() && attachedFiles.length === 0)) return

    try {
      const isNote = composerMode === 'note'
      await sendReply({
        conversationId: selectedConvId,
        message: messageInput.trim(),
        files: attachedFiles,
        isNote,
      }).unwrap()

      setMessageInput('')
      setAttachedFiles([])
      toast.success(isNote ? '🔒 Internal note added to thread' : '🚀 Reply dispatched successfully')
      refetchHistory()
      refetchList()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to dispatch message')
    }
  }

  // Handle Mark Status
  const handleMarkStatus = async (newStatus: 'pending' | 'resolved' | 'open') => {
    if (!selectedConvId) return
    try {
      await updateStatus({
        conversationId: selectedConvId,
        status: newStatus,
      }).unwrap()
      toast.success(`Conversation marked as ${newStatus}`)
      refetchList()
      refetchHistory()
    } catch (err: any) {
      toast.error('Failed to update status')
    }
  }

  // Handle Save CRM
  const handleSaveCRM = async () => {
    if (!selectedConvId) return
    try {
      await updateDetails({
        conversationId: selectedConvId,
        firstName: crmState.firstName,
        lastName: crmState.lastName,
        email: crmState.email,
        phone: crmState.phone,
        assignee: crmState.assignee,
        teamRouter: crmState.teamRouter,
        aiCopilotEnabled: crmState.aiCopilot,
        isMuted: crmState.isMuted,
      }).unwrap()
      toast.success('CRM profile updated successfully!')
      refetchList()
    } catch (err: any) {
      toast.error('Failed to update CRM profile')
    }
  }

  // Handle AI Copilot Smart Response Suggestion
  const handleAiSuggest = () => {
    setIsAiGenerating(true)
    setTimeout(() => {
      if (composerMode === 'note') {
        setMessageInput('Internal Note: Customer confirmed interest in Enterprise SLA with NET-30 terms. Handing off to legal for review.')
      } else {
        setMessageInput('Hi! Thank you for following up. We have verified your account and our senior architect is preparing your tailored deployment schedule.')
      }
      setIsAiGenerating(false)
      toast.info('AI Copilot generated a suggestion!')
    }, 450)
  }

  // Format time
  const formatTime = (dateStr?: string | Date) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] max-h-[calc(100vh-70px)] bg-background text-foreground overflow-hidden font-sans">
      {/* Top Breadcrumb Bar */}
      <div className="h-12 border-b border-border/80 px-6 flex items-center justify-between bg-card/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            SHARED INBOX
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button
            onClick={() => {
              playDmAlertSound(true)
              toast('Notification chime tested')
            }}
            className="hover:text-foreground transition-colors"
            title="Test notification alert"
          >
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 text-xs font-semibold hover:text-foreground cursor-pointer">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </div>
          <button
            onClick={() => {
              refetchList()
              if (selectedConvId) refetchHistory()
              toast.success('Inbox refreshed')
            }}
            className="hover:text-foreground transition-colors ml-1"
            title="Refresh Inbox"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: Conversations List */}
        <div className="w-80 lg:w-96 border-r border-border flex flex-col bg-card/30 shrink-0">
          {/* Search + New Chat Button */}
          <div className="p-3 border-b border-border/60 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-muted/40 rounded-md border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => {
                toast.info('Initiate new outbound campaign message or DM')
              }}
              className="p-2 rounded-md border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Assignee Filter Dropdown */}
          <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between text-xs bg-muted/20">
            <span className="font-semibold text-muted-foreground text-[11px] tracking-wider uppercase">
              ASSIGNEE
            </span>
            <div className="relative">
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                aria-label="Filter conversations by assignee"
                className="text-xs font-medium bg-transparent text-foreground cursor-pointer focus:outline-none pr-4 appearance-none"
              >
                <option value="All Assignees">All Assignees</option>
                <option value="Alex Morgan">Alex Morgan</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="David Miller">David Miller</option>
                <option value="Unassigned">Unassigned</option>
              </select>
              <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Tabs: Open | Pending | Resolved */}
          <div className="grid grid-cols-3 border-b border-border text-center text-xs font-semibold bg-background/50">
            {(['open', 'pending', 'resolved'] as StatusTab[]).map((tab) => {
              const isActive = statusTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={cn(
                    'py-2.5 capitalize transition-all relative',
                    isActive
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {isListLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <span>Loading conversations...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <p>No conversations in {statusTab} status.</p>
                <button
                  onClick={() => setStatusTab('open')}
                  className="text-primary hover:underline text-xs"
                >
                  Switch to Open
                </button>
              </div>
            ) : (
              conversations.map((conv: any) => {
                const isSelected = conv.id === selectedConvId
                const initial = (conv.accountName || conv.userName || conv.title || 'U')[0].toUpperCase()
                const name = conv.accountName || conv.userName || conv.title || 'Unknown Contact'
                const snippet = conv.lastMessage?.content || conv.last_message || 'No preview available'
                const time = formatTime(conv.lastMessage?.timestamp || conv.lastActivity)
                const tags: string[] = conv.tags || (conv.channel === 'whatsapp' ? ['VIP', 'Enterprise'] : ['Lead'])
                const isUnread = conv.unreadCount > 0

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id)
                      router.push(`/shared-inbox?conversationId=${conv.id}`, { scroll: false })
                    }}
                    className={cn(
                      'p-3.5 cursor-pointer transition-all flex items-start gap-3 relative group hover:bg-muted/40',
                      isSelected && 'bg-muted/60 border-l-2 border-primary'
                    )}
                  >
                    {/* Avatar with Channel Icon Badge */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-sm text-foreground">
                        {initial}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        {renderChannelBadge(conv.channel || conv.source)}
                      </div>
                    </div>

                    {/* Contact Info & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {name}
                        </span>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {time}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate mt-0.5 font-normal">
                        {snippet}
                      </p>

                      {/* Tag Badges */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted border border-border/60 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Unread Indicator Dot */}
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-foreground shrink-0 self-center ml-1" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Chat Thread & Composer */}
        <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-card/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-xs text-foreground">
                      {(activeConv.accountName || activeConv.userName || activeConv.title || 'U')[0].toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">
                        {activeConv.accountName || activeConv.userName || activeConv.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        ({activeConv.phone || '+1 (555) 019-8421'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      <span>
                        {(activeConv.channel || 'whatsapp').toUpperCase()} CLOUD API (+1555-0199)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Assignee Selector */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/60">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      ASSIGNEE:
                    </span>
                    <select
                      value={crmState.assignee}
                      onChange={(e) => {
                        const newAssignee = e.target.value
                        setCrmState((prev) => ({ ...prev, assignee: newAssignee }))
                        updateDetails({ conversationId: selectedConvId!, assignee: newAssignee })
                        toast.success(`Assigned to ${newAssignee}`)
                      }}
                      aria-label="Assign conversation to team member"
                      className="text-xs font-semibold bg-transparent text-foreground cursor-pointer focus:outline-none"
                    >
                      <option value="Alex Morgan">Alex Morgan</option>
                      <option value="Sarah Jenkins">Sarah Jenkins</option>
                      <option value="David Miller">David Miller</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>

                  {/* Toggle Profile Details Button */}
                  <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Toggle Contact Profile"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isHistoryLoading ? (
                  <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                    <span>Loading conversation history...</span>
                  </div>
                ) : (historyData?.conversation?.messages || []).length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground">
                    No messages yet in this conversation.
                  </div>
                ) : (
                  (historyData?.conversation?.messages || []).map((msg: any, index: number) => {
                    const isUser = msg.role === 'user'
                    const isInternalNote = msg.isInternalNote || msg.metadata?.isInternalNote

                    // 1. Internal Note Block (Amber / Yellow card as in screenshot)
                    if (isInternalNote) {
                      return (
                        <div
                          key={msg.id || index}
                          className="w-full max-w-2xl mx-auto rounded-xl p-4 bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 shadow-xs space-y-1.5 my-2"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                            <div className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Internal Note</span>
                            </div>
                            <span className="text-[11px] font-medium">
                              {msg.authorName || msg.senderName || 'Alex Morgan'}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed font-normal">
                            {msg.content}
                          </p>
                          <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 text-right">
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      )
                    }

                    // 2. Incoming Bubble (Light gray background)
                    if (isUser) {
                      return (
                        <div key={msg.id || index} className="flex items-start gap-2.5 max-w-xl">
                          <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-[11px] shrink-0 mt-1">
                            {(activeConv.accountName || activeConv.userName || 'U')[0].toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div className="p-3.5 rounded-2xl rounded-tl-sm bg-muted/60 border border-border/50 text-foreground text-xs leading-relaxed shadow-xs">
                              {msg.content}
                            </div>
                            <div className="text-[10px] text-muted-foreground px-1">
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // 3. Outgoing Bubble (Sleek dark black bubble with double tick)
                    return (
                      <div key={msg.id || index} className="flex flex-col items-end gap-1 ml-auto max-w-xl">
                        <div className="p-3.5 rounded-2xl rounded-tr-sm bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs leading-relaxed shadow-xs">
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                          <span>{formatTime(msg.timestamp)}</span>
                          <CheckCheck className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer Box */}
              <div className="border-t border-border bg-card/60 backdrop-blur-md p-4 space-y-3 shrink-0">
                {/* Mode Selector & Status Action Pills */}
                <div className="flex items-center justify-between">
                  {/* Mode Pills: Reply | Note */}
                  <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-muted border border-border/60">
                    <button
                      onClick={() => setComposerMode('reply')}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-semibold transition-all',
                        composerMode === 'reply'
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setComposerMode('note')}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1',
                        composerMode === 'note'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Note</span>
                    </button>
                  </div>

                  {/* Status Indicator & Mark Buttons */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <span className="text-[11px] uppercase tracking-wider font-semibold">STATUS:</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        {activeConv.status === 'resolved' ? 'Resolved' : activeConv.status === 'pending' ? 'Pending' : 'Open'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-[11px] mr-1">Mark:</span>
                      <button
                        onClick={() => handleMarkStatus('pending')}
                        className="px-2.5 py-1 text-xs font-medium rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleMarkStatus('resolved')}
                        className="px-2.5 py-1 text-xs font-medium rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                </div>

                {/* Textarea Input */}
                <div
                  className={cn(
                    'rounded-xl border transition-all p-2.5 bg-background shadow-inner',
                    composerMode === 'note'
                      ? 'border-amber-500/40 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20'
                      : 'border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'
                  )}
                >
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    rows={3}
                    placeholder={
                      composerMode === 'note'
                        ? 'Type internal note (visible only to your team, not sent to contact)...'
                        : 'Type your message response...'
                    }
                    className="w-full bg-transparent resize-none text-xs focus:outline-none placeholder:text-muted-foreground leading-relaxed"
                  />

                  {/* Attached files preview */}
                  {attachedFiles.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-[11px] border border-border"
                        >
                          <Paperclip className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate max-w-[140px]">{file.name}</span>
                          <button
                            onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Composer Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
                          }
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Attach Document or Image"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMessageInput((prev) => prev + ' 😊')}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Add Emoji"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleAiSuggest}
                        disabled={isAiGenerating}
                        className="p-1.5 rounded-md hover:bg-primary/10 text-primary hover:text-primary transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="AI Copilot Smart Suggestion"
                      >
                        <Sparkles className={cn('w-4 h-4', isAiGenerating && 'animate-spin')} />
                      </button>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={isSending || (!messageInput.trim() && attachedFiles.length === 0)}
                      className={cn(
                        'px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50',
                        composerMode === 'note'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900'
                      )}
                    >
                      <span>{composerMode === 'note' ? 'Add Note' : 'Send Reply'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <Bot className="w-12 h-12 stroke-1 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold">Select a conversation to start messaging</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Direct messages across WhatsApp, Telegram, Instagram, Messenger & Email will show here.
              </p>
            </div>
          )}
        </div>

        {/* COLUMN 3: Contact Profile Details (Exact match to screenshot) */}
        {isDetailsOpen && activeConv && (
          <div className="w-80 border-l border-border bg-card/40 flex flex-col shrink-0 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Contact Profile Details
              </span>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar & Actions */}
            <div className="p-6 flex flex-col items-center text-center border-b border-border space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center font-bold text-xl text-foreground">
                  {(activeConv.accountName || activeConv.userName || 'U')[0].toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0">
                  {renderChannelBadge(activeConv.channel || activeConv.source)}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {activeConv.accountName || activeConv.userName || activeConv.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeConv.phone || '+15550198421'}
                </p>
              </div>

              <div className="inline-block px-3 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold tracking-wider">
                CONTACTS.VIP
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full pt-1">
                <button
                  onClick={() => {
                    const newMuted = !crmState.isMuted
                    setCrmState((prev) => ({ ...prev, isMuted: newMuted }))
                    updateDetails({ conversationId: selectedConvId!, isMuted: newMuted })
                    toast.info(newMuted ? 'Contact muted' : 'Contact unmuted')
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{crmState.isMuted ? 'Unmute Contact' : 'Mute Contact'}</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeConv.phone || activeConv.email || '')
                    toast.success('Contact info copied')
                  }}
                  className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy Details"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI Assistant Control */}
            <div className="p-4 border-b border-border space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                <span>AI ASSISTANT CONTROL</span>
              </span>

              <div className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-foreground">AI Copilot Chat</div>
                  <div className="text-[10px] text-muted-foreground">Auto-reply to this contact</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crmState.aiCopilot}
                    onChange={(e) => {
                      const enabled = e.target.checked
                      setCrmState((prev) => ({ ...prev, aiCopilot: enabled }))
                      updateDetails({ conversationId: selectedConvId!, aiCopilotEnabled: enabled })
                      toast.success(enabled ? 'AI Copilot auto-reply enabled' : 'AI Copilot auto-reply disabled')
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            {/* Assigned Team Router */}
            <div className="p-4 border-b border-border space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                ASSIGNED TEAM ROUTER
              </span>
              <div className="relative">
                <select
                  value={crmState.teamRouter}
                  onChange={(e) => {
                    const newRouter = e.target.value
                    setCrmState((prev) => ({ ...prev, teamRouter: newRouter }))
                    updateDetails({ conversationId: selectedConvId!, teamRouter: newRouter })
                    toast.success(`Routed to ${newRouter}`)
                  }}
                  aria-label="Select assigned team routing department"
                  className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-xs font-semibold text-foreground appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Enterprise Sales & Growth">Enterprise Sales & Growth</option>
                  <option value="Tier 1 Support">Tier 1 Support</option>
                  <option value="Billing & Invoicing">Billing & Invoicing</option>
                  <option value="VIP Customer Success">VIP Customer Success</option>
                  <option value="Technical Operations">Technical Operations</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* CRM Information Form */}
            <div className="p-4 space-y-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                CRM INFORMATION
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    value={crmState.firstName}
                    onChange={(e) => setCrmState((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-xs bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    value={crmState.lastName}
                    onChange={(e) => setCrmState((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-xs bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={crmState.email}
                    onChange={(e) => setCrmState((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveCRM}
                disabled={isUpdatingDetails}
                className="w-full mt-2 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              >
                {isUpdatingDetails ? 'Saving CRM...' : 'Save CRM Details'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
