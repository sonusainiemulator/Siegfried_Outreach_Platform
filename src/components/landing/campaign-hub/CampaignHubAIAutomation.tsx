'use client'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { motion } from 'framer-motion'
import {
  Facebook,
  Instagram,
  Layers,
  Mail,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CampaignHubAIAutomation() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  return (
    <section
      id="automation"
      ref={(el) => registerRef('#automation', el)}
      className="py-[calc(35px+(90-35)*((100vw-320px)/(1920-320)))] relative overflow-hidden bg-slate-100/40 dark:bg-landing-bg-dark transition-colors"
    >
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[calc(28px+(56-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            {t('three_steps_to')}
            <br />
            <span className="text-primary">{t('full_automation')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[calc(15px+(18-15)*((100vw-320px)/(1920-320)))] text-slate-600 dark:text-white/60 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('from_idea_to_inbox')} — {t('our_ai_handles_the_heavy_lifting_so_you_can_focus_on_growing')}.
          </motion.p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 mt-6 min-h-[500px]">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: -4 }}
            viewport={{ once: true }}
            className="w-full max-w-[340px] aspect-[4/5] bg-white dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-xl relative md:-mr-8 z-10 md:mt-8 border border-slate-200/80 dark:border-white/10"
          >
            <div className="absolute inset-0 bg-pink-500/5 blur-3xl -z-10 rounded-[2.5rem]" />

            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-white/5 border border-pink-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                <Layers className="w-7 h-7 text-pink-500 dark:text-white/90" />
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white/10 text-[10px] font-black flex items-center justify-center border border-white/20 shadow-md">
                01
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{t('social_media_campaigns')}</h3>
              <div className="h-px w-12 bg-slate-200 dark:bg-white/10 mx-auto" />
              <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm font-normal leading-relaxed">{t('social_media_campaigns_desc')}</p>
            </div>

            <div className="flex items-center justify-center -gap-3 pt-2">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-md flex items-center justify-center z-20">
                <Facebook className="w-6 h-6 text-facebook fill-facebook" />
              </div>
              <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white/15 border border-slate-700 dark:border-white/20 shadow-xl flex items-center justify-center z-30 scale-110">
                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg italic">X</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-md flex items-center justify-center z-20">
                <Instagram className="w-6 h-6 text-instagram" />
              </div>
            </div>
          </motion.div>

          {/* Step 2 (Center Glowing AI card) */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-[360px] aspect-[4/5] bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 backdrop-blur-[50px] rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-[0_30px_70px_rgba(79,70,229,0.35)] border border-indigo-500/30 relative z-30 text-white"
          >
            <div className="absolute inset-0 bg-primary/15 blur-[60px] -z-10 rounded-[2.5rem]" />

            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shadow-lg border border-white/20">
                02
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{t('trained_on_your_campaigns')}</h3>
              <div className="h-px w-12 bg-white/20 mx-auto" />
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">{t('trained_on_your_campaigns_desc')}</p>
            </div>

            <div className="relative group cursor-pointer mt-2 w-full">
              <div className="absolute inset-0 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse" />
              <div className="relative bg-slate-950/90 backdrop-blur-md justify-center rounded-full px-6 py-3 border border-white/20 flex items-center gap-2.5 shadow-2xl hover:scale-[1.02] transition-transform">
                <Sparkles className="w-4 h-4 text-white fill-white" />
                <span className="text-white font-bold text-xs uppercase tracking-wider">{t('start_training')}</span>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: 4 }}
            viewport={{ once: true }}
            className="w-full max-w-[340px] aspect-[4/5] bg-white dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-xl relative md:-ml-8 z-10 md:mt-8 border border-slate-200/80 dark:border-white/10"
          >
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl -z-10 rounded-[2.5rem]" />

            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-7 h-7 text-blue-500 dark:text-white/90" />
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white/10 text-[10px] font-black flex items-center justify-center border border-white/20 shadow-md">
                03
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{t('omnichannel')}</h3>
              <div className="h-px w-12 bg-slate-200 dark:bg-white/10 mx-auto" />
              <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm font-normal leading-relaxed">{t('omnichannel_desc')}</p>
            </div>

            <div className="w-full bg-slate-50 dark:bg-white/[0.03] backdrop-blur-md rounded-2xl p-3.5 space-y-2 border border-slate-200/60 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
                    <Mail className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                  <span className="text-slate-800 dark:text-white font-bold text-xs sm:text-sm">{t('Email')}</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-white/70">
                  4
                </span>
              </div>
              <div className="h-px w-full bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                    <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                  <span className="text-slate-800 dark:text-white font-bold text-xs sm:text-sm">{t('Whatsapp')}</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-white/70">
                  4
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
