'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types'
import { adminSettingSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AppInfoCard from './general/AppInfoCard'
import DemoUserCard from './general/DemoUserCard'
import LandingPageCard from './general/LandingPageCard'
import MaintenanceModeCard from './general/MaintenanceModeCard'
import ResourceLimitsCard from './general/ResourceLimitsCard'
import SystemEmailConfigCard from './general/SystemEmailConfigCard'
import { PusherConfig } from './PusherConfig'
import SystemPagesCard from './general/SystemPagesCard'

const GeneralSettings = () => {
  const { t } = useTranslation()
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()

  const [files, setFiles] = useState<Record<string, File | 'null' | null>>({})

  const initialValues = {
    app_name: '',
    app_description: '',
    app_email: '',
    support_email: '',
    landing_page_enabled: true,
    maintenance_mode: false,
    maintenance_title: '',
    maintenance_message: '',
    maintenance_image_url: '',
    maintenance_allowed_ips: [],
    page_404_title: '',
    page_404_content: '',
    page_404_image_url: '',
    no_internet_title: '',
    no_internet_content: '',
    no_internet_image_url: '',
    document_file_limit: 15,
    audio_file_limit: 15,
    video_file_limit: 20,
    image_file_limit: 10,
    multiple_file_share_limit: 10,
    maximum_message_length: 40000,
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    mail_from_name: '',
    mail_from_email: '',
    mail_encryption: 'tls',
    otp_message: '',
    session_expiration_days: 7,
    session_limit: 10,
    demo_user_email: '',
    demo_user_password: '',
  }

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === undefined) return
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      })

      Object.entries(files).forEach(([key, value]) => {
        if (value === 'null') {
          formData.append(key, 'null')
        } else if (value instanceof File) {
          formData.append(key, value)
        }
      })

      const response = await updateSettings(formData).unwrap()
      toast.success(response.message || t('settings_updated_successfully'))
      setFiles({})
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_settings'))
    }
  }

  if (isFetching) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  const settings = settingsData?.settings || {}
  const currentValues = {
    ...initialValues,
    ...settings,
    maintenance_allowed_ips: Array.isArray(settings.maintenance_allowed_ips) ? settings.maintenance_allowed_ips : [],
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={adminSettingSchemas.general(t)}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
          className="space-y-6 animate-in fade-in duration-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <AppInfoCard />
              <LandingPageCard settings={settings} />
              <SystemPagesCard files={files} setFiles={setFiles} settings={settings} />
            </div>
            <div className="space-y-6">
              <MaintenanceModeCard files={files} setFiles={setFiles} currentImageUrl={settings.maintenance_image_url} />
              <ResourceLimitsCard />
              <DemoUserCard />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <SystemEmailConfigCard />
              <PusherConfig />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isUpdating || (!dirty && Object.keys(files).length === 0)}
              variant="premium"
              className="sm:h-12 h-10 btn-color p-button-padding rounded-[8px] font-medium text-sm group active:scale-95 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isUpdating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t('updating', { defaultValue: 'Updating...' })}
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  {t('save_settings', { defaultValue: 'Save Settings' })}
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default GeneralSettings
