'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categories, getModels, getProviders } from '@/data/aiChatbot'
import { ConfigureTabProps } from '@/types'
import { useTranslation } from 'react-i18next'

const ConfigureTab = ({ formData, updateFormField }: ConfigureTabProps) => {
  const { t } = useTranslation()

  const providers = getProviders()
  const allModels = getModels()
  const modelList = (allModels as any)[formData.provider] || []

  return (
    <div className="space-y-12">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => updateFormField('category', cat.title)}
            className={`cursor-pointer p-5 rounded-border-radius border-2 transition-all relative overflow-hidden group ${formData.category === cat.id
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
                : ' inner-card glass-dark-card '
              }`}
          >
            {cat.badge && (
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {cat.badge}
              </span>
            )}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 ${cat.color}`}>
              {cat.icon}
            </div>
            <h4 className={`font-semibold mb-1 ${formData.category === cat.id ? 'text-primary' : 'text-title-color dark:text-white'}`}>
              {cat.title}
            </h4>
            <p className="text-xs text-subtitle-color  leading-relaxed">
              {cat.description}
            </p>
          </div>
        ))}
      </div>

      {/* AI Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/20">
        <div className="space-y-2 flex flex-col">
          <Label className="text-sm font-medium text-foreground">
            {t('ai_provider')}
          </Label>
          <Select
            value={formData.provider}
            onValueChange={(v: 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom') => updateFormField('provider', v)}
          >
            <SelectTrigger className="rounded-[8px] h-12 inner-card glass-dark-card border-border/40 bg-muted/20">
              <SelectValue placeholder={t('select_provider')} />
            </SelectTrigger>
            <SelectContent className="rounded-border-radius dark:bg-modal-bg-color border-border/40 bg-white">
              {providers.map((provider: { value: string; label: string }) => (
                <SelectItem key={provider.value} value={provider.value} className="text-foreground dark:hover:bg-dark-gray-accent">
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="apiKey" className="text-sm font-medium text-foreground">
            {t('api_key')} *
          </Label>
          <PasswordInput
            id="apiKey"
            value={formData.apiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormField('apiKey', e.target.value)}
            placeholder={t('enter_api_key')}
            className="rounded-[8px] h-12 inner-card glass-dark-card border-border/40 bg-muted/20"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label className="text-sm font-medium text-foreground">{t('model')}</Label>
          <Select value={formData.model} onValueChange={(v: string) => updateFormField('model', v)}>
            <SelectTrigger className="rounded-[8px] h-12 inner-card glass-dark-card border-border/40 bg-muted/20">
              <SelectValue placeholder={t('select_model')} />
            </SelectTrigger>
            <SelectContent className="rounded-border-radius bg-white dark:bg-modal-bg-color border-border/40">
              {modelList.map((model: { value: string; label: string }) => (
                <SelectItem key={model.value} value={model.value} className="text-foreground dark:hover:bg-dark-gray-accent">
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default ConfigureTab
