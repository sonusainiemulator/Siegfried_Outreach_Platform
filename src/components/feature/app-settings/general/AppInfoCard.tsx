'use client'

import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const AppInfoCard = () => {
  const { t } = useTranslation()

  return (
    <Card className="border-input-border-color glass-dark-card rounded-border-radius overflow-hidden group transition-all duration-500">
      <CardHeader className="pb-4 sm:p-6 p-4">
        <div className='space-y-1 group'>
          <div className="flex items-center gap-2">
            <div className=" text-primary">
              <Settings2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-medium text-title-color dark:text-white">
              {t('app_information', { defaultValue: 'App Information' })}
            </CardTitle>
          </div>
          <CardDescription className="text-sm font-medium text-subtitle-color">
            {t('manage_basic_app_details', { defaultValue: 'Manage your application basic details' })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:p-6 p-4 pt-0">
        <TextInput name="app_name" label={t('app_name')} placeholder="e.g. Siegfried Social Media Marketing Plateform" />
        <TextAreaField name="app_description" label={t('app_description')} placeholder="Describe your app..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput name="app_email" label={t('app_email')} placeholder="admin@example.com" type="email" />
          <TextInput name="support_email" label={t('support_email')} placeholder="support@example.com" type="email" />
        </div>
      </CardContent>
    </Card>
  )
}

export default AppInfoCard
