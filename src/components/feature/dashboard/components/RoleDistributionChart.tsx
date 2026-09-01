'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { formatChartData, getCommonChartOptions } from '@/data/dashboard'
import { TriangleAlert } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const RoleDistributionChart = ({ data, isDark }: { data: Record<string, number>; isDark: boolean }) => {
  const { t } = useTranslation()
  const chartData = formatChartData(data)

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        columnWidth: '35%',
        distributed: true,
      },
    },
    colors: ['var(--primary)', 'var(--indigo-light)', 'var(--role-color-1)', 'var(--role-color-2)', 'var(--green-success)', 'var(--cyan-deep)', 'var(--amber-accent)'],
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
        offsetY: 5,
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      decimalsInFloat: 0,
      labels: {
        formatter: (val: number) => Math.round(val).toString(),
        style: { colors: 'currentColor', opacity: 0.5, fontSize: '13px', fontWeight: 500 },
      },
    },
    legend: { show: false },
  }

  return (
    <Card className="rounded-border-radius glass-dark-card border border-white/10 shadow-none md767:col-span-12! md:col-span-6 group overflow-hidden">
      <div className="p-4 sm:p-6 h-full flex flex-col relative z-10">
        <div className="flex flex-col xl:flex-row items-start justify-between mb-4 lg:mb-6 gap-6 relative z-10">
          <div className="space-y-1">
            <h3 className="text-xl mb-0 font-medium text-title-color dark:text-white tracking-tight flex items-center gap-2">
              {t('role_distribution', { defaultValue: 'Roles' })}
            </h3>
            <p className="text-base font-medium text-subtitle-color">{t('role_distribution_desc', { defaultValue: 'Distribution of users across different access levels' })}</p>
          </div>
        </div>

        <div className="h-[220px] w-full mt-auto relative">
          {chartData.values.length > 0 ? (
            <Chart
              options={options}
              series={[{ name: t('members', { defaultValue: 'Members' }), data: chartData.values }]}
              type="line"
              height="100%"
            />
          ) : (
            <NoDataFound icon={TriangleAlert} height="h-[200px]" />
          )}
        </div>
      </div>
    </Card>
  )
}
