'use client'
import { Button } from '@/components/ui/button'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { campaignHubFaqs } from '@/data/landingCampaignHub'
import { cn } from '@/lib/utils'
import { useGetFaqsQuery } from '@/redux/api/faqApi'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CampaignHubFAQ() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const { data: faqResponse, isLoading } = useGetFaqsQuery({ limit: 50 })
  
  const apiFaqs = faqResponse?.faqs?.filter((f: any) => f.status !== false) || []
  const faqs = apiFaqs.length > 0 ? apiFaqs : campaignHubFaqs

  return (
    <section
      id="faq"
      ref={(el) => registerRef('#faq', el)}
      className="py-[calc(35px+(90-35)*((100vw-320px)/(1920-320)))] relative overflow-hidden bg-slate-100/40 dark:bg-landing-bg-dark transition-colors"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-[calc(30px+(50-30)*((100vw-320px)/(1920-320)))]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-[calc(28px+(52-28)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1]">
            {t('got')} <span className="text-primary">{t('questions')}</span>?
          </h2>
          <p className="text-[calc(15px+(18-15)*((100vw-320px)/(1920-320)))] text-slate-600 dark:text-white/60 font-normal max-w-2xl mx-auto leading-relaxed">
            {t('faq_description') || 'Everything you need to know about our multi-channel outreach, AI agents, social media automation, and integrations.'}
          </p>
        </div>

        {isLoading && faqs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3.5">
            {faqs.map((item: any, idx: number) => {
              const isOpen = activeFaq === idx
              return (
                <motion.div
                  key={item.id || item._id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  className={cn(
                    'border rounded-2xl overflow-hidden transition-all duration-300',
                    isOpen
                      ? 'border-primary/50 dark:border-primary/40 bg-white dark:bg-slate-900/80 shadow-lg dark:shadow-[0_0_30px_rgba(113,152,192,0.12)]'
                      : 'border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/[0.035]'
                  )}
                >
                  <Button
                    className="w-full hover:bg-transparent! flex items-center justify-between p-5 sm:p-6 text-left gap-4 h-auto whitespace-normal"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    variant="ghost"
                  >
                    <span
                      className={cn(
                        'font-bold text-base sm:text-lg leading-snug transition-colors duration-200 text-left flex-1',
                        isOpen ? 'text-primary dark:text-white' : 'text-slate-800 dark:text-white/85'
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200',
                        isOpen
                          ? 'bg-primary/20 border-primary/50 text-primary scale-105'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40'
                      )}
                    >
                      <ChevronDown
                        className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180 text-primary')}
                      />
                    </span>
                  </Button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="mx-5 sm:mx-6 h-px bg-slate-200 dark:bg-white/10 mb-4" />
                        <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-slate-600 dark:text-white/70 font-normal leading-relaxed text-sm sm:text-base">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
