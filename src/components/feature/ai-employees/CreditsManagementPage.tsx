'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard, Zap, TrendingUp, ArrowRight, History,
  CheckCircle2, Globe, Search, Database, Wrench, Share2, MapPin,
  Sparkles, ShoppingCart, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Mock Data ─── */
const CREDIT_BALANCE = { total: 500, used: 127, remaining: 373 }

const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 100, price: 499, currency: '₹', perCredit: '4.99', popular: false },
  { id: 'growth', name: 'Growth', credits: 300, price: 999, currency: '₹', perCredit: '3.33', popular: true },
  { id: 'pro', name: 'Pro', credits: 700, price: 1999, currency: '₹', perCredit: '2.85', popular: false },
  { id: 'enterprise', name: 'Enterprise', credits: 2000, price: 4999, currency: '₹', perCredit: '2.49', popular: false },
]

const AGENT_EMOJI: Record<string, string> = {
  website_builder: '🌐', seo_agent: '🔍', server_agent: '🖥️',
  maintenance_agent: '🔧', social_agent: '📱', google_business: '📍',
}

const CREDIT_HISTORY = [
  { agent: 'website_builder', action: 'Website generated — Healthcare template', amount: -5, date: 'Sep 5, 4:30 PM' },
  { agent: 'seo_agent', action: 'Full SEO audit — sharma-dental.com', amount: -3, date: 'Sep 5, 3:15 PM' },
  { agent: 'social_agent', action: 'Instagram carousel generated', amount: -3, date: 'Sep 5, 2:00 PM' },
  { agent: 'seo_agent', action: 'Applied 5 keyword optimizations', amount: -2, date: 'Sep 4, 6:30 PM' },
  { agent: 'maintenance_agent', action: 'Monthly content update', amount: -2, date: 'Sep 4, 10:00 AM' },
  { agent: 'google_business', action: 'Google Profile audit', amount: -3, date: 'Sep 3, 5:00 PM' },
  { agent: 'social_agent', action: 'Viral reel generated', amount: -4, date: 'Sep 3, 11:00 AM' },
  { agent: 'server_agent', action: 'Server provisioned — Pro plan', amount: -5, date: 'Sep 2, 9:00 AM' },
  { agent: '', action: 'Credits purchased — Growth Pack', amount: 300, date: 'Sep 1, 8:00 AM' },
]

const USAGE_BY_AGENT = [
  { agent: 'Social Media Agent', emoji: '📱', used: 45, color: 'bg-pink-500' },
  { agent: 'SEO Agent', emoji: '🔍', used: 28, color: 'bg-green-500' },
  { agent: 'Website Builder', emoji: '🌐', used: 20, color: 'bg-blue-500' },
  { agent: 'Maintenance Bot', emoji: '🔧', used: 16, color: 'bg-amber-500' },
  { agent: 'Google Business', emoji: '📍', used: 12, color: 'bg-red-500' },
  { agent: 'Server Manager', emoji: '🖥️', used: 6, color: 'bg-violet-500' },
]

export default function CreditsManagementPage() {
  const [tab, setTab] = useState<'overview' | 'buy' | 'history'>('overview')
  const creditPercent = Math.round((CREDIT_BALANCE.used / CREDIT_BALANCE.total) * 100)
  const totalUsed = USAGE_BY_AGENT.reduce((a, b) => a + b.used, 0)

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Credit Management
          </h1>
          <p className="text-white/40 text-sm mt-2">Track usage, buy credits, and manage your AI employee billing.</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
          { id: 'buy' as const, label: 'Buy Credits', icon: ShoppingCart },
          { id: 'history' as const, label: 'History', icon: History },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative z-10">
                <Zap className="w-5 h-5 text-amber-400 mb-3" />
                <p className="text-3xl font-bold text-white">{CREDIT_BALANCE.remaining}</p>
                <p className="text-xs text-white/40 mt-1">Credits Remaining</p>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${100 - creditPercent}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <CreditCard className="w-5 h-5 text-blue-400 mb-3" />
              <p className="text-3xl font-bold text-white">{CREDIT_BALANCE.used}</p>
              <p className="text-xs text-white/40 mt-1">Credits Used</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <TrendingUp className="w-5 h-5 text-green-400 mb-3" />
              <p className="text-3xl font-bold text-white">{CREDIT_BALANCE.total}</p>
              <p className="text-xs text-white/40 mt-1">Total Credits</p>
            </div>
          </div>

          {/* Usage by Agent */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4">Usage by AI Agent</h3>
            <div className="space-y-3">
              {USAGE_BY_AGENT.map((agent, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-lg w-8">{agent.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/70">{agent.agent}</span>
                      <span className="text-xs text-white font-bold">{agent.used} credits</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(agent.used / totalUsed) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${agent.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Buy Credits Tab ── */}
      {tab === 'buy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CREDIT_PACKAGES.map((pkg) => (
              <motion.div key={pkg.id} whileHover={{ y: -4 }}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all overflow-hidden ${
                  pkg.popular ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/20' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}>
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />
                )}
                <div className="text-center">
                  {pkg.popular && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold inline-block mb-3">MOST POPULAR</span>}
                  <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                  <p className="text-4xl font-bold text-white mt-3">{pkg.credits}</p>
                  <p className="text-xs text-white/30">credits</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-2xl font-bold text-white">{pkg.currency}{pkg.price}</p>
                    <p className="text-[10px] text-white/30">{pkg.currency}{pkg.perCredit} per credit</p>
                  </div>
                  <Button className={`mt-4 w-full rounded-xl h-10 ${
                    pkg.popular ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/20' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    Buy Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {tab === 'history' && (
        <div className="space-y-3">
          {CREDIT_HISTORY.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                  {item.agent ? AGENT_EMOJI[item.agent] || '⚡' : '💳'}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{item.action}</p>
                  <p className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{item.date}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${item.amount > 0 ? 'text-green-400' : 'text-white/60'}`}>
                {item.amount > 0 ? '+' : ''}{item.amount}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
