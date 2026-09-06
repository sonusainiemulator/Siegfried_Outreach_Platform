'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import {
  Building2, Globe, Search, Database, Wrench, Share2, MapPin,
  ChevronRight, ChevronLeft, Upload, Plus, X, CheckCircle2, Sparkles,
  Zap, ArrowRight, Save, ExternalLink, Image, FileText, Briefcase,
  ShoppingCart, Heart, Home, GraduationCap, Utensils, Car, Palette,
  Scale, Dumbbell, Plane, Camera, Music, Cpu, TrendingUp, Users,
  Eye, Star, Scissors
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { WEBSITE_TEMPLATES, WebsiteDesignTemplate } from '@/data/websiteTemplatesData'
import TemplatePreviewModal from './TemplatePreviewModal'

/* ─── Business Types ─── */
const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant & Food', icon: Utensils, color: 'from-orange-500 to-red-500', desc: 'Restaurants, Cafes, Cloud Kitchens, Food Delivery' },
  { id: 'ecommerce', label: 'E-Commerce & D2C', icon: ShoppingCart, color: 'from-blue-500 to-indigo-500', desc: 'Online Stores, D2C Brands, Marketplace Sellers' },
  { id: 'healthcare', label: 'Healthcare & Wellness', icon: Heart, color: 'from-pink-500 to-rose-500', desc: 'Clinics, Hospitals, Wellness Centers, Pharmacies' },
  { id: 'real_estate', label: 'Real Estate & Living', icon: Home, color: 'from-emerald-500 to-teal-500', desc: 'Builders, Agents, Property Management, Architecture' },
  { id: 'education', label: 'EdTech & Coaching', icon: GraduationCap, color: 'from-purple-500 to-violet-500', desc: 'Coaching Institutes, Online Courses, STEM Schools' },
  { id: 'agency', label: 'Digital Agency', icon: Palette, color: 'from-cyan-500 to-blue-500', desc: 'Marketing, Design, Development, 3D Studios' },
  { id: 'b2b_saas', label: 'B2B SaaS & Tech', icon: Cpu, color: 'from-slate-500 to-zinc-600', desc: 'Software Products, Cloud Platforms, AI Tools' },
  { id: 'fitness', label: 'Fitness & Sports', icon: Dumbbell, color: 'from-green-500 to-emerald-500', desc: 'Crossfit Gyms, Pilates, Martial Arts' },
  { id: 'legal', label: 'Legal & Finance', icon: Scale, color: 'from-gray-500 to-slate-600', desc: 'Law Firms, Tax Advisors, Venture Capital' },
  { id: 'beauty', label: 'Beauty & Salon', icon: Scissors, color: 'from-fuchsia-500 to-rose-500', desc: 'Hair Ateliers, MedSpas, Men’s Grooming' },
  { id: 'travel', label: 'Travel & Hospitality', icon: Plane, color: 'from-sky-500 to-blue-500', desc: 'Boutique Resorts, Adventure Treks, Chauffeur' },
  { id: 'consulting', label: 'Consulting & Services', icon: Briefcase, color: 'from-indigo-500 to-blue-600', desc: 'IT, Management, Strategy Consulting' },
]

/* ─── AI Agent definitions ─── */
const AI_AGENTS = [
  { id: 'website_builder', name: 'AI Website Builder', emoji: '🌐', icon: Globe, color: 'from-blue-500 to-indigo-600', creditCost: 5, desc: 'Selected template se AI-powered website generate karta hai business data use karke.' },
  { id: 'seo_agent', name: 'AI SEO Expert', emoji: '🔍', icon: Search, color: 'from-green-500 to-emerald-600', creditCost: 3, desc: 'On-page SEO audit, keyword research, meta tags, schema markup automatically optimize karta hai.' },
  { id: 'server_agent', name: 'AI Server Manager', emoji: '🖥️', icon: Database, color: 'from-violet-500 to-purple-600', creditCost: 2, desc: 'One-click server provisioning, SSL certificate, DNS domain mapping, speed caching setup.' },
  { id: 'maintenance_agent', name: 'AI Maintenance Bot', emoji: '🔧', icon: Wrench, color: 'from-amber-500 to-orange-600', creditCost: 4, desc: 'Scheduled maintenance — broken link repair, security patches, auto-rollback protection.' },
  { id: 'social_agent', name: 'Social Media AI Agent', emoji: '📱', icon: Share2, color: 'from-pink-500 to-rose-600', creditCost: 5, desc: 'Viral posts, reels, carousel graphics, scheduling across social channels on autopilot.' },
  { id: 'google_business', name: 'Google Business Expert', emoji: '📍', icon: MapPin, color: 'from-red-500 to-orange-600', creditCost: 3, desc: 'Local SEO, Google Profile audit, review response automation, and weekly Google Posts.' },
]

