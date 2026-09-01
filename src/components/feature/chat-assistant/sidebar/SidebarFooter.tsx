'use client'

import { Button } from '@/components/ui/button'
import { SidebarFooterProps } from '@/types'
import { exportToPDF, exportToText, exportToWord } from '@/utils/exportChat'
import { Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SidebarFooter = ({ messages, chatbotName, onShare }: SidebarFooterProps) => {
  const { t } = useTranslation()

  if (messages.length === 0) return null

  return (
    <div className="mt-auto pt-2 border-t border-glass-border/50 shrink-0 space-y-3">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground/40 px-1">{t('export', { defaultValue: 'Export' })}</p>
        <div className="flex items-center gap-1.5">
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-[11px] font-semibold glass-dark-card rounded-lg gap-1.5  hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
              onClick={onShare}
            >
              <Share2 className="w-3 h-3" />
              {t('share')}
            </Button>
          )}
          <div className="flex items-center gap-1 bg-accent/10 border border-glass-border rounded-[8px] p-0.5">
            <Button
              variant="ghost"
              className="h-7 px-2 rounded text-[10px] font-semibold  hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
              onClick={() => exportToPDF(messages, chatbotName)}
              title="Export PDF"
            >
              {t('export_pdf')}
            </Button>
            <div className="w-px h-3 bg-glass-border" />
            <Button
              variant="ghost"
              className="h-7 px-2 rounded text-[10px] font-semibold hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
              onClick={() => exportToWord(messages, chatbotName)}
              title="Export Word"
            >
              {t('export_doc')}
            </Button>
            <div className="w-px h-3 bg-glass-border" />
            <Button
              variant="ghost"
              className="h-7 px-2 rounded text-[10px] font-semibold hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
              onClick={() => exportToText(messages, chatbotName)}
              title="Export Text"
            >
              {t('export_text')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarFooter
