'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Sparkles,
  Loader2,
  Layers,
  Wand2,
  Check,
  RefreshCw,
  Hash,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  X,
  Target,
  ArrowRight,
  Download,
  Palette,
  Type,
  AtSign,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Briefcase,
  Zap,
  Flame,
  DollarSign,
  Building,
  HeartPulse,
  UserCheck,
  Edit3,
  Sun,
  Moon,
  Layout,
  Grid,
  Search,
  BookOpen,
  Star
} from 'lucide-react'
import { TwitterXIcon } from '@/data/socialMedia'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGenerateCarouselMutation } from '@/redux/api/aiContentApi'
import { AICarouselResult } from '@/types/components/socialMedia'

interface AICarouselModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (data: {
    title: string
    content: string
    autoReplyKeyword: string
    autoReplyMessage: string
    slides: AICarouselResult['slides']
    files?: File[]
  }) => void
}

// 4 Clean Card Visual Themes
export type CardVisualTheme = 'dark_glass' | 'clean_light' | 'tweet_card' | 'gradient_mesh'

// Preset Quick Brand Colors
const QUICK_BRAND_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Crimson', hex: '#dc2626' },
]

// 12 High-Converting Designer Carousel Templates for the Gallery
export interface CarouselTemplate {
  id: string
  title: string
  category: 'tech' | 'b2b' | 'finance' | 'mindset' | 'creator' | 'ecommerce' | 'health' | 'realestate'
  categoryName: string
  topic: string
  slideCount: number
  theme: CardVisualTheme
  accentColor: string
  previewHook: string
  badgeText: string
  popular?: boolean
}

