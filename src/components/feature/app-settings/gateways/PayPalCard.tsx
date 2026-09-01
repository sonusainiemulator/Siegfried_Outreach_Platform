'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { Switch } from '@/components/ui/switch'
import { Field } from 'formik'
import { ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PayPalCard = () => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-[2.5rem] border-glass-border bg-glass-bg backdrop-blur-3xl overflow-hidden relative group hover:border-blue-500/30 transition-all duration-500">
      <CardHeader className="sm:p-6 p-4 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-paypal/10 flex items-center justify-center border border-paypal/20">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                width={100}
                height={100}
                className="h-5 w-auto"
                unoptimized
              />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-medium ">{t('payPal')}</CardTitle>
              <p className="text-sm font-medium text-subtitle-color">
                {t('global_payments')}
              </p>
            </div>
          </div>
          <Field name="paypal.enabled">
            {({ field, form }: any) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    form.setFieldValue('paypal.enabled', checked)
                    form.submitForm()
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            )}
          </Field>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 pt-4 space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground ">
              {t('mode')}
            </Label>
            <div className="h-12 flex items-center px-4 rounded-[8px] border-glass-border inner-card glass-dark-card font-medium text-subtitle-color text-sm">
              {t('sandbox_testing')}
            </div>
            <Field name="paypal.mode">
              {({ field, form }: any) => {
                React.useEffect(() => {
                  if (field.value !== 'sandbox') {
                    form.setFieldValue('paypal.mode', 'sandbox')
                  }
                }, [])
                return null
              }}
            </Field>

          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground ">
              {t('client_id')}
            </Label>
            <Field name="paypal.client_id">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={Zap}
                  placeholder="Enter PayPal Client ID"
                  className="h-12 pl-12 rounded-[8px] border-glass-border focus:border-paypal/50 transition-all font-medium"
                />
              )}
            </Field>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground ">
              {t('client_secret')}
            </Label>
            <Field name="paypal.client_secret">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={ShieldCheck}
                  placeholder="Enter PayPal Client Secret"
                  className="h-12 pl-12 rounded-[8px] border-glass-border focus:border-paypal/50 transition-all font-medium"
                />
              )}
            </Field>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground ">
              Webhook ID
            </Label>
            <Field name="paypal.webhook_id">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={ShieldCheck}
                  placeholder="Enter PayPal Webhook ID"
                  className="h-12 pl-12 rounded-[8px] border-glass-border focus:border-paypal/50 transition-all font-medium"
                />
              )}
            </Field>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-paypal/5 border border-paypal/10">
          <p className="text-xs leading-relaxed text-paypal font-medium">
            💡 {t('important_paypal')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PayPalCard
