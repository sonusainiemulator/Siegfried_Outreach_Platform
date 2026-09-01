import { Chatbot, InteractionMessage } from "./chatbot"

export interface ChatHeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  rightPanelOpen: boolean
  setRightPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  botDropRef: React.RefObject<HTMLDivElement | null>
  botDropOpen: boolean
  setBotDropOpen: React.Dispatch<React.SetStateAction<boolean>>
  botSearch: string
  setBotSearch: React.Dispatch<React.SetStateAction<string>>
  filteredBots: any[]
  selectedBot: Chatbot | null
  setSelectedBot: React.Dispatch<React.SetStateAction<Chatbot | null>>
  modelDropRef: React.RefObject<HTMLDivElement | null>
  modelDropOpen: boolean
  setModelDropOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentProviderModels: any[]
  dark: boolean
  setDark: React.Dispatch<React.SetStateAction<boolean>>
  userMenuRef: React.RefObject<HTMLDivElement | null>
  userMenuOpen: boolean
  setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  authUser: any
  handleLogout: () => void
}

export interface WelcomeSectionProps {
  selectedBot: Chatbot | null
  setInput: (input: string) => void
}

export interface MessageListProps {
  messages: InteractionMessage[]
  selectedBot: Chatbot | null
  authUser: any
  openLightbox: (url: string) => void
  setInput: (text: string) => void
  setMessages: React.Dispatch<React.SetStateAction<InteractionMessage[]>>
  isSending: boolean
}

export interface LeftSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeTab: 'history' | 'prompts'
  setActiveTab: React.Dispatch<React.SetStateAction<'history' | 'prompts'>>
  historySearch: string
  setHistorySearch: React.Dispatch<React.SetStateAction<string>>
  filteredHistory: any[]
  sessionId: string | null
  handleNewChat: () => void
  handleSwitchSession: (id: string) => void
  handleTogglePin: (id: string, e: React.MouseEvent) => void
  handleDeleteSession: (id: string, e: React.MouseEvent) => void
  setInput: React.Dispatch<React.SetStateAction<string>>
  setPromptLibOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ChatInputSectionProps {
  selectedFiles: File[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
  input: string
  setInput: (input: string) => void
  handleKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  selectedBot: Chatbot | null
  setPromptLibOpen: (open: boolean) => void
  handleSend: () => void
  isSending: boolean
  canManageChat: boolean
}