'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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
  Facebook,
  Instagram,
  Eye,
  ShieldCheck
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLaunch1ClickCampaignMutation, useGenerateAIAdCopyMutation } from '@/redux/api/metaAdsApi'

interface CreateCampaignWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

const OBJECTIVES = [
  { id: 'OUTCOME_LEADS', title: 'Qualified Leads', desc: 'Instant forms, WhatsApp chats, and calls', badge: 'High Conversion', icon: Target },
  { id: 'OUTCOME_SALES', title: 'Sales & Revenue', desc: 'Direct purchases and conversions', badge: 'High ROAS', icon: DollarSign },
  { id: 'OUTCOME_TRAFFIC', title: 'Website Traffic', desc: 'Maximize high-intent link clicks', badge: 'Lowest CPC', icon: Globe },
  { id: 'OUTCOME_ENGAGEMENT', title: 'Engagement & DMs', desc: 'Direct messages & video views', badge: 'Popular', icon: Megaphone },
]

const CTA_OPTIONS = [
  { id: 'LEARN_MORE', label: 'Learn More' },
  { id: 'SIGN_UP', label: 'Sign Up' },
  { id: 'GET_QUOTE', label: 'Get Quote' },
  { id: 'SEND_WHATSAPP_MESSAGE', label: 'WhatsApp Message' },
  { id: 'SHOP_NOW', label: 'Shop Now' },
  { id: 'CONTACT_US', label: 'Contact Us' },
]

