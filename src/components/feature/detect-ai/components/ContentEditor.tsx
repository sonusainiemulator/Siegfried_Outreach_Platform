import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textArea'
import { ContentEditorProps } from '@/types'
import { ArrowRight, Cpu, FileText, Loader2, Zap } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ContentEditor = ({ text, isLoading, onTextChange, onAnalyze, canVerify }: ContentEditorProps) => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-border-radius glass-dark-card glass-card overflow-hidden flex flex-col relative h-auto min-h-100 lg:h-131">
      <div className="px-4 py-3 md:px-5 md:py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <span className="text-xl font-medium text-title-color dark:text-white">{t('content_editor')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-primary bg-light-primary px-2 py-0.5 rounded border border-border">
            {text.length} {t('characters')}
          </span>
        </div>
      </div>

      <div className="relative p-0 flex-1 min-h-[300px] md:min-h-112.5">
        <Textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onTextChange(e.target.value)}
          placeholder={
            canVerify
              ? 'Paste your content here (minimum 100 characters for accurate results)...'
              : t('view_only_text_detection', { defaultValue: 'You do not have permission to verify content.' })
          }
          className="w-full h-full min-h-[300px] md:min-h-112.5 bg-transparent border-none focus-visible:ring-0 text-sm resize-none p-4 sm:p-6 custom-scrollbar font-medium placeholder:text-subtitle-color"
          disabled={!canVerify}
        />

        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-3">
          <Button
            onClick={onAnalyze}
            disabled={isLoading || !canVerify}
            className="rounded-[8px]  sm:h-12 h-10 px-4 md:px-6 font-medium text-sm gap-2 btn-color text-white transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                {t('analyzing')}
              </>
            ) : (
              <>
                <Zap className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                {t('verify_content')}
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </>
            )}
          </Button>
        </div>

        {!text && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10 md:opacity-20 px-6 text-center">
            <Cpu className="h-12 w-12 md:h-16 md:w-16 text-primary mb-2 md:mb-4" />
            <p className="text-xs md:text-sm font-medium ">{t('awaiting_content')}</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ContentEditor
