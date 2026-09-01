'use client'

import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlobalConfigProps } from '@/types'
import { FileText, Globe, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const GlobalConfig = ({ formData, setFormData }: GlobalConfigProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-border-radius border border-border/40 glass-card glass-dark-card bg-card/40 flex-wrap backdrop-blur-xl p-4 sm:p-5 lg:p-6 flex flex-wrap items-stretch lg:items-center gap-4 animate-in fade-in duration-700">
      <div className="flex flex-1 min-w-35 items-center gap-3 px-3 py-2 rounded-border-radius bg-primary/5 border border-primary/10">
        <Globe className="w-5.5 h-5.5 text-primary shrink-0" />
        <div className="space-y-0.5 flex-1">
          <Label className="text-xs sm:text-xs font-medium text-primary">{t('language')}</Label>
          <Select value={formData.language} onValueChange={(val) => setFormData((p) => ({ ...p, language: val }))}>
            <SelectTrigger className="h-7 sm:h-9 p-0 border-none bg-transparent font-medium text-sm sm:text-base focus:ring-0 shadow-none transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
              <SelectItem value="English (USA)" className="font-bold">
                {t('english_usa')}
              </SelectItem>
              <SelectItem value="Portuguese" className="font-bold">
                {t('portuguese', { defaultValue: 'Portuguese' })}
              </SelectItem>
              <SelectItem value="Spanish" className="font-bold">
                {t('spanish')}
              </SelectItem>
              <SelectItem value="French" className="font-bold">
                {t('french')}
              </SelectItem>
              <SelectItem value="German" className="font-bold">
                {t('german')}
              </SelectItem>
              <SelectItem value="Italian" className="font-bold">
                {t('italian', { defaultValue: 'Italian' })}
              </SelectItem>
              <SelectItem value="Arabic" className="font-bold">
                {t('arabic', { defaultValue: 'Arabic' })}
              </SelectItem>
              <SelectItem value="Hindi" className="font-bold">
                {t('hindi', { defaultValue: 'Hindi' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 min-w-35 items-center gap-3 px-3 py-2 rounded-border-radius bg-blue-500/5 border border-blue-500/10">
        <FileText className="w-5.5 h-5.5 text-blue-400 shrink-0" />
        <div className="space-y-0.5 flex-1">
          <Label className="text-xs sm:text-xs font-medium text-blue-400/60 line-clamp-1">
            {t('blog_post_length')}
          </Label>
          <Select
            value={formData.blogLength.toString()}
            onValueChange={(val) => setFormData((p) => ({ ...p, blogLength: Number(val) }))}
          >
            <SelectTrigger className="h-7 sm:h-9 p-0 border-none bg-transparent font-medium text-sm sm:text-base focus:ring-0 shadow-none transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
              <SelectItem value="500" className="font-bold">
                {t('five_hundred_words')}
              </SelectItem>
              <SelectItem value="800" className="font-bold">
                {t('eight_hundred_words')}
              </SelectItem>
              <SelectItem value="1200" className="font-bold">
                {t('twelve_hundred_words')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 min-w-[140px] items-center gap-3 px-3 py-2 rounded-border-radius bg-purple-500/5 border border-purple-500/10">
        <Zap className="w-5.5 h-5.5 text-purple-400 shrink-0" />
        <div className="space-y-0.5 flex-1">
          <Label className="text-xs sm:text-xs font-medium text-purple-400/60">
            {t('creativity')}
          </Label>
          <Select value={formData.creativity} onValueChange={(val) => setFormData((p) => ({ ...p, creativity: val }))}>
            <SelectTrigger className="h-7 sm:h-9 p-0 border-none bg-transparent font-medium text-sm sm:text-base focus:ring-0 shadow-none transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
              <SelectItem value="Subtle" className="font-bold">
                {t('subtle', { defaultValue: 'Subtle' })}
              </SelectItem>
              <SelectItem value="Balanced" className="font-bold">
                {t('balanced', { defaultValue: 'Balanced' })}
              </SelectItem>
              <SelectItem value="Bold" className="font-bold">
                {t('bold', { defaultValue: 'Bold' })}
              </SelectItem>
              <SelectItem value="Maximum" className="font-bold">
                {t('maximum', { defaultValue: 'Maximum' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default GlobalConfig
