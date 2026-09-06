'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Heart,
  Share2,
  MessageCircle,
  TrendingUp,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  Globe,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface OverviewTabProps {
  data: any
  isLoading?: boolean
  onSelectPlatform: (platform: string) => void
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  isLoading,
  onSelectPlatform,
}) => {
  const summary = data?.summary || {
    totalPosts: 0,
    postsPublished: 0,
    totalReactions: 0,
    totalShares: 0,
    totalComments: 0,
    totalViews: 0,
    totalEngagements: 0,
    engagementRate: '0.0%',
  }

  const trend = data?.dailyPostImpressionTrend || []
  const accounts = data?.accountPerformance || []
  const platformEngagement = data?.platformEngagement || {}

  const trendDates = trend.map((t: any) => t.date)
  const trendSeries = [
    { name: 'Facebook', data: trend.map((t: any) => t.facebook || 0), color: '#1877F2' },
    { name: 'Instagram', data: trend.map((t: any) => t.instagram || 0), color: '#E4405F' },
    { name: 'TikTok', data: trend.map((t: any) => t.tiktok || 0), color: '#00F2FE' },
    { name: 'X (Twitter)', data: trend.map((t: any) => t.twitter || 0), color: '#38BDF8' },
    { name: 'YouTube', data: trend.map((t: any) => t.youtube || 0), color: '#EF4444' },
  ]

  const trendChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 320,
      toolbar: { show: false },
      background: 'transparent',
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: trendDates,
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px' },
        formatter: (val) => `${val.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'dark',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#94A3B8' },
    },
  }

  const kpis = [
    {
      label: 'Posts Published',
      value: summary.postsPublished,
      total: summary.totalPosts,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      sub: `${summary.totalPosts - summary.postsPublished} in draft/scheduled`,
    },
    {
      label: 'Total Reactions',
      value: summary.totalReactions.toLocaleString(),
      icon: Heart,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 border-pink-500/20',
      sub: 'Live audience reactions',
    },
    {
      label: 'Comments',
      value: summary.totalComments.toLocaleString(),
      icon: MessageCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
      sub: 'Audience conversations',
    },
    {
      label: 'Shares & Reposts',
      value: summary.totalShares.toLocaleString(),
      icon: Share2,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
      sub: 'Viral organic reach',
    },
    {
      label: 'Total Impressions',
      value: summary.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      sub: 'Across all channels',
    },
    {
      label: 'Avg Engagement Rate',
      value: summary.engagementRate,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
      sub: 'Cross-channel average',
    },
  ]

  const platformCards = [
    {
      key: 'facebook',
      name: 'Facebook',
      color: 'text-[#1877F2]',
      bgColor: 'bg-[#1877F2]/10 border-[#1877F2]/20',
      stat: platformEngagement.facebook || { engagements: 0, rate: '0.0%', change: '0.0%', posts: 0 },
    },
    {
      key: 'instagram',
      name: 'Instagram',
      color: 'text-[#E4405F]',
      bgColor: 'bg-[#E4405F]/10 border-[#E4405F]/20',
      stat: platformEngagement.instagram || { engagements: 0, rate: '0.0%', change: '0.0%', posts: 0 },
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      color: 'text-[#00F2FE]',
      bgColor: 'bg-[#00F2FE]/10 border-[#00F2FE]/20',
      stat: platformEngagement.tiktok || { engagements: 0, rate: '0.0%', change: '0.0%', posts: 0 },
    },
    {
      key: 'twitter',
      name: 'X (Twitter)',
      color: 'text-[#38BDF8]',
      bgColor: 'bg-[#38BDF8]/10 border-[#38BDF8]/20',
      stat: platformEngagement.twitter || { engagements: 0, rate: '0.0%', change: '0.0%', posts: 0 },
    },
    {
      key: 'youtube',
      name: 'YouTube',
      color: 'text-[#EF4444]',
      bgColor: 'bg-[#EF4444]/10 border-[#EF4444]/20',
      stat: platformEngagement.youtube || { engagements: 0, rate: '0.0%', change: '0.0%', posts: 0 },
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card
              key={idx}
              className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider line-clamp-1">
                  {kpi.label}
                </span>
                <div className={cn('p-2 rounded-xl border', kpi.bg)}>
                  <Icon className={cn('w-4 h-4', kpi.color)} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-foreground tracking-tight">{kpi.value}</div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{kpi.sub}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Daily Post Impression Trend */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Daily Post Impression Trend
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregated views and reach progression across all connected social channels
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold text-xs">
            Multi-Channel Feed
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[330px]">
            <Chart options={trendChartOptions} series={trendSeries} type="area" height={320} width="100%" />
          </div>
        </CardContent>
      </Card>

      {/* Platform Engagement Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Platform Engagement Overview</span>
          </h3>
          <span className="text-xs text-muted-foreground">Click a platform card for granular insights</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {platformCards.map((p) => (
            <Card
              key={p.key}
              onClick={() => onSelectPlatform(p.key)}
              className={cn(
                'group rounded-2xl border p-4 backdrop-blur-md cursor-pointer transition-all hover:scale-105 hover:shadow-xl',
                p.bgColor
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-bold', p.color)}>{p.name}</span>
                <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div className="mt-3">
                <div className="text-xl font-extrabold text-foreground">
                  {p.stat.engagements?.toLocaleString() || 0}
                </div>
                <div className="flex items-center justify-between text-xs mt-1 text-muted-foreground">
                  <span>Rate: <strong className="text-foreground">{p.stat.rate}</strong></span>
                  <span className="text-emerald-500 font-semibold">{p.stat.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Account Performance Matrix */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Account Performance & Audience Benchmarks
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Followers, reach multiplier, and active engagement ratios per profile
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/10 bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Account Profile</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4 text-right">Followers</th>
                  <th className="py-3 px-4 text-right">Est. Impressions</th>
                  <th className="py-3 px-4 text-right">Engagements</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground text-xs italic">
                      No social accounts connected yet.
                    </td>
                  </tr>
                ) : (
                  accounts.map((acc: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                          {acc.accountName?.[0] || 'S'}
                        </div>
                        <span className="truncate max-w-[200px]">{acc.accountName}</span>
                      </td>
                      <td className="py-3 px-4 capitalize text-xs font-medium text-muted-foreground">
                        {acc.platform}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs">
                        {acc.followers?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-muted-foreground">
                        {acc.impressions?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-500 font-semibold">
                        {acc.engagements?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-foreground font-semibold">
                        {acc.engagementRate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-bold uppercase px-2 py-0.5',
                            acc.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {acc.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
