'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { ImageUploadItemProps } from '@/types'
import { getMediaUrl } from '@/utils'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ImageUploadItem = ({
  label,
  description,
  currentUrl,
  onFileSelect,
  onRemove,
}: ImageUploadItemProps) => {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onRemove()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayUrl = preview || (currentUrl ? getMediaUrl(currentUrl) : null)

  return (
    <div className="flex flex-col gap-4 sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card border border-input-border-color hover:border-primary/30 transition-all duration-300 group">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 flex-1">
          <h4 className="font-medium text-base text-title-color dark:text-white">{label}</h4>
          <p className="text-sm text-subtitle-color">{description}</p>
        </div>
        {displayUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive group-hover:scale-110 transition-all"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div
        className={`relative aspect-video rounded-border-radius overflow-hidden border-2 border-dashed transition-all duration-300 flex items-center justify-center cursor-pointer
          ${displayUrl ? 'border-primary/20 bg-primary/5' : 'border-glass-border hover:border-primary/50 bg-accent/5'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        {displayUrl ? (
          <div className="relative w-full h-full group/image">
            <Image
              src={displayUrl}
              alt={label}
              width={100}
              height={100}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover/image:scale-105"
            />
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <div className="bg-white/40 backdrop-blur-md rounded-full p-3 border border-white/20">
                <Upload className="w-6 h-6 text-subtitle-color" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50 group-hover:text-primary transition-colors">
            <div className="p-4 rounded-full bg-accent/10 border border-glass-border/50 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-500">
              <ImageIcon className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium">{t('click_to_upload')}</span>
          </div>
        )}
        <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  )
}

export default ImageUploadItem
