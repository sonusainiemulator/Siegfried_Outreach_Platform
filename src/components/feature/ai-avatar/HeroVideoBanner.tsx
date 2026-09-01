'use client'

import React from 'react'
import {
  FileText,
  Image as ImageIcon,
  Globe,
  Mic,
  Sparkles,
  BadgeDollarSign,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export const HeroVideoBanner: React.FC = () => {
  const featureIcons = [
    { icon: <FileText className="w-4 h-4 text-primary" />, label: 'Text to Video' },
    { icon: <ImageIcon className="w-4 h-4 text-primary" />, label: 'Image to Video' },
    { icon: <Globe className="w-4 h-4 text-primary" />, label: 'Multi Language' },
    { icon: <Mic className="w-4 h-4 text-primary" />, label: 'Realistic Voices' },
    { icon: <span className="font-bold text-xs text-primary border border-primary/40 px-1 rounded">HD</span>, label: 'HD Quality' },
    { icon: <BadgeDollarSign className="w-4 h-4 text-emerald-500" />, label: 'Low Cost' },
  ]

  return (
    <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-6 md:p-7 relative overflow-hidden shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Headline & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            NEW AI FEATURE
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-title-color uppercase leading-tight">
              AI TALKING <span className="text-mix-primary decoration-clone bg-clip-text">VIDEO STUDIO</span>
            </h2>
            <p className="text-xs md:text-sm text-subtitle-color leading-relaxed">
              Turn your <span className="font-semibold text-title-color">text scripts</span> and <span className="font-semibold text-title-color">photos</span> into realistic talking videos with lip-sync. Explain anything in any language with AI – up to <span className="font-bold text-primary">1 minute</span>, in <span className="font-bold text-title-color">HD quality</span>, at a <span className="font-bold text-emerald-500">very low cost</span>.
            </p>
          </div>
        </div>

        {/* Right: Feature Badges */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2.5 shrink-0">
          {featureIcons.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-2.5 rounded-border-radius inner-card border border-glass-border flex flex-col items-center justify-center text-center gap-1 transition-all hover:scale-105"
            >
              {item.icon}
              <span className="text-[11px] font-medium text-subtitle-color leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
