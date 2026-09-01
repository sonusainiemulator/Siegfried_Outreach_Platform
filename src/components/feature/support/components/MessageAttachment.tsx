'use client'

import { Button } from '@/components/ui/button'
import { MessageAttachmentProps } from '@/types/components/support'
import { getMediaUrl } from '@/utils'
import { downloadFile } from '@/utils/download'
import { Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const MessageAttachment = ({ attachment, onImageClick }: MessageAttachmentProps) => {
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)
  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url)

  const handleDownload = async (url: string, filename: string) => {
    downloadFile(url, filename)
  }

  const fullUrl = getMediaUrl(attachment.url) || ''

  const isImage =
    attachment.fileType?.includes('image') ||
    isImageUrl(fullUrl) ||
    attachment.name?.toLowerCase().includes('photo') ||
    attachment.name?.toLowerCase().includes('image')
  const isVideo = attachment.fileType?.includes('video') || isVideoUrl(fullUrl)

  if (isImage) {
    return (
      <div
        className="block mt-1 cursor-pointer overflow-hidden rounded-border-radius border border-white/10 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] relative group/attachment-img"
        onClick={() => onImageClick?.(fullUrl)}
      >
        <Image
          width={200}
          height={150}
          unoptimized
          src={fullUrl}
          alt={attachment.name}
          className="max-w-full h-auto object-cover"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover/attachment-img:opacity-100 transition-opacity z-10">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-lg bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(fullUrl, attachment.name)
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (isVideo) {
    return (
      <div className="mt-1">
        <video src={fullUrl} controls className="max-w-full h-auto rounded-xl border border-white/10 shadow-md" />
      </div>
    )
  }

  return (
    <Link
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-[11px] font-semibold"
    >
      <Image
        width={200}
        height={150}
        unoptimized
        src={fullUrl}
        alt={attachment.name}
        className="max-w-full h-auto object-cover"
      />
    </Link>
  )
}

export default MessageAttachment
