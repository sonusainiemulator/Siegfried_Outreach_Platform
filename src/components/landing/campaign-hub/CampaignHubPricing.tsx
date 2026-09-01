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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function CampaignHubPricing() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const router = useRouter()
  const { data: plansResponse, isLoading, isError } = useGetActivePlansQuery()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [activeTab, setActiveTab] = useState<'subscription' | 'prepaid' | 'lifetime'>('subscription')
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)

  // Fallback: if loading takes more than 10 seconds, stop showing spinner
  useEffect(() => {
    if (!isLoading) {
      setLoadingTimedOut(false)
      return
    }
    const timer = setTimeout(() => setLoadingTimedOut(true), 10000)
    return () => clearTimeout(timer)
  }, [isLoading])

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
      className="py-[calc(35px+(90-35)*((100vw-320px)/(1920-320)))] relative overflow-hidden bg-slate-50 dark:bg-landing-bg-dark transition-colors"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {isLoading && !loadingTimedOut ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : isError || loadingTimedOut ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-slate-500 dark:text-white/40">{t('pricing_unavailable_check_back_soon') || 'Pricing plans temporarily unavailable. Please check back soon.'}</p>
          </div>
        ) : (
          <>
        <div className="text-center mb-[calc(30px+(60-30)*((100vw-320px)/(1920-320)))]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[calc(28px+(56-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1]"
          >
            {t('simple')} & <span className="text-primary">{t('transparent')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[calc(15px+(18-15)*((100vw-320px)/(1920-320)))] text-slate-600 dark:text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('scale_your_marketing_outreach_without_the_complexity_Choose_the_plan_that_fits_your_growth')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center items-center mt-8 sm:mt-10"
          >
            <div className="bg-slate-200/80 dark:bg-dark-base/80 backdrop-blur-md border border-slate-300/80 dark:border-white/10 p-1.5 rounded-[20px] flex items-center gap-1 shadow-lg max-sm:flex-col max-sm:w-full max-sm:p-2">
              {pricingTabs.map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    'relative px-8 py-2.5 rounded-[14px] font-bold text-xs sm:text-[13px] uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center min-w-[140px] overflow-hidden max-sm:w-full max-sm:px-4 max-sm:py-2',
                    activeTab === tab ? 'text-primary dark:text-white bg-white dark:bg-transparent shadow-sm' : 'text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80 bg-transparent',
                  )}
                >
                  {activeTab === tab && (
                    <>
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-white dark:bg-gradient-to-tr dark:from-primary/20 dark:via-white/10 dark:to-transparent border border-slate-200 dark:border-white/10 rounded-[14px]"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 dark:via-white/40 to-transparent"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                      {/* Principal Glow */}
                      <motion.div
                        layoutId="activeTabMainGlow"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-primary/30 blur-[10px] rounded-full"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                    </>
                  )}
                  <span className="relative z-10">{tab}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
        {displayedPlans.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-glass-border">
            <p className="text-xl font-bold text-muted-foreground">{t('no_plans_available_for_this_category')}</p>
          </div>
        ) : (
          <div className="w-full">
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 65000, disableOnInteraction: false }}
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
                  <SwiperSlide key={plan.unique_id || idx} className="h-auto">
                    <PlanCard
                      plan={plan}
                      price={price || 0}
                      billingCycleLabel={billingCycleLabel}
                      isPro={isPro}
                      isActive={false}
                      isDisabled={false}
                      isLanding={true}
                      onSubscribe={() => router.push(isAuthenticated ? '/plans' : '/login')}
                      buttonText={
                        plan.trial_period_days > 0 && plan.plan_type === 'subscription'
                          ? `Start ${plan.trial_period_days}-Day Free Trial`
                          : 'Get Started'
                      }
                      t={t}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}
          </>
        )}
      </div>
    </section>
  )
}
