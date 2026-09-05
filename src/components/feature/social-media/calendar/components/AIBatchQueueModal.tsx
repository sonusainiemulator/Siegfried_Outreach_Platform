'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Loader2,
  Calendar,
  Clock,
  Youtube,
  Globe,
  FileText,
  Lightbulb,
  CheckCircle2,
  Layers,
  Zap,
  ArrowRight,
  RefreshCw,
  Hash,
  MessageSquareReply,
  Check,
  CalendarDays,
  Share2,
  Trash2,
  Edit3,
  Sliders,
  ChevronRight,
  TrendingUp,
  Instagram,
  Facebook,
  Linkedin,
  X
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGenerateBatchCalendarMutation } from '@/redux/api/aiContentApi'
import { useBatchScheduleSocialPostsMutation, useGetSocialAccountsQuery } from '@/redux/api/socialMediaApi'

interface AIBatchQueueModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface GeneratedPostItem {
  day: number
  date: string
  time: string
  scheduledDateTime: string
  pillar: string
  postType: string
  title: string
  content: string
  hashtags: string[]
  autoReplyKeyword?: string
  autoReplyMessage?: string
  selected?: boolean
}

const PRESET_SOURCES = [
  {
    label: '🎬 YouTube Video Repurposing',
    type: 'youtube_url' as const,
    placeholder: 'https://www.youtube.com/watch?v=...',
    desc: 'Extract key hooks, frameworks, and insights into daily posts & carousels.'
  },
  {
    label: '📰 Blog / Article URL',
    type: 'article_url' as const,
    placeholder: 'https://yourdomain.com/blog/ultimate-growth-guide',
    desc: 'Transform long-form articles into high-engagement daily micro-content.'
  },
  {
    label: '💡 Core Topic / Campaign Theme',
    type: 'topic' as const,
    placeholder: 'e.g. 2026 AI Marketing Playbook, SaaS Automation, Customer Acquisition',
    desc: 'Generate 7 to 30 days of fresh, varied content pillars around your theme.'
  },
  {
    label: '📝 Raw Transcript / Notes',
    type: 'transcript' as const,
    placeholder: 'Paste your podcast transcript, speech notes, or webinar script here...',
    desc: 'Turn raw unformatted notes into polished, platform-native posts.'
  }
]

const TONE_OPTIONS = [
  { value: 'engaging', label: '⚡ Viral & Engaging', desc: 'Hook-heavy, conversational, high comments' },
  { value: 'professional', label: '💼 Authority & Thought Leadership', desc: 'Credible, analytical, deep insights' },
  { value: 'urgency', label: '🔥 High Urgency & Sales', desc: 'Direct, persuasive, FOMO & CTA driven' },
  { value: 'educational', label: '🎓 Educational & How-To', desc: 'Step-by-step frameworks, cheat sheets' },
  { value: 'storytelling', label: '📖 Story & Case Study', desc: 'Relatable journey, lessons learned' },
]

