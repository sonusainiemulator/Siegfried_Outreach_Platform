export interface FileChatHeaderProps {
  onNewChat: () => void
  onOpenHistory: () => void
}

export interface FileHistorySidebarProps {
  history: any[]
  isLoading: boolean
  activeSessionId: string | null
  onSessionSelect: (id: string) => void
  onNewChat: () => void
  refetchHistory: () => void
  isModal?: boolean
  canManage?: boolean
  canManageArchived?: boolean
  onClose?: () => void
}

export interface ChatInterfaceProps {
  messages: any[]
  isSending: boolean
  isHistoryLoading: boolean
  onSendMessage: (message: string) => void
  activeSession: any
  canChat?: boolean
  onScrollChange?: (pos: number) => void
  initialScrollPos?: number
  onToggleSidebar?: () => void
}

export interface FileUploadLandingProps {
  onFileUpload: (file: File) => void
  isAnalyzing: boolean
  canUpload?: boolean
  onToggleSidebar?: () => void
}

export interface FileHistoryItemProps {
  chat: any
  activeSessionId: string | null
  selectedConversations: Set<string>
  isSelectionMode: boolean
  toggleConversationSelection: (id: string) => void
  onSessionSelect: (id: string) => void
  searchQuery: string
  activeTab: string
  handleTogglePin: (e: React.MouseEvent, chat: any) => void
  handleArchive: (e: React.MouseEvent, id: string, isArchiving: boolean) => void
  setConvToDelete: (ids: string[]) => void
  setIsDeleteModalOpen: (open: boolean) => void
  canManage?: boolean
  canManageArchived?: boolean
  t: (key: string, options?: any) => string
}

export interface FileHistoryListProps {
  currentList: any[]
  isCurrentlyLoading: boolean
  searchQuery: string
  activeTab: string
  activeSessionId: string | null
  selectedConversations: Set<string>
  isSelectionMode: boolean
  toggleConversationSelection: (id: string) => void
  onSessionSelect: (id: string) => void
  handleTogglePin: (e: React.MouseEvent, chat: any) => void
  handleArchive: (e: React.MouseEvent, id: string, isArchiving: boolean) => void
  setConvToDelete: (ids: string[]) => void
  setIsDeleteModalOpen: (open: boolean) => void
  canManage?: boolean
  canManageArchived?: boolean
  t: (key: string, options?: any) => string
}