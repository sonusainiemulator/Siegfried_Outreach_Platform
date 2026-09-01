'use client'

import OfflineCard from '@/components/feature/app-settings/gateways/OfflineCard'
import PayPalCard from '@/components/feature/app-settings/gateways/PayPalCard'
import RazorpayCard from '@/components/feature/app-settings/gateways/RazorpayCard'
import StripeCard from '@/components/feature/app-settings/gateways/StripeCard'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingApi'
import { ApiError } from '@/types'
import { Form, Formik } from 'formik'
import { ArrowLeft, CreditCard, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const PaymentGatewayConfig = () => {
  const { t } = useTranslation()
  const router = useRouter()

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
      toast.success(
        t('payment_gateways_updated_successfully', { defaultValue: 'Payment gateways updated successfully' }),
      )
    } catch (error) {
      const apiError = error as ApiError
      toast.error(
        apiError?.data?.message ||
        t('failed_to_update_payment_gateways', { defaultValue: 'Failed to update payment gateways' }),
      )
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
      <div className="relative overflow-hidden ">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <div className="flex items-start flex-col">
              <h1 className="text-3xl font-bold tracking-tight text-title-color dark:text-white title-color line-clamp-1">
                {t('payment_gateways')}
              </h1>

            </div>
          </div>
          <div className="p-3 max-w-70 rounded-border-radius border border-glass-border backdrop-blur-xl glass-card glass-dark-card flex items-center gap-6 group hover:border-primary/30 transition-all">
            <div className="h-10 w-10 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex items-end flex-col">
              <p className="text-lg font-medium tracking-tight">
                {Object.values(currentValues).filter((v) => v.enabled).length}
              </p>
              <p className="text-sm font-medium text-muted-foreground">{t('active_providers')}</p>
            </div>
          </div>
        </div>
      </div>

      <Formik initialValues={currentValues} enableReinitialize onSubmit={onSubmit}>
        {({ dirty }) => (
          <Form className="space-y-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-0">
              <StripeCard />
              <PayPalCard />
              <RazorpayCard />
              <OfflineCard />
            </div>

            <div className="flex justify-end bottom-6 z-10 pt-10">
              <Button
                type="submit"
                disabled={isUpdating || !dirty}
                className="rounded-[8px] h-10 sm:h-12 font-medium text-sm p-button-padding! gap-3 btn-color text-white"
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
