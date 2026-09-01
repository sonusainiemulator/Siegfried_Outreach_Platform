'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { FileManagementProps } from '@/types'
import { FileAudio, FileVideo, Loader2, Play, Upload, Zap } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FileManagement = ({ file, onFileSelect, onTranscribe, isLoading, canTranscribe }: FileManagementProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

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

  const filePreviewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const isVideo = file?.type.startsWith('video/')

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          'relative h-75 glass-dark-card border-2 border-dashed transition-all duration-300 rounded-border-radius flex flex-col items-center justify-center sm:p-6 p-4 text-center overflow-hidden bg-card/40',
          dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border',
          file ? '' : 'hover:border-primary/30',
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="h-20 w-20 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20 animate-pulse">
              <Upload className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t('drop_file_here')}</h3>
            <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed mb-6">{t('supported_formats')}</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={!canTranscribe}
              className="rounded-[8px]  sm:h-12 h-10 p-button-padding! font-medium btn-color text-white"
            >
              {canTranscribe
                ? t('select_audio_video_file')
                : t('view_only_transcription', { defaultValue: 'No permission to transcribe' })}
            </Button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                {isVideo ? <FileVideo className="h-8 w-8" /> : <FileAudio className="h-8 w-8" />}
              </div>
              <p className="text-sm font-bold text-foreground truncate max-w-[300px] mb-1">{file.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="pt-4 border-t border-border/10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-[8px] sm:h-12 h-10 p-button-padding! bg-primary text-white "
              >
                {t('change_file')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onFileSelect(null)}
                className="rounded-[8px] bg-destructive/10 sm:h-12 h-10 p-button-padding! text-destructive hover:bg-destructive hover:text-white border-none"
              >
                {t('remove')}
              </Button>
            </div>
          </div>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="audio/*,video/*"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />
      </Card>

      {file && (
        <Card className="sm:p-6 p-4 rounded-border-radius glass-dark-card border-border overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-4 w-4 text-primary" />
            <h3 className="text-xl font-medium ">{t('audio_video_preview')}</h3>
          </div>

          <div className="rounded-border-radius overflow-hidden border border-border/50">
            {isVideo ? (
              <video src={filePreviewUrl || ''} controls className="w-full aspect-video" />
            ) : (
              <div className="p-6 flex flex-col items-center justify-center gap-4">
                <audio src={filePreviewUrl || ''} controls className="w-full h-10" />
              </div>
            )}
          </div>

          <Button
            onClick={onTranscribe}
            disabled={isLoading || !canTranscribe}
            className="w-full mt-6 rounded-[8px] sm:h-12 h-10 font-medium gap-2 bg-primary! text-white transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('transcribing')}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-current" />
                {t('transcribe')}
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  )
}

export default FileManagement
