'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChartControlsProps } from '@/types/components/socialMedia'
import { Activity, BarChart3, TrendingUp } from 'lucide-react'

const ChartControls = ({ chartType, onChartTypeChange }: ChartControlsProps) => {
  return (
    <div className="flex items-center p-1 bg-muted/40 backdrop-blur-md rounded-lg border border-border/40 scale-90 origin-left">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChartTypeChange('candlestick')}
        className={cn(
          'p-2 rounded-md transition-all',
          chartType === 'candlestick'
            ? 'bg-background shadow-sm text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )}
        title="Candlestick View"
      >
        <Activity className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChartTypeChange('bar')}
        className={cn(
          'p-2 rounded-md transition-all',
          chartType === 'bar' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground',
        )}
        title="Bar View"
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChartTypeChange('line')}
        className={cn(
          'p-2 rounded-md transition-all',
          chartType === 'line' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground',
        )}
        title="Line View"
      >
        <TrendingUp className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default ChartControls
