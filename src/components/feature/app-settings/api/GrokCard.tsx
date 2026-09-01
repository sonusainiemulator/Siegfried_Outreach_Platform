import TextInput from '@/components/shared/form-fields/TextInput'
import { BrainCircuit } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const GrokCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group relative glass-dark-card sm:p-6 p-4 rounded-border-radius! border  inner-card border-border/40 hover:border-violet-500/40 transition-all duration-300  hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-violet-500" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">{t('grok_api', { defaultValue: 'Grok API' })}</h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 text-wrap">
        {t('grok_api_desc', { defaultValue: 'Power your application with xAI’s Grok models.' })}
      </p>
      <TextInput
        name="grok_api_key"
        label={t('grok_api_key_label', { defaultValue: 'Grok API Key' })}
        placeholder={t('grok_api_key_placeholder', { defaultValue: 'xai-...' })}
        type="password"
        className="bg-background/40 h-14 rounded-[8px] border-border/40 dark:border-none!"
      />
    </div>
  )
}

export default GrokCard
