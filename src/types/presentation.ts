import React from 'react'

export interface PopoverProps {
  anchor: React.RefObject<HTMLElement | null>
  open: boolean
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export interface ThemeModalProps {
  open: boolean
  onClose: () => void
  themes: { name: string; colors: ThemeColors }[]
  selectedTheme: string
  onSelect: (t: string) => void
}

export interface AdvancedSelectProps {
  label?: string
  value: string
  opts: { label: string; value: string }[]
  onChange: (v: string) => void
}

export interface ThemeColors {
  bg: string
  titleC: string
  subC: string
  headC: string
  bodyC: string
  accent: string
  mode: 'light' | 'dark'
}

export interface Slide {
  type: 'title' | 'bullet' | 'two_column' | 'stats' | 'chart' | 'image' | string
  title?: string
  subtitle?: string
  image?: string
  content?: string | string[]
  columns?: {
    header?: string
    items?: string[]
  }[]
  stats?: {
    label: string
    value: string
  }[]
  chartData?: {
    label: string
    value: string | number
  }[]
}

export interface SlideProps {
  slide: Slide
  theme: ThemeColors
  index: number
  isThumbnail?: boolean
}

export interface Presentation {
  id: string
  title: string
  prompt: string
  content?: string
  downloadUrl?: string
  metadata?: {
    presentationData?: {
      title?: string
      subtitle?: string
      image?: string
      slides?: Slide[]
    }
    options?: {
      theme?: string
      [key: string]: any
    }
  }
  created_at?: string
  data?: any
}

export interface PresentationViewerProps {
  isOpen: boolean
  onClose: () => void
  presentation: Presentation | null
}

export interface PresentationCardProps {
  item: Presentation
  onView: (item: Presentation) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export interface SimpleHistoryCardProps {
  item: Presentation
  onClick: (item: Presentation) => void
}

export interface AdvancedOption {
  label: string
  value: string | number | boolean
  set: (val: string | number | boolean) => void
  opts: { label: string; value: string | number | boolean }[]
}

export interface AIPresentationState {
  prompt: string
  theme: string
  slidesCount: string
  size: string
  language: string
  generateMode: string
  format: string
  cardSplit: string
  textTone: string
  textAudience: string
  imageSource: string
  instruction: string
}

export interface HistorySidebarProps {
  historyData: any
  historyLoading: boolean
  searchTerm: string
  setSearchTerm: (val: string) => void
  onView: (item: any) => void
}

export interface PromptSectionProps {
  prompt: string
  setPrompt: (v: string) => void
  isGenerating: boolean
  handleGenerate: () => void
  language: string
  setLanguage: (v: string) => void
  languages: string[]
  theme: string
  setThemeModalOpen: (v: boolean) => void
  slidesCount: string
  setSlidesCount: (v: string) => void
  slidesCounts: string[]
  size: string
  setSize: (v: string) => void
  sizeOptions: { label: string; value: string }[]
  advancedOptions: AdvancedOption[]
  advancedOpts: Record<string, string | number | boolean>
  langRef: any
  slidesRef: any
  sizeRef: any
  langOpen: boolean
  setLangOpen: (v: boolean) => void
  slidesOpen: boolean
  setSlidesOpen: (v: boolean) => void
  sizeOpen: boolean
  setSizeOpen: (v: boolean) => void
}
