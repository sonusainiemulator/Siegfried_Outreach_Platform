'use client'

import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { SystemPagesCardProps } from '@/types'
import { useFormikContext } from 'formik'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import InlineImageUpload from '../components/InlineImageUpload'

const SystemPagesCard = ({ files, setFiles, settings }: SystemPagesCardProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()
  const isLandingPageEnabled =
    values.landing_page_enabled !== false &&
    values.landing_page_enabled !== 'false' &&
    values.landing_page_enabled !== 0 &&
    values.landing_page_enabled !== '0'

  return (
    <Card className="border-light-border-color glass-dark-card rounded-border-radius overflow-hidden group  transition-all duration-500 lg:col-span-1">
      <CardHeader className="pb-4 sm:p-6 p-4 border-b border-glass-border/30">
        <div className='space-y-1'>
          <div className="flex items-center gap-2">
            <div className=" text-blue-500">
              <Globe className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-medium text-title-color dark:text-white">
              {t('system_pages', { defaultValue: 'System Pages' })}
            </CardTitle>
          </div>
          <div>
            <CardDescription className="text-sm font-medium text-subtitle-color">
              {t('customize_error_pages', { defaultValue: 'Customize 404 and offline pages' })}
            </CardDescription>
          </div>

        </div>
      </CardHeader>
      <CardContent className="space-y-8 sm:p-6 p-4">

        <div className="group/page">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <h4 className="text-sm font-medium text-foreground/80">{t('error_page_identity')}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <TextInput name="page_404_title" label={t('title')} placeholder="Page Not Found" />
              <TextAreaField
                name="page_404_content"
                label={t('content')}
                placeholder="The page you requested does not exist."
              />
              <TextInput
                name="page_404_image_url"
                label={t('image_url', { defaultValue: '404 Image URL' })}
                placeholder="https://example.com/404.png"
              />
            </div>
            <InlineImageUpload
              label="404 Image Upload"
              currentUrl={
                files.page_404_image === 'null'
                  ? null
                  : files.page_404_image instanceof File
                    ? null
                    : values.page_404_image_url || settings.page_404_image_url
              }
              onFileSelect={(file) => setFiles((prev) => ({ ...prev, page_404_image: file }))}
              onRemove={() => setFiles((prev) => ({ ...prev, page_404_image: 'null' }))}
            />
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-glass-border to-transparent" />

        <div className="group/page">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <h4 className="text-sm font-medium text-foreground/80">
              {t('no_internet_identity')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <TextInput name="no_internet_title" label={t('title')} placeholder="No Internet Connection" />
              <TextAreaField
                name="no_internet_content"
                label={t('content')}
                placeholder="Please check your connection."
              />
              <TextInput
                name="no_internet_image_url"
                label={t('image_url', { defaultValue: 'Offline Image URL' })}
                placeholder="https://example.com/offline.png"
              />
            </div>
            <InlineImageUpload
              label="No Internet Image Upload"
              currentUrl={
                files.no_internet_image === 'null'
                  ? null
                  : files.no_internet_image instanceof File
                    ? null
                    : values.no_internet_image_url || settings.no_internet_image_url
              }
              onFileSelect={(file) => setFiles((prev) => ({ ...prev, no_internet_image: file }))}
              onRemove={() => setFiles((prev) => ({ ...prev, no_internet_image: 'null' }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemPagesCard
