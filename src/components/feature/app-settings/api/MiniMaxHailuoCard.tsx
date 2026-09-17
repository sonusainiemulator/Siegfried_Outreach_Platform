'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Box, ExternalLink, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { hailuoModelOptions } from '@/data/setting'

const ASPECT_OPTIONS = [
  { value: '16:9', label: '16:9 Landscape (YouTube & Web)' },
  { value: '9:16', label: '9:16 Vertical Reel (TikTok & Insta)' },
  { value: '1:1', label: '1:1 Square (E-Commerce Feed)' },
]

export const MiniMaxHailuoCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Package className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              MiniMax Hailuo 2.3
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-purple-500/10 text-purple-500">
                Product & Motion
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://hailuoai.video"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-purple-500 transition-colors p-1"
          title="MiniMax Hailuo Portal"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Highly effective for product shots, animation, and expressive character movements with dynamic micro-physics.
      </p>

      <div className="space-y-4">
        <TextInput
          name="hailuo_api_key"
          label="MiniMax / Hailuo API Key"
          placeholder="mm_key_..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="hailuo_model"
            label="Hailuo Engine"
            options={hailuoModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="hailuo_aspect"
            label="Default Aspect Ratio"
            options={ASPECT_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default MiniMaxHailuoCard
