'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Sparkles, ExternalLink, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { veoModelOptions } from '@/data/setting'

const AUDIO_OPTIONS = [
  { value: 'enabled', label: 'Native Audio Generation & Sound Sync (Default)' },
  { value: 'silent', label: 'Silent Video Only (Faster Render)' },
]

export const GoogleVeoCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Video className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Google Veo 3.1
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-blue-500/10 text-blue-500">
                Photorealism & Audio
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://deepmind.google/technologies/veo/"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-blue-500 transition-colors p-1"
          title="Google DeepMind Veo"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Exceptional for photorealistic people, fast iteration speeds, and native audio generation with high visual consistency.
      </p>

      <div className="space-y-4">
        <TextInput
          name="veo_api_key"
          label="Google Cloud / Veo API Key (or uses Gemini Key)"
          placeholder="AIzaSy... (leave empty to reuse Gemini Key)"
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="veo_model"
            label="Veo Engine Mode"
            options={veoModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="veo_audio_mode"
            label="Native Audio Sync"
            options={AUDIO_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default GoogleVeoCard
