'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Repeat,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  BarChart2,
  Radio,
  Sparkles,
  ArrowUpRight,
  Send,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface XAnalyticsTabProps {
  data: any
  isLoading?: boolean
}

export const XAnalyticsTab: React.FC<XAnalyticsTabProps> = ({ data, isLoading }) => {
  const x = data || {}

  // Audience Growth Chart
  const growth = x.audienceGrowth || []
  const growthCategories = growth.map((g: any) => g.date)
  const growthSeries = [
    {
      name: 'Total Followers',
      data: growth.map((g: any) => g.followers || 0),
    },
  ]
  const growthOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 260, toolbar: { show: false }, background: 'transparent' },
    colors: ['#38BDF8'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: growthCategories,
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

  // Daily Post Density Chart
  const density = x.postDensityDaily || []
  const densityOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', height: 260, toolbar: { show: false }, background: 'transparent' },
    colors: ['#0284C7'],
    plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: density.map((d: any) => d.day),
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
    },
    yaxis: {
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
    },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
  }
  const densitySeries = [
    {
      name: 'Posts Published',
      data: density.map((d: any) => d.posts || 0),
    },
  ]

  const mentions = x.awarenessThroughMentions || {
    mentionsCount: 0,
    sentimentScore: 'Neutral',
    reachEst: 0,
  }

  const postsList = x.publishedPostsWithEngagement || []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Send className="w-3.5 h-3.5 text-sky-400" /> Posts
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(x.posts ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Published posts</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-sky-400" /> Followers
          </div>
          <div className="text-xl font-black text-foreground mt-1">
            {((x.totalFollowers || x.follower) ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-muted-foreground">Connected profile</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Following
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(x.following ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground font-medium">Curated peers</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Repeat className="w-3.5 h-3.5 text-emerald-400" /> Retweets
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(x.retweets ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Reposts & shares</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Engagements
          </div>
          <div className="text-xl font-black text-foreground mt-1">
            {((x.totalEngagement || x.engagements) ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Active replies & likes</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Eng. Rate
          </div>
          <div className="text-xl font-black text-foreground mt-1">{x.engagementRate || '0.0%'}</div>
          <span className="text-[10px] text-muted-foreground">Per post interaction</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Ratio
          </div>
          <div className="text-xl font-black text-foreground mt-1">{x.followersFollowingRate || '0.0x'}</div>
          <span className="text-[10px] text-purple-400 font-medium">Follower ratio</span>
        </Card>
      </div>

      {/* Awareness & Mentions Banner */}
      <Card className="rounded-2xl border-border/40 bg-gradient-to-r from-sky-950/30 via-card/60 to-indigo-950/20 backdrop-blur-md p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 font-mono text-[11px]">
                <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Mentions Feed
              </Badge>
              <span className="text-xs text-muted-foreground">Awareness Through Mentions & Brand Reach</span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Social Brand Sentiment: <span className="text-emerald-400">{mentions.sentimentScore}</span>
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center px-4 py-2 rounded-xl bg-background/40 border border-border/30">
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total Mentions</span>
              <div className="text-lg font-black text-foreground">{mentions.mentionsCount || 0}</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-background/40 border border-border/30">
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">Estimated Reach</span>
              <div className="text-lg font-black text-sky-400">{(mentions.reachEst ?? 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Grid: Growth & Post Density */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" /> Audience Growth (Followers Over Time)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px]">
              <Chart options={growthOptions} series={growthSeries} type="area" height={250} width="100%" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-400" /> Daily Post Activity by Day of Week
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px]">
              <Chart options={densityOptions} series={densitySeries} type="bar" height={250} width="100%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Published Tweets List Table */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Published Posts & Tweet Engagement
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Live impressions, retweets, replies, and calculated engagement rates from connected account
            </p>
          </div>
          <Badge variant="outline" className="text-xs text-sky-400 border-sky-400/30">
            X API v2 Connected
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/10 bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tweet Content / Title</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Impressions</th>
                  <th className="py-3 px-4 text-right">Retweets</th>
                  <th className="py-3 px-4 text-right">Replies</th>
                  <th className="py-3 px-4 text-right">Likes</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {postsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground text-xs italic">
                      No published posts on X (Twitter) yet.
                    </td>
                  </tr>
                ) : (
                  postsList.map((p: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground max-w-[280px] truncate">
                        {p.title}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                        {p.date ? new Date(p.date).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs">{p.impressions?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-400">{p.retweets || 0}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-sky-400">{p.replies || 0}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-pink-500 font-semibold">{p.likes || 0}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-400 font-bold">{p.engagementRate || '0.0%'}</td>
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

export default XAnalyticsTab
