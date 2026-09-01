'use client'

import {
  useGenerateContentMutation,
  useGetTemplatesQuery,
  useSaveContentMutation,
  useToggleTemplateFavoriteMutation,
} from '@/redux/api/smartWriterApi'
import { Template } from '@/types/components/smartWriter'
import { downloadFile } from '@/utils/download'
import { isBrowser } from '@/utils/environment'
import { AnimatePresence } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

// Sub-components
import { ApiError } from '@/types'
import SmartWriterEmpty from './SmartWriterEmpty'
import SmartWriterHeader from './SmartWriterHeader'
import SmartWriterNavigation from './SmartWriterNavigation'
import SmartWriterWorkspace from './SmartWriterWorkspace'

const stripHtml = (html: string) => {
  if (!html) return ''
  if (!isBrowser) return html

  const structuredHtml = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')

  const tmp = document.createElement('div')
  tmp.innerHTML = structuredHtml
  const text = tmp.textContent || ''
  return text.replace(/<[^>]*>/g, '').trim()
}

const AiWriter = () => {
  const { t } = useTranslation()

  // -- State Logic --
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(t('writer_all'))
  const [generatedContent, setGeneratedContent] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [generationMetadata, setGenerationMetadata] = useState<any>(null)
  const [showTemplateTray, setShowTemplateTray] = useState(false)
  const [showOptions, setShowOptions] = useState(true)

  // -- API Hooks --
  const { data: allTemplatesData } = useGetTemplatesQuery({})
  const { data: templatesData, isLoading: templatesLoading } = useGetTemplatesQuery({
    category:
      activeCategory === t('writer_all') || activeCategory === t('writer_favorites') ? undefined : activeCategory,
  })

  const [toggleFavorite] = useToggleTemplateFavoriteMutation()
  const [generateContent, { isLoading: isGenerating }] = useGenerateContentMutation()
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation()

  // -- Memos --
  const categories: string[] = useMemo(() => {
    const allTemplates = (allTemplatesData?.data || []) as any[]
    return [t('writer_all'), t('writer_favorites'), ...new Set(allTemplates.map((t) => t.category))]
  }, [allTemplatesData, t])

  const templates = useMemo(() => {
    let list = templatesData?.data || []
    if (activeCategory === t('writer_favorites')) {
      list = (allTemplatesData?.data || []).filter((t: any) => t.isFavorite)
    }
    return list
  }, [templatesData, allTemplatesData, activeCategory, t])

  const filteredTemplates = useMemo(() => {
    return templates.filter(
      (template: any) =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [templates, searchQuery])

  // -- Handlers --
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setGeneratedContent('')
    setGenerationMetadata(null)
    setShowOptions(true)
  }

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await toggleFavorite({ templateId: id }).unwrap()
      toast.success(t('favorites_updated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update'))
    }
  }

  const handleGenerate = async (formData: any) => {
    if (!selectedTemplate) return
    try {
      const { modelName, variantsCount, ...restInputs } = formData
      const result = await generateContent({
        templateSlug: selectedTemplate.slug,
        modelName: modelName || 'deepseek/deepseek-chat',
        numResults: parseInt(variantsCount) || 1,
        inputs: { ...restInputs },
      }).unwrap()

      const content = result.data.content
      const numReq = parseInt(formData.variantsCount) || 1
      let combinedHtml = ''

      if (numReq > 1) {
        const splitRegex = /\n\n\d+\.\s|^\d+\.\s/g
        const parts = content.split(splitRegex).filter((p: string) => p.trim())
        combinedHtml = parts
          .map(
            (p: string, i: number) =>
              `<div style="margin-bottom: 32px; padding: 24px; border-radius: 20px; background: rgba(99, 102, 241, 0.03); border: 1px solid rgba(99, 102, 241, 0.1);">\n<div style="display: inline-block; padding: 4px 12px; border-radius: 8px; background: var(--indigo-main); color: var(--white); font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;">Result ${
                i + 1
              }</div>\n<div style="font-size: 1.1rem; line-height: 1.7; color: var(--foreground);">${p
                .trim()
                .replace(/\n/g, '<br/>')}</div>\n</div>`,
          )
          .join('\n')
      } else {
        combinedHtml = `<div style="padding: 24px; border-radius: 20px; background: rgba(99, 102, 241, 0.03); border: 1px solid rgba(99, 102, 241, 0.1); font-size: 1.1rem; line-height: 1.7; color: var(--foreground);">${content
          .trim()
          .replace(/\n/g, '<br/>')}</div>`
      }

      setGeneratedContent(combinedHtml)
      setGenerationMetadata(result.data.metadata)
      toast.success(t('variants_generated', { count: numReq }))
      if (isBrowser && window.innerWidth < 1024) setShowOptions(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('generation_failed'))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(stripHtml(generatedContent))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    toast.success(t('writer_copy_success', { defaultValue: t('writer_copy') }))
  }

  const handleDownload = () => {
    const plainText = stripHtml(generatedContent)
    const file = new Blob([plainText], { type: 'text/plain' })
    const url = URL.createObjectURL(file)
    downloadFile(url, `${selectedTemplate?.slug || 'ai-content'}.txt`)
    toast.success(t('downloading_content'))
  }

  const handleSave = async () => {
    if (!generatedContent || !selectedTemplate) return
    try {
      await saveContent({
        title: docTitle.trim(),
        content: generatedContent,
        templateId: selectedTemplate.id,
        metadata: generationMetadata || { templateSlug: selectedTemplate.slug, feature: 'writer' },
      }).unwrap()
      toast.success(t('content_saved_successfully', { defaultValue: 'Content saved successfully' }))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('save_failed', { defaultValue: 'Failed to save content' }))
    }
  }

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      <SmartWriterHeader />

      <div className="relative flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar custom-scrollbar pt-6 lg:px-8 px-4">
        <SmartWriterNavigation
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showTemplateTray={showTemplateTray}
          setShowTemplateTray={setShowTemplateTray}
          filteredTemplates={filteredTemplates}
          handleTemplateSelect={handleTemplateSelect}
          handleToggleFavorite={handleToggleFavorite}
          templatesLoading={templatesLoading}
        />

        <div className="flex-1 lg:px-4 px-0 transition-all duration-500 mt-8">
          <AnimatePresence mode="wait">
            {!selectedTemplate ? (
              <SmartWriterEmpty />
            ) : (
              <SmartWriterWorkspace
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                showOptions={showOptions}
                setShowOptions={setShowOptions}
                docTitle={docTitle}
                setDocTitle={setDocTitle}
                generatedContent={generatedContent}
                setGeneratedContent={setGeneratedContent}
                isCopied={isCopied}
                isGenerating={isGenerating}
                isSaving={isSaving}
                handleGenerate={handleGenerate}
                handleCopy={handleCopy}
                handleSave={handleSave}
                handleDownload={handleDownload}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AiWriter
