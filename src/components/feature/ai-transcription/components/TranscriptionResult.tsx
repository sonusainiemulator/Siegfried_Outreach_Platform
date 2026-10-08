'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TranscriptionResultProps } from '@/types'
import { downloadFile } from '@/utils/download'
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileAudio,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TranscriptionResult = ({ transcription, isLoading, canDownload }: TranscriptionResultProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const wordCount = transcription ? transcription.split(/\s+/).filter(Boolean).length : 0
  const charCount = transcription ? transcription.length : 0
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200))

  const handleCopy = () => {
    if (!transcription) return
    navigator.clipboard.writeText(transcription)
    setCopied(true)
    toast.success(t('copied_to_clipboard', 'Copied to clipboard'))
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!transcription) return
    const blob = new Blob([transcription], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, `transcript-${Date.now()}.txt`)
    toast.success(t('download_started', 'Download started!'))
  }

  return (
    <Card className="rounded-2xl glass-dark-card border border-border flex flex-col h-full min-h-[460px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {t('transcription_result', 'Transcription Result')}
            </h2>
          </div>
        </div>

        {transcription && !isLoading && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-9 px-3 rounded-lg text-xs font-medium gap-1.5 border-border/80 hover:bg-card transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{t('copy_transcript', 'Copy')}</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!canDownload}
              className="h-9 px-3 rounded-lg text-xs font-medium gap-1.5 border-border/80 hover:bg-card transition-all"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('download_transcript', 'Export TXT')}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="relative flex-1 p-6 sm:p-8 custom-scrollbar overflow-y-auto">
        {isLoading ? (
          <div className="space-y-5 animate-pulse">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>{t('analyzing_audio_stream', 'Analyzing audio stream with Whisper AI...')}</span>
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-[95%] bg-muted/70 rounded" />
              <Skeleton className="h-4 w-[88%] bg-muted/70 rounded" />
              <Skeleton className="h-4 w-[92%] bg-muted/70 rounded" />
              <Skeleton className="h-4 w-[75%] bg-muted/70 rounded" />
              <Skeleton className="h-4 w-[85%] bg-muted/70 rounded" />
              <Skeleton className="h-4 w-[60%] bg-muted/70 rounded" />
            </div>
            <div className="pt-6 flex flex-col items-center justify-center text-center opacity-60">
              <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="mt-3 text-xs text-muted-foreground">
                Generating high-fidelity speech transcription...
              </p>
            </div>
          </div>
        ) : transcription ? (
          <div className="animate-in fade-in duration-300">
            <p className="text-base leading-relaxed text-foreground select-text font-normal whitespace-pre-wrap">
              {transcription}
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 border border-border/80 flex items-center justify-center text-muted-foreground shadow-sm">
                <FileAudio className="h-8 w-8 text-primary/70" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Zap className="h-3 w-3 fill-current" />
              </div>
            </div>

            <div className="max-w-[360px] space-y-2">
              <h3 className="text-base font-bold text-foreground">
                {t('transcription_placeholder', 'The transcription will appear here...')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload your audio or video file on the left and click Transcribe to generate high-accuracy transcripts with Whisper AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[420px] w-full text-left pt-2">
              <div className="p-3 rounded-xl bg-card/60 border border-border/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Whisper Large-v3
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Multi-language neural speech recognition with punctuation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-card/60 border border-border/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-emerald-500" />
                  Up to 60 Minutes
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Transcribe ads, voiceovers, podcasts, and video clips seamlessly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {transcription && !isLoading && (
        <div className="px-6 py-3.5 border-t border-border bg-card/30 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[11px] font-mono bg-background/50">
              {wordCount} {t('words', 'words')}
            </Badge>
            <Badge variant="outline" className="text-[11px] font-mono bg-background/50">
              {charCount} {t('characters', 'characters')}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Clock className="h-3.5 w-3.5" />
            <span>~{readingTimeMin} {t('reading_time', 'min read')}</span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default TranscriptionResult
