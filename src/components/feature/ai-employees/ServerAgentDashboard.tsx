'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database, Server, Globe, Shield, Zap, Wifi, HardDrive,
  ArrowRight, CheckCircle2, Clock, Activity, Gauge, RefreshCw,
  Rocket, Lock, ExternalLink, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Mock Data ─── */
const SERVER_PLANS = [
  { id: 'basic', name: 'Basic', price: 3, storage: '5 GB', bandwidth: '100 GB', speed: 'Standard', ssl: true, color: 'from-blue-500 to-cyan-500', features: ['Shared Hosting', 'Free SSL', 'Daily Backup', '99.5% Uptime'] },
  { id: 'pro', name: 'Pro', price: 5, storage: '25 GB', bandwidth: '500 GB', speed: 'Fast', ssl: true, color: 'from-violet-500 to-purple-500', features: ['VPS Hosting', 'Free SSL', 'Hourly Backup', '99.9% Uptime', 'CDN Included', 'DDoS Protection'], recommended: true },
  { id: 'enterprise', name: 'Enterprise', price: 10, storage: '100 GB', bandwidth: 'Unlimited', speed: 'Ultra Fast', ssl: true, color: 'from-amber-500 to-orange-500', features: ['Dedicated Server', 'Free SSL', 'Real-time Backup', '99.99% Uptime', 'Global CDN', 'DDoS Protection', 'Priority Support'] },
]

const DEPLOYMENT_STEPS = [
  { label: 'Provisioning server...', icon: Server },
  { label: 'Configuring DNS...', icon: Globe },
  { label: 'Setting up SSL certificate...', icon: Lock },
  { label: 'Deploying website files...', icon: HardDrive },
  { label: 'Running health checks...', icon: Activity },
  { label: 'Website is LIVE! 🎉', icon: Rocket },
]

const LIVE_STATS = {
  uptime: 99.98,
  responseTime: 142,
  bandwidth: '2.3 GB',
  storage: '1.2 GB / 25 GB',
  requests: '12.4K',
  coreWebVitals: { lcp: 1.2, fid: 18, cls: 0.04 },
}

export default function ServerAgentDashboard() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployStep, setDeployStep] = useState(0)
  const [isLive, setIsLive] = useState(true) // Mock: site already live
  const [domain, setDomain] = useState('sharma-dental.com')

  const handleDeploy = () => {
    setIsDeploying(true)
    setDeployStep(0)
    const interval = setInterval(() => {
      setDeployStep((s) => {
        if (s >= DEPLOYMENT_STEPS.length - 1) { clearInterval(interval); return s }
        return s + 1
      })
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg text-xl">🖥️</div>
            AI Server Manager
          </h1>
          <p className="text-white/40 text-sm mt-2">One-click server provisioning, deployment, and monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Site Live</span>
            </div>
          )}
        </div>
      </div>

      {isLive ? (
        <>
          {/* ── Server Status Dashboard ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Uptime', value: `${LIVE_STATS.uptime}%`, icon: Activity, color: 'text-green-400' },
              { label: 'Response', value: `${LIVE_STATS.responseTime}ms`, icon: Gauge, color: 'text-blue-400' },
              { label: 'Bandwidth', value: LIVE_STATS.bandwidth, icon: Wifi, color: 'text-violet-400' },
              { label: 'Storage', value: LIVE_STATS.storage, icon: HardDrive, color: 'text-amber-400' },
              { label: 'Requests/day', value: LIVE_STATS.requests, icon: RefreshCw, color: 'text-cyan-400' },
              { label: 'SSL', value: 'Active', icon: Shield, color: 'text-green-400' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/30">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Core Web Vitals */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Core Web Vitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'LCP (Largest Contentful Paint)', value: `${LIVE_STATS.coreWebVitals.lcp}s`, target: '< 2.5s', status: LIVE_STATS.coreWebVitals.lcp < 2.5 ? 'good' : 'poor' },
                { label: 'FID (First Input Delay)', value: `${LIVE_STATS.coreWebVitals.fid}ms`, target: '< 100ms', status: LIVE_STATS.coreWebVitals.fid < 100 ? 'good' : 'poor' },
                { label: 'CLS (Cumulative Layout Shift)', value: LIVE_STATS.coreWebVitals.cls.toString(), target: '< 0.1', status: LIVE_STATS.coreWebVitals.cls < 0.1 ? 'good' : 'poor' },
              ].map((vital) => (
                <div key={vital.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    {vital.status === 'good' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <p className="text-[10px] text-white/40">{vital.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${vital.status === 'good' ? 'text-green-400' : 'text-red-400'}`}>{vital.value}</p>
                  <p className="text-[10px] text-white/20 mt-1">Target: {vital.target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Domain & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Domain Configuration</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-blue-400" /><span className="text-xs text-white">{domain}</span></div>
                  <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="text-primary text-[10px] flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" /> Visit</a>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-green-400" /><span className="text-xs text-white">SSL Certificate</span></div>
                  <span className="text-[10px] text-green-400">Active (Let&apos;s Encrypt)</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Clear Cache', 'Restart Server', 'Force SSL', 'Backup Now'].map((action) => (
                  <Button key={action} variant="outline" size="sm" className="border-white/10 text-white/60 hover:bg-white/5 rounded-xl text-xs h-9">{action}</Button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── Server Plan Selection ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVER_PLANS.map((plan) => (
              <motion.div key={plan.id} whileHover={{ y: -4 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  selectedPlan === plan.id
                    ? 'border-primary/60 bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                } ${plan.recommended ? 'md:-mt-4 md:mb-0' : ''}`}>
                {plan.recommended && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Server className="w-6 h-6 text-white" />
                </div>
                {plan.recommended && <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold mb-2 inline-block">RECOMMENDED</span>}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-2xl font-bold text-white mt-2">{plan.price} <span className="text-xs text-white/40">credits/mo</span></p>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs"><span className="text-white/40">Storage</span><span className="text-white">{plan.storage}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Bandwidth</span><span className="text-white">{plan.bandwidth}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Speed</span><span className="text-white">{plan.speed}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                  {plan.features.map((f) => (
                    <p key={f} className="text-[10px] text-white/40 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" /> {f}</p>
                  ))}
                </div>
                {selectedPlan === plan.id && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary" />}
              </motion.div>
            ))}
          </div>

          {/* Domain Config */}
          {selectedPlan && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Domain Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Custom Domain</label>
                  <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="yourdomain.com" className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Or use a subdomain</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="mysite" className="flex-1 h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-primary/50" />
                    <span className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white/40 text-sm flex items-center">.siegfried.site</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleDeploy} className="mt-6 gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl h-11 px-8 shadow-lg shadow-violet-500/20">
                <Rocket className="w-4 h-4" /> Deploy & Go Live <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Deployment Progress */}
          {isDeploying && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Rocket className="w-4 h-4 text-violet-400" /> Deployment Progress</h3>
              <div className="space-y-3">
                {DEPLOYMENT_STEPS.map((s, i) => {
                  const Icon = s.icon
                  const isDone = i < deployStep
                  const isCurrent = i === deployStep
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isDone ? 'bg-green-500/20' : isCurrent ? 'bg-primary/20' : 'bg-white/5'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                        : isCurrent ? <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        : <Icon className="w-4 h-4 text-white/20" />}
                      </div>
                      <span className={`text-xs ${isDone ? 'text-green-400' : isCurrent ? 'text-white' : 'text-white/20'}`}>{s.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
