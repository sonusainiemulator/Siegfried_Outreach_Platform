'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Film, ExternalLink, Scissors } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { klingModelOptions } from '@/data/setting'

const CUT_OPTIONS = [
  { value: 'multi-cut-6', label: 'Multi-Shot Sequencing (Up to 6 Cuts)' },
  { value: 'multi-cut-3', label: 'Dynamic Trio Cuts (3 Cuts)' },
  { value: 'single-take-cinematic', label: 'Single-Take Continuous Pan' },
]

export const KlingVideoCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Film className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Kling Video 3.0 Pro
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-red-500/10 text-red-500">
                6-Cut Sequencing
              </Badge>
            </h4>
          </div>
        </div>
        <a
          href="https://klingai.org"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
          title="Kling AI Portal"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Top choice for high-fidelity multi-shot sequencing, storyboarding (up to six camera cuts), and cinematic physics.
      </p>

      <div className="space-y-4">
        <TextInput
          name="kling_api_key"
          label="Kling AI API Key"
          placeholder="kling_secret_..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="kling_model"
            label="Kling Engine"
            options={klingModelOptions}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="kling_mode"
            label="Shot Storyboarding"
            options={CUT_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default KlingVideoCard
