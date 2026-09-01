'use client'

import React, { useState } from 'react'
import {
  useGetAvatarOptionsQuery,
  useGenerateProductVideoMutation,
  AvatarItem,
  ProductTemplate
} from '@/redux/api/avatarApi'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Card } from '@/components/ui/card'
import {
  ShoppingBag,
  RefreshCw,
  Video,
  Play,
  Pause,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AvatarPreviewModal } from './AvatarPreviewModal'

export const ProductShowcaseStudio: React.FC = () => {
  const { data: optionsData } = useGetAvatarOptionsQuery()
  const [generateProductVideo, { isLoading: isGenerating }] = useGenerateProductVideoMutation()

  const [productName, setProductName] = useState('Lumina Pro Wireless Earbuds')
  const [productType, setProductType] = useState('Electronics & Audio')
  const [productImageUrl, setProductImageUrl] = useState('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80')
  const [selectedTemplateId, setSelectedTemplateId] = useState('ecommerce-ad')
  const [script, setScript] = useState(
    'Stop scrolling! Meet the all-new Lumina Pro Earbuds with active noise cancellation and 40-hour battery life. Grab yours today at 50% OFF!'
  )
  const [ctaText, setCtaText] = useState('Shop Now - 50% OFF')
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const [createdItem, setCreatedItem] = useState<AvatarItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const productTemplates = optionsData?.productTemplates || []

  const handleTemplateChange = (tpl: ProductTemplate) => {
    setSelectedTemplateId(tpl.id)
    if (tpl.defaultScript) setScript(tpl.defaultScript)
  }

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return
    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(script)
    utterance.rate = 1.05
    setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim()) {
      toast.error('Product name is required')
      return
    }

    try {
      const res = await generateProductVideo({
        productName: productName.trim(),
        productType,
        productImageUrl,
        script: script.trim(),
        template: selectedTemplateId,
        ctaText,
        aspectRatio
      }).unwrap()

      toast.success('Product Showcase Video generated!')
      setCreatedItem(res.data)
      setPreviewOpen(true)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate product video')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Product & Script Form */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm space-y-4">
            <Label className="text-sm font-bold text-title-color flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              1. Product Information &amp; Photo
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Product Name</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. HydroGlow Serum"
                  className="h-10 inner-card rounded-[8px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Product Category</Label>
                <Input
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Skincare / Beauty"
                  className="h-10 inner-card rounded-[8px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-subtitle-color">Product Image URL</Label>
              <Input
                value={productImageUrl}
                onChange={(e) => setProductImageUrl(e.target.value)}
                placeholder="https://..."
                className="h-10 inner-card rounded-[8px] font-mono text-xs"
              />
            </div>
          </Card>

          <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm space-y-3">
            <Label className="text-sm font-bold text-title-color flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              2. Select Marketing Video Template
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {productTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleTemplateChange(tpl)}
                    className={cn(
                      'p-3.5 rounded-[8px] border text-left cursor-pointer transition-all flex flex-col justify-between',
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-xs'
                        : 'border-glass-border inner-card hover:border-emerald-500/40'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-title-color">{tpl.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-background font-bold text-emerald-600 dark:text-emerald-400">
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-subtitle-color">{tpl.desc}</p>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-title-color">3. Commercial Script &amp; Call To Action</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggleSpeech}
                className="h-7 text-xs rounded-[6px] gap-1 border-primary/30 text-primary cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                {isPlayingAudio ? 'Stop' : 'Listen Script'}
              </Button>
            </div>

            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={3}
              className="inner-card rounded-[8px] text-sm p-3"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">CTA Banner Text</Label>
                <Input
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Shop Now - Free Shipping"
                  className="h-10 inner-card rounded-[8px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Video Format</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={cn(
                      'flex-1 py-2 rounded-[8px] text-xs font-bold border transition-all cursor-pointer',
                      aspectRatio === '9:16' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-glass-border inner-card'
                    )}
                  >
                    9:16 Reel / TikTok
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={cn(
                      'flex-1 py-2 rounded-[8px] text-xs font-bold border transition-all cursor-pointer',
                      aspectRatio === '16:9' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-glass-border inner-card'
                    )}
                  >
                    16:9 Landscape
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            disabled={isGenerating || !productName.trim()}
            className="w-full h-12 rounded-[8px] text-sm font-bold uppercase tracking-wider btn-color text-white shadow-md cursor-pointer transition-all gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Synthesizing Product Commercial...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 fill-current" />
                Generate Product Commercial Video (1 Credit)
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Right: Compact Live Commercial Stage */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-6">
        <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-4 md:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-glass-border">
            <h3 className="font-bold text-xs uppercase tracking-wider text-title-color flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-500" />
              Live Commercial Stage
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
              {aspectRatio}
            </span>
          </div>

          <div className="flex justify-center items-center py-1">
            <div
              className={cn(
                'w-full max-w-[320px] rounded-[16px] bg-black relative overflow-hidden border border-glass-border shadow-xl flex flex-col justify-between p-3.5 transition-all',
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[440px]' : 'aspect-video max-h-[220px]'
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img
                  src={productImageUrl}
                  alt={productName}
                  className="max-h-[85%] max-w-[85%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-md">
                  HOT DEAL
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold border border-white/20">
                  {productType}
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <div className="p-2 rounded-[8px] bg-black/75 backdrop-blur-md border border-white/15 text-white text-[11px] leading-snug line-clamp-2 text-center">
                  &quot;{script}&quot;
                </div>
                <div className="w-full py-1.5 rounded-[6px] btn-color text-white text-[11px] font-bold text-center shadow-md uppercase tracking-wider">
                  {ctaText}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <AvatarPreviewModal
        item={createdItem}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  )
}
