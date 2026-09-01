'use client'

import Spinner from '@/components/reusable/Spinner'
import { campaignHubParentVariants } from '@/data/campaignHub'
import { useGetCampaignDashboardQuery } from '@/redux/api/campaignApi'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CampaignHubActivity from './dashboard/CampaignHubActivity'
import CampaignHubRecentCampaigns from './dashboard/CampaignHubCampaigns'
import CampaignHubCharts from './dashboard/CampaignHubCharts'
import CampaignHubHeader from './dashboard/CampaignHubHeader'
import CampaignHubOverview from './dashboard/CampaignHubOverview'

const CampaignHubDashboard = () => {
  const { t } = useTranslation()
  const { data: dashboardData, isLoading, isError } = useGetCampaignDashboardQuery()
  const { theme, systemTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  // Dropdown states for the header
  const [viewOpen, setViewOpen] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)

  if (isLoading) {
    return <Spinner className="min-h-[60vh]" />
  }

  if (isError) {
    return (
      <div className="sm:p-12 p-6 text-center text-destructive font-medium bg-destructive/5 rounded-border-radius border border-destructive/10 animate-fade-in backdrop-blur-3xl m-8">
        {t('failed_to_load_dashboard')}
      </div>
    )
  }

  const { cards, recentBroadcasts, charts, recentContacts, recentTelegramSubscribers } = dashboardData

  // Chart data Preparation
  const campaignSeries = [
    { name: t('email'), data: charts?.broadcasts?.map((c: any) => c.email) || [] },
    { name: t('whatsapp'), data: charts?.broadcasts?.map((c: any) => c.whatsapp) || [] },
    { name: t('telegram'), data: charts?.broadcasts?.map((c: any) => c.telegram) || [] },
  ]

  // Hourly data aggregation into batches
  const hourlyData = charts?.hourlyBroadcasts || []
  const batchedHourly = []
  for (let i = 0; i < hourlyData.length; i += 4) {
    const chunk = hourlyData.slice(i, i + 4)
    const count = chunk.reduce((sum: number, item: any) => sum + (item.count || 0), 0)
    const label = chunk.length > 1 ? `${chunk[0].label} - ${chunk[chunk.length - 1].label}` : chunk[0].label
    batchedHourly.push({ label, count })
  }

  const contactSeries = [{ name: t('contacts'), data: charts?.contacts?.map((c: any) => c.count) || [] }]
  const hourlySeries = [{ name: t('broadcasts'), data: batchedHourly.map((c: any) => c.count) }]

  return (
    <motion.div
      variants={campaignHubParentVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in pb-20"
    >
      <CampaignHubHeader
        viewOpen={viewOpen}
        setViewOpen={setViewOpen}
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
      />

      <div className="space-y-6">
        <section>
          <CampaignHubOverview cardsData={cards} />
        </section>

        <section>
          <CampaignHubCharts
            isDark={isDark}
            charts={{ ...charts, hourlyBroadcasts: batchedHourly }}
            campaignSeries={campaignSeries}
            contactSeries={contactSeries}
            hourlySeries={hourlySeries}
          />
        </section>

        <section className="space-y-6">
          <CampaignHubActivity
            recentContacts={recentContacts?.slice(0, 4) || []}
            recentTelegramSubscribers={recentTelegramSubscribers?.slice(0, 4) || []}
          />

          <CampaignHubRecentCampaigns recentBroadcasts={recentBroadcasts || []} />
        </section>
      </div>
    </motion.div>
  )
}

export default CampaignHubDashboard
