import { Card } from '@/components/ui/card'
import { TopSourcesProps } from '@/types'
import { Globe, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const TopSources = ({ result }: TopSourcesProps) => {
  const { t } = useTranslation()
  return (
    <Card className="p-4 sm:p-6 rounded-border-radius glass-dark-card">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Globe className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        <h3 className="text-xl font-medium text-title-color dark:text-white">{t('top_sources')}</h3>
      </div>
      <div className="space-y-3">
        {result?.plagiarismReport?.sources && result.plagiarismReport.sources.length > 0 ? (
          result.plagiarismReport.sources.slice(0, 3).map((source, idx) => (
            <div
              key={idx}
              className="p-2.5 md:p-3 rounded-[8px] glass-card glass-dark-card border border-border/50 group hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[10px] md:text-xs font-bold text-foreground line-clamp-1 flex-1">
                  {source.title || 'Unknown Source'}
                </p>
                <span className="text-[9px] md:text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  {source.score}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{source.url}</p>
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] md:text-[10px] font-bold text-primary hover:underline shrink-0"
                >
                  {t('view')}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-4 md:py-6 text-center opacity-60">
            <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-emerald-500 mb-2" />
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">{t('original_expression')}</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TopSources
