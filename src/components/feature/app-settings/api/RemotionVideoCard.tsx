'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Clapperboard, Film, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

export const RemotionVideoCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Film className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Remotion Video Engine
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-cyan-500/10 text-cyan-500">
                Kinetic Reels
              </Badge>
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Programmatic video rendering for social Reels, word-by-word kinetic captions, and motion typography.
      </p>

      <div className="space-y-4">
        <TextInput
          name="remotion_render_url"
          label="Remotion Render Server URL"
          placeholder="https://remotion.yourdomain.com/render (or leave empty for client preview)"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />
      </div>
    </div>
  )
}

export default RemotionVideoCard
