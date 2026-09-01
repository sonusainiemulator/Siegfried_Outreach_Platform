'use client'

import { Button } from '@/components/ui/button'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { socialMediaFaqs } from '@/data/landingSocialMedia'
import { cn } from '@/lib/utils'
import { useGetFaqsQuery } from '@/redux/api/faqApi'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SocialMediaFAQ() {
  const { t } = useTranslation()
  const { registerRef } = useSectionRefs()
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const { data: faqResponse, isLoading } = useGetFaqsQuery({ limit: 50 })

  const apiFaqs = faqResponse?.faqs?.filter((f: any) => f.status !== false) || []
  const faqs = apiFaqs.length > 0 ? apiFaqs : socialMediaFaqs

  return (
    <section 
      id="faq" 
      ref={(el) => registerRef('#faq', el)}
      className="px-6 py-16"
    >
      {isLoading && faqs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center space-y-4 mb-10 sm:mb-16">
            <h2 className="text-[calc(30px+(46-30)*((100vw-320px)/(1920-320)))] font-bold tracking-tight text-white items-start leading-[1.1]">
              {t('need')} <span className="bg-gradient-to-r from-primary to-secondary1 bg-clip-text text-transparent">{t('help')}</span>
            </h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              {t('our_support_team_augmented_by_ai_answers_in_seconds') || 'Our support team and AI agents are available 24/7 to answer your questions.'}
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((item: any, idx: number) => {
              const isOpen = activeFaq === idx
              return (
                <motion.div
                  key={item.id || item._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    'border rounded-border-radius overflow-hidden transition-all duration-500',
                    isOpen
                      ? 'border-primary/40 bg-gradient-to-b from-white/[0.05] to-transparent shadow-[0_0_40px_rgba(113,152,192,0.08)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20',
                  )}
                >
                  <Button
                    className="w-full flex items-center justify-between p-7 text-left gap-4 h-auto whitespace-normal hover:bg-transparent!"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    variant="ghost"
                  >
                    <span
                      className={cn(
                        'font-bold text-base sm:text-lg transition-colors duration-300 text-left flex-1',
                        isOpen ? 'text-white' : 'text-white/70',
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300',
                        isOpen
                          ? 'bg-primary/20 border-primary/40 text-primary'
                          : 'bg-white/5 border-white/10 text-white/40',
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
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="mx-7 h-px bg-white/5 mb-6" />
                        <p className="px-7 pb-7 text-white/50 font-medium leading-relaxed text-sm sm:text-base">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
