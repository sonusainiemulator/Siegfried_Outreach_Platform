'use client'

import React from 'react'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Sparkles, Palette } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

export const ImagenCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border border-border/40 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Palette className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-1.5">
              Google Imagen 3
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-amber-500/10 text-amber-500">
                HDR Pro
              </Badge>
            </h4>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 text-wrap">
        Google state-of-the-art image generator with photorealism and spatial fidelity.
      </p>

      <div className="space-y-4">
        <TextInput
          name="imagen_api_key"
          label="Google Imagen / Vertex Key"
          placeholder="AIzaSy... (or uses Gemini key)"
          type="password"
          className="bg-background/40 h-12 rounded-[8px] border-border/40"
        />
      </div>
    </div>
  )
}

export default ImagenCard
