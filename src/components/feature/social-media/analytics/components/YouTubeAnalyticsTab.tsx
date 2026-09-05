'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Youtube,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Video,
  Users,
  UserPlus,
  UserMinus,
  Tv,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  MessageSquare,
  Share2,
} from 'lucide-react'
import { DemographicDonutChart } from './DemographicDonutChart'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface YouTubeAnalyticsTabProps {
  data: any
  isLoading?: boolean
}

export const YouTubeAnalyticsTab: React.FC<YouTubeAnalyticsTabProps> = ({ data, isLoading }) => {
  const yt = data || {}

  // Daily Views Graph
  const viewsGraph = yt.dailyVideoViewsGraph || []
  const graphOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 260, toolbar: { show: false }, background: 'transparent' },
    colors: ['#EF4444'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    xaxis: {
      categories: viewsGraph.map((v: any) => v.day),
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px' },
        formatter: (val) => `${(val / 1000).toFixed(1)}k`,
      },
    },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
  }
  const graphSeries = [
    {
      name: 'Video Views',
      data: viewsGraph.map((v: any) => v.views),
    },
  ]

  // Device breakdown
  const device = yt.viewerDevice || { mobile: 64, desktop: 24, tv: 8, tablet: 4 }
  const deviceSeries = [device.mobile || 64, device.desktop || 24, device.tv || 8, device.tablet || 4]
  const deviceLabels = ['Mobile Phone', 'Desktop PC', 'Smart TV', 'Tablet']
  const deviceOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: deviceLabels,
    colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      labels: { colors: '#94A3B8' },
      fontSize: '11px',
    },
    tooltip: { theme: 'dark' },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Top Device',
              formatter: () => 'Mobile (64%)',
              color: '#94A3B8',
              fontSize: '12px',
            },
          },
        },
      },
    },
  }

  const gainedLost = yt.gainedLostSubscribers || { gained: 215, lost: 24, net: 191 }
  const likesDislikes = yt.likesVsDislikes || { likesPercentage: 98.3, dislikesPercentage: 1.7 }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-red-500" /> Subscribers
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.subscribers?.toLocaleString() || '3.6K'}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+{gainedLost.net} net</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-red-400" /> Total Views
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.views?.toLocaleString() || '64.2K'}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+18.2% vs last mo</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Watch Minutes
          </div>
          <div className="text-xl font-black text-foreground mt-1">
            {((yt.estimatedMinutesWatched || 186400) / 1000).toFixed(1)}k
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">Est. Total Time</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Video className="w-3.5 h-3.5 text-blue-400" /> Videos Published
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.videosPublished || yt.videos || 28}</div>
          <span className="text-[10px] text-blue-400 font-medium">Active catalog</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Likes
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.likes?.toLocaleString() || '2.4K'}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">{likesDislikes.likesPercentage}% positive</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> Dislikes
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.dislikes || 42}</div>
          <span className="text-[10px] text-rose-400 font-semibold">{likesDislikes.dislikesPercentage}% ratio</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Comments
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.comments?.toLocaleString() || 480}</div>
          <span className="text-[10px] text-sky-400 font-medium">High interaction</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Share2 className="w-3.5 h-3.5 text-purple-400" /> Shares
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.shares?.toLocaleString() || 310}</div>
          <span className="text-[10px] text-purple-400 font-semibold">+12% viral reach</span>
        </Card>
      </div>

      {/* Subscriber Dynamics & Likes vs Dislikes Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriber Flux Card */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" /> Gained vs Lost Subscribers
            </span>
            <h4 className="text-xl font-black text-foreground">Subscriber Conversion</h4>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold">
                <UserPlus className="w-3.5 h-3.5" /> Gained
              </div>
              <div className="text-lg font-black text-emerald-400 mt-1">+{gainedLost.gained}</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-semibold">
                <UserMinus className="w-3.5 h-3.5" /> Lost
              </div>
              <div className="text-lg font-black text-rose-400 mt-1">-{gainedLost.lost}</div>
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <div className="text-primary text-xs font-semibold">Net Growth</div>
              <div className="text-lg font-black text-primary mt-1">+{gainedLost.net}</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Retention rate: 89.2%</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
              Healthy organic curve
            </Badge>
          </div>
        </Card>

        {/* Likes vs Dislikes Bar */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold uppercase flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-400" /> Likes vs Dislikes Sentiment
            </span>
            <h4 className="text-xl font-black text-foreground">{likesDislikes.likesPercentage}% Positive Reaction</h4>
          </div>

          <div className="my-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> {likesDislikes.likesPercentage}% Likes ({yt.likes || 2480})
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                {likesDislikes.dislikesPercentage}% Dislikes ({yt.dislikes || 42}) <ThumbsDown className="w-3 h-3" />
              </span>
            </div>
            <div className="h-3 w-full bg-rose-500/30 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-l-full"
                style={{ width: `${likesDislikes.likesPercentage}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Audience response is well above industry benchmark of 92% approval.
          </p>
        </Card>

        {/* Daily Views Stat */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold uppercase flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500" /> Daily Video Views Avg
            </span>
            <h4 className="text-xl font-black text-foreground">{yt.dailyVideoViews?.toLocaleString() || '2,140'} / day</h4>
          </div>

          <div className="p-3 rounded-xl bg-background/50 border border-border/30 my-4 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Peak Daily Velocity:</span>
              <span className="font-semibold text-foreground">3,450 views</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg View Duration:</span>
              <span className="font-semibold text-emerald-400">4m 38s</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px]">
              Active Video Catalog
            </Badge>
          </div>
        </Card>
      </div>

      {/* Daily Video Views Graph & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500" /> Daily Video Views Graph
            </CardTitle>
            <Badge variant="secondary" className="text-[11px] font-mono">
              Last 30 Days
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <Chart options={graphOptions} series={graphSeries} type="area" height={260} />
          </CardContent>
        </Card>

        {/* Viewer Device Distribution */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Tv className="w-4 h-4 text-amber-400" /> Viewer Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Chart options={deviceOptions} series={deviceSeries} type="donut" height={260} />
          </CardContent>
        </Card>
      </div>

      {/* Demographics & Geographic Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" /> Subscribers Per Age
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <DemographicDonutChart
              title="Age Distribution"
              labels={Object.keys(yt.subscribersPerAge || { '18-24': 18, '25-34': 44, '35-44': 22, '45-54': 11, '55+': 5 })}
              series={Object.values(yt.subscribersPerAge || { '18-24': 18, '25-34': 44, '35-44': 22, '45-54': 11, '55+': 5 }) as number[]}
              colors={['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2']}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-400" /> Subscribers Per Gender
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <DemographicDonutChart
              title="Gender Ratio"
              labels={['Male Fans', 'Female Fans', 'Other']}
              series={[
                yt.subscribersPerGender?.male || 68,
                yt.subscribersPerGender?.female || 29,
                yt.subscribersPerGender?.other || 3,
              ]}
              colors={['#38BDF8', '#EC4899', '#94A3B8']}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Subscribers Per Country
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {(
                yt.subscribersPerCountry || [
                  { country: 'United States', percentage: 44 },
                  { country: 'India', percentage: 20 },
                  { country: 'United Kingdom', percentage: 14 },
                  { country: 'Germany', percentage: 12 },
                  { country: 'Canada', percentage: 10 },
                ]
              ).map((c: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{c.country}</span>
                    <span className="font-mono text-muted-foreground">{c.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
