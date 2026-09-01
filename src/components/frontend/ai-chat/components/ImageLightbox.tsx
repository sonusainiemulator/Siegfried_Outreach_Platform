'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChevronDown, Download, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const ImageLightbox = ({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) => {
  const [current, setCurrent] = useState(startIndex)

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrent(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setCurrent(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  const handleDownload = async () => {
    const url = images[current]
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `image-${current + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Download failed:', error)
      window.open(url, '_blank')
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-200 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10" onClick={e => e.stopPropagation()}>
        <span className="text-white/70 text-sm font-bold">{current + 1} / {images.length}</span>
        <div className="flex items-center gap-2">
          <Button onClick={handleDownload} className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all">
            <Download className="w-5 h-5" />
          </Button>
          <Button onClick={onClose} className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </Button>
        </div>

      </div>

      {/* Image */}
      <div className="relative max-w-5xl max-h-[80vh] w-full px-16" onClick={e => e.stopPropagation()}>
        {images[current] ? (
          <Image
            src={images[current]}
            alt={`Image ${current + 1}`}
            width={1200}
            height={900}
            className="w-full h-full object-contain rounded-2xl select-none"
            unoptimized
          />
        ) : null}
      </div>

      {/* Nav Arrows */}
      {images.length > 1 && (
        <>
          <Button
            onClick={e => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </Button>
          <Button
            onClick={e => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
          >
            <ChevronDown className="w-5 h-5 -rotate-90" />
          </Button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2 items-center" onClick={e => e.stopPropagation()}>
          {images.map((img, idx) => (
            <Button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={cn('w-12 h-12 rounded-xl overflow-hidden border-2 transition-all', idx === current ? 'border-primary scale-110' : 'border-white/20 opacity-60 hover:opacity-100')}
            >
              {img && (
                <Image src={img} alt={`thumb-${idx}`} width={48} height={48} className="w-full h-full object-cover" unoptimized />
              )}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
