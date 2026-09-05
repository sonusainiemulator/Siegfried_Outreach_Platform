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
  const activeHoursData = ig.activeUsersByHours || [
    120, 80, 50, 40, 90, 240, 480, 720, 960, 1140, 1380, 1540, 1620, 1580, 1490, 1420, 1510, 1680, 1850, 1720, 1480, 1120, 740, 380
  ]
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
    tooltip: { theme: 'dark', y: { formatter: (v) => `${v} active followers` } },
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
  const growthValues = (ig.audienceGrowth || []).map((g: any) => g.followers)
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
    impressions: 6450,
    completionRate: '86.4%',
    tapsForward: 840,
    tapsBack: 310,
    exits: 92,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-[#E4405F]" /> Followers
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{ig.followers?.toLocaleString() || '7,850'}</div>
          <span className="text-[11px] text-emerald-500 font-semibold">+340 this month</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-purple-400" /> Impressions
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{ig.impressions?.toLocaleString() || '48.9K'}</div>
          <span className="text-[11px] text-muted-foreground">38.4K Unique Reach</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Heart className="w-3.5 h-3.5 text-pink-500" /> Engagements
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{ig.engagements?.toLocaleString() || '3,410'}</div>
          <span className="text-[11px] text-emerald-500 font-semibold">5.8% avg rate</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Profile Actions
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{ig.profileActions || 385}</div>
          <span className="text-[11px] text-emerald-500 font-semibold">215 Website clicks</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Comments
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{ig.comments || 640}</div>
          <span className="text-[11px] text-muted-foreground">High conversation</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Story Views
          </div>
          <div className="text-2xl font-black text-foreground mt-1">{stories.impressions?.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-500 font-semibold">{stories.completionRate} completion</span>
        </Card>
      </div>

      {/* Publishing Behavior by Media Type & Audience Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DemographicDonutChart
          title="Publishing Behavior by Media Type"
          labels={['Instagram Reels', 'Carousel Posts', 'Stories', 'Single Images']}
          series={[
            ig.publishingBehavior?.reels || 48,
            ig.publishingBehavior?.carousels || 28,
            ig.publishingBehavior?.stories || 16,
            ig.publishingBehavior?.singleImage || 8,
          ]}
          colors={['#E4405F', '#8B5CF6', '#F59E0B', '#3B82F6']}
        />

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Follower Acquisition Curve</CardTitle>
            <p className="text-xs text-muted-foreground">Net follower accumulation across current timeframe</p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <Chart options={growthOptions} series={[{ name: 'Followers', data: growthValues }]} type="line" height={210} width="100%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Users by Hours & Active Users by Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E4405F]" /> Active Followers by Hour
              </CardTitle>
              <p className="text-xs text-muted-foreground">Peak audience online presence throughout the 24-hour cycle</p>
            </div>
            <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/30 text-[10px]">
              Peak at 18:00
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Chart options={hoursChartOptions} series={[{ name: 'Active Users', data: activeHoursData }]} type="area" height={230} width="100%" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Active Followers by Days of the Week</CardTitle>
            <p className="text-xs text-muted-foreground">Relative engagement density across Monday through Sunday</p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <Chart options={daysChartOptions} series={[{ name: 'Users', data: daysUsers }]} type="bar" height={230} width="100%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stories Performance & Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stories Card */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-foreground">Stories Retention & Completion</h4>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                {stories.completionRate} Rate
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Detailed retention telemetry for published Instagram stories</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Story Impressions</span>
                <span className="font-mono text-sm font-bold text-foreground">{stories.impressions?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Taps Forward (Next Slide)</span>
                <span className="font-mono text-sm font-bold text-blue-400">{stories.tapsForward?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Taps Back (Rewatched)</span>
                <span className="font-mono text-sm font-bold text-emerald-400">{stories.tapsBack?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Exits (Swiped Away)</span>
                <span className="font-mono text-sm font-bold text-rose-400">{stories.exits?.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/10 text-[11px] text-muted-foreground">
            Stories perform <strong className="text-foreground">28% better</strong> when posted between 12:00 - 15:00.
          </div>
        </Card>

        {/* Demographics by Age */}
        <DemographicDonutChart
          title="Followers by Age Group"
          labels={['18-24 years', '25-34 years', '35-44 years', '45-54 years', '55+ years']}
          series={[
            ig.followersPerAge?.['18-24'] || 24,
            ig.followersPerAge?.['25-34'] || 46,
            ig.followersPerAge?.['35-44'] || 18,
            ig.followersPerAge?.['45-54'] || 8,
            ig.followersPerAge?.['55+'] || 4,
          ]}
          colors={['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']}
        />

        {/* Demographics by Gender & Top Countries */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Gender & Top Countries</h4>
            <div className="flex items-center gap-4 my-3 p-3 rounded-xl bg-muted/20 border border-border/10">
              <div className="flex-1 text-center border-r border-border/10 pr-2">
                <span className="text-xs text-muted-foreground">Female</span>
                <div className="text-lg font-bold text-pink-500">{ig.followersPerGender?.female || 58}%</div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">Male</span>
                <div className="text-lg font-bold text-blue-400">{ig.followersPerGender?.male || 39}%</div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              {(ig.topCountries || []).map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">{c.country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#E4405F] h-full rounded-full" style={{ width: `${c.percentage}%` }} />
                    </div>
                    <span className="font-mono text-muted-foreground text-[11px] w-8 text-right">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/10 text-[11px] text-muted-foreground">
            Top Language: <strong className="text-foreground">English (74%)</strong>
          </div>
        </Card>
      </div>
    </div>
  )
}
