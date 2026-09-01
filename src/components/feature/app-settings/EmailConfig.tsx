'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useGetUserSettingsQuery,
  useTestEmailConfigMutation,
  useUpdateEmailConfigMutation,
} from '@/redux/api/userSettingApi'
import { ApiError, EmailConfigForm } from '@/types'
import { emailConfigSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { Loader2, Save, Send } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import EmailProviderSelect from './email/EmailProviderSelect'
import EmailTestModal from './email/EmailTestModal'
import SendGridConfig from './email/SendGridConfig'
import SmtpConfig from './email/SmtpConfig'
import AwsSesConfig from './email/AwsSesConfig'
import ZeptoMailConfig from './email/ZeptoMailConfig'
import EmailitConfig from './email/EmailitConfig'

const EmailConfig = () => {
  const { t } = useTranslation()
  const { data: userData, isLoading: isFetching } = useGetUserSettingsQuery(undefined)
  const [updateEmailConfig, { isLoading: isUpdating }] = useUpdateEmailConfigMutation()
  const [testEmailConfig, { isLoading: isTesting }] = useTestEmailConfigMutation()

  const [showTestModal, setShowTestModal] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const initialValues: EmailConfigForm = {
    emailProvider: 'nodemailer',
    fromName: '',
    fromEmail: '',
    config: {
      smtp_host: '',
      smtp_port: '',
      smtp_user: '',
      smtp_pass: '',
      mail_encryption: 'tls',
      sendgrid_api_key: '',
      aws_ses_region: '',
      aws_ses_access_key: '',
      aws_ses_secret_key: '',
      zeptomail_api_key: '',
      emailit_api_key: '',
    },
  }

  const formValues: EmailConfigForm = React.useMemo(() => {
    if (userData?.setting) {
      const setting = userData.setting
      return {
        emailProvider: setting.emailProvider || 'nodemailer',
        fromName: setting.fromName || '',
        fromEmail: setting.fromEmail || '',
        config: {
          smtp_host: setting.config?.smtp_host || '',
          smtp_port: setting.config?.smtp_port || '',
          smtp_user: setting.config?.smtp_user || '',
          smtp_pass: setting.config?.smtp_pass || '',
          mail_encryption: setting.config?.mail_encryption || 'tls',
          sendgrid_api_key: setting.config?.sendgrid_api_key || '',
          aws_ses_region: setting.config?.aws_ses_region || '',
          aws_ses_access_key: setting.config?.aws_ses_access_key || '',
          aws_ses_secret_key: setting.config?.aws_ses_secret_key || '',
          zeptomail_api_key: setting.config?.zeptomail_api_key || '',
          emailit_api_key: setting.config?.emailit_api_key || '',
        },
      }
    }
    return initialValues
  }, [userData])

  const onSubmit = async (values: EmailConfigForm) => {
    try {
      const res = await updateEmailConfig(values).unwrap()
      toast.success(res.message || t('email_config_updated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_email_config'))
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error(t('enter_test_email'))
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(testEmail)) {
      toast.error(t('invalid_email'))
      return
    }

    try {
      const res = await testEmailConfig({
        to: testEmail,
        emailProvider: formValues.emailProvider,
        fromName: formValues.fromName,
        fromEmail: formValues.fromEmail,
        config: formValues.config,
      }).unwrap()
      toast.success(res.message || t('test_email_sent'))
      setShowTestModal(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_send_test_email'))
    }
  }

  if (isFetching) {
    return <Spinner className="py-20 h-auto" size="md" />
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="border-glass-border bg-light-body glass-card glass-dark-card dark:border-none rounded-border-radius overflow-hidden group hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="sm:p-6 p-4 pb-4 border-b border-glass-border/30">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-lg font-medium text-title-color/90 dark:text-white">
                {t('configure_email_provider')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="sm:p-6 p-4 pt-6">
          <Formik
            initialValues={formValues}
            enableReinitialize
            validationSchema={emailConfigSchemas.update(t)}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <Form className="space-y-10">
                <EmailProviderSelect />

                {values.emailProvider === 'nodemailer' && <SmtpConfig />}

                {values.emailProvider === 'sendgrid' && <SendGridConfig />}
                
                {values.emailProvider === 'aws-ses' && <AwsSesConfig />}
                
                {values.emailProvider === 'zeptomail' && <ZeptoMailConfig />}
                
                {values.emailProvider === 'emailit' && <EmailitConfig />}

                <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-glass-border/30">
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setShowTestModal(true)}
                    disabled={!userData?.setting?.isConfigured}
                    className="py-6 px-8 rounded-[8px] p-button-padding! btn-color sm:h-12 h-10 font-medium glass-dark-card text-sm group transition-all hover:bg-primary text-white"
                  >
                    <Send className="w-4 h-4 transition-transform" />
                    {t('test_configuration')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    variant="premium"
                    className="py-6 px-8 rounded-[8px] p-button-padding! btn-color sm:h-12 h-10 font-medium text-sm group transition-all shadow-none"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 group-hover:scale-110 transition-all" />
                    )}
                    {t('save_configuration')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <EmailTestModal
        show={showTestModal}
        onClose={() => setShowTestModal(false)}
        onSend={handleTestEmail}
        testEmail={testEmail}
        setTestEmail={setTestEmail}
        isTesting={isTesting}
      />
    </div>
  )
}

export default EmailConfig
