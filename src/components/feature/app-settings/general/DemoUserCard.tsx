'use client'

import TextInput from '@/components/shared/form-fields/TextInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DemoUserCard = () => {
  const { t } = useTranslation()

  return (
    <Card className="border-input-border-color  glass-dark-card rounded-border-radius overflow-hidden group transition-all duration-500 lg:col-span-1">
      <CardHeader className="pb-2! sm:p-6 p-4 border-b border-glass-border/30">
      <div className='space-y-1'>

        <div className="flex items-center gap-2">
          <div className="text-primary">
            <UserCheck className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-medium text-title-color dark:text-white">
            {t('demo_user_settings', { defaultValue: 'Demo User Settings' })}
          </CardTitle>
        </div>
        <div>
          <CardDescription className="text-sm font-medium text-subtitle-color">
            {t('set_demo_credentials', { defaultValue: 'Configure credentials for the demo login' })}
          </CardDescription>
        </div>
      </div>
      </CardHeader>
      <CardContent className="space-y-6 sm:p-6 p-4 pt-2!">
        <div className="grid grid-cols-1 gap-4 pt-2">
          <TextInput
            name="demo_user_email"
            label={t('demo_user_email', { defaultValue: 'Demo User Email' })}
            placeholder="demo@example.com"
            className="transition-all duration-300"
          />
          <TextInput
            name="demo_user_password"
            label={t('demo_user_password', { defaultValue: 'Demo User Password' })}
            placeholder="********"
            type="password"
            className="transition-all duration-300"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default DemoUserCard
