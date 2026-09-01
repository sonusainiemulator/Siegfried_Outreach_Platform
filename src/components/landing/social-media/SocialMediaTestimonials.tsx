'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { testimonialStats } from '@/data/landing'
import { cn } from '@/lib/utils'
import { Counter } from '@/utils/counter'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Pause,
  Play,
  Quote,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { testimonials } from '../../../data/landingSocialMedia'

export default function SocialMediaTestimonials() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const [isPaused, setIsPaused] = useState(false)
  const [selectedReview, setSelectedReview] = useState<(typeof testimonials)[0] | null>(null)

  return (
    <section
      id="testimonials"
      ref={(el) => registerRef('#testimonials', el)}
      className="py-20 md:py-28 relative overflow-hidden bg-background"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-square bg-primary/5 rounded-full blur-[140px] -z-10 pointer-events-none opacity-40" />
      <div className="absolute left-[-10%] top-[20%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto text-center px-4 mb-12">
        {/* Top Landbot Rating Score Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-2 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground">4.8</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400 drop-shadow-sm" />
              ))}
            </div>
          </div>
          <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">
            Average rating across 650+ verified social media managers & real estate teams
          </p>
        </motion.div>

        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('social_proof')} · Real Estate & Creator Growth</span>
        </motion.div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15] max-w-4xl mx-auto mb-6">
          Hundreds of teams. One thing they all say:{' '}
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            it just converts.
          </span>
        </h2>

        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">
          See how luxury property agencies and creators schedule listings, generate viral reels, and multiply buyer inquiries.
        </p>

        {/* Pause Toggle */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-card/60 hover:bg-card border border-border/50 text-foreground cursor-pointer transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3 text-green-500" /> : <Pause className="w-3 h-3 text-amber-500" />}
            <span>{isPaused ? 'Resume Carousel' : 'Pause Carousel'}</span>
          </button>
        </div>
      </div>

      {/* Marquee Carousel Rows */}
      <div className="relative w-full overflow-hidden py-4 space-y-6">
        {/* Gradient Edge Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />

        {/* Row 1: Left */}
        <div className="flex gap-5 w-max group overflow-visible">
          <div className={cn('flex gap-5 shrink-0 items-stretch', isPaused ? 'paused' : 'animate-marquee')}>
            {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
              <div
                key={`row1-${item.name}-${index}`}
                onClick={() => setSelectedReview(item)}
                className={cn(
                  'group relative flex flex-col justify-between cursor-pointer text-left',
                  'w-[320px] sm:w-[360px] md:w-[400px] shrink-0 min-h-[250px]',
                  'p-5 md:p-6 rounded-2xl transition-all duration-300',
                  'border border-border/60 hover:border-primary/50',
                  'bg-card/90 dark:bg-card/60 backdrop-blur-xl',
                  'shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(var(--primary-rgb),0.12)]',
                  'hover:-translate-y-1',
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-xs" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground/80">{item.score || '5.0'}</span>
                      {item.platform && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                          {item.platform}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed text-foreground/90 line-clamp-4">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-border/40">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.avatar ? (
                      <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-border/80 shadow-sm">
                        <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-tr from-primary to-indigo-600 shadow-sm">
                        {item.initials || 'SO'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-bold text-sm text-foreground truncate flex items-center gap-1">
                        <span>{item.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/15 shrink-0" />
                      </div>
                      <div className="text-[11.5px] text-muted-foreground truncate">{item.role}</div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right */}
        <div className="flex gap-5 w-max group overflow-visible">
          <div className={cn('flex gap-5 shrink-0 items-stretch', isPaused ? 'paused' : 'animate-marquee-reverse')}>
            {[...testimonials, ...testimonials, ...testimonials].reverse().map((item, index) => (
              <div
                key={`row2-${item.name}-${index}`}
                onClick={() => setSelectedReview(item)}
                className={cn(
                  'group relative flex flex-col justify-between cursor-pointer text-left',
                  'w-[320px] sm:w-[360px] md:w-[400px] shrink-0 min-h-[250px]',
                  'p-5 md:p-6 rounded-2xl transition-all duration-300',
                  'border border-border/60 hover:border-primary/50',
                  'bg-card/90 dark:bg-card/60 backdrop-blur-xl',
                  'shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(var(--primary-rgb),0.12)]',
                  'hover:-translate-y-1',
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-xs" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground/80">{item.score || '5.0'}</span>
                      {item.platform && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                          {item.platform}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed text-foreground/90 line-clamp-4">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-border/40">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.avatar ? (
                      <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-border/80 shadow-sm">
                        <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-sm">
                        {item.initials || 'SO'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-bold text-sm text-foreground truncate flex items-center gap-1">
                        <span>{item.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/15 shrink-0" />
                      </div>
                      <div className="text-[11.5px] text-muted-foreground truncate">{item.role}</div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Proof Metrics */}
      <div className="max-w-[1400px] mx-auto px-4 mt-16 md:mt-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonialStats.map((stat, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/60 text-center hover:border-primary/40 transition-all duration-300 shadow-lg group"
            >
              <div className="sm:text-5xl text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                <Counter value={stat.val} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="max-w-xl p-6 sm:p-8 bg-card border-border/80 text-foreground">
          {selectedReview && (
            <div>
              <DialogHeader className="mb-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm font-bold text-foreground ml-1.5">{selectedReview.score || '5.0'}</span>
                  </div>
                  {selectedReview.platform && (
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs font-semibold">
                      {selectedReview.platform}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold text-left text-foreground">
                  Review from {selectedReview.name}
                </DialogTitle>
                <DialogDescription className="text-left text-xs text-muted-foreground">
                  {selectedReview.role}
                </DialogDescription>
              </DialogHeader>

              <div className="relative my-6 p-6 rounded-xl bg-muted/40 border border-border/60">
                <Quote className="w-8 h-8 text-primary/30 mb-3" />
                <p className="text-base font-normal text-foreground leading-relaxed">
                  "{selectedReview.quote}"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-tr from-primary to-indigo-600 shadow-md">
                    {selectedReview.initials || 'SO'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {selectedReview.name}
                      <CheckCircle2 className="w-4 h-4 text-primary fill-primary/20" />
                    </div>
                    <div className="text-xs text-muted-foreground">Verified Real Estate Marketer</div>
                  </div>
                </div>

                <Link href="/social-media" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <span>Try Social Automation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
