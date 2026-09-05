'use client'

import React, { useState } from 'react'
import {
  Search,
  Play,
  Pause,
  Trash2,
  Eye,
  Sparkles,
  Smartphone,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  TrendingUp,
  Flame,
  Zap,
  Filter
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  TikTokCampaign,
  useToggleTikTokCampaignStatusMutation,
  useDeleteTikTokCampaignMutation
} from '@/redux/api/tiktokAdsApi'

interface TikTokCampaignsTableProps {
  campaigns: TikTokCampaign[]
  onSelectCampaign?: (campaign: TikTokCampaign) => void
  onPreviewCampaign?: (campaign: TikTokCampaign) => void
}

export const TikTokCampaignsTable: React.FC<TikTokCampaignsTableProps> = ({
  campaigns,
  onSelectCampaign,
  onPreviewCampaign
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [objectiveFilter, setObjectiveFilter] = useState<string>('ALL')

  const [toggleStatus] = useToggleTikTokCampaignStatusMutation()
  const [deleteCampaign] = useDeleteTikTokCampaignMutation()

  const handleToggle = async (c: TikTokCampaign, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await toggleStatus({ id: c.id }).unwrap()
      toast.success(`Campaign "${c.name.slice(0, 20)}..." status updated!`)
    } catch (err) {
      toast.error('Failed to update campaign status.')
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this TikTok campaign?')) {
      try {
        await deleteCampaign(id).unwrap()
        toast.success('TikTok Campaign deleted.')
      } catch (err) {
        toast.error('Failed to delete campaign.')
      }
    }
  }

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creative?.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campaignId.toLowerCase().includes(searchTerm.toLowerCase())

    let matchStatus = true
    if (statusFilter === 'SPARK_ADS') {
      matchStatus = !!c.isSparkAd
    } else if (statusFilter !== 'ALL') {
      matchStatus = c.status === statusFilter
    }

    let matchObjective = true
    if (objectiveFilter !== 'ALL') {
      matchObjective = c.objective === objectiveFilter
    }

    return matchSearch && matchStatus && matchObjective
  })

  const getObjectiveLabel = (obj: string) => {
    switch (obj) {
      case 'PRODUCT_SALES':
        return { label: 'TikTok Shop / Sales', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30' }
      case 'LEAD_GENERATION':
        return { label: 'Instant Lead Form', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' }
      case 'VIDEO_VIEWS':
        return { label: 'Viral Video Views', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' }
      case 'APP_INSTALLS':
        return { label: 'App Promotion', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' }
      case 'TRAFFIC':
        return { label: 'Website Traffic', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' }
      default:
        return { label: obj, color: 'bg-muted text-muted-foreground border-border' }
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
            placeholder="Search TikTok campaigns, hashtags, IDs..."
            className="h-10 rounded-xl pl-9.5 text-xs bg-card/60 backdrop-blur-sm border-border/70 focus:border-[#FE2C55]/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'ALL', label: 'All Campaigns' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'PAUSED', label: 'Paused' },
            { id: 'SPARK_ADS', label: '🎵 Spark Ads' }
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                statusFilter === st.id
                  ? 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white border-transparent shadow-sm shadow-[#FE2C55]/20 font-black'
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
                <th className="py-3.5 px-4 min-w-[240px]">TikTok Campaign & Creative</th>
                <th className="py-3.5 px-4">Objective</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Spend</th>
                <th className="py-3.5 px-4">Video Views</th>
                <th className="py-3.5 px-4">Clicks (CTR)</th>
                <th className="py-3.5 px-4">Conversions (CPA)</th>
                <th className="py-3.5 px-4">ROAS</th>
                <th className="py-3.5 px-4">Engagements</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((c) => {
                const isActive = c.status === 'ACTIVE'
                const objInfo = getObjectiveLabel(c.objective)

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCampaign && onSelectCampaign(c)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    {/* Status toggle pill */}
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
                        title="Click to toggle campaign status"
                      >
                        <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                        <span>{c.status}</span>
                      </button>
                    </td>

                    {/* Campaign details */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-title-color dark:text-white max-w-[220px] truncate">
                            {c.name}
                          </span>
                          {c.isSparkAd && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-extrabold bg-[#25F4EE]/10 text-[#00c8c2] dark:text-[#25F4EE] border-[#25F4EE]/40 flex items-center gap-1">
                              <span>🎵 Spark</span>
                            </Badge>
                          )}
                          {c.isSmartPlus && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-bold bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/30">
                              Smart+
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[260px]">
                          {c.creative?.caption || c.creative?.hook}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                          <span>ID: {c.campaignId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Objective */}
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={cn('text-[10px] font-bold px-2 py-0.5', objInfo.color)}>
                        {objInfo.label}
                      </Badge>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-4 font-mono font-semibold">
                      ${c.budget}/day
                      <div className="text-[10px] text-muted-foreground font-normal">
                        {c.bidType === 'BID_TYPE_COST_CAP' ? `Cap: $${c.targetCpa || 5}` : 'Lowest Cost'}
                      </div>
                    </td>

                    {/* Spend */}
                    <td className="py-4 px-4 font-mono font-bold text-title-color dark:text-white">
                      ${c.insights?.spend ? c.insights.spend.toFixed(2) : '0.00'}
                    </td>

                    {/* Video Views */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {c.insights?.videoViews?.toLocaleString() || 0}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        6s views: {c.insights?.videoViews6s?.toLocaleString() || 0}
                      </div>
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
                    <td className="py-4 px-4 font-mono font-bold text-pink-600 dark:text-pink-400">
                      {c.insights?.roas ? `${c.insights.roas}x` : '—'}
                    </td>

                    {/* Engagements */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5 text-rose-500 font-semibold" title="Likes">
                          <Heart className="w-3 h-3 fill-rose-500/20" />
                          {(c.insights?.likes || 0) > 1000 ? `${((c.insights?.likes || 0) / 1000).toFixed(1)}k` : c.insights?.likes || 0}
                        </span>
                        <span className="flex items-center gap-0.5 text-blue-500 font-semibold" title="Shares">
                          <Share2 className="w-3 h-3" />
                          {c.insights?.shares || 0}
                        </span>
                      </div>
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
                          className="h-8 w-8 p-0 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-500 transition-colors"
                          title="Preview in TikTok Simulator"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
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

export default TikTokCampaignsTable
