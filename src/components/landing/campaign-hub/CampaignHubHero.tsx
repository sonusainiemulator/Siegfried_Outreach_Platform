'use client'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Mail, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function CampaignHubHero() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const router = useRouter()

  return (
    <section
      id="home"
      ref={(el) => registerRef('#home', el)}
      className="relative pt-36 sm:pt-44 lg:pt-52 pb-16 sm:pb-20 lg:pb-28 px-4 sm:px-6 lg:px-10 xl:px-16 overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-[400px] sm:w-[560px] lg:w-[700px] h-[400px] sm:h-[560px] lg:h-[700px] bg-primary/15 rounded-full blur-[120px] sm:blur-[160px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-purple-500/10 rounded-full blur-[100px] sm:blur-[140px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 xl:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 sm:gap-7 lg:gap-8 text-center md:text-left items-center md:items-start"
        >
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] group transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 cursor-default">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-paypal transition-transform duration-300 group-hover:scale-110 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-900/90 dark:text-white/90 tracking-wide whitespace-nowrap">
              {t('next_gen_automation')}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[calc(30px+(65-30)*((100vw-320px)/(1920-320)))] font-semibold leading-[1.1] text-gray-900 dark:text-white"
          >
            {t('smart_marketing')} <br className="hidden sm:block" />
            {t('powered_by')} <span className="text-mix-primary animate-gradient-flow">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-[15px] xl:text-base text-gray-700 dark:text-white/80 max-w-xl lg:max-w-lg font-medium leading-relaxed"
          >
            {t('reach_your_customers_via')} <strong>{t('whatsapp')}</strong>, <strong>{t('telegram')}</strong> {t('and')} <strong>{t('email')}</strong> —
            {t('all_automated_all_from_one_intelligent_platform')}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(ROUTES.AUTH.REGISTER)}
              className="relative px-7 py-3.5 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-primary text-white font-bold text-base sm:text-[16px] shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 group overflow-hidden cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
              <span className="relative z-10 tracking-wide">{t('start_free_trial')}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-3.5 h-auto rounded-2xl font-semibold text-base sm:text-[15px] text-slate-800 dark:text-white border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group/btn shadow-sm"
              onClick={() => router.push(`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.SOCIAL_MEDIA.DASHBOARD}`)}
            >
              {t('sign_in')}{' '}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4 sm:gap-6 pt-1 sm:pt-2"
          >
            <div className="flex -gap-3 sm:-gap-4 shrink-0">
              {[47, 52, 44, 31].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-slate-900 bg-muted overflow-hidden shadow-md relative transition-transform hover:scale-110 hover:z-10"
                >
                  <Image
                    src={`https://i.pravatar.cc/100?img=${i}`}
                    alt="user"
                    width={72}
                    height={72}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-base sm:text-lg xl:text-xl font-semibold text-gray-900 dark:text-white leading-none">4.9/5 {t('rated')}</span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-none">
                <span className="text-gray-900 dark:text-white font-bold">2,000+</span> {t('businesses_trust_us')}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mt-4 md:mt-0 md767:hidden"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/20 transition-transform duration-700"
          >
            <Image
              src="/marketing_bot_hero.png"
              alt="Campaign Hub Interface"
              width={800}
              height={800}
              className="w-full h-auto"
              priority
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-3 sm:-top-7 sm:-right-6 lg:-top-8 lg:-right-8 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/20 shadow-2xl hidden sm:flex items-center gap-2.5 sm:gap-3"
          >
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-500 shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {t('status')}
              </div>
              <div className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{t('campaign_active')}</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-4 -left-3 sm:-bottom-7 sm:-left-6 lg:-bottom-8 lg:-left-8 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/20 shadow-2xl hidden sm:flex items-center gap-2.5 sm:gap-3"
          >
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/20 text-blue-500 shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {t('channels')}
              </div>
              <div className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{t('whatsapp')} · {t('telegram')} · {t('email')}</div>
            </div>
          </motion.div>

          <div className="absolute inset-x-8 bottom-0 h-20 bg-primary/20 blur-3xl -z-10 rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  )
}