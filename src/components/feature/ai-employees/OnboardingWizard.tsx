'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import {
  Building2, Globe, Search, Database, Wrench, Share2, MapPin,
  ChevronRight, ChevronLeft, Upload, Plus, X, CheckCircle2, Sparkles,
  Zap, ArrowRight, Save, ExternalLink, Image, FileText, Briefcase,
  ShoppingCart, Heart, Home, GraduationCap, Utensils, Car, Palette,
  Scale, Dumbbell, Plane, Camera, Music, Cpu, TrendingUp, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

/* ─── Business Types ─── */
const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant & Food', icon: Utensils, color: 'from-orange-500 to-red-500', desc: 'Restaurants, Cafes, Cloud Kitchens, Food Delivery' },
  { id: 'ecommerce', label: 'E-Commerce & D2C', icon: ShoppingCart, color: 'from-blue-500 to-indigo-500', desc: 'Online Stores, D2C Brands, Marketplace Sellers' },
  { id: 'healthcare', label: 'Healthcare & Wellness', icon: Heart, color: 'from-pink-500 to-rose-500', desc: 'Clinics, Hospitals, Wellness Centers, Pharmacies' },
  { id: 'real_estate', label: 'Real Estate', icon: Home, color: 'from-emerald-500 to-teal-500', desc: 'Builders, Agents, Property Management' },
  { id: 'education', label: 'EdTech & Coaching', icon: GraduationCap, color: 'from-purple-500 to-violet-500', desc: 'Coaching Institutes, Online Courses, Schools' },
  { id: 'agency', label: 'Digital Agency', icon: Palette, color: 'from-cyan-500 to-blue-500', desc: 'Marketing, Design, Development Agencies' },
  { id: 'b2b_saas', label: 'B2B SaaS', icon: Cpu, color: 'from-slate-500 to-zinc-600', desc: 'Software Products, Enterprise Solutions' },
  { id: 'automotive', label: 'Automotive', icon: Car, color: 'from-amber-500 to-orange-500', desc: 'Dealerships, Service Centers, Auto Parts' },
  { id: 'legal', label: 'Legal & Finance', icon: Scale, color: 'from-gray-500 to-slate-600', desc: 'Law Firms, CA, Financial Advisors' },
  { id: 'fitness', label: 'Fitness & Sports', icon: Dumbbell, color: 'from-green-500 to-emerald-500', desc: 'Gyms, Personal Trainers, Sports Academies' },
  { id: 'travel', label: 'Travel & Hospitality', icon: Plane, color: 'from-sky-500 to-blue-500', desc: 'Hotels, Travel Agencies, Tour Operators' },
  { id: 'photography', label: 'Photography & Media', icon: Camera, color: 'from-fuchsia-500 to-pink-500', desc: 'Studios, Photographers, Videographers' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: 'from-violet-500 to-purple-500', desc: 'Events, Music, Art, Gaming' },
  { id: 'consulting', label: 'Consulting & Services', icon: Briefcase, color: 'from-indigo-500 to-blue-600', desc: 'IT, Management, HR Consulting' },
  { id: 'other', label: 'Other Business', icon: TrendingUp, color: 'from-teal-500 to-cyan-500', desc: 'Tell us about your unique business' },
]

/* ─── AI Agent definitions ─── */
const AI_AGENTS = [
  { id: 'website_builder', name: 'AI Website Builder', emoji: '🌐', icon: Globe, color: 'from-blue-500 to-indigo-600', creditCost: 5, desc: 'Business ke liye AI-powered website generate karta hai pre-built templates se. Content, design, sab automatic.' },
  { id: 'seo_agent', name: 'AI SEO Expert', emoji: '🔍', icon: Search, color: 'from-green-500 to-emerald-600', creditCost: 3, desc: 'On-page SEO analysis, keyword research, meta tags, schema markup — sab optimize karta hai automatically.' },
  { id: 'server_agent', name: 'AI Server Manager', emoji: '🖥️', icon: Database, color: 'from-violet-500 to-purple-600', creditCost: 2, desc: 'One-click server provisioning, SSL setup, domain mapping, and speed optimization.' },
  { id: 'maintenance_agent', name: 'AI Maintenance Bot', emoji: '🔧', icon: Wrench, color: 'from-amber-500 to-orange-600', creditCost: 4, desc: 'Monthly website maintenance — content updates, security patches, performance optimization on autopilot.' },
  { id: 'social_agent', name: 'Social Media AI Agent', emoji: '📱', icon: Share2, color: 'from-pink-500 to-rose-600', creditCost: 5, desc: 'Viral posts, competitor research, trending topics, reels, carousel — sab AI se create aur publish.' },
  { id: 'google_business', name: 'Google Business Expert', emoji: '📍', icon: MapPin, color: 'from-red-500 to-orange-600', creditCost: 3, desc: 'Local SEO, Google Profile optimization, local keywords, review management — sab automated.' },
]

const STEPS = [
  { title: 'Business Type', subtitle: 'Select your industry' },
  { title: 'Business Details', subtitle: 'Tell us about your business' },
  { title: 'AI Employees', subtitle: 'Choose your AI team' },
  { title: 'Launch', subtitle: 'Review & activate' },
]

export default function OnboardingWizard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [businessType, setBusinessType] = useState('')
  const [businessDetails, setBusinessDetails] = useState({
    businessName: '', description: '', targetAudience: '', googleBusinessLink: '',
    referenceSites: [''], contactEmail: '', contactPhone: '', address: '', city: '', website: '',
  })
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const totalCredits = selectedAgents.reduce((acc, id) => {
    const agent = AI_AGENTS.find((a) => a.id === id)
    return acc + (agent?.creditCost || 0)
  }, 0)

  const toggleAgent = useCallback((id: string) => {
    setSelectedAgents((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id])
  }, [])

  const addReferenceSite = () => setBusinessDetails((p) => ({ ...p, referenceSites: [...p.referenceSites, ''] }))
  const removeReferenceSite = (i: number) => setBusinessDetails((p) => ({ ...p, referenceSites: p.referenceSites.filter((_, idx) => idx !== i) }))
  const updateReferenceSite = (i: number, val: string) => setBusinessDetails((p) => {
    const sites = [...p.referenceSites]; sites[i] = val; return { ...p, referenceSites: sites }
  })

  const canProceed = () => {
    if (step === 0) return !!businessType
    if (step === 1) return !!businessDetails.businessName && !!businessDetails.description
    if (step === 2) return selectedAgents.length > 0
    return true
  }

  const handleComplete = async () => {
    setIsSaving(true)
    // In production this calls the API; for now navigate to Command Center
    setTimeout(() => {
      setIsSaving(false)
      router.push(ROUTES.AI_EMPLOYEES.DASHBOARD)
    }, 1500)
  }

  const handleSaveDraft = () => {
    // save draft notification
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      {/* ── Progress Bar ── */}
      <div className="flex items-center justify-between mb-8 px-1">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                i < step ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                : i === step ? 'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20'
                : 'bg-white/10 text-white/40 border border-white/10'
              }`}>
                {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-semibold ${i <= step ? 'text-white' : 'text-white/40'}`}>{s.title}</p>
                <p className="text-[10px] text-white/30">{s.subtitle}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-white/10">
                <motion.div className="h-full bg-gradient-to-r from-primary to-indigo-500" initial={{ width: '0%' }} animate={{ width: i < step ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Step Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="flex-1">

          {/* STEP 0 — Business Type */}
          {step === 0 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Apna Business Type Select Karein 🏢</h2>
                <p className="text-white/50 text-sm">Your AI employees will be trained specifically for your industry.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUSINESS_TYPES.map((bt) => {
                  const Icon = bt.icon
                  const selected = businessType === bt.id
                  return (
                    <motion.button key={bt.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setBusinessType(bt.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
                        selected
                          ? 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/20 ring-2 ring-primary/30'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${bt.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <div className="flex items-start gap-4 relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bt.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white text-sm mb-1">{bt.label}</h3>
                          <p className="text-white/40 text-xs leading-relaxed">{bt.desc}</p>
                        </div>
                      </div>
                      {selected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 1 — Business Details */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Business Details Bharen 📝</h2>
                <p className="text-white/50 text-sm">Jitna detail denge, utna better AI output milega.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Business Name *</label>
                    <input type="text" value={businessDetails.businessName} onChange={(e) => setBusinessDetails((p) => ({ ...p, businessName: e.target.value }))} placeholder="e.g. Sharma Dental Clinic" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Business Description *</label>
                    <textarea value={businessDetails.description} onChange={(e) => setBusinessDetails((p) => ({ ...p, description: e.target.value }))} placeholder="What does your business do? Describe your services, products, USP..." rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Target Audience</label>
                    <input type="text" value={businessDetails.targetAudience} onChange={(e) => setBusinessDetails((p) => ({ ...p, targetAudience: e.target.value }))} placeholder="e.g. Young professionals aged 25-40 in metro cities" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 flex items-center gap-2"><MapPin className="w-4 h-4" /> Google Business Profile Link</label>
                    <input type="url" value={businessDetails.googleBusinessLink} onChange={(e) => setBusinessDetails((p) => ({ ...p, googleBusinessLink: e.target.value }))} placeholder="https://g.co/kgs/..." className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Email</label>
                    <input type="email" value={businessDetails.contactEmail} onChange={(e) => setBusinessDetails((p) => ({ ...p, contactEmail: e.target.value }))} placeholder="contact@yourbusiness.com" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Phone</label>
                    <input type="tel" value={businessDetails.contactPhone} onChange={(e) => setBusinessDetails((p) => ({ ...p, contactPhone: e.target.value }))} placeholder="+91 98765 43210" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">City / Location</label>
                    <input type="text" value={businessDetails.city} onChange={(e) => setBusinessDetails((p) => ({ ...p, city: e.target.value }))} placeholder="e.g. Mumbai, Delhi, Bangalore" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>

                  {/* Reference Sites */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Reference / Competitor Websites</label>
                    {businessDetails.referenceSites.map((site, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="url" value={site} onChange={(e) => updateReferenceSite(i, e.target.value)} placeholder="https://competitor-site.com" className="flex-1 h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        {businessDetails.referenceSites.length > 1 && (
                          <button onClick={() => removeReferenceSite(i)} className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={addReferenceSite} className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-1">
                      <Plus className="w-3 h-3" /> Add another reference
                    </button>
                  </div>

                  {/* Upload area */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Upload Media (Logo, Images, Assets)</label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer group">
                      <Upload className="w-8 h-8 text-white/20 mx-auto mb-2 group-hover:text-primary/50 transition-colors" />
                      <p className="text-xs text-white/30">Drag & drop files here or click to browse</p>
                      <p className="text-[10px] text-white/20 mt-1">PNG, JPG, SVG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Select AI Agents */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Apni AI Team Chunein 🤖</h2>
                <p className="text-white/50 text-sm">Select the AI employees you want to activate for your business. Each agent is trained for specific tasks.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AI_AGENTS.map((agent) => {
                  const Icon = agent.icon
                  const selected = selectedAgents.includes(agent.id)
                  return (
                    <motion.button key={agent.id} whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAgent(agent.id)}
                      className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
                        selected
                          ? 'border-primary/60 bg-primary/10 shadow-xl shadow-primary/20 ring-2 ring-primary/30'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 ${selected ? 'opacity-[0.08]' : 'group-hover:opacity-5'} transition-opacity`} />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg text-2xl`}>
                            {agent.emoji}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${selected ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                            {agent.creditCost} Credits
                          </div>
                        </div>
                        <h3 className="font-bold text-white text-base mb-2">{agent.name}</h3>
                        <p className="text-white/40 text-xs leading-relaxed">{agent.desc}</p>
                      </div>
                      {selected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Selected summary */}
              {selectedAgents.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white"><Sparkles className="w-4 h-4 inline mr-2 text-primary" />{selectedAgents.length} AI Employees Selected</p>
                      <p className="text-xs text-white/40 mt-1">These agents will start working on your business immediately after activation.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{totalCredits}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">Credits Required</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* STEP 3 — Review & Launch */}
          {step === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Review & Launch 🚀</h2>
                <p className="text-white/50 text-sm">Everything looks good? Let&apos;s activate your AI team!</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Summary */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Business Profile</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-white/40">Type</span><span className="text-white font-medium">{BUSINESS_TYPES.find((b) => b.id === businessType)?.label || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">Name</span><span className="text-white font-medium">{businessDetails.businessName || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">City</span><span className="text-white font-medium">{businessDetails.city || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">Google Profile</span><span className="text-white font-medium truncate max-w-[200px]">{businessDetails.googleBusinessLink || '—'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-white/40">Reference Sites</span><span className="text-white font-medium">{businessDetails.referenceSites.filter(Boolean).length}</span></div>
                  </div>
                </div>

                {/* Agent Summary */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> AI Team</h3>
                  <div className="space-y-3">
                    {selectedAgents.map((id) => {
                      const agent = AI_AGENTS.find((a) => a.id === id)
                      if (!agent) return null
                      return (
                        <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{agent.emoji}</span>
                            <span className="text-sm text-white font-medium">{agent.name}</span>
                          </div>
                          <span className="text-xs text-primary font-bold">{agent.creditCost} Credits</span>
                        </div>
                      )
                    })}
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-sm font-semibold text-white">Total Credits</span>
                      <span className="text-xl font-bold text-primary">{totalCredits}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Controls ── */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-2 border-white/10 text-white/70 hover:bg-white/5 rounded-xl h-11">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <Button variant="ghost" onClick={handleSaveDraft} className="gap-2 text-white/40 hover:text-white/60 h-11">
            <Save className="w-4 h-4" /> Save Draft
          </Button>
        </div>
        <div>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20 disabled:opacity-40">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isSaving}
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-11 px-8 shadow-lg shadow-green-500/20">
              {isSaving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Activating...</>
              ) : (
                <>Launch AI Team <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
