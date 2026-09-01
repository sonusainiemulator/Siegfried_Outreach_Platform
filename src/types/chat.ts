import { RefObject, Dispatch, SetStateAction } from "react";
import { Chatbot, InteractionMessage } from "./chatbot";

export interface SendMessageRequest {
  id: string
  message: string
  sessionId?: string
  history?: Array<{ role: string; content: string }>
  context?: Record<string, unknown>
}

export interface SendMessageResponse {
  answer?: string
  response?: string
  sessionId?: string
  message? : string
  conversationId?: string
  isNewSession?: boolean
  threadId?: string
  context?: Record<string, unknown>
  isHandedOffToHuman?: boolean
  showEscalationButton?: boolean
}

export interface PublicChatbotInfo {
  name: string
  description: string
  welcomeMessage: string
  appearance: {
    primaryColor: string
    secondaryColor: string
    textColor: string
    backgroundColor: string
    inputBackgroundColor: string
    buttonColor: string
    borderRadius: string
  }
}

export interface SuggestionResponse {
  suggestions: string[]
}

export interface ValidateChatbotResponse {
  isValid: boolean
  message: string
}

export interface Conversation {
  id: string
  sessionId: string
  title: string
  lastActivity: string
  messageCount: number
  isPinned?: boolean
  isArchived?: boolean
}

export interface ChatAreaProps {
  messages: InteractionMessage[]
  isSending: boolean
  chatbot: Chatbot
  scrollRef: RefObject<HTMLDivElement | null>
  input: string
  setInput: (value: string) => void
  handleSend: (message?: string) => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  selectedFiles: File[]
  setSelectedFiles: Dispatch<SetStateAction<File[]>>
  showEscalationButton?: boolean
  onEscalate?: () => void
  canManageChat?: boolean
  canManagePrompts?: boolean
  onEdit?: (message: InteractionMessage) => void
  onToggleSidebar?: () => void
}

export interface ChatHeaderProps {
  chatbot: Chatbot
  allChatbots: Chatbot[]
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  messages: InteractionMessage[]
  sessionId: string | null
}

export interface ChatSidebarProps {
  chatbotId: string
  sessionId: string | null
  conversations: Conversation[]
  refetchConversations: () => void
  onNewConversation: () => void
  onSwitchConversation: (sessionId: string) => void
  canManageChat?: boolean
}

export interface ChatShareModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string | null
}

export interface PromptLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPrompt: (prompt: string) => void
}

export interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  handleSend: (message?: string) => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  onOpenPromptLibrary: () => void
  selectedFiles: File[]
  chatbot: Chatbot
  canManageChat?: boolean
  canManagePrompts?: boolean
  isSending?: boolean
}

export interface FilePreviewProps {
  selectedFiles: File[]
  onRemoveFile: (index: number) => void
}

export interface MessageItemProps {
  message: InteractionMessage
  chatbot: Chatbot
  backendApiUrl: string
  onImageClick: (imageUrl: string) => void
  onEdit?: (message: InteractionMessage) => void
}

export interface MessageListProps {
  messages: InteractionMessage[]
  isSending: boolean
  chatbot: Chatbot
  scrollRef: RefObject<HTMLDivElement | null>
  backendApiUrl: string
  onImageClick: (imageUrl: string) => void
  onEdit?: (message: InteractionMessage) => void
}
