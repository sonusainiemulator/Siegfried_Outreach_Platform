'use client'

import { Button } from '@/components/ui/button'
import { FilePreviewStripProps } from '@/types'
import { formatFileSize, getFileIcon, isImageFile } from '@/utils/chatUtils'
import { Paperclip, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FilePreviewStrip = ({ files, onRemove }: FilePreviewStripProps) => {
  const [previews, setPreviews] = useState<{ [key: number]: string }>({})
  const { t } = useTranslation()

  useEffect(() => {
    const urls: { [key: number]: string } = {}
    files.forEach((f, i) => {
      if (isImageFile(f)) urls[i] = URL.createObjectURL(f)
    })
    setTimeout(() => {
      setPreviews(urls)
    }, 100)
    return () => Object.values(urls).forEach(URL.revokeObjectURL)
  }, [files])

  if (files.length === 0) return null

  return (
    <div className="px-4 pt-3 pb-1 border-t border-glass-border bg-light-gray glass-card glass-dark-card dark:bg-modal-bg-color!">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
        <Paperclip className="w-3.5 h-3.5" />
        {files.length} file{files.length > 1 ? 's' : ''} {t('selected')}
      </div>
      <div className="flex gap-2 flex-wrap max-h-[110px] overflow-auto custom-scrollbar">
        {files.map((file, i) => (
          <div
            key={i}
            className="relative group flex items-center gap-2 glass-dark-card glass-card rounded-[8px] px-2 py-1.5 pr-6 max-w-40"
          >
            {isImageFile(file) && previews[i] ? (
              <Image src={previews[i]} alt={file.name} width={100} height={100} unoptimized className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {getFileIcon(file)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-title-color dark:text-white truncate max-w-22.5">{file.name}</p>
              <p className="text-xs text-subtitle-color">{formatFileSize(file.size)}</p>
            </div>
            <Button
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-4 p-0! h-4 rounded-full bg-destructive/80! text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
            >
              <X className="w-2.5 h-2.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilePreviewStrip
