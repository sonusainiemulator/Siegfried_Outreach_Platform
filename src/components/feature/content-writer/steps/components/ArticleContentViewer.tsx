'use client'

import Spinner from '@/components/reusable/Spinner'
import { ArticleContentViewerProps } from '@/types'
import Image from 'next/image'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'

const ArticleContentViewer = ({
  displayedHtml,
  isAnimating,
  viewMode,
  selectedTitle,
  selectedImage,
}: ArticleContentViewerProps) => {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const BASE_API_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:5000'

  const sanitizeContent = DOMPurify.sanitize(displayedHtml || "", {
                ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
              })

  return (
    <div
      ref={scrollRef}
      className="flex-1 rounded-border-radius glass-card glass-dark-card border border-border/40 p-4 sm:p-6 overflow-y-auto no-scrollbar shadow-inner relative group max-h-162.5 overflow-auto"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        {selectedImage && (
          <div className="w-full relative rounded-4xl overflow-hidden aspect-21/9 border-2 border-white/5 shadow-2xl group/hero">
            <Image
              src={selectedImage.startsWith('http') ? selectedImage : `${BASE_API_URL}${selectedImage}`}
              alt="Hero"
              fill
              className="object-cover transition-transform duration-700 group-hover/hero:scale-105"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
              <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{selectedTitle}</h1>
            </div>
          </div>
        )}

        {viewMode === 'preview' ? (
          <article
            className="prose prose-lg prose-slate dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
            prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12
            prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
            prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-base
            prose-strong:text-primary prose-strong:font-black
            prose-li:text-base prose-li:font-medium
            animate-reveal-blocks"
          >
            <div dangerouslySetInnerHTML={{ 
              __html: sanitizeContent
            }} className="transition-all duration-500" />
            {isAnimating && (
              <Spinner className="py-6 text-xs font-black uppercase tracking-widest animate-pulse" size="sm" text={t('generating_section')} />
            )}
          </article>
        ) : (
          <div className="bg-input-background p-4 rounded-border-radius border border-primary/20 font-mono text-sm leading-relaxed text-blue-100/60 overflow-x-auto shadow-2xl">
            <pre className="whitespace-pre-wrap">{displayedHtml}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleContentViewer
