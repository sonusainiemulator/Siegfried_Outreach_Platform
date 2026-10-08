'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { FileManagementProps } from '@/types'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileAudio,
  FileVideo,
  HardDrive,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const MAX_DURATION_SECONDS = 3600 // 60 minutes
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

const formatDuration = (seconds: number) => {
  if (!isFinite(seconds) || seconds <= 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  if (mins >= 60) {
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const FileManagement = ({ file, onFileSelect, onTranscribe, isLoading, canTranscribe }: FileManagementProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [durationLoading, setDurationLoading] = useState(false)

  const isVideo = file?.type.startsWith('video/')
  const isDurationExceeded = duration !== null && duration > MAX_DURATION_SECONDS
  const isSizeExceeded = !!file && file.size > MAX_FILE_SIZE_BYTES
  const isInvalid = isDurationExceeded || isSizeExceeded
  const durationPercent = duration ? Math.min(100, (duration / MAX_DURATION_SECONDS) * 100) : 0

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      setDuration(null)
      setDurationLoading(false)
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setDuration(null)
    setDurationLoading(true)

    // Pre-calculate duration via temporary media element
    const tempMedia = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio')
    tempMedia.preload = 'metadata'
    tempMedia.src = url
    tempMedia.onloadedmetadata = () => {
      if (isFinite(tempMedia.duration)) {
        setDuration(tempMedia.duration)
      }
      setDurationLoading(false)
    }
    tempMedia.onerror = () => {
      setDurationLoading(false)
    }

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleMediaLoaded = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    const d = e.currentTarget.duration
    if (isFinite(d)) {
      setDuration(d)
      setDurationLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <Card
          className={cn(
            'relative min-h-[380px] glass-dark-card border-2 border-dashed transition-all duration-300 rounded-2xl flex flex-col items-center justify-center sm:p-8 p-6 text-center overflow-hidden bg-card/40',
            dragActive
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.01]'
              : 'border-border/70 hover:border-primary/50 hover:bg-card/50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="relative mb-5">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner transition-transform">
              <Upload className="h-9 w-9 animate-bounce duration-1000" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
            {t('drop_file_here', 'Drop your audio or video file here')}
          </h3>
          <p className="text-xs text-muted-foreground max-w-[360px] leading-relaxed mb-6">
            {t('supported_formats', 'Supported formats: MP3, WAV, M4A, MP4, WebM (Max 50MB, up to 60 mins)')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[400px] mb-6">
            <Badge variant="outline" className="text-[11px] font-normal gap-1 bg-background/50 border-border/80">
              <FileAudio className="h-3 w-3 text-primary" /> MP3, WAV, M4A, OGG
            </Badge>
            <Badge variant="outline" className="text-[11px] font-normal gap-1 bg-background/50 border-border/80">
              <FileVideo className="h-3 w-3 text-primary" /> MP4, WebM, MOV
            </Badge>
            <Badge variant="outline" className="text-[11px] font-normal gap-1 bg-background/50 border-border/80 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-3 w-3" /> {t('max_duration', 'Max 60 mins')}
            </Badge>
            <Badge variant="outline" className="text-[11px] font-normal gap-1 bg-background/50 border-border/80">
              <HardDrive className="h-3 w-3" /> {t('max_size', 'Max 50 MB')}
            </Badge>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={!canTranscribe}
            className="rounded-xl h-11 px-6 font-medium btn-color text-white shadow-md hover:shadow-primary/20 transition-all active:scale-95"
          >
            {canTranscribe
              ? t('select_audio_video_file', 'Select Audio/Video File')
              : t('view_only_transcription', { defaultValue: 'No permission to transcribe' })}
          </Button>
        </Card>
      ) : (
        <Card className="rounded-2xl glass-dark-card border border-border p-6 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* File Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-sm">
                {isVideo ? <FileVideo className="h-6 w-6" /> : <FileAudio className="h-6 w-6" />}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground truncate max-w-[280px] sm:max-w-[340px]" title={file.name}>
                  {file.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase bg-background/60">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </Badge>
                  {durationLoading ? (
                    <Badge variant="outline" className="text-[10px] text-primary gap-1">
                      <Loader2 className="h-2.5 w-2.5 animate-spin" /> Reading duration...
                    </Badge>
                  ) : duration !== null ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-mono gap-1',
                        isDurationExceeded
                          ? 'border-destructive text-destructive bg-destructive/10'
                          : 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      )}
                    >
                      <Clock className="h-2.5 w-2.5" />
                      {formatDuration(duration)}
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground">
                    {isVideo ? 'Video' : 'Audio'}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFileSelect(null)}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              title={t('remove', 'Remove')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Validation Warnings */}
          {isDurationExceeded && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3 text-destructive animate-in fade-in duration-200">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-sm">
                  {t('duration_limit_exceeded', 'Audio duration exceeds the 60-minute limit.')}
                </p>
                <p className="text-destructive/90 leading-relaxed">
                  Detected file duration is <span className="font-bold">{formatDuration(duration || 0)}</span> (limit is 60:00). Please trim the media or upload a shorter clip.
                </p>
              </div>
            </div>
          )}

          {isSizeExceeded && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3 text-destructive animate-in fade-in duration-200">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-sm">
                  {t('file_size_exceeded', 'File size exceeds the 50MB limit.')}
                </p>
                <p className="text-destructive/90 leading-relaxed">
                  File is {((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB. Maximum allowed file size is 50 MB.
                </p>
              </div>
            </div>
          )}

          {/* Media Player Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-foreground">
              <span className="flex items-center gap-1.5 text-primary">
                <Play className="h-3.5 w-3.5 fill-primary" />
                {t('audio_video_preview', 'Audio/Video Preview')}
              </span>
              {duration !== null && !isInvalid && (
                <span className="text-[11px] text-muted-foreground font-mono">
                  {formatDuration(duration)} / 60:00
                </span>
              )}
            </div>

            <div className="rounded-xl overflow-hidden border border-border/60 bg-background/50 p-3 shadow-inner">
              {isVideo ? (
                <video
                  src={previewUrl || ''}
                  controls
                  onLoadedMetadata={handleMediaLoaded}
                  className="w-full aspect-video rounded-lg object-contain bg-black"
                />
              ) : (
                <div className="py-2 px-1">
                  <audio
                    src={previewUrl || ''}
                    controls
                    onLoadedMetadata={handleMediaLoaded}
                    className="w-full h-10 accent-primary"
                  />
                </div>
              )}
            </div>

            {/* Duration Capacity Meter */}
            {duration !== null && !isInvalid && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t('within_duration_limit', 'Within 60-min limit')}
                  </span>
                  <span>{durationPercent.toFixed(0)}% capacity</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.max(5, durationPercent)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto rounded-xl h-11 px-4 gap-2 border-border/80 hover:bg-card transition-all"
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              {t('change_file', 'Change File')}
            </Button>

            <Button
              onClick={onTranscribe}
              disabled={isLoading || !canTranscribe || isInvalid}
              className={cn(
                'flex-1 w-full rounded-xl h-11 font-medium gap-2 text-white shadow-lg transition-all',
                isInvalid
                  ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                  : 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 active:scale-[0.99]'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('transcribing', 'Transcribing Audio...')}</span>
                </>
              ) : isDurationExceeded ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Exceeds 60-Minute Limit</span>
                </>
              ) : isSizeExceeded ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Exceeds 50MB Limit</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  <span>{t('transcribe_now', 'Transcribe Audio & Video')}</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="audio/*,video/*"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </div>
  )
}

export default FileManagement
