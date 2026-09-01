'use client'

import Spinner from '@/components/reusable/Spinner'
import { Card } from '@/components/ui/card'
import { useGenerateArticleMutation } from '@/redux/api/aiContentApi'
import { StepFinalProps } from '@/types'
import { downloadFile } from '@/utils/download'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ArticleContentViewer from './components/ArticleContentViewer'
import ArticleHeaderControls from './components/ArticleHeaderControls'
import ArticleStats from './components/ArticleStats'

const StepFinal = ({ data, onReset, onComplete }: StepFinalProps) => {
  const { t } = useTranslation()
  const [articleHtml, setArticleHtml] = useState('')
  const [displayedHtml, setDisplayedHtml] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [generationTime, setGenerationTime] = useState<number | string | undefined>(undefined)
  const hasGenerated = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  const [generateArticle, { isLoading }] = useGenerateArticleMutation()

  useEffect(() => {
    if (data.articleId) {
      // If we have an articleId, it's already saved in the database (loaded from history)
      setArticleHtml(data.articleContent)
      if (data.articleContent) {
        animateContentStructured(data.articleContent, false)
        onComplete?.(true)
      }
    } else if (!hasGenerated.current) {
      // New generation
      hasGenerated.current = true
      handleGenerate()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data.articleId])

  const handleGenerate = async () => {
    try {
      const res = await generateArticle({
        topic: data.topic,
        keywords: data.keywords,
        title: data.selectedTitle,
        outline: data.selectedOutline,
        language: data.language,
        blogLength: data.blogLength,
        creativity: data.creativity,
        image: data.selectedImage,
      }).unwrap()

      const content = res.data?.content || ''
      setGenerationTime(res.generationTime || res.data?.generationTime || undefined)
      setArticleHtml(content)
      animateContentStructured(content, true, res.message)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('something_went_wrong'))
    }
  }

  // Improved Animation: Line-by-line / Block-by-block reveal
  const animateContentStructured = (html: string, showToast = true, backendMessage?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsAnimating(true)
    setIsCompleted(false)
    setDisplayedHtml('')

    // Split by common HTML tags to get "blocks"
    const blocks = html.split(/(?<=<\/p>)|(?<=<\/h2>)|(?<=<\/h3>)|(?<=<\/ul>)|(?<=<\/li>)/)
    let blockIndex = 0

    const revealNextBlock = () => {
      if (blockIndex < blocks.length) {
        const textToAppend = blocks[blockIndex]
        if (textToAppend !== undefined && textToAppend !== null) {
          setDisplayedHtml((prev) => prev + textToAppend)
        }
        blockIndex++

        // Dynamic speed: headings reveal faster, long paragraphs slower
        const currentBlock = blocks[blockIndex - 1] || ''
        const delay = currentBlock.length > 50 ? 400 : 200

        timeoutRef.current = setTimeout(revealNextBlock, delay)
      } else {
        setIsAnimating(false)
        setIsCompleted(true)
        onComplete?.(true)
        if (showToast) {
          toast.success(backendMessage || t('article_generated_successfully'))
        }
      }
    }

    timeoutRef.current = setTimeout(revealNextBlock, 500)
  }

  const handleCopy = () => {
    if (stripRef.current) {
      stripRef.current.innerHTML = articleHtml
      const text = stripRef.current.innerText
      navigator.clipboard.writeText(text)
      toast.success(t('copied_to_clipboard'))
    }
  }

  const handleDownload = () => {
    const file = new Blob([articleHtml], { type: 'text/html' })
    const url = URL.createObjectURL(file)
    downloadFile(url, `${data.selectedTitle.replace(/\s+/g, '_')}.html`)
  }

  return (
    <Card className="rounded-[2rem] border border-border/40 bg-card/40 glass-card glass-dark-card backdrop-blur-xl overflow-hidden p-4 sm:p-6 space-y-6 sm:space-y-10 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      {isLoading ? (
        <Spinner className="flex-1" size="lg" text={t('synthesizing_content')} />
      ) : (
        <div className="space-y-10 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-primary mb-1">
                <span className="text-xl font-medium text-title-color dark:text-white tracking-tight">{t('generation_ready')}</span>
              </div>
              <p className="text-subtitle-color font-medium text-xs sm:text-base opacity-70 leading-relaxed">{t('finalize_description_sub')}</p>
            </div>

            <ArticleHeaderControls
              viewMode={viewMode}
              isCompleted={isCompleted}
              onViewModeChange={setViewMode}
              onDownload={handleDownload}
              onCopy={handleCopy}
            />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
            <ArticleContentViewer
              displayedHtml={displayedHtml}
              isAnimating={isAnimating}
              viewMode={viewMode}
              selectedTitle={data.selectedTitle}
              selectedImage={data.selectedImage}
            />

            <ArticleStats articleHtml={articleHtml} onReset={onReset} generationTime={generationTime} />
          </div>
        </div>
      )}
      <div ref={stripRef} className="hidden" aria-hidden="true" />
    </Card>
  )
}

export default StepFinal