const TEMPLATE_GALLERY: CarouselTemplate[] = [
  {
    id: 'ai-automation-2026',
    title: 'The 7 AI Automations Playbook',
    category: 'tech',
    categoryName: 'Tech & AI',
    topic: '7 AI tools and automated workflows that eliminate 90% of manual repetitive tasks in 2026',
    slideCount: 7,
    theme: 'dark_glass',
    accentColor: '#06b6d4',
    previewHook: 'Stop wasting 15+ hours a week on tasks AI can execute in 3 seconds.',
    badgeText: '🔥 Most Popular',
    popular: true
  },
  {
    id: 'b2b-retainer-blueprint',
    title: 'From $0 to $10k/mo Retainer Machine',
    category: 'b2b',
    categoryName: 'B2B & Agency',
    topic: 'The exact cold outreach and qualification framework to close $5k-$10k/mo B2B retainers',
    slideCount: 7,
    theme: 'dark_glass',
    accentColor: '#6366f1',
    previewHook: 'The 3-stage client acquisition engine top agencies use to scale without paid ads.',
    badgeText: '💼 B2B Classic',
    popular: true
  },
  {
    id: 'wealth-rules-1percent',
    title: '5 Money Rules of the 1%',
    category: 'finance',
    categoryName: 'Finance & Wealth',
    topic: '5 Timeless money psychology and cashflow rules that separate the top 1% from the middle class',
    slideCount: 6,
    theme: 'dark_glass',
    accentColor: '#10b981',
    previewHook: 'Making money is a skill. Keeping and multiplying it is a game of psychology.',
    badgeText: '💰 High Engagement'
  },
  {
    id: 'harsh-life-lessons',
    title: '10 Harsh Truths for High Performers',
    category: 'mindset',
    categoryName: 'Mindset & Habits',
    topic: '10 Brutally honest life and business lessons that 99% of people realize 10 years too late',
    slideCount: 10,
    theme: 'gradient_mesh',
    accentColor: '#f43f5e',
    previewHook: 'Read this if you feel stuck or delayed in reaching your potential.',
    badgeText: '⚡ Viral Retention',
    popular: true
  },
  {
    id: 'creator-audience-playbook',
    title: 'How to Build a 100k Audience',
    category: 'creator',
    categoryName: 'Creator & Brand',
    topic: 'The content ecosystem framework to build an authentic, highly-monetizable audience from scratch',
    slideCount: 7,
    theme: 'clean_light',
    accentColor: '#ec4899',
    previewHook: 'Followers are vanity. Community and inbound distribution is equity.',
    badgeText: '🚀 Creator Favorite'
  },
  {
    id: 'meta-ads-scaling-dtc',
    title: 'The DTC Ad Creative Testing System',
    category: 'ecommerce',
    categoryName: 'E-Commerce',
    topic: 'The 4-stage creative iteration and Hook-Rate framework to scale Meta and TikTok ads profitably',
    slideCount: 6,
    theme: 'dark_glass',
    accentColor: '#a855f7',
    previewHook: 'Why 80% of ad spend is wasted and how to test 20 hooks a week on auto-pilot.',
    badgeText: '🛍️ ROI Playbook'
  },
  {
    id: 'daily-energy-biohacks',
    title: '6 Protocols for Limitless Energy',
    category: 'health',
    categoryName: 'Health & Biohacking',
    topic: '6 Evidence-based morning and evening protocols to eliminate brain fog and double focus',
    slideCount: 6,
    theme: 'clean_light',
    accentColor: '#14b8a6',
    previewHook: 'Optimize your biology before you optimize your business.',
    badgeText: '🌿 High Value'
  },
  {
    id: 'real-estate-cashflow',
    title: 'Real Estate Cashflow Framework',
    category: 'realestate',
    categoryName: 'Real Estate',
    topic: '3 Property investment models to generate consistent monthly cashflow without landlord headaches',
    slideCount: 5,
    theme: 'dark_glass',
    accentColor: '#f59e0b',
    previewHook: 'The difference between owning liabilities and owning compounding real assets.',
    badgeText: '🏢 High Ticket'
  },
  {
    id: 'viral-tweet-deck',
    title: 'The Viral X / Tweet Slide Deck',
    category: 'creator',
    categoryName: 'Social Growth',
    topic: '5 Psychological tweet formulas that drive massive reposts, bookmarks, and newsletter clicks',
    slideCount: 5,
    theme: 'tweet_card',
    accentColor: '#38bdf8',
    previewHook: 'The secret formatting structure behind million-impression viral tweets.',
    badgeText: '🐦 Tweet Format'
  },
  {
    id: 'high-ticket-offer',
    title: 'The High-Ticket Offer Architecture',
    category: 'b2b',
    categoryName: 'Sales & Offers',
    topic: 'How to structure a $5,000+ irresistible offer with guarantees and zero price resistance',
    slideCount: 6,
    theme: 'gradient_mesh',
    accentColor: '#6366f1',
    previewHook: 'Stop competing on price. Create a category of one with value anchoring.',
    badgeText: '💎 Closing Guide'
  },
  {
    id: 'saas-metrics-dashboard',
    title: '8 SaaS Metrics Every Founder Must Track',
    category: 'tech',
    categoryName: 'SaaS & Tech',
    topic: 'The definitive breakdown of CAC, LTV, Net Retention, Quick Ratio and Payback Period with benchmarks',
    slideCount: 8,
    theme: 'dark_glass',
    accentColor: '#06b6d4',
    previewHook: 'If you cannot measure your churn drivers, you cannot fix your growth engine.',
    badgeText: '📊 Data Driven'
  },
  {
    id: 'cold-dm-script-deck',
    title: 'The Inbound DM Closing Playbook',
    category: 'b2b',
    categoryName: 'DM Funnels',
    topic: 'Step-by-step chat framework to turn comment triggers into booked sales calls in 4 messages',
    slideCount: 6,
    theme: 'clean_light',
    accentColor: '#f59e0b',
    previewHook: 'The non-salesy conversational framework that books 10+ calls weekly from Instagram DMs.',
    badgeText: '🎯 ManyChat Ready'
  }
]

const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'tech', name: 'Tech & AI' },
  { id: 'b2b', name: 'B2B & Agency' },
  { id: 'finance', name: 'Finance & Wealth' },
  { id: 'mindset', name: 'Mindset & Habits' },
  { id: 'creator', name: 'Creator & Brand' },
  { id: 'ecommerce', name: 'E-Commerce' },
  { id: 'health', name: 'Health & Biohack' },
  { id: 'realestate', name: 'Real Estate' },
]

const VISUAL_THEMES = [
  {
    id: 'dark_glass',
    name: 'Dark Glassmorphism',
    icon: Moon,
  },
  {
    id: 'clean_light',
    name: 'Clean Minimal Light',
    icon: Sun,
  },
  {
    id: 'tweet_card',
    name: 'Viral X Style',
    icon: TwitterXIcon,
  },
  {
    id: 'gradient_mesh',
    name: 'Vibrant Mesh Gradient',
    icon: Palette,
  }
]

// Canvas Rendering Engine
function renderSlideCardToCanvas(
  canvas: HTMLCanvasElement,
  slide: any,
  slideIndex: number,
  totalSlides: number,
  brandName: string,
  brandHandle: string,
  brandColor: string,
  visualTheme: CardVisualTheme
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = 1080
  const height = 1080
  canvas.width = width
  canvas.height = height

  const isLight = visualTheme === 'clean_light'
  const isTweet = visualTheme === 'tweet_card'
  const isMesh = visualTheme === 'gradient_mesh'

  // 1. Background Setup
  if (isLight) {
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    const topGlow = ctx.createLinearGradient(0, 0, width, 220)
    topGlow.addColorStop(0, brandColor + '18')
    topGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = topGlow
    ctx.fillRect(0, 0, width, 220)
  } else if (isMesh) {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#090d16')
    bgGrad.addColorStop(0.5, '#131127')
    bgGrad.addColorStop(1, '#05070e')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    const rGrad = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 550)
    rGrad.addColorStop(0, brandColor + '40')
    rGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = rGrad
    ctx.fillRect(0, 0, width, height)
  } else if (isTweet) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#27272a'
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, width - 80, height - 80)
  } else {
    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, '#0b0f19')
    grad.addColorStop(0.5, '#111827')
    grad.addColorStop(1, '#070a12')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    const glow = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 650)
    glow.addColorStop(0, brandColor + '35')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, 650)
  }

  // 2. Header Bar: Brand Identity & Slide Counter
  const avatarSize = 56
  const startX = 80
  const startY = 85

  // Brand Avatar Icon
  const avatarGrad = ctx.createLinearGradient(startX, startY, startX + avatarSize, startY + avatarSize)
  avatarGrad.addColorStop(0, brandColor)
  avatarGrad.addColorStop(1, '#ffffff33')
  ctx.fillStyle = avatarGrad
  ctx.beginPath()
  ctx.arc(startX + avatarSize / 2, startY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
  ctx.fill()

  // Avatar Initial
  const initial = (brandName || 'S').charAt(0).toUpperCase()
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 28px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(initial, startX + avatarSize / 2, startY + avatarSize / 2 + 10)
  ctx.textAlign = 'left'

  // Brand Name & Handle
  ctx.fillStyle = isLight ? '#0f172a' : '#ffffff'
  ctx.font = 'bold 26px sans-serif'
  ctx.fillText(brandName || 'Siegfried', startX + avatarSize + 16, startY + 24)

  ctx.fillStyle = isLight ? '#64748b' : brandColor
  ctx.font = '500 20px sans-serif'
  const handleText = brandHandle.startsWith('@') ? brandHandle : '@' + (brandHandle || 'siegfriedoutreach')
  ctx.fillText(handleText, startX + avatarSize + 16, startY + 50)

  // Top-Right Slide Pill Counter
  const slideNum = String(slideIndex + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0')
  ctx.fillStyle = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'
  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.1)' : brandColor + '50'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(width - 220, startY, 140, 48, 24)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = brandColor
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(slideNum, width - 150, startY + 31)
  ctx.textAlign = 'left'

  // 3. Main Headline / Hook
  ctx.fillStyle = isLight ? '#0f172a' : '#ffffff'
  ctx.font = '900 48px sans-serif'
  const headline = slide.headline || ('Slide ' + (slideIndex + 1))
  wrapText(ctx, headline, 80, 245, width - 160, 58)

  // 4. Subheadline
  if (slide.subheadline) {
    ctx.fillStyle = isLight ? '#475569' : '#cbd5e1'
    ctx.font = '500 26px sans-serif'
    wrapText(ctx, slide.subheadline, 80, 380, width - 160, 38)
  }

  // 5. Bullet Points / Content Cards
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    let cardY = 470
    slide.bulletPoints.slice(0, 4).forEach((point: string, pIdx: number) => {
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.06)'
      ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.08)' : brandColor + '40'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(80, cardY, width - 160, 95, 20)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = brandColor
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText(String(pIdx + 1), 115, cardY + 58)

      ctx.fillStyle = isLight ? '#1e293b' : '#f1f5f9'
      ctx.font = '600 24px sans-serif'
      wrapText(ctx, point, 160, cardY + 45, width - 260, 32)

      cardY += 115
    })
  }

  // 6. Footer: Action / Swipe Trigger
  ctx.fillStyle = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'
  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(80, height - 120, width - 160, 60, 16)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = brandColor
  ctx.font = 'bold 22px sans-serif'
  const footerPrompt = slideIndex === totalSlides - 1
    ? (slide.autoReplyKeyword ? '👉 Comment "' + slide.autoReplyKeyword + '" for instant link access' : '👉 Save & Share this post')
    : '👉 SWIPE FOR NEXT INSIGHT ➔'
  ctx.fillText(footerPrompt, 110, height - 82)
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ')
  let line = ''
  let curY = y

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY)
      line = words[n] + ' '
      curY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, curY)
}

export const AICarouselModal: React.FC<AICarouselModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const { t } = useTranslation()
  const [generateCarousel, { isLoading }] = useGenerateCarouselMutation()

  // Studio Mode: 'generator' vs 'gallery'
  const [studioView, setStudioView] = useState<'generator' | 'gallery'>('generator')
  const [galleryCategory, setGalleryCategory] = useState<string>('all')
  const [gallerySearch, setGallerySearch] = useState<string>('')

  // Generator & Brand Parameters
  const [topic, setTopic] = useState('7 AI tools that automate 90% of business workflows in 2026')
  const [slideCount, setSlideCount] = useState<number>(7)
  const [brandName, setBrandName] = useState('Siegfried')
  const [brandHandle, setBrandHandle] = useState('@siegfriedoutreach')
  const [brandColor, setBrandColor] = useState('#06b6d4')
  const [visualTheme, setVisualTheme] = useState<CardVisualTheme>('dark_glass')

  // Step 2 Review & Editing Controls
  const [generatedResult, setGeneratedResult] = useState<AICarouselResult | null>(null)
  const [activeSlidePreview, setActiveSlidePreview] = useState(0)
  const [isEditingSlide, setIsEditingSlide] = useState(false)
  const [renderedSlideUrls, setRenderedSlideUrls] = useState<string[]>([])
  const [renderedFiles, setRenderedFiles] = useState<File[]>([])

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATE_GALLERY.filter((tmpl) => {
      const matchCat = galleryCategory === 'all' || tmpl.category === galleryCategory
      const matchSearch =
        !gallerySearch.trim() ||
        tmpl.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
        tmpl.topic.toLowerCase().includes(gallerySearch.toLowerCase())
      return matchCat && matchSearch
    })
  }, [galleryCategory, gallerySearch])

  const handleSelectTemplate = (template: CarouselTemplate) => {
    setTopic(template.topic)
    setSlideCount(template.slideCount)
    setBrandColor(template.accentColor)
    setVisualTheme(template.theme)
    setStudioView('generator')
    toast.success('Loaded "' + template.title + '" blueprint!')
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error(t('topic_required', { defaultValue: 'Please provide a topic or idea for the carousel.' }))
      return
    }

    try {
      const response = await generateCarousel({
        topic: topic.trim(),
        slideCount,
        tone: 'engaging',
        targetAudience: 'founders, creators, professionals, and growth leaders',
        ctaType: 'comment_for_link',
      }).unwrap()

      if (response?.data) {
        setGeneratedResult(response.data)
        setActiveSlidePreview(0)
        setIsEditingSlide(false)
        toast.success(t('carousel_generated_success', { defaultValue: 'Viral branded carousel synthesized!' }))
      }
    } catch (err: any) {
      console.error('Carousel generation failed:', err)
      toast.error(err?.data?.message || t('generation_failed', { defaultValue: 'AI generation failed. Please try again.' }))
    }
  }

  // Real-Time Canvas Re-Render
  useEffect(() => {
    if (!generatedResult?.slides || generatedResult.slides.length === 0) return

    const total = generatedResult.slides.length
    const urls: string[] = []
    const files: File[] = []

    const offscreen = document.createElement('canvas')
    generatedResult.slides.forEach((slide, idx) => {
      renderSlideCardToCanvas(offscreen, slide, idx, total, brandName, brandHandle, brandColor, visualTheme)
      const dataUrl = offscreen.toDataURL('image/png')
      urls.push(dataUrl)

      const byteString = atob(dataUrl.split(',')[1])
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: 'image/png' })
      const file = new File([blob], 'carousel-slide-' + (idx + 1) + '.png', { type: 'image/png' })
      files.push(file)
    })

    setRenderedSlideUrls(urls)
    setRenderedFiles(files)
  }, [generatedResult, brandName, brandHandle, brandColor, visualTheme])

  const handleUpdateActiveSlide = (field: 'headline' | 'subheadline', value: string) => {
    if (!generatedResult) return
    const updatedSlides = [...generatedResult.slides]
    updatedSlides[activeSlidePreview] = {
      ...updatedSlides[activeSlidePreview],
      [field]: value
    }
    setGeneratedResult({
      ...generatedResult,
      slides: updatedSlides
    })
  }

  const handleDownloadSlide = (index: number) => {
    const url = renderedSlideUrls[index]
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = brandName.toLowerCase().replace(/\s+/g, '-') + '-slide-' + (index + 1) + '.png'
    a.click()
    toast.success('Slide ' + (index + 1) + ' downloaded!')
  }

  const handleDownloadAll = () => {
    renderedSlideUrls.forEach((url, idx) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = url
        a.download = brandName.toLowerCase().replace(/\s+/g, '-') + '-slide-' + (idx + 1) + '.png'
        a.click()
      }, idx * 200)
    })
    toast.success('Downloading all ' + renderedSlideUrls.length + ' branded visual cards!')
  }

  const handleApplyToPost = () => {
    if (!generatedResult) return

    const fullCaption = (generatedResult.hook || '') + '\n\n' + (generatedResult.caption || '') + '\n\n' + ((generatedResult.hashtags || []).join(' ')).trim()

    onApply({
      title: generatedResult.title || topic,
      content: fullCaption,
      autoReplyKeyword: generatedResult.triggerKeyword || 'DM',
      autoReplyMessage: generatedResult.autoReplyMessage || 'Hey! Here is the full guide you requested: [link] 🚀',
      slides: generatedResult.slides || [],
      files: renderedFiles
    })

    toast.success(t('applied_to_composer', {
      defaultValue: 'Attached ' + renderedFiles.length + ' Branded Carousel Cards to Post Composer!'
    }))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 border border-white/15 bg-[#0b0f19] text-white backdrop-blur-3xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Header with Tab Switcher */}
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-primary/20 via-purple-600/15 to-transparent shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-primary/30 ring-1 ring-white/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2.5">
                  <span>{t('ai_branded_carousel_title', { defaultValue: 'AI Carousel & Design Studio' })}</span>
                  <Badge className="bg-primary/25 text-primary-foreground border border-primary/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 shadow-xs">
                    5–10 Branded Slides
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                  {t('ai_branded_carousel_desc', {
                    defaultValue: 'Synthesize viral multi-slide carousels or pick from 12+ high-converting designer templates.',
                  })}
                </DialogDescription>
              </div>
            </div>

            {/* View Switcher Tabs (Prompt Studio vs Template Gallery) */}
            {!generatedResult ? (
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setStudioView('generator')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer',
                    studioView === 'generator'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>AI Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStudioView('gallery')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer',
                    studioView === 'gallery'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Template Gallery ({TEMPLATE_GALLERY.length})</span>
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGeneratedResult(null)}
                className="text-xs border-white/15 bg-white/5 hover:bg-white/10 text-white gap-1.5 rounded-xl h-9"
              >
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Adjust Parameters</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {studioView === 'gallery' && !generatedResult ? (
            /* ================= DESIGN TEMPLATE GALLERY ================= */
            <div className="p-5 sm:p-6 space-y-5 animate-fade-in">
              {/* Search & Filter Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  {GALLERY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGalleryCategory(cat.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0',
                        galleryCategory === cat.id
                          ? 'border-primary bg-primary/20 text-white shadow-xs'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="Search templates..."
                    className="h-9 pl-9 text-xs rounded-xl border-white/15 bg-white/5 text-white placeholder:text-neutral-500"
                  />
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold">
                          {tmpl.categoryName}
                        </Badge>
                        <span className="text-[10px] font-extrabold text-amber-400">
                          {tmpl.badgeText}
                        </span>
                      </div>

                      {/* Title & Preview Hook */}
                      <h4 className="text-sm font-extrabold text-white group-hover:text-primary transition-colors leading-snug">
                        {tmpl.title}
                      </h4>
                      <p className="text-xs text-neutral-300 italic mt-2 line-clamp-2 leading-relaxed bg-black/30 p-2 rounded-xl border border-white/5">
                        &quot;{tmpl.previewHook}&quot;
                      </p>
                    </div>

                    {/* Footer Info & 1-Click Action */}
                    <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: tmpl.accentColor }}
                        />
                        <span className="text-[11px] font-bold text-neutral-400">
                          {tmpl.slideCount} Slides
                        </span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="h-8 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !generatedResult ? (
            /* ================= STEP 1: AI PROMPT & BRAND SETUP ================= */
            <div className="p-5 sm:p-6 space-y-6">
              {/* Quick Template Gallery Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-600/15 to-transparent border border-primary/30 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/25 text-primary flex items-center justify-center">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Want proven viral structures?</h4>
                    <p className="text-[11px] text-neutral-400">Browse 12+ pre-engineered viral blueprints with custom layouts.</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStudioView('gallery')}
                  className="h-8 text-xs border-primary/40 bg-primary/10 hover:bg-primary/20 text-white rounded-xl gap-1.5"
                >
                  <Grid className="w-3.5 h-3.5 text-primary" />
                  <span>Open Template Gallery</span>
                </Button>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                  <span>Topic or Core Concept *</span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {topic.length} / 500
                  </span>
                </Label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 5 Growth Hacks to double inbound leads in 30 days without ads, 7 Frameworks for agency owners, etc."
                  className="min-h-24 text-xs leading-relaxed rounded-2xl border-white/15 p-3.5 bg-white/5 text-white placeholder:text-neutral-500 shadow-xs resize-y focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Slide Count & Brand Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                {/* Slide Count (5 to 10) */}
                <div className="space-y-2">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>Number of Slides (5–10)</span>
                  </Label>
                  <div className="grid grid-cols-6 gap-1">
                    {[5, 6, 7, 8, 9, 10].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSlideCount(count)}
                        className={cn(
                          'h-10 rounded-xl border text-center text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center',
                          slideCount === count
                            ? 'border-primary bg-primary/25 text-white shadow-xs ring-1 ring-primary'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                        )}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Name Input */}
                <div className="space-y-2">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Brand Name</span>
                  </Label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Siegfried / Acme Inc"
                    className="h-10 text-xs rounded-xl border-white/15 bg-white/5 text-white placeholder:text-neutral-500"
                  />
                </div>

                {/* Brand Handle Input */}
                <div className="space-y-2">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-rose-400" />
                    <span>Brand Handle</span>
                  </Label>
                  <Input
                    value={brandHandle}
                    onChange={(e) => setBrandHandle(e.target.value)}
                    placeholder="e.g. @siegfriedoutreach"
                    className="h-10 text-xs rounded-xl border-white/15 bg-white/5 text-white placeholder:text-neutral-500"
                  />
                </div>
              </div>

              {/* Real Brand Color & Theme Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10">
                {/* Brand Accent Color (Custom Picker + Quick Swatches) */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Brand Accent Color</span>
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">{brandColor}</span>
                  </Label>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-bold text-neutral-300">Custom</span>
                    </div>

                    {QUICK_BRAND_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setBrandColor(col.hex)}
                        title={col.name}
                        className={cn(
                          'w-8 h-8 rounded-xl border transition-all cursor-pointer flex items-center justify-center',
                          brandColor.toLowerCase() === col.hex.toLowerCase()
                            ? 'border-white ring-2 ring-primary scale-110 shadow-md'
                            : 'border-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                        )}
                        style={{ backgroundColor: col.hex }}
                      >
                        {brandColor.toLowerCase() === col.hex.toLowerCase() && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Visual Theme Mode */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-purple-400" />
                    <span>Visual Card Layout Style</span>
                  </Label>

                  <div className="grid grid-cols-2 gap-2">
                    {VISUAL_THEMES.map((th) => {
                      const Icon = th.icon
                      const isSelected = visualTheme === th.id
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setVisualTheme(th.id as CardVisualTheme)}
                          className={cn(
                            'p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5',
                            isSelected
                              ? 'border-primary bg-primary/20 shadow-xs ring-1 ring-primary/60'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          )}
                        >
                          <Icon className={cn('w-4 h-4 shrink-0', isSelected ? 'text-primary' : 'text-neutral-400')} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{th.name}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= STEP 2: LIVE REVIEW & REAL-TIME BRAND STYLING ================= */
            <div className="p-5 sm:p-6 space-y-5 animate-fade-in">
              {/* Top Live Brand Customizer Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Theme Switcher Chips */}
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                    {VISUAL_THEMES.map((th) => {
                      const Icon = th.icon
                      const isSelected = visualTheme === th.id
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setVisualTheme(th.id as CardVisualTheme)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                            isSelected
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-neutral-400 hover:text-white'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{th.name.split(' ')[0]}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Live Color Picker */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    {QUICK_BRAND_COLORS.slice(0, 5).map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setBrandColor(col.hex)}
                        className={cn(
                          'w-5 h-5 rounded-md border transition-all cursor-pointer',
                          brandColor.toLowerCase() === col.hex.toLowerCase()
                            ? 'border-white scale-110 shadow-xs'
                            : 'border-white/20 opacity-70 hover:opacity-100'
                        )}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingSlide(!isEditingSlide)}
                    className={cn(
                      'h-8 text-xs gap-1.5 rounded-xl border-white/15',
                      isEditingSlide ? 'bg-primary text-white border-primary' : 'bg-white/5 text-white'
                    )}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingSlide ? 'Close Editor' : 'Edit Slide Text'}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadAll}
                    className="h-8 text-xs gap-1.5 border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                  >
                    <Download className="w-3.5 h-3.5 text-primary" />
                    <span>Download All PNGs</span>
                  </Button>
                </div>
              </div>

              {/* Main Studio View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Slide Thumbnails (4 cols) */}
                <div className="lg:col-span-4 space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Deck Slides ({renderedSlideUrls.length})
                  </Label>
                  {renderedSlideUrls.map((url, sIdx) => {
                    const slide = generatedResult.slides?.[sIdx]
                    const isActive = activeSlidePreview === sIdx
                    return (
                      <div
                        key={sIdx}
                        onClick={() => setActiveSlidePreview(sIdx)}
                        className={cn(
                          'p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group',
                          isActive
                            ? 'border-primary bg-primary/20 ring-1 ring-primary/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                        )}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-black shadow-xs">
                          <img src={url} alt={'Slide ' + (sIdx + 1)} className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">Slide {sIdx + 1}</span>
                            <span className={cn(
                              'text-[9px] uppercase px-1.5 py-0.5 rounded-md font-extrabold',
                              slide?.type === 'cover'
                                ? 'bg-primary/30 text-primary-foreground border border-primary/40'
                                : slide?.type === 'cta'
                                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                                : 'bg-white/10 text-neutral-300 border border-white/10'
                            )}>
                              {slide?.type || 'content'}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5 group-hover:text-neutral-200">
                            {slide?.headline}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right Column: Live High-Res Card Preview + Inline Editor (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  {isEditingSlide && generatedResult.slides?.[activeSlidePreview] ? (
                    <div className="p-4 rounded-2xl border border-primary/40 bg-primary/10 space-y-3 max-w-[480px] mx-auto animate-fade-in">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-extrabold uppercase text-primary flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing Slide {activeSlidePreview + 1}</span>
                        </Label>
                        <span className="text-[10px] text-neutral-400">Live preview updates automatically</span>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-neutral-300">Slide Headline</Label>
                        <Input
                          value={generatedResult.slides[activeSlidePreview].headline}
                          onChange={(e) => handleUpdateActiveSlide('headline', e.target.value)}
                          className="h-9 text-xs rounded-xl border-white/20 bg-black/40 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-neutral-300">Slide Subheadline</Label>
                        <Input
                          value={generatedResult.slides[activeSlidePreview].subheadline || ''}
                          onChange={(e) => handleUpdateActiveSlide('subheadline', e.target.value)}
                          className="h-9 text-xs rounded-xl border-white/20 bg-black/40 text-white"
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Rendered Visual Card */}
                  <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.7)] bg-[#070a12] flex items-center justify-center p-3 max-w-[480px] mx-auto ring-1 ring-white/10">
                    {renderedSlideUrls[activeSlidePreview] ? (
                      <img
                        src={renderedSlideUrls[activeSlidePreview]}
                        alt={'Slide ' + (activeSlidePreview + 1)}
                        className="w-full h-auto rounded-2xl shadow-2xl object-contain"
                      />
                    ) : (
                      <div className="h-96 flex items-center justify-center text-neutral-400 text-xs">
                        Rendering visual card...
                      </div>
                    )}
                  </div>

                  {/* Navigation Pill Bar */}
                  <div className="flex items-center justify-between pt-1 max-w-[480px] mx-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={activeSlidePreview === 0}
                      onClick={() => setActiveSlidePreview((p) => p - 1)}
                      className="text-xs h-9 px-3 border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                      Previous
                    </Button>

                    <span className="text-xs font-bold text-neutral-300">
                      Slide {activeSlidePreview + 1} of {renderedSlideUrls.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadSlide(activeSlidePreview)}
                        className="text-xs h-9 px-2 text-primary hover:bg-primary/20 gap-1 rounded-xl"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PNG</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={activeSlidePreview === renderedSlideUrls.length - 1}
                        onClick={() => setActiveSlidePreview((p) => p + 1)}
                        className="text-xs h-9 px-3 border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                      >
                        Next
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Caption & Hashtags Summary */}
                  <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-2 max-w-[480px] mx-auto">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <span>Generated Caption & DM Trigger</span>
                      </Label>
                      {generatedResult.triggerKeyword && (
                        <span className="text-[10px] text-amber-400 font-extrabold bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                          Trigger: &quot;{generatedResult.triggerKeyword}&quot;
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                      {generatedResult.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Studio Footer Action Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070a12]/95 backdrop-blur-xl shrink-0">
          {!generatedResult ? (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-12 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing {slideCount} Branded Visual Cards with AI...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate {slideCount}-Slide Branded Carousel Deck</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 px-6 rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleApplyToPost}
                className="flex-1 h-12 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] gap-2 cursor-pointer border border-white/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Attach {renderedFiles.length} Branded Visual Cards to Post Composer</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AICarouselModal
