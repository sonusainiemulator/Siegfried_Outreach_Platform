import PresentationViewer from '@/components/feature/slide-maker/PresentationViewer'
import { PageHeader } from '@/components/reusable/PageHeader'
import ThemeModal from './ThemeModal'

// Sub-components
import EmptyState from './components/EmptyState'
import HistorySidebar from './components/HistorySidebar'
import PromptSection from './components/PromptSection'

import {
  advancedOptionsConfig,
  defaultPresentationState,
  getLanguages,
  getSizeOptions,
  getSlidesCounts,
} from '@/data/slideMaker'
import {
  useDeletePresentationMutation,
  useGeneratePresentationMutation,
  useGetPresentationHistoryQuery,
  useGetPresentationOptionsQuery,
} from '@/redux/api/presentationApi'
import { ApiError } from '@/types'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AIPresentation = () => {
  const { t } = useTranslation()

  // API Queries/Mutations
  const { data: optionsData } = useGetPresentationOptionsQuery()
  const { data: historyData, isLoading: historyLoading } = useGetPresentationHistoryQuery({ page: 1, limit: 4 })
  const [generatePresentation, { isLoading: isGenerating }] = useGeneratePresentationMutation()
  const [deletePresentation] = useDeletePresentationMutation()

  // State Management
  const [prompt, setPrompt] = useState(defaultPresentationState.prompt)
  const [theme, setTheme] = useState(defaultPresentationState.theme)
  const [slidesCount, setSlidesCount] = useState(defaultPresentationState.slidesCount)
  const [size, setSize] = useState(defaultPresentationState.size)
  const [language, setLanguage] = useState(defaultPresentationState.language)

  const [generateMode, setGenerateMode] = useState(defaultPresentationState.generateMode)
  const [format, setFormat] = useState(defaultPresentationState.format)
  const [cardSplit, setCardSplit] = useState(defaultPresentationState.cardSplit)
  const [textTone, setTextTone] = useState(defaultPresentationState.textTone)
  const [textAudience, setTextAudience] = useState(defaultPresentationState.textAudience)
  const [imageSource, setImageSource] = useState(defaultPresentationState.imageSource)
  const [instruction] = useState(defaultPresentationState.instruction)

  // UI States
  const [langOpen, setLangOpen] = useState(false)
  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const [slidesOpen, setSlidesOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const langRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<HTMLDivElement>(null)

  // Handlers
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('tell_us_what_your_presentation_is_about_first'))
      return
    }
    try {
      const result = await generatePresentation({
        prompt,
        theme,
        slidesCount,
        size,
        language,
        generate: generateMode,
        format,
        cardSplit,
        textTone,
        textAudience,
        imageSource,
        instruction,
      }).unwrap()
      toast.success(result.message || t('all_done_your_presentation_is_ready'))
      setSelectedPresentation(result.data)
      setViewerOpen(true)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('could_not_create_your_slides_please_try_again'))
    }
  }

  const handleViewPresentation = (presentation: any) => {
    setSelectedPresentation(presentation)
    setViewerOpen(true)
  }

  // Derived Data
  const themes: any[] = optionsData?.themes || []
  const advancedOpts = optionsData?.options || {}
  const languages = getLanguages(optionsData, advancedOpts)
  const slidesCounts = getSlidesCounts(advancedOpts)
  const sizeOptions = getSizeOptions(advancedOpts)

  const advancedOptions = advancedOptionsConfig
    .map((opt) => {
      const statesMap: Record<string, { value: any; set: any }> = {
        generateMode: { value: generateMode, set: setGenerateMode },
        format: { value: format, set: setFormat },
        cardSplit: { value: cardSplit, set: setCardSplit },
        textTone: { value: textTone, set: setTextTone },
        textAudience: { value: textAudience, set: setTextAudience },
        imageSource: { value: imageSource, set: setImageSource },
      }
      const state = statesMap[opt.state]
      return {
        label: t(opt.label),
        value: state.value,
        set: state.set,
        opts: advancedOpts[opt.key]?.choices,
      }
    })
    .filter((o) => o.opts?.length > 0)

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden w-full">
      {/* Top Header */}
      <div>
        <PageHeader
          title={t('ai_slide_maker', { defaultValue: 'AI Slide Maker' })}
          subtitle={t('ai_presentation_desc')}
          showBackButton={true}
        />
      </div>

      <div className="flex flex-col xl:flex-row flex-1 overflow-y-auto mt-6 gap-6 custom-scrollbar">
        {/* Main Interface Content */}
        <div className="flex-1 flex flex-col relative min-h-[500px]">
          <div className="flex-1 p-4 md:p-8 flex flex-col">
            <EmptyState />
          </div>

          <PromptSection
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            language={language}
            setLanguage={setLanguage}
            languages={languages}
            theme={theme}
            setThemeModalOpen={setThemeModalOpen}
            slidesCount={slidesCount}
            setSlidesCount={setSlidesCount}
            slidesCounts={slidesCounts}
            size={size}
            setSize={setSize}
            sizeOptions={sizeOptions}
            advancedOptions={advancedOptions}
            advancedOpts={advancedOpts}
            langRef={langRef}
            slidesRef={slidesRef}
            sizeRef={sizeRef}
            langOpen={langOpen}
            setLangOpen={setLangOpen}
            slidesOpen={slidesOpen}
            setSlidesOpen={setSlidesOpen}
            sizeOpen={sizeOpen}
            setSizeOpen={setSizeOpen}
          />
        </div>

        {/* Right Sidebar: History */}
        <HistorySidebar
          historyData={historyData}
          historyLoading={historyLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onView={handleViewPresentation}
        />
      </div>

      <ThemeModal
        open={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        themes={themes}
        selectedTheme={theme}
        onSelect={setTheme}
      />

      <PresentationViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        presentation={selectedPresentation}
      />
    </div>
  )
}

export default AIPresentation
