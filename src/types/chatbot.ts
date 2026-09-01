import { LucideIcon } from "lucide-react"

export interface ChatbotConfig {
  model: string
  temperature: number
  maxTokens: number
  topP: number
}

export interface ChatbotAppearance {
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  inputBackgroundColor: string
  buttonColor: string
  shadow: string
  borderRadius: string
  fontFamily: string
  avatar?: string
}

export interface QAPair {
  _id?: string
  question: string
  answer: string
  addedAt?: string
}

export interface TextContent {
  _id?: string
  title: string
  content: string
  addedAt?: string
}

export interface PdfFile {
  _id?: string
  url: string
  fileName: string
  uploadedAt?: string
}

export interface TrainingData {
  pdfFiles: PdfFile[]
  textContent: TextContent[]
  qaPairs: QAPair[]
}

export interface HumanAgentSettings {
  enabled: boolean
  availableAgents: Array<{
    userId: string
    name: string
    email: string
    status: 'available' | 'busy' | 'offline'
    lastActive?: string
  }>
  fallbackToAI: boolean
  maxWaitTime: number
}

export interface HybridSettings {
  aiResponseThreshold: number
  escalateKeywords: string[]
  aiHandoffMessage: string
  humanUnavailableMessage: string
}

export interface MessengerChannel {
  enabled: boolean
  appId?: string
  appSecret?: string
  pageId?: string
  pageName?: string
  accessToken?: string
  verifyToken?: string
}

export interface TelegramChannel {
  enabled: boolean
  botToken?: string
  botName?: string
}

export interface WhatsappChannel {
  enabled: boolean
  phoneNumberId?: string
  wabaId?: string
  accessToken?: string
  sid?: string
  token?: string
  phone?: string
  sandboxPhone?: string
  environment?: 'sandbox' | 'production'
}

export interface InstagramChannel {
  enabled: boolean
  pageId?: string
  accessToken?: string
}

export interface ChatbotCreator {
  _id: string
  name: string
  email: string
  role: string
}

export interface Chatbots {
  _id: string
  name: string
  avatar: string
  provider: string
  category?: string
  isActive: boolean
  isFavorite?: boolean
}

export interface Chatbot {
  id: string
  name: string
  description: string
  provider: 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom'
  persona?: string
  config: ChatbotConfig
  appearance: ChatbotAppearance
  trainingData: TrainingData
  interactionType: 'ai_only' | 'human_only' | 'hybrid'
  humanAgentSettings: HumanAgentSettings
  hybridSettings: HybridSettings
  isActive: boolean
  welcomeMessage: string
  errorMessage: string
  createdBy: ChatbotCreator
  avatar?: string
  created_at: string
  updated_at: string
  messenger?: MessengerChannel
  telegram?: TelegramChannel
  whatsapp?: WhatsappChannel
  instagram?: InstagramChannel
  isFavorite?: boolean
  category: string
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

export interface ChatbotResponse {
  agents: Chatbot[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ChatbotQueryParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface CreateChatbotRequest {
  name: string
  description?: string
  apiKey: string
  provider?: 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom'
  persona?: string
  config?: Partial<ChatbotConfig>
  appearance?: Partial<ChatbotAppearance>
  trainingData?: Partial<TrainingData>
  interactionType?: 'ai_only' | 'human_only' | 'hybrid'
  humanAgentSettings?: Partial<HumanAgentSettings>
  hybridSettings?: Partial<HybridSettings>
  welcomeMessage?: string
  errorMessage?: string
  messenger?: Partial<MessengerChannel>
  telegram?: Partial<TelegramChannel>
  whatsapp?: Partial<WhatsappChannel>
  instagram?: Partial<InstagramChannel>
  category?: string
}

export interface UpdateChatbotRequest {
  name?: string
  description?: string
  apiKey?: string
  provider?: 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom'
  persona?: string
  config?: Partial<ChatbotConfig>
  appearance?: Partial<ChatbotAppearance>
  trainingData?: Partial<TrainingData>
  interactionType?: 'ai_only' | 'human_only' | 'hybrid'
  humanAgentSettings?: Partial<HumanAgentSettings>
  hybridSettings?: Partial<HybridSettings>
  isActive?: boolean
  welcomeMessage?: string
  errorMessage?: string
  messenger?: Partial<MessengerChannel>
  telegram?: Partial<TelegramChannel>
  whatsapp?: Partial<WhatsappChannel>
  instagram?: Partial<InstagramChannel>
  category?: string
}

export interface TrainingDataRequest {
  pdfFiles?: PdfFile[]
  textContent?: TextContent[]
  qaPairs?: QAPair[]
}

export interface ChatbotFormData {
  name: string
  description: string
  apiKey: string
  provider: 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom'
  persona: string
  model: string
  temperature: number
  maxTokens: number
  interactionType: 'ai_only' | 'human_only' | 'hybrid'
  welcomeMessage: string
  errorMessage: string

  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  inputBackgroundColor: string
  buttonColor: string
  borderRadius: string
  avatar?: File | null | string
  avatarUrl?: string

  messenger?: MessengerChannel
  telegram?: TelegramChannel
  whatsapp?: WhatsappChannel
  instagram?: InstagramChannel
  category: string
}
export const defaultChatbotConfig: ChatbotConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.0,
  maxTokens: 200,
  topP: 1,
}

export const defaultChatbotAppearance: ChatbotAppearance = {
  primaryColor: 'var(--color-emerald-500)',
  secondaryColor: 'var(--color-emerald-50)',
  textColor: 'var(--color-slate-900)',
  backgroundColor: 'var(--color-white)',
  inputBackgroundColor: 'var(--color-green-50)',
  buttonColor: 'var(--color-emerald-500)',
  shadow: '0 4px 6px -1px color-mix(in srgb, var(--color-emerald-500) 10%, transparent)',
  borderRadius: '12px',
  fontFamily: 'Inter, sans-serif',
}

export const defaultTrainingData: TrainingData = {
  pdfFiles: [],
  textContent: [],
  qaPairs: [],
}

export interface InteractionMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp?: string
}

export interface EmbedTabProps {
  chatbotId: string | null | undefined
}

export interface ConfigureTabProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}

