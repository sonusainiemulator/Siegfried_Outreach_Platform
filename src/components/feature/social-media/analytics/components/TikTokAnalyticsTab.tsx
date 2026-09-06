'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Video,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  TrendingUp,
  Users,
  Play,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DemographicDonutChart } from './DemographicDonutChart'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface TikTokTabProps {
  data: any
  isLoading?: boolean
}

export const TikTokAnalyticsTab: React.FC<TikTokTabProps> = ({ data, isLoading }) => {
  const tt = data || {}

  // Daily Posting Pattern vs Engagement Chart
  const pattern = tt.dailyPostingPatternVsEngagement || []
  const patternDays = pattern.map((p: any) => p.day)
  const patternSeries = [
    {
      name: 'Video Views',
      type: 'area',
      data: pattern.map((p: any) => p.views || 0),
    },
    {
      name: 'Total Engagements',
      type: 'column',
      data: pattern.map((p: any) => p.engagement || 0),
    },
    {
      name: 'Posts Published',
      type: 'line',
      data: pattern.map((p: any) => p.posts || 0),
    },
  ]
  const patternOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line', height: 280, toolbar: { show: false }, background: 'transparent' },
    colors: ['#00F2FE', '#FE2C55', '#F59E0B'],
    stroke: { curve: 'smooth', width: [2, 0, 3] },
    plotOptions: { bar: { columnWidth: '35%', borderRadius: 4 } },
    fill: {
      type: ['gradient', 'solid', 'solid'],
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 },
    },
    xaxis: { categories: patternDays, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } },
    yaxis: [
      { labels: { style: { colors: '#00F2FE', fontSize: '11px' } } },
      { opposite: true, labels: { style: { colors: '#FE2C55', fontSize: '11px' } } },
      { show: false },
    ],
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)' },
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#94A3B8' } },
  }

  const activity = tt.engagementActivity || {
    watchFullVideoRate: '0.0%',
    averageWatchTimeSec: 0,
    likesPerView: '0.0%',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-[#00F2FE]" /> Followers
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.followers ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">{tt.netFollowers || '+0'} net</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-[#FE2C55]" /> Video Views
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.videoViews ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Total plays</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Heart className="w-3.5 h-3.5 text-pink-500" /> Likes
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.likes ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Organic hearts</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Share2 className="w-3.5 h-3.5 text-purple-400" /> Shares
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.shares ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-purple-400 font-semibold">Reposts & DMs</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Comments
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.comments ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Direct feedback</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Video className="w-3.5 h-3.5 text-sky-400" /> Total Videos
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.videos ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">Published</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Engagements
          </div>
          <div className="text-xl font-black text-foreground mt-1">{(tt.engagements ?? 0).toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground">{activity.likesPerView || '0.0%'} Rate</span>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-3.5">
          <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Following
          </div>
          <div className="text-xl font-black text-foreground mt-1">{tt.following || 0}</div>
          <span className="text-[10px] text-muted-foreground">Creators followed</span>
        </Card>
      </div>

      {/* Daily Posting Pattern vs Engagement Analysis */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Daily Posting Pattern vs Engagement Analysis
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Correlation between video posting frequency and spikes in video views & audience interaction
            </p>
          </div>
          <Badge variant="outline" className="bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/30 text-xs">
            Live Stream Feed
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[290px]">
            <Chart options={patternOptions} series={patternSeries} type="line" height={280} width="100%" />
          </div>
        </CardContent>
      </Card>

      {/* Engagement Activity & Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engagement Activity Metrics */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Watch Time & Video Retention</h4>
            <p className="text-xs text-muted-foreground mb-4">Real algorithm engagement signals</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Average Watch Duration</span>
                <div className="text-xl font-bold text-foreground mt-0.5">{activity.averageWatchTimeSec || 0}s</div>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Watched Full Video Rate</span>
                <div className="text-xl font-bold text-[#FE2C55] mt-0.5">{activity.watchFullVideoRate || '0.0%'}</div>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border/10">
                <span className="text-xs text-muted-foreground">Likes per View Ratio</span>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">{activity.likesPerView || '0.0%'}</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border/10 text-[11px] text-muted-foreground">
            Connect TikTok For Business for live audience retention analytics.
          </div>
        </Card>

        {/* Gender Breakdown */}
        <DemographicDonutChart
          title="TikTok Followers by Gender"
          labels={['Female Audience', 'Male Audience', 'Other']}
          series={[tt.followersByGender?.female || 0, tt.followersByGender?.male || 0, tt.followersByGender?.other || 0]}
          colors={['#FE2C55', '#00F2FE', '#94A3B8']}
        />

        {/* Followers by Country */}
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3">Audience Geography (Top Countries)</h4>
            {(tt.followersByCountry || []).length > 0 ? (
              <div className="space-y-2.5">
                {(tt.followersByCountry || []).map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">{c.country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00F2FE] h-full rounded-full" style={{ width: `${c.percentage || 0}%` }} />
                      </div>
                      <span className="font-mono text-muted-foreground w-8 text-right">{c.percentage || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground italic">
                No geographic telemetry recorded yet.
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-border/10 text-[11px] text-muted-foreground flex justify-between">
            <span>Primary Region</span>
            <strong className="text-foreground">
              {tt.followersByCountry?.[0]?.country || 'Not recorded'}
            </strong>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TikTokAnalyticsTab
