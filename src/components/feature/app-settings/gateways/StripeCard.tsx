'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { Switch } from '@/components/ui/switch'
import { ErrorMessage, Field } from 'formik'
import { Key, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const StripeCard = () => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-border-radius border-glass-border bg-glass-bg backdrop-blur-3xl overflow-hidden relative group hover:border-primary/30 transition-all duration-500">
      <CardHeader className="sm:p-6 p-4 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-stripe/10 flex items-center justify-center border border-stripe/20">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                alt="Stripe"
                width={100}
                height={100}
                className="h-5 w-auto"
                unoptimized
              />
            </div>
            <div>
              <CardTitle className="sm:text-xl text-lg font-medium text-title-color dark:text-white">{t('stripe')}</CardTitle>
              <p className="text-sm font-medium text-subtitle-color">
                {t('payment_processor')}
              </p>
            </div>
          </div>
          <Field name="stripe.enabled">
            {({ field, form }: any) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    form.setFieldValue('stripe.enabled', checked)
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
            <Label className="text-sm font-medium  text-foreground ">
              {t('publishable_key')}
            </Label>
            <Field name="stripe.publishable_key">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={Key}
                  placeholder="pk_test_..."
                  className="h-12 pl-12 rounded-[8px]  inner-card border-glass-border focus:border-stripe/50 transition-all font-medium"
                />
              )}
            </Field>
            <ErrorMessage name="stripe.publishable_key" component="p" className="text-[10px] text-destructive font-bold ml-1" />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground">
              {t('secret_key')}
            </Label>
            <Field name="stripe.secret_key">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={Key}
                  placeholder="sk_test_..."
                  className="h-12 pl-12 rounded-[8px]   inner-card border-glass-border focus:border-stripe/50 transition-all font-medium"
                />
              )}
            </Field>
            <ErrorMessage name="stripe.secret_key" component="p" className="text-[10px] text-destructive font-bold ml-1" />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground">
              {t('webhook_secret')}
            </Label>
            <Field name="stripe.webhook_secret">
              {({ field }: any) => (
                <PasswordInput
                  {...field}
                  icon={ShieldCheck}
                  placeholder="whsec_..."
                  className="h-12 pl-12 rounded-[8px]   inner-card border-glass-border focus:border-stripe/50 transition-all font-medium"
                />
              )}
            </Field>
            <ErrorMessage name="stripe.webhook_secret" component="p" className="text-[10px] text-destructive font-bold ml-1" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-xs leading-relaxed text-blue-500 font-medium">
            💡 {t('pro_tip_stripe')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default StripeCard
