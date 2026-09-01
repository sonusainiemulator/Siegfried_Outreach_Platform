import { Card } from '@/components/ui/card'
import { detectionMatrixData } from '@/data/aiAnalysis'
import { cn } from '@/lib/utils'
import { DetectionMatrixProps } from '@/types'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DetectionMatrix = ({ aiScore, plagScore }: DetectionMatrixProps) => {
  const { t } = useTranslation()
  return (
    <Card className="p-4 sm:p-6 rounded-border-radius glass-dark-card">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        <h3 className="text-xl font-medium text-title-color dark:text-white">{t('detection_matrix')}</h3>
      </div>
      <div className="space-y-2">
        {[
          detectionMatrixData.getNeuralPerplexity(aiScore),
          detectionMatrixData.getSyntacticBurstiness(aiScore),
          detectionMatrixData.getGlobalHashLookup(plagScore),
        ].map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center glass-dark-card p-2 md:p-2.5 rounded-[8px] border border-border/20"
          >
            <span className="text-[10px] md:text-xs font-medium text-muted-foreground">{item.label}</span>
            <span
              className={cn(
                'text-[9px] md:text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/10',
                item.level === 'bad' ? 'text-destructive' : 'text-emerald-500',
              )}
            >
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default DetectionMatrix
