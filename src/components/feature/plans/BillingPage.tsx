'use client'

import Spinner from '@/components/reusable/Spinner'
import { useGetActivePlansQuery } from '@/redux/api/planApi'
import { useCancelSubscriptionMutation, useGetCurrentSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { ApiError, Plan } from '@/types'
import { AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PaymentModal from './PaymentModal'
import BillingHero from './billing/BillingHero'
import CurrentSubscriptionCard from './billing/CurrentSubscriptionCard'
import PlanCard from './billing/PlanCard'

const BillingPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const { data: plansData, isLoading: isPlansLoading } = useGetActivePlansQuery()
  const { data: subData, isLoading: isSubLoading } = useGetCurrentSubscriptionQuery()
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [confirmedBillingCycle, setConfirmedBillingCycle] = useState<'monthly' | 'yearly' | 'one-time'>('monthly')

  const plans = plansData?.data || []
  const subscription = subData?.subscription
  const currentPlan = subscription?.plan

  const handleSubscribeClick = (plan: Plan) => {
    setSelectedPlan(plan)
    const initialCycle = plan.plan_type === 'subscription' ? billingCycle : 'one-time'
    setConfirmedBillingCycle(initialCycle)
    setIsPaymentModalOpen(true)
  }

  const handleCancel = async () => {
    if (!subscription?.id) return
    try {
      await cancelSubscription({ subscription_id: subscription.id }).unwrap()
      toast.success(t('subscription_canceled_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  if (isPlansLoading || isSubLoading) return <Spinner className="fixed inset-0 h-screen z-[9999] bg-background" />

  return (
    <div className="min-h-screen pb-20 space-y-12 animate-in fade-in duration-1000">
      <BillingHero
        billingCycle={billingCycle}
        onToggle={() => setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))}
      />

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto items-stretch">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={index}
            billingCycle={billingCycle}
            isCurrent={currentPlan?.id === plan.id}
            onSubscribe={handleSubscribeClick}
          />
        ))}
      </div>

      {/* Active Subscription */}
      <AnimatePresence>
        {subscription && (
          <CurrentSubscriptionCard subscription={subscription} isCanceling={isCanceling} onCancel={handleCancel} />
        )}
      </AnimatePresence>

      {/* Payment Trust Badges */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest flex items-center justify-center gap-4 before:h-px before:w-12 before:bg-glass-border after:h-px after:w-12 after:bg-glass-border">
          {t('trusted_payment_gateways')}
        </p>
        <div className="flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
            alt="Stripe"
            width={100}
            height={100}
            unoptimized
            className="h-6"
          />
          <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={100} height={100} unoptimized className="h-6" />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
            alt="Razorpay"
            width={100}
            height={100}
            unoptimized
            className="h-6"
          />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        billingCycle={confirmedBillingCycle}
        onSuccess={() => {
          setIsPaymentModalOpen(false)
          setSelectedPlan(null)
          router.refresh()
        }}
      />
    </div>
  )
}

export default BillingPage
