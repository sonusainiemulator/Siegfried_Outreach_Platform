'use client'

import React, { useState } from 'react'
import {
  Search,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Zap,
  Globe,
  Star,
  Layers,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  GoogleCampaign,
  useToggleGoogleCampaignStatusMutation,
  useDeleteGoogleCampaignMutation
} from '@/redux/api/googleAdsApi'

interface GoogleCampaignsTableProps {
  campaigns: GoogleCampaign[]
  onSelectCampaign?: (campaign: GoogleCampaign) => void
  onPreviewCampaign?: (campaign: GoogleCampaign) => void
}

export const GoogleCampaignsTable: React.FC<GoogleCampaignsTableProps> = ({
  campaigns,
  onSelectCampaign,
  onPreviewCampaign
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [channelFilter, setChannelFilter] = useState<string>('ALL')

  const [toggleStatus] = useToggleGoogleCampaignStatusMutation()
  const [deleteCampaign] = useDeleteGoogleCampaignMutation()

  const handleToggle = async (c: GoogleCampaign, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await toggleStatus({ id: c.id }).unwrap()
      toast.success(`Campaign "${c.name.slice(0, 20)}..." status updated!`)
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this Google Ads campaign?')) {
      try {
        await deleteCampaign(id).unwrap()
        toast.success('Google campaign deleted.')
      } catch (err) {
        toast.error('Failed to delete campaign.')
      }
    }
  }

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campaignId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creative?.headlines?.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchChannel = channelFilter === 'ALL' || c.channelType === channelFilter
    return matchSearch && matchChannel
  })

  const getChannelBadge = (type: string) => {
    switch (type) {
      case 'SEARCH':
        return { label: '🔍 Search', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' }
      case 'PERFORMANCE_MAX':
        return { label: '⚡ PMax', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' }
      case 'DISPLAY':
        return { label: '🖼️ Display', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' }
      case 'YOUTUBE_VIDEO':
        return { label: '📺 YouTube', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' }
      default:
        return { label: type, color: 'bg-muted text-muted-foreground border-border' }
    }
  }

  return (
    <div className="space-y-4">
      {/* Table Filter Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns, keywords, headlines..."
            className="h-10 rounded-xl pl-9.5 text-xs bg-card/60 backdrop-blur-sm border-border/70 focus:border-blue-500/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'ALL', label: 'All Channels' },
            { id: 'SEARCH', label: '🔍 Search' },
            { id: 'PERFORMANCE_MAX', label: '⚡ Performance Max' },
            { id: 'DISPLAY', label: 'Display' },
            { id: 'YOUTUBE_VIDEO', label: 'YouTube' }
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setChannelFilter(st.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                channelFilter === st.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground bg-card/40'
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 min-w-[240px]">Google Campaign & Channel</th>
                <th className="py-3.5 px-4">Quality Score</th>
                <th className="py-3.5 px-4">Daily Budget</th>
                <th className="py-3.5 px-4">Spend</th>
                <th className="py-3.5 px-4">Impressions</th>
                <th className="py-3.5 px-4">Clicks (CTR)</th>
                <th className="py-3.5 px-4">Conversions (CPA)</th>
                <th className="py-3.5 px-4">ROAS</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((c) => {
                const isActive = c.status === 'ACTIVE'
                const channelBadge = getChannelBadge(c.channelType)

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCampaign && onSelectCampaign(c)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleToggle(c, e)}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] cursor-pointer transition-all border',
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                        <span>{c.status}</span>
                      </button>
                    </td>

                    {/* Campaign Name & Channel */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-title-color dark:text-white max-w-[220px] truncate">
                            {c.name}
                          </span>
                          <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0 h-4 font-bold', channelBadge.color)}>
                            {channelBadge.label}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[280px]">
                          {c.creative?.headlines?.[0]} • {c.creative?.descriptions?.[0]}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                          <span>ID: {c.campaignId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Quality Score */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                        <span>{c.qualityScore || 9}/10</span>
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-4 font-mono font-semibold">
                      ${c.dailyBudget}/day
                    </td>

                    {/* Spend */}
                    <td className="py-4 px-4 font-mono font-bold text-title-color dark:text-white">
                      ${c.insights?.spend ? c.insights.spend.toFixed(2) : '0.00'}
                    </td>

                    {/* Impressions */}
                    <td className="py-4 px-4 font-mono">
                      {c.insights?.impressions?.toLocaleString() || 0}
                    </td>

                    {/* Clicks (CTR) */}
                    <td className="py-4 px-4 font-mono">
                      <span className="font-bold">{c.insights?.clicks?.toLocaleString() || 0}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">
                        ({c.insights?.ctr || 0}%)
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        CPC: ${c.insights?.cpc ? c.insights.cpc.toFixed(2) : '0.00'}
                      </div>
                    </td>

                    {/* Conversions (CPA) */}
                    <td className="py-4 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {c.insights?.conversions || 0}
                      <div className="text-[10px] text-muted-foreground font-normal">
                        CPA: ${c.insights?.cpa ? c.insights.cpa.toFixed(2) : '0.00'}
                      </div>
                    </td>

                    {/* ROAS */}
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {c.insights?.roas ? `${c.insights.roas}x` : '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onPreviewCampaign && onPreviewCampaign(c)
                          }}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-blue-500/10 hover:text-blue-500"
                          title="Preview in Google SERP Simulator"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleToggle(c, e)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-amber-500/10"
                          title={isActive ? 'Pause Campaign' : 'Resume Campaign'}
                        >
                          {isActive ? (
                            <Pause className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(c.id, e)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GoogleCampaignsTable
