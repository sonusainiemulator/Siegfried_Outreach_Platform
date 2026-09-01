'use client'

import { ChatbotPreviewPanelProps } from '@/types'
import { Layout } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ChatbotPreview from './ChatbotPreview'

/**
 * Right-side sticky live-preview panel.
 */
export const ChatbotPreviewPanel = ({ formData }: ChatbotPreviewPanelProps) => {
  const { t } = useTranslation()

  return (
    <div className="lg:col-span-12 xl:col-span-4 lg:sticky top-6">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Layout className="h-5 w-5 text-primary" />
        <span className="text-lg font-medium text-title-color dark:text-white">
          {t('live_preview', { defaultValue: 'Live Preview' })}
        </span>
      </div>
      <div className="rounded-border-radius overflow-hidden border border-border/40 shadow-2xl bg-card glass-card glass-dark-card shadow-primary/5 ring-8 ring-muted/20">
        <ChatbotPreview formData={formData} />
      </div>
    </div>
  )
}
