'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Video, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

export const HeyGenCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Video className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              HeyGen Video SDK
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-violet-500/10 text-violet-500">
                Avatar v2
              </Badge>
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Generate photorealistic talking avatars and AI presenter videos with high-accuracy lip-sync.
      </p>

      <div className="space-y-4">
        <TextInput
          name="heygen_api_key"
          label="HeyGen API Key"
          placeholder="api_key_..."
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput
            name="heygen_avatar_id"
            label="Default Avatar ID"
            placeholder="josh_lite_20230714"
            className="bg-background/40 h-10 rounded-[8px] border-border/40 text-xs"
          />
          <TextInput
            name="heygen_voice_id"
            label="Default Voice ID"
            placeholder="en-US-JennyNeural"
            className="bg-background/40 h-10 rounded-[8px] border-border/40 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default HeyGenCard
