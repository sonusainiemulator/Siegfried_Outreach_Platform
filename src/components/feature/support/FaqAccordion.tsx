'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'


export const FaqAccordion = ({ isLoading, activeFaqs, openFaqIndex, setOpenFaqIndex }: any) => {
  const { t } = useTranslation()

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  if (isLoading) return <Spinner text={t('loading_faqs')} className="h-64" />

  if (!activeFaqs || activeFaqs.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 glass-dark-card rounded-border-radius glass-card border border-dashed border-border/50">
        <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-medium text-lg">{t('no_faqs_found')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {activeFaqs.map((faq: any, index: number) => (
        <motion.div
          key={faq.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className={cn(
              'group overflow-hidden glass-dark-card',
              openFaqIndex === index
                ? 'border-primary/30 bg-primary/[0.03] shadow-lg shadow-primary/5'
                : 'border-border/40 bg-card/40 hover:bg-card/60 hover:border-primary/20 shadow-sm',
            )}
          >
            <Button
              variant="ghost"
              onClick={() => toggleFaq(index)}
              className="w-full h-auto px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between text-left gap-3 sm:gap-4 hover:bg-transparent"
            >
              <div className="flex gap-3 sm:gap-4 items-center">
                <div
                  className={cn(
                    'p-2 sm:p-2.5 rounded-xl border transition-colors text-primary shrink-0',
                    openFaqIndex === index
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white text-title-color border-title-color dark:bg-black dark:text-white dark:border-white',
                  )}
                >
                  <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3
                  className={cn(
                    'font-medium text-base sm:text-lg text-title-color leading-tight sm:leading-snug transition-colors dark:text-white',
                    openFaqIndex === index ? 'text-primary' : 'text-title-color',
                  )}
                >
                  {faq.title}
                </h3>
              </div>
              <div
                className={cn(
                  'mt-1 sm:mt-1.5 p-1 rounded-full bg-muted/50 transition-transform duration-300 shrink-0',
                  openFaqIndex === index ? 'rotate-180 text-primary' : '',
                )}
              >
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </Button>
            <AnimatePresence>
              {openFaqIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                    <div className="h-px w-full bg-border/50 mb-4" />
                    <div
                      className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(faq?.description ||"", {
                          ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
                        })
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
