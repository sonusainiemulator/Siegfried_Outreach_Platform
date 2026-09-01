'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import SelectField from '@/components/shared/form-fields/SelectField'
import { Image as ImageIcon, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

const QUALITY_OPTIONS = [
  { value: 'standard', label: 'Standard Quality (Fast)' },
  { value: 'hd', label: 'HD Quality (Ultra Detail)' },
]

const STYLE_OPTIONS = [
  { value: 'vivid', label: 'Vivid (Hyper-realistic & Dramatic)' },
  { value: 'natural', label: 'Natural (Subtle & Authentic)' },
]

export const DallE3ImageCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              DALL-E 3 & GPT-4o Image
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-pink-500/10 text-pink-500">
                1024x1792
              </Badge>
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        OpenAI flagship image generation supporting 1:1, 9:16 portrait Reels, and 16:9 landscape social assets.
      </p>

      <div className="space-y-4">
        <TextInput
          name="openai_image_api_key"
          label="OpenAI Image API Key (Optional if OpenAI key set)"
          placeholder="sk-proj-..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            name="openai_image_quality"
            label="Default Quality"
            options={QUALITY_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
          <SelectField
            name="openai_image_style"
            label="Default Style"
            options={STYLE_OPTIONS}
            className="h-10 rounded-[8px] inner-card w-full px-3 py-2 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default DallE3ImageCard
