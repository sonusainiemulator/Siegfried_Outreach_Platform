'use client'

import { useGetFaqsQuery } from '@/redux/api/faqApi'
import { useGetPagesQuery } from '@/redux/api/pageApi'
import { Faq, Page } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ContactSupportModal from './ContactSupportModal'
import { FaqAccordion } from './FaqAccordion'
import { FaqPageContent } from './FaqPageContent'
import { FaqTabs } from './FaqTabs'
import { SupportSidebar } from './SupportSidebar'

export const SupportFaqClient = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('faqs')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const { data: pageData, isLoading: isPageLoading } = useGetPagesQuery({
    limit: 50,
  })

  const { data: faqData, isLoading: isFaqLoading } = useGetFaqsQuery({
    limit: 100,
  })

  const activePages = pageData?.pages?.filter((p: Page) => p.status) || []
  const activeFaqs = faqData?.faqs?.filter((f: Faq) => f.status) || []

  return (
    <div className="flex flex-col animate-fade-in w-full max-w-full mx-auto pb-10 space-y-8 relative overflow-x-hidden">
      <div className="relative space-y-4 ">
        <FaqTabs activeTab={activeTab} setActiveTab={setActiveTab} activePages={activePages} />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start pt-4 lg:pt-6">
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'faqs' ? (
                  <div className="space-y-6">
                    {/* <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h2 className="text-lg sm:text-xl font-medium text-title-color dark:text-white">
                          {t('frequently_asked_questions')}
                        </h2>
                      </div>
                    </div> */}
                    <FaqAccordion
                      isLoading={isFaqLoading}
                      activeFaqs={activeFaqs}
                      openFaqIndex={openFaqIndex}
                      setOpenFaqIndex={setOpenFaqIndex}
                    />
                  </div>
                ) : (
                  <FaqPageContent page={activePages.find((p) => p.slug === activeTab)} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <SupportSidebar onContactClick={() => setIsContactModalOpen(true)} />
        </div>
      </div>

      <ContactSupportModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  )
}
