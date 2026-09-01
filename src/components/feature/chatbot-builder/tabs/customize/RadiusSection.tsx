'use client'

import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { radiusOptions } from '@/data/aiChatbot'
import { cn } from '@/lib/utils'
import { RadiusSectionProps } from '@/types/chatbot'
import { useTranslation } from 'react-i18next'

export const RadiusSection = ({ formData, updateFormField }: RadiusSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4 bg-muted/5 sm:p-6 p-4 flex flex-col glass-card glass-dark-card rounded-border-radius border border-border/20">
      <Label className="text-sm font-medium text-foreground">
        {t('border_radius', { defaultValue: 'Border Radius' })}
      </Label>
      <div className="flex flex-wrap gap-2">
        {radiusOptions.map((radius) => (
          <Button
            key={radius}
            variant="ghost"
            onClick={() => updateFormField('borderRadius', radius)}
            className={cn(
              'px-4 py-2 border text-xs font-bold transition-all duration-200 rounded-lg h-auto',
              formData.borderRadius === radius
                ? 'border-primary bg-primary/10 text-primary shadow-sm hover:bg-primary/20'
                : 'border-border glass-dark-card bg-card hover:border-primary/50 text-muted-foreground',
            )}
            style={{ borderRadius: radius }}
          >
            {radius === '4px' ? 'Sharp' : radius === '24px' ? 'Round' : radius}
          </Button>
        ))}
      </div>
    </div>
  )
}
