'use client'

import { TypographySectionProps } from '@/types'
import { Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ColorPickerField } from './ColorPickerField'

export const TypographySection = ({ formData, updateFormField }: TypographySectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Type className="h-4 w-4 text-purple-500" />
        <h4 className="text-sm font-medium text-foreground">{t('typography', { defaultValue: 'Typography' })}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ColorPickerField
          id="textColor"
          label={t('text_color', { defaultValue: 'Text Color' })}
          value={formData.textColor}
          onChange={(val) => updateFormField('textColor', val)}
          placeholder="var(--input-background)"
        />

        <ColorPickerField
          id="buttonColor"
          label={t('send_button', { defaultValue: 'Send Button' })}
          value={formData.buttonColor}
          onChange={(val) => updateFormField('buttonColor', val)}
          placeholder="var(--cyan-accent)"
        />
      </div>
    </div>
  )
}
