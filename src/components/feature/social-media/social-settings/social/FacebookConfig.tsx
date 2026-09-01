'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Facebook } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const FacebookConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-facebook/10 text-facebook">
          <Facebook className="w-5 h-5 fill-current" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_facebook_meta')}</h3>
        <SetupGuideTooltip
          title={platformSetupGuides.facebook.title}
          steps={platformSetupGuides.facebook.steps}
          links={platformSetupGuides.facebook.links}
          redirectUri={platformSetupGuides.facebook.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card  border border-glass-border/50">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="app_id" className="text-sm font-medium text-foreground">
            {t('social_meta_app_id')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="app_id"
              placeholder={t('social_meta_app_id_placeholder')}
              {...formik.getFieldProps('app_id')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.app_id && formik.errors.app_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.app_id}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="app_secret" className="text-sm font-medium text-foreground">
            {t('social_meta_app_secret')}
          </Label>
          <div className="relative">
            <PasswordInput
              id="app_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('app_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.app_secret && formik.errors.app_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.app_secret}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FacebookConfig
