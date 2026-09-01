import { ChatSidebarProps, Conversation } from '../chat'
import { InteractionMessage } from '../chatbot'

export interface ChatExportButtonsProps {
  messages: InteractionMessage[]
  chatbotName: string
}

export interface ChatPageProps {
  params: Promise<{ id: string }>
}

export interface ExtendedChatSidebarProps extends ChatSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  messages?: InteractionMessage[]
  chatbotName?: string
  onShare?: () => void
}

export interface SidebarHeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isSelectionMode: boolean
  toggleSelectionMode: () => void
  selectedCount: number
  totalItems: number
  onSelectAll: (checked: boolean) => void
  onBulkDelete: () => void
  canManageChat: boolean
  canManageArchived: boolean
  hasItems: boolean
  onClose?: () => void
}

export interface ConversationItemProps {
  conv: Conversation
  isActive: boolean
  isSelected: boolean
  isEditing: boolean
  isSelectionMode: boolean
  editTitle: string
  setEditTitle: (title: string) => void
  onSelect: (id: string, e?: React.MouseEvent) => void
  onEdit: (e: React.MouseEvent, conv: Conversation) => void
  onSaveTitle: (e?: React.FormEvent) => void
  onCancelEdit: () => void
  onTogglePin: (e: React.MouseEvent, conv: Conversation) => void
  onToggleArchive: (e: React.MouseEvent, conv: Conversation) => void
  onDelete: (id: string) => void
  editInputRef: React.RefObject<HTMLInputElement | null>
  canManageChat: boolean
  canManageArchived: boolean
  activeTab: string
  direction: 'ltr' | 'rtl'
}

export interface ConversationListsProps {
  conversations: Conversation[]
  activeTab: string
  sessionId: string | null
  isSelectionMode: boolean
  selectedConversations: Set<string>
  editingId: string | null
  editTitle: string
  setEditTitle: (title: string) => void
  onSwitchConversation: (sessionId: string) => void
  toggleConversationSelection: (id: string) => void
  onStartEdit: (e: React.MouseEvent, conv: Conversation) => void
  onSaveTitle: (e?: React.FormEvent) => void
  onCancelEdit: () => void
  onTogglePin: (e: React.MouseEvent, conv: Conversation) => void
  onToggleArchive: (e: React.MouseEvent, conv: Conversation) => void
  onDelete: (id: string) => void
  editInputRef: React.RefObject<HTMLInputElement | null>
  canManageChat: boolean
  canManageArchived: boolean
  direction: 'ltr' | 'rtl'
}

export interface SidebarFooterProps {
  messages: InteractionMessage[]
  chatbotName: string
  onShare?: () => void
}
