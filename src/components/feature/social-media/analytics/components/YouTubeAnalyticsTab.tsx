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
      },
    },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
  }
  const graphSeries = [
    {
      name: 'Video Views',
      data: viewsGraph.map((v: any) => v.views || 0),
    },
  ]

  // Device breakdown
  const device = yt.viewerDevice || { mobile: 0, desktop: 0, tv: 0, tablet: 0 }
  const deviceSeries = [device.mobile || 0, device.desktop || 0, device.tv || 0, device.tablet || 0]
  const deviceLabels = ['Mobile Phone', 'Desktop PC', 'Smart TV', 'Tablet']

  const gainedLost = yt.gainedLostSubscribers || { gained: 0, lost: 0, net: 0 }
  const likesDislikes = yt.likesVsDislikes || { likesPercentage: (yt.likes > 0 ? 100 : 0), dislikesPercentage: 0 }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-red-500" /> Subscribers
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(yt.subscribers ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">+{gainedLost.net} net</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-red-400" /> Total Views
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(yt.views ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Play telemetry</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Watch Minutes
          </div>
          <div className="text-xl font-black text-foreground mt-1">
            {((yt.estimatedMinutesWatched || 0) / 1000).toFixed(1)}k
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">Est. Total Time</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Video className="w-3.5 h-3.5 text-blue-400" /> Videos Published
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.videosPublished || yt.videos || 0}</div>
          <span className="text-[10px] text-blue-400 font-medium">Active catalog</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Likes
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(yt.likes ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">{likesDislikes.likesPercentage}% positive</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> Dislikes
          </div>
          <div className="text-xl font-black text-foreground mt-1">{yt.dislikes || 0}</div>
          <span className="text-[10px] text-rose-400 font-semibold">{likesDislikes.dislikesPercentage}% ratio</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Comments
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(yt.comments ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-sky-400 font-medium">Responses</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-red-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Share2 className="w-3.5 h-3.5 text-purple-400" /> Shares
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(yt.shares ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-purple-400 font-semibold">Video links shared</span>
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
            <span>Net movement</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
              Live channel tracking
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
                <ThumbsUp className="w-3 h-3" /> {likesDislikes.likesPercentage}% Likes ({yt.likes || 0})
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                {likesDislikes.dislikesPercentage}% Dislikes ({yt.dislikes || 0}) <ThumbsDown className="w-3 h-3" />
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
            Computed from real likes and dislikes on published channel videos.
          </p>
        </Card>

        {/* Device Breakdown Donut */}
        <DemographicDonutChart
          title="Views by Device Type"
          labels={deviceLabels}
          series={deviceSeries}
          colors={['#EF4444', '#3B82F6', '#10B981', '#F59E0B']}
        />
      </div>

      {/* Daily Video Views Graph */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Daily Video Views Graph
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Progression of views across catalog videos
            </p>
          </div>
          <Badge variant="outline" className="text-xs text-red-500 border-red-500/30">
            YouTube Data API v3
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[270px]">
            <Chart options={graphOptions} series={graphSeries} type="area" height={260} width="100%" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default YouTubeAnalyticsTab
