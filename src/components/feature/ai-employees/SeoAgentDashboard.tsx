'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, CheckCircle2, AlertTriangle, AlertCircle, Info, TrendingUp,
  Zap, ArrowRight, ChevronDown, ChevronUp, Target, FileText, Code,
  Link, Image, Tag, Settings, Sparkles, BarChart3, Save, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Mock SEO Data ─── */
const SEO_SCORE = 67

const SEO_CATEGORIES = [
  {
    name: 'Meta Tags', score: 8, maxScore: 10, icon: Tag,
    issues: [
      { id: '1', type: 'success' as const, title: 'Title tag present', desc: 'Page has a proper title tag', fixed: true, cost: 0, complexity: 'simple' as const },
      { id: '2', type: 'warning' as const, title: 'Meta description too short', desc: 'Description is 45 chars, recommended 150-160', fixed: false, cost: 1, complexity: 'simple' as const },
      { id: '3', type: 'success' as const, title: 'Open Graph tags present', desc: 'Social sharing tags are properly configured', fixed: true, cost: 0, complexity: 'simple' as const },
    ],
  },
  {
    name: 'Heading Structure', score: 6, maxScore: 10, icon: FileText,
    issues: [
      { id: '4', type: 'critical' as const, title: 'Multiple H1 tags found', desc: 'Page has 3 H1 tags, should have exactly 1', fixed: false, cost: 2, complexity: 'moderate' as const },
      { id: '5', type: 'warning' as const, title: 'Heading hierarchy broken', desc: 'H3 used before H2 on services section', fixed: false, cost: 1, complexity: 'simple' as const },
      { id: '6', type: 'success' as const, title: 'Keywords in headings', desc: 'Primary keywords found in H1 and H2 tags', fixed: true, cost: 0, complexity: 'simple' as const },
    ],
  },
  {
    name: 'Images & Alt Text', score: 5, maxScore: 10, icon: Image,
    issues: [
      { id: '7', type: 'critical' as const, title: '4 images missing alt text', desc: 'Gallery images need descriptive alt attributes', fixed: false, cost: 2, complexity: 'moderate' as const },
      { id: '8', type: 'warning' as const, title: 'Large image file sizes', desc: '3 images exceed 500KB, affecting page speed', fixed: false, cost: 1, complexity: 'simple' as const },
    ],
  },
  {
    name: 'Internal Linking', score: 7, maxScore: 10, icon: Link,
    issues: [
      { id: '9', type: 'info' as const, title: 'Add more internal links', desc: 'Services page has only 2 internal links', fixed: false, cost: 1, complexity: 'simple' as const },
      { id: '10', type: 'success' as const, title: 'Breadcrumbs implemented', desc: 'Proper breadcrumb navigation present', fixed: true, cost: 0, complexity: 'simple' as const },
    ],
  },
  {
    name: 'Schema Markup', score: 3, maxScore: 10, icon: Code,
    issues: [
      { id: '11', type: 'critical' as const, title: 'No LocalBusiness schema', desc: 'Missing structured data for local search', fixed: false, cost: 3, complexity: 'complex' as const },
      { id: '12', type: 'critical' as const, title: 'No FAQ schema', desc: 'FAQ section exists but no FAQ schema markup', fixed: false, cost: 2, complexity: 'moderate' as const },
    ],
  },
]

const KEYWORDS = [
  { keyword: 'dental clinic near me', volume: 12400, difficulty: 35, relevance: 95, applied: false, type: 'primary' as const },
  { keyword: 'best dentist mumbai', volume: 8800, difficulty: 42, relevance: 88, applied: false, type: 'primary' as const },
  { keyword: 'teeth whitening cost', volume: 6200, difficulty: 28, relevance: 72, applied: true, type: 'secondary' as const },
  { keyword: 'root canal treatment near me', volume: 4500, difficulty: 38, relevance: 85, applied: false, type: 'long_tail' as const },
  { keyword: 'dental implant clinic andheri', volume: 1800, difficulty: 15, relevance: 92, applied: false, type: 'local' as const },
  { keyword: 'painless dental treatment', volume: 3200, difficulty: 22, relevance: 78, applied: true, type: 'secondary' as const },
  { keyword: 'emergency dentist 24 hours', volume: 5600, difficulty: 45, relevance: 65, applied: false, type: 'long_tail' as const },
  { keyword: 'pediatric dentist near me', volume: 2900, difficulty: 32, relevance: 55, applied: false, type: 'local' as const },
]

export default function SeoAgentDashboard() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [tab, setTab] = useState<'audit' | 'keywords' | 'training'>('audit')

  const totalIssues = SEO_CATEGORIES.reduce((a, c) => a + c.issues.filter((i) => !i.fixed && i.type !== 'success').length, 0)
  const criticalCount = SEO_CATEGORIES.reduce((a, c) => a + c.issues.filter((i) => i.type === 'critical' && !i.fixed).length, 0)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500'
    if (score >= 50) return 'stroke-amber-500'
    return 'stroke-red-500'
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg text-xl">🔍</div>
            AI SEO Expert
          </h1>
          <p className="text-white/40 text-sm mt-2">On-page SEO analysis, keyword optimization & schema markup — all automated.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl h-10 shadow-lg shadow-green-500/20">
            <Sparkles className="w-4 h-4" /> Run Full Audit
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'audit' as const, label: 'SEO Audit', icon: Search },
          { id: 'keywords' as const, label: 'Keywords', icon: Target },
          { id: 'training' as const, label: 'Agent Training', icon: Settings },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Audit Tab ── */}
      {tab === 'audit' && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6 md:col-span-1">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="fill-none stroke-white/10" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" className={`fill-none ${getScoreRingColor(SEO_SCORE)}`} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${SEO_SCORE * 2.64} 264`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(SEO_SCORE)}`}>{SEO_SCORE}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">SEO Score</p>
                <p className="text-xs text-white/30">Needs improvement</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-xs text-white/50">Critical Issues</span></div>
              <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-amber-400" /><span className="text-xs text-white/50">Total Issues</span></div>
              <p className="text-2xl font-bold text-amber-400">{totalIssues}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-xs text-white/50">Fix All Cost</span></div>
              <p className="text-2xl font-bold text-white">{SEO_CATEGORIES.reduce((a, c) => a + c.issues.filter((i) => !i.fixed).reduce((s, i) => s + i.cost, 0), 0)} <span className="text-xs text-white/40">credits</span></p>
              <Button size="sm" className="mt-2 gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg h-7 text-[10px]">
                <Zap className="w-3 h-3" /> Apply All Fixes
              </Button>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            {SEO_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isExpanded = expandedCategory === cat.name
              const scorePercent = (cat.score / cat.maxScore) * 100
              return (
                <div key={cat.name} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <button onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Icon className="w-5 h-5 text-white/60" /></div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                        <p className="text-[10px] text-white/30">{cat.issues.filter((i) => !i.fixed && i.type !== 'success').length} issues</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                        <div className={`h-full rounded-full ${scorePercent >= 80 ? 'bg-green-500' : scorePercent >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${scorePercent}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white">{cat.score}/{cat.maxScore}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5">
                      {cat.issues.map((issue) => (
                        <div key={issue.id} className="px-5 py-3 flex items-center justify-between border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-3">
                            {issue.type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                            {issue.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                            {issue.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                            {issue.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                            <div>
                              <p className={`text-xs font-medium ${issue.fixed ? 'text-white/40 line-through' : 'text-white/80'}`}>{issue.title}</p>
                              <p className="text-[10px] text-white/30">{issue.desc}</p>
                            </div>
                          </div>
                          {!issue.fixed && issue.type !== 'success' && (
                            <Button size="sm" className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg h-7 text-[10px]">
                              Fix ({issue.cost} cr) <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Keywords Tab ── */}
      {tab === 'keywords' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <p className="text-sm text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-green-400" /> AI has identified <strong>{KEYWORDS.length}</strong> high-impact keywords for your business.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-white/[0.03] border-b border-white/5 text-[10px] text-white/30 font-semibold uppercase tracking-wider">
              <div className="col-span-2">Keyword</div><div>Volume</div><div>Difficulty</div><div>Relevance</div><div>Action</div>
            </div>
            {KEYWORDS.map((kw, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02]">
                <div className="col-span-2">
                  <p className="text-xs font-medium text-white">{kw.keyword}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    kw.type === 'primary' ? 'bg-blue-500/20 text-blue-400'
                    : kw.type === 'local' ? 'bg-green-500/20 text-green-400'
                    : kw.type === 'long_tail' ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-white/10 text-white/40'
                  }`}>{kw.type.replace('_', ' ')}</span>
                </div>
                <div className="text-xs text-white/60">{kw.volume.toLocaleString()}</div>
                <div><div className="w-full h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full ${kw.difficulty > 40 ? 'bg-red-500' : kw.difficulty > 25 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${kw.difficulty}%` }} /></div></div>
                <div className="text-xs text-white/60">{kw.relevance}%</div>
                <div>
                  {kw.applied ? (
                    <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Applied</span>
                  ) : (
                    <Button size="sm" className="h-6 text-[10px] px-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg">Apply</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Training Tab ── */}
      {tab === 'training' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <p className="text-sm text-white flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" /> Train your SEO Agent with custom rules, industry keywords, and algorithms. Changes apply to all future audits.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO Rules */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">SEO Rules & Algorithms</h3>
              <div className="space-y-3">
                {['Meta Tag Optimization', 'Heading Hierarchy Check', 'Image Alt Text Audit', 'Internal Link Analysis', 'Schema Markup Generator', 'Page Speed Optimization', 'Mobile Responsiveness'].map((rule) => (
                  <div key={rule} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                    <span className="text-xs text-white/70">{rule}</span>
                    <div className="w-10 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-end px-0.5">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Prompts */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Custom SEO Prompts</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">Meta Description Style</label>
                  <textarea rows={3} defaultValue="Generate compelling meta descriptions that include primary keyword in first 50 characters, add a CTA, and keep under 160 chars." className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/20 outline-none focus:border-primary/50 resize-none" />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">Content Optimization Guide</label>
                  <textarea rows={3} defaultValue="Ensure keyword density between 1-3%, use LSI keywords naturally, maintain readability score above 60." className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/20 outline-none focus:border-primary/50 resize-none" />
                </div>
                <Button className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl h-9 w-full text-xs">
                  <Save className="w-3.5 h-3.5" /> Save Training Config
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
