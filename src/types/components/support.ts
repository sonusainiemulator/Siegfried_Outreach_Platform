import { Chatbot } from "../chatbot"

export type ActiveTab = 'details' | 'history'

export interface MessageAttachment {
  url: string
  fileType: string
  name: string
}

export interface Message {
  id?: string
  _id?: string
  role: string
  content: string
  senderName?: string
  timestamp: string
  attachments?: MessageAttachment[]
}

export interface AssignedAgent {
  id: string
  name: string
  email?: string
  avatar?: string
  isOnline?: boolean
  activeConversations?: number
}

export interface LastMessage {
  content: string
  timestamp: string
  role: string
}

export interface SupportConversation {
  id: string
  displayId?: string
  userName: string
  userImage?: string
  isUserOnline?: boolean
  source?: string
  status?: string
  assignedAgent?: AssignedAgent
  lastMessage?: LastMessage
  lastActivity?: string
  chatbot?: Chatbot
  title?: string
}

export interface Agent {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline?: boolean
  activeConversations?: number
  role?: string
}


export interface ContactSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface SupportSidebarProps {
  onContactClick: () => void
}

export interface ChatPanelProps {
  conversation: SupportConversation
  messages: any[]
  isHistoryLoading: boolean
  isViewingHistory: boolean
  replyText: string
  isReplying: boolean
  canReply: boolean
  canManageAgents: boolean
  agents: Agent[]
  role: string
  userId?: string
  scrollRef: React.RefObject<HTMLDivElement | null>
  attachedFiles: File[]
  isCampaign?: boolean
  highlightMessageId?: string | null
  onReplyChange: (v: string) => void
  onSendReply: () => void
  onResolve: () => void
  onAssignAgent: (agentId: string | null) => void
  onBackToActive: () => void
  onAttachedFilesChange: (files: File[]) => void
  onBackToList?: () => void
  onToggleDetails?: () => void
  onToggleList?: () => void
  onImageClick?: (url: string) => void
}


export interface ConversationListProps {
  conversations: SupportConversation[]
  isLoading: boolean
  selectedId: string | null
  role: string
  channelFilter: string
  statusFilter?: string
  agentFilter?: string
  searchQuery: string
  campaignHub?: boolean
  onSelect: (id: string) => void
  onChannelFilter: (v: string) => void
  onStatusFilter: (v: string) => void
  onAgentFilter: (v: string) => void
  onSearch: (v: string) => void
  onClose?: () => void
  className?: string
}

export interface CustomerDetailsSidebarProps {
  conversation: SupportConversation
  activeTab: ActiveTab
  historicalConversations: SupportConversation[]
  displayedConversationId: string | null
  baseApiUrl?: string
  onTabChange: (tab: ActiveTab) => void
  onViewHistory: (id: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export interface SupportChatHeaderProps {
  conversation: SupportConversation
  canManageAgents: boolean
  agents: Agent[]
  role: string
  userId?: string
  isCampaign?: boolean
  canReply: boolean
  onToggleList?: () => void
  onToggleDetails?: () => void
  onAssignAgent: (agentId: string | null) => void
  onResolve: () => void
}

export interface SupportChatInputProps {
  conversation: SupportConversation
  replyText: string
  isReplying: boolean
  canReply: boolean
  attachedFiles: File[]
  onReplyChange: (v: string) => void
  onSendReply: () => void
  onAttachedFilesChange: (files: File[]) => void
  scrollToBottom: () => void
  isDraggingOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  dropZoneRef: React.RefObject<HTMLDivElement | null>
}

export interface FilePreviewStripProps {
  files: File[]
  onRemove: (index: number) => void
}

export interface SupportMessageItemProps {
  msg: Message
  isAgent: boolean
  conversation: SupportConversation
  activeHighlightId: string | null
  onImageClick?: (url: string) => void
  messageRef?: (el: HTMLDivElement | null) => void
}


export interface SupportMessageListProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  isViewingHistory: boolean
  onBackToActive: () => void
  isHistoryLoading: boolean
  messages: any[]
  conversation: SupportConversation
  activeHighlightId: string | null
  showScrollButton: boolean
  scrollToBottom: () => void
  onImageClick?: (url: string) => void
  messageRefs?: React.MutableRefObject<Map<string, HTMLDivElement>>
}

export interface MessageAttachmentProps {
  attachment: MessageAttachment
  onImageClick?: (url: string) => void
}