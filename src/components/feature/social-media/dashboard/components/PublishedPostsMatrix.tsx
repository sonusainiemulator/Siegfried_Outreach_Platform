'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { getCommonChartOptions } from '@/data/dashboard'
import { TriangleAlert } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const PublishedPostsMatrix = ({ data, isDark }: { data: any[]; isDark: boolean }) => {
  const { t } = useTranslation()

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-border-radius border-border/40 bg-card/40 p-4 sm:p-6 relative overflow-hidden">
        <NoDataFound icon={TriangleAlert} height="h-[350px]" />
      </Card>
    )
  }

  const categories = data.map((d) => d.month)
  const whatsappData = data.map((d) => d.whatsapp || 0)
  const facebookData = data.map((d) => d.facebook || 0)
  const instagramData = data.map((d) => d.instagram || 0)
  const linkedinData = data.map((d) => d.linkedin || 0)
  const twitterData = data.map((d) => d.twitter || 0)
  const youtubeData = data.map((d) => d.youtube || 0)
  const googleData = data.map((d) => d.google || 0)
  const tiktokData = data.map((d) => d.tiktok || 0)
  const redditData = data.map((d) => d.reddit || 0)
  const threadsData = data.map((d) => d.threads || 0)
  const wordpressData = data.map((d) => d.wordpress || 0)

  const series = [
    { name: t('social_whatsapp', { defaultValue: 'WhatsApp' }), data: whatsappData },
    { name: t('social_facebook'), data: facebookData },
    { name: t('social_instagram'), data: instagramData },
    { name: t('social_linkedin'), data: linkedinData },
    { name: t('social_twitter'), data: twitterData },
    { name: t('social_youtube', { defaultValue: 'YouTube' }), data: youtubeData },
    { name: t('social_google', { defaultValue: 'Google' }), data: googleData },
    { name: t('social_tiktok', { defaultValue: 'TikTok' }), data: tiktokData },
    { name: t('social_reddit', { defaultValue: 'Reddit' }), data: redditData },
    { name: t('social_threads', { defaultValue: 'Threads' }), data: threadsData },
    { name: t('social_wordpress', { defaultValue: 'WordPress' }), data: wordpressData },
  ]

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    colors: ['#25D366', '#1877F2', '#E4405F', '#0A66C2', '#1DA1F2', '#FF0000', '#0F9D58', '#FE2C55', '#FF4500', '#101010', '#21759B'],
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: 'currentColor', opacity: 0.5, fontSize: '11px', fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        style: { colors: 'currentColor', opacity: 0.5, fontSize: '11px', fontWeight: 600 },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      fontWeight: 600,
      labels: { colors: 'currentColor' },
      markers: { radius: 12, width: 10, height: 10 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    fill: { opacity: 1 },
    grid: { show: false },
  }

  return (
    <Card className="rounded-border-radius border-border/40 bg-card/40 p-4 sm:p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 relative z-10 mb-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 mb-0">
            <h3 className="text-xl text-title-color dark:text-white font-medium flex items-center gap-4">
              {t('social_publication_activity')}
            </h3>
          </div>
          <p className="text-sm text-subtitle-color font-medium max-w-lg opacity-80 leading-relaxed">
            {t('social_publication_activity_desc')}
          </p>
        </div>
      </div>

      <div className="h-[350px] w-full relative z-10">
        <Chart options={options} series={series} type="bar" height="100%" />
      </div>
    </Card>
  )
}

export default PublishedPostsMatrix