export const CreateCampaignWizardModal: React.FC<CreateCampaignWizardModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<number>(1)

  const [campaignName, setCampaignName] = useState('')
  const [objective, setObjective] = useState('OUTCOME_LEADS')
  const [dailyBudget, setDailyBudget] = useState<number>(25)
  const [countries, setCountries] = useState<string[]>([])
  const [ageMin, setAgeMin] = useState<number>(18)
  const [ageMax, setAgeMax] = useState<number>(65)
  const [genders, setGenders] = useState<string>('ALL')
  const [interests, setInterests] = useState<string>('')
  const [placements, setPlacements] = useState<string[]>(['facebook', 'instagram'])

  const [primaryText, setPrimaryText] = useState('')
  const [headline, setHeadline] = useState('')
  const [description, setDescription] = useState('')
  const [callToAction, setCallToAction] = useState('LEARN_MORE')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [previewDevice, setPreviewDevice] = useState<'instagram' | 'facebook'>('instagram')

  const [aiProductPrompt, setAiProductPrompt] = useState('')

  const [launchCampaign, { isLoading: isLaunching }] = useLaunch1ClickCampaignMutation()
  const [generateCopy, { isLoading: isGeneratingCopy }] = useGenerateAIAdCopyMutation()

  const handleAIGenerateCopy = async () => {
    if (!aiProductPrompt.trim()) {
      toast.error('Please describe your product, offer, or service.')
      return
    }
    try {
      const res = await generateCopy({
        productOrService: aiProductPrompt,
        objective: objective.replace('OUTCOME_', ''),
      }).unwrap()
      if (res?.data) {
        if (res.data.campaignName) setCampaignName(res.data.campaignName)
        if (res.data.primaryText) setPrimaryText(res.data.primaryText)
        if (res.data.headline) setHeadline(res.data.headline)
        if (res.data.description) setDescription(res.data.description)
        if (res.data.callToAction) setCallToAction(res.data.callToAction)
        if (res.data.suggestedInterests) setInterests(res.data.suggestedInterests.join(', '))
        toast.success('AI ad copy generated successfully!')
      }
    } catch (err: any) {
      toast.error('Failed to generate AI copy.')
    }
  }

  const handleSubmit = async () => {
    if (!campaignName || !primaryText || !headline) {
      toast.error('Please complete campaign name, primary text, and headline.')
      return
    }
    try {
      await launchCampaign({
        campaignName,
        objective,
        dailyBudget,
        targetCountries: countries,
        ageMin,
        ageMax,
        genders,
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
        placements,
        format: 'SINGLE_IMAGE',
        creative: {
          primaryText,
          headline,
          description,
          callToAction,
          mediaUrls: mediaUrl ? [mediaUrl] : [],
          destinationUrl,
        }
      }).unwrap()
      toast.success('Meta Campaign launched successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to launch Meta campaign.')
    }
  }

  const stepLabels = ['Objective', 'Targeting', 'Creative & Copy']

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[94vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1877F2] via-[#833ab4] to-[#fd1d1d] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle>
                {t('1_click_meta_ads_launcher', { defaultValue: '1-Click Meta Ads Launcher' })}
              </DialogTitle>
              <DialogDescription>
                Launch Facebook & Instagram campaigns with AI copywriting and Advantage+ optimization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Step Indicator ── */}
        <div className="flex items-center w-full gap-0 py-1">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1
            const isActive = step === stepNum
            const isDone = step > stepNum
            return (
              <React.Fragment key={label}>
                {idx > 0 && (
                  <div className={cn('h-[2px] flex-1 mx-1 rounded-full transition-colors', isDone ? 'bg-primary' : 'bg-border')} />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (isDone) setStep(stepNum)
                  }}
                  className={cn(
                    'flex items-center gap-1.5 shrink-0 transition-all',
                    isDone ? 'cursor-pointer' : 'cursor-default'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center border-2 transition-all',
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                      : isDone
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'bg-card text-muted-foreground border-border'
                  )}>
                    {stepNum}
                  </div>
                  <span className={cn(
                    'text-xs font-semibold transition-colors',
                    isActive ? 'text-title-color dark:text-white' : 'text-muted-foreground'
                  )}>
                    {label}
                  </span>
                </button>
              </React.Fragment>
            )
          })}
        </div>

        {/* ── Step Content ── */}
        <div className="space-y-5">
          {/* ════════ STEP 1: Objective & Budget ════════ */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-title-color dark:text-white">
                  Campaign Objective
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OBJECTIVES.map((obj) => {
                    const IconComp = obj.icon
                    const selected = objective === obj.id
                    return (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => setObjective(obj.id)}
                        className={cn(
                          'p-3.5 rounded-xl border text-left transition-all cursor-pointer group',
                          selected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-border hover:border-primary/30 hover:bg-muted/30'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[13px] font-bold flex items-center gap-2 text-title-color dark:text-white">
                            <IconComp className={cn('w-4 h-4', selected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
                            {obj.title}
                          </span>
                          <Badge variant="outline" className="text-[9px] font-semibold shrink-0">{obj.badge}</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{obj.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Campaign Name</Label>
                  <Input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., Summer Lead Generation Campaign"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Daily Budget (USD)</Label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <Input
                      type="number"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Math.max(5, parseInt(e.target.value) || 5))}
                      className="h-10 rounded-xl text-xs pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 2: Audience & Placements ════════ */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  Target Locations & Demographics
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Target Countries</Label>
                    <Input
                      value={countries.join(', ')}
                      onChange={(e) => setCountries(e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean))}
                      className="h-10 rounded-xl text-xs font-mono"
                      placeholder="US, GB, CA, AE"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Age Range</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={ageMin} onChange={(e) => setAgeMin(parseInt(e.target.value) || 18)} className="h-10 rounded-xl text-xs w-20" />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input type="number" value={ageMax} onChange={(e) => setAgeMax(parseInt(e.target.value) || 65)} className="h-10 rounded-xl text-xs w-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Gender</Label>
                    <Select value={genders} onValueChange={setGenders}>
                      <SelectTrigger className="h-10 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Genders</SelectItem>
                        <SelectItem value="MALE">Men Only</SelectItem>
                        <SelectItem value="FEMALE">Women Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Interest Keywords</Label>
                  <Input
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Digital Marketing, Small Business, AI"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  Ad Placements
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Facebook Feed', icon: Facebook, color: 'text-[#1877F2]', border: 'border-blue-500/25 bg-blue-500/[0.03]' },
                    { label: 'Instagram Feed', icon: Instagram, color: 'text-pink-500', border: 'border-pink-500/25 bg-pink-500/[0.03]' },
                    { label: 'Reels (9:16)', icon: Zap, color: 'text-purple-500', border: 'border-purple-500/25 bg-purple-500/[0.03]' },
                    { label: 'Stories', icon: ShieldCheck, color: 'text-emerald-500', border: 'border-emerald-500/25 bg-emerald-500/[0.03]' },
                  ].map((p) => (
                    <div key={p.label} className={cn('p-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-2', p.border)}>
                      <p.icon className={cn('w-3.5 h-3.5 shrink-0', p.color)} />
                      <span className="truncate">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 3: Creative & Copy ════════ */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
              {/* Left: Form */}
              <div className="lg:col-span-7 space-y-4">
                {/* AI Copy Generator */}
                <div className="p-3 rounded-xl border border-primary/15 bg-primary/[0.03] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-title-color dark:text-white">AI Ad Copy Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={aiProductPrompt}
                      onChange={(e) => setAiProductPrompt(e.target.value)}
                      placeholder="Describe your product or service..."
                      className="h-9 rounded-lg text-xs flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAIGenerateCopy}
                      disabled={isGeneratingCopy || !aiProductPrompt.trim()}
                      size="sm"
                      className="h-9 px-3.5 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                    >
                      {isGeneratingCopy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Primary Ad Text</Label>
                  <Textarea
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    rows={3}
                    placeholder="Write engaging ad copy that hooks readers..."
                    className="rounded-xl text-xs leading-relaxed resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Headline</Label>
                    <Input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. 5X Your Leads in 14 Days"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Call to Action</Label>
                    <Select value={callToAction} onValueChange={setCallToAction}>
                      <SelectTrigger className="h-10 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CTA_OPTIONS.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Destination URL</Label>
                    <Input
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://yoursite.com/offer"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Creative Image URL</Label>
                    <Input
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://... image link"
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Live Ad Preview */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    Ad Preview
                  </Label>
                  <div className="flex items-center gap-0.5 bg-muted/50 p-0.5 rounded-lg border border-border/40">
                    {(['instagram', 'facebook'] as const).map((device) => (
                      <button
                        key={device}
                        type="button"
                        onClick={() => setPreviewDevice(device)}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all capitalize',
                          previewDevice === device
                            ? 'bg-card shadow-sm text-title-color dark:text-white'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {device}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ad Mockup Card */}
                <div className="rounded-xl border border-border bg-card overflow-hidden text-xs shadow-sm">
                  {/* Header */}
                  <div className="p-3 flex items-center gap-2.5 border-b border-border/40">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {campaignName ? campaignName.substring(0, 2).toUpperCase() : 'AD'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-title-color dark:text-white flex items-center gap-1.5 text-[12px]">
                        <span className="truncate">{campaignName || 'Your Brand'}</span>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 text-blue-500 border-blue-500/30 shrink-0">
                          Sponsored
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {previewDevice === 'instagram' ? 'Instagram Feed' : 'Facebook Feed'}
                      </div>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="px-3 py-2.5">
                    <p className="text-[11px] leading-[1.6] text-title-color dark:text-gray-200 line-clamp-4">
                      {primaryText || (
                        <span className="text-muted-foreground italic">Your ad copy will appear here...</span>
                      )}
                    </p>
                  </div>

                  {/* Image Area */}
                  <div className="relative aspect-[4/3] w-full bg-muted/30 overflow-hidden">
                    {mediaUrl ? (
                      <Image src={mediaUrl} alt="Ad Visual" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                        <Eye className="w-8 h-8" />
                        <span className="text-[11px] font-semibold">Ad Image Preview</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Footer */}
                  <div className="p-3 flex items-center justify-between gap-3 border-t border-border/40">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-muted-foreground uppercase tracking-wider truncate">
                        {destinationUrl ? destinationUrl.replace(/https?:\/\//, '') : 'yourwebsite.com'}
                      </div>
                      <div className="font-bold text-[12px] text-title-color dark:text-white truncate">
                        {headline || 'Your headline here'}
                      </div>
                    </div>
                    <Button type="button" size="sm" className="h-7 rounded-lg text-[10px] font-bold shrink-0 px-2.5">
                      {CTA_OPTIONS.find(c => c.id === callToAction)?.label || 'Learn More'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Navigation ── */}
        <DialogFooter>
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="h-10 rounded-xl text-xs font-semibold gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="h-10 rounded-xl text-xs font-bold gap-1.5"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLaunching}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 gap-2 cursor-pointer hover:shadow-lg hover:shadow-blue-600/30 transition-all"
            >
              {isLaunching ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
              ) : (
                <><Zap className="w-4 h-4" /> Launch Campaign</>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCampaignWizardModal
