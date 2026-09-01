'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Loader2,
  Wand2,
  Check,
  Copy,
  Hash,
  Eye,
  Camera,
  Layers,
  Upload,
  RefreshCw,
  Zap,
  CheckCircle2,
  FileText,
  Lightbulb,
  X,
  Share2,
  ArrowRight
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAnalyzeImageForCaptionMutation } from '@/redux/api/aiContentApi'
import { getUploadPreviewUrl } from '@/utils'

interface AIImageVisionModalProps {
  isOpen: boolean
  onClose: () => void
  slides?: Array<{ url: string; file?: File; isExisting: boolean; type: string }>
  initialSlideIndex?: number
  onApply: (data: {
    title: string
    content: string
    hashtags?: string[]
    visualAnalysis?: string
  }) => void
}

const TONE_OPTIONS = [
  { id: 'Engaging', label: '✨ Engaging & Viral', desc: 'Maximum engagement and curiosity' },
  { id: 'Storytelling', label: '📖 Storytelling', desc: 'Narrative arc with personal touch' },
  { id: 'Promotional', label: '🚀 High-Converting Promo', desc: 'Product features & urgency' },
  { id: 'Professional', label: '💼 Professional B2B', desc: 'Authoritative, polished tone' },
  { id: 'Humorous', label: '😄 Fun & Relatable', desc: 'Lighthearted, playful humor' },
]

const PLATFORM_PRESETS = [
  { id: 'all', label: '🌐 All Networks' },
  { id: 'instagram', label: '📸 Instagram' },
  { id: 'whatsapp', label: '📢 WhatsApp' },
  { id: 'linkedin', label: '💼 LinkedIn' },
  { id: 'facebook', label: '📰 Facebook' },
  { id: 'twitter', label: '𝕏 X (Twitter)' },
  { id: 'tiktok', label: '🎵 TikTok' },
]