export interface CustomizeTabProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}

export interface CardChatbotProps {
  bot: Chatbot
  isFavorite: boolean
  onToggleFavorite: (e: React.MouseEvent, botId: string) => void
}

export interface ChatbotCardProps {
  chatbot: Chatbot
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
  canManage: boolean
}

export interface ChatbotDashboardProps {
  onEdit: (chatbotId: string) => void
  onCreateNew: () => void
  canManage: boolean
}

export interface ChatbotFormProps {
  chatbotId: string | null
  onBack: () => void
  isEditing: boolean
}

export interface ChatbotPreviewProps {
  formData: ChatbotFormData
}

export interface TrainTabProps {
  qaPairs: QAPair[]
  setQaPairs: (pairs: QAPair[]) => void
  textContent: TextContent[]
  setTextContent: (content: TextContent[]) => void
  activeSource: string | null
  setActiveSource: (source: string | null) => void
}

export interface ChannelTabProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
  chatbotId?: string | null
}

export interface ActiveChannel {
  id: string
  type: string
  channelId?: string
}

export interface ActiveChannelsTableProps {
  activeChannels: ActiveChannel[]
  onCopyWebhook: (channel: string) => void
  onDeleteChannel: (channel: string) => void
}

export interface ChannelGridProps {
  formData: ChatbotFormData
  onChannelClick: (channelId: string) => void
}

export interface ChannelModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  selectedChannel: string | null
  messengerData: Partial<MessengerChannel>
  setMessengerData: (data: Partial<MessengerChannel>) => void
  whatsappData: Partial<WhatsappChannel>
  setWhatsappData: (data: Partial<WhatsappChannel>) => void
  telegramData: Partial<TelegramChannel>
  setTelegramData: (data: Partial<TelegramChannel>) => void
  onAddChannel: () => void
}

export interface MessengerFormProps {
  data: Partial<MessengerChannel>
  onChange: (data: Partial<MessengerChannel>) => void
}

export interface TelegramFormProps {
  data: Partial<TelegramChannel>
  onChange: (data: Partial<TelegramChannel>) => void
}

export interface WhatsappFormProps {
  data: Partial<WhatsappChannel>
  onChange: (data: Partial<WhatsappChannel>) => void
}

export interface FavoriteChatbotsProps {
  chatbots?: Chatbot[]
  isUser?: boolean
}

export interface ChatbotPreviewProps {
  formData: ChatbotFormData
}

export interface UseChatbotFormOptions {
  chatbotId?: string
  isEditing?: boolean
  onBack: () => void
}

export interface ChatbotFormHeaderProps {
  name: string
  isEditMode: boolean
  isSubmitting?: boolean
  isDirty?: boolean
  canManage?: boolean
  onBack?: () => void
  onSave?: () => void
}

export interface Tab {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

export interface TabSectionHeader {
  title: string
  description: string
}

export interface ChatbotTabContentProps {
  tabs: Tab[]
  activeTab: string
  setActiveTab: (tab: string) => void
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
  qaPairs: QAPair[]
  setQaPairs: React.Dispatch<React.SetStateAction<QAPair[]>>
  textContent: TextContent[]
  setTextContent: React.Dispatch<React.SetStateAction<TextContent[]>>
  effectiveChatbotId: string | null | undefined
  isEditMode: boolean
  isSubmitting: boolean
  canManage: boolean
  onSave: (targetTab?: string) => void
  onBack: () => void
}

export interface RadiusSectionProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}

export interface AvatarContentProps {
  avatarUrl: string | null
  name?: string
  size?: 'sm' | 'md'
}

export interface ChatbotPreviewPanelProps {
  formData: ChatbotFormData
}


export interface Tab {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

export interface ChatbotTabNavProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export interface AvatarSectionProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}

export interface ColorPickerFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface ColorSectionProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}

export interface SurfaceSectionProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}
export interface TypographySectionProps {
  formData: ChatbotFormData
  updateFormField: <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => void
}

export interface QATrainingProps {
  qaPairs: QAPair[]
  setQaPairs: (pairs: QAPair[]) => void
}

export interface TextTrainingProps {
  textContent: TextContent[]
  setTextContent: (content: TextContent[]) => void
}