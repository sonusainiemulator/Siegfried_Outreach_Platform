'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { ctaBanner } from '@/data/landingSocialMedia'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function SocialMediaCTABanner() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <section className="pb-20 md:pb-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden bg-gradient-to-br from-[#0c0f24] via-[#111836] to-[#0a0d1e] border border-indigo-500/30 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-[100%] blur-[120px]" />
          <div className="absolute bottom-[-20%] left-0 w-80 h-80 bg-secondary/20 rounded-full blur-[80px]" />

          <div className="relative z-10 p-5 md:p-14 flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-20">
            <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('ready_to_create')}
              </div>
              <h2 className="text-[calc(28px+(46-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-white leading-[1.2] md:leading-[1.1]">
                {t('transform_your')}
                <span className="bg-gradient-to-r from-primary to-secondary1 bg-clip-text text-transparent ml-0 md:ml-2">
                  {t('social_world')}
                </span>{' '}
                {t('today')}.
              </h2>
              <p className="text-base md:text-xl text-white/50 font-medium leading-relaxed max-w-xl">
                {t('join_five_thousand_creators')}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 pt-4">
                {ctaBanner.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs md:text-base font-black text-white/30 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-60" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-auto">
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-5 md:p-10 space-y-6 group hover:bg-white/[0.04] transition-all duration-700 w-full lg:max-w-md">
                <h3 className="text-white text-xl md:text-2xl font-black">{t('get_started')}</h3>
                <p className="text-white/40 text-sm md:text-base font-medium">{t('create_first_ai_post')}</p>
                <Button
                  className="w-full h-14 md:h-16 rounded-border-radius btn-color text-white hover:bg-white/95 font-medium text-base md:text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
                  onClick={() => router.push(ROUTES.AUTH.REGISTER)}
                >
                  {t('start_free_trial')} <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
