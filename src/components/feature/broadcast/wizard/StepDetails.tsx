import TextInput from '@/components/shared/form-fields/TextInput'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

const StepDetails = () => {
  const { t } = useTranslation()

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      <CardHeader>
        <CardTitle>{t('campaign_details')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextInput
          name="name"
          label={t('campaign_name')}
          placeholder={t('campaign_name_placeholder')}
        />
        <TextInput
          name="subject"
          label={t('campaign_subject')}
          placeholder={t('campaign_subject_placeholder')}
        />
      </CardContent>
    </div>
  )
}

export default StepDetails
