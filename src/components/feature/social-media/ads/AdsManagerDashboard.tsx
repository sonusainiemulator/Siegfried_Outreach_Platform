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
  Megaphone,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { useGetMetaDashboardSummaryQuery, useGetMetaCampaignsQuery, MetaCampaign } from '@/redux/api/metaAdsApi'
import { CampaignsTable } from './CampaignsTable'
import { CreateCampaignWizardModal } from './CreateCampaignWizardModal'

const EMPTY_KPI = {
  totalSpend: 0,
  totalImpressions: 0,
  totalReach: 0,
  totalClicks: 0,
  totalLeads: 0,
  avgCtr: 0,
  avgCpc: 0,
  avgCpl: 0,
  avgRoas: 0,
  activeCampaigns: 0,
  totalCampaigns: 0
}

export const AdsManagerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<MetaCampaign | null>(null)

  const { data: summaryData, isLoading: isLoadingSummary, refetch: refetchSummary } = useGetMetaDashboardSummaryQuery()
  const { data: campaignsData, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useGetMetaCampaignsQuery({})

  const kpis = summaryData?.data?.kpis || EMPTY_KPI
  const chartTimeline = summaryData?.data?.chartTimeline || []
  const placementBreakdown = summaryData?.data?.placementBreakdown || []
  const campaigns = campaignsData?.data || []

  const KpiCard = ({ label, value, sub, icon: Icon, iconColor }: any) => (
    <Card className="p-4 rounded-2xl border border-border/60 bg-card shadow-xs">
      {isLoadingSummary ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{label}</span>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="text-lg md:text-xl font-black text-title-color dark:text-white font-mono">
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
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1877F2] via-[#833ab4] to-[#fd1d1d] text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-title-color dark:text-white">
                Meta Ads Manager
              </h1>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-pink-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-bold">
                Facebook & Instagram
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Launch, manage, and scale AI-optimized ad campaigns across Facebook Feeds, Instagram Reels, and Stories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              refetchSummary()
              refetchCampaigns()
            }}
            className="h-10 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Meta Data</span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>1-Click Launch Campaign</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard label="Total Ad Spend" value={`$${kpis.totalSpend?.toFixed(2) || '0.00'}`} sub={`${kpis.activeCampaigns} Active Campaigns`} icon={DollarSign} iconColor="text-blue-500" />
        <KpiCard label="Total Leads" value={kpis.totalLeads} sub={`Avg CPL: $${kpis.avgCpl?.toFixed(2) || '0.00'}`} icon={Target} iconColor="text-emerald-500" />
        <KpiCard label="ROAS" value={`${kpis.avgRoas || 0}x`} sub="Return on Ad Spend" icon={TrendingUp} iconColor="text-purple-500" />
        <KpiCard label="Impressions" value={kpis.totalImpressions?.toLocaleString() || 0} sub={`Reach: ${kpis.totalReach?.toLocaleString() || 0}`} icon={Eye} iconColor="text-sky-500" />
        <KpiCard label="Link Clicks" value={kpis.totalClicks?.toLocaleString() || 0} sub={`CTR: ${kpis.avgCtr || 0}%`} icon={Users} iconColor="text-amber-500" />
        <KpiCard label="Avg CPC" value={`$${kpis.avgCpc?.toFixed(2) || '0.00'}`} sub="Cost per Click" icon={Zap} iconColor="text-rose-500" />
      </div>

      {/* Analytics & Placement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Performance Chart */}
        <Card className="lg:col-span-8 p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Performance & Conversion Acceleration</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time tracking of spend scaling vs lead conversion growth
              </CardDescription>
            </div>
          </div>

          {isLoadingSummary ? (
            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40 pb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <Skeleton className="w-full rounded-t-lg" style={{ height: `${20 + Math.random() * 60}%` }} />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          ) : chartTimeline.length > 0 ? (
            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40 border-b border-border/30 pb-2">
              {chartTimeline.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {item.leads} leads
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-purple-500 transition-all shadow-xs"
                    style={{ height: `${Math.max(20, (item.leads / Math.max(...chartTimeline.map((t: any) => t.leads), 1)) * 100)}%` }}
                  />
                  <div className="text-[10px] font-semibold text-muted-foreground">{item.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-xs gap-2">
              <AlertCircle className="w-8 h-8 text-muted-foreground/40" />
              <p>No performance data yet. Launch your first campaign to see analytics.</p>
            </div>
          )}
        </Card>

        {/* Right: Placement Distribution */}
        <Card className="lg:col-span-4 p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-4">
          <CardTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <span>Placement Distribution</span>
          </CardTitle>

          {isLoadingSummary ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : placementBreakdown.length > 0 ? (
            <div className="space-y-3">
              {placementBreakdown.map((pl: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-title-color dark:text-gray-200 flex items-center gap-1.5">
                      <span>{pl.icon}</span>
                      <span>{pl.name}</span>
                    </span>
                    <span className="font-mono font-bold text-primary">{pl.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${pl.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-xs gap-2">
              <AlertCircle className="w-6 h-6 text-muted-foreground/40" />
              <p>No placement data available yet.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Campaigns Management Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-title-color dark:text-white">
            Ad Campaigns
          </h3>
          <span className="text-xs text-muted-foreground">
            {campaigns.length} Total Campaigns
          </span>
        </div>

        {isLoadingCampaigns ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : campaigns.length > 0 ? (
          <CampaignsTable
            campaigns={campaigns}
            onSelectCampaign={(c) => setSelectedCampaign(c)}
          />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <Megaphone className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h4 className="text-sm font-bold text-title-color dark:text-white">No campaigns yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Connect your Meta Ad Account and launch your first campaign to start driving leads, traffic, and conversions.
            </p>
            <Button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold cursor-pointer mt-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Launch Your First Campaign
            </Button>
          </div>
        )}
      </div>

      {/* 1-Click Launch Wizard Modal */}
      <CreateCampaignWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  )
}

export default AdsManagerDashboard
