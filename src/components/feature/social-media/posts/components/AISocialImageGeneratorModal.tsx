'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Loader2,
  Wand2,
  Check,
  Download,
  Plus,
  Layers,
  Image as ImageIcon,
  Palette,
  Ratio,
  CheckCircle2,
  RefreshCw,
  Zap,
  Info,
  Maximize2
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGenerateSocialMediaImageMutation } from '@/redux/api/aiContentApi'
import { getUploadPreviewUrl } from '@/utils'

interface AISocialImageGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGeneratedImage: (image: { url: string; format: string; platform: string }) => void
  initialPlatform?: string
}

// Platforms and their standard supported formats
const PLATFORMS_CONFIG: Record<string, {
  name: string
  icon: string
  color: string
  formats: Array<{
    id: string
    aspectRatio: string
    label: string
    resolution: string
    desc: string
    isDefault?: boolean
  }>
}> = {
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: 'from-pink-500 to-rose-600',
    formats: [
      { id: '1:1', aspectRatio: '1:1', label: 'Square Post', resolution: '1080 × 1080 px', desc: 'Standard feed grid post', isDefault: true },
      { id: '9:16', aspectRatio: '9:16', label: 'Story & Reel Cover', resolution: '1080 × 1920 px', desc: 'Full-screen immersive vertical' },
      { id: '4:5', aspectRatio: '4:5', label: 'Portrait Feed', resolution: '1080 × 1350 px', desc: 'Max height vertical feed post' },
      { id: '1.91:1', aspectRatio: '1.91:1', label: 'Landscape Banner', resolution: '1080 × 566 px', desc: 'Wide panoramic feed post' },
    ]
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: '📢',
    color: 'from-emerald-500 to-teal-600',
    formats: [
      { id: '9:16', aspectRatio: '9:16', label: 'Status Story (24h)', resolution: '1080 × 1920 px', desc: 'Full-screen mobile status update', isDefault: true },
      { id: '1:1', aspectRatio: '1:1', label: 'Channel Update Post', resolution: '1080 × 1080 px', desc: 'High-visibility channel post' },
    ]
  },
  facebook: {
    name: 'Facebook',
    icon: '📰',
    color: 'from-blue-600 to-indigo-700',
    formats: [
      { id: '1.91:1', aspectRatio: '1.91:1', label: 'News Feed Post', resolution: '1200 × 630 px', desc: 'Optimal timeline share preview', isDefault: true },
      { id: '1:1', aspectRatio: '1:1', label: 'Square Post', resolution: '1080 × 1080 px', desc: 'Equal ratio carousel or single post' },
      { id: '9:16', aspectRatio: '9:16', label: 'Facebook Story', resolution: '1080 × 1920 px', desc: 'Vertical story broadcast' },
    ]
  },
  youtube: {
    name: 'YouTube',
    icon: '🎥',
    color: 'from-red-600 to-rose-700',
    formats: [
      { id: '16:9', aspectRatio: '16:9', label: 'Video Thumbnail', resolution: '1280 × 720 px (HD)', desc: 'High-CTR YouTube video thumbnail', isDefault: true },
      { id: '9:16', aspectRatio: '9:16', label: 'YouTube Shorts Cover', resolution: '1080 × 1920 px', desc: 'Shorts vertical cover & frame' },
      { id: '1:1', aspectRatio: '1:1', label: 'Community Post', resolution: '1080 × 1080 px', desc: 'Community tab photo update' },
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'from-sky-600 to-blue-800',
    formats: [
      { id: '1.91:1', aspectRatio: '1.91:1', label: 'Sponsored / Feed Post', resolution: '1200 × 627 px', desc: 'Professional newsfeed layout', isDefault: true },
      { id: '1:1', aspectRatio: '1:1', label: 'Square Post', resolution: '1080 × 1080 px', desc: 'Standard business feed update' },
      { id: '16:9', aspectRatio: '16:9', label: 'Article Banner', resolution: '1200 × 675 px', desc: 'LinkedIn pulse article header' },
    ]
  },
  twitter: {
    name: 'X (Twitter)',
    icon: '𝕏',
    color: 'from-neutral-900 to-neutral-700',
    formats: [
      { id: '16:9', aspectRatio: '16:9', label: 'Single / Multi Tweet', resolution: '1200 × 675 px', desc: 'Optimal non-cropped tweet image', isDefault: true },
      { id: '1:1', aspectRatio: '1:1', label: 'Square Post', resolution: '1080 × 1080 px', desc: 'Square photo attachment' },
    ]
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: 'from-neutral-950 to-neutral-800',
    formats: [
      { id: '9:16', aspectRatio: '9:16', label: 'TikTok Cover / Slide', resolution: '1080 × 1920 px', desc: 'Full screen vertical photo mode', isDefault: true },
    ]
  },
  pinterest: {
    name: 'Pinterest',
    icon: '📌',
    color: 'from-rose-600 to-red-700',
    formats: [
      { id: '2:3', aspectRatio: '2:3', label: 'Standard Pin', resolution: '1000 × 1500 px', desc: 'Highest engagement Pinterest format', isDefault: true },
      { id: '9:16', aspectRatio: '9:16', label: 'Idea Pin / Story', resolution: '1080 × 1920 px', desc: 'Full vertical multi-page idea pin' },
    ]
  }
}

