import SelectField from '@/components/shared/form-fields/SelectField'
import { providers } from '@/data/setting'
import { Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DefaultAiProviderCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! border inner-card border-border/40 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className=" flex items-center justify-center">
            <Settings2 className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">
            {t('default_ai_provider', { defaultValue: 'Default AI Provider' })}
          </h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 text-wrap">
        {t('default_ai_provider_desc', { defaultValue: 'Select the primary AI model to power your workspace.' })}
      </p>

      <SelectField
        name="aiProvider"
        label={t('select_provider', { defaultValue: 'Select Provider', count: 1 })}
        options={providers}
        className="h-12 rounded-[8px] inner-card w-full px-3 py-2 text-sm"
      />
    </div>
  )
}

export default DefaultAiProviderCard
