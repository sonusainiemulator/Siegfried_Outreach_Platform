'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { cn } from '@/lib/utils'
import { Counter } from '@/utils/counter'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Quote,
  Radio,
  Share2,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RealEstateTestimonial,
  campaignHubStats,
  realEstateTestimonials,
} from '../../../data/landingCampaignHub'

type CategoryFilter = 'all' | 'real-estate' | 'outreach' | 'ai-bots' | 'social-media'

export default function CampaignHubTestimonials() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState<'normal' | 'slow' | 'fast'>('normal')
  const [selectedReview, setSelectedReview] = useState<RealEstateTestimonial | null>(null)

  const categories: { key: CategoryFilter; label: string; icon: any }[] = [
    { key: 'all', label: 'All Reviews', icon: Star },
    { key: 'real-estate', label: 'Real Estate & Listings', icon: Building2 },
    { key: 'outreach', label: 'WhatsApp & Outreach', icon: MessageSquare },
    { key: 'ai-bots', label: 'AI Lead Bots & CRM', icon: Bot },
    { key: 'social-media', label: 'Social Media Automation', icon: Share2 },
  ]

  const filteredTestimonials = useMemo(() => {
    if (activeCategory === 'all') return realEstateTestimonials
    return realEstateTestimonials.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  // Split testimonials into 2 balanced rows for the marquee
  const row1 = useMemo(() => {
    return realEstateTestimonials.slice(0, Math.ceil(realEstateTestimonials.length / 2))
  }, [])

  const row2 = useMemo(() => {
    return realEstateTestimonials.slice(Math.ceil(realEstateTestimonials.length / 2))
  }, [])

  const getMarqueeClass = (direction: 'forward' | 'reverse') => {
    if (isPaused) return 'paused'
    if (direction === 'forward') {
      if (speed === 'slow') return 'animate-marquee-slow'
      if (speed === 'fast') return 'animate-marquee-fast'
      return 'animate-marquee'
    } else {
      if (speed === 'slow') return 'animate-marquee-reverse-slow'
      if (speed === 'fast') return 'animate-marquee-reverse-fast'
      return 'animate-marquee-reverse'
    }
  }

  return (
    <section
      id="testimonials"
      ref={(el) => registerRef('#testimonials', el)}
      className="py-20 md:py-28 relative overflow-hidden bg-background selection:bg-primary/20"
    >
      {/* Background glow accents */}
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute right-[-10%] top-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] -z-10 pointer-events-none opacity-50" />
      <div className="absolute left-[-10%] bottom-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        {/* Top Landbot Rating Score Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-2 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground">4.7</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400 drop-shadow-sm" />
              ))}
            </div>
          </div>
          <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">
            Average rating across 850+ verified reviews
          </p>
        </motion.div>

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-[0.25em] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Loved by Real Estate & Revenue Teams</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15] mb-6"
        >
          Hundreds of teams. One thing they all say:{' '}
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            it just converts.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-10"
        >
          From luxury brokerages and property wholesalers to high-velocity outreach agencies, see how teams close deals
          faster with Siegfried Outreach.
        </motion.p>

        {/* Category Filters & Playback Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
          {categories.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer border',
                activeCategory === key
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                  : 'bg-card/70 hover:bg-card text-muted-foreground hover:text-foreground border-border/60 hover:border-border backdrop-blur-md',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Play / Speed Bar */}
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mb-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-card/60 hover:bg-card border border-border/50 text-foreground cursor-pointer transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3 text-green-500" /> : <Pause className="w-3 h-3 text-amber-500" />}
            <span>{isPaused ? 'Resume Carousel' : 'Pause Carousel'}</span>
          </button>
          <div className="flex items-center gap-1 bg-card/60 border border-border/50 rounded-md p-0.5">
            {(['slow', 'normal', 'fast'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer',
                  speed === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Testimonial Slider / Marquee Display */}
      {activeCategory === 'all' ? (
        <div className="relative w-full overflow-hidden py-4 space-y-6">
          {/* Gradient Edge Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />

          {/* Row 1: Scrolling Left */}
          <div className="flex gap-5 w-max group overflow-visible">
            <div className={cn('flex gap-5 shrink-0 items-stretch', getMarqueeClass('forward'))}>
              {[...row1, ...row1].map((item, index) => (
                <TestimonialCard
                  key={`row1-${item.id}-${index}`}
                  testimonial={item}
                  onClick={() => setSelectedReview(item)}
                />
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="flex gap-5 w-max group overflow-visible">
            <div className={cn('flex gap-5 shrink-0 items-stretch', getMarqueeClass('reverse'))}>
              {[...row2, ...row2].map((item, index) => (
                <TestimonialCard
                  key={`row2-${item.id}-${index}`}
                  testimonial={item}
                  onClick={() => setSelectedReview(item)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Filtered Grid View for Specific Category */
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTestimonials.map((item) => (
              <TestimonialCard
                key={`filtered-${item.id}`}
                testimonial={item}
                isGrid
                onClick={() => setSelectedReview(item)}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Bottom Proof Metrics Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {campaignHubStats.map(({ val, label, icon: Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                'relative flex items-center gap-5 p-6 rounded-2xl',
                'bg-card/70 backdrop-blur-xl border border-border/60 shadow-xl',
                'hover:border-primary/40 hover:shadow-2xl transition-all duration-300 group',
              )}
            >
              <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="w-7 h-7" />
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  <Counter value={val} />
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="max-w-xl p-6 sm:p-8 bg-card border-border/80 text-foreground">
          {selectedReview && (
            <div>
              <DialogHeader className="mb-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-1.5">
                    {[...Array(selectedReview.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm font-bold text-foreground ml-1.5">{selectedReview.score}</span>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs font-semibold">
                    {selectedReview.feature}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-left text-foreground">
                  Review from {selectedReview.name}
                </DialogTitle>
                <DialogDescription className="text-left text-xs text-muted-foreground">
                  {selectedReview.role} {selectedReview.company ? `· ${selectedReview.company}` : ''}
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
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-tr shadow-md',
                      selectedReview.color,
                    )}
                  >
                    {selectedReview.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {selectedReview.name}
                      <CheckCircle2 className="w-4 h-4 text-primary fill-primary/20" />
                    </div>
                    <div className="text-xs text-muted-foreground">Verified Real Estate Professional</div>
                  </div>
                </div>

                <Link href="/campaign-hub" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <span>Try This Feature</span>
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

interface TestimonialCardProps {
  testimonial: RealEstateTestimonial
  onClick?: () => void
  isGrid?: boolean
}

function TestimonialCard({ testimonial, onClick, isGrid }: TestimonialCardProps) {
  const { quote, name, role, company, score, initials, color, feature, avatar } = testimonial

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-between cursor-pointer text-left',
        'p-5 md:p-6 rounded-2xl transition-all duration-300',
        'border border-border/60 hover:border-primary/50',
        'bg-card/90 dark:bg-card/60 backdrop-blur-xl',
        'shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(var(--primary-rgb),0.12)]',
        'hover:-translate-y-1',
        isGrid ? 'w-full min-h-[260px]' : 'w-[320px] sm:w-[360px] md:w-[400px] shrink-0 min-h-[250px]',
      )}
    >
      {/* Subtle top hover gradient bar */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

      {/* Top Card Row: Stars & Numerical Score */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-xs" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground/80">{score}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              {feature}
            </span>
          </div>
        </div>

        {/* Body Quote */}
        <p className="text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed text-foreground/90 line-clamp-4">
          "{quote}"
        </p>
      </div>

      {/* Bottom Card Row: Avatar + Name + Role */}
      <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-border/40">
        <div className="flex items-center gap-3 min-w-0">
          {avatar ? (
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-border/80 shadow-sm">
              <Image src={avatar} alt={name} fill className="object-cover" />
            </div>
          ) : (
            <div
              className={cn(
                'w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-tr shadow-sm',
                color,
              )}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <div className="font-bold text-sm text-foreground truncate flex items-center gap-1">
              <span>{name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/15 shrink-0" />
            </div>
            <div className="text-[11.5px] text-muted-foreground truncate">
              {role} {company ? `· ${company}` : ''}
            </div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </div>
  )
}
