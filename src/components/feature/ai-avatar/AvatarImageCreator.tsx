'use client'

import React, { useState } from 'react'
import {
  useGetAvatarOptionsQuery,
  useGenerateAvatarImageMutation,
  AvatarItem,
  AvatarStyle
} from '@/redux/api/avatarApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { Sparkles, Wand2, RefreshCw, Download, Video as VideoIcon, Check, Eye, Layers, ShieldCheck, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AvatarPreviewModal } from './AvatarPreviewModal'

interface AvatarImageCreatorProps {
  onAvatarCreated?: (avatar: AvatarItem) => void
  onSwitchToVideoTab?: (avatar: AvatarItem) => void
}

const SAMPLE_PROMPTS = [
  'Tech startup founder with a confident smile, wearing a dark blazer in a modern high-tech office',
  'Creative 3D character with animated expressive eyes, friendly smile, and vibrant modern hoodie',
  'Cyberpunk software engineer with neon blue headset, dark techwear jacket, and subtle glowing holographic UI',
  'Professional corporate advisor in business attire, clean minimalist background, sharp studio photography'
]

const GENDER_OPTIONS = [
  { id: '', label: 'Any Gender' },
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'non-binary', label: 'Non-Binary' }
]

const AGE_OPTIONS = [
  { id: '', label: 'Default Age' },
  { id: 'young adult (20s)', label: 'Young Adult (20s)' },
  { id: 'adult (30s-40s)', label: 'Adult (30s-40s)' },
  { id: 'mature (50s+)', label: 'Mature (50s+)' }
]

const EXPRESSION_OPTIONS = [
  { id: 'warm confident smile', label: 'Confident Smile' },
  { id: 'friendly approachable', label: 'Friendly & Approachable' },
  { id: 'serious professional', label: 'Serious & Focused' },
  { id: 'energetic positive', label: 'Energetic & Enthusiastic' }
]

const LIGHTING_OPTIONS = [
  { id: 'soft studio photography', label: 'Studio Softbox' },
  { id: 'dramatic cinematic rim', label: 'Cinematic Rim Light' },
  { id: 'neon ambient glow', label: 'Neon Cyber Glow' },
  { id: 'natural golden hour', label: 'Golden Hour' }
]

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square (Avatar)', desc: '768 × 768' },
  { id: '9:16', label: '9:16 Vertical (Reel/Story)', desc: '576 × 1024' },
  { id: '16:9', label: '16:9 Landscape (Video)', desc: '1024 × 576' },
  { id: '4:5', label: '4:5 Portrait (Feed)', desc: '640 × 800' }
]

export const AvatarImageCreator: React.FC<AvatarImageCreatorProps> = ({
  onAvatarCreated,
  onSwitchToVideoTab,
}) => {
  const { data: optionsData, isLoading: isLoadingOptions } = useGetAvatarOptionsQuery()
  const [generateAvatar, { isLoading: isGenerating }] = useGenerateAvatarImageMutation()

  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('photorealistic')
  const [selectedRatio, setSelectedRatio] = useState('1:1')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [expression, setExpression] = useState('warm confident smile')
  const [lighting, setLighting] = useState('soft studio photography')
  const [attire, setAttire] = useState('')

  const [latestAvatar, setLatestAvatar] = useState<AvatarItem | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  const styles = optionsData?.styles || []

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description first before enhancing')
      return
    }
    const enhancements = [
      '8k resolution, photorealistic masterpiece, highly detailed face, symmetrical features, flawless skin texture, elegant studio depth of field',
      'ultra high definition, crystal clear focus, professional portrait photography, volumetric lighting, rich color palette',
      'award-winning character design, expressive eyes, perfectly balanced composition, cinematic atmosphere'
    ]
    const randomEnhance = enhancements[Math.floor(Math.random() * enhancements.length)]
    setPrompt(prev => `${prev.trim()}, ${randomEnhance}`)
    toast.success('Prompt enhanced with studio detail modifiers!')
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error('Please provide a prompt describing your avatar')
      return
    }

    try {
      const res = await generateAvatar({
        prompt: prompt.trim(),
        style: selectedStyle,
        aspectRatio: selectedRatio,
        gender,
        age,
        expression,
        lighting,
        attire: attire.trim() || undefined,
      }).unwrap()

      toast.success(res.message || 'Avatar generated successfully!')
      setLatestAvatar(res.data)
      if (onAvatarCreated) onAvatarCreated(res.data)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate avatar. Please check your API key in Settings.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Generation Controls */}
      <div className="lg:col-span-7 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Prompt Box Card */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Describe Your Avatar
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEnhancePrompt}
                className="h-8 gap-1.5 text-xs rounded-lg border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                AI Enhance Prompt
              </Button>
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Friendly tech lead in navy blue suit with soft studio lighting and confident expression..."
              rows={3}
              className="resize-none rounded-xl border-border bg-secondary/30 focus:bg-background text-sm leading-relaxed p-3.5"
            />

            {/* Quick Inspiration Chips */}
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Quick Inspiration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROMPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-secondary hover:bg-primary/15 hover:text-primary transition-colors text-muted-foreground truncate max-w-full cursor-pointer text-left"
                  >
                    {sample.length > 55 ? `${sample.slice(0, 52)}...` : sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Selector Grid */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Choose Art & Visual Style
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {styles.map((style) => {
                const isSelected = selectedStyle === style.id
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      'p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group text-left',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary'
                        : 'border-border/60 bg-secondary/20 hover:border-border hover:bg-secondary/40'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-foreground">{style.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
                        {style.description}
                      </p>
                    </div>
                    <span className="mt-2 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-background/80 w-fit text-muted-foreground">
                      {style.category}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Fine Tuning Controls (Gender, Age, Expression, Lighting, Aspect Ratio) */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4">
            <label className="text-sm font-bold text-foreground block">
              Character Details & Composition
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Gender</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Age Group</span>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {AGE_OPTIONS.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>

              {/* Expression */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Facial Expression</span>
                <select
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {EXPRESSION_OPTIONS.map((exp) => (
                    <option key={exp.id} value={exp.id}>{exp.label}</option>
                  ))}
                </select>
              </div>

              {/* Lighting */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Studio Lighting</span>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {LIGHTING_OPTIONS.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aspect Ratio Cards */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-muted-foreground block mb-2">Aspect Ratio & Canvas Size</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ASPECT_RATIOS.map((ratio) => {
                  const isSelected = selectedRatio === ratio.id
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setSelectedRatio(ratio.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-center transition-all cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                          : 'border-border/60 bg-secondary/20 hover:bg-secondary/40 text-foreground'
                      )}
                    >
                      <span className="text-xs block font-bold">{ratio.id}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{ratio.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white shadow-lg cursor-pointer transition-all gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Synthesizing AI Avatar...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                Generate AI Avatar (1 Credit)
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Right: Live Preview & Action Hub */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Generated Output
            </h3>
            {latestAvatar && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                Ready
              </span>
            )}
          </div>

          {/* Visual Container */}
          <div className="w-full min-h-[380px] rounded-xl bg-secondary/30 border border-dashed border-border/80 flex flex-col items-center justify-center relative overflow-hidden group">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Rendering High-Resolution Avatar</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Applying {selectedStyle} neural style transfer and lighting shaders...
                  </p>
                </div>
              </div>
            ) : latestAvatar ? (
              <div className="w-full h-full relative flex items-center justify-center p-2">
                <img
                  src={latestAvatar.content}
                  alt={latestAvatar.title}
                  className="max-h-[380px] w-auto object-contain rounded-lg shadow-lg cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                  onClick={() => setPreviewModalOpen(true)}
                />
                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="absolute bottom-4 right-4 p-2 rounded-xl bg-black/70 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                  title="Expand Full Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 text-muted-foreground">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <Sparkles className="w-8 h-8 text-primary/60" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">No Avatar Generated Yet</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Type a prompt on the left and click &quot;Generate AI Avatar&quot; to create your first studio portrait.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions after Generation */}
          {latestAvatar && (
            <div className="space-y-2 pt-2">
              {onSwitchToVideoTab && (
                <Button
                  onClick={() => onSwitchToVideoTab(latestAvatar)}
                  className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 text-white font-semibold rounded-xl gap-2 shadow-md cursor-pointer"
                >
                  <VideoIcon className="w-4 h-4" />
                  Make this Avatar Talk (Video Studio)
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = latestAvatar.content
                    a.download = `avatar-${Date.now()}.png`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }}
                  variant="outline"
                  className="flex-1 rounded-xl gap-2 border-border cursor-pointer hover:bg-secondary"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
                <Button
                  onClick={() => setPreviewModalOpen(true)}
                  variant="outline"
                  className="flex-1 rounded-xl gap-2 border-border cursor-pointer hover:bg-secondary"
                >
                  <Eye className="w-4 h-4" />
                  View Fullscreen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Preview */}
      <AvatarPreviewModal
        item={latestAvatar}
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        onUseInVideo={onSwitchToVideoTab}
      />
    </div>
  )
}
