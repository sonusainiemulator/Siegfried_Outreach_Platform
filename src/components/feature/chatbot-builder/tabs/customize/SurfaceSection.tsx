'use client'

import { SurfaceSectionProps } from '@/types'
import { Layout } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ColorPickerField } from './ColorPickerField'

export const SurfaceSection = ({ formData, updateFormField }: SurfaceSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Layout className="h-5 w-5 text-blue-500" />
        <h4 className="text-lg font-medium text-foreground">
          {t('surface_colors', { defaultValue: 'Surface Colors' })}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ColorPickerField
          id="backgroundColor"
          label={t('chat_background', { defaultValue: 'Chat Background' })}
          value={formData.backgroundColor}
          onChange={(val) => updateFormField('backgroundColor', val)}
          placeholder="var(--white)"
        />

        <ColorPickerField
          id="secondaryColor"
          label={t('message_bubble', { defaultValue: 'Message Bubble' })}
          value={formData.secondaryColor}
          onChange={(val) => updateFormField('secondaryColor', val)}
          placeholder="var(--muted)"
        />

        <ColorPickerField
          id="inputBackgroundColor"
          label={t('input_area', { defaultValue: 'Input Area' })}
          value={formData.inputBackgroundColor}
          onChange={(val) => updateFormField('inputBackgroundColor', val)}
          placeholder="var(--white)"
        />
      </div>
    </div>
  )
}
