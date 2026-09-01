'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArticleHeaderControlsProps } from '@/types'
import { Copy, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ArticleHeaderControls = ({
  viewMode,
  isCompleted,
  onViewModeChange,
  onDownload,
  onCopy,
}: ArticleHeaderControlsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex bg-sidebar-color glass-dark-card p-1 rounded-xl border border-border/40">
        <Button
          variant="ghost"
          onClick={() => onViewModeChange('preview')}
          className={cn(
            'px-5 h-10 rounded-lg transition-all font-medium text-sm',
            viewMode === 'preview'
              ? 'bg-primary text-white hover:bg-primary hover:text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t('reader')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => onViewModeChange('code')}
          className={cn(
            'px-5 h-10 rounded-lg transition-all font-medium text-sm',
            viewMode === 'code'
              ? 'bg-primary text-white hover:bg-primary hover:text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t('source')}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="h-10 w-10 rounded-[8px] bg-primary! text-white border-border/40 bg-unset  p-0 shadow-md transition-all active:scale-95"
          onClick={onDownload}
          disabled={!isCompleted}
        >
          <Download className="w-5 h-5 " />
        </Button>
        <Button
          variant="outline"
          className="h-10 w-10 bg-primary! text-white rounded-[8px] border-border/40 bg-unset  p-0 shadow-md transition-all active:scale-95"
          onClick={onCopy}
          disabled={!isCompleted}
        >
          <Copy className="w-5 h-5 " />
        </Button>
      </div>
    </div>
  )
}

export default ArticleHeaderControls
