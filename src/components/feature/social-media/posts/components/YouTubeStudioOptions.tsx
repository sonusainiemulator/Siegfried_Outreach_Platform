'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Youtube,
  Sparkles,
  Video,
  Zap,
  Tag,
  Eye,
  ListPlus,
  Plus,
  X,
  Upload,
  Loader2,
  Play,
  Film,
  Image as ImageIcon,
  Camera,
  Download,
  Palette,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { CarouselSlideItem } from './CarouselSlideManager'
import { getUploadPreviewUrl } from '@/utils'

export interface YouTubeConfig {
  format: 'video' | 'shorts'
  customThumbnailUrl?: string
  tags: string[]
  visibility: 'public' | 'unlisted' | 'private'
  madeForKids: boolean
  playlistName?: string
}

interface YouTubeStudioOptionsProps {
  config: YouTubeConfig
  onChange: (config: YouTubeConfig) => void
  currentTitle: string
  currentContent: string
  slides?: CarouselSlideItem[]
  onApplyAITitle: (title: string) => void
  onApplyAIDescription: (desc: string) => void
  onAddThumbnailToSlides?: (file: File) => void
}

export default function YouTubeStudioOptions({
  config,
  onChange,
  currentTitle,
  currentContent,
  slides = [],
  onApplyAITitle,
  onApplyAIDescription,
  onAddThumbnailToSlides,
}: YouTubeStudioOptionsProps) {
  const [newTag, setNewTag] = useState('')
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false)
  const [isSuggestingTags, setIsSuggestingTags] = useState(false)
  const [isExtractingFrame, setIsExtractingFrame] = useState(false)
  const [isGeneratingAIThumb, setIsGeneratingAIThumb] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFormatChange = (format: 'video' | 'shorts') => {
    onChange({ ...config, format })
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return
    const cleaned = newTag.trim().replace(/^#/, '')
    if (config.tags.includes(cleaned)) {
      toast.info('Tag already added')
      return
    }
    if (config.tags.join(',').length + cleaned.length > 490) {
      toast.error('Reached maximum 500 characters for YouTube tags')
      return
    }
    onChange({ ...config, tags: [...config.tags, cleaned] })
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ ...config, tags: config.tags.filter((t) => t !== tagToRemove) })
  }

  const handleGenerateAITitle = () => {
    setIsGeneratingTitle(true)
    setTimeout(() => {
      const topic = currentTitle || currentContent || 'AI Content Strategy'
      const generated = [
        `How to Master ${topic.slice(0, 30)} in 2026 (Full Guide) 🚀`,
        `The Ultimate ${topic.slice(0, 25)} Blueprint You Need to See 🔥`,
        `Why 99% of People Fail at ${topic.slice(0, 25)} (And How to Win) 💡`,
        `Top 7 Secrets to Scale ${topic.slice(0, 25)} Fast in 2026 📈`,
      ]
      const chosen = generated[Math.floor(Math.random() * generated.length)]
      onApplyAITitle(chosen)
      setIsGeneratingTitle(false)
      toast.success('Generated viral YouTube title!')
    }, 500)
  }

  const handleGenerateAIDescription = () => {
    setIsGeneratingDesc(true)
    setTimeout(() => {
      const title = currentTitle || 'My YouTube Video'
      const generated = `🔥 In this video, we break down everything you need to know about ${title}.\n\n📌 TIMESTAMPS:\n0:00 - Introduction & Overview\n01:45 - Step-by-Step Strategy\n04:30 - Key Growth Tactics & Setup\n07:15 - Pro Tips to Avoid Mistakes\n09:30 - Summary & Next Steps\n\n💬 Drop your questions in the comments below!\n👉 Don't forget to Like, Share, and Subscribe for more daily insights!\n\n#YouTubeMarketing #GrowthHacking #${config.tags.slice(0, 3).join(' #') || 'Siegfried'}`
      onApplyAIDescription(generated)
      setIsGeneratingDesc(false)
      toast.success('Generated structured description with timestamps!')
    }, 600)
  }

  const handleSuggestTags = () => {
    setIsSuggestingTags(true)
    setTimeout(() => {
      const suggestions = [
        'YouTubeGrowth',
        'ContentCreator',
        'AIAutomation',
        'ViralShorts',
        'VideoMarketing',
        'Tutorial2026',
        'Trending',
        'OutreachPro',
      ]
      const merged = Array.from(new Set([...config.tags, ...suggestions])).slice(0, 15)
      onChange({ ...config, tags: merged })
      setIsSuggestingTags(false)
      toast.success('Added suggested high-ranking tags!')
    }, 400)
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ ...config, customThumbnailUrl: url })
    if (onAddThumbnailToSlides) {
      onAddThumbnailToSlides(file)
    }
    toast.success('Custom thumbnail selected and attached!')
  }

  // 1. Auto-Extract Frame from Uploaded Video
  const handleExtractVideoFrame = async () => {
    const videoSlide = slides.find(
      (s) => s.type === 'video' || (s.url && /\.(mp4|webm|mov|ogg|m4v)$/i.test(s.url))
    )

    if (!videoSlide) {
      toast.error('Please upload or select a video file in the composer first.')
      return
    }

    setIsExtractingFrame(true)
    try {
      const videoSrc = videoSlide.file
        ? URL.createObjectURL(videoSlide.file)
        : videoSlide.isExisting
          ? getUploadPreviewUrl(videoSlide.url)
          : videoSlide.url

      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.src = videoSrc
      video.muted = true
      video.preload = 'auto'

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          // Seek to 1.5s or 20% of video
          const seekTime = Math.min(2.0, Math.max(0.5, video.duration * 0.15))
          video.currentTime = seekTime
        }
        video.onseeked = () => resolve()
        video.onerror = (e) => reject(new Error('Failed to load video stream for thumbnail'))
        setTimeout(() => resolve(), 4000) // safety fallback
      })

      const canvas = canvasRef.current || document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context unavailable')

      // Draw video frame
      ctx.drawImage(video, 0, 0, 1280, 720)

      // Add high-end YouTube branding vignette overlay
      const gradient = ctx.createLinearGradient(0, 500, 0, 720)
      gradient.addColorStop(0, 'rgba(0,0,0,0)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.7)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1280, 720)

      // Convert to blob / data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      onChange({ ...config, customThumbnailUrl: dataUrl })

      canvas.toBlob((blob) => {
        if (blob && onAddThumbnailToSlides) {
          const thumbFile = new File([blob], 'youtube_video_thumbnail.jpg', { type: 'image/jpeg' })
          onAddThumbnailToSlides(thumbFile)
        }
      }, 'image/jpeg', 0.92)

      toast.success('Successfully captured 1280×720 HD thumbnail frame from video!')
    } catch (err: any) {
      console.error('Frame capture error:', err)
      toast.error('Could not extract frame. Generating AI thumbnail instead.')
      handleGenerateAIThumbnail()
    } finally {
      setIsExtractingFrame(false)
    }
  }

  // 2. AI Viral YouTube Thumbnail Generator (1280x720 16:9 Canvas)
  const handleGenerateAIThumbnail = () => {
    setIsGeneratingAIThumb(true)
    setTimeout(() => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas')
        canvas.width = 1280
        canvas.height = 720
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 1. Dynamic Vibrant Studio Gradient Background
        const palettes = [
          ['#0F172A', '#1E1B4B', '#4338CA', '#E11D48'],
          ['#09090B', '#18181B', '#7C2D12', '#DC2626'],
          ['#022C22', '#064E3B', '#047857', '#F59E0B'],
          ['#172554', '#1E3A8A', '#2563EB', '#06B6D4'],
          ['#18181B', '#27272A', '#581C87', '#C026D3'],
        ]
        const chosenPalette = palettes[Math.floor(Math.random() * palettes.length)]

        const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720)
        bgGrad.addColorStop(0, chosenPalette[0])
        bgGrad.addColorStop(0.35, chosenPalette[1])
        bgGrad.addColorStop(0.75, chosenPalette[2])
        bgGrad.addColorStop(1, chosenPalette[3])
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, 1280, 720)

        // 2. Geometric Light Accents / Radial Glow
        const radGrad = ctx.createRadialGradient(1000, 200, 50, 1000, 200, 500)
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)')
        radGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.15)')
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = radGrad
        ctx.fillRect(0, 0, 1280, 720)

        // Diagonal accent stripes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
        ctx.lineWidth = 14
        for (let x = -200; x < 1600; x += 120) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x + 300, 720)
          ctx.stroke()
        }

        // 3. 4K Ultra HD Badge
        ctx.fillStyle = '#EF4444'
        ctx.beginPath()
        ctx.roundRect(80, 70, 140, 44, 10)
        ctx.fill()
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText('4K ULTRA', 95, 100)

        // Category / Topic Badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.beginPath()
        ctx.roundRect(240, 70, 200, 44, 10)
        ctx.fill()
        ctx.fillStyle = '#FDE047'
        ctx.font = 'bold 18px sans-serif'
        ctx.fillText('MUST WATCH 🔥', 255, 100)

        // 4. Main Headline Typography
        const rawTitle = currentTitle || 'AI CONTENT STRATEGY REVEALED'
        const titleUpper = rawTitle.toUpperCase()
        const words = titleUpper.split(' ')

        // Break into 2-3 prominent lines
        const lines: string[] = []
        let currentLine = ''
        words.forEach((w) => {
          if ((currentLine + ' ' + w).trim().length > 18) {
            lines.push(currentLine.trim())
            currentLine = w
          } else {
            currentLine += ' ' + w
          }
        })
        if (currentLine.trim()) lines.push(currentLine.trim())

        const maxLines = lines.slice(0, 3)
        let yOffset = 260

        maxLines.forEach((lineText, idx) => {
          // Yellow highlight on 2nd line
          const isHighlight = idx === 1 || maxLines.length === 1

          // Heavy Drop Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)'
          ctx.shadowBlur = 18
          ctx.shadowOffsetX = 6
          ctx.shadowOffsetY = 6

          // Black Stroke Outline
          ctx.lineWidth = 12
          ctx.strokeStyle = '#000000'
          ctx.font = '900 68px "Impact", "Arial Black", sans-serif'
          ctx.strokeText(lineText, 80, yOffset)

          // Fill Text
          ctx.fillStyle = isHighlight ? '#FACC15' : '#FFFFFF'
          ctx.fillText(lineText, 80, yOffset)

          yOffset += 88
        })

        // Reset Shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // 5. YouTube & Siegfried Brand Watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.beginPath()
        ctx.roundRect(80, 610, 320, 50, 12)
        ctx.fill()
        ctx.fillStyle = '#EF4444'
        ctx.font = 'bold 22px sans-serif'
        ctx.fillText('▶', 100, 642)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 18px sans-serif'
        ctx.fillText('Siegfried Outreach AI', 130, 642)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        onChange({ ...config, customThumbnailUrl: dataUrl })

        canvas.toBlob((blob) => {
          if (blob && onAddThumbnailToSlides) {
            const thumbFile = new File([blob], 'ai_youtube_thumbnail.jpg', { type: 'image/jpeg' })
            onAddThumbnailToSlides(thumbFile)
          }
        }, 'image/jpeg', 0.92)

        toast.success('Generated high-CTR 16:9 AI YouTube Thumbnail!')
      } catch (err: any) {
        toast.error('Thumbnail generation failed: ' + err.message)
      } finally {
        setIsGeneratingAIThumb(false)
      }
    }, 400)
  }

  const handleDownloadThumbnail = () => {
    if (!config.customThumbnailUrl) return
    const a = document.createElement('a')
    a.href = config.customThumbnailUrl
    a.download = `youtube_thumbnail_${Date.now()}.jpg`
    a.click()
    toast.success('Thumbnail downloaded!')
  }

  const totalTagChars = config.tags.join(', ').length

  return (
    <Card className="rounded-2xl border-red-500/30 glass-dark-card bg-red-500/5 backdrop-blur-xl overflow-hidden shadow-lg animate-fade-in">
      {/* Hidden off-screen canvas for rendering HD thumbnails */}
      <canvas ref={canvasRef} className="hidden" />

      <CardHeader className="p-4 sm:p-5 border-b border-red-500/20 bg-gradient-to-r from-red-600/15 via-red-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>YouTube Studio & Video Publishing</span>
                <Badge variant="outline" className="border-red-500/40 text-red-500 text-[10px] font-bold">
                  Official Studio
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Format switcher, Auto Thumbnail Generator, SEO tags & viral metadata
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* 1. Format Switcher (Video vs Shorts) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-red-500" /> YouTube Content Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Standard Video */}
            <button
              type="button"
              onClick={() => handleFormatChange('video')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                config.format === 'video'
                  ? 'bg-red-500/15 border-red-500 shadow-sm shadow-red-500/20 ring-1 ring-red-500'
                  : 'bg-card/60 hover:bg-card border-border/40 text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  config.format === 'video' ? 'bg-red-600 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">Standard Video</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                    16:9 Landscape
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full length HD/4K videos with custom 1280x720 thumbnail support.
                </p>
              </div>
            </button>

            {/* YouTube Shorts */}
            <button
              type="button"
              onClick={() => handleFormatChange('shorts')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                config.format === 'shorts'
                  ? 'bg-red-500/15 border-red-500 shadow-sm shadow-red-500/20 ring-1 ring-red-500'
                  : 'bg-card/60 hover:bg-card border-border/40 text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  config.format === 'shorts' ? 'bg-red-600 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">YouTube Shorts</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-red-500/20 text-red-500">
                    9:16 Vertical &lt;60s
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vertical short-form video indexed automatically in the YouTube Shorts feed.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Auto Thumbnail Generation & Custom Uploader */}
        <div className="space-y-3 p-4 rounded-xl bg-background/50 border border-red-500/20">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-red-500" /> Auto Thumbnail Studio (1280 × 720 HD)
              </label>
              <p className="text-[11px] text-muted-foreground">
                Generate viral high-CTR AI thumbnails or auto-extract video frames with 1-click
              </p>
            </div>

            {config.customThumbnailUrl && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadThumbnail}
                  className="h-7 px-2.5 text-[11px] gap-1 border-border/60"
                >
                  <Download className="w-3 h-3" /> Download
                </Button>
                <button
                  type="button"
                  onClick={() => onChange({ ...config, customThumbnailUrl: undefined })}
                  className="text-[11px] text-destructive hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Action Buttons */}
            <div className="sm:col-span-7 space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {/* 1. Auto Generate AI Thumbnail */}
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateAIThumbnail}
                  disabled={isGeneratingAIThumb}
                  className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  {isGeneratingAIThumb ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  )}
                  <span>Auto-Generate AI Thumbnail</span>
                </Button>

                {/* 2. Auto Capture Frame from Video */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExtractVideoFrame}
                  disabled={isExtractingFrame}
                  className="h-9 px-3.5 rounded-xl border-red-500/40 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isExtractingFrame ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                  <span>Extract Video Frame</span>
                </Button>
              </div>

              {/* Upload Manual File */}
              <label className="border border-dashed border-border/60 hover:border-red-500/50 rounded-xl p-3 flex items-center justify-between cursor-pointer bg-card/40 hover:bg-red-500/5 transition-all">
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Upload from Computer</p>
                    <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB (16:9)</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Browse
                </Badge>
              </label>
            </div>

            {/* Thumbnail Live Preview */}
            <div className="sm:col-span-5">
              <div className="aspect-video w-full rounded-xl border border-red-500/30 bg-black flex items-center justify-center overflow-hidden relative shadow-lg group">
                {config.customThumbnailUrl ? (
                  <>
                    <Image
                      src={config.customThumbnailUrl}
                      alt="YouTube Thumbnail"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 border-none shadow-md">
                        16:9 HD
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center gap-1.5 text-muted-foreground/60">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">No Thumbnail Selected</span>
                    <span className="text-[9px] text-muted-foreground">Click Auto-Generate AI Thumbnail above</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. AI Title, Description & SEO Helpers */}
        <div className="p-4 rounded-xl bg-background/50 border border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" /> AI YouTube Optimization Assistants
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateAITitle}
              disabled={isGeneratingTitle}
              className="h-8 text-xs font-semibold gap-1.5 border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400"
            >
              {isGeneratingTitle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Generate Viral YouTube Title
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateAIDescription}
              disabled={isGeneratingDesc}
              className="h-8 text-xs font-semibold gap-1.5 border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400"
            >
              {isGeneratingDesc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ListPlus className="w-3.5 h-3.5" />}
              Generate Timestamps & Description
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSuggestTags}
              disabled={isSuggestingTags}
              className="h-8 text-xs font-semibold gap-1.5 border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400"
            >
              {isSuggestingTags ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Tag className="w-3.5 h-3.5" />}
              Auto-Suggest High-Rank Tags
            </Button>
          </div>
        </div>

        {/* 4. Tags Manager */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-red-500" /> YouTube SEO Tags
            </label>
            <span className={`text-[11px] font-semibold ${totalTagChars > 450 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {totalTagChars} / 500 chars
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Add YouTube tag (e.g. ai, tech, future)..."
              value={newTag}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              className="bg-background/50 border-input-border-color h-9 rounded-lg text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              className="h-9 px-3 text-xs font-semibold gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>

          {config.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {config.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2 py-0.5 text-[11px] bg-red-500/10 border border-red-500/20 text-foreground flex items-center gap-1"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
