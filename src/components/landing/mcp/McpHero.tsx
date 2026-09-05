'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import {
  Terminal,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  Cpu,
  Layers,
  CheckCircle2,
  Share2,
} from 'lucide-react'
import { toast } from 'sonner'
import { mcpPlatforms } from '@/data/landingMcp'

const clientQuickPresets = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    cmd: 'claude mcp add --transport http Siegfried https://api.siegfriedoutreach.com/mcp',
  },
  {
    id: 'cursor',
    label: 'Cursor JSON',
    cmd: '{\n  "mcpServers": {\n    "siegfried": {\n      "url": "https://api.siegfriedoutreach.com/mcp",\n      "headers": { "siegfried-api-key": "YOUR_API_KEY" }\n    }\n  }\n}',
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    cmd: 'https://api.siegfriedoutreach.com/mcp',
  },
  {
    id: 'antigravity',
    label: 'Antigravity',
    cmd: '{\n  "mcpServers": {\n    "siegfried": {\n      "url": "https://api.siegfriedoutreach.com/mcp",\n      "headers": { "siegfried-api-key": "YOUR_API_KEY" }\n    }\n  }\n}',
  },
  {
    id: 'codex',
    label: 'OpenAI Codex',
    cmd: 'URL: https://api.siegfriedoutreach.com/mcp\nHeader: siegfried-api-key: YOUR_API_KEY',
  },
]

export default function McpHero() {
  const [selectedClient, setSelectedClient] = useState('claude-desktop')
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedPreset, setCopiedPreset] = useState(false)

  const currentPreset = clientQuickPresets.find((p) => p.id === selectedClient) || clientQuickPresets[0]

  const copyUrl = () => {
    navigator.clipboard.writeText('https://api.siegfriedoutreach.com/mcp')
    setCopiedEndpoint(true)
    toast.success('MCP Server URL copied to clipboard!')
    setTimeout(() => setCopiedEndpoint(false), 2000)
  }

  const copyPresetCommand = () => {
    navigator.clipboard.writeText(currentPreset.cmd)
    setCopiedPreset(true)
    toast.success(`Copied configuration for ${currentPreset.label}!`)
    setTimeout(() => setCopiedPreset(false), 2000)
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#070A10]">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-950/50 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hosted MCP Server • 32 Tools • 11 Platforms • JSON-RPC 2.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-outfit">
            Social Media MCP Server:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Publish to 11 Platforms
            </span>{' '}
            With Any AI Agent
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Claude can write a post. It cannot publish one.{' '}
            <strong className="text-white font-semibold">Siegfried MCP closes that gap</strong>. 32 official tools,
            zero web scraping, unmetered publishing, and real-time analytics for{' '}
            <span className="text-indigo-300 font-medium">Claude Code, Cursor, Codex, Antigravity</span>, and more.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-semibold rounded-xl px-7 py-6 shadow-xl shadow-indigo-500/25 flex items-center gap-2 text-base group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Connect Your Agent Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>

            <a href="#playground">
              <Button
                variant="outline"
                size="lg"
                className="bg-[#121824]/90 hover:bg-[#1A2233] border-white/15 text-gray-200 font-semibold rounded-xl px-6 py-6 backdrop-blur-md flex items-center gap-2 text-base"
              >
                <Play className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                Try Interactive Playground
              </Button>
            </a>
            
            <a href="#clients">
              <Button
                variant="outline"
                size="lg"
                className="bg-[#121824]/90 hover:bg-[#1A2233] border-white/15 text-gray-200 font-semibold rounded-xl px-6 py-6 backdrop-blur-md flex items-center gap-2 text-base"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                View Connection Guides
              </Button>
            </a>

          </div>

          {/* Interactive Server Box & Command Generator */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-[#0D121F]/90 border border-white/10 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 text-left relative group">
              {/* Header inside code box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-gray-400 font-semibold pl-2">
                    Hosted Endpoint (Transport: HTTP / SSE)
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Operational • &lt;30ms Latency
                  </span>
                </div>
              </div>

              {/* Endpoint URL Row */}
              <div className="py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 flex-1 font-mono text-sm text-indigo-300 overflow-x-auto">
                  <span className="text-gray-500 select-none">POST/GET</span>
                  <span className="select-all font-semibold">https://api.siegfriedoutreach.com/mcp</span>
                </div>

                <Button
                  onClick={copyUrl}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-mono shadow-md shadow-indigo-600/30"
                >
                  {copiedEndpoint ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copiedEndpoint ? 'Copied URL!' : 'Copy Endpoint'}
                </Button>
              </div>

              {/* Client Snippet Tabs */}
              <div className="pt-2">
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
                  {clientQuickPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedClient(preset.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                        selectedClient === preset.id
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Snippet Code block */}
                <div className="relative mt-2 p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed select-all">{currentPreset.cmd}</pre>
                  <button
                    onClick={copyPresetCommand}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedPreset ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Platforms Row */}
          <div className="pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pb-4">
              Direct Publishing On 9 Official Platform APIs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {mcpPlatforms.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
