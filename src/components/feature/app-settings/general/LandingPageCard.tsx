'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useFormikContext } from 'formik'
import { Eye, EyeOff, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LandingPageCardProps {
  settings?: any
}

const LandingPageCard = ({ settings }: LandingPageCardProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()

  const isLandingPageEnabled =
    values.landing_page_enabled !== false &&
    values.landing_page_enabled !== 'false' &&
    values.landing_page_enabled !== 0 &&
    values.landing_page_enabled !== '0'

  return (
    <Card className="border-light-border-color glass-dark-card rounded-border-radius overflow-hidden group transition-all duration-500">
      <CardHeader className="pb-4 sm:p-6 p-4 border-b border-glass-border/30">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="text-primary p-2 rounded-lg bg-primary/10">
                <Globe className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-medium text-title-color dark:text-white">
                {t('landing_page_settings', { defaultValue: 'Landing Page Settings' })}
              </CardTitle>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isLandingPageEnabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              {isLandingPageEnabled ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('landing_active', { defaultValue: 'Active (Public)' })}</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{t('landing_disabled', { defaultValue: 'Disabled (Hidden)' })}</span>
                </>
              )}
            </div>
          </div>
          <CardDescription className="text-sm font-medium text-subtitle-color">
            {t('landing_page_settings_desc', {
              defaultValue: 'Control public access and visibility of the frontend landing page on your main site URL.',
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 sm:p-6 p-4">
        <div className="flex items-center justify-between gap-4 p-4 rounded-border-radius border border-input-border-color bg-accent/5">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground/90">
              {t('enable_public_landing_page', { defaultValue: 'Enable Public Landing Page' })}
            </h4>
            <p className="text-xs font-medium text-subtitle-color leading-relaxed">
              {isLandingPageEnabled
                ? t('landing_enabled_info', {
                    defaultValue: 'Landing page is currently active. Visitors on your main site domain will see the landing page.',
                  })
                : t('landing_disabled_info', {
                    defaultValue: 'Landing page is disabled. Visitors on your main site domain will be automatically redirected to the Login page.',
                  })}
            </p>
          </div>
          <Switch
            checked={isLandingPageEnabled}
            onCheckedChange={(checked) => setFieldValue('landing_page_enabled', checked)}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default LandingPageCard
