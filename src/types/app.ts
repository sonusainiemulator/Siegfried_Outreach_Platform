import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export interface ProviderProps {
  children: ReactNode
}

export interface CookieOptions {
  expires?: Date | number
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  httpOnly?: boolean
}

export interface SectionItem {
  label: string
  settingKey: keyof AdminSettings
  icon: LucideIcon
  isLimit?: boolean
  isCredit?: boolean
}

export interface AdminSettings {
  article_generate_credit?: number
  chatbot_builder_limit?: number
  code_generate_credit?: number
  file_chat_credit?: number
  speech_text_credit?: number
  broadcast_limit?: number
  publish_post_per_day_limit?: number
  ai_rewriter_credit?: number
  smart_writer_credit?: number
  presentation_generate_credit?: number
  generate_email_credit?: number
  analyze_content_credit?: number
}

export interface Country {
  name: string
  code: string // ISO alpha-2
  dial_code: string
  countryCode: number
}