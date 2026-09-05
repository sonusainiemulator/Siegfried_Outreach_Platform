'use client'

import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Loader2,
  Wand2,
  Check,
  RefreshCw,
  Hash,
  MessageSquare,
  Copy,
  ChevronRight,
  Lightbulb,
  X,
  Target,
  ArrowRight,
  Flame,
  FileText,
  Share2,
  Zap,
  CheckCircle2,
  TrendingUp,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Sliders,
  CheckCheck
} from 'lucide-react'
import { TwitterXIcon } from '@/data/socialMedia'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGenerateSocialCaptionMutation } from '@/redux/api/aiContentApi'

interface AIPostGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (data: {
    title: string
    content: string
    autoReplyKeyword?: string
    autoReplyMessage?: string
    hashtags?: string[]
  }) => void
  initialTopic?: string
  initialContent?: string
  selectedPlatforms?: string[]
}

const PRESET_IDEAS = [
  {
    title: '🚀 Product Launch',
    prompt: 'Exciting announcement: We are launching our brand new feature that saves 10 hours a week for creators & businesses.',
    tone: 'engaging',
    goal: 'traffic'
  },
  {
    title: '🔥 50% Flash Sale',
    prompt: 'Exclusive weekend flash sale: Get 50% off all annual subscriptions with code FLASH50. Ends Sunday midnight.',
    tone: 'urgency',
    goal: 'sales'
  },
  {
    title: '💡 5 Growth Hacks',
    prompt: '5 little-known growth hacks to double your reach without spending a single dollar on ads.',
    tone: 'educational',
    goal: 'engagement'
  },
  {
    title: '📈 Story / Case Study',
    prompt: 'How we went from 0 to 10,000 customers in 90 days: The 3 biggest mistakes and the 1 strategy that changed everything.',
    tone: 'storytelling',
    goal: 'brand'
  },
  {
    title: '🎁 Free Lead Magnet',
    prompt: 'Free Download: We compiled the ultimate 2026 Marketing Playbook. Comment "PLAYBOOK" to receive the direct download link in your DM.',
    tone: 'engaging',
    goal: 'engagement'
  }
]

const TONE_OPTIONS = [
  { value: 'engaging', emoji: '⚡', label: 'Viral & Engaging' },
  { value: 'professional', emoji: '💼', label: 'Authority & B2B' },
  { value: 'urgency', emoji: '🔥', label: 'Sales & Urgency' },
  { value: 'storytelling', emoji: '📖', label: 'Story & Relatable' },
  { value: 'educational', emoji: '🎓', label: 'Tips & Tutorial' },
  { value: 'witty', emoji: '🎭', label: 'Punchy & Witty' },
]

const GOAL_OPTIONS = [
  { value: 'engagement', label: '💬 Max Comments' },
  { value: 'traffic', label: '🔗 Clicks & Link' },
  { value: 'sales', label: '💰 Direct Sales' },
  { value: 'brand', label: '🌟 Authority' },
]

const PLATFORM_BADGES = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500 hover:border-pink-500/50' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500 hover:border-blue-500/50' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-sky-500 hover:border-sky-500/50' },
  { id: 'twitter', label: 'X (Twitter)', icon: TwitterXIcon, color: 'text-neutral-900 dark:text-white hover:border-neutral-400/50' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500 hover:border-red-500/50' },
]

