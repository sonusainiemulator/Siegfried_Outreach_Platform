'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Globe, Search, Eye, Zap, CreditCard, ArrowRight, CheckCircle2,
  Sparkles, Star, Filter, Grid3X3, LayoutGrid, ChevronRight,
  Loader2, Save, ExternalLink, Layers, FileText, Image, SlidersHorizontal,
  RefreshCw, Utensils, ShoppingCart, Heart, Home, GraduationCap, Palette,
  Cpu, Dumbbell, Scale, Scissors, Plane, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { WEBSITE_TEMPLATES, WebsiteDesignTemplate } from '@/data/websiteTemplatesData'
import TemplatePreviewModal from './TemplatePreviewModal'

const INDUSTRY_FILTERS = [
  { id: 'all', label: 'All Industries', icon: Globe, count: 36 },
  { id: 'restaurant', label: 'Restaurant & Food', icon: Utensils, count: 4 },
  { id: 'ecommerce', label: 'E-Commerce & D2C', icon: ShoppingCart, count: 4 },
  { id: 'healthcare', label: 'Healthcare & Clinics', icon: Heart, count: 4 },
  { id: 'real_estate', label: 'Real Estate & Living', icon: Home, count: 4 },
  { id: 'education', label: 'EdTech & Coaching', icon: GraduationCap, count: 4 },
  { id: 'agency', label: 'Digital Agency', icon: Palette, count: 4 },
  { id: 'b2b_saas', label: 'B2B SaaS & Tech', icon: Cpu, count: 4 },
  { id: 'fitness', label: 'Fitness & Sports', icon: Dumbbell, count: 3 },
  { id: 'legal', label: 'Legal & Finance', icon: Scale, count: 3 },
  { id: 'beauty', label: 'Beauty & Salon', icon: Scissors, count: 3 },
  { id: 'travel', label: 'Travel & Hotels', icon: Plane, count: 3 },
]

const STYLE_THEMES = [
  'All Styles',
  'Dark Luxury',
  'Minimalist',
  'Cyber & Tech',
  'Warm Earthy',
  'Clean Corporate',
  'Pastel & Clean'
]

type ViewMode = 'grid' | 'list'
type SortMode = 'popular' | 'rating' | 'cost' | 'newest'

export default function WebsiteBuilderAgent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialIndustry = searchParams?.get('industry') || 'all'
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustry)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('All Styles')
  const [sortBy, setSortBy] = useState<SortMode>('popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteDesignTemplate | null>(null)
  const [previewingTemplate, setPreviewingTemplate] = useState<WebsiteDesignTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState('')
  const [generationComplete, setGenerationComplete] = useState(false)

  // Sync industry if changed from query param
  useEffect(() => {
    if (initialIndustry && initialIndustry !== 'all') {
      setSelectedIndustry(initialIndustry)
    }
  }, [initialIndustry])

  // Filtered and sorted templates
  const filteredTemplates = useMemo(() => {
    let list = WEBSITE_TEMPLATES

    // Industry Filter
    if (selectedIndustry !== 'all') {
      list = list.filter((t) => t.industryId === selectedIndustry)
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.features.some((f) => f.toLowerCase().includes(q)) ||
          t.styleTheme.toLowerCase().includes(q)
      )
    }

    // Style Theme Filter
    if (selectedStyle !== 'All Styles') {
      list = list.filter((t) => t.styleTheme.toLowerCase().includes(selectedStyle.toLowerCase()))
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'cost') return a.creditCost - b.creditCost
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      return 0
    })
  }, [selectedIndustry, searchQuery, selectedStyle, sortBy])

  const openPreview = (tmpl: WebsiteDesignTemplate) => {
    setPreviewingTemplate(tmpl)
    setIsPreviewOpen(true)
  }

  const handleSelectFromPreview = (tmpl: WebsiteDesignTemplate) => {
    setSelectedTemplate(tmpl)
    setIsPreviewOpen(false)
  }

  const handleGenerate = () => {
    if (!selectedTemplate) return
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationComplete(false)

    const steps = [
      'Analyzing business brand identity...',
      'Ingesting Google Business profile details...',
      'Scraping reference competitors & media assets...',
      'Loading component layout: ' + selectedTemplate.name + '...',
      'Generating high-converting SEO copy with AI...',
      'Injecting Schema.org & OpenGraph metadata...',
      'Rendering responsive layouts for Desktop & Mobile...',
      'Optimizing performance & image compression...',
      'Finalizing website bundle...',
    ]

    let i = 0
    const interval = setInterval(() => {
      setGenerationProgress((p) => {
        const next = p + 11.2
        if (next >= 100) return 100
        return next
      })
      setGenerationStep(steps[i] || 'Finalizing deployment...')
      i++
      if (i >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setGenerationProgress(100)
          setGenerationComplete(true)
        }, 800)
      }
    }, 1300)
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-2xl">
              🌐
            </div>
            AI Website Builder — Template Gallery
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Choose from <span className="text-white font-semibold">36+ readymade high-converting website designs</span>. AI builds your full site with real content in 90 seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm text-white font-semibold">373 Credits Available</span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.AI_EMPLOYEES.ONBOARDING)}
            className="border-white/10 text-white/70 hover:text-white rounded-xl text-xs gap-1.5 h-10"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start Onboarding
          </Button>
        </div>
      </div>

      {/* ── Industry Selector Bar (Horizontally Scrollable) ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40">Select Industry / Category</span>
          <span className="text-xs text-primary font-medium">
            Showing {filteredTemplates.length} of {WEBSITE_TEMPLATES.length} Designs
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INDUSTRY_FILTERS.map((ind) => {
            const Icon = ind.icon
            const isSelected = selectedIndustry === ind.id
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ind.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  {ind.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Search, Style Filter, Sort & View Mode Bar ── */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search templates by style, features, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Style Themes & Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Style Pills */}
          <div className="hidden lg:flex items-center gap-1.5">
            {STYLE_THEMES.slice(0, 4).map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  selectedStyle === style
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-white/50 pl-2 border-l border-white/10">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMode)}
              className="bg-black/40 border border-white/10 text-white rounded-lg px-2 py-1 text-xs focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="cost">Lowest Credits</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
              }`}
              title="List View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Generation Overlay ── */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/15 text-center shadow-2xl space-y-6"
            >
              {!generationComplete ? (
                <>
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 text-3xl animate-pulse">
                      🌐
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs text-black font-bold shadow-md">
                      ⚡
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Generating {selectedTemplate?.name.split('—')[0]}
                    </h2>
                    <p className="text-white/40 text-xs">{generationStep}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                        animate={{ width: `${generationProgress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/50 font-mono">
                      <span>AI Builder Agent</span>
                      <span className="font-bold text-white">{Math.round(generationProgress)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {['📊 Structure', '📝 AI Copy', '🎨 Palette', '⚡ Schema', '📱 Responsive', '🔍 On-Page SEO', '🔒 SSL Security', '✨ Launch'].map(
                      (tag, i) => (
                        <div
                          key={i}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border transition-all ${
                            generationProgress > (i + 1) * 11
                              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                              : 'bg-white/5 border-white/5 text-white/20'
                          }`}
                        >
                          {tag}
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-5 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Website Generated Successfully!</h2>
                    <p className="text-white/50 text-xs mt-1">
                      Template <span className="text-white font-medium">{selectedTemplate?.name}</span> is live and ready for AI SEO optimization.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-white/40">Credits Deducted:</span>
                      <span className="font-bold text-amber-400">-{selectedTemplate?.creditCost} Credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Next Recommended Action:</span>
                      <span className="font-semibold text-emerald-400">Run AI SEO Agent Audit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsGenerating(false)}
                      className="flex-1 border-white/10 text-white rounded-xl text-xs h-10"
                    >
                      Back to Gallery
                    </Button>
                    <Button
                      onClick={() => {
                        setIsGenerating(false)
                        router.push(ROUTES.AI_EMPLOYEES.SEO_AGENT)
                      }}
                      className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs h-10 shadow-lg shadow-green-500/20"
                    >
                      Pass to AI SEO Agent <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty State ── */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-white">No Templates Found</h3>
          <p className="text-white/40 text-xs max-w-sm mx-auto">
            No website designs matched your current search filters. Try clearing your query or switching industry.
          </p>
          <Button
            onClick={() => {
              setSelectedIndustry('all')
              setSearchQuery('')
              setSelectedStyle('All Styles')
            }}
            className="rounded-xl text-xs bg-white/10 hover:bg-white/15 text-white"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* ── Templates Grid / List ── */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {filteredTemplates.map((template, idx) => {
          const isSelected = selectedTemplate?.id === template.id

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.3) }}
              className={`group relative rounded-3xl bg-white/[0.03] border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/40 bg-primary/[0.04] shadow-xl shadow-primary/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl'
              }`}
            >
              {/* Card Header & Preview Banner */}
              <div
                className={`relative h-44 bg-gradient-to-br ${template.thumbnailGradient} p-4 flex flex-col justify-between overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

                {/* Website Window Simulation in Thumbnail */}
                <div className="absolute inset-x-8 top-10 bottom-0 rounded-t-xl bg-black/40 border-t border-x border-white/20 backdrop-blur-sm shadow-2xl p-3 flex flex-col space-y-2 opacity-90 group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-1 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="h-2 w-3/4 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <div className="h-6 rounded bg-white/15" />
                    <div className="h-6 rounded bg-white/15" />
                    <div className="h-6 rounded bg-white/15" />
                  </div>
                </div>

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {template.isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold shadow-sm">
                        NEW 2026
                      </span>
                    )}
                    {template.isPremium && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-white" /> PRO
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1 border border-white/10 shadow-sm">
                    <Zap className="w-3 h-3 fill-amber-400 text-amber-400" /> {template.creditCost} Credits
                  </div>
                </div>

                {/* Hover Preview Overlay */}
                <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      openPreview(template)
                    }}
                    className="gap-1.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-xl text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" /> Interactive Preview
                  </Button>
                </div>

                {/* Bottom Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-[10px] font-medium">
                    {template.conversionBadge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold text-white/80">{template.rating}</span>
                      <span className="text-[11px] text-white/40">({template.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                {/* Features & Color Palette */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {template.features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-white/50 text-[10px]"
                      >
                        {f}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px]">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Color Palette Preview */}
                  <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                    <span>Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {template.colorPalette.map((c, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openPreview(template)}
                    className="flex-1 border-white/10 text-white/70 hover:text-white rounded-xl text-xs h-9 gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </Button>
                  <Button
                    onClick={() => setSelectedTemplate(template)}
                    className={`flex-1 rounded-xl text-xs h-9 font-semibold gap-1 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </>
                    ) : (
                      <>Choose</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Bottom Sticky Action Bar when Template Selected ── */}
      {selectedTemplate && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-4 z-30 p-4 sm:p-5 rounded-2xl bg-neutral-900/95 border border-primary/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedTemplate.thumbnailGradient} flex items-center justify-center text-xl shadow-lg shrink-0`}>
              🌐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-bold uppercase tracking-wider">Template Selected</span>
                <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {selectedTemplate.creditCost} Credits
                </span>
              </div>
              <h4 className="font-bold text-white text-sm truncate max-w-md">{selectedTemplate.name}</h4>
              <p className="text-[11px] text-white/40">
                Includes {selectedTemplate.pagesIncluded.length} pages • {selectedTemplate.styleTheme}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => openPreview(selectedTemplate)}
              className="flex-1 sm:flex-initial gap-1.5 border-white/10 text-white/70 hover:text-white rounded-xl h-10 text-xs"
            >
              <Eye className="w-4 h-4" /> Live Preview
            </Button>
            <Button
              onClick={handleGenerate}
              className="flex-1 sm:flex-initial gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-10 px-6 shadow-xl shadow-blue-500/25 text-xs"
            >
              <Sparkles className="w-4 h-4" /> Generate With AI ({selectedTemplate.creditCost} Credits)
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── Device Preview Modal ── */}
      <TemplatePreviewModal
        template={previewingTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelect={handleSelectFromPreview}
      />
    </div>
  )
}
