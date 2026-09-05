'use client'

import React, { useState, useMemo } from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Facebook,
  FileCode,
  Filter,
  HelpCircle,
  Info,
  Instagram,
  Linkedin,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Share2,
  ShieldAlert,
  Sparkles,
  Terminal,
  Trash2,
  Video,
  X as XClose,
  XIcon,
  Youtube,
  Zap,
} from 'lucide-react'
import {
  useGetTelemetryLogsQuery,
  useRetrySocialPostMutation,
  useClearTelemetryLogsMutation,
} from '@/redux/api/socialMediaApi'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// Platform Icon Component
const getPlatformIcon = (platform: string, className = 'w-4 h-4') => {
  switch (platform?.toLowerCase()) {
    case 'twitter':
    case 'x':
      return <XIcon className={className} />
    case 'instagram':
      return <Instagram className={className} />
    case 'facebook':
      return <Facebook className={className} />
    case 'youtube':
      return <Youtube className={className} />
    case 'linkedin':
      return <Linkedin className={className} />
    case 'tiktok':
      return <Video className={className} />
    case 'pinterest':
      return <Share2 className={className} />
    case 'reddit':
      return <Activity className={className} />
    case 'wordpress':
      return <Server className={className} />
    default:
      return <Share2 className={className} />
  }
}

// Platform Color Map
const getPlatformColor = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'twitter':
    case 'x':
      return 'bg-black/40 text-neutral-200 border-neutral-700'
    case 'instagram':
      return 'bg-pink-500/15 text-pink-400 border-pink-500/30'
    case 'facebook':
      return 'bg-blue-600/15 text-blue-400 border-blue-500/30'
    case 'youtube':
      return 'bg-red-600/15 text-red-400 border-red-500/30'
    case 'linkedin':
      return 'bg-sky-600/15 text-sky-400 border-sky-500/30'
    case 'tiktok':
      return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
    case 'pinterest':
      return 'bg-rose-600/15 text-rose-400 border-rose-500/30'
    case 'reddit':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    case 'wordpress':
      return 'bg-blue-800/15 text-blue-300 border-blue-700/30'
    default:
      return 'bg-primary/10 text-primary border-primary/20'
  }
}

// Error Category Label & Badge Helper
const getCategoryDetails = (cat: string) => {
  switch (cat) {
    case 'API_CREDITS_DEPLETED':
      return {
        label: 'Credits Depleted',
        color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        icon: AlertTriangle,
      }
    case 'AUTH_TOKEN_EXPIRED':
      return {
        label: 'Auth Expired',
        color: 'bg-red-500/15 text-red-400 border-red-500/30',
        icon: ShieldAlert,
      }
    case 'PERMISSION_DENIED':
      return {
        label: 'Permission Denied',
        color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        icon: AlertCircle,
      }
    case 'RATE_LIMIT_EXCEEDED':
      return {
        label: 'Rate Limited',
        color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        icon: Clock,
      }
    case 'MEDIA_PROCESSING_FAILED':
      return {
        label: 'Media Error',
        color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        icon: Video,
      }
    case 'CONTENT_POLICY_VIOLATION':
      return {
        label: 'Policy Violation',
        color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        icon: ShieldAlert,
      }
    case 'NETWORK_TIMEOUT':
      return {
        label: 'Network Timeout',
        color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        icon: RefreshCw,
      }
    default:
      return {
        label: 'System Error',
        color: 'bg-destructive/15 text-destructive border-destructive/30',
        icon: AlertCircle,
      }
  }
}

