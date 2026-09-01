'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Linkedin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const LinkedinConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px] bg-linkedin/10 text-linkedin">
          <Linkedin className="w-5 h-5 fill-current" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_linkedin_platform')}</h3>
        <SetupGuideTooltip
          title={platformSetupGuides.linkedin.title}
          steps={platformSetupGuides.linkedin.steps}
          links={platformSetupGuides.linkedin.links}
          redirectUri={platformSetupGuides.linkedin.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 inner-card glass-dark-card rounded-border-radius!">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="linkedin_client_id" className="text-sm font-medium text-foreground">
            {t('social_linkedin_client_id')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="linkedin_client_id"
              placeholder={t('social_linkedin_client_id_placeholder')}
              {...formik.getFieldProps('linkedin_client_id')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.linkedin_client_id && formik.errors.linkedin_client_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {formik.errors.linkedin_client_id}
            </p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="linkedin_client_secret" className="text-sm font-medium text-foreground">
            {t('social_linkedin_client_secret')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="linkedin_client_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('linkedin_client_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.linkedin_client_secret && formik.errors.linkedin_client_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {formik.errors.linkedin_client_secret}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkedinConfig
