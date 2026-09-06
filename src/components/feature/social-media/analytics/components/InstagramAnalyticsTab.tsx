'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Instagram,
  Eye,
  Heart,
  Users,
  MessageCircle,
  Bookmark,
  Share2,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemographicDonutChart } from './DemographicDonutChart'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface InstagramTabProps {
  data: any
  isLoading?: boolean
}

export const InstagramAnalyticsTab: React.FC<InstagramTabProps> = ({ data, isLoading }) => {
  const ig = data || {}

  // 24-Hour Active Users Distribution
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const activeHoursData = ig.activeUsersByHours || Array(24).fill(0)
  const hoursChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 240, toolbar: { show: false }, background: 'transparent' },
    colors: ['#E4405F'],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    xaxis: {
      categories: hours,
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
        rotate: 0,
        formatter: (val, opt) => (Number(opt) % 3 === 0 ? String(val) : ''),
      },
    },
    yaxis: { labels: { style: { colors: '#94A3B8', fontSize: '10px' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark', y: { formatter: (v) => `${v} active interactions` } },
  }

  // Active Users by Day of Week
  const days = (ig.activeUsersByDays || []).map((d: any) => d.day)
  const daysUsers = (ig.activeUsersByDays || []).map((d: any) => d.users)
  const daysChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', height: 240, toolbar: { show: false }, background: 'transparent' },
    colors: ['#8B5CF6'],
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 6 } },
    xaxis: { categories: days, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
  }

  // Follower Growth curve
  const growthCategories = (ig.audienceGrowth || []).map((g: any) => g.date)
  const growthValues = (ig.audienceGrowth || []).map((g: any) => g.followers || g.fans || 0)
  const growthOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', height: 220, toolbar: { show: false }, background: 'transparent' },
    colors: ['#EC4899'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: growthCategories, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
  }

  const stories = ig.storiesPerformance || {
    impressions: 0,
    completionRate: '0.0%',
    tapsForward: 0,
    tapsBack: 0,
    exits: 0,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-[#E4405F]" /> Followers
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{(ig.followers ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-muted-foreground">Connected Instagram accounts</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-purple-400" /> Impressions
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{(ig.impressions ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-muted-foreground">{ig.impressionsMetrics?.reach || 0} Reach</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Heart className="w-3.5 h-3.5 text-pink-500" /> Engagements
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{(ig.engagements ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-emerald-500 font-semibold">{ig.engagementMetrics?.likes || 0} Likes</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Profile Actions
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{(ig.profileActions ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-muted-foreground">{ig.impressionsMetrics?.websiteClicks || 0} Link clicks</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Comments
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{(ig.comments ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-muted-foreground">User responses</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Story Views
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{(stories.impressions ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-muted-foreground">{stories.completionRate || '0.0%'} completion</span>
        </Card>
      </div>

      {/* Publishing Behavior by Media Type & Audience Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DemographicDonutChart
          title="Publishing Behavior by Media Type"
          labels={['Instagram Reels', 'Carousel Posts', 'Stories', 'Single Images']}
          series={[
            ig.publishingBehavior?.reels || 0,
            ig.publishingBehavior?.carousels || 0,
            ig.publishingBehavior?.stories || 0,
            ig.publishingBehavior?.singleImage || 0,
          ]}
          colors={['#E4405F', '#8B5CF6', '#F59E0B', '#3B82F6']}
        />

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Instagram Follower Progression</CardTitle>
            <p className="text-xs text-muted-foreground">Historical follower trend logged through platform synchronization</p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <Chart options={growthOptions} series={[{ name: 'Followers', data: growthValues }]} type="line" height={210} width="100%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 24-Hour Active Audience Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">24-Hour Audience Hourly Activity</CardTitle>
            <p className="text-xs text-muted-foreground">When your Instagram audience interacts with your feed</p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Chart options={hoursChartOptions} series={[{ name: 'Active Followers', data: activeHoursData }]} type="area" height={230} width="100%" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Active Days of Week</CardTitle>
            <p className="text-xs text-muted-foreground">Total interactions per day</p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Chart options={daysChartOptions} series={[{ name: 'Interactions', data: daysUsers }]} type="bar" height={230} width="100%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stories Performance & Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5">
          <h4 className="text-sm font-bold text-foreground mb-1">Stories Engagement Performance</h4>
          <p className="text-xs text-muted-foreground mb-4">Granular telemetry for 24-hour visual stories</p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xs text-muted-foreground">Total Views</span>
              <div className="text-lg font-bold text-foreground mt-0.5">{(stories.impressions ?? 0).toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xs text-muted-foreground">Completion</span>
              <div className="text-lg font-bold text-emerald-500 mt-0.5">{stories.completionRate || '0.0%'}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xs text-muted-foreground">Taps Forward</span>
              <div className="text-lg font-bold text-foreground mt-0.5">{stories.tapsForward || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xs text-muted-foreground">Taps Back</span>
              <div className="text-lg font-bold text-sky-400 mt-0.5">{stories.tapsBack || 0}</div>
            </div>
          </div>
        </Card>

        <DemographicDonutChart
          title="Follower Breakdown by Gender"
          labels={['Female Followers', 'Male Followers', 'Other']}
          series={[
            ig.followersPerGender?.female || 0,
            ig.followersPerGender?.male || 0,
            ig.followersPerGender?.other || 0,
          ]}
          colors={['#EC4899', '#3B82F6', '#94A3B8']}
        />

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground mb-3">Top Follower Countries</CardTitle>
            {(ig.topCountries || []).length > 0 ? (
              <div className="space-y-2.5">
                {(ig.topCountries || []).map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{c.country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#E4405F] h-full rounded-full" style={{ width: `${c.percentage || 0}%` }} />
                      </div>
                      <span className="font-mono text-muted-foreground w-8 text-right">{c.percentage || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground italic">
                No country telemetry recorded yet.
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-border/10 text-[11px] text-muted-foreground flex justify-between">
            <span>Primary Language</span>
            <span className="font-semibold text-foreground">
              {ig.topLanguages?.[0]?.language ? `${ig.topLanguages[0].language} (${ig.topLanguages[0].percentage}%)` : 'Not recorded'}
            </span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default InstagramAnalyticsTab
