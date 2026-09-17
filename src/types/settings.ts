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
  openai_image_api_key?: string
  openai_image_quality?: string
  openai_image_style?: string
  heygen_api_key?: string
  heygen_avatar_id?: string
  heygen_voice_id?: string
  imagen_api_key?: string
  remotion_render_url?: string
  default_image_provider?: string
  default_video_provider?: string
  default_voice_provider?: string

  // ElevenLabs Voice & Dubbing
  elevenlabs_api_key?: string
  elevenlabs_voice_id?: string
  elevenlabs_model_id?: string

  // Higgsfield Cinematic Video
  higgsfield_api_key?: string
  higgsfield_model?: string

  // Seedance 2.0 Video AI (Realistic physics, fight choreography, reference handling)
  seedance_api_key?: string
  seedance_model?: string
  seedance_reference_mode?: string

  // Kling Video 3.0 Pro (Multi-shot sequencing up to 6 camera cuts, cinematic physics)
  kling_api_key?: string
  kling_model?: string
  kling_multi_shot?: boolean

  // Google Veo 3.1 (Photorealistic people, fast iteration speeds, native audio)
  veo_api_key?: string
  veo_model?: string
  veo_native_audio?: boolean

  // Gemini Omni Flash (Budget-friendly multimodal, voice quality, low credit cost)
  gemini_omni_api_key?: string
  gemini_omni_model?: string

  // MiniMax Hailuo 2.3 (Product shots, animation, expressive character movements)
  hailuo_api_key?: string
  hailuo_model?: string
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