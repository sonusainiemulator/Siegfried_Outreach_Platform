'use client'

import React, { useState, useEffect } from 'react'
import {
  useGetAvatarOptionsQuery,
  useGetAvatarHistoryQuery,
  useGenerateAvatarVideoMutation,
  AvatarItem
} from '@/redux/api/avatarApi'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textArea'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Play,
  Pause,
  Video as VideoIcon,
  Sparkles,
  RefreshCw,
  Check,
  Zap,
  Volume2,
  Maximize2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AvatarPreviewModal } from './AvatarPreviewModal'

interface TalkingVideoStudioProps {
  initialAvatar?: AvatarItem | null
  onVideoCreated?: (item: AvatarItem) => void
}

export const TalkingVideoStudio: React.FC<TalkingVideoStudioProps> = ({
  initialAvatar,
  onVideoCreated,
}) => {
  const { data: optionsData } = useGetAvatarOptionsQuery()
  const { data: historyData } = useGetAvatarHistoryQuery({ limit: 12, type: 'avatar' })
  const [generateVideo, { isLoading: isGenerating }] = useGenerateAvatarVideoMutation()

  const [studioMode, setStudioMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video')
  const [avatarSourceTab, setAvatarSourceTab] = useState<'presets' | 'library' | 'upload'>('presets')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('avatar-sarah')
  const [selectedLibraryAvatar, setSelectedLibraryAvatar] = useState<AvatarItem | null>(initialAvatar || null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  const [script, setScript] = useState(
    'Living a healthy lifestyle can improve your energy, boost your mood, and help you live longer. It includes eating good food, staying active, and getting enough sleep.'
  )
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)')
  const [selectedEngine, setSelectedEngine] = useState<string>('heygen-v2')
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('eleven-rachel')
  const [durationLimit, setDurationLimit] = useState('Up to 1 Minute')
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16')
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)

  const [createdVideo, setCreatedVideo] = useState<AvatarItem | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  const avatarEngines = optionsData?.engines || [
    { id: 'heygen-v2', name: 'HeyGen 2.0 Digital Twin', badge: 'Popular', desc: 'Ultra high-fidelity lip-sync & studio lighting' },
    { id: 'hedra-character-2', name: 'Hedra Character-2', badge: 'Expressive', desc: 'Dynamic facial expressions & eye contact' },
    { id: 'liveportrait-hd', name: 'LivePortrait HD', badge: 'One-Shot', desc: 'Transforms single photo into fluid video' },
    { id: 'did-creative-reality', name: 'D-ID Creative Reality', badge: 'Enterprise', desc: 'Low-latency corporate presenters' }
  ]
  const presetAvatars = optionsData?.presetAvatars || []
  const presetVoices = optionsData?.voices || []
  const libraryAvatars = historyData?.data || []

  useEffect(() => {
    if (initialAvatar) {
      setSelectedLibraryAvatar(initialAvatar)
      setAvatarSourceTab('library')
    }
  }, [initialAvatar])

  const activeAvatarUrl = (() => {
    if (avatarSourceTab === 'presets') {
      const p = presetAvatars.find((a) => a.id === selectedPresetId)
      return p?.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'
    }
    if (avatarSourceTab === 'library') {
      return selectedLibraryAvatar?.content || selectedLibraryAvatar?.images?.[0] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'
    }
    return uploadedImageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'
  })()

  const handleTogglePreviewSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported in this browser')
      return
    }

    if (isPlayingPreview) {
      window.speechSynthesis.cancel()
      setIsPlayingPreview(false)
      return
    }

    if (!script.trim()) {
      toast.error('Please enter a script to test speech')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(script)
    utterance.rate = speechRate
    setIsPlayingPreview(true)
    utterance.onend = () => setIsPlayingPreview(false)
    utterance.onerror = () => setIsPlayingPreview(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleGenerateVideo = async () => {
    if (!script.trim()) {
      toast.error('Please enter a speech script')
      return
    }

    try {
      const res = await generateVideo({
        script: script.trim(),
        avatarUrl: activeAvatarUrl,
        avatarId: avatarSourceTab === 'presets' ? selectedPresetId : undefined,
        voiceId: selectedVoiceId,
        aspectRatio,
        speechRate,
        mode: studioMode
      }).unwrap()

      toast.success(res.message || 'Talking Avatar Video generated!')
      setCreatedVideo(res.data)
      setPreviewModalOpen(true)
      if (onVideoCreated) onVideoCreated(res.data)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create talking video')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Studio Workspace Controls (8 cols on xl) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm space-y-5">
          {/* Mode Switcher */}
          <div className="flex rounded-[8px] p-1 inner-card border border-glass-border">
            <button
              type="button"
              onClick={() => setStudioMode('text-to-video')}
              className={cn(
                'flex-1 py-2 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center',
                studioMode === 'text-to-video'
                  ? 'btn-color text-white shadow-md'
                  : 'text-subtitle-color hover:text-title-color'
              )}
            >
              TEXT TO VIDEO
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('image-to-video')}
              className={cn(
                'flex-1 py-2 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center',
                studioMode === 'image-to-video'
                  ? 'btn-color text-white shadow-md'
                  : 'text-subtitle-color hover:text-title-color'
              )}
            >
              IMAGE TO VIDEO
            </button>
          </div>

          {studioMode === 'image-to-video' && (
            <div className="space-y-1.5 p-3 rounded-[8px] inner-card border border-glass-border">
              <Label className="text-xs font-medium text-subtitle-color">Custom Image URL</Label>
              <Input
                value={uploadedImageUrl}
                onChange={(e) => {
                  setUploadedImageUrl(e.target.value)
                  setAvatarSourceTab('upload')
                }}
                placeholder="Paste reference image URL..."
                className="h-10 inner-card rounded-[8px] text-xs"
              />
            </div>
          )}

          {/* Model Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium capitalize text-subtitle-color">Choose Character Face</Label>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setAvatarSourceTab('presets')}
                  className={cn('cursor-pointer', avatarSourceTab === 'presets' ? 'text-primary font-bold' : 'text-subtitle-color')}
                >
                  Presets
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setAvatarSourceTab('library')}
                  className={cn('cursor-pointer', avatarSourceTab === 'library' ? 'text-primary font-bold' : 'text-subtitle-color')}
                >
                  My Models ({libraryAvatars.length})
                </button>
              </div>
            </div>

            {avatarSourceTab === 'presets' ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetAvatars.map((a) => {
                  const isSel = selectedPresetId === a.id
                  return (
                    <div
                      key={a.id}
                      onClick={() => {
                        setSelectedPresetId(a.id)
                        if (a.defaultVoice) setSelectedVoiceId(a.defaultVoice)
                      }}
                      className={cn(
                        'aspect-square rounded-[8px] overflow-hidden border p-0.5 cursor-pointer relative transition-all',
                        isSel ? 'border-primary ring-2 ring-primary/40 shadow-sm' : 'border-glass-border hover:border-primary/50'
                      )}
                    >
                      <img src={a.imageUrl} alt={a.name} className="w-full h-full object-cover rounded-[6px]" />
                      {isSel && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-primary text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {libraryAvatars.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => setSelectedLibraryAvatar(a)}
                    className={cn(
                      'w-16 h-16 shrink-0 rounded-[8px] overflow-hidden border p-0.5 cursor-pointer relative',
                      selectedLibraryAvatar?._id === a._id ? 'border-primary ring-2 ring-primary' : 'border-glass-border'
                    )}
                  >
                    <img src={a.content} alt={a.title} className="w-full h-full object-cover rounded-[6px]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Script Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium capitalize text-subtitle-color">Your Script</Label>
              <span className="text-[11px] font-mono text-subtitle-color">{script.length} / 5000</span>
            </div>

            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={4}
              maxLength={5000}
              placeholder="Type or paste the speech text here..."
              className="inner-card rounded-[8px] text-sm p-3 focus-visible:ring-primary/20"
            />
          </div>

          {/* Select Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-subtitle-color">Language</Label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] inner-card border border-glass-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="English (US)">🇺🇸 English</option>
                <option value="English (UK)">🇬🇧 English (UK)</option>
                <option value="Spanish (ES)">🇪🇸 Spanish</option>
                <option value="French (FR)">🇫🇷 French</option>
                <option value="German (DE)">🇩🇪 German</option>
                <option value="Hindi (IN)">🇮🇳 Hindi</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-subtitle-color">Voice</Label>
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] inner-card border border-glass-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {presetVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    🎙️ {v.name.split(' ')[0]} ({v.gender})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-subtitle-color">Duration</Label>
              <select
                value={durationLimit}
                onChange={(e) => setDurationLimit(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] inner-card border border-glass-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Up to 1 Minute">Up to 1 Minute</option>
                <option value="Up to 2 Minutes">Up to 2 Minutes</option>
                <option value="30 Seconds">30 Seconds</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !script.trim()}
              className="w-full h-12 rounded-[8px] text-sm font-bold uppercase tracking-wider btn-color text-white shadow-md cursor-pointer transition-all gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Talking Video...
                </>
              ) : (
                <>
                  GENERATE TALKING VIDEO ✨
                </>
              )}
            </Button>
            <div className="text-center text-[11px] text-subtitle-color">
              Estimated Cost: Only 1 Credit
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Professional Compact Video Canvas Stage (4 cols on xl, sticky) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-6">
        <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-4 md:p-5 shadow-sm space-y-3">
          {/* Header & Aspect Ratio Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-glass-border">
            <div className="flex items-center gap-1.5">
              <VideoIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-title-color">Live Preview</span>
            </div>

            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-[6px]">
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={cn('px-2 py-0.5 text-[10px] font-bold rounded-[4px] transition-all', aspectRatio === '9:16' ? 'bg-primary text-white' : 'text-subtitle-color')}
              >
                9:16
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={cn('px-2 py-0.5 text-[10px] font-bold rounded-[4px] transition-all', aspectRatio === '1:1' ? 'bg-primary text-white' : 'text-subtitle-color')}
              >
                1:1
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={cn('px-2 py-0.5 text-[10px] font-bold rounded-[4px] transition-all', aspectRatio === '16:9' ? 'bg-primary text-white' : 'text-subtitle-color')}
              >
                16:9
              </button>
            </div>
          </div>

          {/* Professional Centered Video Device Canvas */}
          <div className="flex justify-center items-center py-1">
            <div
              className={cn(
                'w-full max-w-[320px] rounded-[16px] overflow-hidden bg-black border border-glass-border shadow-xl relative flex flex-col justify-between transition-all duration-300',
                aspectRatio === '9:16' && 'aspect-[9/16] max-h-[440px]',
                aspectRatio === '1:1' && 'aspect-square max-h-[320px]',
                aspectRatio === '16:9' && 'aspect-video max-h-[220px]'
              )}
            >
              {/* Active Character Face */}
              <img
                src={activeAvatarUrl}
                alt="Talking Avatar Preview"
                className={cn(
                  'absolute inset-0 w-full h-full object-cover object-top transition-all duration-300',
                  isPlayingPreview ? 'scale-105 brightness-105' : 'scale-100'
                )}
              />

              {/* Top Pill Badges */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider">
                  HD 1080p
                </span>

                {isPlayingPreview && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/90 backdrop-blur-md text-[10px] font-medium text-white shadow-md animate-pulse">
                    <span>Speaking</span>
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-white rounded-full animate-bounce" />
                      <span className="w-1 h-3.5 bg-white rounded-full animate-bounce delay-100" />
                      <span className="w-1 h-2 bg-white rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Script Subtitle Overlay */}
              <div className="relative z-10 p-3 space-y-2">
                <div className="p-2 rounded-[8px] bg-black/75 backdrop-blur-md border border-white/10 text-white text-[11px] leading-snug line-clamp-2 text-center shadow-md">
                  &quot;{script}&quot;
                </div>

                {/* Speech Test Control Bar */}
                <div className="flex items-center justify-between p-2 rounded-[8px] bg-black/90 backdrop-blur-md border border-white/10 text-white text-xs">
                  <button
                    type="button"
                    onClick={handleTogglePreviewSpeech}
                    className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors cursor-pointer text-[11px]"
                  >
                    {isPlayingPreview ? <Pause className="w-3.5 h-3.5 text-primary fill-current" /> : <Play className="w-3.5 h-3.5 text-primary fill-current" />}
                    {isPlayingPreview ? 'Stop Test' : 'Test Speech'}
                  </button>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {presetVoices.find((v) => v.id === selectedVoiceId)?.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <AvatarPreviewModal
        item={createdVideo}
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
      />
    </div>
  )
}