export const AIBatchQueueModal: React.FC<AIBatchQueueModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation()
  const { data: accountsData } = useGetSocialAccountsQuery({})
  const accounts = accountsData?.socialAccounts || []

  const [generateBatchCalendar, { isLoading: isGenerating }] = useGenerateBatchCalendarMutation()
  const [batchScheduleSocialPosts, { isLoading: isScheduling }] = useBatchScheduleSocialPostsMutation()

  // Configuration state
  const [step, setStep] = useState<'config' | 'preview'>('config')
  const [sourceType, setSourceType] = useState<'topic' | 'youtube_url' | 'article_url' | 'transcript'>('youtube_url')
  const [sourceValue, setSourceValue] = useState('')
  const [daysCount, setDaysCount] = useState<number>(7)
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'alternate'>('daily')
  const [postTime, setPostTime] = useState('09:00')
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [tone, setTone] = useState('engaging')
  const [niche, setNiche] = useState('SaaS, AI & Growth Marketing')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)

  // Generated posts state
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPostItem[]>([])
  const [activePreviewDay, setActivePreviewDay] = useState<number>(1)

  // Initialize selected platforms when accounts load
  React.useEffect(() => {
    if (accounts.length > 0 && selectedPlatforms.length === 0) {
      setSelectedPlatforms(accounts.map((a: any) => a.id))
    }
  }, [accounts])

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!sourceValue.trim()) {
      toast.error(t('batch_source_required', { defaultValue: 'Please enter a URL, topic, or transcript to generate content.' }))
      return
    }

    try {
      const res: any = await generateBatchCalendar({
        sourceType,
        sourceValue: sourceValue.trim(),
        daysCount,
        frequency,
        postTime,
        startDate,
        tone,
        niche,
        includeEmojis,
        includeHashtags,
      }).unwrap()

      if (res?.posts && res.posts.length > 0) {
        const mapped = res.posts.map((p: any) => ({
          ...p,
          selected: true
        }))
        setGeneratedPosts(mapped)
        setActivePreviewDay(1)
        setStep('preview')
        toast.success(t('batch_generated_success', {
          defaultValue: `Successfully crafted ${mapped.length} days of social content!`
        }))
      }
    } catch (err: any) {
      console.error('Batch generation error:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to generate batch calendar. Please try again.')
    }
  }

  const handleToggleSelectDay = (dayNum: number) => {
    setGeneratedPosts(prev =>
      prev.map(p => (p.day === dayNum ? { ...p, selected: !p.selected } : p))
    )
  }

  const handleUpdatePost = (dayNum: number, field: keyof GeneratedPostItem, value: any) => {
    setGeneratedPosts(prev =>
      prev.map(p => (p.day === dayNum ? { ...p, [field]: value } : p))
    )
  }

  const handleScheduleAll = async () => {
    const selected = generatedPosts.filter(p => p.selected !== false)
    if (selected.length === 0) {
      toast.error(t('no_posts_selected', { defaultValue: 'Please select at least 1 day to schedule.' }))
      return
    }

    if (selectedPlatforms.length === 0 && accounts.length > 0) {
      toast.error(t('select_account_required', { defaultValue: 'Please select at least one social channel.' }))
      return
    }

    try {
      const res: any = await batchScheduleSocialPosts({
        posts: selected.map(p => ({
          title: p.title,
          content: p.content,
          scheduledDateTime: p.scheduledDateTime,
          hashtags: p.hashtags,
          autoReplyKeyword: p.autoReplyKeyword,
          autoReplyMessage: p.autoReplyMessage,
          postType: p.postType || 'post'
        })),
        platformAccounts: selectedPlatforms
      }).unwrap()

      toast.success(res?.message || `Successfully scheduled ${selected.length} posts to your calendar!`)
      if (onSuccess) onSuccess()
      onClose()
      setStep('config')
    } catch (err: any) {
      console.error('Batch schedule error:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to schedule posts to calendar.')
    }
  }

  const activePost = generatedPosts.find(p => p.day === activePreviewDay) || generatedPosts[0]
  const selectedCount = generatedPosts.filter(p => p.selected !== false).length

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0 border border-border/40 bg-background/95 backdrop-blur-2xl rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/20 bg-gradient-to-r from-primary/15 via-purple-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-title-color dark:text-white flex items-center gap-2">
                  <span>{t('ai_batch_queue_title', { defaultValue: 'AI Batch Auto-Queue Studio' })}</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    1-Click Auto-Pilot
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {t('ai_batch_queue_desc', {
                    defaultValue: 'Repurpose any YouTube video, article, or topic into 7, 14, or 30 days of high-converting social posts scheduled directly onto your calendar.'
                  })}
                </DialogDescription>
              </div>
            </div>

            {step === 'preview' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep('config')}
                className="text-xs border-border/50 gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Parameters</span>
              </Button>
            )}
          </div>
        </div>

        {step === 'config' ? (
          /* STEP 1: CONFIGURATION */
          <div className="p-6 space-y-6">
            {/* 1. Ingestion Source Mode */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-title-color dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>1. Select Content Source or Repurposing Pipeline</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {PRESET_SOURCES.map(preset => {
                  const isSelected = sourceType === preset.type
                  return (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => setSourceType(preset.type)}
                      className={cn(
                        'p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm shadow-primary/10'
                          : 'border-border/30 hover:border-border/80 bg-background/50 hover:bg-muted/30'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn('text-xs font-bold', isSelected ? 'text-primary' : 'text-title-color dark:text-white')}>
                          {preset.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-tight">
                        {preset.desc}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Source Input Box */}
              <div className="pt-2">
                {sourceType === 'transcript' ? (
                  <Textarea
                    value={sourceValue}
                    onChange={e => setSourceValue(e.target.value)}
                    placeholder="Paste notes, transcripts, or talking points..."
                    className="min-h-28 text-xs rounded-xl border-border/40 p-3 bg-background/60 shadow-xs"
                  />
                ) : (
                  <Input
                    value={sourceValue}
                    onChange={e => setSourceValue(e.target.value)}
                    placeholder={
                      PRESET_SOURCES.find(p => p.type === sourceType)?.placeholder || 'Enter URL or topic...'
                    }
                    className="h-11 text-xs rounded-xl border-border/40 px-3.5 bg-background/60 shadow-xs"
                  />
                )}
              </div>
            </div>

            {/* 2. Duration & Cadence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/20">
              {/* Duration (7 / 14 / 30 Days) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-title-color dark:text-white flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
                  <span>Calendar Duration</span>
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { count: 7, label: '7 Days', badge: 'Sprint' },
                    { count: 14, label: '14 Days', badge: 'Growth' },
                    { count: 30, label: '30 Days', badge: 'Month' }
                  ].map(item => (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setDaysCount(item.count)}
                      className={cn(
                        'p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer',
                        daysCount === item.count
                          ? 'border-primary bg-primary/15 text-primary font-bold shadow-xs'
                          : 'border-border/30 bg-background/50 hover:bg-muted/30 text-title-color dark:text-gray-300'
                      )}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] text-muted-foreground uppercase">{item.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posting Cadence */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-title-color dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Frequency Cadence</span>
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { value: 'daily' as const, label: 'Daily' },
                    { value: 'weekdays' as const, label: 'Mon-Fri' },
                    { value: 'alternate' as const, label: 'Every 2d' }
                  ].map(f => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFrequency(f.value)}
                      className={cn(
                        'p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer flex items-center justify-center',
                        frequency === f.value
                          ? 'border-primary bg-primary/15 text-primary font-bold shadow-xs'
                          : 'border-border/30 bg-background/50 hover:bg-muted/30 text-title-color dark:text-gray-300'
                      )}
                    >
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time & Start Date */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-title-color dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Start Date & Daily Time</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="h-10 text-xs rounded-xl border border-border/40 bg-background/60 px-2.5 text-title-color dark:text-white"
                  />
                  <input
                    type="time"
                    value={postTime}
                    onChange={e => setPostTime(e.target.value)}
                    className="h-10 text-xs rounded-xl border border-border/40 bg-background/60 px-2.5 text-title-color dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Tone & Channels */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-border/20">
              {/* Tone Selection (7 cols) */}
              <div className="md:col-span-7 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-title-color dark:text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Editorial Tone & Strategy</span>
                </Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {TONE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTone(opt.value)}
                      className={cn(
                        'w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer',
                        tone === opt.value
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border/30 hover:border-border/80 bg-background/40 hover:bg-muted/30'
                      )}
                    >
                      <div>
                        <div className={cn('text-xs font-semibold', tone === opt.value ? 'text-primary font-bold' : 'text-title-color dark:text-white')}>
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                      </div>
                      {tone === opt.value && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Channels (5 cols) */}
              <div className="md:col-span-5 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-title-color dark:text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  <span>Broadcast Channels</span>
                </Label>
                {accounts.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border/40 text-center text-xs text-muted-foreground">
                    No connected accounts found. Go to Channels to connect.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {accounts.map((acc: any) => {
                      const isSelected = selectedPlatforms.includes(acc.id)
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => togglePlatform(acc.id)}
                          className={cn(
                            'w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-semibold'
                              : 'border-border/30 bg-background/40 text-muted-foreground hover:bg-muted/30'
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="capitalize font-bold text-[11px] text-title-color dark:text-white">{acc.platform}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{acc.accountName}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Generate CTA Button */}
            <div className="pt-4 border-t border-border/20">
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !sourceValue.trim()}
                className="w-full h-12 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Architecting {daysCount}-Day Content Engine with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate {daysCount}-Day Content Calendar in 1-Click</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* STEP 2: PREVIEW & CONFIRM BATCH TIMELINE */
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                  {selectedCount} of {generatedPosts.length} Days Selected
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Starts: {generatedPosts[0]?.date} ➔ Ends: {generatedPosts[generatedPosts.length - 1]?.date}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Timeline Day List (5 cols) */}
              <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {generatedPosts.map(post => {
                  const isActive = post.day === activePreviewDay
                  const isSelected = post.selected !== false
                  return (
                    <div
                      key={post.day}
                      onClick={() => setActivePreviewDay(post.day)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3',
                        isActive
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border/30 bg-background/50 hover:bg-muted/30'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            e.stopPropagation()
                            handleToggleSelectDay(post.day)
                          }}
                          className="rounded text-primary focus:ring-primary h-4 w-4 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-title-color dark:text-white">
                              Day {post.day}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {post.date} @ {post.time}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-title-color/80 dark:text-gray-300 truncate mt-0.5">
                            {post.title}
                          </div>
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-[9px] uppercase tracking-wider shrink-0 bg-primary/10 text-primary border border-primary/20">
                        {post.pillar}
                      </Badge>
                    </div>
                  )
                })}
              </div>

              {/* Right Column: Active Day Editor & Preview (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {activePost && (
                  <div className="p-5 rounded-2xl border border-border/40 bg-background/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-white text-xs font-bold">
                          Day {activePost.day}
                        </Badge>
                        <span className="text-xs font-semibold text-title-color dark:text-white">
                          {activePost.date} at {activePost.time}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs text-primary border-primary/30">
                        Pillar: {activePost.pillar}
                      </Badge>
                    </div>

                    {/* Title Editor */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Post Title / Hook
                      </Label>
                      <Input
                        value={activePost.title}
                        onChange={e => handleUpdatePost(activePost.day, 'title', e.target.value)}
                        className="text-xs font-bold rounded-xl border-border/40 bg-background/80"
                      />
                    </div>

                    {/* Caption Editor */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Post Copy & Formatting</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {activePost.content.length} chars
                        </span>
                      </Label>
                      <Textarea
                        value={activePost.content}
                        onChange={e => handleUpdatePost(activePost.day, 'content', e.target.value)}
                        className="min-h-48 text-xs leading-relaxed rounded-xl border-border/40 bg-background/80 p-3.5 resize-y font-sans"
                      />
                    </div>

                    {/* Hashtags & Auto-Reply */}
                    <div className="p-3 rounded-xl border border-border/30 bg-background/40 space-y-2">
                      {activePost.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {activePost.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                              {tag.startsWith('#') ? tag : '#' + tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {activePost.autoReplyKeyword && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Auto-Reply:</span>
                          <span className="font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {activePost.autoReplyKeyword}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Final 1-Click Action Bar */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('config')}
                    className="h-11 px-4 text-xs font-semibold rounded-xl"
                  >
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={handleScheduleAll}
                    disabled={isScheduling || selectedCount === 0}
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/25 gap-2 cursor-pointer"
                  >
                    {isScheduling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Populating Calendar...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Auto-Fill Calendar ({selectedCount} Posts)</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AIBatchQueueModal
