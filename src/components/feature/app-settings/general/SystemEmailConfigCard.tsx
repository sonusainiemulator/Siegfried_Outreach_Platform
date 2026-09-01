'use client'

import SelectField from '@/components/shared/form-fields/SelectField'
import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { emailInstruction, emailInstructionSSL } from '@/data/setting'
import { useSendTestMailMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types'
import { Info, Loader2, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const SystemEmailConfigCard = () => {
  const { t } = useTranslation()
  const { values } = useFormikContext<any>() || {}
  const [testEmail, setTestEmail] = useState('')
  const [sendTestMail, { isLoading: isTesting }] = useSendTestMailMutation()

  const handleSendTestMail = async () => {
    if (!testEmail) {
      toast.error(t('please_enter_email', { defaultValue: 'Please enter an email address' }))
      return
    }

    try {
      const response = await sendTestMail({
        to: testEmail,
        smtp_host: values?.smtp_host,
        smtp_port: values?.smtp_port,
        smtp_user: values?.smtp_user,
        smtp_pass: values?.smtp_pass,
        mail_encryption: values?.mail_encryption,
        mail_from_name: values?.mail_from_name,
        mail_from_email: values?.mail_from_email,
      }).unwrap()
      toast.success(response.message || t('test_email_sent_successfully'))
      setTestEmail('')
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_send_test_email'))
    }
  }

  return (
    <Card className="border-light-border-color glass-dark-card   rounded-border-radius overflow-hidden group transition-all duration-500">
      <CardHeader className="pb-4 sm:p-6 p-4 border-b border-glass-border/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className=" text-primary">
              <Mail className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-medium text-title-color dark:text-white">{t('system_email')}</CardTitle>
          </div>
          <CardDescription className="text-xs font-medium text-subtitle-color">
            {t('configure_smtp_server')}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextInput name="smtp_host" label="SMTP Host" placeholder="smtp.mailtrap.io" />
          <TextInput name="smtp_port" label="SMTP Port" placeholder="587" type="number" />
          <SelectField
            name="mail_encryption"
            label="Mail Encryption"
            options={[
              { label: 'TLS', value: 'tls' },
              { label: 'SSL', value: 'ssl' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput name="smtp_user" label="SMTP User" placeholder="Your SMTP username" />
          <TextInput name="smtp_pass" label="SMTP Password" placeholder="••••••••" type="password" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <TextInput name="mail_from_name" label="Sender Name" placeholder="Siegfried Social Media Marketing Plateform Support" />
          <TextInput name="mail_from_email" label="Sender Email" placeholder="noreply@pixelai.com" type="email" />
        </div>

        <div className="grid grid-cols-1 gap-6 border-b border-glass-border/30 pb-8">
          <TextAreaField
            name="otp_message"
            label="OTP Email Template"
            placeholder="Your OTP code is {otp}"
            helperText="Use {otp} as a placeholder for the OTP code."
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium  text-xs">
            <Info className="w-4 h-4 text-primary" />
            {t('instruction')}
          </div>
          <div className="sm:p-6 p-4 rounded-border-radius bg-accent/5 glass-dark-card border border-input-border-color space-y-6">
            <p className="text-sm font-medium text-destructive leading-relaxed">
              {t('when_setting_up_your_email_system')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-base font-medium text-title-color  dark:text-white">
                  {t('if_you_are_not_using_ssl')}
                </h4>
                <ul className="space-y-2">
                  {emailInstruction.map((item, i) => (
                    <li key={i} className="flex gap-3 text-xs font-medium text-subtitle-color">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-medium text-title-color dark:text-white">{t('if_you_are_using_ssl')}</h4>
                <ul className="space-y-2">
                  {emailInstructionSSL.map((item, i) => (
                    <li key={i} className="flex gap-3 text-xs font-medium text-subtitle-color">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-glass-border/30">
          <div className="flex items-center text-sm gap-2 mb-6 text-primary font-medium">
            <Send className="w-5 h-5" />
            {t('test_mail')}
          </div>

          <div className="flex flex-col glass-dark-card sm:flex-row items-end gap-4 sm:p-6 p-4 rounded-border-radius border border-light-border-color">
            <div className="flex-1 space-y-2 w-full flex flex-col">
              <Label htmlFor="test_mail" className="text-sm font-medium text-foreground/60 ml-1">
                {t('to_mail')}
              </Label>
              <Input
                id="test_mail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter Email"
                className="h-12 border-glass-border focus:ring-primary/20 transition-all rounded-[8px]"
              />
            </div>
            <Button
              type="button"
              variant="default"
              onClick={handleSendTestMail}
              disabled={isTesting}
              className="sm:h-12 h-10 p-button-padding! font-medium rounded-[8px] transition-all bg-primary! text-white"
            >
              {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('send_test_mail')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemEmailConfigCard
