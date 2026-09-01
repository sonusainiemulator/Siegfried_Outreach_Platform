'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import useSettings from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { useGetProfileQuery } from '@/redux/api/authApi'
import { useInitSubscriptionMutation } from '@/redux/api/subscriptionApi'
import { ApiError, Gateway, PaymentModalProps, PaymentStep } from '@/types'
import { loadStripe } from '@stripe/stripe-js'
import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import GatewaySelector from './payment/GatewaySelector'
import PayPalRedirectStep from './payment/PayPalRedirectStep'
import { ConfirmingStep, RazorpayCheckoutStep, SuccessStep } from './payment/PaymentSteps'
import StripeCheckoutStep from './payment/StripeCheckoutStep'
import { OfflinePaymentStep } from './payment/OfflinePaymentStep'

const stripePromiseCache: Record<string, ReturnType<typeof loadStripe>> = {}
function getStripe(key: string | null) {
  if (!key) return null
  if (!stripePromiseCache[key]) stripePromiseCache[key] = loadStripe(key)
  return stripePromiseCache[key]
}

const PaymentModal = ({ isOpen, onClose, plan, billingCycle, onSuccess }: PaymentModalProps) => {
  const [step, setStep] = useState<PaymentStep>('select-gateway')
  const [selectedGateway, setSelectedGateway] = useState<Gateway>('stripe')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paypalUrl, setPaypalUrl] = useState<string | null>(null)
  const { t } = useTranslation()

  const { settings } = useSettings()
  const { data: profileData } = useGetProfileQuery()
  const [initSubscription, { isLoading: isInitializing }] = useInitSubscriptionMutation()

  const stripeKey =
    settings?.stripe?.publishable_key || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  const modalWrapperRef = useRef<HTMLDivElement>(null)

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('select-gateway')
        setClientSecret(null)
        setPaypalUrl(null)
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (step === 'razorpay-checkout' || step === 'paypal-redirect') {
      const timer = setTimeout(() => {
        if (modalWrapperRef.current) {
          modalWrapperRef.current.style.pointerEvents = 'auto'
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleRazorpayPayment = (orderId: string, key: string) => {
    if (!key) {
      toast.error(t('razorpay_key_not_found'))
      return
    }

    const isOneTime = plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime' || billingCycle === 'one-time'

    setStep('razorpay-checkout')
    const rzp = new (window as any).Razorpay({
      key,
      [isOneTime ? 'order_id' : 'subscription_id']: orderId,
      amount: isOneTime ? Math.round((plan?.amount || 0) * 100) : undefined,
      currency: plan?.currency || 'USD',
      name: 'Siegfried Social Media Marketing Plateform',
      description: isOneTime ? `${t('payment_for')} ${plan?.name}` : `${t('subscription_for')} ${plan?.name}`,
      handler: async (response: any) => {
        let url = `/payment-success?payment_gateway=razorpay&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`
        if (isOneTime) {
          url += `&razorpay_order_id=${response.razorpay_order_id}`
        } else {
          url += `&razorpay_subscription_id=${response.razorpay_subscription_id}`
        }
        window.location.href = url
      },
      prefill: {
        name: profileData?.user?.name || '',
        email: profileData?.user?.email || '',
      },
      theme: { color: 'var(--input-background)' },
    })
    rzp.open()
  }

  const handleProceed = async () => {
    if (!plan) return
    if (selectedGateway === 'offline') {
      setStep('offline-payment')
      return
    }
    try {
      if (selectedGateway === 'stripe') {
        const res = await initSubscription({
          plan_id: plan.id,
          payment_gateway: 'stripe',
          embedded: true,
        }).unwrap()
        if (res.data?.client_secret) {
          setClientSecret(res.data.client_secret)
          setStep('stripe-checkout')
        } else if (res.data?.approval_url) window.location.href = res.data.approval_url
        else toast.error(t('could_not_initialize_stripe_checkout'))
      } else if (selectedGateway === 'paypal') {
        const res = await initSubscription({
          plan_id: plan.id,
          payment_gateway: 'paypal',
        }).unwrap()
        if (res.data?.approval_url) {
          setPaypalUrl(res.data.approval_url)
          setStep('paypal-redirect')
        } else toast.error(t('Could not initialize PayPal checkout.'))
      } else if (selectedGateway === 'razorpay') {
        const res = await initSubscription({
          plan_id: plan.id,
          payment_gateway: 'razorpay',
        }).unwrap()
        if (res.data?.gateway_order_id)
          handleRazorpayPayment(
            res.data.gateway_order_id,
            res.data.key_id || settings?.razorpay?.key_id,
          )
        else toast.error(t('could_not_initialize_razorpay_checkout'))
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('payment_initialization_failed'))
    }
  }

  const handleOfflineSubmit = async ({ offline_reference, offline_notes }: { offline_reference: string; offline_notes: string }) => {
    if (!plan) return
    await initSubscription({
      plan_id: plan.id,
      payment_gateway: 'offline',
      offline_reference,
      offline_notes,
    } as any).unwrap()
  }

  const handleStripeComplete = useCallback(() => {
    if (clientSecret) {
      const sessionId = clientSecret.split('_secret')[0]
      window.location.href = `/payment-success?session_id=${sessionId}`
    }
  }, [clientSecret])

  const dialogSize =
    step === 'stripe-checkout' || step === 'offline-payment'
      ? 'sm:max-w-2xl'
      : step === 'success' || step === 'confirming'
        ? 'sm:max-w-sm'
        : 'sm:max-w-xl! max-w-[calc(100%-2rem)]!'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={modalWrapperRef}
        className={cn(
          'p-0! bg-light-body dark:bg-modal-bg-color rounded-border-radius! overflow-hidden transition-all duration-300',
          dialogSize,
        )}
      >
        {isOpen && (
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
        )}
        <DialogTitle className="sr-only">{t('payment_for')} {plan?.name}</DialogTitle>
        {step === 'select-gateway' && (
          <GatewaySelector
            plan={plan}
            billingCycle={billingCycle}
            selectedGateway={selectedGateway}
            onSelectGateway={setSelectedGateway}
            onProceed={handleProceed}
            onClose={onClose}
            isInitializing={isInitializing}
          />
        )}
        {step === 'offline-payment' && (
          <OfflinePaymentStep
            plan={plan}
            billingCycle={billingCycle}
            onBack={() => setStep('select-gateway')}
            onSubmit={handleOfflineSubmit}
            isSubmitting={isInitializing}
          />
        )}
        {step === 'stripe-checkout' && clientSecret && (
          <StripeCheckoutStep
            clientSecret={clientSecret}
            stripePromise={getStripe(stripeKey)}
            onComplete={handleStripeComplete}
            onBack={() => setStep('select-gateway')}
          />
        )}
        {step === 'paypal-redirect' && paypalUrl && (
          <PayPalRedirectStep paypalUrl={paypalUrl} onBack={() => setStep('select-gateway')} />
        )}
        {step === 'razorpay-checkout' && <RazorpayCheckoutStep onBack={() => setStep('select-gateway')} />}
        {step === 'confirming' && <ConfirmingStep />}
        {step === 'success' && <SuccessStep plan={plan} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentModal
