'use client'

import { useSectionRefs } from '@/context/SectionRefsContext'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { socialMediaFeatures } from '../../../data/landingSocialMedia'

export default function SocialMediaFeatures() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  return (
    <section 
      id="features" 
      ref={(el) => registerRef('#features', el)}
      className="pb-20 md:pb-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative">
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t('core_features')}
          </motion.div>
          <h2 className="text-[calc(28px+(46-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-white leading-[1.2] md:leading-[1.1]">
            {t('intelligent_productivity_tools')} <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-secondary1 bg-clip-text text-transparent">
              {t('built_for_creators')}
            </span>
          </h2>
          <p className="text-base md:text-xl text-white/50 max-w-2xl mx-auto font-medium opacity-80 px-4 md:px-0">
            {t('everything_you_need_to_create_schedule_and_optimise_social_media_content_powered_by_ai')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {socialMediaFeatures.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-border-radius md:rounded-[3rem] bg-light-primary border border-white/[0.05] hover:border-white/10 transition-all duration-700 shadow-2xl overflow-hidden backdrop-blur-3xl hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />

              <div
                className={cn(
                  'relative inline-flex p-5 md:p-6 rounded-border-radius md:rounded-[1rem] mb-4 md:mb-8 bg-white/[0.03] border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl',
                  f.color,
                )}
              >
                <f.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              <h3 className="relative text-[20px] md:text-[24px] font-semibold mb-3 md:mb-3 text-white group-hover:text-primary transition-colors duration-500">
                {f.title}
              </h3>
              <p className="relative text-white/50 font-normal leading-relaxed text-sm md:text-base group-hover:text-white/70 transition-colors duration-500">
                {f.description}
              </p>

              <div className="absolute inset-x-0 -bottom-10 h-20 bg-primary/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
