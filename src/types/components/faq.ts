import { Faq, Page } from '../api'

export interface FaqModalProps {
  isOpen: boolean
  onClose: () => void
  faq?: Faq | null
}

export interface FaqTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  activePages: Page[]
}

export interface FaqAccordionProps {
  isLoading: boolean
  activeFaqs: Faq[]
  openFaqIndex: number | null
  setOpenFaqIndex: (index: number | null) => void
}

export interface FaqPageContentProps {
  page: Page | undefined
}
