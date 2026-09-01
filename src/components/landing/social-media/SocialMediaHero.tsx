'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const getColumns = (t: any) => [
  {
    items: [{ type: 'image', src: '/social_mockup_thumbnails.png', alt: 'Feed Grid', width: 260, height: 520 }],
  },
  {
    items: [
      { type: 'image', src: '/social_mockup_1.png', alt: 'Artist Portrait', width: 300, height: 400 },
      {
        type: 'card',
        content: (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-6 rounded-[1.5rem] border border-white/10 shadow-2xl text-left w-full">
            <div className="text-3xl font-black text-white leading-none mb-2">1000+</div>
            <div className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] leading-relaxed">
              {t('milliniors_minted')}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    items: [{ type: 'image', src: '/social_mockup_2.png', alt: 'Social Dashboard', width: 300, height: 550 }],
  },
  {
    items: [
      {
        type: 'card',
        content: (
          <div className="bg-gradient-to-br from-orange-400 to-rose-400 p-6 rounded-[1.5rem] border border-white/10 shadow-2xl text-left w-full">
            <div className="text-3xl font-black text-white leading-none mb-2">75M+</div>
            <div className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] leading-relaxed">
              {t('serve_by_love_our_creators')}
            </div>
          </div>
        ),
      },
      { type: 'image', src: '/social_story_mockup.png', alt: 'Social Story', width: 260, height: 400 },
    ],
  },
  {
    items: [{ type: 'image', src: '/social_mockup_1.png', alt: 'Featured Portrait', width: 300, height: 460 }],
  },
  {
    items: [
      { type: 'image', src: '/social_mockup_thumbnails.png', alt: 'Feed Grid', width: 260, height: 520 },
      {
        type: 'card',
        content: (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-700 p-6 rounded-[1.5rem] border border-white/10 shadow-2xl text-left w-full">
            <div className="text-3xl font-black text-white leading-none mb-2">50k+</div>
            <div className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] leading-relaxed">
              {t('ai_assets_generated_daily')}
            </div>
          </div>
        ),
      },
    ],
  },
]

import { useSectionRefs } from '@/context/SectionRefsContext'

export default function SocialMediaHero() {
  const router = useRouter()
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const columns = getColumns(t)

  return (
    <section 
      id="home"
      ref={(el) => registerRef('#home', el)}
      className="relative pt-30 sm:pt-40 pb-20 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center items-center"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] aspect-[2/1] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none opacity-50" />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center relative z-20 w-full px-6 mb-5 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-6 sm:mb-10 shadow-2xl"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          {t('ai_powered_social_suite')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[calc(32px+(60-32)*((100vw-320px)/(1920-320)))] font-medium tracking-tight leading-[1.1] sm:leading-[0.9] text-white max-w-[1100px] mb-6 sm:mb-5"
        >
          {t('boosts_our_social_media')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary1">
            {t('growth_with_ai')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl font-normal leading-relaxed mb-8 sm:mb-12"
        >
          {t('create_stunning_content')} <strong>{t('social_instagram')}</strong>, <strong>{t('social_facebook')}</strong>, <strong>{t('social_linkedin')}</strong>{' '}
          {t('and_key')} <strong>{t('social_twitter')}</strong> — {t('all_scheduled_and_published_automatically')}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(ROUTES.AUTH.REGISTER)}
            className="relative p-[1px] rounded-[16px] transition-all duration-300 group overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(149,164,252,0.15)] w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary1 opacity-100" />
            <div className="relative px-6 py-3 sm:px-8 sm:py-3 rounded-[15px] backdrop-blur-md flex items-center justify-center gap-3 transition-all duration-300 bg-dark-void/70">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              <span className="text-lg sm:text-[15px] font-medium text-white tracking-wide">
                {t('start_free_trial')}
              </span>
            </div>
          </motion.button>
          <Button
            variant="ghost"
            size="default"
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 h-auto rounded-2xl font-medium text-lg sm:text-[15px] text-white border border-white-a10 bg-white-a05 hover:bg-white/5 transition-all group/btn"
            onClick={() => router.push(`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.SOCIAL_MEDIA.DASHBOARD}`)}
          >
            {t('sign_in')}{' '}
            <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      <div className="w-full relative z-10 overflow-hidden py-0 sm:py-10">
        <div className="absolute inset-y-0 left-0 w-20 sm:block hidden bg-gradient-to-r from-dark-deep via-landing-animate/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20  sm:block hidden bg-gradient-to-l from-dark-deep via-landing-animate/90 to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex w-max"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
            },
          }}
        >
          {[1, 2].map((trackIdx) => (
            <div key={trackIdx} className="flex gap-8 items-center pr-8">
              {columns.map((column, colIdx) => (
                <div
                  key={colIdx}
                  className="flex flex-col gap-8 flex-shrink-0 items-center justify-center"
                  style={{
                    width: Math.max(...column.items.map((i) => i.width || 260)) + 'px',
                  }}
                >
                  {column.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="w-full">
                      {item.type === 'image' ? (
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                          <NextImage
                            src={item.src as string}
                            alt={item.alt as string}
                            width={item.width as number}
                            height={item.height as number}
                            className="w-full h-auto group-hover:scale-105 transition-transform duration-700 object-cover"
                            priority={trackIdx === 1}
                          />
                        </div>
                      ) : (
                        item.content
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
