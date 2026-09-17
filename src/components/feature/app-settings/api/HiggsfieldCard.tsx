'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Clapperboard, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { higgsfieldModelOptions } from '@/data/setting'

export const HiggsfieldCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Clapperboard className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Higgsfield AI
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-emerald-500/10 text-emerald-500">
                Cinematic DoP
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://higgsfield.ai"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-emerald-500 transition-colors p-1"
          title="Higgsfield Portal"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Cinematic camera movement controls, 3D pan/zoom trajectory planning, and stylized visual storytelling for creative directors.
      </p>

      <div className="space-y-4">
        <TextInput
          name="higgsfield_api_key"
          label="Higgsfield API Key"
          placeholder="hf_secret_..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 gap-3">
          <SelectField
            name="higgsfield_model"
            label="Cinematic Video Model"
            options={higgsfieldModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default HiggsfieldCard
