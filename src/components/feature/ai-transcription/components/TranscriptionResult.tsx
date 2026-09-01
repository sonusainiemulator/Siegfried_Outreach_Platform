'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TranscriptionResultProps } from '@/types'
import { downloadFile } from '@/utils/download'
import { CheckCircle2, Copy, Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TranscriptionResult = ({ transcription, isLoading, canDownload }: TranscriptionResultProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!transcription) return
    navigator.clipboard.writeText(transcription)
    setCopied(true)
    toast.success(t('copied_to_clipboard'))
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!transcription) return
    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, `transcription-${new Date().getTime()}.txt`)
    toast.success(t('download_started'))
  }

  return (
    <Card className="rounded-border-radius glass-dark-card border-border  flex flex-col h-full min-h-125 xl:min-h-full">
      <div className="px-5 py-4 border-b border-border rounded-border-radius rounded-b-none flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-xl font-medium text-title-color dark:text-white">
            {t('transcription_result')}
          </span>
        </div>

        {transcription && !isLoading && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={!transcription || isLoading}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={!transcription || isLoading || !canDownload}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative flex-1 p-6 sm:p-8 custom-scrollbar overflow-y-auto max-h-[600px] xl:max-h-none">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[90%] bg-muted" />
            <Skeleton className="h-4 w-[85%] bg-muted" />
            <Skeleton className="h-4 w-[95%] bg-muted" />
            <Skeleton className="h-4 w-[80%] bg-muted" />
            <Skeleton className="h-4 w-[30%] bg-muted" />
            <div className="pt-8 flex flex-col items-center justify-center opacity-40">
              <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin" />
              <p className="mt-4 text-sm font-medium text-primary animate-pulse">
                {t('analyzing_audio_stream')}
              </p>
            </div>
          </div>
        ) : transcription ? (
          <div className="animate-in fade-in duration-500">
            <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
              {transcription}
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 sm:py-20 py-10">
            <FileText className="h-16 w-16 mb-4" />
            <p className="text-xs font-bold">{t('transcription_placeholder')}</p>
          </div>
        )}
      </div>

      {transcription && (
        <div className="px-6 py-4 border-t border-border ">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
            <p>
              {transcription.split(/\s+/).filter(Boolean).length} {t('words')}
            </p>
            <p>
              {transcription.length} {t('characters')}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

export default TranscriptionResult
