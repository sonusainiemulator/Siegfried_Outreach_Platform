'use client'

import { DEFAULT_FORM_DATA, DRAFT_KEY, getSteps } from '@/data/contentWriter'
import { usePermission } from '@/hooks/usePermission'
import { ArticleFormData } from '@/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ArticleHeader from './components/ArticleHeader'
import GlobalConfig from './components/GlobalConfig'
import JourneyMap from './components/JourneyMap'
import StepFinal from './steps/StepFinal'
import StepImage from './steps/StepImage'
import StepOutline from './steps/StepOutline'
import StepTitles from './steps/StepTitles'
import StepTopic from './steps/StepTopic'

const ArticleWriter = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canGenerate = hasPermission('Generate Article', 'write')

  const steps = getSteps(t)
  const [activeStep, setActiveStep] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [isFinalStepCompleted, setIsFinalStepCompleted] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [formData, setFormData] = useState<ArticleFormData>({ ...DEFAULT_FORM_DATA })

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const draft = JSON.parse(saved) as { formData: ArticleFormData; activeStep: number }
        if (draft?.formData && typeof draft.activeStep === 'number') {
          setFormData(draft.formData)
          setActiveStep(draft.activeStep)
        }
      }
    } catch {
      // ignore corrupt draft
    }
  }, [])

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData, activeStep }))
      toast.success(t('draft_saved', { defaultValue: 'Draft saved successfully!' }))
    } catch {
      toast.error(t('draft_save_failed', { defaultValue: 'Failed to save draft.' }))
    }
  }

  const handleNext = (data: Partial<ArticleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleDataChange = (data: Partial<ArticleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    setActiveStep(0)
    setIsFinalStepCompleted(false)
    setResetKey((prev) => prev + 1)
    setFormData({ ...DEFAULT_FORM_DATA })
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col min-h-full animate-fade-in w-full max-w-full mx-auto pb-6 sm:pb-10 space-y-6 sm:space-y-10 overflow-x-hidden">
      <ArticleHeader
        onReset={handleReset}
        historyOpen={historyOpen}
        setHistoryOpen={setHistoryOpen}
        canGenerate={canGenerate}
        onSelectArticle={(article: Record<string, unknown>) => {
          const metadata = (article.metadata as Record<string, unknown>) || {}
          setFormData({
            topic: (article.prompt as string) || '',
            numKeywords: (metadata.numKeywords as number) || 10,
            language: (article.platform as string) || 'English (USA)',
            blogLength: (metadata.blogLength as number) || 800,
            creativity: (metadata.creativity as string) || 'Good',
            keywords: (article.keywords as string[]) || [],
            selectedTitle: (article.title as string) || '',
            generatedTitles: [],
            selectedOutline: (article.outline as string[]) || [],
            generatedOutlines: [],
            selectedOutlineTabIndex: 0,
            selectedImage: (article.images as string[])?.[0] || '',
            articleContent: (article.content as string) || '',
            articleId: (article.id as string) || (article._id as string) || '',
          })
          setActiveStep(4)
          setIsFinalStepCompleted(true)
          setHistoryOpen(false)
        }}
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch lg:items-start">
        <JourneyMap
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          isFinalStepCompleted={isFinalStepCompleted}
        />

        <div className="flex-1 space-y-6 lg:space-y-10 min-w-0">
          <GlobalConfig formData={formData} setFormData={setFormData} />

          <main className=" lg:min-h-[600px] animate-in fade-in slide-in-from-right-4 duration-500">
            {activeStep === 0 && (
              <StepTopic
                key={`step0-${resetKey}`}
                data={formData}
                onNext={handleNext}
                canGenerate={canGenerate}
                onSaveDraft={handleSaveDraft}
              />
            )}
            {activeStep === 1 && (
              <StepTitles
                key={`step1-${resetKey}`}
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                onDataChange={handleDataChange}
                onSaveDraft={handleSaveDraft}
              />
            )}
            {activeStep === 2 && (
              <StepOutline
                key={`step2-${resetKey}`}
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                onDataChange={handleDataChange}
                onSaveDraft={handleSaveDraft}
              />
            )}
            {activeStep === 3 && (
              <StepImage
                key={`step3-${resetKey}`}
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                onSaveDraft={handleSaveDraft}
              />
            )}
            {activeStep === 4 && (
              <StepFinal
                key={`step4-${resetKey}-${formData.articleId}`}
                data={formData}
                onReset={handleReset}
                onComplete={setIsFinalStepCompleted}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ArticleWriter
