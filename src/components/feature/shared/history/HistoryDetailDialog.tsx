import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { HistoryDetailDialogProps } from '@/types'
import { formatDate } from '@/utils'
import DOMPurify from 'dompurify'
import { Check, Copy, Download, FileText, Hash } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const HistoryDetailDialog: React.FC<HistoryDetailDialogProps> = ({
    item,
    onClose,
    promptLabel,
    isCopied,
    onCopy,
    onDownload,
}) => {
    const { t } = useTranslation()

      const sanitizedContent = DOMPurify.sanitize(item?.content || '', {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'strong', 'ul', 'ol', 'li', 'br'],
  })

    return (
        <Dialog open={!!item} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! max-h-[60vh] overflow-hidden flex flex-col p-4! bg-white dark:bg-modal-bg-color rounded-border-radius">
                <DialogHeader className="pb-4 shrink-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
                                {item?.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-left font-medium text-subtitle-color">
                                {formatDate(item?.created_at)}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2 mr-9">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCopy(item?.content)}
                                className="rounded-[8px] gap-2 font-medium bg-light-gray  text-light-text-color dark:text-white p-button-padding! h-10"
                            >
                                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {t('writer_copy')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDownload(item)}
                                className="rounded-[8px] bg-primary! p-button-padding! text-white gap-2 font-medium h-10"
                            >
                                <Download className="w-4 h-4" />
                                {t('writer_save')}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="space-y-8">
              {item?.prompt && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-subtitle-color flex items-center gap-2">
                    <Hash className="w-3 h-3" /> {promptLabel}
                  </h4>
                  <div className="sm:p-6 p-4 inner-card glass-dark-card rounded-border-radius">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                      "{item.prompt}"
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-subtitle-color flex items-center gap-2">
                  <FileText className="w-3 h-3" /> {t('writer_result')}
                </h4>
                <div className="prose prose-zinc dark:prose-invert max-w-none sm:p-6 p-4 glass-card glass-dark-card rounded-border-radius shadow-inner min-h-75">
                  <div
                    className="text-title-color dark:text-white leading-relaxed font-medium whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                     __html: sanitizedContent
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
}

export default HistoryDetailDialog
