import { Condition } from "../api"
import { CampaignInput } from "../campaign"

export interface TelegramCampaignFormProps {
  campaignId?: string
}

export type TelegramFormValues = CampaignInput & {
  ai_prompt?: string
  telegramGroups?: string[]
  telegramSubscribers?: string[]
  mediaFile?: File | null
}

export interface CampaignMediaUploadProps {
  mediaMode: 'file' | 'url'
  setMediaMode?: (mode: 'file' | 'url') => void
  mediaPreview: string | null
  setMediaPreview: (preview: string | null) => void
  mediaFile: File | null | undefined
  setFieldValue: (field: string, value: string | File | null) => void
  mediaValue: string
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface CampaignSchedulerProps {
  scheduledAt: string | null | undefined
  setFieldValue: (field: string, value: string | null) => void
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface TelegramPreviewProps {
  values: TelegramFormValues
  mediaPreview: string | null
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface WhatsAppPreviewProps {
  values: FormValues
  mediaPreview: string | null
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface WhatsAppCampaignFormProps {
  campaignId?: string
}

export type FormValues = CampaignInput & { ai_prompt?: string; mediaFile?: File | null }

export interface SegmentCountProps {
  conditions: Condition[]
}

export interface TagInputProps {
  name: string
  label?: string
  placeholder?: string
  helperText?: string
  formGroupClass?: string
  labelClass?: string
  onManageClick?: () => void
  tags?: any[]
  isLoading?: boolean
}

export interface TagManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
}