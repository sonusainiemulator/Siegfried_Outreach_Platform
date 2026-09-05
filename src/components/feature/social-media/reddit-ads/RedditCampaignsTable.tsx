'use client'

import React, { useState } from 'react'
import {
  Search,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  MessageSquare,
  ArrowBigUp,
  Share2,
  CheckCircle2,
  Flame,
  Globe,
  Sliders
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  RedditCampaign,
  useToggleRedditCampaignStatusMutation,
  useDeleteRedditCampaignMutation
} from '@/redux/api/redditAdsApi'

interface RedditCampaignsTableProps {
  campaigns: RedditCampaign[]
  onSelectCampaign?: (campaign: RedditCampaign) => void
  onPreviewCampaign?: (campaign: RedditCampaign) => void
}

export const RedditCampaignsTable: React.FC<RedditCampaignsTableProps> = ({
  campaigns,
  onSelectCampaign,
  onPreviewCampaign
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const [toggleStatus] = useToggleRedditCampaignStatusMutation()
  const [deleteCampaign] = useDeleteRedditCampaignMutation()

  const handleToggle = async (c: RedditCampaign, e: React.MouseEvent) => {
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
    if (confirm('Are you sure you want to delete this Reddit campaign?')) {
      try {
        await deleteCampaign(id).unwrap()
        toast.success('Reddit campaign deleted.')
      } catch (err) {
        toast.error('Failed to delete campaign.')
      }
    }
  }

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campaignId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creative?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetSubreddits?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4">
      {/* Table Filter Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reddit campaigns, subreddits, titles..."
            className="h-10 rounded-xl pl-9.5 text-xs bg-card/60 backdrop-blur-sm border-border/70 focus:border-[#FF4500]/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'ACTIVE', 'PAUSED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#FF4500] to-[#FF5722] text-white border-transparent shadow-sm shadow-[#FF4500]/20'
                  : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground bg-card/40'
              )}
            >
              {st === 'ALL' ? 'All Campaigns' : st}
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
                <th className="py-3.5 px-4 min-w-[260px]">Reddit Post & Subreddits</th>
                <th className="py-3.5 px-4">Objective</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Spend</th>
                <th className="py-3.5 px-4">Karma / Upvotes</th>
                <th className="py-3.5 px-4">Clicks (CTR)</th>
                <th className="py-3.5 px-4">Conversions (CPA)</th>
                <th className="py-3.5 px-4">ROAS</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((c) => {
                const isActive = c.status === 'ACTIVE'

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCampaign && onSelectCampaign(c)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    {/* Status Pill */}
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
                        title="Click to toggle status"
                      >
                        <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                        <span>{c.status}</span>
                      </button>
                    </td>

                    {/* Campaign details */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-title-color dark:text-white max-w-[240px] truncate">
                            {c.name}
                          </span>
                          {c.creative?.flairText && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/30 font-semibold">
                              {c.creative.flairText}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[280px]">
                          {c.creative?.title}
                        </p>
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {c.targetSubreddits?.slice(0, 3).map((sub) => (
                            <span
                              key={sub}
                              className="px-1.5 py-0.5 rounded-md bg-muted/60 text-[10px] font-mono text-muted-foreground font-semibold"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Objective */}
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-[10px] font-bold bg-background/80">
                        {c.objective}
                      </Badge>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-4 font-mono font-semibold">
                      ${c.dailyBudget}/day
                    </td>

                    {/* Spend */}
                    <td className="py-4 px-4 font-mono font-bold text-title-color dark:text-white">
                      ${c.insights?.spend ? c.insights.spend.toFixed(2) : '0.00'}
                    </td>

                    {/* Upvotes & Comments */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono font-bold text-[#FF4500]">
                          <ArrowBigUp className="w-4 h-4 fill-[#FF4500]" />
                          {c.insights?.upvotes?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-mono">
                          <MessageSquare className="w-3 h-3" />
                          {c.insights?.comments || 0}
                        </span>
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
                    <td className="py-4 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
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
                          className="h-8 w-8 p-0 rounded-lg hover:bg-[#FF4500]/10 hover:text-[#FF4500]"
                          title="Preview Reddit Post Simulator"
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

export default RedditCampaignsTable
