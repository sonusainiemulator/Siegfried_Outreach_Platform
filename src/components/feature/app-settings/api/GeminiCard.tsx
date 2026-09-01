import TextInput from '@/components/shared/form-fields/TextInput'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const GeminiCard = () => {
  const { t } = useTranslation()
  
  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! border  inner-card border-border/40 hover:border-indigo-500/40 transition-all duration-300  hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className=" flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">{t('gemini_api')}</h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8  text-wrap">{t('gemini_api_desc')}</p>
      <TextInput
        name="gemini_api_key"
        label={t('gemini_api_key_label')}
        placeholder={t('gemini_api_key_placeholder')}
        type="password"
        className="bg-background/40 h-14 rounded-2xl border-border/40"
      />
    </div>
  )
}

export default GeminiCard
