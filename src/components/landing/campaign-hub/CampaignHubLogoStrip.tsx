'use client'
import { logos } from '@/data/landing'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function CampaignHubLogoStrip() {
  const { t } = useTranslation()
  return (
    <section className="py-[calc(26px+(50-26)*((100vw-320px)/(1920-320)))] border-y border-slate-200/60 dark:border-white/5 bg-slate-100/40 dark:bg-landing-bg-dark transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-slate-500 dark:text-white/40 text-sm sm:text-base font-semibold uppercase tracking-wider mb-[calc(18px+(32-18)*((100vw-320px)/(1920-320)))]"
        >
          {t('powering_campaign')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-100/90 dark:from-landing-bg-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-100/90 dark:from-landing-bg-dark to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-10 md:gap-16 w-fit"
          >
            {[...logos, ...logos].map((logo, i) => {
              const Icon = logo.icon
              return (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center gap-3 opacity-70 hover:opacity-100 transition-all duration-300 group cursor-default"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-opacity-50 transition-all shadow-sm"
                    style={{ backgroundColor: `${logo.color}15`, borderColor: `${logo.color}30` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: logo.color }} />
                  </div>
                  <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight whitespace-nowrap">{logo.name}</span>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}