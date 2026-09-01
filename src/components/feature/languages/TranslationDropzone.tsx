'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { TranslationDropzoneProps } from '@/types'
import { CheckCircle2, FileJson, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const TranslationDropzone = ({ translationFile, setTranslationFile, error }: TranslationDropzoneProps) => {
  const { t } = useTranslation()
  const translationInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setTranslationFile(file)
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between ml-1">
        <Label className="text-sm font-medium text-foreground">
          {t('resource_file')}
        </Label>
        {translationFile && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold animate-in fade-in slide-in-from-right-2">
            <CheckCircle2 className="w-3 h-3" />
            {t('ready_to_sync')}
          </div>
        )}
      </div>

      <div
        className={cn(
          'relative h-28 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group/file',
          translationFile
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : error
              ? 'border-destructive bg-destructive/5'
              : isDragOver
                ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/10'
                : 'border-glass-border bg-muted/10 hover:border-primary/40 hover:bg-primary/5',
        )}
        onClick={() => translationInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-500',
            translationFile
              ? 'bg-emerald-500 text-white shadow-xl rotate-0'
              : isDragOver
                ? 'bg-primary text-white scale-110 rotate-12'
                : 'bg-card text-muted-foreground shadow-sm group-hover/file:rotate-12 group-hover/file:scale-110',
          )}
        >
          <FileJson className="w-5 h-5" />
        </div>

        <div className="text-center px-4">
          {translationFile ? (
            <p className="text-xs font-bold truncate max-w-[200px] text-emerald-700">{translationFile.name}</p>
          ) : (
            <>
              <p className="text-xs font-bold text-foreground/80">
                {isDragOver ? t('release_to_drop_json', { defaultValue: 'Release to drop JSON file' }) : t('drop_or_click_json')}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">{t('localized_strings_file')}</p>
            </>
          )}
        </div>

        {translationFile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setTranslationFile(null)
              if (translationInputRef.current) translationInputRef.current.value = ''
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-destructive font-bold ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
      <Input
        type="file"
        ref={translationInputRef}
        className="hidden"
        accept=".json"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]
          if (file) setTranslationFile(file)
        }}
      />
    </div>
  )
}
