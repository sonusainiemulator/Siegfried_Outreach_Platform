import { LucideIcon } from "lucide-react"

export interface ApiIntegrationForm {
  huggingface_api_key: string
  winston_api_key: string
  gemini_api_key: string
  openai_api_key: string
  groq_api_key: string
  openrouter_api_key: string
  grok_api_key: string
  stable_diffusion_api_key: string
  aiProvider: string
}

export interface ImageUploadItemProps {
  label: string
  description: string
  currentUrl: string | null | undefined
  onFileSelect: (file: File | null) => void
  onRemove: () => void
  isUploading: boolean
}

export interface InlineImageUploadProps {
  label: string
  currentUrl: string | null | undefined
  onFileSelect: (file: File | null) => void
  onRemove: () => void
}

export interface EmailTestModalProps {
  show: boolean
  onClose: () => void
  onSend: () => void
  testEmail: string
  setTestEmail: (email: string) => void
  isTesting: boolean
}

export interface MaintenanceModeCardProps {
  files: Record<string, File | 'null' | null>
  setFiles: React.Dispatch<React.SetStateAction<Record<string, File | 'null' | null>>>
  currentImageUrl?: string | null
}

export interface SystemPagesCardProps {
  files: Record<string, File | 'null' | null>
  setFiles: React.Dispatch<React.SetStateAction<Record<string, File | 'null' | null>>>
  settings: Record<string, unknown>
}

type EmailProvider = 'nodemailer' | 'sendgrid' | 'aws-ses' | 'zeptomail' | 'emailit'

export interface EmailConfigForm {
  emailProvider: EmailProvider
  fromName: string
  fromEmail: string
  config: {
    smtp_host: string
    smtp_port: string
    smtp_user: string
    smtp_pass: string
    mail_encryption: 'ssl' | 'tls'
    sendgrid_api_key: string
    aws_ses_region?: string
    aws_ses_access_key?: string
    aws_ses_secret_key?: string
    zeptomail_api_key?: string
    emailit_api_key?: string
  }
}


export interface StatusPageProps {
  title: string
  description: string
  icon?: LucideIcon
  image?: string
  showHome?: boolean
  showRetry?: boolean
  onRetry?: () => void
  isRetrying?: boolean
  errorCode?: string
  isMaintenance?: boolean
  statusBadge?: string
}