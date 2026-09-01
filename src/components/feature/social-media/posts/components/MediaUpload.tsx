'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { MediaUploadProps } from '@/types/components/socialMedia'
import { getUploadPreviewUrl } from '@/utils'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const MediaUpload = ({
  previews,
  existingImages,
  onRemovePreview,
  onRemoveExisting,
  onFileChange,
  onDropFiles,
  fileInputRef,
}: MediaUploadProps) => {
  const { t } = useTranslation()

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
      onDropFiles(files)
    }
  }

  return (
    <>
      <div className="space-y-4 flex flex-col">
        <Label className="text-sm font-medium text-title-color dark:text-white">
          {t('social_media_architecture')}
        </Label>
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDrop={handleDrop}
            className="p-4 rounded-[8px] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <span className="text-base font-medium text-primary/80">{t('social_upload_assets')}</span>
            <span className="text-xs font-bold text-subtitle-color">{t('social_media_support')}</span>
            <span className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">
              {t('social_drag_drop', { defaultValue: 'or drag & drop here' })}
            </span>
          </div>
        </div>
      </div>

      {(previews.length > 0 || existingImages.length > 0) && (
        <div className="flex flex-wrap gap-2 md:gap-4 p-2 md:p-4 rounded-2xl bg-background/20 border border-border/10 max-h-[250px] overflow-auto custom-scrollbar">
          {existingImages.map((p, i) => (
            <div
              key={`existing-${i}`}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-[8px] overflow-hidden ring-1 ring-border group shadow-lg"
            >
              <Image src={getUploadPreviewUrl(p)} alt="Stored media" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-destructive/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button
                  type="button"
                  onClick={() => onRemoveExisting(i)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-transparent"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Badge className="absolute top-1 left-1 h-4 text-[7px] font-black uppercase bg-black/60 text-white border-none">
                {t('social_stored')}
              </Badge>
            </div>
          ))}
          {previews.map((p, i) => (
            <div
              key={`new-${i}`}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-[8px] overflow-hidden ring-1 ring-border group shadow-lg"
            >
              <Image src={p} alt="New media" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-destructive/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button
                  type="button"
                  onClick={() => onRemovePreview(i)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-transparent"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Badge className="absolute top-1 left-1 h-4 text-[7px] font-black uppercase bg-primary text-white border-none">
                {t('social_new')}
              </Badge>
            </div>
          ))}
        </div>
      )}

      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,video/*"
        onChange={onFileChange}
      />
    </>
  )
}

export default MediaUpload
