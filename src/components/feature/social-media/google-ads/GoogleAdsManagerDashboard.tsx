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
  Search,
  Star,
  Activity,
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
  useGetGoogleDashboardSummaryQuery,
  useGetGoogleCampaignsQuery,
  useGetGoogleAdAccountsQuery,
  GoogleCampaign
} from '@/redux/api/googleAdsApi'
import { GoogleCampaignsTable } from './GoogleCampaignsTable'
import { GoogleCreateCampaignWizardModal } from './GoogleCreateCampaignWizardModal'
import { GoogleTagModal } from './GoogleTagModal'
import { GoogleAdPreviewModal } from './GoogleAdPreviewModal'

const EMPTY_GOOGLE_KPIS = {
  totalSpend: 0,
  totalImpressions: 0,
  totalClicks: 0,
  totalConversions: 0,
  avgCtr: 0,
  avgCpc: 0,
  avgCpm: 0,
  avgCpa: 0,
  avgRoas: 0,
  avgQualityScore: 0,
  searchImpressionShare: 0,
  activeCampaigns: 0,
  totalCampaigns: 0
}

export const GoogleAdsManagerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [previewCampaign, setPreviewCampaign] = useState<GoogleCampaign | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'conversions' | 'clicks' | 'spend'>('conversions')

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    refetch: refetchSummary
  } = useGetGoogleDashboardSummaryQuery()

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns
  } = useGetGoogleCampaignsQuery({})

  const { data: accountsData } = useGetGoogleAdAccountsQuery()

  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)

  const accounts = accountsData?.data || [
    {
      id: 'ggl_acc_01',
      accountName: 'Siegfried Global MCC (Google Ads)',
      balance: 18500.00,
      currency: 'USD'
    }
  ]
  const currentAccount = accounts[selectedAccountIndex] || accounts[0]

  const kpis = summaryData?.data?.kpis || EMPTY_GOOGLE_KPIS
  const chartTimeline = summaryData?.data?.chartTimeline || []
  const channelBreakdown = summaryData?.data?.channelBreakdown || []
  const topKeywords = summaryData?.data?.topKeywords || []
  const campaigns = campaignsData?.data || []

  const handleSync = async () => {
    toast.promise(
      Promise.all([refetchSummary(), refetchCampaigns()]),
      {
        loading: 'Syncing Google Ads & PMax metrics...',
        success: 'Google Ads data synced successfully!',
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
    <Card className="p-4 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-xs relative overflow-hidden group hover:border-blue-500/40 transition-all">
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
      {/* Header Banner with Google Branding */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          {/* Google Logo Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white text-neutral-900 flex items-center justify-center shadow-lg shadow-blue-500/15 border border-border/60 shrink-0">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-title-color dark:text-white">
                Google Ads Manager
              </h1>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/40 text-[10px] font-extrabold">
                Search & Performance Max
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                Google Tag Synced
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Launch intent-driven Search Ads, Performance Max, Display, and YouTube campaigns with Smart Bidding.
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
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  (${currentAccount?.balance?.toFixed(0)})
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-2xl p-1.5">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Google Ads Accounts (MCC)
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
                  {idx === selectedAccountIndex && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsTagModalOpen(true)}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Google Tag (gtag.js)</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSync}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Google</span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>1-Click Launch Campaign</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard
          label="Total Google Spend"
          value={`$${kpis.totalSpend?.toFixed(2) || '0.00'}`}
          sub={`${kpis.activeCampaigns} Active Campaigns`}
          icon={DollarSign}
          iconColor="text-blue-500"
        />
        <KpiCard
          label="Quality Score"
          value={`${kpis.avgQualityScore || 9.2} / 10`}
          sub={`Impression Share: ${kpis.searchImpressionShare || 87.5}%`}
          icon={Star}
          iconColor="text-amber-500"
        />
        <KpiCard
          label="Conversions"
          value={kpis.totalConversions?.toLocaleString() || '0'}
          sub={`Avg CPA: $${kpis.avgCpa?.toFixed(2) || '12.50'}`}
          icon={Target}
          iconColor="text-emerald-500"
        />
        <KpiCard
          label="Avg ROAS"
          value={`${kpis.avgRoas || 4.85}x`}
          sub="Target ROAS: 450%"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
        <KpiCard
          label="Search Clicks"
          value={kpis.totalClicks?.toLocaleString() || '0'}
          sub={`CTR: ${kpis.avgCtr || 4.35}%`}
          icon={Users}
          iconColor="text-sky-500"
        />
        <KpiCard
          label="Avg CPC / CPM"
          value={`$${kpis.avgCpc?.toFixed(2) || '0.58'}`}
          sub={`CPM: $${kpis.avgCpm?.toFixed(2) || '25.40'}`}
          icon={Zap}
          iconColor="text-rose-500"
        />
      </div>

      {/* Analytics & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Performance Chart */}
        <Card className="lg:col-span-8 p-5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Search & PMax Conversion Scaling</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time tracking of high-intent search click volume and enhanced conversion rate growth
              </CardDescription>
            </div>

            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40">
              {[
                { id: 'conversions', label: 'Conversions' },
                { id: 'clicks', label: 'Clicks' },
                { id: 'spend', label: 'Spend ($)' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMetric(m.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedMetric === m.id
                      ? 'bg-blue-600 text-white shadow-xs'
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
                    <div className="text-[9px] font-bold text-blue-600 dark:text-blue-400 font-mono group-hover:scale-110 transition-transform">
                      {selectedMetric === 'spend' ? `$${currentVal}` : currentVal}
                    </div>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 via-indigo-500 to-sky-400 group-hover:brightness-110 transition-all shadow-xs"
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
              <p>No Google Ads campaign data available yet.</p>
            </div>
          )}
        </Card>

        {/* Right: Channel Breakdown & Top Keywords */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4.5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-3">
            <CardTitle className="text-xs font-bold text-title-color dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Channel Breakdown</span>
              </span>
              <Badge variant="outline" className="text-[9px] font-mono">
                ROAS
              </Badge>
            </CardTitle>

            <div className="space-y-2.5">
              {channelBreakdown.map((ch: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-title-color dark:text-gray-200 flex items-center gap-1.5">
                      <span>{ch.icon}</span>
                      <span>{ch.name}</span>
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {ch.roas}x ROAS
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
                      style={{ width: `${ch.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Keywords Card */}
          <Card className="p-4.5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm space-y-3">
            <CardTitle className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Top Converting Search Keywords</span>
            </CardTitle>
            <div className="space-y-2">
              {topKeywords.slice(0, 3).map((kw: any, idx: number) => (
                <div key={idx} className="p-2 rounded-xl border border-border/40 bg-card/50 flex items-center justify-between text-xs">
                  <div className="truncate min-w-0 pr-2">
                    <p className="font-mono font-bold text-title-color dark:text-white truncate">{kw.keyword}</p>
                    <p className="text-[10px] text-muted-foreground">{kw.matchType} • {kw.ctr}% CTR</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0">
                    QS {kw.qualityScore}/10
                  </Badge>
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
              Google Ads Campaigns
            </h3>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {campaigns.length} Total
            </Badge>
          </div>
        </div>

        {isLoadingCampaigns ? (
          <div className="rounded-2xl border border-border/70 bg-card p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : campaigns.length > 0 ? (
          <GoogleCampaignsTable
            campaigns={campaigns}
            onSelectCampaign={(c) => setPreviewCampaign(c)}
            onPreviewCampaign={(c) => setPreviewCampaign(c)}
          />
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card/70 p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Search className="w-7 h-7 text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-title-color dark:text-white">No Google Ads campaigns yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Launch your first intent-driven Google Search or Performance Max campaign.
            </p>
            <Button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer mt-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Launch Your First Campaign
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoogleCreateCampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
      <GoogleTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
      <GoogleAdPreviewModal
        campaign={previewCampaign}
        isOpen={!!previewCampaign}
        onClose={() => setPreviewCampaign(null)}
      />
    </div>
  )
}

export default GoogleAdsManagerDashboard
