'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Building2,
  Palette,
  Target,
  ShoppingBag,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  Cloud,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  TrendingUp,
  Zap,
  HelpCircle,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import {
  useSaveBusinessProfileMutation,
  useSaveBusinessProductsMutation,
  useGetBusinessProfileQuery,
  useGetBusinessProductsQuery,
} from '@/redux/api/aiSocialApi'
import { useRouter } from 'next/navigation'

const DRAFT_STORAGE_KEY = 'ai_social_business_brain_draft'

const STEPS = [
  { title: 'Business Profile', desc: 'Basic info & contact', icon: Building2, maxScore: 35 },
  { title: 'Brand Identity', desc: 'Tone, voice & visual palette', icon: Palette, maxScore: 25 },
  { title: 'Goals & Audience', desc: 'Targeting & expectations', icon: Target, maxScore: 20 },
  { title: 'Products & Offers', desc: 'Services for AI generation', icon: ShoppingBag, maxScore: 20 },
]

const TONES = ['Professional', 'Friendly', 'Witty', 'Inspirational', 'Authoritative', 'Casual']
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Spanish', 'French']

interface ProductItem {
  _id?: string
  name: string
  description: string
  price: string
  isOffer: boolean
}

interface ProfileState {
  name: string
  category: string
  website: string
  location: string
  serviceArea: string
  contactPhone: string
  contactEmail: string
  description: string
  usp: string
  brandTone: string
  preferredLanguage: string
  brandColors: string[]
  monthlyMarketingGoal: string
  salesGoal: string
  targetAudience: string
  autoPublish: boolean
}

const DEFAULT_PROFILE: ProfileState = {
  name: '',
  category: '',
  website: '',
  location: '',
  serviceArea: '',
  contactPhone: '',
  contactEmail: '',
  description: '',
  usp: '',
  brandTone: 'Professional',
  preferredLanguage: 'English',
  brandColors: ['#3b82f6'],
  monthlyMarketingGoal: '',
  salesGoal: '',
  targetAudience: '',
  autoPublish: false,
}

const DEFAULT_PRODUCTS: ProductItem[] = [
  { name: '', description: '', price: '', isOffer: false },
]

