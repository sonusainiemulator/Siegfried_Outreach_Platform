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
      data: growth.map((g: any) => g.followers),
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
        formatter: (v) => `${(v / 1000).toFixed(1)}k`,
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
      name: 'Posts Density',
      data: density.map((d: any) => d.posts),
    },
  ]

  const mentions = x.awarenessThroughMentions || {
    mentionsCount: 142,
    sentimentScore: '78% Positive',
    reachEst: 28400,
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
          <div className="text-xl font-black text-foreground mt-1">{x.posts?.toLocaleString() || 48}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+6 this week</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-sky-400" /> Followers
          </div>
          <div className="text-xl font-black text-foreground mt-1">
            {(x.totalFollowers || x.follower || 5410).toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">+4.2% growth</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Following
          </div>
          <div className="text-xl font-black text-foreground mt-1">{x.following?.toLocaleString() || 420}</div>
          <span className="text-[10px] text-muted-foreground font-medium">Curated peers</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Repeat className="w-3.5 h-3.5 text-emerald-400" /> Retweets
          </div>
          <div className="text-xl font-black text-foreground mt-1">{x.retweets?.toLocaleString() || 384}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+18.4% share rate</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Engagements
          </div>
          <div className="text-xl font-black text-foreground mt-1">
            {(x.totalEngagement || x.engagements || 2140).toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Active replies</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Eng. Rate
          </div>
          <div className="text-xl font-black text-foreground mt-1">{x.engagementRate || '3.9%'}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+0.6% vs avg</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5 hover:border-sky-500/30 transition-all">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Ratio
          </div>
          <div className="text-xl font-black text-foreground mt-1">{x.followersFollowingRate || '12.8x'}</div>
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
              <div className="text-lg font-black text-foreground">{mentions.mentionsCount}</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-background/40 border border-border/30">
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">Estimated Reach</span>
              <div className="text-lg font-black text-sky-400">{mentions.reachEst?.toLocaleString()}</div>
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
            <Badge variant="secondary" className="text-[11px] font-mono">
              +5.6% MoM
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <Chart options={growthOptions} series={growthSeries} type="area" height={260} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-500" /> Post Density – Daily Cadence
            </CardTitle>
            <Badge variant="secondary" className="text-[11px] font-mono">
              Avg 4.1 Posts/Day
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <Chart options={densityOptions} series={densitySeries} type="bar" height={260} />
          </CardContent>
        </Card>
      </div>

      {/* Published Posts with Engagement Table */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/30">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-400" /> Published Posts With Engagement
          </CardTitle>
          <span className="text-xs text-muted-foreground">Showing top 10 recent tweets</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b border-border/30">
                <tr>
                  <th className="py-3 px-4">Post Content / Snippet</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 text-right">Impressions</th>
                  <th className="py-3 px-4 text-right">Retweets</th>
                  <th className="py-3 px-4 text-right">Replies</th>
                  <th className="py-3 px-4 text-right">Likes</th>
                  <th className="py-3 px-4 text-right">Eng. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {postsList.length > 0 ? (
                  postsList.map((post: any, idx: number) => (
                    <tr key={post.id || idx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground max-w-[280px] truncate">
                        {post.title || `Campaign Announcement & Product Updates #${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-foreground font-semibold">
                        {(post.impressions || 650 + idx * 80).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {post.retweets || 14 + idx}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sky-400">
                        {post.replies || 8 + idx}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-pink-400">
                        {post.likes || 42 + idx * 6}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                          {post.engagementRate || '3.8%'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                      No published posts tracked yet. Synchronize X account to populate feed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
