'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  Facebook,
  Instagram,
  Youtube,
  Database,
  Settings,
  ChevronDown,
  Building2,
  Sparkles,
} from 'lucide-react'
import {
  useGetOverviewAnalyticsQuery,
  useGetPlatformAnalyticsQuery,
  useGetAnalyticsWorkspacesQuery,
  useSyncPlatformAnalyticsMutation,
} from '@/redux/api/socialAnalyticsApi'
import {
  useGetSocialAccountsQuery,
  useGetSocialPostsQuery,
  useGetDashboardDataQuery,
} from '@/redux/api/socialMediaApi'
import { OverviewTab } from './components/OverviewTab'
import { FacebookAnalyticsTab } from './components/FacebookAnalyticsTab'
import { InstagramAnalyticsTab } from './components/InstagramAnalyticsTab'
import { TikTokAnalyticsTab } from './components/TikTokAnalyticsTab'
import { XAnalyticsTab } from './components/XAnalyticsTab'
import { YouTubeAnalyticsTab } from './components/YouTubeAnalyticsTab'
import { RawDataManagementTab } from './components/RawDataManagementTab'
import { AnalyticsSettingsTab } from './components/AnalyticsSettingsTab'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Custom TikTok & X (Twitter) Icons
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.37a6.33 6.33 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.5a8.28 8.28 0 0 0 4.84 1.55v-3.36a4.85 4.85 0 0 1-1.07 0z" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export const AdvancedSocialAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [timeframe, setTimeframe] = useState<string>('30d')
  const [targetWorkspace, setTargetWorkspace] = useState<string>('all')

  // Workspaces query
  const { data: workspacesData } = useGetAnalyticsWorkspacesQuery()
  const workspaces = workspacesData?.workspaces || []

  // Overview Analytics REST query
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useGetOverviewAnalyticsQuery(
    { targetUserId: targetWorkspace === 'all' ? undefined : targetWorkspace, timeframe },
    { skip: activeTab !== 'overview' }
  )

  // Platform Analytics REST query
  const isPlatformTab = ['facebook', 'instagram', 'tiktok', 'twitter', 'youtube'].includes(activeTab)
  const {
    data: platformData,
    isLoading: isPlatformLoading,
    refetch: refetchPlatform,
  } = useGetPlatformAnalyticsQuery(
    {
      platform: isPlatformTab ? activeTab : 'facebook',
      targetUserId: targetWorkspace === 'all' ? undefined : targetWorkspace,
      timeframe,
    },
    { skip: !isPlatformTab }
  )

  // Real Social Accounts & Posts REST Queries
  const { data: accountsData, refetch: refetchAccounts } = useGetSocialAccountsQuery(undefined)
  const { data: postsData, refetch: refetchPosts } = useGetSocialPostsQuery({ limit: 200 })
  const { data: dashboardData } = useGetDashboardDataQuery(undefined)

  const [syncPlatform, { isLoading: isSyncing }] = useSyncPlatformAnalyticsMutation()

  // Live Sync Handler
  const handleSyncAll = async () => {
    try {
      const targetPlat = isPlatformTab ? activeTab : 'overview'
      const res = await syncPlatform({ platform: targetPlat }).unwrap()
      toast.success(res.message || 'Live analytics synchronized successfully!')
      refetchOverview()
      refetchPlatform()
      refetchAccounts()
      refetchPosts()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Sync failed')
    }
  }

  const handleExport = () => {
    toast.info('Generating PDF / CSV analytics export report...')
    setTimeout(() => {
      window.print()
    }, 400)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-primary' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'tiktok', label: 'TikTok', icon: TikTokIcon, color: 'text-cyan-400' },
    { id: 'twitter', label: 'X (Twitter)', icon: XIcon, color: 'text-sky-400' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'raw_data', label: 'Raw Data Pipeline', icon: Database, color: 'text-emerald-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-400' },
  ]

  // Merge real data
  const realOverview = overviewData?.data || {
    summary: {
      totalPosts: dashboardData?.totalPosts || 0,
      postsPublished: dashboardData?.totalPublished || 0,
      totalReactions: 0,
      totalShares: 0,
      totalComments: 0,
      totalViews: 0,
      totalEngagements: 0,
      engagementRate: '0.0%',
    },
    dailyPostImpressionTrend: [],
    accountPerformance: (accountsData?.data || accountsData || []).map((a: any) => ({
      id: a._id || a.id,
      accountName: a.accountName,
      platform: a.platform,
      followers: a.followersCount || 0,
      growth: '+0.0%',
      impressions: 0,
      engagements: 0,
      engagementRate: '0.0%',
      status: a.isActive ? 'Active' : 'Disconnected',
    })),
    platformEngagement: {},
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <Card className="rounded-3xl border-border/40 bg-gradient-to-br from-card/80 via-card/50 to-background/90 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title & Badge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs px-2.5 py-0.5 font-semibold">
                <Sparkles className="w-3 h-3 mr-1 animate-pulse" /> Live Telemetry Analytics
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs font-mono">
                100% Real REST API Data
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground">
              Social Media Analytics
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Live multi-platform metrics, post engagement telemetry, audience demographics, and raw data pipeline computed from your connected social channels.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Workspace Selector (Admin & Multi-Account) */}
            {workspaces.length > 0 && (
              <div className="flex items-center gap-2 bg-background/60 border border-border/50 rounded-2xl px-3 py-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={targetWorkspace}
                  onChange={(e) => setTargetWorkspace(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer max-w-[200px] truncate"
                >
                  {workspaces.map((w: any) => (
                    <option key={w.id} value={w.id} className="bg-card text-foreground">
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Timeframe Selector */}
            <div className="flex items-center p-1 bg-background/60 border border-border/50 rounded-2xl">
              {['7d', '30d', '90d', '1y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-bold rounded-xl uppercase transition-all duration-150',
                    timeframe === tf
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Live Sync Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="rounded-2xl border-border/50 bg-background/60 text-xs font-semibold hover:border-primary/50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5 text-primary', isSyncing && 'animate-spin')} />
              {isSyncing ? 'Syncing...' : 'Sync Live'}
            </Button>

            {/* Export Button */}
            <Button
              size="sm"
              onClick={handleExport}
              className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-6 pt-5 border-t border-border/30 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-card text-foreground shadow-md border border-border/60 scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                )}
              >
                <Icon className={cn('w-4 h-4', tab.color)} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Main Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'overview' && (
          <OverviewTab
            data={realOverview}
            isLoading={isOverviewLoading}
            onSelectPlatform={(plat) => setActiveTab(plat)}
          />
        )}

        {activeTab === 'facebook' && (
          <FacebookAnalyticsTab data={platformData?.data} isLoading={isPlatformLoading} />
        )}

        {activeTab === 'instagram' && (
          <InstagramAnalyticsTab data={platformData?.data} isLoading={isPlatformLoading} />
        )}

        {activeTab === 'tiktok' && (
          <TikTokAnalyticsTab data={platformData?.data} isLoading={isPlatformLoading} />
        )}

        {activeTab === 'twitter' && (
          <XAnalyticsTab data={platformData?.data} isLoading={isPlatformLoading} />
        )}

        {activeTab === 'youtube' && (
          <YouTubeAnalyticsTab data={platformData?.data} isLoading={isPlatformLoading} />
        )}

        {activeTab === 'raw_data' && (
          <RawDataManagementTab targetUserId={targetWorkspace} />
        )}

        {activeTab === 'settings' && <AnalyticsSettingsTab />}
      </div>
    </div>
  )
}

export default AdvancedSocialAnalytics
