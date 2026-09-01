'use client'

import { featureData } from '@/data/aiAnalysis'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useAnalyzeContentMutation } from '@/redux/api/aiContentApi'
import { AnalysisResult } from '@/types'
import { ApiError } from '@/types/api'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ContentEditor from './components/ContentEditor'
import DetectAIHeader from './components/DetectAIHeader'
import DetectionMatrix from './components/DetectionMatrix'
import ResultsDisplay from './components/ResultsDisplay'
import TopSources from './components/TopSources'

const DetectAI = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canVerify = hasPermission('Verify Content', 'write')
  const [text, setText] = useState('')
  const [analyze, { isLoading }] = useAnalyzeContentMutation()
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!canVerify) return
    if (!text.trim()) {
      toast.error(t('please_enter_text_to_analyze', { defaultValue: 'Please enter some text to analyze' }))
      return
    }
    if (text.trim().length < 50) {
      toast.error(t('text_too_short', { defaultValue: 'Accuracy requires at least 100 characters.' }))
      return
    }

    try {
      const response = await analyze({ text }).unwrap()
      setResult(response.formattedReport)
      toast.success(response.message || t('analysis_completed', { defaultValue: 'Analysis completed successfully!' }))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('analysis_failed', { defaultValue: 'Scan failed.' }))
    }
  }

  const handleClear = () => {
    setText('')
    setResult(null)
  }

  const aiScore = useMemo(() => (result?.aiDetection ? parseInt(result.aiDetection.aiWriting) : 0), [result])
  const plagScore = useMemo(
    () => (result?.plagiarismReport ? parseInt(result.plagiarismReport.plagiarized) : 0),
    [result],
  )

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-8 animate-fade-in px-0 md:px-0">
      <DetectAIHeader onClear={handleClear} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 items-start mb-2">
        <div className="xl:col-span-7 space-y-4 md:space-y-6">
          <ContentEditor
            text={text}
            isLoading={isLoading}
            onTextChange={(value: string) => setText(value)}
            onAnalyze={handleAnalyze}
            canVerify={canVerify}
          />

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
              <TopSources result={result} />
              <DetectionMatrix aiScore={aiScore} plagScore={plagScore} />
            </div>
          )}
        </div>

        <div className="xl:col-span-5 space-y-4 md:space-y-6">
          <ResultsDisplay result={result} aiScore={aiScore} plagScore={plagScore} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2 md:pt-4">
        {featureData.map((feat, i) => (
          <div key={i} className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-border-radius glass-card glass-dark-card group transition duration-500 hover:-translate-y-1 ">
            <div
              className={cn(
                'h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-[8px] dark:bg-light-body bg-muted flex items-center justify-center border border-border transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3',
                feat.color,
              )}
            >
              <feat.icon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
              <h5 className="text-base font-medium text-title-color dark:text-white ">{feat.title}</h5>
              <p className="text-sm text-subtitle-color">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DetectAI
