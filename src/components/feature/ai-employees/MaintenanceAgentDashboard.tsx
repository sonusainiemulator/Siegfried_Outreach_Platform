'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wrench, Calendar, Clock, Shield, Zap, RefreshCw, FileText,
  CheckCircle2, AlertCircle, RotateCcw, Play, Pause, Settings,
  History, ArrowRight, ChevronRight, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Mock Data ─── */
const CHANGE_TYPES = [
  { id: 'content_update', label: 'Content Update', icon: FileText, desc: 'AI refreshes website content, blog posts, service descriptions', creditCost: 2, color: 'from-blue-500 to-cyan-500' },
  { id: 'security_patch', label: 'Security Patch', icon: Shield, desc: 'Security updates, vulnerability fixes, dependency patches', creditCost: 1, color: 'from-green-500 to-emerald-500' },
  { id: 'performance', label: 'Performance Tune', icon: Zap, desc: 'Speed optimization, image compression, cache improvements', creditCost: 2, color: 'from-amber-500 to-orange-500' },
  { id: 'design_refresh', label: 'Design Refresh', icon: RefreshCw, desc: 'UI/UX improvements, layout tweaks, new sections', creditCost: 3, color: 'from-violet-500 to-purple-500' },
  { id: 'seo_update', label: 'SEO Update', icon: FileText, desc: 'Keyword refresh, meta updates, new schema markup', creditCost: 2, color: 'from-pink-500 to-rose-500' },
  { id: 'backup', label: 'Full Backup', icon: History, desc: 'Complete website backup with restore point', creditCost: 1, color: 'from-slate-500 to-zinc-500' },
]

const MAINTENANCE_LOGS = [
  { id: '1', type: 'content_update', title: 'Homepage hero text updated', desc: 'Refreshed hero section copy with seasonal messaging', status: 'completed' as const, date: 'Sep 4, 2026', cost: 2, canRollback: true },
  { id: '2', type: 'security_patch', title: 'Security headers updated', desc: 'Added HSTS, CSP, and X-Frame-Options headers', status: 'completed' as const, date: 'Sep 3, 2026', cost: 1, canRollback: true },
  { id: '3', type: 'performance', title: 'Image optimization pass', desc: 'Compressed 24 images, saving 3.2MB total', status: 'completed' as const, date: 'Sep 1, 2026', cost: 2, canRollback: false },
  { id: '4', type: 'content_update', title: 'Blog post: "Top 10 Dental Tips"', desc: 'AI-generated blog post with industry keywords', status: 'completed' as const, date: 'Aug 28, 2026', cost: 2, canRollback: true },
  { id: '5', type: 'design_refresh', title: 'Services page redesign', desc: 'Updated layout with card-based service showcase', status: 'rolled_back' as const, date: 'Aug 25, 2026', cost: 3, canRollback: false },
  { id: '6', type: 'seo_update', title: 'New FAQ schema added', desc: 'Added FAQ schema markup to 3 service pages', status: 'completed' as const, date: 'Aug 22, 2026', cost: 2, canRollback: true },
]

