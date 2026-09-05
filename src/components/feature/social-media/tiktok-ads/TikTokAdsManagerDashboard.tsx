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
  Sparkles,
  Smartphone,
  Heart,
  Share2,
  Activity,
  Flame,
  ShoppingBag,
  Sliders,
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
  useGetTikTokDashboardSummaryQuery,
  useGetTikTokCampaignsQuery,
  useGetTikTokAdAccountsQuery,
  TikTokCampaign
} from '@/redux/api/tiktokAdsApi'
import { TikTokCampaignsTable } from './TikTokCampaignsTable'
import { TikTokCreateCampaignWizardModal } from './TikTokCreateCampaignWizardModal'
import { TikTokPixelModal } from './TikTokPixelModal'
import { TikTokAdPreviewModal } from './TikTokAdPreviewModal'

const EMPTY_TIKTOK_KPIS = {
  totalSpend: 0,
  totalVideoViews: 0,
  totalViews2s: 0,
  totalViews6s: 0,
  totalConversions: 0,
  totalClicks: 0,
  totalImpressions: 0,
  avgCtr: 0,
  avgCpc: 0,
  avgCpm: 0,
  avgCpa: 0,
  avgRoas: 0,
  totalLikes: 0,
  totalShares: 0,
  activeCampaigns: 0,
  totalCampaigns: 0
}

export const TikTokAdsManagerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false)
  const [previewCampaign, setPreviewCampaign] = useState<TikTokCampaign | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'videoViews' | 'conversions' | 'spend'>('videoViews')

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    refetch: refetchSummary
  } = useGetTikTokDashboardSummaryQuery()

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns
  } = useGetTikTokCampaignsQuery({})

  const { data: accountsData } = useGetTikTokAdAccountsQuery()

  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)

  const accounts = accountsData?.data || [
    {
      id: 'tt_acc_01',
      accountName: 'Siegfried Global Marketing (TikTok Business)',
      balance: 14850.00,
      currency: 'USD'
    }
  ]
  const currentAccount = accounts[selectedAccountIndex] || accounts[0]

  const kpis = summaryData?.data?.kpis || EMPTY_TIKTOK_KPIS
  const chartTimeline = summaryData?.data?.chartTimeline || []
  const placementBreakdown = summaryData?.data?.placementBreakdown || []
  const demographics = summaryData?.data?.demographics || []
  const topCreatives = summaryData?.data?.topCreatives || []
  const campaigns = campaignsData?.data || []

  const handleSync = async () => {
    toast.promise(
      Promise.all([refetchSummary(), refetchCampaigns()]),
      {
        loading: 'Syncing real-time TikTok Ads & Spark metrics...',
        success: 'TikTok Ads data synced successfully!',
        error: 'Failed to sync data'
      }
    )
  }

  const KpiCard = ({
    label,
    value,
    sub,
    icon: Icon,
    iconColor,
    glowColor
  }: {
    label: string
    value: string | number
    sub: string
    icon: any
    iconColor: string
    glowColor?: string
  }) => (
    <Card className="p-4 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-xs relative overflow-hidden group hover:border-[#FE2C55]/40 transition-all">
      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full opacity-10 blur-xl ${glowColor || 'bg-[#FE2C55]'}`} />
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
      {/* Header Banner with TikTok Cyan & Pink Branding */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          {/* TikTok Animated Glowing Brand Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#000000] via-[#FE2C55] to-[#25F4EE] text-white flex items-center justify-center shadow-lg shadow-[#FE2C55]/25 border border-white/20 shrink-0">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-title-color dark:text-white">
                TikTok Ads Manager
              </h1>
              <Badge variant="outline" className="bg-gradient-to-r from-[#FE2C55]/15 to-[#25F4EE]/15 text-[#FE2C55] dark:text-[#25F4EE] border-[#FE2C55]/40 text-[10px] font-extrabold">
                Spark Ads & TikTok Shop
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                Smart+ AI Engine
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automate viral video hooks, creator Spark Ads, and high-converting TikTok Shop campaigns.
            </p>
          </div>
        </div>

        {/* Action Controls & Account Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Ad Account Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl text-xs font-semibold gap-2 border-border/70 bg-card/60 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[160px] truncate">{currentAccount?.accountName}</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                  (${currentAccount?.balance?.toFixed(0)})
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-2xl p-1.5">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Connected TikTok Business Accounts
              </div>
              {accounts.map((acc: any, idx: number) => (
                <DropdownMenuItem
                  key={acc.id}
                  onClick={() => setSelectedAccountIndex(idx)}
                  className="rounded-xl flex items-center justify-between p-2.5 cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-title-color dark:text-white truncate">
                      {acc.accountName}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Balance: ${acc.balance?.toFixed(2)} USD
                    </p>
                  </div>
                  {idx === selectedAccountIndex && (
                    <CheckCircle2 className="w-4 h-4 text-[#25F4EE] shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* TikTok Pixel Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPixelModalOpen(true)}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pixel & Events</span>
          </Button>

          {/* Sync Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSync}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync TikTok</span>
          </Button>

          {/* 1-Click Launch Wizard CTA */}
          <Button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#FE2C55] via-rose-500 to-[#25F4EE] text-white font-black text-xs shadow-lg shadow-[#FE2C55]/25 flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>1-Click Launch Campaign</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard
          label="Total TikTok Spend"
          value={`$${kpis.totalSpend?.toFixed(2) || '0.00'}`}
          sub={`${kpis.activeCampaigns} Active Campaigns`}
          icon={DollarSign}
          iconColor="text-rose-500"
          glowColor="bg-rose-500"
        />
        <KpiCard
          label="Video Views"
          value={kpis.totalVideoViews?.toLocaleString() || '0'}
          sub={`6s views: ${kpis.totalViews6s?.toLocaleString() || '0'}`}
          icon={Flame}
          iconColor="text-[#25F4EE]"
          glowColor="bg-[#25F4EE]"
        />
        <KpiCard
          label="Conversions / Orders"
          value={kpis.totalConversions?.toLocaleString() || '0'}
          sub={`Avg CPA: $${kpis.avgCpa?.toFixed(2) || '0.00'}`}
          icon={Target}
          iconColor="text-emerald-500"
          glowColor="bg-emerald-500"
        />
        <KpiCard
          label="Avg ROAS"
          value={`${kpis.avgRoas || 4.15}x`}
          sub="Return on Ad Spend"
          icon={TrendingUp}
          iconColor="text-pink-500"
          glowColor="bg-pink-500"
        />
        <KpiCard
          label="Viral Engagements"
          value={`${((kpis.totalLikes + kpis.totalShares) / 1000).toFixed(1)}k`}
          sub={`Likes: ${(kpis.totalLikes / 1000).toFixed(1)}k • Shares: ${kpis.totalShares}`}
          icon={Heart}
          iconColor="text-rose-500"
          glowColor="bg-rose-500"
        />
        <KpiCard
          label="Avg CPC / CPM"
          value={`$${kpis.avgCpc?.toFixed(2) || '0.12'}`}
          sub={`CPM: $${kpis.avgCpm?.toFixed(2) || '3.85'}`}
          icon={Zap}
          iconColor="text-amber-500"
          glowColor="bg-amber-500"
        />
      </div>

      {/* Analytics & Placement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Performance & Acceleration Chart */}
        <Card className="lg:col-span-8 p-5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FE2C55]" />
                <span>TikTok Video & Conversion Acceleration</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Tracking viral video view completion rates, spend scaling, and TikTok Shop conversions
              </CardDescription>
            </div>

            {/* Metric Switcher Pills */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40">
              {[
                { id: 'videoViews', label: 'Video Views' },
                { id: 'conversions', label: 'Conversions' },
                { id: 'spend', label: 'Spend ($)' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMetric(m.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedMetric === m.id
                      ? 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white shadow-xs'
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
                    <div className="text-[9px] font-bold text-[#25F4EE] dark:text-[#25F4EE] font-mono group-hover:scale-110 transition-transform">
                      {selectedMetric === 'spend'
                        ? `$${currentVal}`
                        : currentVal > 1000
                          ? `${(currentVal / 1000).toFixed(1)}k`
                          : currentVal}
                    </div>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#FE2C55] via-pink-500 to-[#25F4EE] group-hover:brightness-125 transition-all shadow-xs"
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
              <p>No TikTok campaign data yet. Launch your first campaign to see analytics.</p>
            </div>
          )}
        </Card>

        {/* Right: Placements & Demographics */}
        <div className="lg:col-span-4 space-y-4">
          {/* Placement Distribution */}
          <Card className="p-4.5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-3">
            <CardTitle className="text-xs font-bold text-title-color dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#25F4EE]" />
                <span>Placement Distribution</span>
              </span>
              <Badge variant="outline" className="text-[9px] font-mono">
                Real-Time
              </Badge>
            </CardTitle>

            <div className="space-y-2.5">
              {placementBreakdown.map((pl: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-title-color dark:text-gray-200 flex items-center gap-1.5">
                      <span>{pl.icon}</span>
                      <span>{pl.name}</span>
                    </span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {pl.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FE2C55] to-[#25F4EE]"
                      style={{ width: `${pl.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Demographics Card */}
          <Card className="p-4.5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-3">
            <CardTitle className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-pink-500" />
              <span>Age Group Engagement (CTR)</span>
            </CardTitle>
            <div className="grid grid-cols-2 gap-2">
              {demographics.map((dm: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-border/40 bg-card/50 flex flex-col justify-between"
                >
                  <span className="text-[11px] font-semibold text-muted-foreground">{dm.ageGroup}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold font-mono text-title-color dark:text-white">
                      {dm.percentage}%
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {dm.ctr}% CTR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Campaigns Management Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-title-color dark:text-white">
              TikTok Ad Campaigns
            </h3>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {campaigns.length} Total
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Advantage Smart+ Creative & Spark Ads Delivery
          </span>
        </div>

        {isLoadingCampaigns ? (
          <div className="rounded-2xl border border-border/70 bg-card p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#FE2C55]" />
          </div>
        ) : campaigns.length > 0 ? (
          <TikTokCampaignsTable
            campaigns={campaigns}
            onSelectCampaign={(c) => setPreviewCampaign(c)}
            onPreviewCampaign={(c) => setPreviewCampaign(c)}
          />
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FE2C55]/15 to-[#25F4EE]/15 flex items-center justify-center">
              <Flame className="w-7 h-7 text-[#FE2C55]" />
            </div>
            <h4 className="text-sm font-bold text-title-color dark:text-white">
              No TikTok Campaigns yet
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Launch your first AI-optimized TikTok campaign or Spark Ad to start driving millions of video views, leads, and store purchases.
            </p>
            <Button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white text-xs font-bold cursor-pointer mt-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Launch Your First Campaign
            </Button>
          </div>
        )}
      </div>

      {/* 1-Click Launch Wizard Modal */}
      <TikTokCreateCampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      {/* Pixel Events Manager Modal */}
      <TikTokPixelModal
        isOpen={isPixelModalOpen}
        onClose={() => setIsPixelModalOpen(false)}
      />

      {/* Live Ad Simulator Preview Modal */}
      <TikTokAdPreviewModal
        campaign={previewCampaign}
        isOpen={!!previewCampaign}
        onClose={() => setPreviewCampaign(null)}
      />
    </div>
  )
}

export default TikTokAdsManagerDashboard