export const AIPostGeneratorModal: React.FC<AIPostGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialTopic = '',
  initialContent = '',
  selectedPlatforms = ['instagram', 'facebook']
}) => {
  const { t } = useTranslation()
  const [generateSocialCaption, { isLoading }] = useGenerateSocialCaptionMutation()

  const [topic, setTopic] = useState(initialTopic || initialContent || '')
  const [platforms, setPlatforms] = useState<string[]>(
    selectedPlatforms.length > 0 ? selectedPlatforms : ['instagram', 'facebook']
  )
  const [tone, setTone] = useState('engaging')
  const [goal, setGoal] = useState('engagement')
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)

  // Generated output state
  const [generatedData, setGeneratedData] = useState<{
    title: string
    titleOptions: string[]
    caption: string
    hashtags: string[]
    suggestedTriggerKeyword?: string
    suggestedDmMessage?: string
  } | null>(null)

  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0)
  const [editedCaption, setEditedCaption] = useState('')
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [copiedHashtags, setCopiedHashtags] = useState(false)

  // Sync initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTopic || initialContent) {
        setTopic(initialTopic || initialContent)
      }
      if (selectedPlatforms.length > 0) {
        setPlatforms(selectedPlatforms)
      }
    }
  }, [isOpen, initialTopic, initialContent, selectedPlatforms])

  const togglePlatform = (pId: string) => {
    setPlatforms(prev =>
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    )
  }

  const handleSelectPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setTopic(preset.prompt)
    setTone(preset.tone)
    setGoal(preset.goal)
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error(t('ai_topic_required', { defaultValue: 'Please enter a topic, idea, or draft text to generate content.' }))
      return
    }

    try {
      const response: any = await generateSocialCaption({
        action: 'generate_full',
        topic: topic.trim(),
        platforms,
        tone,
        goal,
        includeEmojis,
        includeHashtags,
      }).unwrap()

      if (response?.data) {
        const data = response.data
        const titleOpts = data.titleOptions && data.titleOptions.length > 0
          ? data.titleOptions
          : [data.title || topic.slice(0, 50)]

        setGeneratedData({
          title: data.title || titleOpts[0],
          titleOptions: titleOpts,
          caption: data.caption || '',
          hashtags: data.hashtags || [],
          suggestedTriggerKeyword: data.suggestedTriggerKeyword,
          suggestedDmMessage: data.suggestedDmMessage
        })
        setSelectedTitleIndex(0)
        setEditedCaption(data.caption || '')
        toast.success(t('ai_post_generated_success', { defaultValue: 'Viral copy synthesized!' }))
      }
    } catch (err: any) {
      console.error('AI generation error:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to generate post content. Please try again.')
    }
  }

  const handleCopyCaption = () => {
    if (!editedCaption) return
    navigator.clipboard.writeText(editedCaption)
    setCopiedCaption(true)
    toast.success(t('caption_copied', { defaultValue: 'Caption copied to clipboard!' }))
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  const handleCopyHashtags = () => {
    if (!generatedData?.hashtags || generatedData.hashtags.length === 0) return
    const tags = generatedData.hashtags.map(h => (h.startsWith('#') ? h : '#' + h)).join(' ')
    navigator.clipboard.writeText(tags)
    setCopiedHashtags(true)
    toast.success('Hashtags copied to clipboard!')
    setTimeout(() => setCopiedHashtags(false), 2000)
  }

  const handleApplyToPost = () => {
    if (!generatedData && !editedCaption) return

    const chosenTitle = generatedData?.titleOptions?.[selectedTitleIndex] || generatedData?.title || topic.slice(0, 50)
    const finalCaption = editedCaption || generatedData?.caption || ''

    onApply({
      title: chosenTitle,
      content: finalCaption,
      autoReplyKeyword: generatedData?.suggestedTriggerKeyword,
      autoReplyMessage: generatedData?.suggestedDmMessage,
      hashtags: generatedData?.hashtags
    })

    toast.success(t('ai_content_applied', { defaultValue: 'AI Title & Caption applied to post!' }))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c101d] text-neutral-900 dark:text-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl">
        {/* Compact Studio Header */}
        <DialogHeader className="p-4 sm:p-5 pb-3.5 border-b border-neutral-200 dark:border-white/10 bg-gradient-to-r from-primary/15 via-purple-500/10 to-transparent shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-primary/25 ring-1 ring-white/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>{t('ai_post_studio_title', { defaultValue: 'AI Post & Caption Studio' })}</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 shadow-xs">
                    Smart AI
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {t('ai_post_studio_desc', { defaultValue: 'Generate high-converting headlines, hooks, full captions, and viral hashtags in 1 click.' })}
                </DialogDescription>
              </div>
            </div>

            {generatedData && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGeneratedData(null)}
                className="text-xs h-8 rounded-xl border-neutral-300 dark:border-white/15 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-white gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>New Prompt</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {/* Quick Inspiration Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Inspiration Ideas</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-all whitespace-nowrap shrink-0 bg-neutral-50 dark:bg-white/5 cursor-pointer shadow-xs"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (5 cols): Controls */}
            <div className="lg:col-span-5 space-y-3.5">
              {/* Topic / Idea Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Topic or Core Idea *
                  </Label>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {topic.length} / 500
                  </span>
                </div>
                <Textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Announce our new AI features that save 10 hours a week for agency owners..."
                  className="min-h-24 text-xs leading-relaxed rounded-2xl border-neutral-200 dark:border-white/15 focus:ring-primary/20 p-3 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white placeholder:text-neutral-400 resize-y shadow-xs"
                />
              </div>

              {/* Target Channels */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  <span>Channels</span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_BADGES.map(p => {
                    const isSelected = platforms.includes(p.id)
                    const Icon = p.icon
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs',
                          isSelected
                            ? 'bg-primary text-white border-primary ring-1 ring-primary/40'
                            : 'border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10'
                        )}
                      >
                        <Icon className={cn('w-3.5 h-3.5', isSelected ? 'text-white' : p.color)} />
                        <span>{p.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Compact Tone Grid (2-columns) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tone of Voice</span>
                </Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TONE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTone(opt.value)}
                      className={cn(
                        'p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer truncate shadow-xs',
                        tone === opt.value
                          ? 'border-primary bg-primary/15 text-primary ring-1 ring-primary/40'
                          : 'border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10'
                      )}
                    >
                      <span>{opt.emoji}</span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compact Goal Row */}
              <div className="space-y-1.5">
                <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Post Goal</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {GOAL_OPTIONS.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setGoal(g.value)}
                      className={cn(
                        'p-1.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer truncate shadow-xs',
                        goal === g.value
                          ? 'border-primary bg-primary/15 text-primary ring-1 ring-primary/40'
                          : 'border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10'
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-4 pt-0.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={e => setIncludeEmojis(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>Emojis 😊</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={e => setIncludeHashtags(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>Hashtags #️⃣</span>
                </label>
              </div>

              {/* Action Generate Button */}
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="w-full h-11 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Viral Copy...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Title & Viral Caption</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Right Column (7 cols): Live Results */}
            <div className="lg:col-span-7 space-y-3.5">
              {generatedData ? (
                <div className="space-y-3.5 animate-fade-in">
                  {/* Generated Title Variations */}
                  <div className="p-3 rounded-2xl border border-primary/30 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Select Headline Hook</span>
                      </Label>
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/40 font-bold">
                        {generatedData.titleOptions?.length || 1} Options
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      {generatedData.titleOptions?.map((optTitle, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedTitleIndex(idx)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer gap-2',
                            selectedTitleIndex === idx
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-white dark:bg-black/30 hover:bg-neutral-50 dark:hover:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200'
                          )}
                        >
                          <span className="truncate">{optTitle}</span>
                          {selectedTitleIndex === idx && <Check className="w-4 h-4 shrink-0 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Caption Editor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <span>Formatted Caption</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {editedCaption.length} chars
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyCaption}
                          className="h-6 px-2 text-[11px] font-bold text-primary hover:bg-primary/10 gap-1 rounded-lg"
                        >
                          {copiedCaption ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                        </Button>
                      </div>
                    </div>

                    <Textarea
                      value={editedCaption}
                      onChange={e => setEditedCaption(e.target.value)}
                      className="min-h-44 text-xs leading-relaxed rounded-2xl border-neutral-200 dark:border-white/15 focus:ring-primary/20 p-3.5 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white font-sans shadow-xs resize-y"
                    />
                  </div>

                  {/* Hashtags & Auto-Reply Badges */}
                  {(generatedData.hashtags?.length > 0 || generatedData.suggestedTriggerKeyword) && (
                    <div className="p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 space-y-2">
                      {generatedData.hashtags?.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                              <Hash className="w-3 h-3 text-primary" />
                              <span>Viral Hashtags ({generatedData.hashtags.length})</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyHashtags}
                              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedHashtags ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>Copy Tags</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {generatedData.hashtags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20"
                              >
                                {tag.startsWith('#') ? tag : '#' + tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {generatedData.suggestedTriggerKeyword && (
                        <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <span className="text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Auto-Reply Trigger:</span>
                            <span className="font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-500/30">
                              {generatedData.suggestedTriggerKeyword}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Apply Actions */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="h-10 px-3 text-xs font-bold border-neutral-300 dark:border-white/15 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-800 dark:text-white gap-1.5 rounded-xl"
                    >
                      <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
                      <span>Regenerate</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={handleApplyToPost}
                      className="flex-1 h-10 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary/30 gap-2 cursor-pointer border border-white/20 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Apply Title & Caption to Composer</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty Placeholder State */
                <div className="h-full min-h-[300px] rounded-3xl border border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 via-purple-500/20 to-rose-500/20 text-primary flex items-center justify-center shadow-inner">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-sm font-extrabold text-neutral-800 dark:text-white">
                      Ready to Craft Viral Copy
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Enter your topic on the left or select a quick template, then click Generate to create high-converting titles, captions, and hashtags.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIPostGeneratorModal
