'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import {
  RefreshCw,
  Plus,
  Upload,
  Search,
  Database,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import {
  useGetRawDataQuery,
  useAddRawDataMutation,
  useImportRawDataMutation,
  useSyncPlatformAnalyticsMutation,
} from '@/redux/api/socialAnalyticsApi'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface RawDataTabProps {
  targetUserId?: string
}

export const RawDataManagementTab: React.FC<RawDataTabProps> = ({ targetUserId }) => {
  const [activePlatform, setActivePlatform] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 15

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  // Add Record Form State
  const [formPlatform, setFormPlatform] = useState('facebook')
  const [accountName, setAccountName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [metricType, setMetricType] = useState('daily_summary')
  const [metrics, setMetrics] = useState({
    impressions: 1200,
    reach: 950,
    engagements: 140,
    reactions: 85,
    comments: 22,
    shares: 15,
    clicks: 34,
    views: 850,
    followers: 4500,
  })

  // Import Form State
  const [importJson, setImportJson] = useState('')

  // Queries & Mutations
  const { data: rawResp, isLoading, refetch } = useGetRawDataQuery({
    platform: activePlatform,
    search: search || undefined,
    page,
    limit,
    targetUserId: targetUserId === 'all' ? undefined : targetUserId,
  })

  const [addRawData, { isLoading: isAdding }] = useAddRawDataMutation()
  const [importRawData, { isLoading: isImporting }] = useImportRawDataMutation()
  const [syncPlatform, { isLoading: isSyncing }] = useSyncPlatformAnalyticsMutation()

  const records = rawResp?.data || []
  const pagination = rawResp?.pagination || { total: 0, page: 1, limit, pages: 1 }

  // Handlers
  const handleSync = async () => {
    const plat = activePlatform === 'all' ? 'overview' : activePlatform
    try {
      const res = await syncPlatform({ platform: plat }).unwrap()
      toast.success(res.message || `${plat.toUpperCase()} analytics synchronized!`)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Sync failed')
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addRawData({
        platform: formPlatform,
        accountName: accountName || `${formPlatform.toUpperCase()} Account`,
        date,
        metricType,
        metrics,
        source: 'manual',
      }).unwrap()
      toast.success('Raw data record added successfully!')
      setIsAddOpen(false)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add record')
    }
  }

  const handleImportSubmit = async () => {
    try {
      let parsed = []
      if (importJson.trim().startsWith('[')) {
        parsed = JSON.parse(importJson)
      } else {
        // Simple CSV parse
        const lines = importJson.trim().split('\n')
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
        parsed = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.trim())
          const obj: any = {}
          headers.forEach((h, idx) => {
            obj[h] = vals[idx]
          })
          return obj
        })
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        toast.error('Invalid format: Please provide an array of objects or CSV text.')
        return
      }

      const res = await importRawData({
        platform: activePlatform === 'all' ? 'facebook' : activePlatform,
        records: parsed,
      }).unwrap()

      toast.success(res.message || `Successfully imported ${parsed.length} records!`)
      setIsImportOpen(false)
      setImportJson('')
      refetch()
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || 'Import failed. Check format.')
    }
  }

  const sampleJson = `[
  { "accountName": "Main Page", "impressions": 3400, "engagements": 290, "likes": 180, "comments": 45, "shares": 22 },
  { "accountName": "Brand Campaign", "impressions": 8900, "engagements": 620, "likes": 410, "comments": 88, "shares": 54 }
]`

  const platformsList = [
    { key: 'all', label: 'All Platforms' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'twitter', label: 'X (Twitter)' },
    { key: 'youtube', label: 'YouTube' },
  ]

  const getPlatformBadge = (plat: string) => {
    switch (plat?.toLowerCase()) {
      case 'facebook':
        return <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Facebook</Badge>
      case 'instagram':
        return <Badge className="bg-pink-600/20 text-pink-400 border-pink-500/30">Instagram</Badge>
      case 'tiktok':
        return <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30">TikTok</Badge>
      case 'twitter':
        return <Badge className="bg-sky-600/20 text-sky-400 border-sky-500/30">X (Twitter)</Badge>
      case 'youtube':
        return <Badge className="bg-red-600/20 text-red-400 border-red-500/30">YouTube</Badge>
      default:
        return <Badge variant="secondary">{plat || 'General'}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Platform Tabs & Toolbar */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Platform Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-background/50 rounded-xl border border-border/40">
            {platformsList.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  setActivePlatform(p.key)
                  setPage(1)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                  activePlatform === p.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="rounded-xl border-border/50 bg-background/50 text-xs font-semibold hover:border-primary/50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5 text-primary', isSyncing && 'animate-spin')} />
              {isSyncing ? 'Synchronizing...' : 'Sync Live Data'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="rounded-xl border-border/50 bg-background/50 text-xs font-semibold hover:border-emerald-500/50"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Import CSV / JSON
            </Button>

            <Button
              size="sm"
              onClick={() => setIsAddOpen(true)}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Record
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search account, metric type, or source..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9 h-8 text-xs bg-background/40 rounded-xl border-border/40"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{records.length}</strong> of{' '}
            <strong className="text-foreground">{pagination.total}</strong> records
          </span>
        </div>
      </Card>

      {/* Raw Data Table */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b border-border/30">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Metric Type</th>
                <th className="py-3 px-4 text-right">Impressions / Views</th>
                <th className="py-3 px-4 text-right">Engagements / Likes</th>
                <th className="py-3 px-4 text-right">Comments</th>
                <th className="py-3 px-4 text-right">Shares</th>
                <th className="py-3 px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2 text-primary" />
                    Loading raw metric logs...
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((r: any) => (
                  <tr key={r._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{getPlatformBadge(r.platform)}</td>
                    <td className="py-3 px-4 font-medium text-foreground max-w-[180px] truncate">
                      {r.accountName || 'Social Account'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {r.metricType?.replace('_', ' ') || 'Daily'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-foreground">
                      {(r.metrics?.impressions || r.metrics?.views || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-pink-400">
                      {(r.metrics?.engagements || r.metrics?.reactions || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sky-400">
                      {(r.metrics?.comments || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      {(r.metrics?.shares || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] uppercase font-mono',
                          r.source === 'api_sync' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                          r.source === 'csv_import' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                          r.source === 'manual' && 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        )}
                      >
                        {r.source || 'manual'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                    <Database className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
                    No raw metrics records found. Use "Sync Live Data" or "Add Record" to start logging.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.pages > 1 && (
          <div className="p-3 border-t border-border/30 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 w-7 p-0 rounded-lg"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="h-7 w-7 p-0 rounded-lg"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add Record Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Add Raw Metric Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Manually insert raw social media performance records into your database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Platform</Label>
                <select
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value)}
                  className="w-full h-9 rounded-xl bg-background border border-border/50 px-3 text-xs text-foreground"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">X (Twitter)</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Account Name</Label>
              <Input
                placeholder="e.g. Siegfried Official Outreach"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Impressions</Label>
                <Input
                  type="number"
                  value={metrics.impressions}
                  onChange={(e) => setMetrics({ ...metrics, impressions: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Engagements</Label>
                <Input
                  type="number"
                  value={metrics.engagements}
                  onChange={(e) => setMetrics({ ...metrics, engagements: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Reactions / Likes</Label>
                <Input
                  type="number"
                  value={metrics.reactions}
                  onChange={(e) => setMetrics({ ...metrics, reactions: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Comments</Label>
                <Input
                  type="number"
                  value={metrics.comments}
                  onChange={(e) => setMetrics({ ...metrics, comments: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Shares</Label>
                <Input
                  type="number"
                  value={metrics.shares}
                  onChange={(e) => setMetrics({ ...metrics, shares: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Clicks</Label>
                <Input
                  type="number"
                  value={metrics.clicks}
                  onChange={(e) => setMetrics({ ...metrics, clicks: Number(e.target.value) })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isAdding} className="rounded-xl text-xs">
                {isAdding ? 'Saving...' : 'Save Record'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-lg rounded-2xl bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" /> Import Raw Analytics Data
            </DialogTitle>
            <DialogDescription className="text-xs">
              Batch import CSV or JSON array records into your social analytics pipeline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Paste JSON Array or CSV Text</Label>
              <button
                type="button"
                onClick={() => setImportJson(sampleJson)}
                className="text-[11px] text-primary hover:underline"
              >
                Load Sample JSON
              </button>
            </div>

            <Textarea
              placeholder={`[{"accountName": "Page 1", "impressions": 1200, "engagements": 90, "likes": 50}]`}
              rows={8}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="font-mono text-xs bg-background/50 rounded-xl"
            />

            <div className="text-[11px] text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/30 space-y-1">
              <div className="font-semibold text-foreground">Supported JSON fields:</div>
              <p>accountName, impressions, reach, engagements, likes/reactions, comments, shares, clicks, views</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleImportSubmit}
              disabled={isImporting || !importJson.trim()}
              className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isImporting ? 'Importing...' : 'Start Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
