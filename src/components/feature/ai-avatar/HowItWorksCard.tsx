'use client'

import React from 'react'
import {
  Clock,
  Sparkles,
  Mic,
  BadgeDollarSign,
  Film
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export const HowItWorksCard: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            HOW IT WORKS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Step 1 */}
          <div className="p-4 rounded-border-radius inner-card border border-glass-border flex flex-col justify-between h-36">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-title-color">
                ENTER YOUR TEXT
              </span>
            </div>
            <div className="p-2.5 rounded-[8px] bg-black/5 dark:bg-white/5 text-xs text-subtitle-color line-clamp-2 italic">
              &quot;Explain the benefits of a healthy lifestyle in simple words.&quot;
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-border-radius inner-card border border-glass-border flex flex-col justify-between h-36">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-title-color">
                CHOOSE IMAGE
              </span>
            </div>
            <div className="h-16 w-full rounded-[8px] overflow-hidden relative border border-glass-border">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&auto=format&fit=crop&q=80"
                alt="Selected Persona"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-border-radius inner-card border border-glass-border flex flex-col justify-between h-36">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-title-color">
                SELECT LANGUAGE &amp; VOICE
              </span>
            </div>
            <div className="space-y-1">
              <div className="px-2.5 py-1 rounded-[6px] bg-black/5 dark:bg-white/5 text-xs text-subtitle-color flex justify-between">
                <span>🇺🇸 English</span>
                <span className="text-[10px]">▼</span>
              </div>
              <div className="px-2.5 py-1 rounded-[6px] bg-black/5 dark:bg-white/5 text-xs text-subtitle-color flex justify-between">
                <span>🎙️ Emma (Female)</span>
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-border-radius inner-card border border-primary/30 flex flex-col justify-between h-36 text-center items-center">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                GENERATE VIDEO
              </span>
            </div>
            <div className="p-2.5 rounded-full bg-primary/10 text-primary">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[11px] font-semibold text-primary">HD Ready Video</span>
          </div>
        </div>
      </Card>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-border-radius inner-card glass-dark-card border border-glass-border flex items-center gap-3">
          <div className="p-2.5 rounded-[8px] bg-primary/10 text-primary">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-title-color block uppercase">UP TO 1 MINUTE</span>
            <span className="text-[11px] text-subtitle-color">DURATION PER VIDEO</span>
          </div>
        </div>

        <div className="p-4 rounded-border-radius inner-card glass-dark-card border border-glass-border flex items-center gap-3">
          <div className="p-2.5 rounded-[8px] bg-primary/10 text-primary">
            <span className="font-bold text-sm">HD</span>
          </div>
          <div>
            <span className="text-xs font-bold text-title-color block uppercase">HD QUALITY</span>
            <span className="text-[11px] text-subtitle-color">CRYSTAL CLEAR OUTPUT</span>
          </div>
        </div>

        <div className="p-4 rounded-border-radius inner-card glass-dark-card border border-glass-border flex items-center gap-3">
          <div className="p-2.5 rounded-[8px] bg-primary/10 text-primary">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-title-color block uppercase">NATURAL VOICES</span>
            <span className="text-[11px] text-subtitle-color">MULTIPLE LANGUAGES</span>
          </div>
        </div>

        <div className="p-4 rounded-border-radius inner-card glass-dark-card border border-glass-border flex items-center gap-3">
          <div className="p-2.5 rounded-[8px] bg-emerald-500/10 text-emerald-500">
            <BadgeDollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-title-color block uppercase">VERY LOW COST</span>
            <span className="text-[11px] text-subtitle-color">1 CREDIT PER VIDEO</span>
          </div>
        </div>
      </div>
    </div>
  )
}
