'use client';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { ctaBanner } from '@/data/landingSocialMedia';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CampaignHubCTABanner() {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      router.push(`${ROUTES.AUTH.REGISTER}?email=${encodeURIComponent(email)}`)
    } else {
      router.push(ROUTES.AUTH.REGISTER)
    }
  }

  return (
    <section className="py-[calc(35px+(90-35)*((100vw-320px)/(1920-320)))] px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] bg-purple-600/20 blur-[80px] sm:blur-[140px] rounded-full -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-blue-600/20 blur-[70px] sm:blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-[#0c0f24] via-[#111836] to-[#0a0d1e] border border-indigo-500/30 shadow-[0_25px_80px_rgba(15,23,42,0.6)]">
          {/* Ambient Glows */}
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading & Value Props */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-3 space-y-6 sm:space-y-8 text-left"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Start In Under 2 Minutes</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] drop-shadow-md">
                  {t('ready_to_transform')}{' '}
                  <span className="bg-gradient-to-r from-sky-400 via-primary to-indigo-400 bg-clip-text text-transparent">
                    {t('your_marketing')}?
                  </span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl">
                  {t('join_2000_businesses_using_ai_powered_whatsapp_telegram_and_email_automation_to_drive_real_growth')}
                </p>

                <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-3 pt-2">
                  {ctaBanner.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200"
                    >
                      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Column: High-Converting Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2 w-full"
              >
                <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden group">
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                      {t('get_started_today')}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm font-normal">
                      {t('create_your_first_campaign_in_under_2_minutes')}
                    </p>
                  </div>

                  <form onSubmit={handleStartTrial} className="space-y-3.5">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your business email"
                        className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm backdrop-blur-sm transition-all"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-primary text-white hover:opacity-95 font-bold text-sm sm:text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] active:scale-95 group/btn cursor-pointer"
                    >
                      <span className="flex-1 text-center">{t('start_free_trial')}</span>
                      <ArrowRight className="ml-1.5 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </form>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      className="text-xs sm:text-sm text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
                      onClick={() => router.push(`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.CAMPAIGN_HUB}`)}
                    >
                      <span>{t('already_have_an_account')}? </span>
                      <span className="text-white font-bold underline decoration-white/40 hover:decoration-white">
                        {t('sign_in')}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}