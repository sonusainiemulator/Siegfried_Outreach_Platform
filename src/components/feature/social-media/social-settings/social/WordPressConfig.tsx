'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const WordPressConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px]! bg-blue-500/10 text-blue-500">
          <Globe className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[16px] text-title-color dark:text-white">
          {t('social_wordpress', { defaultValue: 'WordPress' })}
        </h3>
        <SetupGuideTooltip
          title={platformSetupGuides.wordpress.title}
          steps={platformSetupGuides.wordpress.steps}
          links={platformSetupGuides.wordpress.links}
          redirectUri={platformSetupGuides.wordpress.redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-dark-card gap-8 sm:p-5 p-4 rounded-border-radius! inner-card border border-glass-border/50">
        {/* Site URL — full width */}
        <div className="md:col-span-2 space-y-2 group/input flex flex-col">
          <Label htmlFor="wordpress_site_url" className="text-sm font-medium text-foreground">
            {t('social_wordpress_site_url', { defaultValue: 'WordPress Site URL' })}
          </Label>
          <div className="relative">
            <Input
              id="wordpress_site_url"
              type="url"
              placeholder="https://myblog.com"
              {...formik.getFieldProps('wordpress_site_url')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          {formik.touched.wordpress_site_url && formik.errors.wordpress_site_url && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {formik.errors.wordpress_site_url as string}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="wordpress_username" className="text-sm font-medium text-foreground">
            {t('social_wordpress_username', { defaultValue: 'WordPress Username' })}
          </Label>
          <div className="relative">
            <Input
              id="wordpress_username"
              placeholder={t('social_wordpress_username_placeholder', { defaultValue: 'Enter your WP username' })}
              {...formik.getFieldProps('wordpress_username')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.wordpress_username && formik.errors.wordpress_username && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {formik.errors.wordpress_username as string}
            </p>
          )}
        </div>

        {/* Application Password */}
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="wordpress_app_password" className="text-sm font-medium text-foreground">
            {t('social_wordpress_app_password', { defaultValue: 'Application Password' })}
          </Label>
          <div className="relative">
            <PasswordInput
              id="wordpress_app_password"
              placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
              {...formik.getFieldProps('wordpress_app_password')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.wordpress_app_password && formik.errors.wordpress_app_password && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {formik.errors.wordpress_app_password as string}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground ml-1">
            {t('social_wordpress_app_password_hint', { defaultValue: 'Generate via WP Dashboard → Users → Profile → Application Passwords' })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WordPressConfig
