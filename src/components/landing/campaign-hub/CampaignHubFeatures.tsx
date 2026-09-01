'use client'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { features } from '../../../data/landingCampaignHub'

export default function CampaignHubFeatures() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  return (
    <section 
      id="features" 
      ref={(el) => registerRef('#features', el)}
      className="py-[calc(35px+(90-35)*((100vw-320px)/(1920-320)))] relative overflow-hidden bg-slate-50/50 dark:bg-landing-bg-dark transition-colors"
    >
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none opacity-50" />
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative">
        <div className="text-center mb-[calc(35px+(80-35)*((100vw-320px)/(1920-320)))]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[calc(28px+(56-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6 leading-[1.1]"
          >
            {t('everything_you_need_to')}
            <br />
            <span className="text-primary">{t('scale_your_reach')}.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[calc(15px+(18-15)*((100vw-320px)/(1920-320)))] text-slate-600 dark:text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('ai_driven_tools_that_streamline_your_entire_marketing_workflow_from_lead_capture_to_final_sale')}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/15 rounded-full blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div
                className={cn(
                  'relative inline-flex p-4 sm:p-5 rounded-2xl mb-6 transform transition-transform duration-300 group-hover:scale-110 shadow-md',
                  f.bg,
                  f.color,
                )}
              >
                <f.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <h3 className="relative text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-primary transition-colors duration-200">
                {f.title}
              </h3>
              <p className="relative text-slate-600 dark:text-white/60 font-normal leading-relaxed text-sm sm:text-base group-hover:text-slate-800 dark:group-hover:text-white/80 transition-colors duration-200">
                {f.description}
              </p>
              <div className="absolute top-6 right-8 text-slate-200 dark:text-white/5 font-extrabold text-5xl select-none group-hover:text-primary/15 transition-colors duration-300">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
