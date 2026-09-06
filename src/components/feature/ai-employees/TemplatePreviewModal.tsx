'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Monitor, Tablet, Smartphone, CheckCircle2, Zap, Star,
  ExternalLink, Layers, ArrowRight, ShieldCheck, Sparkles,
  Heart, Share2, Eye, Compass, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WebsiteDesignTemplate } from '@/data/websiteTemplatesData'

interface TemplatePreviewModalProps {
  template: WebsiteDesignTemplate | null
  isOpen: boolean
  onClose: () => void
  onSelect: (template: WebsiteDesignTemplate) => void
  userCredits?: number
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onSelect,
  userCredits = 373,
}: TemplatePreviewModalProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [activeTab, setActiveTab] = useState<'preview' | 'specs' | 'pages'>('preview')

  if (!isOpen || !template) return null

  const { previewMockup } = template
  const isDark = previewMockup.bgMode === 'dark' || previewMockup.bgMode === 'midnight'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[950px] rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* ── Top Bar ── */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between gap-4 bg-black/40">
            {/* Template Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${template.thumbnailGradient} flex items-center justify-center text-lg shadow-md shrink-0`}>
                🌐
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white truncate">{template.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold uppercase">
                    {template.category}
                  </span>
                </div>
                <p className="text-[11px] text-white/40 truncate">
                  Style: <span className="text-white/70">{template.styleTheme}</span> • {template.rating} ★ ({template.reviewsCount} reviews)
                </p>
              </div>
            </div>

            {/* Device Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  device === 'desktop' ? 'bg-primary text-white shadow-md' : 'text-white/50 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  device === 'tablet' ? 'bg-primary text-white shadow-md' : 'text-white/50 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" /> Tablet
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  device === 'mobile' ? 'bg-primary text-white shadow-md' : 'text-white/50 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>

            {/* Actions & Close */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {template.creditCost} Credits
              </div>
              <Button
                onClick={() => {
                  onSelect(template)
                  onClose()
                }}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs h-9 px-4 shadow-lg shadow-blue-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" /> Use Template
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Main Preview Area ── */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Center Canvas */}
            <div className="flex-1 bg-neutral-950 p-3 sm:p-6 overflow-y-auto flex flex-col items-center justify-start">
              {/* Responsive Container */}
              <div
                className={`transition-all duration-300 shadow-2xl rounded-2xl border border-white/15 overflow-hidden flex flex-col ${
                  device === 'desktop'
                    ? 'w-full max-w-4xl'
                    : device === 'tablet'
                    ? 'w-[680px] max-w-full'
                    : 'w-[375px] max-w-full'
                }`}
              >
                {/* Mock Browser Header */}
                <div className="h-9 px-4 bg-neutral-800/90 border-b border-white/10 flex items-center justify-between text-xs text-white/40 select-none shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-black/40 border border-white/5 text-[11px] text-white/60 font-mono">
                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                    https://demo.{template.industryId}.siegfriedsites.com
                  </div>
                  <div className="text-[10px] uppercase font-bold text-white/30 tracking-wider">
                    {device}
                  </div>
                </div>

                {/* Rendered Website Mockup */}
                <div className={`p-6 sm:p-8 space-y-8 ${isDark ? 'bg-neutral-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
                  {/* Mock Site Nav */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="font-extrabold text-base tracking-tight flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                        style={{ backgroundColor: previewMockup.accentColor, color: '#fff' }}
                      >
                        ◆
                      </div>
                      <span>{template.name.split('—')[0]?.trim()}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs font-medium opacity-70">
                      <span>Home</span>
                      <span>About</span>
                      <span>Services</span>
                      <span>Reviews</span>
                      <span>Contact</span>
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: previewMockup.accentColor }}
                    >
                      {previewMockup.ctaText.split(' ')[0]} Now
                    </button>
                  </div>

                  {/* Hero Section */}
                  <div className="py-6 sm:py-10 text-center space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-primary border border-primary/20">
                      {template.conversionBadge}
                    </span>
                    <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight max-w-2xl mx-auto">
                      {previewMockup.heroTitle}
                    </h1>
                    <p className="text-xs sm:text-sm max-w-xl mx-auto opacity-70 leading-relaxed">
                      {previewMockup.heroSubtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg flex items-center gap-2"
                        style={{ backgroundColor: previewMockup.accentColor }}
                      >
                        {previewMockup.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/15 border border-white/10">
                        {previewMockup.secondaryCta}
                      </button>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    {previewMockup.stats.map((stat, i) => (
                      <div key={i}>
                        <div className="text-sm sm:text-lg font-black text-primary">{stat.value}</div>
                        <div className="text-[10px] sm:text-xs opacity-60 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature & Service Cards */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider opacity-50">Included Modules</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {previewMockup.services.map((svc, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-1.5"
                        >
                          <div className="text-2xl mb-1">{svc.icon}</div>
                          <h4 className="font-bold text-xs">{svc.title}</h4>
                          <p className="text-[11px] opacity-70 leading-relaxed">{svc.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Testimonial */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs italic opacity-85">"{previewMockup.testimonial.quote}"</p>
                    <div className="text-[11px] font-bold opacity-75">
                      — {previewMockup.testimonial.author},{' '}
                      <span className="font-normal opacity-60">{previewMockup.testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Details Sidebar */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 bg-neutral-900/90 p-5 flex flex-col justify-between overflow-y-auto space-y-5">
              <div className="space-y-5">
                {/* Template Specs */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Template Attributes</h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">Industry</span>
                      <span className="font-semibold text-white capitalize">{template.industryId.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">Credit Cost</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-400" /> {template.creditCost} Credits
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">Rating</span>
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {template.rating} / 5.0
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">Theme Style</span>
                      <span className="font-medium text-white/80">{template.styleTheme}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">Performance</span>
                      <span className="font-semibold text-emerald-400">99/100 Lighthouse</span>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Color Palette</h4>
                  <div className="flex items-center gap-2">
                    {template.colorPalette.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-8 h-8 rounded-lg border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[9px] font-mono text-white/40">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included Pages */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Included Pages</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {template.pagesIncluded.map((pg) => (
                      <span
                        key={pg}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-[11px] font-medium"
                      >
                        📄 {pg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Features & Integrations</h4>
                  <div className="space-y-1.5">
                    {template.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-white/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA in Sidebar */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Button
                  onClick={() => {
                    onSelect(template)
                    onClose()
                  }}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-11 shadow-lg shadow-blue-500/25"
                >
                  <Sparkles className="w-4 h-4" /> Select This Template
                </Button>
                <p className="text-[10px] text-center text-white/40">
                  Deducts {template.creditCost} credits • Ready in 90 seconds with AI
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
