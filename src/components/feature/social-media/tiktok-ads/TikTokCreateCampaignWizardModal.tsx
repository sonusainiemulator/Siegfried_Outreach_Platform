'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Loader2,
  Zap,
  Target,
  DollarSign,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Globe,
  Smartphone,
  Flame,
  CheckCircle2,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Sliders,
  Radio,
  Eye,
  ShoppingBag,
  Download,
  Video,
  Info
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useLaunchTikTokCampaignMutation,
  useGenerateTikTokAICopyMutation
} from '@/redux/api/tiktokAdsApi'

interface TikTokCreateCampaignWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

const TIKTOK_OBJECTIVES = [
  {
    id: 'PRODUCT_SALES',
    title: 'TikTok Shop & Sales',
    desc: 'Drive direct purchases, catalog sales, and high ROAS checkout orders',
    badge: 'High ROAS 🔥',
    icon: ShoppingBag,
    gradient: 'from-pink-500/20 to-rose-500/20 border-pink-500/40'
  },
  {
    id: 'LEAD_GENERATION',
    title: 'Instant Lead Forms',
    desc: 'Capture high-intent customer leads directly in TikTok with 1 tap',
    badge: 'Lowest CPL',
    icon: Target,
    gradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40'
  },
  {
    id: 'VIDEO_VIEWS',
    title: 'Viral Video Views & Spark',
    desc: 'Maximize 6s completed views and boost existing organic TikTok posts',
    badge: 'Max Reach',
    icon: Flame,
    gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/40'
  },
  {
    id: 'APP_INSTALLS',
    title: 'App Installs & Engagement',
    desc: 'Direct iOS & Android mobile app downloads with SKAdNetwork tracking',
    badge: 'High Conversion',
    icon: Download,
    gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40'
  },
  {
    id: 'TRAFFIC',
    title: 'Website Traffic & Funnels',
    desc: 'Send high-volume targeted traffic to your landing page or store',
    badge: 'Lowest CPC',
    icon: Globe,
    gradient: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40'
  }
]

const TIKTOK_CTA_OPTIONS = [
  { id: 'SHOP_NOW', label: 'Shop Now 🛍️' },
  { id: 'LEARN_MORE', label: 'Learn More ⚡' },
  { id: 'SIGN_UP', label: 'Sign Up ✍️' },
  { id: 'ORDER_NOW', label: 'Order Now 📦' },
  { id: 'INSTALL_NOW', label: 'Download App 📲' },
  { id: 'CONTACT_US', label: 'Contact Us 💬' }
]

const POPULAR_TIKTOK_INTERESTS = [
  'E-Commerce & Online Shopping',
  'Tech & Gadgets',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Gaming & Esports',
  'Fitness & Wellness',
  'Food & Beverages',
  'Business & Entrepreneurship'
]

const POPULAR_TIKTOK_HASHTAGS = [
  '#TikTokMadeMeBuyIt',
  '#ViralProduct',
  '#TechTok',
  '#MustHave',
  '#LifeHacks',
  '#FYP',
  '#SmallBusiness'
]

