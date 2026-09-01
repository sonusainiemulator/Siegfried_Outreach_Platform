'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingApi'
import { useAppSelector } from '@/redux/hooks'
import { ApiError } from '@/types'
import { Form, Formik } from 'formik'
import { CreditCard, Loader2, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import OfflineCard from './gateways/OfflineCard'
import PayPalCard from './gateways/PayPalCard'
import RazorpayCard from './gateways/RazorpayCard'
import StripeCard from './gateways/StripeCard'

const PaymentGatewayConfig = () => {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const { data: userSettingsData, isLoading: isFetching } = useGetUserSettingsQuery(undefined)
  const [updateUserSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation()

  const settingsData = userSettingsData

  const initialValues = {
    stripe: {
      enabled: false,
      secret_key: '',
      publishable_key: '',
      webhook_secret: '',
    },
    paypal: {
      enabled: false,
      client_id: '',
      client_secret: '',
      mode: 'sandbox',
      plan_id_monthly: '',
      plan_id_yearly: '',
    },
    razorpay: {
      enabled: false,
      key_id: '',
      key_secret: '',
      webhook_secret: '',
    },
    offline: {
      enabled: false,
      bank_name: '',
      account_name: '',
      account_number: '',
      ifsc_swift: '',
      upi_id: '',
      upi_qr_url: '',
      cash_instructions: '',
      instructions: '',
    },
  }

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await updateUserSettings(values).unwrap()
      toast.success(t('payment_gateways_updated_successfully', { defaultValue: 'Payment gateways updated successfully' }))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_payment_gateways', { defaultValue: 'Failed to update payment gateways' }))
    }
  }

  if (isFetching) {
    return <Spinner className="h-[400px]" size="md" />
  }

  const settings = settingsData?.setting || {}
  const currentValues = {
    stripe: {
      ...initialValues.stripe,
      ...(settings.stripe || {}),
    },
    paypal: {
      ...initialValues.paypal,
      ...(settings.paypal || {}),
    },
    razorpay: {
      ...initialValues.razorpay,
      ...(settings.razorpay || {}),
    },
    offline: {
      ...initialValues.offline,
      ...(settings.offline || {}),
    },
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Formik
        initialValues={currentValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ dirty, values }) => (
          <Form className="space-y-8">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 px-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 overflow-hidden shadow-2xl mb-10">
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 w-full">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t('payment_gateways')}
                  </h2>
                  <p className="text-muted-foreground font-medium max-w-xl text-lg">
                    {t('global_payment_settings_desc')}
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-background/50 border border-glass-border backdrop-blur-xl shadow-xl flex items-center gap-6 group hover:border-primary/30 transition-all">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500">
                    <CreditCard className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-2xl font-black tracking-tight">
                      {Object.values(values).filter((v: any) => v.enabled).length}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('active_providers')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StripeCard />
              <PayPalCard />
              <RazorpayCard />
              <OfflineCard />
            </div>

            <div className="flex justify-end bottom-6 z-10 pt-10">
              <Button
                type="submit"
                disabled={isUpdating || !dirty}
                className="rounded-2xl h-16 px-12 font-black text-lg gap-3 hover:-translate-y-1 active:translate-y-0 transition-all group bg-light-gray hover:bg-primary hover:text-white text-light-text-color"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t('synchronizing_gateways')}
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    {t('sync_credentials')}
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PaymentGatewayConfig
