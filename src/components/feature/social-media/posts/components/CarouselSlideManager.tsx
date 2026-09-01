'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Video,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUploadPreviewUrl } from '@/utils'
import { useTranslation } from 'react-i18next'

export interface CarouselSlideItem {
  id: string
  url: string
  isExisting: boolean
  originalIndex: number
  file?: File
  type: 'image' | 'video'
}

interface CarouselSlideManagerProps {
  slides: CarouselSlideItem[]
  onMoveSlide: (fromIndex: number, toIndex: number) => void
  onRemoveSlide: (index: number) => void
  onAddFiles: (files: File[]) => void
  onClearAll?: () => void
  onOpenAIGenerator?: () => void
  onOpenVisionAnalyzer?: (slideIndex?: number) => void
  isCarouselMode?: boolean
}

export const CarouselSlideManager: React.FC<CarouselSlideManagerProps> = ({
  slides,
  onMoveSlide,
  onRemoveSlide,
  onAddFiles,
  onClearAll,
  onOpenAIGenerator,
  onOpenVisionAnalyzer,
  isCarouselMode = true,
}) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onAddFiles(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (files.length > 0) {
      onAddFiles(files)
    }
  }

  const count = slides.length
  const isOptimal = count >= 2 && count <= 10
  const isMaxReached = count >= 10

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-title-color dark:text-white">
                {t('carousel_deck_architect', { defaultValue: 'Carousel Slide Studio' })}
              </h4>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                  isOptimal
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : count === 1
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-primary/10 text-primary border-primary/20'
                )}
              >
                {count} / 10 {t('slides', { defaultValue: 'Slides' })}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('carousel_slide_instruction', {
                defaultValue: 'Instagram & Facebook carousels support 2–10 ordered images or videos.',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIGenerator && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenAIGenerator}
              className="h-8 px-2.5 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 flex items-center gap-1.5 rounded-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>{t('ai_carousel_agent', { defaultValue: 'AI Carousel Agent' })}</span>
            </Button>
          )}

          {count > 0 && onClearAll && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              {t('clear_all', { defaultValue: 'Clear All' })}
            </Button>
          )}
        </div>
      </div>

      {/* Aspect Ratio Tips Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-background/40 dark:bg-card/40 border border-border/30">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            <strong>{t('square_format', { defaultValue: '1:1 Square' })}:</strong> 1080 × 1080 px (Universal Meta Feed)
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>
            <strong>{t('portrait_format', { defaultValue: '4:5 Portrait' })}:</strong> 1080 × 1350 px (Max Feed Real Estate)
          </span>
        </div>
      </div>

      {/* Slide Cards Grid */}
      {count === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDrop={handleDrop}
          className="p-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-title-color dark:text-white">
              {t('upload_carousel_assets', { defaultValue: 'Upload Carousel Slides (Images or Videos)' })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('drag_drop_multiple', {
                defaultValue: 'Select 2 to 10 files or drag and drop here to build your carousel deck',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-[10px] font-medium">
              PNG / JPG / WEBP
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-medium">
              MP4 / MOV (Reels/Videos)
            </Badge>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {slides.map((slide, idx) => {
              const isCover = idx === 0
              const isLast = idx === count - 1
              const displayUrl = slide.isExisting ? getUploadPreviewUrl(slide.url) : slide.url

              return (
                <div
                  key={slide.id}
                  className={cn(
                    'relative rounded-xl overflow-hidden border transition-all flex flex-col group bg-card/60 dark:bg-card/40 backdrop-blur-sm',
                    isCover
                      ? 'border-primary ring-2 ring-primary/30 shadow-md'
                      : 'border-border/40 hover:border-primary/40'
                  )}
                >
                  {/* Slide Number Badge */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                    <Badge
                      className={cn(
                        'h-5 px-1.5 text-[9px] font-black uppercase shadow-md',
                        isCover ? 'bg-primary text-white' : 'bg-black/70 text-white backdrop-blur-xs'
                      )}
                    >
                      {isCover ? `#1 ${t('cover', { defaultValue: 'Cover' })}` : `#${idx + 1}`}
                    </Badge>
                  </div>

                  {/* Media Type Icon */}
                  {slide.type === 'video' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="h-5 px-1.5 text-[9px] bg-red-600 text-white flex items-center gap-1">
                        <Video className="w-2.5 h-2.5" />
                        <span>VIDEO</span>
                      </Badge>
                    </div>
                  )}

                  {/* Media Preview Box */}
                  <div className="relative aspect-square w-full bg-black/10 dark:bg-black/40 overflow-hidden flex items-center justify-center">
                    {slide.type === 'video' ? (
                      <video
                        src={displayUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                      />
                    ) : (
                      <Image
                        src={displayUrl}
                        alt={`Slide ${idx + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized
                      />
                    )}

                    {/* Quick Remove on hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => onRemoveSlide(idx)}
                        className="h-8 w-8 rounded-full shadow-lg"
                        title={t('remove_slide', { defaultValue: 'Remove Slide' })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Slide Reorder Bar */}
                  <div className="p-1.5 bg-background/60 dark:bg-card/90 border-t border-border/20 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={idx === 0}
                      onClick={() => onMoveSlide(idx, idx - 1)}
                      className="h-6 w-6 rounded-md hover:bg-primary/20 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
                      title={t('move_left', { defaultValue: 'Move Left' })}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>

                    <span className="text-[10px] font-bold text-muted-foreground">
                      {idx + 1} / {count}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isLast}
                      onClick={() => onMoveSlide(idx, idx + 1)}
                      className="h-6 w-6 rounded-md hover:bg-primary/20 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
                      title={t('move_right', { defaultValue: 'Move Right' })}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {/* Add More Slide Tile */}
            {!isMaxReached && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDrop={handleDrop}
                className="aspect-square rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group text-center p-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-primary/90">
                  {t('add_slide', { defaultValue: 'Add Slide' })}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {10 - count} {t('slots_left', { defaultValue: 'slots left' })}
                </span>
              </div>
            )}
          </div>

          {/* Validation Guidance */}
          <div className="flex items-center justify-between text-xs pt-1">
            {count < 2 ? (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {t('carousel_min_warning', {
                    defaultValue: 'Add at least 1 more slide to publish as a Carousel.',
                  })}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {t('carousel_ready_note', {
                    defaultValue: 'Carousel deck is ready for Instagram & Facebook publishing!',
                  })}
                </span>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-xs font-medium border-border/40"
            >
              <Upload className="w-3 h-3 mr-1" />
              {t('upload_more', { defaultValue: 'Upload More' })}
            </Button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default CarouselSlideManager