export const AIImageVisionModal: React.FC<AIImageVisionModalProps> = ({
  isOpen,
  onClose,
  slides = [],
  initialSlideIndex = 0,
  onApply,
}) => {
  const { t } = useTranslation()
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(initialSlideIndex)
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customPreviewUrl, setCustomPreviewUrl] = useState<string | null>(null)
  const [tone, setTone] = useState('Engaging')
  const [platform, setPlatform] = useState('all')
  const [customPrompt, setCustomPrompt] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const [generatedData, setGeneratedData] = useState<{
    title: string
    caption: string
    hashtags: string[]
    visualAnalysis: string
    cta: string
  } | null>(null)

  const [analyzeImage, { isLoading }] = useAnalyzeImageForCaptionMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialSlideIndex >= 0 && initialSlideIndex < slides.length) {
        setSelectedSlideIndex(initialSlideIndex)
      } else if (slides.length > 0) {
        setSelectedSlideIndex(0)
      }
    }
  }, [isOpen, initialSlideIndex, slides.length])

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (customPreviewUrl && customPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(customPreviewUrl)
      }
    }
  }, [customPreviewUrl])

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCustomFile(file)
      setCustomPreviewUrl(URL.createObjectURL(file))
      setSelectedSlideIndex(-1) // Indicate custom upload
    }
  }

  // Determine current active image
  let activeImageUrl: string | null = null
  let activeFile: File | null = customFile

  if (selectedSlideIndex === -1 && customPreviewUrl) {
    activeImageUrl = customPreviewUrl
  } else if (selectedSlideIndex >= 0 && slides[selectedSlideIndex]) {
    const currentSlide = slides[selectedSlideIndex]
    if (currentSlide.file) {
      activeFile = currentSlide.file
      activeImageUrl = currentSlide.url
    } else if (currentSlide.isExisting) {
      activeImageUrl = getUploadPreviewUrl(currentSlide.url)
    } else {
      activeImageUrl = currentSlide.url
    }
  }

  const handleAnalyze = async () => {
    if (!activeImageUrl && !activeFile) {
      toast.error(t('select_or_upload_image_first', { defaultValue: 'Please select or upload an image to analyze.' }))
      return
    }

    try {
      let res: any
      if (activeFile) {
        const formData = new FormData()
        formData.append('image', activeFile)
        formData.append('tone', tone)
        formData.append('platform', platform)
        if (customPrompt) formData.append('prompt', customPrompt)

        res = await analyzeImage(formData).unwrap()
      } else if (activeImageUrl) {
        res = await analyzeImage({
          imageUrl: activeImageUrl,
          tone,
          platform,
          prompt: customPrompt,
        }).unwrap()
      }

      if (res?.data) {
        setGeneratedData(res.data)
        toast.success(t('image_analyzed_success', { defaultValue: 'AI Vision analysis complete! Caption generated.' }))
      }
    } catch (err: any) {
      console.error('Vision analysis error:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to analyze image with AI Vision.')
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(t('copied_to_clipboard', { defaultValue: 'Copied to clipboard!' }))
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleApplyAll = () => {
    if (!generatedData) return

    const fullContent = generatedData.hashtags && generatedData.hashtags.length > 0
      ? `${generatedData.caption}\n\n${generatedData.hashtags.join(' ')}`
      : generatedData.caption

    onApply({
      title: generatedData.title,
      content: fullContent,
      hashtags: generatedData.hashtags,
      visualAnalysis: generatedData.visualAnalysis,
    })

    toast.success(t('applied_to_composer', { defaultValue: 'AI Vision title and captions applied to composer!' }))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-white dark:bg-[#0c101d] border border-neutral-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <span>{t('ai_image_vision_studio', { defaultValue: 'AI Vision: Image-to-Caption Studio' })}</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                    Multi-Modal Vision
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t('ai_image_vision_desc', { defaultValue: 'Extract visual themes, scene context, OCR text, and generate high-converting social captions directly from your uploaded images.' })}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Image Selector & Preview */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <Label className="text-xs font-bold text-title-color dark:text-gray-200 mb-2 block">
                  1. {t('select_or_upload_image', { defaultValue: 'Select Source Image' })}
                </Label>

                {/* Available Slides Strip */}
                {slides.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                      <span>Post Slides ({slides.length})</span>
                      <span className="text-[10px]">Click thumbnail to inspect</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {slides.map((s, idx) => {
                        const previewSrc = s.file ? s.url : (s.isExisting ? getUploadPreviewUrl(s.url) : s.url)
                        const isSelected = selectedSlideIndex === idx
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedSlideIndex(idx)
                              setCustomFile(null)
                            }}
                            className={cn(
                              'relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer group',
                              isSelected
                                ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105 shadow-md'
                                : 'border-neutral-200 dark:border-white/10 hover:border-primary/40 opacity-70 hover:opacity-100'
                            )}
                          >
                            <Image src={previewSrc} alt={`Slide ${idx + 1}`} fill className="object-cover" unoptimized />
                            <div className="absolute top-0.5 left-0.5 bg-black/70 text-[9px] font-bold text-white px-1 rounded">
                              #{idx + 1}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Upload New Image Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomFileUpload}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-xs font-semibold rounded-xl border-dashed border-neutral-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 flex items-center justify-center gap-2 h-9"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('upload_new_image_for_analysis', { defaultValue: 'Upload New Image to Scan' })}</span>
                </Button>
              </div>

              {/* Main Visual Preview Card */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 shadow-inner flex items-center justify-center group">
                {activeImageUrl ? (
                  <>
                    <Image src={activeImageUrl} alt="Visual Target" fill className="object-cover transition-transform group-hover:scale-105 duration-300" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-semibold">
                      <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Camera className="w-3 h-3 text-emerald-400" />
                        <span>Ready for AI Scan</span>
                      </span>
                      {selectedSlideIndex >= 0 && (
                        <span className="bg-emerald-500/80 px-2 py-0.5 rounded-md">Slide #{selectedSlideIndex + 1}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-neutral-500 dark:text-neutral-400 space-y-2">
                    <Camera className="w-8 h-8 mx-auto opacity-40 text-emerald-500" />
                    <p className="text-xs">No image selected. Please choose a slide above or upload a photo.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Settings & AI Results */}
            <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
              {/* Settings Controls */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-title-color dark:text-gray-200 mb-2 block">
                    2. {t('choose_caption_tone', { defaultValue: 'Copywriting Tone & Style' })}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TONE_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTone(item.id)}
                        className={cn(
                          'p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs font-medium',
                          tone === item.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                            : 'border-neutral-200 dark:border-white/10 hover:border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-white dark:bg-white/10'
                        )}
                      >
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-title-color dark:text-gray-200 mb-1.5 block">
                      3. {t('target_platform', { defaultValue: 'Target Network' })}
                    </Label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full h-9 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-xs px-3 font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      {PLATFORM_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-title-color dark:text-gray-200 mb-1.5 block">
                      4. {t('extra_focus_optional', { defaultValue: 'Key Topic or Promotion (Optional)' })}
                    </Label>
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g. Focus on product launch, 20% discount..."
                      className="w-full h-9 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-xs px-3 font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>

                {/* Scan Action Button */}
                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading || (!activeImageUrl && !activeFile)}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('analyzing_image_with_vision', { defaultValue: 'Scanning image composition with AI Vision...' })}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t('extract_and_generate_caption', { defaultValue: '✨ Extract & Generate Captions with AI Vision' })}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Generated Results Panel */}
              {generatedData ? (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 animate-fade-in">
                  {/* Visual Analysis Insight */}
                  {generatedData.visualAnalysis && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-xs flex items-start gap-2">
                      <Eye className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-title-color dark:text-white">Detected Visual Elements: </span>
                        <span className="text-neutral-500 dark:text-neutral-400">{generatedData.visualAnalysis}</span>
                      </div>
                    </div>
                  )}

                  {/* Title Preview */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Label className="font-bold text-title-color dark:text-gray-200 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Recommended Title</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedData.title, 'title')}
                        className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'title' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'title' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-semibold text-title-color dark:text-white">
                      {generatedData.title}
                    </div>
                  </div>

                  {/* Caption Preview */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Label className="font-bold text-title-color dark:text-gray-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Generated Social Caption</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedData.caption, 'caption')}
                        className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'caption' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'caption' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <Textarea
                      readOnly
                      rows={5}
                      className="rounded-xl border-neutral-200 dark:border-white/10 text-xs bg-white dark:bg-white/5 leading-relaxed font-sans"
                      value={generatedData.caption}
                    />
                  </div>

                  {/* Hashtags Chips */}
                  {generatedData.hashtags && generatedData.hashtags.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <Label className="font-bold text-title-color dark:text-gray-200 flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Trending Hashtags</span>
                        </Label>
                        <button
                          type="button"
                          onClick={() => handleCopy(generatedData.hashtags.join(' '), 'hashtags')}
                          className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'hashtags' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>Copy All Tags</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {generatedData.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-Click Apply Button */}
                  <Button
                    type="button"
                    onClick={handleApplyAll}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('apply_to_composer_button', { defaultValue: 'Apply Title, Caption & Hashtags to Post' })}</span>
                  </Button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 text-center text-neutral-500 dark:text-neutral-400 text-xs space-y-1 bg-neutral-50 dark:bg-white/5">
                  <Lightbulb className="w-6 h-6 mx-auto opacity-40 text-amber-500" />
                  <p className="font-semibold text-neutral-900 dark:text-white">Click "Extract & Generate Captions" above</p>
                  <p>AI Vision will read the visual context of your photo to generate tailored captions, hooks, and hashtags.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIImageVisionModal
