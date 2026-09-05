'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Globe, Search, Eye, Zap, CreditCard, ArrowRight, CheckCircle2,
  Sparkles, Star, Filter, Grid3X3, LayoutGrid, ChevronRight,
  Loader2, Save, ExternalLink, Layers, FileText, Image
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

/* ─── Mock Templates ─── */
const TEMPLATES = [
  { id: '1', name: 'Modern Dental Clinic', businessType: 'healthcare', category: 'Medical', description: 'Clean, professional dental clinic website with appointment booking', creditCost: 5, rating: 4.8, popularity: 234, isNew: true, isPremium: false, features: ['Appointment Booking', 'Service Showcase', 'Doctor Profiles', 'Patient Reviews'], thumbnailGradient: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Premium E-Commerce Store', businessType: 'ecommerce', category: 'Shopping', description: 'Full-featured online store with cart, checkout, and product catalog', creditCost: 8, rating: 4.9, popularity: 567, isNew: false, isPremium: true, features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Tracking'], thumbnailGradient: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Restaurant & Cafe', businessType: 'restaurant', category: 'Food', description: 'Elegant restaurant website with online menu and table reservations', creditCost: 5, rating: 4.7, popularity: 189, isNew: false, isPremium: false, features: ['Digital Menu', 'Table Reservation', 'Gallery', 'Location Map'], thumbnailGradient: 'from-orange-500 to-red-500' },
  { id: '4', name: 'Real Estate Listings', businessType: 'real_estate', category: 'Property', description: 'Property listing website with search, filters, and agent profiles', creditCost: 7, rating: 4.6, popularity: 145, isNew: true, isPremium: true, features: ['Property Search', 'Virtual Tours', 'Agent Profiles', 'Mortgage Calculator'], thumbnailGradient: 'from-emerald-500 to-teal-500' },
  { id: '5', name: 'Fitness & Gym Portal', businessType: 'fitness', category: 'Health', description: 'Dynamic fitness center website with class schedules and membership', creditCost: 5, rating: 4.5, popularity: 122, isNew: false, isPremium: false, features: ['Class Schedule', 'Trainer Profiles', 'Membership Plans', 'Progress Tracking'], thumbnailGradient: 'from-green-500 to-lime-500' },
  { id: '6', name: 'Education Platform', businessType: 'education', category: 'Learning', description: 'Online learning platform with course listings and student portal', creditCost: 6, rating: 4.8, popularity: 301, isNew: true, isPremium: false, features: ['Course Catalog', 'Video Lessons', 'Student Dashboard', 'Certificates'], thumbnailGradient: 'from-indigo-500 to-violet-500' },
  { id: '7', name: 'Agency Portfolio', businessType: 'agency', category: 'Creative', description: 'Stunning portfolio website for digital agencies and freelancers', creditCost: 5, rating: 4.9, popularity: 412, isNew: false, isPremium: false, features: ['Project Showcase', 'Team Section', 'Client Testimonials', 'Contact Form'], thumbnailGradient: 'from-cyan-500 to-blue-500' },
  { id: '8', name: 'Travel Booking Hub', businessType: 'travel', category: 'Travel', description: 'Travel agency website with tour packages and booking system', creditCost: 7, rating: 4.7, popularity: 178, isNew: false, isPremium: true, features: ['Tour Packages', 'Booking System', 'Photo Gallery', 'Traveler Reviews'], thumbnailGradient: 'from-sky-500 to-indigo-500' },
  { id: '9', name: 'SaaS Landing Page', businessType: 'b2b_saas', category: 'Technology', description: 'High-converting SaaS product landing page with pricing tables', creditCost: 6, rating: 4.8, popularity: 389, isNew: true, isPremium: false, features: ['Hero Section', 'Feature Grid', 'Pricing Table', 'FAQ Section'], thumbnailGradient: 'from-slate-500 to-zinc-600' },
]

type ViewMode = 'grid' | 'list'

export default function WebsiteBuilderAgent() {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState('')

  const categories = ['all', ...new Set(TEMPLATES.map((t) => t.category))]
  const filteredTemplates = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter)

  const handleGenerate = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    const steps = [
      'Analyzing business profile...',
      'Fetching Google Business data...',
      'Studying reference websites...',
      'Selecting design components...',
      'Generating content with AI...',
      'Building page sections...',
      'Optimizing for mobile...',
      'Final touches...',
    ]
    let i = 0
    const interval = setInterval(() => {
      setGenerationProgress((p) => Math.min(p + 12.5, 100))
      setGenerationStep(steps[i] || 'Finalizing...')
      i++
      if (i >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsGenerating(false)
          setGenerationProgress(100)
        }, 1000)
      }
    }, 1500)
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-xl">🌐</div>
            AI Website Builder
          </h1>
          <p className="text-white/40 text-sm mt-2">Choose a template, AI will build your website using your business data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white font-medium">373 Credits</span>
          </div>
        </div>
      </div>

      {/* ── Generation Overlay ── */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30 text-3xl">
                🌐
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Building Your Website</h2>
              <p className="text-white/40 text-sm mb-6">{generationStep}</p>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-4">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" animate={{ width: `${generationProgress}%` }} transition={{ duration: 0.5 }} />
              </div>
              <p className="text-sm font-semibold text-white">{Math.round(generationProgress)}%</p>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {['📊', '📝', '🎨', '🖼️', '📱', '🔍', '⚡', '✨'].map((e, i) => (
                  <motion.div key={i} animate={{ opacity: generationProgress > i * 12.5 ? 1 : 0.2, scale: generationProgress > i * 12.5 ? 1 : 0.8 }}
                    className="h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">{e}</motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filters ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === cat ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60'
              }`}>
              {cat === 'all' ? 'All Templates' : cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Template Grid ── */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredTemplates.map((template, i) => (
          <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`relative rounded-2xl bg-white/5 border overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedTemplate === template.id ? 'border-primary/60 ring-2 ring-primary/30 shadow-lg shadow-primary/10' : 'border-white/10 hover:border-white/20'
            }`}
            onClick={() => setSelectedTemplate(template.id)}>

            {/* Thumbnail */}
            <div className={`h-40 bg-gradient-to-br ${template.thumbnailGradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-24 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white/80" />
                </div>
              </div>
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {template.isNew && <span className="px-2 py-0.5 rounded-full bg-green-500/90 text-white text-[10px] font-bold">NEW</span>}
                {template.isPremium && <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-bold flex items-center gap-1"><Star className="w-2.5 h-2.5" /> PREMIUM</span>}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> {template.creditCost}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button size="sm" className="gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-xl">
                  <Eye className="w-4 h-4" /> Preview
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-primary font-medium uppercase tracking-wider">{template.category}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-white/60">{template.rating}</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{template.name}</h3>
              <p className="text-white/40 text-xs mb-3 leading-relaxed">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {template.features.slice(0, 3).map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[10px]">{f}</span>
                ))}
                {template.features.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[10px]">+{template.features.length - 3}</span>
                )}
              </div>
            </div>

            {selectedTemplate === template.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-3 right-3 z-10">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Bottom Action Bar ── */}
      {selectedTemplate && (
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-primary/30 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg">🌐</div>
            <div>
              <p className="text-sm font-semibold text-white">{TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</p>
              <p className="text-xs text-white/40">Ready to generate • {TEMPLATES.find((t) => t.id === selectedTemplate)?.creditCost} credits will be deducted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => {}} className="gap-2 border-white/10 text-white/70 rounded-xl h-10">
              <Save className="w-4 h-4" /> Save Draft
            </Button>
            <Button onClick={handleGenerate}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl h-10 px-6 shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4" /> Generate Website <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