export default function MaintenanceAgentDashboard() {
  const [tab, setTab] = useState<'schedule' | 'logs'>('schedule')
  const [frequency, setFrequency] = useState('monthly')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['content_update', 'security_patch', 'performance'])
  const [approvalMode, setApprovalMode] = useState<'auto' | 'manual'>('manual')
  const [isScheduleActive, setIsScheduleActive] = useState(true)

  const toggleType = (id: string) => {
    setSelectedTypes((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id])
  }

  const monthlyCost = selectedTypes.reduce((acc, id) => {
    const type = CHANGE_TYPES.find((t) => t.id === id)
    return acc + (type?.creditCost || 0)
  }, 0) * (frequency === 'weekly' ? 4 : frequency === 'biweekly' ? 2 : 1)

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg text-xl">🔧</div>
            AI Maintenance Bot
          </h1>
          <p className="text-white/40 text-sm mt-2">Automated website maintenance on autopilot — content, security, performance & more.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${isScheduleActive ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'}`}>
            {isScheduleActive ? <Play className="w-3 h-3 text-green-400" /> : <Pause className="w-3 h-3 text-white/40" />}
            <span className={`text-xs font-medium ${isScheduleActive ? 'text-green-400' : 'text-white/40'}`}>{isScheduleActive ? 'Schedule Active' : 'Paused'}</span>
          </div>
          <Button variant="outline" onClick={() => setIsScheduleActive(!isScheduleActive)}
            className="border-white/10 text-white/60 rounded-xl h-10 text-xs">{isScheduleActive ? 'Pause' : 'Resume'}</Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'schedule' as const, label: 'Schedule Setup', icon: Calendar },
          { id: 'logs' as const, label: 'Maintenance Logs', icon: History },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Schedule Tab ── */}
      {tab === 'schedule' && (
        <div className="space-y-6">
          {/* Frequency */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Maintenance Frequency</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'weekly', label: 'Weekly', desc: '4x per month' },
                { id: 'biweekly', label: 'Bi-Weekly', desc: '2x per month' },
                { id: 'monthly', label: 'Monthly', desc: '1x per month' },
              ].map((f) => (
                <button key={f.id} onClick={() => setFrequency(f.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    frequency === f.id ? 'border-primary/60 bg-primary/10 ring-1 ring-primary/30' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-[10px] text-white/30">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Change Types */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-violet-400" /> Maintenance Tasks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CHANGE_TYPES.map((type) => {
                const Icon = type.icon
                const selected = selectedTypes.includes(type.id)
                return (
                  <button key={type.id} onClick={() => toggleType(type.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selected ? 'border-primary/40 bg-primary/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] text-white/40">{type.creditCost} cr/run</span>
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">{type.label}</p>
                    <p className="text-[10px] text-white/30 leading-relaxed">{type.desc}</p>
                    {selected && <CheckCircle2 className="w-4 h-4 text-primary mt-2" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Approval Mode */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4">Approval Mode</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setApprovalMode('auto')}
                className={`p-4 rounded-xl border text-left ${approvalMode === 'auto' ? 'border-green-500/40 bg-green-500/5' : 'border-white/10'}`}>
                <p className="text-sm font-semibold text-white">Auto-Approve</p>
                <p className="text-[10px] text-white/30 mt-1">AI makes changes automatically without waiting</p>
              </button>
              <button onClick={() => setApprovalMode('manual')}
                className={`p-4 rounded-xl border text-left ${approvalMode === 'manual' ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/10'}`}>
                <p className="text-sm font-semibold text-white">Manual Review</p>
                <p className="text-[10px] text-white/30 mt-1">AI suggests changes, you approve before applying</p>
              </button>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Estimated Monthly Cost</p>
              <p className="text-xs text-white/40">{selectedTypes.length} tasks × {frequency === 'weekly' ? '4' : frequency === 'biweekly' ? '2' : '1'} runs/month</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{monthlyCost} <span className="text-xs text-white/40">credits/mo</span></p>
              <Button size="sm" className="mt-2 gap-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg h-7 text-[10px]">
                Save Schedule <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logs Tab ── */}
      {tab === 'logs' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-white">Last 30 days: {MAINTENANCE_LOGS.length} tasks completed</p>
              <p className="text-xs text-white/30">{MAINTENANCE_LOGS.reduce((a, l) => a + l.cost, 0)} credits consumed</p>
            </div>
          </div>
          {MAINTENANCE_LOGS.map((log, i) => {
            const type = CHANGE_TYPES.find((t) => t.id === log.type)
            const Icon = type?.icon || Wrench
            return (
              <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{log.title}</h4>
                      <p className="text-[10px] text-white/30">{log.desc}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-white/20">{log.date}</span>
                        <span className="text-[10px] text-white/20">{log.cost} credits</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          log.status === 'completed' ? 'bg-green-500/20 text-green-400'
                          : log.status === 'rolled_back' ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                        }`}>{log.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.canRollback && log.status === 'completed' && (
                      <Button size="sm" variant="outline" className="gap-1 border-white/10 text-white/40 hover:text-white/60 rounded-lg h-7 text-[10px]">
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-white/30 hover:text-white/60 h-7">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
