'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useConfirmSubscriptionMutation } from '@/redux/api/subscriptionApi'
import { ApiError } from '@/types'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const PaymentSuccessPage = () => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [confirmSubscription, { isSuccess, isError, error }] = useConfirmSubscriptionMutation()
  const [isProcessing, setIsProcessing] = useState(true)
  const confirmationStarted = useRef(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const paypalSubscriptionId = searchParams.get('subscription_id')
    const paypalToken = searchParams.get('token')
    const paypalPayerId = searchParams.get('PayerID')
    const razorpayPaymentId = searchParams.get('razorpay_payment_id')
    const razorpaySubscriptionId = searchParams.get('razorpay_subscription_id')
    const razorpayOrderId = searchParams.get('razorpay_order_id')
    const razorpaySignature = searchParams.get('razorpay_signature')

    const confirmPayment = async () => {
      try {
        let payload: any = {}

        // Handle Stripe success
        if (sessionId) {
          payload = {
            payment_gateway: 'stripe',
            session_id: sessionId,
          }
        }
        // Handle PayPal success (handles both subscriptions and orders)
        else if (paypalToken) {
          payload = {
            payment_gateway: 'paypal',
            paypal_subscription_id: paypalSubscriptionId || paypalToken,
            token: paypalToken,
            PayerID: paypalPayerId,
          }
        }
        // Handle Razorpay success
        else if (razorpayPaymentId && (razorpaySubscriptionId || razorpayOrderId) && razorpaySignature) {
          payload = {
            payment_gateway: 'razorpay',
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
          }
          if (razorpaySubscriptionId) {
            payload.razorpay_subscription_id = razorpaySubscriptionId
          } else {
            payload.razorpay_order_id = razorpayOrderId
          }
        }
        // No valid payment parameters found
        else {
          toast.error(t('invalid_payment_confirmation_parameters'))
          setIsProcessing(false)
          return
        }

        await confirmSubscription(payload).unwrap()
        toast.success(t('payment_confirmed_successfully'))
        setIsProcessing(false)

        // Redirect to subscriptions page after a short delay
        setTimeout(() => {
          router.push(ROUTES.SUBSCRIPTIONS)
        }, 2000)
      } catch (error) {
        console.error(t('payment_confirmation_error'), error)
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('failed_to_confirm_payment'))
        setIsProcessing(false)
      }
    }

    if (sessionId || paypalSubscriptionId || paypalToken || razorpayPaymentId || razorpayOrderId) {
      if (!confirmationStarted.current) {
        confirmationStarted.current = true
        confirmPayment()
      }
    } else {
      toast.error(t('no_payment_information_found'))
      setIsProcessing(false)
    }
  }, [searchParams, confirmSubscription, router, t])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <CardTitle className="text-xl">{t('confirming_payment')}</CardTitle>
              <p className="text-muted-foreground">
                {t('please_wait_while_we_confirm_your_payment_and_activate_your_subscription')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <CardTitle className="text-xl text-green-600">{t('payment_successful')}</CardTitle>
              <p className="text-muted-foreground">
                {t('your_subscription_has_been_activated_successfully_redirecting_to_your_subscriptions')}
              </p>
              <Button onClick={() => router.push(ROUTES.SUBSCRIPTIONS)} className="w-full">
                {t('view_my_subscription')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <CardTitle className="text-xl text-red-600">{t('payment_confirmation_failed')}</CardTitle>
              <p className="text-muted-foreground">
                {(error as ApiError)?.data?.message || 'There was an issue confirming your payment. Please contact support.'}
              </p>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => router.push(ROUTES.PLANS)} className="flex-1">
                  {t('back_to_plans')}
                </Button>
                <Button onClick={() => router.push(ROUTES.SUBSCRIPTIONS)} className="flex-1">
                  {t('view_subscriptions')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500" />
            <CardTitle className="text-xl">{t('no_payment_information_found')}</CardTitle>
            <p className="text-muted-foreground">
              {t('no_payment_confirmation_status')}
            </p>
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={() => router.push(ROUTES.PLANS)} className="flex-1">
                {t('back_to_plans')}
              </Button>
              <Button onClick={() => router.push(ROUTES.SUBSCRIPTIONS)} className="flex-1">
                {t('view_subscriptions')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentSuccessPage
