'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  Sparkles,
  Coins,
  Users,
  Target,
  ArrowUpRight,
  Brain,
  CheckCircle2,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  useGetAnalyticsDashboardQuery,
  useGetBusinessProfileQuery,
  useGenerateInsightsMutation,
} from '@/redux/api/aiSocialApi'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function AnalyticsDashboardPage() {
  const now = new Date()
  const [month, setMonth] = useState(MONTHS[now.getMonth()])
  const [year, setYear] = useState(now.getFullYear())

  const { data: profileData } = useGetBusinessProfileQuery(undefined)
  const business = (profileData as any)?.data

  const { data, isLoading } = useGetAnalyticsDashboardQuery(
    { businessId: business?._id, month, year },
    { skip: !business?._id }
  )

  const [generateInsights, { isLoading: generatingInsights }] = useGenerateInsightsMutation()
  const stats = (data as any)?.data

  const handleGenerateInsights = async () => {
    try {
      const res: any = await generateInsights({ businessId: business._id, month, year }).unwrap()
      toast.success('AI Memory updated with performance insights! Next month will be optimized.')
    } catch {
      toast.error('Insufficient published posts with analytics callbacks yet.')
    }
  }

  const kpis = stats ? [
    { label: 'Planned Content', value: stats.totalPlanned, icon: Target, color: 'text-blue-500' },
    { label: 'Published Items', value: stats.totalPublished, icon: BarChart3, color: 'text-emerald-500' },
    { label: 'Total Reach', value: stats.totalReach?.toLocaleString() || '0', icon: Eye, color: 'text-purple-500' },
    { label: 'Avg Engagement Rate', value: stats.avgEngagementRate || '0%', icon: Heart, color: 'text-pink-500' },
    { label: 'Total Impressions', value: stats.totalImpressions?.toLocaleString() || '0', icon: Users, color: 'text-amber-500' },
    { label: 'Credits Consumed', value: stats.creditsUsed || 0, icon: Coins, color: 'text-primary' },
  ] : []

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Social Marketing Analytics"
        showBackButton={true}
        endContent={
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-10 rounded-[8px] border border-input-border-color bg-background px-3 text-sm focus:outline-none text-foreground inner-card"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <Button
              variant="premium"
              size="sm"
              disabled={generatingInsights || !business}
              onClick={handleGenerateInsights}
              className="h-10 gap-1.5 font-semibold"
            >
              {generatingInsights ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" /> Train AI Memory
                </>
              )}
            </Button>
          </div>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {stats && (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <Card key={kpi.label} className="border border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-foreground">{kpi.value}</p>
                      <p className="text-[11px] font-medium text-muted-foreground leading-tight mt-0.5">
                        {kpi.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Top & Bottom Performing Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Posts */}
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <CardTitle className="text-base font-bold">Top Performing Content</CardTitle>
                  </div>
                  <Badge variant="default" className="text-[10px]">High Engagement</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 divide-y divide-border/40">
                {stats.topPerforming?.length > 0 ? (
                  stats.topPerforming.map((post: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-foreground truncate">{post.topic}</p>
                        <p className="text-[11px] text-muted-foreground">{post.format}</p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs font-bold shrink-0 text-emerald-500">
                        +{post.score} pts
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">No published post metrics recorded yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Improvement Needed */}
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500 rotate-180" />
                    <CardTitle className="text-base font-bold">Underperforming Content</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Opportunities</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 divide-y divide-border/40">
                {stats.worstPerforming?.length > 0 ? (
                  stats.worstPerforming.map((post: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-foreground truncate">{post.topic}</p>
                        <p className="text-[11px] text-muted-foreground">{post.format}</p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs font-bold shrink-0 text-amber-500">
                        {post.score} pts
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">No underperforming data yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Memory Loop Callout */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Self-Improving AI Engine</h3>
                  <p className="text-xs text-muted-foreground max-w-xl mt-0.5">
                    Clicking "Train AI Memory" extracts best performing formats, topics, and styles from this month, automatically upgrading the prompt parameters for all subsequent months.
                  </p>
                </div>
              </div>

              <Button
                variant="premium"
                disabled={generatingInsights || !business}
                onClick={handleGenerateInsights}
                className="shrink-0 gap-1.5"
              >
                {generatingInsights ? 'Analyzing Metrics...' : 'Run Memory Update →'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
