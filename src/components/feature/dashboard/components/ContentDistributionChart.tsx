'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { formatChartData, getCommonChartOptions } from '@/data/dashboard'
import { PieChart as PieChartIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const ContentDistributionChart = ({ data, isDark }: { data: Record<string, number>; isDark: boolean }) => {
  const { t } = useTranslation()
  const chartData = formatChartData(data)

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'pie',
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        dataLabels: {
          offset: -10,
        }
      },
    },
    colors: ['#5BA5F5', '#8b5cf690', '#a78bfa', '#c4b5fd' , '#ddd6fe'],
    stroke: {
      show: false,
    },
    labels: chartData.names,
    legend: {
      show: true,
      position: 'bottom',
      offsetY: 10,
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
        useSeriesColors: false
      },
      markers: { size: 5, radius: 10, offsetX: -4 },
      itemMargin: { horizontal: 8, vertical: 8 },
    },
    dataLabels: {
      enabled: false,
    },
  }

  return (
    <Card className="rounded-border-radius glass-dark-card border border-white/10 shadow-none md767:col-span-12! xl1570:col-span-6 xl:col-span-3 overflow-hidden group">
      <div className="p-4 sm:p-6 h-full flex flex-col relative z-10">
        <div className="flex flex-col xl:flex-row items-start justify-between mb-2 lg:mb-4 gap-6 relative z-10">
          <div className="space-y-1">
            <h3 className="text-xl mb-0 font-medium text-title-color dark:text-white flex items-center gap-2">
              {t('content_distribution', { defaultValue: 'Distribution' })}
            </h3>
            <p className="text-base font-medium text-subtitle-color">{t('content_distribution_overview', { defaultValue: 'Breakdown of AI-generated content by category' })}</p>
          </div>
        </div>

        <div className="h-[270px] w-full mt-auto relative">
          {chartData.values.length > 0 ? (
            <Chart options={options} series={chartData.values} type="pie" height="100%" />
          ) : (
            <NoDataFound icon={PieChartIcon} height="h-[270px]" />
          )}
        </div>
      </div>
    </Card>
  )
}
