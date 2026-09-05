'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Globe, Search, Database, Wrench, Share2, MapPin, Cpu,
  ArrowRight, Zap, TrendingUp, Clock, CreditCard, FileText,
  CheckCircle2, AlertCircle, Loader2, Sparkles, BarChart3,
  ChevronRight, Activity, Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

/* ─── Agent Card Data ─── */
const AGENTS = [
  {
    id: 'website_builder', name: 'AI Website Builder', emoji: '🌐', icon: Globe,
    color: 'from-blue-500 to-indigo-600', bgGlow: 'bg-blue-500/20',
    desc: 'AI-powered website generation with pre-built templates',
    path: ROUTES.AI_EMPLOYEES.WEBSITE_BUILDER,
    stats: { completed: 3, inProgress: 1, label: 'Websites' },
  },
  {
    id: 'seo_agent', name: 'AI SEO Expert', emoji: '🔍', icon: Search,
    color: 'from-green-500 to-emerald-600', bgGlow: 'bg-green-500/20',
    desc: 'On-page SEO optimization & keyword research',
    path: ROUTES.AI_EMPLOYEES.SEO_AGENT,
    stats: { completed: 12, inProgress: 2, label: 'Optimizations' },
  },
  {
    id: 'server_agent', name: 'AI Server Manager', emoji: '🖥️', icon: Database,
    color: 'from-violet-500 to-purple-600', bgGlow: 'bg-violet-500/20',
    desc: 'One-click server provisioning & deployment',
    path: ROUTES.AI_EMPLOYEES.SERVER_AGENT,
    stats: { completed: 2, inProgress: 0, label: 'Deployments' },
  },
  {
    id: 'maintenance_agent', name: 'AI Maintenance Bot', emoji: '🔧', icon: Wrench,
    color: 'from-amber-500 to-orange-600', bgGlow: 'bg-amber-500/20',
    desc: 'Automated monthly website maintenance',
    path: ROUTES.AI_EMPLOYEES.MAINTENANCE_AGENT,
    stats: { completed: 8, inProgress: 1, label: 'Tasks' },
  },
  {
    id: 'social_agent', name: 'Social Media AI Agent', emoji: '📱', icon: Share2,
    color: 'from-pink-500 to-rose-600', bgGlow: 'bg-pink-500/20',
    desc: 'Viral content, competitor research & publishing',
    path: ROUTES.AI_EMPLOYEES.SOCIAL_AGENT,
    stats: { completed: 45, inProgress: 5, label: 'Posts' },
  },
  {
    id: 'google_business', name: 'Google Business Expert', emoji: '📍', icon: MapPin,
    color: 'from-red-500 to-orange-600', bgGlow: 'bg-red-500/20',
    desc: 'Local SEO & Google Profile optimization',
    path: ROUTES.AI_EMPLOYEES.GOOGLE_BUSINESS,
    stats: { completed: 6, inProgress: 1, label: 'Optimizations' },
  },
]

/* ─── Mock Data ─── */
const RECENT_ACTIVITY = [
  { agent: '🔍', action: 'SEO Audit completed for sharma-dental.com', time: '2 min ago', type: 'success' as const },
  { agent: '📱', action: 'Instagram carousel post generated — "Top 5 Dental Tips"', time: '15 min ago', type: 'success' as const },
  { agent: '🌐', action: 'Website generation in progress...', time: '30 min ago', type: 'working' as const },
  { agent: '🔧', action: 'Monthly security patch applied', time: '1 hour ago', type: 'success' as const },
  { agent: '📍', action: 'Local keywords updated — 8 new keywords added', time: '2 hours ago', type: 'success' as const },
  { agent: '🖥️', action: 'Server uptime: 99.98% — All systems healthy', time: '3 hours ago', type: 'info' as const },
]

const DRAFTS = [
  { id: '1', agent: '🌐', title: 'E-Commerce Website Draft', step: 'Template Selection', updatedAt: '1 hour ago' },
  { id: '2', agent: '📱', title: 'Social Media Content Plan — October', step: 'Content Review', updatedAt: '3 hours ago' },
]

export default function CommandCenterDashboard() {
  const router = useRouter()
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)

  const creditBalance = { total: 500, used: 127, remaining: 373 }
  const creditPercent = Math.round((creditBalance.used / creditBalance.total) * 100)

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            AI Employee Command Center
          </h1>
          <p className="text-white/40 text-sm mt-2">Monitor, manage, and deploy your AI workforce from one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push(ROUTES.AI_EMPLOYEES.CREDITS)}
            className="gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl h-11">
            <CreditCard className="w-4 h-4" /> Buy Credits
          </Button>
          <Button onClick={() => router.push(ROUTES.AI_EMPLOYEES.ONBOARDING)}
            className="gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl h-11 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> New Business
          </Button>
        </div>
      </div>

      {/* ── Top Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Credit Balance */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <p className="text-sm text-white/50 font-medium">Credit Balance</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{creditBalance.remaining}</p>
            <p className="text-xs text-white/30">{creditBalance.used} used of {creditBalance.total}</p>
            <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${creditPercent}%` }} transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500" />
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-500/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-green-400" />
              <p className="text-sm text-white/50 font-medium">Active AI Agents</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">6 / 6</p>
            <p className="text-xs text-white/30">All agents operational</p>
            <div className="mt-3 flex gap-1.5">
              {AGENTS.map((a) => (
                <div key={a.id} className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm" title={a.name}>
                  {a.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks This Month */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              <p className="text-sm text-white/50 font-medium">Tasks This Month</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">76</p>
            <p className="text-xs text-green-400">↑ 23% from last month</p>
            <div className="mt-3 flex items-center gap-1">
              {[40, 55, 35, 70, 45, 80, 60, 75, 50, 90, 65, 76].map((v, i) => (
                <div key={i} className="flex-1 bg-violet-500/30 rounded-full overflow-hidden" style={{ height: `${v * 0.3}px` }}>
                  <div className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-full" style={{ height: '100%' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Agent Grid ── */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Your AI Employees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon
            const isHovered = hoveredAgent === agent.id
            return (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onMouseEnter={() => setHoveredAgent(agent.id)} onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => router.push(agent.path)}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer group transition-all duration-300 hover:shadow-xl overflow-hidden">
                <div className={`absolute inset-0 ${agent.bgGlow} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg text-2xl`}>
                      {agent.emoji}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] text-green-400 font-medium uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{agent.name}</h3>
                  <p className="text-white/40 text-xs mb-4 leading-relaxed">{agent.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold text-white">{agent.stats.completed}</p>
                        <p className="text-[10px] text-white/30">{agent.stats.label}</p>
                      </div>
                      {agent.stats.inProgress > 0 && (
                        <div>
                          <p className="text-lg font-bold text-amber-400">{agent.stats.inProgress}</p>
                          <p className="text-[10px] text-white/30">In Progress</p>
                        </div>
                      )}
                    </div>
                    <motion.div animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <span className="text-lg">{item.agent}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{item.action}</p>
                  <p className="text-[10px] text-white/30">{item.time}</p>
                </div>
                {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                {item.type === 'working' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />}
                {item.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drafts */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-white/40" /> Saved Drafts
          </h3>
          <div className="space-y-3">
            {DRAFTS.map((draft) => (
              <div key={draft.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] cursor-pointer transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{draft.agent}</span>
                  <h4 className="text-sm font-medium text-white truncate">{draft.title}</h4>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white/30">{draft.step} · {draft.updatedAt}</p>
                  <span className="text-[10px] text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Resume <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
            {DRAFTS.length === 0 && (
              <p className="text-xs text-white/20 text-center py-6">No drafts saved yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
