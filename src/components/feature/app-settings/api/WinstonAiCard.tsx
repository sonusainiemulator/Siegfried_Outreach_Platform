import TextInput from '@/components/shared/form-fields/TextInput'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WinstonAiCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! border  inner-card border-border/40 hover:border-blue-500/40 transition-all duration-300  hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Globe className="h-5 w-5 text-blue-500" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">{t('winston_ai')}</h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 text-wrap">
        {t('semantic_plagiarism_detection_across_web_and_databases')}
      </p>
      <TextInput
        name="winston_api_key"
        label="Project Key"
        placeholder="sk_xxxxxxxxxxxx"
        type="password"
        className="bg-background/40 h-14 rounded-2xl border-border/40"
      />
    </div>
  )
}

export default WinstonAiCard
