import TextInput from '@/components/shared/form-fields/TextInput'
import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const OpenAiCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! dark:bg-sec-card-color border  glass-card border-border/40 hover:border-emerald-500/40 transition-all duration-300 glass-card hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-emerald-500" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">{t('openai_api', { defaultValue: 'OpenAI API' })}</h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 text-wrap">
        {t('openai_api_desc', { defaultValue: 'Power your content with the latest GPT models.' })}
      </p>
      <TextInput
        name="openai_api_key"
        label={t('openai_api_key_label', { defaultValue: 'OpenAI API Key' })}
        placeholder={t('openai_api_key_placeholder', { defaultValue: 'sk-...' })}
        type="password"
        className="bg-background/40 h-14 rounded-[8px] glass-card border-border/40"
      />
    </div>
  )
}

export default OpenAiCard
