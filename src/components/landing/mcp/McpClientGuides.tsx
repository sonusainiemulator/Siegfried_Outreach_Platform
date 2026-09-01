'use client'

import { useState } from 'react'
import { mcpClientGuides } from '@/data/landingMcp'
import {
  Terminal,
  Copy,
  Check,
  Cpu,
  Bot,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function McpClientGuides() {
  const [activeClientId, setActiveClientId] = useState('claude-desktop')
  const [copied, setCopied] = useState(false)

  const activeClient =
    mcpClientGuides.find((c) => c.id === activeClientId) || mcpClientGuides[0]

  const copyConfig = () => {
    navigator.clipboard.writeText(activeClient.command)
    setCopied(true)
    toast.success(`Copied configuration for ${activeClient.name}!`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="clients" className="py-24 bg-[#070A10] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-pink-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>Multi-Agent Compatibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            Connect Any AI Assistant in 60 Seconds
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Eight official clients, and each connects seamlessly. Claude authenticates over OAuth or HTTP. Cursor and
            Codex take your API key as a header. Zero local servers required.
          </p>
        </div>

        {/* Tabbed Client Selector */}
        <div className="max-w-4xl mx-auto">
          {/* Client Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {mcpClientGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setActiveClientId(guide.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  activeClientId === guide.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-[#0F1422] text-gray-400 hover:text-white hover:bg-[#161E30] border border-white/5'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{guide.name}</span>
              </button>
            ))}
          </div>

          {/* Active Guide Card */}
          <div className="mt-6 rounded-3xl bg-[#0D121F] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-outfit">
                    {activeClient.name} Setup
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold font-mono">
                    {activeClient.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 pt-1 leading-relaxed">
                  {activeClient.description}
                </p>
              </div>

              <div className="flex gap-3 self-start sm:self-auto shrink-0">
                {activeClient.id === 'claude-desktop' && (
                  <Button
                    onClick={() => {
                      toast.success('Open Claude Desktop settings and add this connector URL');
                    }}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl px-4 py-2 font-mono text-xs flex items-center gap-2 shadow-md shadow-orange-600/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    One-Click Setup Guide
                  </Button>
                )}
                <Button
                  onClick={copyConfig}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 font-mono text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Config!' : 'Copy Configuration'}
                </Button>
              </div>
            </div>

            {/* Code / Command Display */}
            <div className="relative rounded-2xl bg-black/80 border border-white/10 p-4 sm:p-5 font-mono text-xs text-indigo-300 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap leading-relaxed select-all">
                {activeClient.command}
              </pre>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
                Installation Walkthrough:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeClient.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
