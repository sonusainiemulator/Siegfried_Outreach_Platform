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
  Search,
  Monitor,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Star
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
  useLaunchGoogleCampaignMutation,
  useGenerateGoogleAICopyMutation
} from '@/redux/api/googleAdsApi'

interface GoogleCreateCampaignWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

const GOOGLE_CHANNELS = [
  { id: 'SEARCH', title: 'Google Search Ads', desc: 'Capture high-intent buyers searching for keywords on Google', badge: 'Highest Intent', icon: Search, color: 'text-blue-500' },
  { id: 'PERFORMANCE_MAX', title: 'Performance Max (PMax)', desc: 'Run across Search, YouTube, Display, Maps, and Gmail with 1 campaign', badge: 'Max ROAS 🔥', icon: Zap, color: 'text-amber-500' },
  { id: 'DISPLAY', title: 'Google Display Network', desc: 'Reach 90% of internet users across 3M+ high-traffic partner sites', badge: 'Broad Reach', icon: Layers, color: 'text-purple-500' },
  { id: 'YOUTUBE_VIDEO', title: 'YouTube Video Ads', desc: 'In-stream and discovery video ads for high visual brand impact', badge: 'High Engagement', icon: Globe, color: 'text-rose-500' },
]

export const GoogleCreateCampaignWizardModal: React.FC<GoogleCreateCampaignWizardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)

  // Step 1: Objective & Channel
  const [campaignName, setCampaignName] = useState('Google Search - High Intent Keywords')
  const [channelType, setChannelType] = useState<'SEARCH' | 'PERFORMANCE_MAX' | 'DISPLAY' | 'YOUTUBE_VIDEO'>('SEARCH')
  const [objective, setObjective] = useState('LEADS')
  const [dailyBudget, setDailyBudget] = useState<number>(75)
  const [biddingStrategy, setBiddingStrategy] = useState<'MAXIMIZE_CONVERSIONS' | 'TARGET_CPA' | 'TARGET_ROAS'>('TARGET_CPA')
  const [targetCpa, setTargetCpa] = useState<number>(14.50)

  // Step 2: Keywords & Targeting
  const [keywords, setKeywords] = useState<Array<{ keyword: string; matchType: 'EXACT' | 'PHRASE' | 'BROAD' }>>([
    { keyword: 'ai outreach platform', matchType: 'EXACT' },
    { keyword: 'b2b lead generation software', matchType: 'PHRASE' },
    { keyword: 'automated whatsapp marketing tool', matchType: 'PHRASE' }
  ])
  const [newKeyword, setNewKeyword] = useState('')
  const [newMatchType, setNewMatchType] = useState<'EXACT' | 'PHRASE' | 'BROAD'>('PHRASE')
  const [targetLocations, setTargetLocations] = useState<string[]>(['United States', 'United Kingdom', 'Canada'])

  // Step 3: Creative & SERP Simulator
  const [headlines, setHeadlines] = useState<string[]>([
    'Siegfried Outreach Platform',
    'Multi-Channel AI Automation',
    'Scale Sales & Leads Fast'
  ])
  const [descriptions, setDescriptions] = useState<string[]>([
    'Automate outreach across WhatsApp, Telegram, Email & Socials with 99.4% delivery.',
    'Connect CRM in 2 minutes. Transparent reporting and 24/7 dedicated support.'
  ])
  const [finalUrl, setFinalUrl] = useState('https://siegfriedoutreach.com')
  const [displayPath1, setDisplayPath1] = useState('platform')
  const [displayPath2, setDisplayPath2] = useState('ai')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  const [sitelinks, setSitelinks] = useState([
    { text: 'Live Interactive Demo', description: 'See AI agents in action', url: 'https://siegfriedoutreach.com/demo' },
    { text: 'Transparent Pricing', description: 'Affordable monthly plans', url: 'https://siegfriedoutreach.com/pricing' },
    { text: 'Integrations & APIs', description: 'WhatsApp, Telegram, CRM', url: 'https://siegfriedoutreach.com/integrations' },
    { text: 'Client Success Stories', description: 'Read verified 4.8x ROI case studies', url: 'https://siegfriedoutreach.com/cases' }
  ])

  const [callouts, setCallouts] = useState(['24/7 Dedicated Support', '99.4% Inbox Rate', 'Official APIs Only', 'No Setup Fee'])

  // AI prompt
  const [aiProductPrompt, setAiProductPrompt] = useState('')

  const [launchCampaign, { isLoading: isLaunching }] = useLaunchGoogleCampaignMutation()
  const [generateCopy, { isLoading: isGeneratingCopy }] = useGenerateGoogleAICopyMutation()

  const handleAIGenerate = async () => {
    if (!aiProductPrompt.trim()) {
      toast.error('Please describe your product or service.')
      return
    }

    try {
      const res = await generateCopy({
        productOrService: aiProductPrompt,
        objective,
        websiteUrl: finalUrl
      }).unwrap()

      if (res?.data) {
        if (res.data.campaignName) setCampaignName(res.data.campaignName)
        if (res.data.headlines) setHeadlines(res.data.headlines)
        if (res.data.descriptions) setDescriptions(res.data.descriptions)
        if (res.data.suggestedKeywords) setKeywords(res.data.suggestedKeywords)
        if (res.data.sitelinks) setSitelinks(res.data.sitelinks)
        if (res.data.callouts) setCallouts(res.data.callouts)
        toast.success('Google headlines, descriptions & high-intent keywords generated!')
      }
    } catch (err) {
      toast.error('Failed to generate Google Ads copy.')
    }
  }

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return
    setKeywords([...keywords, { keyword: newKeyword.trim().toLowerCase(), matchType: newMatchType }])
    setNewKeyword('')
  }

  const handleRemoveKeyword = (idx: number) => {
    setKeywords(keywords.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (!campaignName || headlines.length === 0) {
      toast.error('Please complete campaign name and headlines.')
      return
    }

    try {
      await launchCampaign({
        campaignName,
        channelType,
        objective,
        dailyBudget,
        biddingStrategy,
        targetCpa: biddingStrategy === 'TARGET_CPA' ? targetCpa : undefined,
        targetLocations,
        targetKeywords: keywords,
        creative: {
          headlines,
          descriptions,
          finalUrl,
          displayPath1,
          displayPath2,
          sitelinks,
          callouts,
          businessName: 'Siegfried Outreach'
        }
      }).unwrap()

      toast.success('Google Ads Campaign launched successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to launch Google Ads campaign.')
    }
  }

  const stepLabels = ['Channel & Bidding', 'Keywords & Targeting', 'Responsive Ad & SERP Simulator']

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[94vh] overflow-y-auto custom-scrollbar p-0 bg-card border-border/80 rounded-3xl shadow-2xl">
        {/* Header Ribbon with Google 4-Color Gradient */}
        <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-blue-500/10 via-amber-500/5 to-emerald-500/10">
          <DialogHeader>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white text-neutral-900 shadow-md flex items-center justify-center shrink-0 border border-border/60">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg md:text-xl font-black text-title-color dark:text-white">
                    1-Click Google AI Campaign Launcher
                  </DialogTitle>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-black">
                    Search & PMax
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Launch intent-driven Search Ads and Performance Max campaigns with AI keyword generator and live SERP simulation.
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
                        isDone ? 'bg-blue-600' : 'bg-border/60'
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
                          ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-500/30'
                          : isDone
                            ? 'bg-blue-500/20 text-blue-600 border-blue-500/40'
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
          {/* STEP 1: Channel & Bidding */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Campaign Name</Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Google Search - B2B Intent Keywords"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              {/* Channels Grid */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Select Google Ads Channel</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOOGLE_CHANNELS.map((ch) => {
                    const isSelected = channelType === ch.id
                    const Icon = ch.icon
                    return (
                      <div
                        key={ch.id}
                        onClick={() => setChannelType(ch.id as any)}
                        className={cn(
                          'p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10 shadow-xs'
                            : 'border-border/60 hover:border-border bg-card'
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', isSelected ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground')}>
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <Badge variant="outline" className="text-[9px] font-bold bg-background">
                              {ch.badge}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-title-color dark:text-white">{ch.title}</h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{ch.desc}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bidding & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-border/70 bg-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Daily Budget ($)</Label>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">${dailyBudget} / day</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={5}
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>$20/day</span>
                    <span>$250/day</span>
                    <span>$500+/day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Bidding Strategy</Label>
                  <Select value={biddingStrategy} onValueChange={(val: any) => setBiddingStrategy(val)}>
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAXIMIZE_CONVERSIONS">Maximize Conversions</SelectItem>
                      <SelectItem value="TARGET_CPA">Target CPA (Cost per Acquisition)</SelectItem>
                      <SelectItem value="TARGET_ROAS">Target ROAS (%)</SelectItem>
                    </SelectContent>
                  </Select>
                  {biddingStrategy === 'TARGET_CPA' && (
                    <div className="flex items-center gap-2 pt-1">
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
          )}

          {/* STEP 2: Keywords & Match Types */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Target Keywords & Match Types</Label>
                  <span className="text-[11px] text-muted-foreground">Exact [ ], Phrase " ", Broad</span>
                </div>

                {/* Add Keyword input bar */}
                <div className="flex items-center gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter search keyword (e.g. ai outreach tool)..."
                    className="h-10 rounded-xl text-xs flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  />
                  <Select value={newMatchType} onValueChange={(v: any) => setNewMatchType(v)}>
                    <SelectTrigger className="h-10 w-36 rounded-xl text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXACT">[Exact Match]</SelectItem>
                      <SelectItem value="PHRASE">"Phrase Match"</SelectItem>
                      <SelectItem value="BROAD">Broad Match</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddKeyword} className="h-10 px-4 rounded-xl text-xs font-bold cursor-pointer">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Keywords List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {keywords.map((kw, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-border/60 bg-card flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Badge variant="outline" className="text-[9px] font-mono font-bold bg-muted/60">
                          {kw.matchType}
                        </Badge>
                        <span className="font-mono font-semibold truncate text-title-color dark:text-white">
                          {kw.matchType === 'EXACT' ? `[${kw.keyword}]` : kw.matchType === 'PHRASE' ? `"${kw.keyword}"` : kw.keyword}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="text-muted-foreground hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Responsive Ad & Live SERP Simulator */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: AI Generator & Headlines */}
              <div className="lg:col-span-6 space-y-4">
                {/* AI Generator Box */}
                <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-title-color dark:text-white">
                        AI Google Headline & Description Generator
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[9px] bg-background">
                      High Quality Score
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={aiProductPrompt}
                      onChange={(e) => setAiProductPrompt(e.target.value)}
                      placeholder="e.g. AI outreach platform with WhatsApp & Telegram automation"
                      className="h-9 text-xs rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGeneratingCopy}
                      className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm"
                    >
                      {isGeneratingCopy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
                    </Button>
                  </div>
                </div>

                {/* Headlines Inputs */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Responsive Search Ad Headlines</Label>
                  {headlines.map((hl, i) => (
                    <Input
                      key={i}
                      value={hl}
                      onChange={(e) => {
                        const updated = [...headlines]
                        updated[i] = e.target.value
                        setHeadlines(updated)
                      }}
                      placeholder={`Headline ${i + 1} (Max 30 chars)`}
                      maxLength={30}
                      className="h-8.5 text-xs rounded-xl font-medium"
                    />
                  ))}
                </div>

                {/* Descriptions Inputs */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Descriptions (Max 90 chars)</Label>
                  {descriptions.map((desc, i) => (
                    <Textarea
                      key={i}
                      rows={2}
                      value={desc}
                      onChange={(e) => {
                        const updated = [...descriptions]
                        updated[i] = e.target.value
                        setDescriptions(updated)
                      }}
                      placeholder={`Description ${i + 1}`}
                      maxLength={90}
                      className="text-xs rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Authentic Google SERP Simulator */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-blue-500" />
                    <span>Real-Time Google Search SERP Simulator</span>
                  </span>
                  <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={cn('p-1 rounded-lg text-xs', previewDevice === 'desktop' ? 'bg-primary text-white' : 'text-muted-foreground')}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={cn('p-1 rounded-lg text-xs', previewDevice === 'mobile' ? 'bg-primary text-white' : 'text-muted-foreground')}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Google Search Card Preview */}
                <div className="p-5 rounded-2xl border border-border/80 bg-white dark:bg-[#202124] text-neutral-900 dark:text-neutral-100 shadow-md space-y-2 font-sans select-none">
                  {/* URL Header */}
                  <div className="flex items-center gap-2 text-[11px] leading-tight">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-bold text-xs text-neutral-800 dark:text-neutral-200">
                        <span>Siegfried Outreach</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                        <span className="font-bold text-neutral-700 dark:text-neutral-300">Sponsored</span> • https://www.siegfriedoutreach.com › {displayPath1} › {displayPath2}
                      </div>
                    </div>
                  </div>

                  {/* Clickable Blue Google Title */}
                  <h3 className="text-base md:text-lg font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                    {headlines.filter(Boolean).slice(0, 3).join(' | ')}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {descriptions.filter(Boolean).join(' ')}
                  </p>

                  {/* Sitelinks 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                    {sitelinks.slice(0, 4).map((sl, i) => (
                      <div key={i} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                          {sl.text}
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                          {sl.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Callouts */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {callouts.map((co, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span>•</span>
                        <span>{co}</span>
                      </span>
                    ))}
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
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="h-10 rounded-xl text-xs font-semibold gap-1 cursor-pointer">
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
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLaunching}
                className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/30 gap-2 cursor-pointer"
              >
                {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch Google Ads Campaign'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GoogleCreateCampaignWizardModal
