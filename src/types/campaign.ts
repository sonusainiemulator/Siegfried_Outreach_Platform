export interface Campaign {
  id: string
  name: string
  prompt?: string
  subject?: string
  htmlTemplate?: string
  content?: string
  media?: string
  audience?: {
    lists?: string[] | { _id: string; name: string }[]
    segments?: string[] | { _id: string; name: string }[]
    contacts?: string[] | { _id: string; name: string }[]
    logic?: 'and' | 'or'
  }
  channel: 'email' | 'whatsapp' | 'telegram'
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed' | 'published'
  scheduledAt?: string
  sentCount: number
  createdBy: string
  created_at: string
  updated_at: string
  telegramTargets?: {
    groups?: string[] | { _id: string; title: string }[]
    subscribers?: string[] | { _id: string; name: string }[]
  }
  aiReply?: boolean
}

export interface CampaignInput {
  name: string
  prompt?: string
  subject?: string
  htmlTemplate?: string
  content?: string
  media?: string
  lists?: string[]
  segments?: string[]
  contacts?: string[]
  telegramTargets?: string[]
  logic?: 'and' | 'or'
  scheduledAt?: string | null
  channel: 'email' | 'whatsapp' | 'telegram'
  aiReply?: boolean
}

export interface CampaignResponse {
  broadcasts: Campaign[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface CampaignQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  channel?: 'email' | 'whatsapp' | 'telegram'
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface SelectionItem {
  id: string | number
  name: string
  description?: string
}

export interface SelectionListProps {
  title: string
  items: SelectionItem[]
  selectedIds: (string | number)[]
  onSelectionChange: (ids: (string | number)[]) => void
  emptyMessage: string
  selectionLabel: string
  showSearch?: boolean
  searchPlaceholder?: string
  actionLabel?: string
  onAction?: () => void
}

export interface WizardFooterProps {
  activeStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  onSaveDraft?: () => void
  isNextDisabled: boolean
  isSubmitting: boolean
}

export interface WizardStepperProps {
  steps: string[]
  activeStep: number
}

export interface EmailEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface CampaignWizardProps {
  campaignId?: string
}

export interface CampaignHubChartsProps {
  isDark: boolean
  charts: any
  campaignSeries: any[]
  contactSeries: any[]
  hourlySeries: any[]
}

export interface CampaignHubHeaderProps {
  viewOpen: boolean
  setViewOpen: (open: boolean) => void
  createOpen: boolean
  setCreateOpen: (open: boolean) => void
}

export interface CampaignHubOverviewProps {
  cardsData: any
}

export interface CampaignHubRecentCampaignsProps {
  recentBroadcasts: any[]
}

export interface ViewBroadcastModalProps {
  isOpen: boolean
  onClose: () => void
  broadcast: Campaign | null
}