'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { getCommonChartOptions } from '@/data/dashboard'
import { EngagementChartProps } from '@/types/components/socialMedia'
import { isBrowser } from '@/utils/environment'
import { TriangleAlert } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EngagementChart = ({ data }: EngagementChartProps) => {
  const { t } = useTranslation()
  const isDark = isBrowser && document.documentElement.classList.contains('dark')

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-border-radius border-border/40 bg-card/40 p-4 sm:p-6 relative overflow-hidden">
        <NoDataFound icon={TriangleAlert} height="h-[350px]" />
      </Card>
    )
  }

  const categories = data.map((d: { label?: string }) => d.label || '')
  const engagementData = data.map((d: { engagement?: number }) => d.engagement || 0)

  const series = [
    { name: t('social_interacts'), data: engagementData },
  ]

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    colors: ['#5BA5F5'],
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 20,
      tickAmount: 4,
      labels: {
        style: {
          colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
          fontSize: '11px',
          fontWeight: 600,
        },
        formatter: (val: number) => `${val}`,
      },
    },
    fill: { opacity: 0.9 },
    grid: {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
  }

  return (
    <Card className="rounded-border-radius border-border/40 bg-card/40 p-4 sm:p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 relative z-10 mb-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 mb-0">
            <h3 className="text-xl text-title-color dark:text-white font-medium flex items-center gap-4">
              {t('social_volume_matrix')}
            </h3>
          </div>
          <p className="text-sm text-subtitle-color font-medium max-w-lg opacity-80 leading-relaxed">
            {t('social_engagement_desc_bar')}
          </p>
        </div>
      </div>

      <div className="h-[350px] w-full relative z-10">
        <Chart options={options} series={series} type="bar" height="100%" />
      </div>
    </Card>
  )
}

export default EngagementChart
