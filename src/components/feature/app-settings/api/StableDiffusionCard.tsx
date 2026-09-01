import TextInput from '@/components/shared/form-fields/TextInput'
import { Palette } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const StableDiffusionCard = () => {
  const { t } = useTranslation()

  return (
    <div className="group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! border  inner-card border-border/40 hover:border-pink-500/40 transition-all duration-300  hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Palette className="h-5 w-5 text-pink-500" />
          </div>
          <h4 className="text-xl font-medium text-title-color dark:text-white">
            {t('stable_diffusion_api', { defaultValue: 'Stable Diffusion API' })}
          </h4>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 text-wrap">
        {t('stable_diffusion_api_desc')}
      </p>
      <TextInput
        name="stable_diffusion_api_key"
        label={t('stable_diffusion_api_key_label', { defaultValue: 'API Key' })}
        placeholder={t('stable_diffusion_api_key_placeholder', { defaultValue: 'sk-...' })}
        type="password"
        className="bg-background/40 h-14 rounded-2xl border-border/40"
      />
    </div>
  )
}

export default StableDiffusionCard
