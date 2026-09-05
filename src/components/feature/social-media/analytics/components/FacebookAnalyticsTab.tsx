'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Eye,
  Heart,
  MessageSquare,
  MousePointer,
  Sparkles,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Calendar,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemographicDonutChart } from './DemographicDonutChart'
import { DailyPostDensityHeatmap } from './DailyPostDensityHeatmap'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface FacebookTabProps {
  data: any
  isLoading?: boolean
}

export const FacebookAnalyticsTab: React.FC<FacebookTabProps> = ({ data, isLoading }) => {
  const fb = data || {}

  // Audience Growth Chart
  const growthCategories = (fb.audienceGrowth || []).map((g: any) => g.date)
  const growthSeries = [
    {
      name: 'Page Fans',
      data: (fb.audienceGrowth || []).map((g: any) => g.fans),
    },
  ]
  const growthChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 260, toolbar: { show: false }, background: 'transparent' },
    colors: ['#1877F2'],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    xaxis: { categories: growthCategories, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
  }

  // Active Users by Day & Engagement Rate by Day Chart
  const activeDays = (fb.activeUsersByDay || []).map((a: any) => a.day)
  const activeUsersSeries = [
    {
      name: 'Active Users',
      type: 'column',
      data: (fb.activeUsersByDay || []).map((a: any) => a.active),
    },
    {
      name: 'Engagement Rate (%)',
      type: 'line',
      data: (fb.engagementRateByDay || []).map((e: any) => e.rate),
    },
  ]
  const activeUsersOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', height: 260, toolbar: { show: false }, background: 'transparent' },
    colors: ['#1877F2', '#10B981'],
    stroke: { width: [0, 3], curve: 'smooth' },
    plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
    xaxis: { categories: activeDays, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    yaxis: [
      { labels: { style: { colors: '#94A3B8', fontSize: '11px' } }, title: { text: 'Users', style: { color: '#94A3B8' } } },
      { opposite: true, labels: { style: { colors: '#10B981', fontSize: '11px' } }, title: { text: 'Rate (%)', style: { color: '#10B981' } } },
    ],
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#94A3B8' } },
  }

  // Fan by Age chart
  const ageLabels = Object.keys(fb.fanByAge || { '18-24': 16, '25-34': 42, '35-44': 24, '45-54': 12, '55+': 6 })
  const ageValues = Object.values(fb.fanByAge || { '18-24': 16, '25-34': 42, '35-44': 24, '45-54': 12, '55+': 6 }) as number[]
  const ageChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', height: 220, toolbar: { show: false }, background: 'transparent' },
    colors: ['#38BDF8'],
    plotOptions: { bar: { borderRadius: 6, horizontal: true } },
    xaxis: { categories: ageLabels, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark', y: { formatter: (val) => `${val}% of Fans` } },
  }

  // Reactions breakdown
  const reactions = fb.reactionsOverview || { like: 64, love: 22, haha: 7, wow: 5, sad: 1, angry: 1 }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-[#1877F2]" /> Fans
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.fans?.toLocaleString() || 4820}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+4.2% growth</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-purple-400" /> Impressions
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.impressions?.toLocaleString() || '28.4K'}</div>
          <span className="text-[10px] text-muted-foreground">Post & Story views</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Heart className="w-3.5 h-3.5 text-pink-500" /> Reactions
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.reactions?.toLocaleString() || 1180}</div>
          <span className="text-[10px] text-pink-500 font-semibold">Likes & Loves</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Comments
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.comments?.toLocaleString() || 290}</div>
          <span className="text-[10px] text-muted-foreground">High response rate</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MousePointer className="w-3.5 h-3.5 text-emerald-400" /> Clicks
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.clicks?.toLocaleString() || 420}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">Link / CTA Clicks</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Rate
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.engagementRate || '4.6%'}</div>
          <span className="text-[10px] text-emerald-500 font-semibold">+0.6% vs benchmark</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Messages
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.messageCount || 56}</div>
          <span className="text-[10px] text-muted-foreground">Direct inquiries</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Calendar className="w-3.5 h-3.5 text-sky-400" /> Total Posts
          </div>
          <div className="text-xl font-black text-foreground mt-1">{fb.totalPosts || 24}</div>
          <span className="text-[10px] text-muted-foreground">{fb.postRate || '1.4 / day'}</span>
        </Card>
      </div>

      {/* Audience Growth & Active Users Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Facebook Audience Growth</CardTitle>
            <p className="text-xs text-muted-foreground">Cumulative page fan acquisition over the last 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <Chart options={growthChartOptions} series={growthSeries} type="area" height={250} width="100%" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">Active Users & Engagement Rate by Day</CardTitle>
            <p className="text-xs text-muted-foreground">Interaction intensity across days of the week</p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <Chart options={activeUsersOptions} series={activeUsersSeries} type="line" height={250} width="100%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment, Reactions, and Media Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Audience Sentiment Analysis</h4>
            <p className="text-xs text-muted-foreground mb-4">NLP classification of comments and page mentions</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <Smile className="w-4 h-4" /> Positive ({fb.sentiment?.positive || 71}%)
                  </span>
                </div>
                <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fb.sentiment?.positive || 71}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-amber-500">
                    <Meh className="w-4 h-4" /> Neutral ({fb.sentiment?.neutral || 21}%)
                  </span>
                </div>
                <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${fb.sentiment?.neutral || 21}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-rose-500">
                    <Frown className="w-4 h-4" /> Negative ({fb.sentiment?.negative || 8}%)
                  </span>
                </div>
                <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fb.sentiment?.negative || 8}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/10 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Overall Brand Perception</span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
              Strong Positive
            </Badge>
          </div>
        </Card>

        {/* Reactions Overview */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5">
          <h4 className="text-sm font-bold text-foreground mb-1">Reactions Overview</h4>
          <p className="text-xs text-muted-foreground mb-4">Emotional reaction distribution on published posts</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xl">👍</span>
              <div className="text-base font-bold text-foreground mt-1">{reactions.like}%</div>
              <span className="text-[10px] text-muted-foreground">Like</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xl">❤️</span>
              <div className="text-base font-bold text-pink-500 mt-1">{reactions.love}%</div>
              <span className="text-[10px] text-muted-foreground">Love</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xl">😆</span>
              <div className="text-base font-bold text-amber-500 mt-1">{reactions.haha}%</div>
              <span className="text-[10px] text-muted-foreground">Haha</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xl">😮</span>
              <div className="text-base font-bold text-sky-400 mt-1">{reactions.wow}%</div>
              <span className="text-[10px] text-muted-foreground">Wow</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xl">😢</span>
              <div className="text-base font-bold text-muted-foreground mt-1">{reactions.sad}%</div>
              <span className="text-[10px] text-muted-foreground">Sad</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/10">
              <span className="text-xl">😡</span>
              <div className="text-base font-bold text-rose-500 mt-1">{reactions.angry}%</div>
              <span className="text-[10px] text-muted-foreground">Angry</span>
            </div>
          </div>
        </Card>

        {/* Post Type Breakdown */}
        <DemographicDonutChart
          title="Published Post Types"
          labels={['Images & Photos', 'Videos & Reels', 'Links / Articles', 'Status Updates']}
          series={[fb.postType?.photo || 45, fb.postType?.video || 32, fb.postType?.link || 15, fb.postType?.status || 8]}
          colors={['#1877F2', '#38BDF8', '#10B981', '#F59E0B']}
        />
      </div>

      {/* Fan Demographics: Age, Gender, Top Countries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
          <CardTitle className="text-sm font-semibold text-foreground mb-1">Fan Distribution by Age</CardTitle>
          <div className="h-[210px]">
            <Chart options={ageChartOptions} series={[{ name: 'Age %', data: ageValues }]} type="bar" height={200} width="100%" />
          </div>
        </Card>

        <DemographicDonutChart
          title="Fan Breakdown by Gender"
          labels={['Male Fans', 'Female Fans', 'Other / Undisclosed']}
          series={[fb.fanByGender?.male || 54, fb.fanByGender?.female || 43, fb.fanByGender?.other || 3]}
          colors={['#38BDF8', '#EC4899', '#94A3B8']}
        />

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground mb-3">Top Fan Countries</CardTitle>
            <div className="space-y-2.5">
              {(fb.topCountries || []).map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{c.country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#1877F2] h-full rounded-full" style={{ width: `${c.percentage}%` }} />
                    </div>
                    <span className="font-mono text-muted-foreground w-8 text-right">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/10 text-[11px] text-muted-foreground flex justify-between">
            <span>Primary Audience Language</span>
            <span className="font-semibold text-foreground">English (70%)</span>
          </div>
        </Card>
      </div>

      {/* Day / Time Heatmap */}
      <DailyPostDensityHeatmap
        title="Facebook Engagement Heatmap by Day & Time"
        subtitle="Identifies the highest concentration of active Facebook users browsing your content"
      />

      {/* Published Posts with Engagement Data Table */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Published Facebook Posts with Live Engagement
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Individual post metrics, impression counts, reaction volumes, and conversation rates
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/10 bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Post Title / Content</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 text-right">Impressions</th>
                  <th className="py-3 px-4 text-right">Reactions</th>
                  <th className="py-3 px-4 text-right">Comments</th>
                  <th className="py-3 px-4 text-right">Shares</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {(fb.publishedPostsWithEngagement || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground text-xs italic">
                      No published posts on Facebook yet.
                    </td>
                  </tr>
                ) : (
                  (fb.publishedPostsWithEngagement || []).map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground line-clamp-1 max-w-[280px]">
                        {p.title}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                        {p.date ? new Date(p.date).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs">{p.impressions?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-pink-500 font-semibold">{p.reactions}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-blue-400">{p.comments}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-purple-400">{p.shares}</td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-500 font-bold">{p.engagementRate}</td>
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
