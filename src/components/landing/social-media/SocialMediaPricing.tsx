'use client'
import { PlanCard } from '@/components/feature/plans/components/PlanCard'
import { Button } from '@/components/ui/button'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { pricingTabs } from '@/data/landing'
import { cn } from '@/lib/utils'
import { useGetActivePlansQuery } from '@/redux/api/planApi'
import { useAppSelector } from '@/redux/hooks'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function SocialMediaPricing() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const router = useRouter()
  const { data: plansResponse, isLoading } = useGetActivePlansQuery()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [activeTab, setActiveTab] = useState<'subscription' | 'prepaid' | 'lifetime'>('subscription')

  const plans = (plansResponse as any)?.data || []

  const displayedPlans = plans.flatMap((plan: any) => {
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

  return (
    <section 
      id="pricing" 
      ref={(el) => registerRef('#pricing', el)}
      className="pb-20 md:pb-32 px-6"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 md:space-y-6 mb-8">
          <h2 className="text-[calc(28px+(46-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-white leading-[1.2] md:leading-[1.1]">
            {t('simple')} &amp; <span className="bg-gradient-to-r from-primary to-secondary1 bg-clip-text text-transparent">{t('affordable')}</span> {t('pricing')}.
          </h2>
          <p className="text-base md:text-xl text-white/50 font-medium leading-relaxed max-w-2xl mx-auto px-4">
            {t('start_free')}
          </p>

          <div className="flex flex-col items-center gap-6 mt-10">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 p-2 rounded-2xl md:rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] shadow-2xl w-full md:w-fit mx-auto relative">
              {pricingTabs.map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    'relative px-6 py-2.5 rounded-xl md:rounded-full! text-base md:text-lg font-bold transition-all duration-500 flex items-center shrink-0 capitalize z-10',
                    activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  )}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activePricingTab"
                      className="absolute inset-0 bg-primary rounded-xl md:rounded-full shadow-[0_4px_20px_rgba(149,164,252,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20 font-medium text-base">{tab === 'subscription' ? 'Monthly/Yearly' : tab}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {displayedPlans.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-glass-border mx-4">
            <p className="text-lg md:text-xl font-bold text-muted-foreground">{t('no_plans_available_for_this_category')}</p>
          </div>
        ) : (
          <div className="w-full">
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="pb-16 px-4"
            >
              {displayedPlans.map((plan: any, idx: number) => {
                const isPro = plan.is_default
                const price = plan.amount

                let billingCycleLabel = 'mo'
                if (plan.plan_type === 'subscription' && plan._display_billing === 'yearly') billingCycleLabel = 'yr'
                if (plan.plan_type === 'lifetime') billingCycleLabel = 'lifetime'
                if (plan.plan_type === 'prepaid') billingCycleLabel = 'one time'

                return (
                  <SwiperSlide key={plan.unique_id || idx} className="h-auto mt-[28px]">
                    <PlanCard
                      plan={plan}
                      price={price || 0}
                      billingCycleLabel={billingCycleLabel}
                      isPro={isPro}
                      isActive={false}
                      isDisabled={false}
                      isLanding={true}
                      onSubscribe={() => router.push(isAuthenticated ? '/plans' : '/login')}
                      buttonText={plan.trial_period_days > 0 && plan.plan_type === 'subscription' ? `Start ${plan.trial_period_days}-Day Free Trial` : 'Get Started'}
                      t={t}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}
      </div>
        </>
      )}
    </section>
  )
}
