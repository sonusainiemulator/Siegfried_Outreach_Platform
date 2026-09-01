'use client'

import { Button } from '@/components/ui/button'
import { pricingTabs } from '@/data/landing'
import { cn } from '@/lib/utils'
import { useGetActivePlansQuery } from '@/redux/api/planApi'
import { useGetCurrentSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { Plan } from '@/types'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PlanCard } from './components/PlanCard'
import PaymentModal from './PaymentModal'

const UserPlans = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: plansResponse, isLoading } = useGetActivePlansQuery()
  const { data: subscriptionResp } = useGetCurrentSubscriptionQuery()

  const activeSubscription = subscriptionResp?.subscription
  const [activeTab, setActiveTab] = useState<'subscription' | 'prepaid' | 'lifetime'>('subscription')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [confirmedBillingCycle, setConfirmedBillingCycle] = useState<'monthly' | 'yearly' | 'one-time'>('monthly')

  const rawPlansData = (plansResponse as any)?.data
  const plans: Plan[] = Array.isArray(rawPlansData)
    ? rawPlansData
    : Array.isArray(rawPlansData?.plans)
    ? rawPlansData.plans
    : Array.isArray(plansResponse)
    ? (plansResponse as any)
    : []

  const displayedPlans = plans.flatMap((plan: Plan) => {
    if (activeTab === 'subscription' && plan.plan_type === 'subscription') {
      const results = []
      if (plan.billing_cycle === 'monthly' || plan.billing_cycle === 'both') {
        results.push({ ...plan, unique_id: `${plan.id}-monthly`, _display_billing: 'monthly' })
      }
      if (plan.billing_cycle === 'yearly' || plan.billing_cycle === 'both') {
        results.push({ ...plan, unique_id: `${plan.id}-yearly`, _display_billing: 'yearly' })
      }
      return results
    }
    if (activeTab === 'prepaid' && plan.plan_type === 'prepaid') {
      return [{ ...plan, unique_id: `${plan.id}-prepaid`, _display_billing: 'one-time' }]
    }
    if (activeTab === 'lifetime' && plan.plan_type === 'lifetime') {
      return [{ ...plan, unique_id: `${plan.id}-lifetime`, _display_billing: 'one-time' }]
    }
    return []
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const handleSubscribeClick = (plan: Plan) => {
    setSelectedPlan(plan)
    const initialCycle = plan.plan_type === 'subscription' ? (plan as any)._display_billing : 'one-time'
    setConfirmedBillingCycle(initialCycle)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    setSelectedPlan(null)
    router.push('/subscriptions')
  }

  const isPlanActive = (planId: string) => {
    if (!activeSubscription) return false
    const isActiveStatus = activeSubscription.status === 'active' || activeSubscription.status === 'trialing'
    const isMatchingPlan = activeSubscription.plan?.id === planId || activeSubscription.plan_id === planId
    return isActiveStatus && isMatchingPlan
  }

  const hasAnyActiveSubscription = () => {
    if (!activeSubscription) return false
    return activeSubscription.status === 'active' || activeSubscription.status === 'trialing'
  }

  return (
    <div className="space-y-12 pb-8 animate-in fade-in duration-700">
      {/* Header & Toggle */}
      <div className="text-center space-y-4 mb-8 mt-2">
        <h1 className="text-3xl font-medium tracking-tight mb-2 px-4">
          {t('choose_your_plan', { defaultValue: 'Choose the perfect plan for your business' })}
        </h1>
        <p className="text-xl font-medium text-subtitle-color max-w-2xl mx-auto px-4 mb-0">
          {t('plan_subtitle', {
            defaultValue: 'Unlock the full potential of your business with our tailored pricing plans.',
          })}
        </p>

        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex  justify-center items-center gap-2 flex-wrap custom-scrollbar overflow-auto max-w-2xl mx-auto p-2 px-4 glass-card glass-dark-card rounded-[8px]">
            {pricingTabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  'px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center',
                  activeTab === tab
                    ? 'bg-primary! text-white! dark:text-white transform scale-105'
                    : 'bg-[unset]! text-muted-foreground hover:bg-muted/80',
                )}
              >
                {t(tab, { defaultValue: tab.charAt(0).toUpperCase() + tab.slice(1) })}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Sections */}
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {displayedPlans.length === 0 ? (
          <div className="text-center py-20 glass-card glass-dark-card rounded-border-radius border border-glass-border">
            <p className="text-xl font-medium text-subtitle-color">
              {t('no_plans_available', { defaultValue: 'No plans available for this billing cycle.' })}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="plan-swiper pb-10! px-4"
            >
              {displayedPlans.map((plan: any) => {
                const isPro = plan.is_default
                const price = plan.amount

                let billingCycleLabel = 'mo'
                if (plan.plan_type === 'subscription' && plan._display_billing === 'yearly') billingCycleLabel = 'yr'
                if (plan.plan_type === 'lifetime') billingCycleLabel = t('lifetime')
                if (plan.plan_type === 'prepaid') billingCycleLabel = t('one_time')

                const isActive = isPlanActive(plan.id)

                return (
                  <SwiperSlide key={plan.unique_id} className="!h-auto flex items-stretch">
                    <PlanCard
                      plan={plan}
                      price={price || 0}
                      billingCycleLabel={billingCycleLabel}
                      isPro={isPro}
                      isActive={isActive}
                      isDisabled={hasAnyActiveSubscription()}
                      onSubscribe={() => handleSubscribeClick(plan)}
                      t={t}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        billingCycle={confirmedBillingCycle}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default UserPlans
