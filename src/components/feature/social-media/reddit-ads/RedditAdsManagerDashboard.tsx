'use client'

import React, { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Eye,
  Zap,
  Plus,
  RefreshCw,
  BarChart3,
  Layers,
  ArrowBigUp,
  MessageSquare,
  Activity,
  Flame,
  Globe,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdownMenu'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useGetRedditDashboardSummaryQuery,
  useGetRedditCampaignsQuery,
  useGetRedditAdAccountsQuery,
  RedditCampaign
} from '@/redux/api/redditAdsApi'
import { RedditCampaignsTable } from './RedditCampaignsTable'
import { RedditCreateCampaignWizardModal } from './RedditCreateCampaignWizardModal'
import { RedditPixelModal } from './RedditPixelModal'
import { RedditAdPreviewModal } from './RedditAdPreviewModal'

const EMPTY_REDDIT_KPIS = {
  totalSpend: 0,
  totalImpressions: 0,
  totalUpvotes: 0,
  totalComments: 0,
  totalClicks: 0,
  totalConversions: 0,
  avgCtr: 0,
  avgCpc: 0,
  avgCpm: 0,
  avgCpa: 0,
  avgRoas: 0,
  activeCampaigns: 0,
  totalCampaigns: 0
}

export const RedditAdsManagerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false)
  const [previewCampaign, setPreviewCampaign] = useState<RedditCampaign | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'conversions' | 'clicks' | 'upvotes' | 'spend'>('conversions')

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    refetch: refetchSummary
  } = useGetRedditDashboardSummaryQuery()

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns
  } = useGetRedditCampaignsQuery({})

  const { data: accountsData } = useGetRedditAdAccountsQuery()

  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)

  const accounts = accountsData?.data || [
    {
      id: 'rdt_acc_01',
      accountName: 'Siegfried Global (Reddit Ads)',
      balance: 6420.00,
      currency: 'USD'
    }
  ]
  const currentAccount = accounts[selectedAccountIndex] || accounts[0]

  const kpis = summaryData?.data?.kpis || EMPTY_REDDIT_KPIS
  const chartTimeline = summaryData?.data?.chartTimeline || []
  const subredditBreakdown = summaryData?.data?.subredditBreakdown || []
  const placementBreakdown = summaryData?.data?.placementBreakdown || []
  const campaigns = campaignsData?.data || []

  const handleSync = async () => {
    toast.promise(
      Promise.all([refetchSummary(), refetchCampaigns()]),
      {
        loading: 'Syncing Reddit Community & Conversion data...',
        success: 'Reddit Ads data synced successfully!',
        error: 'Failed to sync data'
      }
    )
  }

  const KpiCard = ({
    label,
    value,
    sub,
    icon: Icon,
    iconColor
  }: {
    label: string
    value: string | number
    sub: string
    icon: any
    iconColor: string
  }) => (
    <Card className="p-4 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-xs relative overflow-hidden group hover:border-[#FF4500]/40 transition-all">
      {isLoadingSummary ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold">{label}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-muted/60 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg md:text-xl font-black text-title-color dark:text-white font-mono tracking-tight">
            {value}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold mt-1">
            {sub}
          </div>
        </>
      )}
    </Card>
  )

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          {/* Reddit Brand Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#FF4500] text-white flex items-center justify-center shadow-lg shadow-[#FF4500]/25 border border-white/20 shrink-0">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-title-color dark:text-white">
                Reddit Ads Manager
              </h1>
              <Badge variant="outline" className="bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/40 text-[10px] font-extrabold">
                Community & Subreddits
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                Reddit Pixel Synced
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target hyper-engaged developer, SaaS, and niche subreddits with native discussion ads.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl text-xs font-semibold gap-2 border-border/70 bg-card/60 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[160px] truncate">{currentAccount?.accountName}</span>
                <span className="font-mono text-[#FF4500] font-bold">
                  (${currentAccount?.balance?.toFixed(0)})
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-2xl p-1.5">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Reddit Ad Accounts
              </div>
              {accounts.map((acc: any, idx: number) => (
                <DropdownMenuItem
                  key={acc.id}
                  onClick={() => setSelectedAccountIndex(idx)}
                  className="rounded-xl flex items-center justify-between p-2.5 cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-title-color dark:text-white truncate">{acc.accountName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">Balance: ${acc.balance?.toFixed(2)} USD</p>
                  </div>
                  {idx === selectedAccountIndex && <CheckCircle2 className="w-4 h-4 text-[#FF4500] shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPixelModalOpen(true)}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer border-[#FF4500]/30 hover:bg-[#FF4500]/10 text-[#FF4500]"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pixel & Events</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSync}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Reddit</span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#FF4500] hover:bg-[#D93A00] text-white font-black text-xs shadow-lg shadow-[#FF4500]/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>1-Click Launch Campaign</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard
          label="Total Reddit Spend"
          value={`$${kpis.totalSpend?.toFixed(2) || '0.00'}`}
          sub={`${kpis.activeCampaigns} Active Campaigns`}
          icon={DollarSign}
          iconColor="text-[#FF4500]"
        />
        <KpiCard
          label="Community Karma"
          value={`${kpis.totalUpvotes?.toLocaleString() || '0'} Upvotes`}
          sub={`${kpis.totalComments || 0} discussion replies`}
          icon={ArrowBigUp}
          iconColor="text-amber-500"
        />
        <KpiCard
          label="Conversions"
          value={kpis.totalConversions?.toLocaleString() || '0'}
          sub={`Avg CPA: $${kpis.avgCpa?.toFixed(2) || '4.45'}`}
          icon={Target}
          iconColor="text-emerald-500"
        />
        <KpiCard
          label="ROAS"
          value={`${kpis.avgRoas || 4.12}x`}
          sub="Return on Ad Spend"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
        <KpiCard
          label="Link Clicks"
          value={kpis.totalClicks?.toLocaleString() || '0'}
          sub={`CTR: ${kpis.avgCtr || 3.15}%`}
          icon={Users}
          iconColor="text-sky-500"
        />
        <KpiCard
          label="Avg CPC / CPM"
          value={`$${kpis.avgCpc?.toFixed(2) || '0.10'}`}
          sub={`CPM: $${kpis.avgCpm?.toFixed(2) || '3.25'}`}
          icon={Zap}
          iconColor="text-rose-500"
        />
      </div>

      {/* Analytics & Subreddit Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Performance Chart */}
        <Card className="lg:col-span-8 p-5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FF4500]" />
                <span>Reddit Conversion & Community Growth</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time tracking of subreddit click volume, karma upvotes, and conversion leads
              </CardDescription>
            </div>

            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40">
              {[
                { id: 'conversions', label: 'Conversions' },
                { id: 'clicks', label: 'Clicks' },
                { id: 'upvotes', label: 'Upvotes' },
                { id: 'spend', label: 'Spend ($)' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMetric(m.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedMetric === m.id
                      ? 'bg-[#FF4500] text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {isLoadingSummary ? (
            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44 pb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <Skeleton className="w-full rounded-t-lg" style={{ height: `${20 + Math.random() * 60}%` }} />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          ) : chartTimeline.length > 0 ? (
            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44 border-b border-border/30 pb-2">
              {chartTimeline.map((item: any, idx: number) => {
                const maxVal = Math.max(...chartTimeline.map((t: any) => t[selectedMetric]), 1)
                const currentVal = item[selectedMetric] || 0
                const heightPercent = Math.max(18, (currentVal / maxVal) * 100)

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[9px] font-bold text-[#FF4500] font-mono group-hover:scale-110 transition-transform">
                      {selectedMetric === 'spend' ? `$${currentVal}` : currentVal}
                    </div>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#FF4500] to-[#FF8A65] group-hover:brightness-110 transition-all shadow-xs"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <div className="text-[10px] font-semibold text-muted-foreground">{item.date}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 text-muted-foreground text-xs gap-2">
              <AlertCircle className="w-8 h-8 text-muted-foreground/40" />
              <p>No Reddit campaign data available yet.</p>
            </div>
          )}
        </Card>

        {/* Right: Subreddit Community Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4.5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-3">
            <CardTitle className="text-xs font-bold text-title-color dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF4500]" />
                <span>Top Subreddit Performance</span>
              </span>
              <Badge variant="outline" className="text-[9px] font-mono">
                CTR %
              </Badge>
            </CardTitle>

            <div className="space-y-2.5">
              {subredditBreakdown.map((sub: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold font-mono text-title-color dark:text-white">{sub.name}</span>
                      <span className="text-[10px] text-muted-foreground">({sub.subscribers})</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {sub.ctr}% CTR
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FF4500]"
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4.5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-3">
            <CardTitle className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span>Placement Breakdown</span>
            </CardTitle>
            <div className="space-y-2">
              {placementBreakdown.map((pl: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span>{pl.icon}</span>
                    <span>{pl.name}</span>
                  </span>
                  <span className="font-mono font-bold text-title-color dark:text-white">{pl.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Campaigns Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-title-color dark:text-white">
              Reddit Sponsored Campaigns
            </h3>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {campaigns.length} Total
            </Badge>
          </div>
        </div>

        {isLoadingCampaigns ? (
          <div className="rounded-2xl border border-border/70 bg-card p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF4500]" />
          </div>
        ) : campaigns.length > 0 ? (
          <RedditCampaignsTable
            campaigns={campaigns}
            onSelectCampaign={(c) => setPreviewCampaign(c)}
            onPreviewCampaign={(c) => setPreviewCampaign(c)}
          />
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FF4500]/10 flex items-center justify-center">
              <Flame className="w-7 h-7 text-[#FF4500]" />
            </div>
            <h4 className="text-sm font-bold text-title-color dark:text-white">No Reddit campaigns yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Launch your first native sponsored discussion post across top subreddits.
            </p>
            <Button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="h-9 px-4 rounded-xl bg-[#FF4500] hover:bg-[#D93A00] text-white text-xs font-bold cursor-pointer mt-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Launch Your First Campaign
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <RedditCreateCampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
      <RedditPixelModal
        isOpen={isPixelModalOpen}
        onClose={() => setIsPixelModalOpen(false)}
      />
      <RedditAdPreviewModal
        campaign={previewCampaign}
        isOpen={!!previewCampaign}
        onClose={() => setPreviewCampaign(null)}
      />
    </div>
  )
}

export default RedditAdsManagerDashboard
