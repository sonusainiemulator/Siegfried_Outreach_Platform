'use client'

import React from 'react'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Sliders, Video, Mic, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { videoProviders, voiceProviders, imageProviders } from '@/data/setting'

export const DefaultMediaEnginesCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sliders className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Default Media Engines
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-primary/10 text-primary">
                Multi-Modal Routing
              </Badge>
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Choose default AI engines across Video generation, Voice synthesis, and Image generation workflows.
      </p>

      <div className="space-y-4">
        <SelectField
          name="default_video_provider"
          label="Default Video AI Engine"
          options={videoProviders}
          className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="default_voice_provider"
            label="Default Voice AI Engine"
            options={voiceProviders}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="default_image_provider"
            label="Default Image AI Engine"
            options={imageProviders}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default DefaultMediaEnginesCard
