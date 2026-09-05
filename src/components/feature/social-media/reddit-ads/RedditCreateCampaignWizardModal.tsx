'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Loader2,
  Zap,
  Target,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Globe,
  Smartphone,
  CheckCircle2,
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Award,
  ExternalLink,
  Layers,
  Flame,
  Plus
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
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useLaunchRedditCampaignMutation,
  useGenerateRedditAICopyMutation
} from '@/redux/api/redditAdsApi'

interface RedditCreateCampaignWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

const REDDIT_OBJECTIVES = [
  { id: 'CONVERSIONS', title: 'Conversions & Purchases', desc: 'Drive high-intent signups and purchases with Reddit Pixel', badge: 'High ROI 🔥', icon: Target },
  { id: 'TRAFFIC', title: 'Website Traffic & Clicks', desc: 'Send qualified technical and business traffic to your landing page', badge: 'Lowest CPC', icon: Globe },
  { id: 'BRAND_AWARENESS', title: 'Brand Awareness & Reach', desc: 'Dominate top subreddits with native sponsored discussions', badge: 'Max Karma', icon: Flame },
  { id: 'LEAD_GENERATION', title: 'Lead Generation', desc: 'Capture targeted B2B and SaaS leads from developer communities', badge: 'High Intent', icon: Zap },
]

const POPULAR_SUBREDDITS = [
  'r/SaaS',
  'r/startups',
  'r/technology',
  'r/webdev',
  'r/entrepreneur',
  'r/programming',
  'r/marketing',
  'r/ecommerce',
  'r/sideproject',
  'r/artificial',
  'r/devops'
]

const REDDIT_CTA_OPTIONS = [
  { id: 'TRY_FREE', label: 'Try Free ↗' },
  { id: 'LEARN_MORE', label: 'Learn More ↗' },
  { id: 'SIGN_UP', label: 'Sign Up ✍️' },
  { id: 'GET_STARTED', label: 'Get Started 🚀' },
  { id: 'VIEW_DEMO', label: 'View Demo 🎬' },
  { id: 'CONTACT_US', label: 'Contact Us 💬' }
]