const STYLE_PRESETS = [
  { id: 'photorealistic_4k', label: '📸 Photorealistic 4K', desc: 'Ultra-real studio photography with clean textures' },
  { id: 'cinematic_studio', label: '🎬 Cinematic Studio', desc: 'Dramatic lighting, depth of field & volumetric atmosphere' },
  { id: 'minimalist_modern', label: '✨ Modern Minimalist', desc: 'Pastel aesthetic, clean negative space & sleek design' },
  { id: '3d_pixar_render', label: '🧸 3D Pixar / Octane', desc: 'Cute glossy 3D characters, vibrant render' },
  { id: 'cyberpunk_neon', label: '⚡ Cyberpunk Neon', desc: 'Futuristic synthwave glow with cyan & magenta' },
  { id: 'vintage_analog_film', label: '🎞️ Vintage Film (35mm)', desc: 'Warm Kodak Portra grain with nostalgic feel' },
  { id: 'flat_vector_art', label: '🎨 Vector Graphic', desc: 'Clean lines, modern Behance illustration' },
  { id: 'isometric_illustration', label: '📐 3D Isometric', desc: 'Miniature cute diorama with soft lighting' },
]

export const AISocialImageGeneratorModal: React.FC<AISocialImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddGeneratedImage,
  initialPlatform = 'instagram'
}) => {
  const { t } = useTranslation()
  const [selectedPlatform, setSelectedPlatform] = useState<string>(initialPlatform.toLowerCase())
  const [selectedFormat, setSelectedFormat] = useState<string>('1:1')
  const [selectedStyle, setSelectedStyle] = useState<string>('photorealistic_4k')
  const [prompt, setPrompt] = useState('')
  const [numImages, setNumImages] = useState<number>(1)
  const [generatedResults, setGeneratedResults] = useState<Array<{ url: string; format: string; platform: string }>>([])

  const [generateSocialImage, { isLoading }] = useGenerateSocialMediaImageMutation()

  const currentPlatformConfig = PLATFORMS_CONFIG[selectedPlatform] || PLATFORMS_CONFIG.instagram

  const handlePlatformChange = (pKey: string) => {
    setSelectedPlatform(pKey)
    const config = PLATFORMS_CONFIG[pKey]
    if (config && config.formats.length > 0) {
      const defFormat = config.formats.find(f => f.isDefault) || config.formats[0]
      setSelectedFormat(defFormat.id)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('prompt_required', { defaultValue: 'Please enter a description for the image.' }))
      return
    }

    try {
      const res: any = await generateSocialImage({
        prompt: prompt.trim(),
        platform: selectedPlatform,
        format: selectedFormat,
        style: selectedStyle,
        numImages,
      }).unwrap()

      if (res?.data?.images?.length > 0) {
        const newImages = res.data.images.map((img: any) => ({
          url: img.url,
          format: selectedFormat,
          platform: selectedPlatform,
        }))
        setGeneratedResults(prev => [...newImages, ...prev])
        toast.success(t('images_generated_success', { defaultValue: 'AI Social image generated in official format!' }))
      }
    } catch (err: any) {
      console.error('Image generation error:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to generate social media image.')
    }
  }

  const handleAttachImage = (img: { url: string; format: string; platform: string }) => {
    onAddGeneratedImage(img)
    toast.success(t('attached_to_post', { defaultValue: 'Image added to Post Composer slides!' }))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-white dark:bg-[#0c101d] border border-neutral-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span>{t('ai_social_image_architect', { defaultValue: 'AI Social Media Image Studio' })}</span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-bold">
                  Standard Format Engine
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('ai_social_image_desc', { defaultValue: 'Generate pixel-perfect, tailored AI images automatically formatted to official social media dimensions.' })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* STEP 1: Select Platform */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-title-color dark:text-gray-200">
              1. {t('select_target_network', { defaultValue: 'Select Target Network' })}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {Object.entries(PLATFORMS_CONFIG).map(([key, item]) => {
                const isSelected = selectedPlatform === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePlatformChange(key)}
                    className={cn(
                      'p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group text-xs font-semibold',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/30 scale-105'
                        : 'border-neutral-200 dark:border-white/10 hover:border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-white dark:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white'
                    )}
                  >
                    <span className="text-xl transition-transform group-hover:scale-110">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: Standard Format & Aspect Ratio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-title-color dark:text-gray-200 flex items-center gap-1.5">
                <Ratio className="w-3.5 h-3.5 text-primary" />
                <span>2. {t('choose_format_dimension', { defaultValue: 'Official Format & Dimension for ' }) + currentPlatformConfig.name}</span>
              </Label>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Auto-calibrated pixel resolution</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {currentPlatformConfig.formats.map((f) => {
                const isSelected = selectedFormat === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFormat(f.id)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-xs'
                        : 'border-neutral-200 dark:border-white/10 hover:border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-white dark:bg-white/10'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-title-color dark:text-white group-hover:text-primary">{f.label}</span>
                      <Badge variant="outline" className={cn('text-[10px] font-mono font-bold', isSelected ? 'bg-primary text-white border-primary' : 'bg-neutral-100 dark:bg-white/10')}>
                        {f.aspectRatio}
                      </Badge>
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{f.resolution}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{f.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* LEFT: Prompt & Style Settings */}
            <div className="md:col-span-7 space-y-4">
              {/* Image Description Prompt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                    3. {t('describe_image_vision', { defaultValue: 'Describe Your Desired Visual' })} *
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      const samplePrompts = [
                        'Futuristic AI SaaS holographic command center dashboard floating in dark aesthetic office',
                        'Luxury modern smartphone displaying vibrant social media marketing growth analytics',
                        'Sleek minimalist product photography of organic energy drink on stone podium with water ripples',
                        'Trendy young entrepreneur smiling working with laptop in sunlit botanical cafe'
                      ]
                      setPrompt(samplePrompts[Math.floor(Math.random() * samplePrompts.length)])
                    }}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Inspire Prompt</span>
                  </button>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Modern minimalist workspace with glowing laptop, coffee cup, and soft morning studio sunlight..."
                  rows={4}
                  className="rounded-xl border-neutral-200 dark:border-white/10 text-xs bg-neutral-50 dark:bg-white/5 focus:ring-primary/20 leading-relaxed font-sans"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                  4. {t('art_style_preset', { defaultValue: 'Art Direction & Aesthetic Style' })}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_PRESETS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStyle(st.id)}
                      className={cn(
                        'p-2 rounded-xl border text-left transition-all cursor-pointer text-xs font-medium',
                        selectedStyle === st.id
                          ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-2 ring-purple-500/20'
                          : 'border-neutral-200 dark:border-white/10 hover:border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-white dark:bg-white/10'
                      )}
                    >
                      <div className="font-bold truncate">{st.label}</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/25 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('rendering_standard_image', { defaultValue: 'Rendering high-resolution standard visual...' })}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('generate_social_image_button', { defaultValue: 'Generate High-Res Standard Image' })}</span>
                  </>
                )}
              </Button>
            </div>

            {/* RIGHT: Generated Output Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-title-color dark:text-gray-200">
                  {t('generated_visuals', { defaultValue: 'Generated Visuals' })} ({generatedResults.length})
                </Label>
                {generatedResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setGeneratedResults([])}
                    className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-red-500 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {generatedResults.length > 0 ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                  {generatedResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c101d] space-y-2.5 shadow-sm group hover:border-primary/50 transition-all"
                    >
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                        <Image
                          src={getUploadPreviewUrl(item.url)}
                          alt="AI Social Output"
                          fill
                          className="object-cover transition-transform group-hover:scale-105 duration-300"
                          unoptimized
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase">
                          {item.format} • {item.platform}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => handleAttachImage(item)}
                          className="flex-1 h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('add_to_post_slides', { defaultValue: 'Add to Post Slides' })}</span>
                        </Button>

                        <a
                          href={getUploadPreviewUrl(item.url)}
                          target="_blank"
                          download="social-image.png"
                          rel="noreferrer"
                          className="h-9 w-9 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white transition-all shrink-0"
                          title="Download Image"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 text-center text-neutral-500 dark:text-neutral-400 text-xs space-y-2 bg-neutral-50 dark:bg-white/5 h-[320px] flex flex-col items-center justify-center">
                  <ImageIcon className="w-10 h-10 opacity-30 text-purple-500" />
                  <p className="font-semibold text-neutral-900 dark:text-white">No image generated yet</p>
                  <p className="text-[11px] max-w-xs">
                    Choose your target network and official format above, enter a prompt, and click Generate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AISocialImageGeneratorModal