export default function BusinessSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE)
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS)

  // Draft Management States
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null)
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false)
  const [draftDataToRestore, setDraftDataToRestore] = useState<{ profile: ProfileState; products: ProductItem[]; step: number; savedAt: string } | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const isInitialMount = useRef(true)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [showScoreDetails, setShowScoreDetails] = useState(false)

  // API Queries
  const { data: existingProfileData, isLoading: loadingProfile } = useGetBusinessProfileQuery(undefined)
  const { data: existingProductsData } = useGetBusinessProductsQuery(businessId as string, { skip: !businessId })

  const [saveProfile, { isLoading: savingProfile }] = useSaveBusinessProfileMutation()
  const [saveProducts, { isLoading: savingProducts }] = useSaveBusinessProductsMutation()

  // 1. Load Profile from Server
  useEffect(() => {
    if (existingProfileData?.data) {
      const b = existingProfileData.data
      setBusinessId(b._id)
      setProfile((prev) => ({
        ...prev,
        name: b.name || '',
        category: b.category || '',
        website: b.website || '',
        location: b.location || '',
        serviceArea: b.serviceArea || '',
        contactPhone: b.contactPhone || '',
        contactEmail: b.contactEmail || '',
        description: b.description || '',
        usp: b.usp || '',
        brandTone: b.brandTone || 'Professional',
        preferredLanguage: b.preferredLanguage || 'English',
        brandColors: b.brandColors?.length ? b.brandColors : ['#3b82f6'],
        monthlyMarketingGoal: b.monthlyMarketingGoal || '',
        salesGoal: b.salesGoal || '',
        targetAudience: b.targetAudience || '',
        autoPublish: b.autoPublish || false,
      }))
    }
  }, [existingProfileData])

  // 2. Load Products from Server
  useEffect(() => {
    if (existingProductsData?.data && Array.isArray(existingProductsData.data) && existingProductsData.data.length > 0) {
      setProducts(
        existingProductsData.data.map((p: any) => ({
          _id: p._id,
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          isOffer: !!p.isOffer,
        }))
      )
    }
  }, [existingProductsData])

  // 3. Check for Saved Local Draft on Mount
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw)
        if (parsed && parsed.profile && (parsed.profile.name || parsed.profile.category || parsed.profile.usp)) {
          setDraftDataToRestore(parsed)
          setHasUnsavedDraft(true)
          if (parsed.savedAt) {
            setDraftSavedAt(parsed.savedAt)
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // 4. Score Calculation Engine
  const scoreInfo = useMemo(() => {
    let step0 = 0
    let step1 = 0
    let step2 = 0
    let step3 = 0

    const checklist: Array<{
      id: string
      label: string
      stepIndex: number
      points: number
      completed: boolean
      tip: string
    }> = []

    // Step 1: Business Profile (Max 35)
    const hasName = Boolean(profile.name && profile.name.trim().length > 0)
    if (hasName) step0 += 10
    checklist.push({
      id: 'name',
      label: 'Business Name',
      stepIndex: 0,
      points: 10,
      completed: hasName,
      tip: 'Required for brand identification and social headers',
    })

    const hasCategory = Boolean(profile.category && profile.category.trim().length > 0)
    if (hasCategory) step0 += 8
    checklist.push({
      id: 'category',
      label: 'Industry / Category',
      stepIndex: 0,
      points: 8,
      completed: hasCategory,
      tip: 'Helps AI understand your industry benchmarks and niche',
    })

    const hasContact = Boolean(profile.contactPhone?.trim() || profile.contactEmail?.trim())
    if (hasContact) step0 += 6
    checklist.push({
      id: 'contact',
      label: 'Phone or Email Contact',
      stepIndex: 0,
      points: 6,
      completed: hasContact,
      tip: 'Included in AI call-to-actions and contact cards',
    })

    const hasLocation = Boolean(profile.location?.trim() || profile.serviceArea?.trim())
    if (hasLocation) step0 += 5
    checklist.push({
      id: 'location',
      label: 'Location / Service Areas',
      stepIndex: 0,
      points: 5,
      completed: hasLocation,
      tip: 'Critical for local SEO hashtags and city-based targeting',
    })

    const hasDescription = Boolean(profile.description && profile.description.trim().length >= 20)
    if (hasDescription) step0 += 6
    checklist.push({
      id: 'description',
      label: 'Business About & Value Story',
      stepIndex: 0,
      points: 6,
      completed: hasDescription,
      tip: 'Gives AI background depth for long-form captions and articles',
    })

    // Step 2: Brand Identity (Max 25)
    const hasUsp = Boolean(profile.usp && profile.usp.trim().length >= 8)
    if (hasUsp) step1 += 12
    checklist.push({
      id: 'usp',
      label: 'Unique Selling Proposition (USP)',
      stepIndex: 1,
      points: 12,
      completed: hasUsp,
      tip: 'Your key differentiator highlighted in promotional hooks',
    })

    const hasTone = Boolean(profile.brandTone)
    if (hasTone) step1 += 5
    checklist.push({
      id: 'tone',
      label: 'Brand Voice Tone',
      stepIndex: 1,
      points: 5,
      completed: hasTone,
      tip: 'Determines vocabulary style (e.g. Professional vs Casual)',
    })

    const hasLanguage = Boolean(profile.preferredLanguage)
    if (hasLanguage) step1 += 4
    checklist.push({
      id: 'language',
      label: 'Content Language',
      stepIndex: 1,
      points: 4,
      completed: hasLanguage,
      tip: 'Default language for generated copy and subtitles',
    })

    const hasColors = Boolean(profile.brandColors && profile.brandColors.length > 0)
    if (hasColors) step1 += 4
    checklist.push({
      id: 'colors',
      label: 'Brand Color Palette',
      stepIndex: 1,
      points: 4,
      completed: hasColors,
      tip: 'Used to style visual templates and flyer banners',
    })

    // Step 3: Goals & Audience (Max 20)
    const hasAudience = Boolean(profile.targetAudience && profile.targetAudience.trim().length >= 8)
    if (hasAudience) step2 += 10
    checklist.push({
      id: 'audience',
      label: 'Target Audience Profile',
      stepIndex: 2,
      points: 10,
      completed: hasAudience,
      tip: 'Enables tailored hook angles addressing customer pain points',
    })

    const hasGoals = Boolean(profile.monthlyMarketingGoal?.trim() || profile.salesGoal?.trim())
    if (hasGoals) step2 += 10
    checklist.push({
      id: 'goals',
      label: 'Marketing / Sales Goals',
      stepIndex: 2,
      points: 10,
      completed: hasGoals,
      tip: 'Directs AI campaign themes towards lead-gen or engagement',
    })

    // Step 4: Products & Offers (Max 20)
    const validProds = products.filter((p) => p && p.name && p.name.trim().length > 0)
    const hasOneProduct = validProds.length >= 1
    const hasMultipleProducts = validProds.length >= 2

    if (hasOneProduct) step3 += 12
    checklist.push({
      id: 'product1',
      label: 'At Least 1 Core Product / Service',
      stepIndex: 3,
      points: 12,
      completed: hasOneProduct,
      tip: 'AI uses this in product showcase templates and offers',
    })

    if (hasMultipleProducts) step3 += 8
    checklist.push({
      id: 'productMulti',
      label: '2+ Products / Services Catalog',
      stepIndex: 3,
      points: 8,
      completed: hasMultipleProducts,
      tip: 'Allows rotating promotions across multiple services',
    })

    const totalScore = Math.min(100, step0 + step1 + step2 + step3)

    let tier = {
      label: 'Basic Profile',
      badge: 'Basic AI Memory',
      color: 'text-rose-500 dark:text-rose-400',
      bgGradient: 'from-rose-500 to-amber-500',
      description: 'Your AI Brain has initial data. Add USP and products for higher quality content.',
    }

    if (totalScore >= 75) {
      tier = {
        label: 'Master AI Brain',
        badge: 'All-Star Ready 🚀',
        color: 'text-emerald-500 dark:text-emerald-400',
        bgGradient: 'from-emerald-500 to-teal-400',
        description: 'Elite memory configuration! Autonomous creatives will feel 100% human-crafted.',
      }
    } else if (totalScore >= 45) {
      tier = {
        label: 'Good Knowledge Base',
        badge: 'Strong AI Memory',
        color: 'text-sky-500 dark:text-sky-400',
        bgGradient: 'from-sky-500 to-indigo-500',
        description: 'Solid foundation. AI can generate tailored captions aligned with your tone.',
      }
    }

    const stepScores = [
      { step: 0, score: step0, max: 35, pct: Math.round((step0 / 35) * 100) },
      { step: 1, score: step1, max: 25, pct: Math.round((step1 / 25) * 100) },
      { step: 2, score: step2, max: 20, pct: Math.round((step2 / 20) * 100) },
      { step: 3, score: step3, max: 20, pct: Math.round((step3 / 20) * 100) },
    ]

    return {
      totalScore,
      tier,
      stepScores,
      checklist,
      pendingChecklist: checklist.filter((item) => !item.completed),
    }
  }, [profile, products])

  // 5. Auto-Save Debounced Logic
  const saveDraft = useCallback(
    (showToast = false) => {
      try {
        const payload = {
          profile,
          products,
          step,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload))
        setDraftSavedAt(payload.savedAt)
        setIsAutoSaving(false)
        if (showToast) {
          toast.success('Draft saved successfully! You can resume anytime.')
        }
      } catch (err) {
        console.error('Failed to save draft locally', err)
      }
    },
    [profile, products, step]
  )

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    setIsAutoSaving(true)
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft(false)
    }, 1200)

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
  }, [profile, products, step, saveDraft])

  // 6. Restore Draft Action
  const restoreDraft = () => {
    if (!draftDataToRestore) return
    if (draftDataToRestore.profile) {
      setProfile(draftDataToRestore.profile)
    }
    if (draftDataToRestore.products && draftDataToRestore.products.length > 0) {
      setProducts(draftDataToRestore.products)
    }
    if (typeof draftDataToRestore.step === 'number') {
      setStep(draftDataToRestore.step)
    }
    setHasUnsavedDraft(false)
    toast.success('Draft restored successfully!')
  }

  // 7. Discard Draft Action
  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      setHasUnsavedDraft(false)
      setDraftDataToRestore(null)
      setDraftSavedAt(null)
      toast.info('Draft discarded. Working with saved cloud profile.')
    } catch {
      // Ignore
    }
  }

  // 8. Navigation & Step Submission
  const handleNext = async () => {
    if (step === 0) {
      if (!profile.name || !profile.name.trim()) {
        toast.error('Business Name is required')
        return
      }
      if (!profile.category || !profile.category.trim()) {
        toast.error('Business Category is required')
        return
      }
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (!profile.name || !profile.name.trim()) {
        toast.error('Business Name is required. Please fill Step 1 first.')
        setStep(0)
        return
      }
      try {
        const res: any = await saveProfile(profile).unwrap()
        const savedId = res.data?._id || businessId
        setBusinessId(savedId)
        saveDraft(false)
        toast.success('Business profile saved to AI Memory!')
        setStep(3)
      } catch (err: any) {
        toast.error(err?.data?.message || err?.error || 'Failed to save business profile')
      }
    } else if (step === 3) {
      try {
        let targetBusinessId = businessId
        if (!targetBusinessId) {
          if (!profile.name || !profile.name.trim()) {
            toast.error('Please enter Business Name on Step 1 first')
            setStep(0)
            return
          }
          const res: any = await saveProfile(profile).unwrap()
          targetBusinessId = res.data?._id
          setBusinessId(targetBusinessId)
        }

        const validProducts = products.filter((p) => p && p.name && p.name.trim())
        if (targetBusinessId && validProducts.length > 0) {
          await saveProducts({ businessId: targetBusinessId, products: validProducts }).unwrap()
        }

        // Clear local draft on final successful setup
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY)
        } catch {
          // Ignore
        }

        toast.success('Business Brain setup successfully completed! 🎉')
        setTimeout(() => {
          router.push('/ai-social/planner')
        }, 1000)
      } catch (err: any) {
        toast.error(err?.data?.message || err?.error || 'Failed to save services')
      }
    }
  }

  const addProduct = () => setProducts((p) => [...p, { name: '', description: '', price: '', isOffer: false }])
  const removeProduct = (idx: number) => setProducts((p) => p.filter((_, i) => i !== idx))
  const updateProduct = (idx: number, field: string, value: any) => {
    setProducts((p) => p.map((prod, i) => (i === idx ? { ...prod, [field]: value } : prod)))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4">
      {/* Top Header with Draft Status */}
      <PageHeader
        title="Business Knowledge Brain"
        showBackButton={true}
        endContent={
          <div className="flex items-center gap-2.5">
            {/* Draft Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground">
              {isAutoSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span>Saving draft...</span>
                </>
              ) : draftSavedAt ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Draft saved ({draftSavedAt})</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 opacity-60" />
                  <span>Draft sync active</span>
                </>
              )}
            </div>

            {/* Manual Save Draft Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => saveDraft(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Save className="w-3.5 h-3.5 text-primary" />
              <span>Save Draft</span>
            </Button>

            <Badge variant="premium" className="px-3 py-1 gap-1.5 hidden md:flex">
              <Sparkles className="w-3.5 h-3.5" />
              AI Brain Wizard
            </Badge>
          </div>
        }
      />

      {/* Unsaved Draft Recovery Notification Banner */}
      {hasUnsavedDraft && draftDataToRestore && (
        <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Unsaved Draft Found {draftDataToRestore.savedAt ? `(Saved at ${draftDataToRestore.savedAt})` : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                Would you like to restore your previous in-progress Business Brain data?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" onClick={discardDraft} className="text-xs flex-1 sm:flex-none">
              Discard
            </Button>
            <Button size="sm" variant="premium" onClick={restoreDraft} className="text-xs flex-1 sm:flex-none gap-1.5">
              <RotateCcw className="w-3 h-3" />
              Restore Draft
            </Button>
          </div>
        </div>
      )}

      {/* PROFILE COMPLETION SCORE CARD */}
      <Card className="border border-border shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Score Number & Progress */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      Profile Completion Score
                      <span className={`text-xs font-extrabold ${scoreInfo.tier.color}`}>
                        • {scoreInfo.tier.badge}
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black tracking-tight text-foreground font-mono">
                    {scoreInfo.totalScore}%
                  </span>
                </div>
              </div>

              {/* Glowing Progress Bar */}
              <div className="w-full h-2.5 bg-muted/60 rounded-full overflow-hidden p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${scoreInfo.tier.bgGradient} shadow-[0_0_12px_rgba(59,130,246,0.5)]`}
                  style={{ width: `${Math.max(4, scoreInfo.totalScore)}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {scoreInfo.tier.description}
              </p>
            </div>

            {/* Right: Quick Action / Expand Details */}
            <div className="flex items-center gap-2 md:border-l md:border-border/60 md:pl-5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowScoreDetails((prev) => !prev)}
                className="w-full md:w-auto gap-1.5 text-xs font-semibold"
              >
                <span>Score Breakdown ({scoreInfo.pendingChecklist.length} missing)</span>
                {showScoreDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Expandable Breakdown & Recommendations */}
          {showScoreDetails && (
            <div className="mt-4 pt-4 border-t border-border/60 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Step by Step Mini Progress */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {scoreInfo.stepScores.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setStep(i)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      step === i
                        ? 'border-primary bg-primary/10'
                        : 'border-border/60 bg-muted/30 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                      <span className="text-muted-foreground">Step {i + 1}</span>
                      <span className={s.pct === 100 ? 'text-emerald-500 font-bold' : 'text-foreground'}>
                        {s.pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.pct === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Next Actions Checklist */}
              {scoreInfo.pendingChecklist.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Quick Improvements to Boost AI Accuracy:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scoreInfo.pendingChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/70 text-xs gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-muted-foreground">{item.stepIndex + 1}</span>
                          </div>
                          <span className="truncate font-medium text-foreground">{item.label}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setStep(item.stepIndex)}
                          className="h-6 px-2 text-[11px] font-bold text-primary hover:bg-primary/10 shrink-0"
                        >
                          +{item.points}% Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Outstanding! 100% of Business Brain parameters are fully configured!</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stepper Header with Completion Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STEPS.map((s, idx) => {
          const Icon = s.icon
          const isActive = idx === step
          const stepScoreData = scoreInfo.stepScores[idx]
          const isDone = stepScoreData.pct === 100

          return (
            <Card
              key={s.title}
              onClick={() => setStep(idx)}
              className={`cursor-pointer border transition-all duration-300 ${
                isActive
                  ? 'border-primary shadow-md shadow-primary/10 bg-primary/5 scale-[1.01]'
                  : isDone
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-border/70 hover:border-border'
              }`}
            >
              <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Step {idx + 1}
                    </p>
                    <span
                      className={`text-[10px] font-bold ${
                        isDone ? 'text-emerald-500' : 'text-muted-foreground'
                      }`}
                    >
                      {stepScoreData.pct}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold truncate text-foreground">{s.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Step Contents */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Step {step + 1} of 4 • {STEPS[step].title}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Step Score: {scoreInfo.stepScores[step].score} / {STEPS[step].maxScore} pts
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">{STEPS[step].title}</CardTitle>
          <CardDescription>{STEPS[step].desc}</CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {/* STEP 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center justify-between">
                    <span>Business / Brand Name *</span>
                    {profile.name && <span className="text-emerald-500 text-xs font-bold">+10% Complete</span>}
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Empire Dental Clinic"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center justify-between">
                    <span>Category / Industry *</span>
                    {profile.category && <span className="text-emerald-500 text-xs font-bold">+8% Complete</span>}
                  </Label>
                  <Input
                    id="category"
                    value={profile.category}
                    onChange={(e) => setProfile((p) => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Healthcare, Dental, Real Estate, Restaurant"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone / WhatsApp</Label>
                  <Input
                    id="contactPhone"
                    value={profile.contactPhone}
                    onChange={(e) => setProfile((p) => ({ ...p, contactPhone: e.target.value }))}
                    placeholder="+91-9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    value={profile.contactEmail}
                    onChange={(e) => setProfile((p) => ({ ...p, contactEmail: e.target.value }))}
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Primary Location / City</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Pune, Maharashtra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Areas / Localities</Label>
                  <Input
                    id="serviceArea"
                    value={profile.serviceArea}
                    onChange={(e) => setProfile((p) => ({ ...p, serviceArea: e.target.value }))}
                    placeholder="e.g. Pune, PCMC, Hadapsar, Viman Nagar"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center justify-between">
                  <span>About Business & Value Proposition</span>
                  {profile.description?.length >= 20 && (
                    <span className="text-emerald-500 text-xs font-bold">+6% Complete</span>
                  )}
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={profile.description}
                  onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Provide details about your business background, expertise, key offerings, and awards..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Brand Identity */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="usp" className="flex items-center justify-between">
                  <span>USP (Unique Selling Proposition) *</span>
                  {profile.usp?.length >= 8 ? (
                    <span className="text-emerald-500 text-xs font-bold">+12% Complete</span>
                  ) : (
                    <span className="text-amber-500 text-xs font-medium">High Impact (+12% Score)</span>
                  )}
                </Label>
                <Input
                  id="usp"
                  value={profile.usp}
                  onChange={(e) => setProfile((p) => ({ ...p, usp: e.target.value }))}
                  placeholder="e.g. 100% painless RCT in 1 sitting with German equipment"
                />
                <p className="text-xs text-muted-foreground">
                  AI will prominently feature this differentiator across promotional posts and ad copy.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Brand Tone & Voice</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {TONES.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={profile.brandTone === t ? 'premium' : 'outline'}
                      size="sm"
                      onClick={() => setProfile((p) => ({ ...p, brandTone: t }))}
                      className="rounded-full cursor-pointer"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Content Language</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {LANGUAGES.map((l) => (
                    <Button
                      key={l}
                      type="button"
                      variant={profile.preferredLanguage === l ? 'premium' : 'outline'}
                      size="sm"
                      onClick={() => setProfile((p) => ({ ...p, preferredLanguage: l }))}
                      className="rounded-full cursor-pointer"
                    >
                      {l}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Brand Palette Color</Label>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="color"
                    value={profile.brandColors[0] || '#3b82f6'}
                    onChange={(e) => setProfile((p) => ({ ...p, brandColors: [e.target.value] }))}
                    className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-border"
                  />
                  <span className="font-mono text-sm uppercase bg-muted px-3 py-1.5 rounded-md border border-border">
                    {profile.brandColors[0]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Audience */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="flex items-center justify-between">
                  <span>Target Audience Profile</span>
                  {profile.targetAudience?.length >= 8 && (
                    <span className="text-emerald-500 text-xs font-bold">+10% Complete</span>
                  )}
                </Label>
                <Input
                  id="targetAudience"
                  value={profile.targetAudience}
                  onChange={(e) => setProfile((p) => ({ ...p, targetAudience: e.target.value }))}
                  placeholder="e.g. Urban working professionals aged 25-50, young families"
                />
                <p className="text-xs text-muted-foreground">
                  Specify age groups, professions, and key interests for optimal audience resonance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyMarketingGoal">Monthly Marketing Target</Label>
                  <Input
                    id="monthlyMarketingGoal"
                    value={profile.monthlyMarketingGoal}
                    onChange={(e) => setProfile((p) => ({ ...p, monthlyMarketingGoal: e.target.value }))}
                    placeholder="e.g. Generate 30 inquiries & 500 new followers"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesGoal">Specific Sales / Appointment Goal</Label>
                  <Input
                    id="salesGoal"
                    value={profile.salesGoal}
                    onChange={(e) => setProfile((p) => ({ ...p, salesGoal: e.target.value }))}
                    placeholder="e.g. 15 Root Canal bookings & 10 consultations"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/40 mt-4 backdrop-blur-md">
                <input
                  type="checkbox"
                  id="autoPublish"
                  checked={profile.autoPublish || false}
                  onChange={(e) => setProfile((p) => ({ ...p, autoPublish: e.target.checked }))}
                  className="mt-1 rounded accent-primary cursor-pointer w-4 h-4"
                />
                <div className="space-y-1">
                  <Label htmlFor="autoPublish" className="font-semibold text-sm cursor-pointer dark:text-white block">
                    Zero-Touch Autonomy Mode (Auto-Publish)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    If enabled, Siegfried AI will autonomously generate monthly content plans, write captions, generate creatives, and publish them to your social channels 24/7.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Products & Services */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    Services & Offerings
                    <Badge variant="outline" className="text-xs">
                      {products.filter((p) => p.name.trim()).length} Added
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add products that AI can use in post templates, carousel flyers & promotional copy.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addProduct} className="gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {products.map((prod, idx) => (
                  <Card key={idx} className="border border-border/80 p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Item #{idx + 1}</Badge>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prod.isOffer}
                            onChange={(e) => updateProduct(idx, 'isOffer', e.target.checked)}
                            className="rounded accent-primary cursor-pointer"
                          />
                          Special Promotional Offer
                        </label>
                        {products.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => removeProduct(idx)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={prod.name}
                        onChange={(e) => updateProduct(idx, 'name', e.target.value)}
                        placeholder="Service Name (e.g. Root Canal Treatment)"
                      />
                      <Input
                        value={prod.price}
                        onChange={(e) => updateProduct(idx, 'price', e.target.value)}
                        placeholder="Price or Offer Tag (e.g. ₹3,000 or 20% OFF)"
                      />
                    </div>
                    <Input
                      value={prod.description}
                      onChange={(e) => updateProduct(idx, 'description', e.target.value)}
                      placeholder="Brief details (e.g. Painless, single sitting, includes warranty)"
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Wizard Footer with Previous, Save Draft & Continue */}
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-border/40 pt-4 gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="gap-2 flex-1 sm:flex-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => saveDraft(true)}
              className="gap-1.5 flex-1 sm:flex-none cursor-pointer"
            >
              <Save className="w-4 h-4 text-primary" />
              <span>Save Draft</span>
            </Button>
          </div>

          <Button
            variant="premium"
            disabled={savingProfile || savingProducts}
            onClick={handleNext}
            className="gap-2 px-6 w-full sm:w-auto cursor-pointer"
          >
            {savingProfile || savingProducts ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : step === 3 ? (
              <>
                Save & Complete Setup <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue to Step {step + 2} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
