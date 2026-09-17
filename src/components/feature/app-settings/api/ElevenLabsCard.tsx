'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Mic, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { elevenlabsModelOptions } from '@/data/setting'

export const ElevenLabsCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Mic className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              ElevenLabs AI
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-amber-500/10 text-amber-500">
                Voice & Dubbing
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://elevenlabs.io/app/speech-synthesis"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-amber-500 transition-colors p-1"
          title="ElevenLabs Portal"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Industry gold standard for ultra-realistic voice cloning, dynamic multilingual voiceovers, and expressive speech synthesis.
      </p>

      <div className="space-y-4">
        <TextInput
          name="elevenlabs_api_key"
          label="ElevenLabs API Key"
          placeholder="xi-api-key_..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput
            name="elevenlabs_voice_id"
            label="Default Voice ID"
            placeholder="21m00Tcm4TlvDq8ikWAM (Rachel)"
            className="bg-background/40 h-10 rounded-[8px] border-border/40 text-xs"
          />
          <SelectField
            name="elevenlabs_model_id"
            label="Speech Engine Model"
            options={elevenlabsModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default ElevenLabsCard
