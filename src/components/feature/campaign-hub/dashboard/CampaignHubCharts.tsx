'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaignChartOptions, getContactChartOptions, getHourlyChartOptions } from '@/data/campaignHub'
import { CampaignHubChartsProps } from '@/types'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const CampaignHubCharts = ({ isDark, charts, campaignSeries, contactSeries, hourlySeries }: CampaignHubChartsProps) => {
  const { t } = useTranslation()

  const campaignCategories = charts?.broadcasts?.map((c: any) => c.label) || []
  const contactCategories = charts?.contacts?.map((c: any) => c.label) || []
  const hourlyCategories = (charts?.hourlyBroadcasts || []).map((c: any) => c.label)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      <Card className="glass-card glass-dark-card border-border/10 overflow-hidden hover:border-primary/20 transition-all duration-500 rounded-[2rem]">
        <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium text-title-color dark:text-white">{t('campaigns')}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6 pt-0">
          <div className="h-[300px] w-full">
            <Chart
              options={getCampaignChartOptions(t, isDark, campaignCategories)}
              series={campaignSeries}
              type="area"
              height="100%"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card glass-dark-card border-border/10 overflow-hidden hover:border-primary/20 transition-all duration-500 rounded-[2rem]">
        <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium text-title-color dark:text-white">
            {t('hourly_performance', { defaultValue: 'Hourly Performance' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6 pt-0">
          <div className="h-[300px] w-full">
            <Chart
              options={getHourlyChartOptions(t, isDark, hourlyCategories)}
              series={hourlySeries}
              type="bar"
              height="100%"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card glass-dark-card border-border/10 overflow-hidden hover:border-primary/20 transition-all duration-500 rounded-[2rem]">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-xl font-medium text-title-color dark:text-white">{t('new_contacts')}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-6 pt-0">
          <div className="h-[300px] w-full">
            <Chart
              options={getContactChartOptions(t, isDark, contactCategories)}
              series={contactSeries}
              type="area"
              height="100%"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignHubCharts
