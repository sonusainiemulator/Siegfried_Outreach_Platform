'use client'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { capabilities } from '../../../data/landingCampaignHub'

export default function CampaignHubCapabilities() {
  const router = useRouter()
  const { t } = useTranslation()
  const infiniteCapabilities = [...capabilities, ...capabilities, ...capabilities]
  const [activeCapability, setActiveCapability] = useState(capabilities.length)
  const [cardsToShow, setCardsToShow] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = useCallback(() => {
    setActiveCapability((prev) => prev + 1)
  }, [])

  const handlePrev = useCallback(() => {
    setActiveCapability((prev) => prev - 1)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsToShow(1)
      else if (window.innerWidth < 1024) setCardsToShow(2)
      else setCardsToShow(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    progressRef.current = setInterval(() => {
      handleNext()
    }, 4500)
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [handleNext])

  useEffect(() => {
    if (activeCapability >= capabilities.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setActiveCapability(capabilities.length)
      }, 500)
      return () => clearTimeout(timer)
    } else if (activeCapability < capabilities.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setActiveCapability((prev) => prev + capabilities.length)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => {
        setIsTransitioning(true)
      }, 10)
    }
  }, [activeCapability])

  const selectCapability = (idx: number) => {
    setIsTransitioning(true)
    setActiveCapability(idx + capabilities.length)
  }

  const displayIndex = activeCapability % capabilities.length
  const cap = capabilities[displayIndex]

  return (
    <>
      <section
        id="capabilities"
        className="py-[calc(35px+(75-35)*((100vw-320px)/(1920-320)))] relative overflow-hidden bg-slate-50/60 dark:bg-landing-bg-dark transition-colors"
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 transition-colors duration-700"
            style={{ background: cap.color }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-8 sm:mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[calc(28px+(56-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              See What Siegfried Outreach
              <br />
              <span className="text-primary">Can Do For Your Business</span>
            </motion.h2>
          </div>

          <div className="relative">
            {/* Carousel Navigation Buttons for Desktop */}
            <div className="hidden sm:flex items-center justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none px-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous capability"
                className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next capability"
                className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer hover:border-primary hover:text-primary"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-hidden py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
              <motion.div
                className="flex items-center cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  const swipeThreshold = 80
                  if (info.offset.x > swipeThreshold) {
                    handlePrev()
                  } else if (info.offset.x < -swipeThreshold) {
                    handleNext()
                  }
                }}
                animate={{ x: `-${(activeCapability - (cardsToShow === 3 ? 1 : 0)) * (100 / cardsToShow)}%` }}
                transition={isTransitioning ? { type: 'spring', stiffness: 300, damping: 30 } : { duration: 0 }}
              >
                {infiniteCapabilities.map((c, idx) => {
                  const isActive = idx === activeCapability
                  const isSide = idx === activeCapability - 1 || idx === activeCapability + 1

                  return (
                    <motion.div
                      key={idx}
                      className={cn(
                        'flex-shrink-0 cursor-pointer',
                        cardsToShow === 3 ? 'w-1/3' : cardsToShow === 2 ? 'w-1/2 px-3' : 'w-full px-3',
                      )}
                      animate={
                        cardsToShow === 3
                          ? {
                            scale: isActive ? 1.08 : isSide ? 0.88 : 0.78,
                            opacity: isActive ? 1 : isSide ? 0.8 : 0.45,
                            zIndex: isActive ? 10 : 1,
                            x: isSide ? (idx < activeCapability ? '4%' : '-4%') : 0,
                          }
                          : { scale: 1, opacity: 1, x: 0, zIndex: 1 }
                      }
                      transition={{ duration: 0.5 }}
                      onClick={() => setActiveCapability(idx)}
                    >
                      <div
                        className="relative rounded-3xl p-[1px] h-full overflow-hidden group transition-all duration-500 shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${c.color}80, transparent 60%, ${c.color}40)`,
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-15 blur-[40px] -z-10 group-hover:opacity-30 transition-opacity"
                          style={{ background: c.color }}
                        />

                        <div className="bg-white dark:bg-slate-900/95 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 h-full flex flex-col items-center text-center shadow-lg">
                          <div className="mb-4">
                            <span
                              className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] border"
                              style={{
                                color: c.color,
                                backgroundColor: `${c.color}18`,
                                borderColor: `${c.color}40`,
                              }}
                            >
                              {c.tag}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white mb-3">
                            {c.title}
                          </h3>

                          <p className="text-slate-600 dark:text-white/60 font-normal leading-relaxed text-sm mb-6 flex-grow">
                            {c.description}
                          </p>

                          <ul className="space-y-2.5 mb-7 w-full text-left">
                            {c.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-white/80">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="w-full pt-2 mt-auto">
                            <Button
                              type="button"
                              className="w-full rounded-xl sm:h-12 h-11 font-bold text-sm text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: c.color,
                                backgroundImage: `linear-gradient(135deg, ${c.color}, ${c.color}dd)`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(ROUTES.AUTH.REGISTER)
                              }}
                            >
                              <span>Try it Free</span>
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Pagination Indicators & Mobile Navigation */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous"
                className="sm:hidden w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-700 dark:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {capabilities.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => selectCapability(i)}
                    aria-label={`Jump to capability ${item.tag}`}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300 cursor-pointer',
                      displayIndex === i ? 'w-8' : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400'
                    )}
                    style={displayIndex === i ? { backgroundColor: item.color } : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next"
                className="sm:hidden w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-700 dark:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}