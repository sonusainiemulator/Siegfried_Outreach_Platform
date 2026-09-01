'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { AtSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const ThreadsConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-neutral-900/10 dark:bg-white/10 text-neutral-900 dark:text-white">
          <AtSign className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">{t('social_threads', { defaultValue: 'Threads' })}</h3>
        <SetupGuideTooltip
          title={platformSetupGuides.threads.title}
          steps={platformSetupGuides.threads.steps}
          links={platformSetupGuides.threads.links}
          redirectUri={platformSetupGuides.threads.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card  border border-glass-border/50">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="threads_app_id" className="text-sm font-medium text-foreground">
            {t('social_threads_app_id', { defaultValue: 'Threads App ID' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="threads_app_id"
              placeholder={t('social_threads_app_id_placeholder', { defaultValue: 'Enter Threads App ID' })}
              {...formik.getFieldProps('threads_app_id')}
              className="h-10 rounded-[8px]  border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.threads_app_id && formik.errors.threads_app_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.threads_app_id}</p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="threads_app_secret" className="text-sm font-medium text-foreground">
            {t('social_threads_app_secret', { defaultValue: 'Threads App Secret' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="threads_app_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('threads_app_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.threads_app_secret && formik.errors.threads_app_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">{formik.errors.threads_app_secret}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThreadsConfig
