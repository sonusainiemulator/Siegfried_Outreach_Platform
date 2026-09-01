'use client'

import { useGetRewriterModesQuery, useRewriteContentMutation, useSaveContentMutation } from '@/redux/api/smartWriterApi'
import { ApiError } from '@/types/api'
import { downloadFile } from '@/utils/download'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import RewriterEditor from './RewriterEditor'
import RewriterHeader from './RewriterHeader'

const AiRewriter = () => {
  const { t } = useTranslation()

  const [content, setContent] = useState('')
  const [docTitle, setDocTitle] = useState('')
  const [mode, setMode] = useState('standard')
  const [language, setLanguage] = useState('English (USA)')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const { data: modesData, isLoading: modesLoading } = useGetRewriterModesQuery()
  const [rewriteContent, { isLoading: isRewriting }] = useRewriteContentMutation()
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation()

  const modes = modesData?.data || []

  const stripRef = useRef<HTMLDivElement>(null)

  const stripHtml = (html: string) => {
    if (!html) return ''
    const structuredHtml = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')

    if (stripRef.current) {
      stripRef.current.innerHTML = structuredHtml
      return stripRef.current.textContent || ''
    }
    return structuredHtml.replace(/<[^>]*>/g, '').trim()
  }

  const handleDownload = () => {
    if (!generatedContent) return
    const plainText = stripHtml(generatedContent)
    const file = new Blob([plainText], { type: 'text/plain' })
    const url = URL.createObjectURL(file)
    downloadFile(url, `${docTitle || 'rewritten-content'}.txt`)
    toast.success(t('downloading_content', { defaultValue: 'Downloading content...' }))
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!content.trim()) {
      toast.error(t('rewriter_content_required', { defaultValue: 'Please enter content to rewrite' }))
      return
    }

    try {
      const result = await rewriteContent({ content, mode, language }).unwrap()
      setGeneratedContent(result?.data?.content || '')
      toast.success(t('rewriter_content_success', { defaultValue: 'Content rewritten successfully!' }))
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('generation_failed'))
    }
  }

  const handleCopy = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(stripHtml(generatedContent))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    toast.success(t('writer_copy_success'))
  }

  const handleReset = () => {
    setContent('')
    setDocTitle('')
    setMode('professional')
    setLanguage('English (USA)')
    setGeneratedContent('')
    setIsCopied(false)
  }

  const handleSave = async () => {
    if (!generatedContent || !content) return
    try {
      await saveContent({
        title: (docTitle || t('writer_untitled_document') || 'Untitled Rewritten Content').trim(),
        content: generatedContent,
        prompt: stripHtml(content),
        feature: 'rewriter',
        metadata: {
          feature: 'rewriter',
          inputs: { mode, language, feature: 'rewriter' },
          prompt: stripHtml(content),
        },
      }).unwrap()
      toast.success(t('content_saved_successfully', { defaultValue: 'Content saved successfully' }))
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('save_failed', { defaultValue: 'Failed to save content' }))
    }
  }

  return (
    <div className="flex-1 flex flex-col lg:h-screen h-dvh overflow-hidden bg-transparent">
      <RewriterHeader onReset={handleReset} />

      <div className="flex-1 flex overflow-y-auto relative rounded-border-radius custom-scrollbar">
        <RewriterEditor
          docTitle={docTitle}
          setDocTitle={setDocTitle}
          content={content}
          setContent={setContent}
          generatedContent={generatedContent}
          setGeneratedContent={setGeneratedContent}
          mode={mode}
          setMode={setMode}
          language={language}
          setLanguage={setLanguage}
          isRewriting={isRewriting}
          isSaving={isSaving}
          isCopied={isCopied}
          modes={modes}
          modesLoading={modesLoading}
          handleGenerate={handleGenerate}
          handleCopy={handleCopy}
          handleSave={handleSave}
          handleDownload={handleDownload}
        />
      </div>
      <div ref={stripRef} className="hidden" aria-hidden="true" />
    </div>
  )
}

export default AiRewriter
