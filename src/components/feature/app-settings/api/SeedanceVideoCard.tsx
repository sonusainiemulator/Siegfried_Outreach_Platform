'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Flame, ExternalLink, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { seedanceModelOptions } from '@/data/setting'

const REFERENCE_OPTIONS = [
  { value: 'audio-video-reference', label: 'Native Audio & Video Reference (Full Sync)' },
  { value: 'video-motion-only', label: 'Video Motion Reference Only' },
  { value: 'audio-driven-action', label: 'Audio-Driven Action & Rhythm' },
]

export const SeedanceVideoCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Seedance 2.0
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-orange-500/10 text-orange-500">
                Physics & Fight
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://seedance.ai"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-orange-500 transition-colors p-1"
          title="Seedance Portal"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Best overall for realistic physics, prompt adherence, fight choreography, and native audio/video reference handling.
      </p>

      <div className="space-y-4">
        <TextInput
          name="seedance_api_key"
          label="Seedance API Key"
          placeholder="sd2_live_..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="seedance_model"
            label="Model Version"
            options={seedanceModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="seedance_reference_mode"
            label="Reference Handling"
            options={REFERENCE_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default SeedanceVideoCard
