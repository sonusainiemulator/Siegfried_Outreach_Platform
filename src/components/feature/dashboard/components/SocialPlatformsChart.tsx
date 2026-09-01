'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { dashboardColors, formatChartData, getCommonChartOptions } from '@/data/dashboard'
import { TriangleAlert } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const SocialPlatformsChart = ({ data, isDark }: { data: Record<string, number>; isDark: boolean }) => {
  const { t } = useTranslation()
  const rawData = { ...data }
  if (!rawData.Twitter && !rawData.twitter && !rawData.X && !rawData.x) {
    rawData.Twitter = 0
  }
  const chartData = formatChartData(rawData)

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: { ...getCommonChartOptions(isDark, t).chart, type: 'bar' },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        columnWidth: '10%',
        distributed: true,
      },
    },
    colors: [dashboardColors[0]],
    xaxis: {
      categories: chartData.names,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
          fontSize: '11px',
          fontWeight: 400,
        },
        offsetY: 2,
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      decimalsInFloat: 0,
      labels: {
        style: { colors: 'currentColor', opacity: 0.5, fontSize: '13px', fontWeight: 500 },
        formatter: (val: number) => val.toFixed(0),
      },
    },
    legend: { show: false },
  }

  return (
    <Card className="rounded-border-radius glass-dark-card border border-white/10 shadow-none overflow-hidden md767:col-span-12! md:col-span-6 group">
      <div className="p-4 sm:p-6 h-full flex flex-col relative z-10">
        <div className="flex flex-col xl:flex-row items-start justify-between mb-4 lg:mb-6 gap-6 relative z-10">
          <div className="space-y-1">
            <h3 className="text-xl mb-0 font-medium text-title-color dark:text-white flex items-center gap-2">
              {t('social_platforms_overview', { defaultValue: 'Social Platforms' })}
            </h3>
            <p className="text-base font-medium text-subtitle-color">{t('social_platforms_overview_desc', { defaultValue: 'Overview of all linked social media accounts' })}</p>
          </div>
        </div>

        <div className="h-[250px] w-full mt-2 relative">
          {chartData.values.length > 0 ? (
            <Chart
              options={options}
              series={[{ name: t('accounts'), data: chartData.values }]}
              type="bar"
              height="100%"
            />
          ) : (
            <NoDataFound icon={TriangleAlert} height="h-[250px]" />
          )}
        </div>
      </div>
    </Card>
  )
}