export const RedditCreateCampaignWizardModal: React.FC<RedditCreateCampaignWizardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)

  // Step 1: Objective & Budget
  const [campaignName, setCampaignName] = useState('r/SaaS & Startups Q3 Scale')
  const [objective, setObjective] = useState('CONVERSIONS')
  const [dailyBudget, setDailyBudget] = useState<number>(45)

  // Step 2: Subreddits & Audiences
  const [subreddits, setSubreddits] = useState<string[]>(['r/SaaS', 'r/startups', 'r/webdev'])
  const [customSubredditInput, setCustomSubredditInput] = useState('')
  const [targetCountries, setTargetCountries] = useState<string[]>(['United States', 'United Kingdom', 'Canada'])

  // Step 3: Creative & Simulator
  const [postTitle, setPostTitle] = useState('How our small dev team scaled to 10k users without spending thousands on SDRs (Architecture Breakdown)')
  const [bodyMarkdown, setBodyMarkdown] = useState('Hey r/SaaS! Most outreach tools are bloated and break your domain reputation. We built Siegfried to automate multi-channel sequences across Email, WhatsApp & Telegram while keeping delivery rates at 99.4%. Live demo is ungated below.')
  const [callToAction, setCallToAction] = useState('TRY_FREE')
  const [destinationUrl, setDestinationUrl] = useState('https://siegfriedoutreach.com')
  const [authorHandle, setAuthorHandle] = useState('')
  const [flairText, setFlairText] = useState('🛠️ Tool & Case Study')
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80')

  // AI generator prompt
  const [aiProductPrompt, setAiProductPrompt] = useState('')

  const [launchCampaign, { isLoading: isLaunching }] = useLaunchRedditCampaignMutation()
  const [generateCopy, { isLoading: isGeneratingCopy }] = useGenerateRedditAICopyMutation()

  const handleAIGenerate = async () => {
    if (!aiProductPrompt.trim()) {
      toast.error('Please enter a description of your tool or service.')
      return
    }

    try {
      const res = await generateCopy({
        productOrService: aiProductPrompt,
        targetSubreddits: subreddits,
        objective
      }).unwrap()

      if (res?.data) {
        if (res.data.campaignName) setCampaignName(res.data.campaignName)
        if (res.data.headline) setPostTitle(res.data.headline)
        if (res.data.bodyMarkdown) setBodyMarkdown(res.data.bodyMarkdown)
        if (res.data.callToAction) setCallToAction(res.data.callToAction)
        if (res.data.flairText) setFlairText(res.data.flairText)
        if (res.data.suggestedSubreddits) setSubreddits(res.data.suggestedSubreddits.slice(0, 4))
        toast.success('Reddit copy and community angles generated!')
      }
    } catch (err) {
      toast.error('Failed to generate Reddit copy.')
    }
  }

  const toggleSubreddit = (sub: string) => {
    if (subreddits.includes(sub)) {
      if (subreddits.length > 1) {
        setSubreddits(subreddits.filter(s => s !== sub))
      }
    } else {
      setSubreddits([...subreddits, sub])
    }
  }

  const handleAddCustomSubreddit = () => {
    let sub = customSubredditInput.trim()
    if (!sub) return
    if (!sub.startsWith('r/')) {
      sub = `r/${sub}`
    }
    if (!subreddits.includes(sub)) {
      setSubreddits([...subreddits, sub])
      setCustomSubredditInput('')
      toast.success(`Added ${sub}`)
    }
  }

  const handleSubmit = async () => {
    if (!campaignName || !postTitle) {
      toast.error('Please enter campaign name and post title.')
      return
    }

    try {
      await launchCampaign({
        campaignName,
        objective,
        budgetMode: 'DAILY',
        dailyBudget,
        targetSubreddits: subreddits,
        targetInterests: ['Software & Technology', 'Startups & Business'],
        targetCountries,
        creative: {
          title: postTitle,
          bodyMarkdown,
          callToAction,
          destinationUrl,
          thumbnailUrl,
          authorHandle,
          flairText,
          format: 'FREEFORM_POST'
        }
      }).unwrap()

      toast.success('Reddit Ad Campaign launched successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to launch Reddit campaign.')
    }
  }

  const stepLabels = ['Objective & Budget', 'Subreddit Targeting', 'Creative & Reddit Simulator']

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[94vh] overflow-y-auto custom-scrollbar p-0 bg-card border-border/80 rounded-3xl shadow-2xl">
        {/* Header Ribbon with Reddit Sunset Orange Branding */}
        <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-card via-[#FF4500]/5 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FF4500] text-white flex items-center justify-center shadow-lg shadow-[#FF4500]/25 shrink-0 border border-white/20">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg md:text-xl font-black text-title-color dark:text-white">
                    1-Click Reddit AI Campaign Launcher
                  </DialogTitle>
                  <Badge variant="outline" className="bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/40 text-[10px] font-black">
                    Subreddit Targeting
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Reach millions of technical founders, developers, and niche communities with Reddit-native sponsored posts.
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
                        isDone ? 'bg-[#FF4500]' : 'bg-border/60'
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
                          ? 'bg-[#FF4500] text-white border-transparent shadow-md shadow-[#FF4500]/30'
                          : isDone
                            ? 'bg-[#FF4500]/20 text-[#FF4500] border-[#FF4500]/50'
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
          {/* STEP 1: Objective & Budget */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Campaign Name</Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. r/SaaS Founder Growth & Conversion Campaign"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Select Campaign Objective</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REDDIT_OBJECTIVES.map((obj) => {
                    const isSelected = objective === obj.id
                    const Icon = obj.icon
                    return (
                      <div
                        key={obj.id}
                        onClick={() => setObjective(obj.id)}
                        className={cn(
                          'p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
                          isSelected
                            ? 'border-[#FF4500] bg-[#FF4500]/10 shadow-xs'
                            : 'border-border/60 hover:border-border bg-card'
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', isSelected ? 'bg-[#FF4500] text-white' : 'bg-muted text-muted-foreground')}>
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <Badge variant="outline" className="text-[9px] font-bold bg-background">
                              {obj.badge}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-title-color dark:text-white">{obj.title}</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{obj.desc}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Daily Ad Spend Budget ($)</Label>
                  <span className="text-xs font-mono font-bold text-[#FF4500]">${dailyBudget} / day</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={5}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full accent-[#FF4500] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>$10/day</span>
                  <span>$150/day</span>
                  <span>$300+/day</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subreddit & Audience Targeting */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Target Subreddits</Label>
                <p className="text-[11px] text-muted-foreground">
                  Select key developer, SaaS, or entrepreneur communities to place your sponsored discussion:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {POPULAR_SUBREDDITS.map((sub) => {
                    const isSelected = subreddits.includes(sub)
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubreddit(sub)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5',
                          isSelected
                            ? 'bg-[#FF4500] text-white border-[#FF4500] shadow-xs'
                            : 'border-border/60 text-muted-foreground hover:border-border bg-card'
                        )}
                      >
                        <span>{sub}</span>
                        {isSelected ? '✓' : '+'}
                      </button>
                    )
                  })}
                </div>

                {/* Add Custom Subreddit */}
                <div className="flex items-center gap-2 pt-2 max-w-sm">
                  <Input
                    value={customSubredditInput}
                    onChange={(e) => setCustomSubredditInput(e.target.value)}
                    placeholder="Add custom r/subreddit..."
                    className="h-9 text-xs font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSubreddit())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomSubreddit}
                    className="h-9 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Creative, Free-form Post & Live Reddit Simulator */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: AI generator & inputs */}
              <div className="lg:col-span-6 space-y-4">
                {/* AI Reddit Generator Box */}
                <div className="p-4 rounded-2xl border border-[#FF4500]/30 bg-[#FF4500]/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF4500]" />
                      <span className="text-xs font-bold text-title-color dark:text-white">
                        AI Reddit Copywriter
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[9px] bg-background">
                      Anti-Salesy Community Tone
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={aiProductPrompt}
                      onChange={(e) => setAiProductPrompt(e.target.value)}
                      placeholder="e.g. Multi-channel AI marketing tool for technical founders"
                      className="h-9 text-xs rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGeneratingCopy}
                      className="h-9 px-3 rounded-xl bg-[#FF4500] hover:bg-[#D93A00] text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm"
                    >
                      {isGeneratingCopy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Reddit Post Title (Headline)</Label>
                    <Input
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Write an authentic, value-first Reddit post title..."
                      className="h-9 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Post Body (Markdown & Case Study)</Label>
                    <Textarea
                      rows={4}
                      value={bodyMarkdown}
                      onChange={(e) => setBodyMarkdown(e.target.value)}
                      placeholder="Explain what you built, transparency numbers, and invite comments..."
                      className="rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold">Call To Action (CTA)</Label>
                      <Select value={callToAction} onValueChange={setCallToAction}>
                        <SelectTrigger className="h-9 rounded-xl text-xs font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REDDIT_CTA_OPTIONS.map((cta) => (
                            <SelectItem key={cta.id} value={cta.id}>
                              {cta.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold">Flair Badge</Label>
                      <Input
                        value={flairText}
                        onChange={(e) => setFlairText(e.target.value)}
                        placeholder="🛠️ Tool & Case Study"
                        className="h-9 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Destination URL</Label>
                    <Input
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://siegfriedoutreach.com"
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Authentic Reddit Post Simulator */}
              <div className="lg:col-span-6 space-y-2">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <span>📱 Live Reddit Feed Post Simulator</span>
                </span>

                {/* Reddit Card Mockup */}
                <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-md">
                  {/* Subreddit Header */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FF4500] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        r/
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-title-color dark:text-white font-mono">{subreddits[0] || 'r/SaaS'}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">• Promoted by {authorHandle}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">3 hours ago</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] bg-muted/60 font-mono">
                      Promoted
                    </Badge>
                  </div>

                  {/* Flair & Title */}
                  <div className="space-y-1.5">
                    {flairText && (
                      <Badge variant="outline" className="text-[9px] bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/30 font-semibold">
                        {flairText}
                      </Badge>
                    )}
                    <h3 className="text-sm font-bold text-title-color dark:text-white leading-snug">
                      {postTitle}
                    </h3>
                  </div>

                  {/* Body text */}
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">
                    {bodyMarkdown}
                  </p>

                  {/* Media Thumbnail */}
                  {thumbnailUrl && (
                    <div className="rounded-xl overflow-hidden border border-border/60 max-h-48">
                      <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Reddit Action Banner */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground truncate">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#FF4500]" />
                      <span className="truncate">{destinationUrl.replace('https://', '')}</span>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-full bg-[#FF4500] hover:bg-[#D93A00] text-white font-bold text-xs shadow-sm cursor-pointer shrink-0"
                    >
                      {REDDIT_CTA_OPTIONS.find(c => c.id === callToAction)?.label || 'Try Free ↗'}
                    </button>
                  </div>

                  {/* Reddit Action Footer Buttons */}
                  <div className="flex items-center gap-3 pt-1 border-t border-border/30 text-xs text-muted-foreground font-semibold">
                    <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-1 gap-1.5">
                      <ArrowBigUp className="w-4 h-4 text-[#FF4500] fill-[#FF4500]" />
                      <span className="font-mono font-bold text-title-color dark:text-white">1.8k</span>
                      <ArrowBigDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-1 gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>294 Comments</span>
                    </div>
                    <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-1 gap-1.5">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
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
            <Button type="button" variant="ghost" onClick={onClose} className="h-10 rounded-xl text-xs font-semibold">
              Cancel
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="h-10 px-5 rounded-xl bg-[#FF4500] hover:bg-[#D93A00] text-white font-bold text-xs gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLaunching}
                className="h-10 px-6 rounded-xl bg-[#FF4500] hover:bg-[#D93A00] text-white font-black text-xs shadow-lg shadow-[#FF4500]/30 gap-2 cursor-pointer"
              >
                {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch Reddit Campaign'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RedditCreateCampaignWizardModal
