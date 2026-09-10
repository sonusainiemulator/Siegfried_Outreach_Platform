'use client'

import { DashboardChartsProps } from '@/types/components/dashboard'
import { useTheme } from 'next-themes'
import { ContentDistributionChart } from './components/ContentDistributionChart'
import { RevenueChart } from './components/RevenueChart'
import { RoleDistributionChart } from './components/RoleDistributionChart'
import { SocialPlatformsChart } from './components/SocialPlatformsChart'

export const DashboardCharts = ({
  contentData,
  subscriptionData,
  rolesData,
  socialData,
  chatbots,
  revenueData,
}: DashboardChartsProps) => {
  const { theme, systemTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-12">
      <RevenueChart data={revenueData || []} isDark={isDark} />
      <ContentDistributionChart data={contentData} isDark={isDark} />
      <SocialPlatformsChart data={socialData || {}} isDark={isDark} />
      <RoleDistributionChart data={rolesData} isDark={isDark} />
    </div>
  )
}