const STEPS = [
  { title: 'Business Type', subtitle: 'Select your industry' },
  { title: 'Select Template', subtitle: '20-40 readymade designs' },
  { title: 'Business Details', subtitle: 'Tell us about your business' },
  { title: 'AI Employees', subtitle: 'Choose your AI team' },
  { title: 'Launch', subtitle: 'Review & activate' },
]

export default function OnboardingWizard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [businessType, setBusinessType] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteDesignTemplate | null>(null)
  const [previewingTemplate, setPreviewingTemplate] = useState<WebsiteDesignTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [templateSearch, setTemplateSearch] = useState('')
  const [templateFilterIndustry, setTemplateFilterIndustry] = useState<string>('all')

  const [businessDetails, setBusinessDetails] = useState({
    businessName: '',
    description: '',
    targetAudience: '',
    googleBusinessLink: '',
    referenceSites: [''],
    contactEmail: '',
    contactPhone: '',
    city: '',
    website: '',
  })
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['website_builder', 'seo_agent'])
  const [isSaving, setIsSaving] = useState(false)

  // Sync template filter when business type is picked
  const handleSelectBusinessType = (id: string) => {
    setBusinessType(id)
    setTemplateFilterIndustry(id)
    // Pre-select first template for that industry if none selected yet
    const matching = WEBSITE_TEMPLATES.filter((t) => t.industryId === id)
    if (matching.length > 0) {
      setSelectedTemplate(matching[0])
    }
  }

  // Filtered templates for Step 1
  const displayedTemplates = useMemo(() => {
    let list = WEBSITE_TEMPLATES
    if (templateFilterIndustry !== 'all') {
      list = list.filter((t) => t.industryId === templateFilterIndustry)
    }
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.features.some((f) => f.toLowerCase().includes(q))
      )
    }
    return list
  }, [templateFilterIndustry, templateSearch])

  const totalCredits = selectedAgents.reduce((acc, id) => {
    const agent = AI_AGENTS.find((a) => a.id === id)
    return acc + (agent?.creditCost || 0)
  }, 0)

  const toggleAgent = useCallback((id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }, [])

  const addReferenceSite = () =>
    setBusinessDetails((p) => ({ ...p, referenceSites: [...p.referenceSites, ''] }))
  const removeReferenceSite = (i: number) =>
    setBusinessDetails((p) => ({
      ...p,
      referenceSites: p.referenceSites.filter((_, idx) => idx !== i),
    }))
  const updateReferenceSite = (i: number, val: string) =>
    setBusinessDetails((p) => {
      const sites = [...p.referenceSites]
      sites[i] = val
      return { ...p, referenceSites: sites }
    })

  const canProceed = () => {
    if (step === 0) return !!businessType
    if (step === 1) return !!selectedTemplate
    if (step === 2) return !!businessDetails.businessName && !!businessDetails.description
    if (step === 3) return selectedAgents.length > 0
    return true
  }

  const handleComplete = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push(ROUTES.AI_EMPLOYEES.DASHBOARD)
    }, 1500)
  }

  const handleSaveDraft = () => {
    // Save draft state
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* ── Progress Bar & Step Indicators ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 scrollbar-none">
          {STEPS.map((s, i) => {
            const isDone = i < step
            const isCurrent = i === step
            return (
              <div key={i} className="flex items-center gap-3 min-w-max">
                <button
                  onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-2.5 text-left transition-all ${
                    isCurrent
                      ? 'text-white'
                      : isDone
                      ? 'text-primary hover:text-primary/80'
                      : 'text-white/30'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : isCurrent
                        ? 'bg-primary/20 border-2 border-primary text-primary'
                        : 'bg-white/5 border border-white/10 text-white/40'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">{s.title}</p>
                    <p className="text-[10px] text-white/40 leading-tight">{s.subtitle}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="w-8 sm:w-12 h-0.5 rounded-full bg-white/10 mx-1">
                    <div
                      className={`h-full bg-primary transition-all duration-300 ${
                        i < step ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {/* STEP 0 — Business Type */}
          {step === 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                  Select Your Business Industry 🏢
                </h2>
                <p className="text-white/50 text-sm">
                  We will curate 20–40 readymade website design templates tailored directly to your industry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUSINESS_TYPES.map((bt) => {
                  const Icon = bt.icon
                  const selected = businessType === bt.id
                  return (
                    <motion.button
                      key={bt.id}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelectBusinessType(bt.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-200 group overflow-hidden ${
                        selected
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/15 ring-2 ring-primary/30'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 relative z-10">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${bt.color} flex items-center justify-center shadow-lg shrink-0`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-sm mb-1">{bt.label}</h3>
                          <p className="text-white/40 text-xs leading-relaxed">{bt.desc}</p>
                        </div>
                      </div>
                      {selected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 1 — Choose Website Design Template (20-40 Readymade Templates) */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                    Choose Your Website Template 🎨
                  </h2>
                  <p className="text-white/50 text-xs sm:text-sm">
                    Select from <span className="text-white font-semibold">36+ readymade website designs</span>. AI will populate it with your business content.
                  </p>
                </div>
                {selectedTemplate && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Selected: <span className="text-white font-bold">{selectedTemplate.name.split('—')[0]}</span>
                  </div>
                )}
              </div>

              {/* Industry Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setTemplateFilterIndustry('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      templateFilterIndustry === 'all'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                    }`}
                  >
                    All ({WEBSITE_TEMPLATES.length})
                  </button>
                  {BUSINESS_TYPES.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => setTemplateFilterIndustry(bt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        templateFilterIndustry === bt.id
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                      }`}
                    >
                      {bt.label.split('&')[0]}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[58vh] overflow-y-auto pr-1">
                {displayedTemplates.map((template) => {
                  const isSelected = selectedTemplate?.id === template.id

                  return (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`group relative rounded-2xl bg-white/[0.04] border overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/40 bg-primary/[0.06] shadow-lg shadow-primary/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      {/* Banner */}
                      <div
                        className={`h-36 bg-gradient-to-br ${template.thumbnailGradient} p-3 flex flex-col justify-between relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Top Badges */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
                            {template.conversionBadge}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-amber-300 text-xs font-bold flex items-center gap-1 border border-white/10">
                            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" /> {template.creditCost}
                          </span>
                        </div>

                        {/* Hover Preview Button */}
                        <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewingTemplate(template)
                              setIsPreviewOpen(true)
                            }}
                            className="gap-1.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-xl text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> Interactive Preview
                          </Button>
                        </div>

                        {/* Category tag */}
                        <div className="relative z-10">
                          <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                            {template.category}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <h4 className="font-bold text-white text-sm truncate">{template.name}</h4>
                          <div className="flex items-center gap-1 text-amber-400 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span className="font-bold text-white/80 text-[11px]">{template.rating}</span>
                          </div>
                        </div>

                        <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {template.colorPalette.map((c, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full border border-white/20"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? 'text-emerald-400' : 'text-primary'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Choose Template'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Business Details */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                  Enter Business Information 📝
                </h2>
                <p className="text-white/50 text-xs sm:text-sm">
                  Our AI agents will use these details to write copy and optimize your website.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Business Name *</label>
                    <input
                      type="text"
                      value={businessDetails.businessName}
                      onChange={(e) =>
                        setBusinessDetails((p) => ({ ...p, businessName: e.target.value }))
                      }
                      placeholder="e.g. Saffron Bistro or Apex Dental"
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Business Description *</label>
                    <textarea
                      value={businessDetails.description}
                      onChange={(e) =>
                        setBusinessDetails((p) => ({ ...p, description: e.target.value }))
                      }
                      placeholder="Describe your core services, unique selling points, and target audience..."
                      rows={4}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-xs focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Target Audience</label>
                    <input
                      type="text"
                      value={businessDetails.targetAudience}
                      onChange={(e) =>
                        setBusinessDetails((p) => ({ ...p, targetAudience: e.target.value }))
                      }
                      placeholder="e.g. Young professionals, families, local residents"
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Google Business Profile Link
                    </label>
                    <input
                      type="url"
                      value={businessDetails.googleBusinessLink}
                      onChange={(e) =>
                        setBusinessDetails((p) => ({ ...p, googleBusinessLink: e.target.value }))
                      }
                      placeholder="https://g.co/kgs/..."
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Contact Email</label>
                    <input
                      type="email"
                      value={businessDetails.contactEmail}
                      onChange={(e) =>
                        setBusinessDetails((p) => ({ ...p, contactEmail: e.target.value }))
                      }
                      placeholder="contact@business.com"
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">City / Region</label>
                    <input
                      type="text"
                      value={businessDetails.city}
                      onChange={(e) =>
                        setBusinessDetails((p) => ({ ...p, city: e.target.value }))
                      }
                      placeholder="e.g. Mumbai, New York, London"
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Reference Sites */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Competitor / Reference Sites
                    </label>
                    {businessDetails.referenceSites.map((site, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="url"
                          value={site}
                          onChange={(e) => updateReferenceSite(i, e.target.value)}
                          placeholder="https://competitor.com"
                          className="flex-1 h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:border-primary focus:outline-none"
                        />
                        {businessDetails.referenceSites.length > 1 && (
                          <button
                            onClick={() => removeReferenceSite(i)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addReferenceSite}
                      className="text-xs text-primary hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" /> Add another reference site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Select AI Agents */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                  Activate Your AI Employee Team 🤖
                </h2>
                <p className="text-white/50 text-xs sm:text-sm">
                  Select which autonomous AI agents should manage your website and marketing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AI_AGENTS.map((agent) => {
                  const selected = selectedAgents.includes(agent.id)
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        selected
                          ? 'border-primary/60 bg-primary/10 shadow-lg ring-2 ring-primary/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-md`}
                        >
                          {agent.emoji}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold">
                          {agent.creditCost} Credits
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{agent.name}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{agent.desc}</p>
                      {selected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — Review & Launch */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                  Review & Launch Ecosystem 🚀
                </h2>
                <p className="text-white/50 text-xs sm:text-sm">
                  Confirm your template and selected AI team before activation.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Template Summary */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    1. Website Template
                  </span>
                  {selectedTemplate && (
                    <div className="space-y-3">
                      <div
                        className={`h-24 rounded-xl bg-gradient-to-br ${selectedTemplate.thumbnailGradient} p-3 flex items-end justify-between`}
                      >
                        <span className="text-xs font-bold text-white shadow-sm">
                          {selectedTemplate.conversionBadge}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/60 text-amber-300 text-xs font-bold">
                          {selectedTemplate.creditCost} Credits
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{selectedTemplate.name}</h4>
                      <p className="text-[11px] text-white/40">{selectedTemplate.styleTheme}</p>
                    </div>
                  )}
                </div>

                {/* Business Info Summary */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    2. Business Profile
                  </span>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between">
                      <span className="text-white/40">Name:</span>
                      <span className="font-semibold text-white">{businessDetails.businessName || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Industry:</span>
                      <span className="font-semibold text-white capitalize">{businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">City:</span>
                      <span className="font-semibold text-white">{businessDetails.city || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Google Profile:</span>
                      <span className="font-semibold text-white truncate max-w-[120px]">
                        {businessDetails.googleBusinessLink ? 'Connected' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Team & Credits */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      3. AI Team Activated
                    </span>
                    <span className="font-bold text-amber-400">{totalCredits} Credits</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {selectedAgents.map((id) => {
                      const a = AI_AGENTS.find((agent) => agent.id === id)
                      return (
                        <div key={id} className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-white/70">
                            {a?.emoji} {a?.name}
                          </span>
                          <span className="font-semibold text-white/50">{a?.creditCost}c</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Controls ── */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="gap-2 border-white/10 text-white/70 hover:text-white rounded-xl h-10 text-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            className="text-white/40 hover:text-white text-xs h-10"
          >
            Save Draft
          </Button>
        </div>

        <div>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white rounded-xl h-10 px-6 text-xs font-semibold shadow-lg shadow-primary/20 disabled:opacity-40"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isSaving}
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-10 px-8 text-xs font-bold shadow-lg shadow-green-500/20"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deploying Ecosystem...
                </>
              ) : (
                <>
                  Launch AI Team & Generate Website <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* ── Template Preview Modal ── */}
      <TemplatePreviewModal
        template={previewingTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelect={(t) => {
          setSelectedTemplate(t)
          setIsPreviewOpen(false)
        }}
      />
    </div>
  )
}