export default function PublishingLogsDashboard() {
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedLog, setSelectedLog] = useState<any | null>(null)
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false)
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false)

  // Redux Query
  const { data, isLoading, isFetching, refetch } = useGetTelemetryLogsQuery(
    {
      platform: platformFilter !== 'all' ? platformFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      errorCategory: categoryFilter !== 'all' ? categoryFilter : undefined,
      search: searchTerm.trim() ? searchTerm.trim() : undefined,
      page: currentPage,
      limit: 15,
    },
    {
      pollingInterval: 15000,
    }
  )

  const [retryPost, { isLoading: isRetrying }] = useRetrySocialPostMutation()
  const [clearLogs, { isLoading: isClearing }] = useClearTelemetryLogsMutation()
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false)

  const summary = data?.data?.summary || {
    totalDispatches: 0,
    successCount: 0,
    failureCount: 0,
    successRate: 100,
    avgLatencyMs: 0,
    systemHealth: 'healthy',
    categoryBreakdown: {},
    platformBreakdown: {},
  }

  const logs = data?.data?.logs || []
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 }

  const handleInspect = (log: any) => {
    setSelectedLog(log)
    setIsDiagnosticOpen(true)
    setCopiedRaw(false)
  }

  const handleRetry = async (log: any) => {
    if (!log?.postId) {
      toast.error('Post ID missing for retry')
      return
    }
    try {
      toast.info(`Retrying dispatch for ${log.platform?.toUpperCase()}...`)
      await retryPost({
        id: log.postId?._id || log.postId,
        socialAccountId: log.socialAccountId?._id || log.socialAccountId,
      }).unwrap()
      toast.success(`Retry queued successfully for ${log.postTitle || 'post'}!`)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to retry post')
    }
  }

  const handleClearAllLogs = async () => {
    try {
      await clearLogs().unwrap()
      toast.success('All telemetry logs have been cleared successfully!')
      setIsClearModalOpen(false)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to clear logs')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedRaw(true)
    toast.success('Raw diagnostic payload copied to clipboard')
    setTimeout(() => setCopiedRaw(false), 2000)
  }

  const handleResetFilters = () => {
    setPlatformFilter('all')
    setStatusFilter('all')
    setCategoryFilter('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const platformsList = [
    { key: 'all', label: 'All Platforms' },
    { key: 'twitter', label: 'X (Twitter)' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'pinterest', label: 'Pinterest' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'wordpress', label: 'WordPress' },
  ]

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                Social Publishing Telemetry & Error Logs
              </h1>
              <p className="text-sm text-muted-foreground">
                Deep failure root-cause analysis, API error categorization, and 1-click retry diagnostics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* System Health Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md ${
              summary.systemHealth === 'healthy'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : summary.systemHealth === 'degraded'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                summary.systemHealth === 'healthy'
                  ? 'bg-emerald-400 animate-ping'
                  : summary.systemHealth === 'degraded'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-400 animate-ping'
              }`}
            />
            {summary.systemHealth === 'healthy'
              ? 'All Gateways Healthy'
              : summary.systemHealth === 'degraded'
              ? 'Platform API Degradation'
              : 'Action Required: API Error'}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 border-border/60 hover:bg-muted/50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-primary' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsClearModalOpen(true)}
            className="gap-2 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Logs
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dispatches */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Dispatches</p>
                <h3 className="text-2xl font-black mt-1 tracking-tight">{summary.totalDispatches}</h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {summary.successCount} succeeded
              </span>
              <span>•</span>
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {summary.failureCount} failed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Success Rate</p>
                <h3
                  className={`text-2xl font-black mt-1 tracking-tight ${
                    summary.successRate >= 90
                      ? 'text-emerald-400'
                      : summary.successRate >= 75
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {summary.successRate}%
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  summary.successRate >= 90 ? 'bg-emerald-500' : summary.successRate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, summary.successRate))}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Failures & Root Causes */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Failed Dispatches</p>
                <h3 className="text-2xl font-black mt-1 tracking-tight text-rose-400">{summary.failureCount}</h3>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {summary.failureCount > 0
                ? `${Object.keys(summary.categoryBreakdown || {}).length} error categories diagnosed`
                : 'Zero errors logged in queue'}
            </p>
          </CardContent>
        </Card>

        {/* Average Latency */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Latency</p>
                <h3 className="text-2xl font-black mt-1 tracking-tight">{summary.avgLatencyMs || 340} ms</h3>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-emerald-400 font-medium">Worker queue execution duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health Quick Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
        {Object.entries(summary.platformBreakdown || {}).map(([platKey, stat]: [string, any]) => {
          const isSelected = platformFilter === platKey
          const hasErrors = stat.failed > 0
          return (
            <button
              key={platKey}
              onClick={() => {
                setPlatformFilter(isSelected ? 'all' : platKey)
                setCurrentPage(1)
              }}
              className={`flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                  : 'border-border/40 bg-card/40 hover:bg-muted/40 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg border ${getPlatformColor(platKey)}`}>
                  {getPlatformIcon(platKey, 'w-3.5 h-3.5')}
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    stat.total === 0
                      ? 'bg-neutral-600'
                      : stat.failed === 0
                      ? 'bg-emerald-400'
                      : 'bg-rose-400 animate-pulse'
                  }`}
                />
              </div>
              <div className="w-full text-left">
                <div className="text-xs font-semibold capitalize tracking-tight truncate">{platKey}</div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between mt-0.5">
                  <span>{stat.total} posts</span>
                  <span className={hasErrors ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}>
                    {stat.total > 0 ? `${stat.rate}%` : '—'}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by post title, account, error message, or diagnostic reason..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 bg-background/50 border-border/50 h-9 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <XClose className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Platform Selector */}
              <select
                value={platformFilter}
                onChange={(e) => {
                  setPlatformFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 px-3 rounded-md bg-background/50 border border-border/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {platformsList.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 px-3 rounded-md bg-background/50 border border-border/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="failed">❌ Failed Only</option>
                <option value="success">✅ Success Only</option>
                <option value="retrying">⏳ Retrying</option>
              </select>

              {/* Error Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 px-3 rounded-md bg-background/50 border border-border/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Error Categories</option>
                <option value="API_CREDITS_DEPLETED">💳 API Credits Depleted</option>
                <option value="AUTH_TOKEN_EXPIRED">🔑 Auth Token Expired</option>
                <option value="PERMISSION_DENIED">🚫 Permission Denied</option>
                <option value="RATE_LIMIT_EXCEEDED">⏳ Rate Limit Exceeded</option>
                <option value="MEDIA_PROCESSING_FAILED">🎬 Media Processing Failed</option>
                <option value="CONTENT_POLICY_VIOLATION">⚠️ Policy Violation</option>
                <option value="NETWORK_TIMEOUT">🌐 Network Timeout</option>
                <option value="SYSTEM_ERROR">⚙️ System Error</option>
              </select>

              {/* Reset button if active filters */}
              {(platformFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-9 text-xs gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Dispatch Stream & Diagnostic Records
            </CardTitle>
            <CardDescription className="text-xs">
              Showing {logs.length} of {pagination.total} total logged dispatch events
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-semibold">Time & Post</th>
                <th className="py-3 px-4 font-semibold">Platform & Account</th>
                <th className="py-3 px-4 font-semibold">Origin & Code</th>
                <th className="py-3 px-4 font-semibold">Status & Diagnosis</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                    Loading telemetry audit stream...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <CheckCircle2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-semibold text-base">No publishing logs found</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      No logs match your current filter criteria or no posts have been published yet.
                    </p>
                    {(platformFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm) && (
                      <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4 gap-1.5 text-xs">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Clear Active Filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => {
                  const isSuccess = log.status === 'success'
                  const catDetails = getCategoryDetails(log.errorCategory)
                  const CatIcon = catDetails.icon
                  const formattedDate = log.created_at
                    ? new Date(log.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }) +
                      ' • ' +
                      new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
                    : 'N/A'

                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                      onClick={() => handleInspect(log)}
                    >
                      {/* Time & Post Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 max-w-sm">
                          <span className="truncate">{log.postTitle || 'Untitled Social Post'}</span>
                          {log.postType && (
                            <Badge variant="outline" className="text-[10px] uppercase px-1.5 py-0">
                              {log.postType}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-muted-foreground/60" />
                          <span>{formattedDate}</span>
                          {log.executionDurationMs ? (
                            <>
                              <span>•</span>
                              <span className="text-[11px] font-mono text-muted-foreground/80">
                                {log.executionDurationMs}ms
                              </span>
                            </>
                          ) : null}
                        </div>
                      </td>

                      {/* Platform & Account */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${getPlatformColor(log.platform)}`}>
                            {getPlatformIcon(log.platform, 'w-3.5 h-3.5')}
                          </div>
                          <div>
                            <div className="font-medium text-xs capitalize">{log.platform}</div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                              {log.accountName || '@account'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Error Source & HTTP Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isSuccess ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px]">
                              200 OK
                            </Badge>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-mono font-bold ${
                                  log.errorSource === 'SOCIAL_MEDIA_API'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {log.errorSource === 'SOCIAL_MEDIA_API' ? 'API Error' : 'System Error'}
                              </Badge>
                              {log.httpStatus && (
                                <Badge variant="secondary" className="text-[10px] font-mono">
                                  HTTP {log.httpStatus}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status & Diagnostic Snippet */}
                      <td className="py-3.5 px-4">
                        {isSuccess ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Published
                            </span>
                            {log.postUrl && (
                              <a
                                href={log.postUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                              >
                                View Post <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1 max-w-md">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${catDetails.color}`}
                              >
                                <CatIcon className="w-3 h-3" />
                                {catDetails.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {log.diagnosticReason || log.errorMessage || 'Unknown publishing error'}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleInspect(log)}
                            className="h-7 px-2.5 text-xs font-medium gap-1"
                          >
                            <Info className="w-3 h-3 text-primary" />
                            Inspect
                          </Button>

                          {!isSuccess && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isRetrying}
                              onClick={() => handleRetry(log)}
                              className="h-7 px-2.5 text-xs font-medium gap-1 text-primary border-primary/30 hover:bg-primary/10"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8 px-2.5"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Inspect Diagnostics Modal */}
      <Dialog open={isDiagnosticOpen} onOpenChange={setIsDiagnosticOpen}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-2xl border-border/60 max-h-[90vh] overflow-y-auto">
          {selectedLog && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${getPlatformColor(selectedLog.platform)}`}>
                      {getPlatformIcon(selectedLog.platform, 'w-5 h-5')}
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-bold">
                        {selectedLog.postTitle || 'Social Post Telemetry'}
                      </DialogTitle>
                      <DialogDescription className="text-xs">
                        Target Account: <span className="text-foreground font-medium">{selectedLog.accountName}</span> •{' '}
                        {selectedLog.platform?.toUpperCase()}
                      </DialogDescription>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`px-3 py-1 font-semibold ${
                      selectedLog.status === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {selectedLog.status === 'success' ? 'DISPATCHED' : 'FAILED'}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Status Banner */}
              {selectedLog.status !== 'success' ? (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Failure Diagnosis & Root Cause
                    </div>
                    {selectedLog.httpStatus && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        HTTP {selectedLog.httpStatus}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedLog.diagnosticReason || selectedLog.errorMessage}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <span>Origin:</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {selectedLog.errorSource === 'SOCIAL_MEDIA_API'
                        ? 'Third-Party Social Platform API'
                        : 'Internal Worker System'}
                    </Badge>
                    <span>Category:</span>
                    <Badge variant="outline" className="text-[10px]">
                      {selectedLog.errorCategory}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Published Successfully
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Execution Latency: {selectedLog.executionDurationMs || 0}ms • Published Post ID:{' '}
                    {selectedLog.publishedPostId || 'Verified'}
                  </p>
                  {selectedLog.postUrl && (
                    <a
                      href={selectedLog.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      Open Live Post on {selectedLog.platform} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Step-by-Step Resolution Guide */}
              {selectedLog.status !== 'success' && selectedLog.resolutionSteps && selectedLog.resolutionSteps.length > 0 && (
                <div className="p-4 rounded-xl bg-card border border-border/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Recommended Action Checklist (How to Fix):
                  </div>
                  <div className="space-y-2">
                    {selectedLog.resolutionSteps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                          {index + 1}
                        </div>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON Error Payload Inspector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    Raw Diagnostic Payload
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(selectedLog.rawError || selectedLog.errorMessage || selectedLog, null, 2)
                      )
                    }
                    className="h-7 text-xs gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedRaw ? 'Copied!' : 'Copy JSON'}
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-neutral-950 border border-border/40 font-mono text-[11px] text-neutral-300 max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(selectedLog.rawError || selectedLog.errorMessage || selectedLog, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <Button variant="outline" size="sm" onClick={() => setIsDiagnosticOpen(false)}>
                  Close
                </Button>

                {selectedLog.status !== 'success' && (
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isRetrying}
                    onClick={async () => {
                      await handleRetry(selectedLog)
                      setIsDiagnosticOpen(false)
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retry Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear All Logs Confirmation Modal */}
      <Dialog open={isClearModalOpen} onOpenChange={setIsClearModalOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-destructive/30">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/15 text-destructive border border-destructive/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">Clear All Telemetry Logs?</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  This action will permanently remove all historical dispatch telemetry logs and reset metrics.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-rose-300">
            Are you sure you want to delete all publishing logs? New publishing events will automatically continue to be logged in real-time.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isClearing}
              onClick={handleClearAllLogs}
              className="text-xs gap-1.5 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isClearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Yes, Clear All Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
