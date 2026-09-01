'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

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
  onApplyAITitle: (title: string) => void
  onApplyAIDescription: (desc: string) => void
}

export default function YouTubeStudioOptions({
  config,
  onChange,
  currentTitle,
  currentContent,
  onApplyAITitle,
  onApplyAIDescription,
}: YouTubeStudioOptionsProps) {
  const [newTag, setNewTag] = useState('')
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false)
  const [isSuggestingTags, setIsSuggestingTags] = useState(false)

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
      ]
      const chosen = generated[Math.floor(Math.random() * generated.length)]
      onApplyAITitle(chosen)
      setIsGeneratingTitle(false)
      toast.success('Generated viral YouTube title!')
    }, 600)
  }

  const handleGenerateAIDescription = () => {
    setIsGeneratingDesc(true)
    setTimeout(() => {
      const title = currentTitle || 'My Video'
      const template = `In this video, we explore everything you need to know about ${title}.

📌 TIMESTAMPS:
0:00 - Introduction & Overview
1:15 - Key Strategies & Techniques
3:45 - Live Demonstration & Tools
6:20 - Final Recommendations & Tips

🔔 Subscribe for more weekly insights: https://youtube.com/@yourchannel
💬 Leave a comment below with your biggest question!

#YouTube #Growth #AI #ContentCreation`

      onApplyAIDescription(template)
      setIsGeneratingDesc(false)
      toast.success('Generated SEO YouTube description with timestamps!')
    }, 700)
  }

  const handleSuggestTags = () => {
    setIsSuggestingTags(true)
    setTimeout(() => {
      const suggestions = ['YouTubeGrowth', 'ContentCreator', 'AIAutomation', 'ViralShorts', 'VideoMarketing', 'Tutorial2026']
      const merged = Array.from(new Set([...config.tags, ...suggestions])).slice(0, 15)
      onChange({ ...config, tags: merged })
      setIsSuggestingTags(false)
      toast.success('Added suggested high-ranking tags!')
    }, 500)
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ ...config, customThumbnailUrl: url })
    toast.success('Custom thumbnail selected!')
  }

  const totalTagChars = config.tags.join(', ').length

  return (
    <Card className="rounded-2xl border-red-500/30 glass-dark-card bg-red-500/5 backdrop-blur-xl overflow-hidden shadow-lg">
      <CardHeader className="p-4 sm:p-5 border-b border-red-500/20 bg-gradient-to-r from-red-600/10 via-red-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>YouTube Studio & Publishing Setup</span>
                <Badge variant="outline" className="border-red-500/40 text-red-500 text-[10px] font-bold">
                  Official Studio
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure format (Videos vs Shorts), custom thumbnail, SEO tags & metadata
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

        {/* 2. AI Enhancers (Title & Description) */}
        <div className="p-4 rounded-xl bg-background/50 border border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" /> AI YouTube Content Assistants
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

        {/* 3. Custom Thumbnail Uploader */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-red-500" /> Custom Thumbnail (1280 × 720)
            </label>
            {config.customThumbnailUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...config, customThumbnailUrl: undefined })}
                className="text-[11px] text-destructive hover:underline cursor-pointer"
              >
                Remove Thumbnail
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Upload Area */}
            <div className="sm:col-span-2">
              <label className="border-2 border-dashed border-border/60 hover:border-red-500/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-card/40 hover:bg-red-500/5 transition-all text-center">
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Click to upload custom thumbnail</p>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP up to 5MB (16:9 Recommended)</p>
                </div>
              </label>
            </div>

            {/* Thumbnail Preview */}
            <div className="sm:col-span-1">
              <div className="aspect-video rounded-xl border border-border/60 bg-black flex items-center justify-center overflow-hidden relative shadow-md">
                {config.customThumbnailUrl ? (
                  <Image
                    src={config.customThumbnailUrl}
                    alt="Custom Thumbnail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
                    <Play className="w-6 h-6 fill-current" />
                    <span className="text-[9px] font-semibold">16:9 Thumbnail</span>
                  </div>
                )}
              </div>
            </div>
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
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive transition-colors ml-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 5. Visibility, Audience & Playlist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/20">
          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-primary" /> Visibility
            </label>
            <select
              value={config.visibility}
              onChange={(e) => onChange({ ...config, visibility: e.target.value as any })}
              className="w-full h-9 rounded-lg border border-input-border-color bg-background/50 px-2.5 text-xs focus:outline-none text-foreground font-medium"
            >
              <option value="public">🌐 Public</option>
              <option value="unlisted">🔗 Unlisted</option>
              <option value="private">🔒 Private</option>
            </select>
          </div>

          {/* Audience (COPPA) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground">Audience</label>
            <select
              value={config.madeForKids ? 'yes' : 'no'}
              onChange={(e) => onChange({ ...config, madeForKids: e.target.value === 'yes' })}
              className="w-full h-9 rounded-lg border border-input-border-color bg-background/50 px-2.5 text-xs focus:outline-none text-foreground font-medium"
            >
              <option value="no">Not Made for Kids</option>
              <option value="yes">Yes, Made for Kids</option>
            </select>
          </div>

          {/* Playlist */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <ListPlus className="w-3.5 h-3.5 text-primary" /> Playlist (Optional)
            </label>
            <Input
              placeholder="e.g. AI Tutorials..."
              value={config.playlistName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...config, playlistName: e.target.value })}
              className="bg-background/50 border-input-border-color h-9 rounded-lg text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
