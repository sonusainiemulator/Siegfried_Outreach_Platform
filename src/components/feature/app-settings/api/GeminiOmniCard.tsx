'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Sparkles, ExternalLink, Zap, DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { geminiOmniModelOptions } from '@/data/setting'

const AUDIO_MODALITY_OPTIONS = [
  { value: 'native-multimodal', label: 'Native Audio & Multimodal Streaming' },
  { value: 'high-speed-text', label: 'Ultra High-Speed Text & Vision' },
]

export const GeminiOmniCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Gemini Omni Flash
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-cyan-500/10 text-cyan-500">
                Budget & Voice
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://aistudio.google.com"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-cyan-500 transition-colors p-1"
          title="Google AI Studio"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Top budget-friendly option, scoring high in user preference and voice quality at a very low credit cost.
      </p>

      <div className="space-y-4">
        <TextInput
          name="gemini_omni_api_key"
          label="Gemini Omni API Key (or uses Default Gemini Key)"
          placeholder="AIzaSy... (leave empty to reuse Gemini Key)"
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="gemini_omni_model"
            label="Omni Model Flavor"
            options={geminiOmniModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="gemini_omni_modality"
            label="Stream Modality"
            options={AUDIO_MODALITY_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default GeminiOmniCard
