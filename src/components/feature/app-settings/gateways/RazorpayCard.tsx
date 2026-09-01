'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { Switch } from '@/components/ui/switch'
import { Field } from 'formik'
import { Key, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const RazorpayCard = () => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-[2.5rem] border-glass-border bg-glass-bg backdrop-blur-3xl overflow-hidden relative group hover:border-social-blue/30 transition-all duration-500">
      <CardHeader className="sm:p-6 p-4 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-social-blue/10 flex items-center justify-center border border-social-blue/20">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                alt="Razorpay"
                className="h-4 w-auto"
                width={100}
                height={100}
                unoptimized
              />
            </div>
            <div>
              <CardTitle className="tracking-tight text-lg sm:text-xl font-medium text-title-color dark:text-white">
                {t('razorpay')}
              </CardTitle>
              <p className="text-sm font-medium text-subtitle-color">{t('indian_payments_hub')}</p>
            </div>
          </div>
          <Field name="razorpay.enabled">
            {({ field, form }: any) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    form.setFieldValue('razorpay.enabled', checked)
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
            <Label className="text-sm font-medium  text-foreground">{t('key_id')}</Label>
            <Field name="razorpay.key_id">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={Key}
                  placeholder="rzp_test_..."
                  className="h-12 pl-12 rounded-[8px] inner-card border-glass-border focus:border-social-blue/50 transition-all font-medium"
                />
              )}
            </Field>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium  text-foreground">{t('key_secret')}</Label>
            <Field name="razorpay.key_secret">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={ShieldCheck}
                  placeholder="Enter Razorpay Secret"
                  className="h-12 pl-12 rounded-[8px]  inner-card border-glass-border focus:border-social-blue/50 transition-all font-medium"
                />
              )}
            </Field>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium  text-foreground">{t('webhook_secret')}</Label>
            <Field name="razorpay.webhook_secret">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={ShieldCheck}
                  placeholder="Enter Webhook Secret"
                  className="h-12 pl-12 rounded-[8px] inner -card border-glass-border focus:border-social-blue/50 transition-all font-medium"
                />
              )}
            </Field>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-social-blue/5 border border-social-blue/10">
          <p className="text-xs leading-relaxed text-social-blue font-medium">💡 {t('important_razorpay')}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RazorpayCard