export const TikTokCreateCampaignWizardModal: React.FC<TikTokCreateCampaignWizardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)

  // Step 1: Campaign Setup & Budget
  const [campaignName, setCampaignName] = useState('Summer Viral Scale Campaign')
  const [objective, setObjective] = useState('PRODUCT_SALES')
  const [budgetMode, setBudgetMode] = useState<'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL'>('BUDGET_MODE_DAY')
  const [dailyBudget, setDailyBudget] = useState<number>(50)
  const [bidType, setBidType] = useState<'BID_TYPE_NO_BID' | 'BID_TYPE_COST_CAP'>('BID_TYPE_NO_BID')
  const [targetCpa, setTargetCpa] = useState<number>(5.00)
  const [isSmartPlus, setIsSmartPlus] = useState(true)

  // Step 2: Audience & Placements
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['United States', 'United Kingdom', 'Canada'])
  const [ageMin, setAgeMin] = useState<number>(18)
  const [ageMax, setAgeMax] = useState<number>(35)
  const [genders, setGenders] = useState<string>('ALL')
  const [interests, setInterests] = useState<string[]>([
    'E-Commerce & Online Shopping',
    'Tech & Gadgets'
  ])
  const [hashtags, setHashtags] = useState<string[]>([
    '#TikTokMadeMeBuyIt',
    '#ViralProduct'
  ])
  const [placements, setPlacements] = useState<string[]>(['TikTok Feed', 'TikTok Search Ads'])

  // Step 3: Creative, Spark Ads & AI Generator
  const [isSparkAd, setIsSparkAd] = useState(false)
  const [sparkAdAuthCode, setSparkAdAuthCode] = useState('')
  const [hook, setHook] = useState('Stop scrolling! This 1 gadget sold out 4 times in 48 hours...')
  const [caption, setCaption] = useState('The viral product everyone on #TikTokMadeMeBuyIt is obsessed with! ⚡ Tap Shop Now for 25% OFF Summer flash discount!')
  const [callToAction, setCallToAction] = useState('SHOP_NOW')
  const [soundTitle, setSoundTitle] = useState('Original Sound - Siegfried Viral Beats (Trending)')
  const [brandHandle, setBrandHandle] = useState('@siegfried_outreach')
  const [destinationUrl, setDestinationUrl] = useState('https://siegfriedoutreach.com')
  const [videoUrl, setVideoUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80')

  // AI Assistant prompt
  const [aiProductPrompt, setAiProductPrompt] = useState('')
  const [aiScriptBreakdown, setAiScriptBreakdown] = useState<any>(null)

  const [launchCampaign, { isLoading: isLaunching }] = useLaunchTikTokCampaignMutation()
  const [generateCopy, { isLoading: isGeneratingCopy }] = useGenerateTikTokAICopyMutation()

  const handleAIGenerate = async () => {
    if (!aiProductPrompt.trim()) {
      toast.error('Please enter a short description of your product or service.')
      return
    }

    try {
      const res = await generateCopy({
        productOrService: aiProductPrompt,
        objective,
        targetAudience: interests.join(', ')
      }).unwrap()

      if (res?.data) {
        if (res.data.campaignName) setCampaignName(res.data.campaignName)
        if (res.data.hook) setHook(res.data.hook)
        if (res.data.caption) setCaption(res.data.caption)
        if (res.data.callToAction) setCallToAction(res.data.callToAction)
        if (res.data.hashtags) setHashtags(res.data.hashtags)
        if (res.data.scriptBreakdown) setAiScriptBreakdown(res.data.scriptBreakdown)
        toast.success('Viral TikTok hook & script generated with AI!')
      }
    } catch (err) {
      toast.error('Failed to generate AI copy.')
    }
  }

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item))
    } else {
      setInterests([...interests, item])
    }
  }

  const toggleHashtag = (tag: string) => {
    if (hashtags.includes(tag)) {
      setHashtags(hashtags.filter((t) => t !== tag))
    } else {
      setHashtags([...hashtags, tag])
    }
  }

  const togglePlacement = (pl: string) => {
    if (placements.includes(pl)) {
      if (placements.length > 1) {
        setPlacements(placements.filter((p) => p !== pl))
      }
    } else {
      setPlacements([...placements, pl])
    }
  }

  const handleSubmit = async () => {
    if (!campaignName || !caption || !hook) {
      toast.error('Please enter campaign name, viral hook, and caption.')
      return
    }

    try {
      await launchCampaign({
        campaignName,
        objective,
        budgetMode,
        budget: dailyBudget,
        bidType,
        targetCpa: bidType === 'BID_TYPE_COST_CAP' ? targetCpa : undefined,
        isSmartPlus,
        isSparkAd,
        sparkAdAuthCode: isSparkAd ? sparkAdAuthCode : undefined,
        targetCountries: selectedCountries,
        ageMin,
        ageMax,
        genders,
        interests,
        hashtags,
        placements,
        creative: {
          hook,
          caption,
          callToAction,
          videoUrl,
          soundTitle,
          hashtags,
          brandHandle,
          landingPageUrl: destinationUrl
        }
      }).unwrap()

      toast.success('TikTok Campaign launched successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to launch TikTok campaign.')
    }
  }

  const stepLabels = ['Objective & Smart+ Budget', 'Audience & Placements', 'Creative, Spark & Simulator']

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[94vh] overflow-y-auto custom-scrollbar p-0 bg-card border-border/80 rounded-3xl shadow-2xl">
        {/* Header Ribbon with TikTok Signature Gradients */}
        <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-card via-[#FE2C55]/5 to-[#25F4EE]/5">
          <DialogHeader>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#000000] via-[#FE2C55] to-[#25F4EE] text-white flex items-center justify-center shadow-lg shadow-[#FE2C55]/20 shrink-0 border border-white/20">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg md:text-xl font-black text-title-color dark:text-white">
                    1-Click TikTok AI Campaign Launcher
                  </DialogTitle>
                  <Badge variant="outline" className="bg-[#25F4EE]/10 text-[#00c8c2] dark:text-[#25F4EE] border-[#25F4EE]/40 text-[10px] font-black">
                    Smart+ Engine
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Automate viral TikTok Ads, Spark Ads auth, and TikTok Shop conversion campaigns with AI.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* ── Step Indicator ── */}
          <div className="flex items-center w-full gap-0 pt-5 pb-1">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1
              const isActive = step === stepNum
              const isDone = step > stepNum
              return (
                <React.Fragment key={label}>
                  {idx > 0 && (
                    <div
                      className={cn(
                        'h-[2px] flex-1 mx-2 rounded-full transition-colors',
                        isDone ? 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE]' : 'bg-border/60'
                      )}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (isDone) setStep(stepNum)
                    }}
                    className={cn(
                      'flex items-center gap-2 shrink-0 transition-all',
                      isDone ? 'cursor-pointer' : 'cursor-default'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full text-[11px] font-black flex items-center justify-center border-2 transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white border-transparent shadow-md shadow-[#FE2C55]/30'
                          : isDone
                            ? 'bg-[#25F4EE]/20 text-[#00c8c2] dark:text-[#25F4EE] border-[#25F4EE]/50'
                            : 'bg-card text-muted-foreground border-border'
                      )}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-bold transition-colors hidden sm:inline',
                        isActive ? 'text-title-color dark:text-white' : 'text-muted-foreground'
                      )}
                    >
                      {label}
                    </span>
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* ════════════════════════ STEP 1: Objective & Budget ════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                  Campaign Name
                </Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Spark Ads Scaling - 25% Off Hook"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              {/* Objectives Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                    Campaign Objective
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Select primary conversion goal</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TIKTOK_OBJECTIVES.map((obj) => {
                    const isSelected = objective === obj.id
                    const Icon = obj.icon
                    return (
                      <div
                        key={obj.id}
                        onClick={() => setObjective(obj.id)}
                        className={cn(
                          'p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group',
                          isSelected
                            ? 'border-[#FE2C55] bg-gradient-to-br from-[#FE2C55]/10 via-[#25F4EE]/5 to-transparent shadow-sm'
                            : 'border-border/60 hover:border-border bg-card hover:bg-muted/20'
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div
                              className={cn(
                                'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
                                isSelected
                                  ? 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white shadow-sm'
                                  : 'bg-muted text-muted-foreground group-hover:text-foreground'
                              )}
                            >
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[9px] font-black',
                                isSelected
                                  ? 'bg-[#FE2C55]/20 text-[#FE2C55] border-[#FE2C55]/40'
                                  : 'bg-muted text-muted-foreground border-border'
                              )}
                            >
                              {obj.badge}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-title-color dark:text-white">
                              {obj.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              {obj.desc}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-2 border-t border-[#FE2C55]/20 flex items-center justify-between text-[10px] font-bold text-[#FE2C55]">
                            <span>Selected Objective</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Smart+ & Budgeting Card */}
              <div className="p-5 rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/20 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white flex items-center justify-center text-xs">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
                        <span>TikTok Smart+ AI Performance Campaign</span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically allocates budget to highest-converting TikTok video hooks in real-time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {isSmartPlus ? 'Smart+ Enabled' : 'Manual'}
                    </span>
                    <Switch checked={isSmartPlus} onCheckedChange={setIsSmartPlus} />
                  </div>
                </div>

                {/* Budget Slider & Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Daily Ad Spend Budget ($)</Label>
                      <span className="text-xs font-mono font-bold text-title-color dark:text-white">
                        ${dailyBudget} / day
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={500}
                      step={5}
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="w-full accent-[#FE2C55] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>$20/day</span>
                      <span>$250/day</span>
                      <span>$500+/day</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Bidding Strategy</Label>
                    <Select
                      value={bidType}
                      onValueChange={(val: any) => setBidType(val)}
                    >
                      <SelectTrigger className="h-10 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BID_TYPE_NO_BID">Lowest Cost (Maximize volume)</SelectItem>
                        <SelectItem value="BID_TYPE_COST_CAP">Cost Cap (Target Max CPA)</SelectItem>
                      </SelectContent>
                    </Select>
                    {bidType === 'BID_TYPE_COST_CAP' && (
                      <div className="pt-1 flex items-center gap-2">
                        <Label className="text-[11px] text-muted-foreground shrink-0">Target CPA ($):</Label>
                        <Input
                          type="number"
                          value={targetCpa}
                          onChange={(e) => setTargetCpa(Number(e.target.value))}
                          className="h-8 rounded-lg text-xs font-mono w-24"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════ STEP 2: Audience & Placements ════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Placements Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                  Target Placements
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'TikTok Feed', title: 'TikTok For You Feed', desc: 'Primary vertical in-feed video ads', icon: '📱' },
                    { id: 'TikTok Search Ads', title: 'TikTok Search', desc: 'Appear when users search related keywords', icon: '🔍' },
                    { id: 'Pangle', title: 'Pangle Global Network', desc: 'Top interactive global partner apps', icon: '🌐' }
                  ].map((pl) => {
                    const isSelected = placements.includes(pl.id)
                    return (
                      <div
                        key={pl.id}
                        onClick={() => togglePlacement(pl.id)}
                        className={cn(
                          'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3',
                          isSelected
                            ? 'border-[#25F4EE] bg-[#25F4EE]/5 shadow-xs'
                            : 'border-border/60 hover:border-border bg-card'
                        )}
                      >
                        <span className="text-xl">{pl.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-title-color dark:text-white flex items-center justify-between">
                            <span>{pl.title}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#00c8c2] dark:text-[#25F4EE]" />}
                          </h4>
                          <p className="text-[10px] text-muted-foreground truncate">{pl.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Demographics: Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-border/70 bg-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Target Age Range</Label>
                    <span className="text-xs font-mono font-bold text-title-color dark:text-white">
                      {ageMin} - {ageMax}+ years
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground">Min Age: {ageMin}</span>
                      <input
                        type="range"
                        min={18}
                        max={35}
                        value={ageMin}
                        onChange={(e) => setAgeMin(Number(e.target.value))}
                        className="w-full accent-[#FE2C55]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground">Max Age: {ageMax}+</span>
                      <input
                        type="range"
                        min={25}
                        max={65}
                        value={ageMax}
                        onChange={(e) => setAgeMax(Number(e.target.value))}
                        className="w-full accent-[#25F4EE]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Gender Targeting</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['ALL', 'MALE', 'FEMALE'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenders(g)}
                        className={cn(
                          'py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer',
                          genders === g
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'border-border/50 text-muted-foreground hover:border-border bg-card'
                        )}
                      >
                        {g === 'ALL' ? 'All Genders' : g === 'MALE' ? 'Male' : 'Female'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TikTok Interest Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                    TikTok Interest & Creator Behavior Targeting
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Click to add or remove</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TIKTOK_INTERESTS.map((item) => {
                    const isSelected = interests.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5',
                          isSelected
                            ? 'bg-gradient-to-r from-[#FE2C55]/15 to-[#25F4EE]/15 text-[#FE2C55] dark:text-[#25F4EE] border-[#FE2C55]/40 font-bold'
                            : 'border-border/60 text-muted-foreground hover:border-border bg-card'
                        )}
                      >
                        <span>{item}</span>
                        {isSelected ? '✓' : '+'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Hashtag Targeting */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                    Trending Hashtag Targeting
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Reach users who interact with these tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TIKTOK_HASHTAGS.map((tag) => {
                    const isSelected = hashtags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleHashtag(tag)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1',
                          isSelected
                            ? 'bg-[#25F4EE]/20 text-[#00a8a2] dark:text-[#25F4EE] border-[#25F4EE]/50'
                            : 'border-border/60 text-muted-foreground hover:border-border bg-card'
                        )}
                      >
                        <span>{tag}</span>
                        {isSelected ? '✓' : '+'}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════ STEP 3: Creative, Spark & Live Simulator ════════════════════════ */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: AI Generator & Creative Inputs */}
              <div className="lg:col-span-7 space-y-4">
                {/* AI Script & Hook Generator Box */}
                <div className="p-4 rounded-2xl border border-[#FE2C55]/30 bg-gradient-to-br from-[#FE2C55]/5 via-card to-[#25F4EE]/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FE2C55] animate-pulse" />
                      <span className="text-xs font-bold text-title-color dark:text-white">
                        AI Viral TikTok Hook & Script Engine
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/30">
                      GPT-4o Optimized
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={aiProductPrompt}
                      onChange={(e) => setAiProductPrompt(e.target.value)}
                      placeholder="e.g. AI automation platform that helps agencies send viral outreach"
                      className="h-9 text-xs rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGeneratingCopy}
                      className="h-9 px-3 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm hover:opacity-95"
                    >
                      {isGeneratingCopy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-1" />
                          <span>Generate</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {aiScriptBreakdown && (
                    <div className="p-3 rounded-xl bg-card/80 border border-border/50 text-[11px] space-y-1.5 font-mono text-muted-foreground">
                      <div className="text-rose-500 font-bold">⚡ 0-3s Hook: {aiScriptBreakdown.second0to3}</div>
                      <div className="text-cyan-500 font-bold">🎬 3-15s Demo: {aiScriptBreakdown.second3to15}</div>
                      <div className="text-emerald-500 font-bold">🛒 15-30s CTA: {aiScriptBreakdown.second15to30}</div>
                    </div>
                  )}
                </div>

                {/* Spark Ads Authorization toggle */}
                <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-4 h-4 text-[#25F4EE]" />
                      <span className="text-xs font-bold text-title-color dark:text-white">
                        Use TikTok Spark Ad (Boost Creator / Brand Post)
                      </span>
                    </div>
                    <Switch checked={isSparkAd} onCheckedChange={setIsSparkAd} />
                  </div>
                  {isSparkAd && (
                    <div className="pt-2 space-y-1.5 animate-fade-in">
                      <Label className="text-[10px] text-muted-foreground">
                        TikTok Spark Ad Authorization Code or Post URL:
                      </Label>
                      <Input
                        value={sparkAdAuthCode}
                        onChange={(e) => setSparkAdAuthCode(e.target.value)}
                        placeholder="e.g. tiktok://spark/auth/v948201948 or https://tiktok.com/@creator/video/..."
                        className="h-8.5 rounded-xl text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Creative Copy Inputs */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Viral 3-Second Hook (On-Screen Text)</Label>
                    <Input
                      value={hook}
                      onChange={(e) => setHook(e.target.value)}
                      placeholder="First 3 seconds hook to stop the scroll..."
                      className="h-9 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">TikTok Caption & Offer</Label>
                    <Textarea
                      rows={3}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write punchy caption with emojis and hashtags..."
                      className="rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold">Call To Action (CTA)</Label>
                      <Select
                        value={callToAction}
                        onValueChange={setCallToAction}
                      >
                        <SelectTrigger className="h-9 rounded-xl text-xs font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIKTOK_CTA_OPTIONS.map((cta) => (
                            <SelectItem key={cta.id} value={cta.id}>
                              {cta.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold">Brand Handle</Label>
                      <Input
                        value={brandHandle}
                        onChange={(e) => setBrandHandle(e.target.value)}
                        placeholder="@brand_name"
                        className="h-9 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Destination URL / Instant Form</Label>
                    <Input
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://yourstore.com/product"
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Real-time 9:16 Mobile TikTok Simulator */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Real-Time 9:16 TikTok Simulator</span>
                </div>

                {/* Smartphone Device Frame */}
                <div className="w-[280px] h-[540px] rounded-[36px] bg-[#000000] border-4 border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
                  {/* Background Video / Graphic Simulation */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-85"
                    style={{
                      backgroundImage: `url(${videoUrl})`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                  </div>

                  {/* Top Bar (Live, Following, For You) */}
                  <div className="relative z-10 pt-3 px-4 flex items-center justify-between text-white text-[11px] font-bold">
                    <span className="text-[10px] text-white/70 font-mono">LIVE 🔴</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60">Following</span>
                      <span className="text-white border-b-2 border-white pb-0.5 font-extrabold">For You</span>
                    </div>
                    <span className="text-[10px] text-white/70 font-mono">🔍</span>
                  </div>

                  {/* On-Screen Viral Hook Overlay */}
                  <div className="relative z-10 px-4 mt-6">
                    <div className="bg-black/75 backdrop-blur-md text-white font-black text-xs p-2.5 rounded-xl border border-white/20 shadow-lg text-center leading-tight">
                      {hook || '🔥 Viral Hook goes here!'}
                    </div>
                  </div>

                  {/* Middle Spacer */}
                  <div className="flex-1" />

                  {/* Right-side Floating TikTok Interaction Buttons */}
                  <div className="absolute right-2.5 bottom-20 z-10 flex flex-col items-center gap-3.5 text-white">
                    {/* Creator Avatar */}
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] p-[2px] shadow-md">
                        <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-black">
                          SO
                        </div>
                      </div>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-[11px] font-bold">
                        +
                      </div>
                    </div>

                    {/* Heart (Like) */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-rose-500">
                        <Heart className="w-5 h-5 fill-rose-500" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5">84.2k</span>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 fill-white" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5">1,240</span>
                    </div>

                    {/* Bookmark */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-amber-400">
                        <Bookmark className="w-5 h-5 fill-amber-400" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5">6,810</span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5">3.4k</span>
                    </div>

                    {/* Rotating Music Vinyl Disc */}
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                      <div className="w-3 h-3 rounded-full bg-[#FE2C55]" />
                    </div>
                  </div>

                  {/* Bottom Area: Caption, Pulsing CTA Button, Sound equalizer */}
                  <div className="relative z-10 p-3.5 pt-0 space-y-2 text-white">
                    {/* Brand handle & Sponsored Badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs tracking-tight">{brandHandle}</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#25F4EE] text-black flex items-center justify-center text-[9px] font-black">
                        ✓
                      </span>
                      <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 bg-white/20 text-white border-none font-bold">
                        Sponsored
                      </Badge>
                    </div>

                    {/* Caption */}
                    <p className="text-[10px] text-white/90 line-clamp-2 leading-tight">
                      {caption}
                    </p>

                    {/* Hashtags */}
                    <div className="flex items-center gap-1 text-[9px] text-[#25F4EE] font-bold font-mono">
                      <span>{hashtags.slice(0, 3).join(' ')}</span>
                    </div>

                    {/* High-Converting TikTok CTA Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FE2C55] via-[#ff3b68] to-[#25F4EE] text-white font-black text-xs shadow-lg shadow-[#FE2C55]/40 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98] animate-pulse"
                      >
                        <span>{TIKTOK_CTA_OPTIONS.find((c) => c.id === callToAction)?.label || 'Shop Now'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sound Equalizer Bar */}
                    <div className="flex items-center gap-1.5 text-[9px] text-white/70 pt-0.5 truncate">
                      <Music2 className="w-3 h-3 text-[#25F4EE] shrink-0" />
                      <span className="truncate">{soundTitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between sm:justify-between">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="h-10 rounded-xl text-xs font-semibold gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-10 rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white font-bold text-xs shadow-md shadow-[#FE2C55]/25 gap-1.5 cursor-pointer hover:opacity-95"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLaunching}
                className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#FE2C55] via-rose-500 to-[#25F4EE] text-white font-black text-xs shadow-lg shadow-[#FE2C55]/30 gap-2 cursor-pointer hover:opacity-95"
              >
                {isLaunching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Launch TikTok Campaign</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TikTokCreateCampaignWizardModal
