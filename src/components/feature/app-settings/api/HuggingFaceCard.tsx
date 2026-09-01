import TextInput from '@/components/shared/form-fields/TextInput'
import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const HuggingFaceCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group relative sm:p-6 p-4 glass-dark-card rounded-border-radius! border  inner-card border-border/40 hover:border-primary/40 transition-all duration-300  hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className=" flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">{t('huggingFace')}</h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8  text-wrap">
        {t('ai_probability_scoring_via_roberta')}
      </p>
      <TextInput
        name="huggingface_api_key"
        label="Access Token"
        placeholder="hf_xxxxxxxxxxxx"
        type="password"
        className="bg-background/40 h-14 rounded-2xl border-border/40"
      />
    </div>
  )
}

export default HuggingFaceCard
