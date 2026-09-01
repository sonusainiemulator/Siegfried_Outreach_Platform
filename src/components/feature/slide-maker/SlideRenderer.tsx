'use client'

import { count } from '@/data/dashboard'
import { Slide, SlideProps, ThemeColors } from '@/types/presentation'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'

const parseBold = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `/api${url}`
}

// Full slide dimensions (16:9) — used for the scale trick
const SLIDE_W = 1280
const SLIDE_H = 720

// ---------------------------------------------------------------------------
// SlideContent — renders the actual slide at full resolution.
// Always called inside a 1280x720 container (either real or scaled).
// ---------------------------------------------------------------------------
const SlideContent = ({ slide, theme, index }: { slide: Slide; theme: ThemeColors; index: number }) => {
  const { t } = useTranslation()

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ background: theme.bg, width: SLIDE_W, height: SLIDE_H }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[6px]" style={{ background: theme.accent }} />
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{ background: theme.accent }} />

      <div className="flex-1 flex flex-col px-[6%] pt-[5%] pb-[8%] overflow-hidden">
        {/* ── Title slide ── */}
        {slide.type === 'title' && (
          <div
            className={`flex-1 flex ${slide.image ? 'flex-row' : 'flex-col'} items-center justify-center text-center gap-[4%]`}
          >
            <div className={`flex flex-col gap-[3%] ${slide.image ? 'w-1/2 text-left' : 'w-full text-center'}`}>
              <h1 className="font-black leading-tight text-5xl lg:text-6xl" style={{ color: theme.titleC }}>
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="font-medium leading-snug text-xl lg:text-2xl" style={{ color: theme.subC }}>
                  {slide.subtitle}
                </p>
              )}
            </div>
            {slide.image && (
              <div className="w-1/2 h-full relative rounded-2xl overflow-hidden">
                <Image src={getImageUrl(slide.image)} alt="slide-image" width={100} height={100} unoptimized className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}
          </div>
        )}

        {/* ── Bullet slide ── */}
        {(slide.type === 'bullet' || (!slide.type && slide.content)) && slide.type !== 'title' && (
          <div className="flex flex-col h-full overflow-hidden">
            <h2
              className="font-black mb-[3%] leading-tight shrink-0 text-3xl lg:text-4xl"
              style={{ color: theme.headC }}
            >
              {slide.title}
            </h2>
            <div className="h-[2px] mb-[3%] shrink-0 rounded-full" style={{ background: theme.accent }} />
            <div className={`flex-1 flex gap-[4%] overflow-hidden ${slide.image ? 'flex-row' : 'flex-col'}`}>
              {slide.image && (
                <div className="w-[44%] h-full relative rounded-2xl overflow-hidden shrink-0">
                  <Image src={getImageUrl(slide.image)} alt="slide-image" width={100} height={100} unoptimized className="w-full h-full object-cover" />
                </div>
              )}
              <ul className="flex-1 overflow-hidden space-y-[2%] list-none">
                {(slide.content as string[])?.map((item: string, i: number) => (
                  <li key={i} className="flex gap-[2%] items-start leading-snug">
                    <span
                      className="shrink-0 rounded-full w-2.5 h-2.5"
                      style={{ background: theme.accent, marginTop: '7px' }}
                    />
                    <span
                      className="text-base lg:text-lg font-medium"
                      style={{ color: theme.bodyC }}
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(parseBold(item) || "", {
                          ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
                        })
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Two-column slide ── */}
        {slide.type === 'two_column' && (
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="font-black mb-[3%] shrink-0 text-3xl lg:text-4xl" style={{ color: theme.headC }}>
              {slide.title}
            </h2>
            <div className="h-[2px] mb-[3%] shrink-0 rounded-full" style={{ background: theme.accent }} />
            <div className="flex-1 flex gap-[4%] overflow-hidden">
              {slide.columns?.map((col: any, ci: number) => (
                <div key={ci} className="flex-1 flex flex-col overflow-hidden">
                  {col.header && (
                    <h4 className="font-bold mb-[4%] shrink-0 text-xl" style={{ color: theme.accent }}>
                      {col.header}
                    </h4>
                  )}
                  <ul className="space-y-[3%] flex-1 overflow-hidden">
                    {col.items?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-[2%] items-start">
                        <span
                          className="shrink-0 rounded-full w-2 h-2"
                          style={{ background: theme.accent, marginTop: '6px' }}
                        />
                        <span
                          className="text-base font-medium"
                          style={{ color: theme.bodyC }}
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseBold(item) || "", {
                            ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
                          })
                        }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="w-[1px] shrink-0" style={{ background: `${theme.accent}55` }} />
            </div>
          </div>
        )}

        {/* ── Stats slide ── */}
        {slide.type === 'stats' && (
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="font-black mb-[3%] shrink-0 text-3xl lg:text-4xl" style={{ color: theme.headC }}>
              {slide.title}
            </h2>
            <div className="h-[2px] mb-[4%] shrink-0 rounded-full" style={{ background: theme.accent }} />
            <div
              className="flex-1 grid gap-[4%]"
              style={{ gridTemplateColumns: `repeat(${Math.min(slide.stats?.length || 1, 4)}, 1fr)` }}
            >
              {slide.stats?.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-2xl text-center p-[5%]"
                  style={{ background: `${theme.accent}18`, border: `1px solid ${theme.accent}44` }}
                >
                  <div className="font-black leading-none text-4xl lg:text-5xl" style={{ color: theme.accent }}>
                    {stat.value}
                  </div>
                  <div className="font-semibold mt-[6%] text-sm lg:text-base" style={{ color: theme.bodyC }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Chart slide ── */}
        {slide.type === 'chart' && (
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="font-black mb-[3%] shrink-0 text-3xl lg:text-4xl" style={{ color: theme.headC }}>
              {slide.title}
            </h2>
            <div className="h-[2px] mb-[4%] shrink-0 rounded-full" style={{ background: theme.accent }} />
            <div className="flex-1 flex items-end gap-[2%] pb-[6%] relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-between pb-[6%] pointer-events-none">
                {count.map((x) => (
                  <div key={x} className="w-full h-px" style={{ background: `${theme.bodyC}22` }} />
                ))}
              </div>
              {(() => {
                const data = slide.chartData || []
                const max = Math.max(...data.map((x: any) => parseFloat(x.value as string) || 0), 1)
                return data.map((d: any, i: number) => {
                  const pct = Math.max(((parseFloat(d.value as string) || 0) / max) * 100, 4)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-[4%] h-full">
                      <div
                        className="w-full rounded-t-lg transition-all duration-700"
                        style={{ height: `${pct}%`, background: theme.accent, opacity: 0.85 + (i % 2) * 0.15 }}
                      />
                      <div className="text-center truncate w-full text-xs font-semibold" style={{ color: theme.bodyC }}>
                        {d.label}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}

        {/* ── Image slide ── */}
        {slide.type === 'image' && (
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="font-black mb-[3%] shrink-0 text-3xl lg:text-4xl" style={{ color: theme.headC }}>
              {slide.title}
            </h2>
            <div className="h-[2px] mb-[4%] shrink-0 rounded-full" style={{ background: theme.accent }} />
            <div className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative">
              {slide.image ? (
                <Image src={getImageUrl(slide.image)} alt="slide-image" width={100} height={100} unoptimized className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl">
                  <span className="font-semibold text-sm" style={{ color: theme.subC }}>
                    {t('image_placeholder')}
                  </span>
                </div>
              )}
            </div>
            {slide.content && (
              <p className="mt-[3%] shrink-0 text-sm font-medium" style={{ color: theme.bodyC }}>
                {Array.isArray(slide.content) ? slide.content.join(' ') : slide.content}
              </p>
            )}
          </div>
        )}

        {/* Slide number */}
        <div className="absolute bottom-[10px] right-[16px] font-bold text-xs" style={{ color: theme.subC }}>
          {index + 1}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ScaledSlide — wraps SlideContent and scales it down to fit its container.
// Measures its own container width and computes the CSS scale dynamically.
// ---------------------------------------------------------------------------
const ScaledSlide = ({
  slide,
  theme,
  index,
  isThumbnail,
}: {
  slide: Slide
  theme: ThemeColors
  index: number
  isThumbnail: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(isThumbnail ? 0.112 : 0.8) // safe default fallback

  useEffect(() => {
    if (!containerRef.current) return
    const updateScale = () => {
      const w = containerRef.current?.offsetWidth ?? (isThumbnail ? 144 : 1024)
      setScale(w / SLIDE_W)
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [isThumbnail])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
      }}
    >
      {/* Render at full 1280x720, then scale to fit container width */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: isThumbnail ? 'none' : 'auto',
        }}
      >
        <SlideContent slide={slide} theme={theme} index={index} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SlideRenderer — public component used by PresentationViewer
// ---------------------------------------------------------------------------
const SlideRenderer = ({ slide, theme, index, isThumbnail = false }: SlideProps) => {
  return <ScaledSlide slide={slide} theme={theme} index={index} isThumbnail={isThumbnail} />
}

export default SlideRenderer
