'use client'

import { Badge } from '@/components/ui/badge'
import { FaqPageContentProps } from '@/types'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'

export const FaqPageContent = ({ page }: FaqPageContentProps) => {
  const { t } = useTranslation()

  if (!page) return null

  const sanitizeContent = DOMPurify.sanitize(page?.content as any || "", {
          ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
        })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-border-radius glass-card glass-dark-card border border-border/40 bg-card/30 backdrop-blur-xl sm:p-6 p-4  space-y-8"
    >
      <div className="space-y-4 mb-5">
        <Badge className="px-4 py-1 rounded-full text-sm font-medium hover:bg-primary/10 bg-primary/10 text-primary border-primary/20">
          {t('information')}
        </Badge>
        <h1 className="text-3xl font-medium text-title-color dark:text-white">{page.title}</h1>
      </div>
      <article
        className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed 
        prose-headings:text-foreground prose-headings:font-black prose-a:text-primary prose-strong:text-foreground whitespace-break-spaces break-all"
        dangerouslySetInnerHTML={{ __html: sanitizeContent
      }}
      />
    </motion.div>
  )
}
