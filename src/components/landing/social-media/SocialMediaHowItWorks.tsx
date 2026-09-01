'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { howItWorks } from '../../../data/landingSocialMedia'

export default function SocialMediaHowItWorks() {
  const { t } = useTranslation()
  return (
    <section 
      id="how-it-works" 
      className="py-20 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-primary/5 rounded-[100%] blur-[120px] -z-10 pointer-events-none opacity-50" />

      <div className="max-w-[1400px] mx-auto">
        <div className="text-center space-y-4 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4"
          >
            {t('our_process')}
          </motion.div>
          <h2 className="text-[calc(28px+(46-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-white leading-[1.2] md:leading-[1.1]">
            {t('from_idea_to_published')}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-secondary1 bg-clip-text text-transparent ml-2">
              in {t('four_simple_steps')}.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-12 lg:gap-8 relative items-start">
          <div className="hidden lg:flex absolute md:hidden top-[35px] left-0 w-full px-[12%] items-center justify-between z-0 pointer-events-none">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex-1 flex items-center px-8 xl:px-14">
                <div className="flex-1 h-[2px] border-t-2 border-dashed border-white/10" />
                <div className="w-3 h-3 rounded-full bg-primary/30 border border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] mx-1" />
                <div className="flex-1 h-[2px] border-t-2 border-dashed border-white/10" />
              </div>
            ))}
          </div>

          {howItWorks.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center group"
            >
              {idx < howItWorks.length - 1 && (
                <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-20 bottom-[-48px] md:bottom-[-36px] flex flex-col items-center z-0 opacity-40 pointer-events-none">
                  <div
                    className={`w-[1px] h-full border-l border-dashed border-white/20 ${idx === 1 && 'md:hidden'}`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full bg-primary/40 border border-primary/60 shrink-0 ${idx === 1 && 'md:hidden'
                      }`}
                  />
                </div>
              )}

              <div className="relative mb-8 md:mb-10 z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[15px] md:rounded-[20px] bg-light-primary border border-white/10 flex items-center justify-center shadow-2xl relative group-hover:border-primary/40 transition-all duration-700 backdrop-blur-xl">
                  <div className="absolute inset-0 transition-opacity" />
                  <step.icon className="w-6 h-6 md:w-8 md:h-8 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-700" />

                  <div className="absolute -top-1 -right-2 md:-top-2 md:-right-3 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg bg-primary border border-white/10 text-[9px] md:text-[10px] font-black text-white">
                    {step.num}
                  </div>
                </div>
              </div>

              <div className="relative p-6 lg:p-8 rounded-border-radius md:rounded-[2rem] border border-white/[0.05] backdrop-blur-3xl shadow-2xl transition-all duration-700 bg-white/[0.04] hover:border-white/10 group-hover:-translate-y-2 w-full flex-grow">
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <h3 className="text-[18px] font-semibold mb-3 md:mb-4 text-white group-hover:text-primary transition-colors duration-500">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-white/50 font-normal leading-relaxed group-hover:text-white/70 transition-colors duration-500 line-clamp-3">
                  {step.description}
                </p>

                <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
              </div>

              <div className="h-10 md:hidden" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
