'use client'

import { Button } from '@/components/ui/button'
import { getTheme } from '@/data/slideMaker'
import { PresentationViewerProps } from '@/types/presentation'
import { ChevronLeft, ChevronRight, Download, LayoutGrid, MonitorPlay, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import SlideRenderer from './SlideRenderer'

const PresentationViewer = ({ isOpen, onClose, presentation }: PresentationViewerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useTranslation()
  const [filmstripOpen, setFilmstripOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const thumbnailRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true)
    if (window.innerWidth > 1024) {
      setFilmstripOpen(true)
    }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setTimeout(() => {
      setCurrentSlide(0)
    }, 100)
  }, [presentation])

  useEffect(() => {
    if (!isOpen || !presentation) return
    const data = presentation.metadata?.presentationData
    const total = (data?.slides?.length || 0) + 1
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrentSlide((p) => Math.min(p + 1, total - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrentSlide((p) => Math.max(p - 1, 0))
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, presentation, onClose])

  // Scroll thumbnail into view
  useEffect(() => {
    const el = thumbnailRef.current?.querySelector(`[data-idx="${currentSlide}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [currentSlide])

  if (!isOpen || !presentation) return null

  const data = presentation.metadata?.presentationData
  const options = presentation.metadata?.options
  const themeName = options?.theme || 'Executive Light'
  const theme = getTheme(themeName)
  const title = data?.title || presentation.title || 'Untitled'

  // Build slide list: synthetic title slide + content slides
  const slides = [
    { type: 'title', title: data?.title ?? title, subtitle: data?.subtitle, image: data?.image },
    ...(data?.slides || []),
  ]
  const total = slides.length

  // Download URL — try downloadUrl from generate response, then fall back to content path
  const fileUrl =
    presentation.downloadUrl ||
    (presentation.content?.startsWith('http') ? presentation.content : `/api${presentation.content}`)

  const viewer = (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: 'var(--dark-deep)' }}>
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0 flex-wrap gap-3"
        style={{ background: 'var(--dark-muted)', borderBottom: '1px solid var(--dark-border-alt)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MonitorPlay className="w-5 h-5 shrink-0" style={{ color: theme.accent }} />
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate leading-tight">{title}</h2>
            <p className="text-[11px] text-zinc-500 font-medium">
              {themeName} · {total} {t('slides')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setFilmstripOpen((v) => !v)}
            title="Grid view"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Link
            href={fileUrl}
            download={`${title}.pptx`}
            className="flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-bold text-white transition-colors"
            style={{ background: theme.accent }}
          >
            <Download className="w-3.5 h-3.5" />
            {t('download')}
          </Link>

          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {filmstripOpen && (
          <div
            ref={thumbnailRef}
            className="w-36 lg:w-44 shrink-0 overflow-y-auto py-4 px-2 space-y-3"
            style={{ background: 'var(--dark-base)', borderRight: '1px solid var(--dark-border-alt)' }}
          >
            {slides.map((slide, idx) => (
              <Button
                key={idx}
                data-idx={idx}
                onClick={() => setCurrentSlide(idx)}
                className="w-full group focus:outline-none block h-auto p-0 bg-transparent hover:bg-transparent"
              >
                <div
                  className="w-full rounded-lg overflow-hidden transition-all"
                  style={{
                    border: currentSlide === idx ? `2px solid ${theme.accent}` : '2px solid transparent',
                    boxShadow: currentSlide === idx ? `0 0 0 1px ${theme.accent}55` : 'none',
                  }}
                >
                  <SlideRenderer slide={slide} theme={theme} index={idx} isThumbnail />
                </div>
                <p
                  className="text-center text-[10px] font-bold mt-1 transition-colors"
                  style={{ color: currentSlide === idx ? theme.accent : 'var(--gray-muted)' }}
                >
                  {idx + 1}
                </p>
              </Button>
            ))}
          </div>
        )}

        <div
          className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 lg:p-10 relative overflow-hidden"
          style={{ background: 'var(--dark-deep)' }}
        >
          <div className="w-full max-w-5xl relative shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <SlideRenderer slide={slides[currentSlide]} theme={theme} index={currentSlide} />
          </div>

          <div
            className="absolute bottom-6 flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: 'var(--dark-base)', border: '1px solid var(--dark-border-alt)' }}
          >
            <Button
              onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))}
              disabled={currentSlide === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-xs font-bold text-zinc-400 px-2 min-w-[60px] text-center">
              {currentSlide + 1} / {total}
            </span>
            <Button
              onClick={() => setCurrentSlide((p) => Math.min(p + 1, total - 1))}
              disabled={currentSlide === total - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="absolute bottom-6 right-8 text-[11px] text-zinc-600 font-medium hidden lg:block">
            {t('use_arrow_keys_to_move')} · {t('esc_to_exit')}
          </p>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(viewer, document.body)
}
export default PresentationViewer
