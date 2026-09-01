'use client'

import React, { useState } from 'react'
import {
  Search,
  Play,
  Pause,
  Trash2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { MetaCampaign, useToggleCampaignStatusMutation, useDeleteMetaCampaignMutation } from '@/redux/api/metaAdsApi'

interface CampaignsTableProps {
  campaigns: MetaCampaign[]
  onSelectCampaign?: (campaign: MetaCampaign) => void
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns, onSelectCampaign }) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const [toggleStatus] = useToggleCampaignStatusMutation()
  const [deleteCampaign] = useDeleteMetaCampaignMutation()

  const handleToggle = async (c: MetaCampaign, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await toggleStatus({ id: c.id }).unwrap()
      toast.success('Campaign status updated!')
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id).unwrap()
        toast.success('Campaign deleted.')
      } catch (err) {
        toast.error('Failed to delete campaign.')
      }
    }
  }

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4">
      {/* Table Filter Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns..."
            className="h-10 rounded-xl pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'ACTIVE', 'PAUSED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                statusFilter === st
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'border-border/40 hover:border-border text-muted-foreground hover:text-foreground bg-background/50'
              )}
            >
              {st === 'ALL' ? 'All Campaigns' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Objective</th>
                <th className="py-3 px-4">Daily Budget</th>
                <th className="py-3 px-4">Spend</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Clicks (CTR)</th>
                <th className="py-3 px-4">Leads (CPL)</th>
                <th className="py-3 px-4">ROAS</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.map((c) => {
                const isActive = c.status === 'ACTIVE'
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCampaign && onSelectCampaign(c)}
                    className="hover:bg-muted/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
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

                    <td className="py-3.5 px-4 font-bold text-title-color dark:text-white max-w-[220px] truncate">
                      {c.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] font-semibold bg-background">
                        {c.objective.replace('OUTCOME_', '')}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      ${c.dailyBudget}/day
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-title-color dark:text-white">
                      ${c.insights?.spend ? c.insights.spend.toFixed(2) : '0.00'}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {c.insights?.impressions?.toLocaleString() || 0}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold">{c.insights?.clicks?.toLocaleString() || 0}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">({c.insights?.ctr || 0}%)</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {c.insights?.leads || 0}
                      <span className="text-[10px] text-muted-foreground ml-1">(${c.insights?.cpl ? c.insights.cpl.toFixed(2) : '0.00'})</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {c.insights?.roas ? `${c.insights.roas}x` : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleToggle(c, e)}
                          className="h-8 w-8 p-0 rounded-lg"
                          title={isActive ? 'Pause Campaign' : 'Resume Campaign'}
                        >
                          {isActive ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(c.id, e)}
                          className="h-8 w-8 p-0 rounded-lg hover:text-red-500"
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

export default CampaignsTable
