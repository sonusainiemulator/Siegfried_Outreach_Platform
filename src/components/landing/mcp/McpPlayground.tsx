'use client'

import { useState } from 'react'
import { mcpToolsCatalog } from '@/data/landingMcp'
import {
  Play,
  Terminal,
  Sparkles,
  Code2,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bot,
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTestMcpToolMutation } from '@/redux/api/mcpApi'
import { toast } from 'sonner'

export default function McpPlayground() {
  const [selectedToolName, setSelectedToolName] = useState('siegfried_get_user')
  const [paramsJson, setParamsJson] = useState('{}')
  const [responseView, setResponseView] = useState<'formatted' | 'jsonrpc'>('formatted')
  const [copiedResponse, setCopiedResponse] = useState(false)

  const [testTool, { data: testResult, isLoading: isExecuting }] = useTestMcpToolMutation()

  const selectedTool =
    mcpToolsCatalog.find((t) => t.name === selectedToolName) || mcpToolsCatalog[0]

  const handleSelectTool = (name: string) => {
    setSelectedToolName(name)
    const tool = mcpToolsCatalog.find((t) => t.name === name)
    if (tool) {
      const defaultArgs: Record<string, any> = {}
      if (name.includes('create_source')) {
        defaultArgs.sourceType = 'youtube_url'
        defaultArgs.sourceUrl = 'https://youtube.com/watch?v=agentic-social-media'
        defaultArgs.targetPlatforms = ['twitter', 'linkedin', 'instagram']
      } else if (name.includes('create_visual')) {
        defaultArgs.prompt = '3 Ways AI Agents Are Automating Social Media Marketing in 2026'
        defaultArgs.aspectRatio = '1:1'
        defaultArgs.templateId = 'tpl_minimal_dark_quote'
      } else if (name.includes('create_post')) {
        defaultArgs.title = 'Autonomous Agent Launch'
        defaultArgs.content = 'Publishing to 9 platforms simultaneously via Siegfried MCP server!'
        defaultArgs.platforms = [{ platform: 'x', postType: 'post' }, { platform: 'linkedin', postType: 'post' }]
      } else if (name.includes('top_posts')) {
        defaultArgs.limit = 5
        defaultArgs.sortBy = 'engagement'
      }
      setParamsJson(JSON.stringify(defaultArgs, null, 2))
    }
  }

  const handleRunTest = async () => {
    let parsedArgs = {}
    try {
      if (paramsJson.trim()) {
        parsedArgs = JSON.parse(paramsJson)
      }
    } catch (e: any) {
      toast.error('Invalid JSON parameters: ' + e.message)
      return
    }

    try {
      await testTool({
        toolName: selectedToolName,
        args: parsedArgs,
      }).unwrap()
      toast.success(`Executed ${selectedToolName} successfully!`)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Tool execution error')
    }
  }

  const copyResult = () => {
    const textToCopy = testResult
      ? JSON.stringify(testResult, null, 2)
      : JSON.stringify(selectedTool.sampleResponse, null, 2)
    navigator.clipboard.writeText(textToCopy)
    setCopiedResponse(true)
    toast.success('Response JSON copied to clipboard!')
    setTimeout(() => setCopiedResponse(false), 2000)
  }

  // Parse result content if available
  let parsedContentObj = selectedTool.sampleResponse
  if (testResult?.result?.content?.[0]?.text) {
    try {
      parsedContentObj = JSON.parse(testResult.result.content[0].text)
    } catch (e) {
      parsedContentObj = testResult.result.content[0].text
    }
  }

  return (
    <section id="playground" className="py-24 bg-[#090D16] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Interactive Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            Test Any MCP Tool In Your Browser
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Simulate how Claude, Cursor, or Codex will interact with our server. Select a tool, adjust parameters, and
            execute a live JSON-RPC 2.0 request.
          </p>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { label: '�� Get User & Credits', tool: 'siegfried_get_user' },
              { label: '🎬 Repurpose YouTube', tool: 'siegfried_create_source' },
              { label: '🎨 AI Visual Generator', tool: 'siegfried_create_visual' },
              { label: '📊 Top Posts Analytics', tool: 'siegfried_list_top_posts' },
              { label: '🚀 Create Multi-Post', tool: 'siegfried_create_post' },
            ].map((preset) => (
              <button
                key={preset.tool}
                onClick={() => handleSelectTool(preset.tool)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedToolName === preset.tool
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Playground Main Card */}
        <div className="rounded-3xl bg-[#0D121F] border border-white/10 overflow-hidden shadow-2xl shadow-black/80">
          {/* Top Bar */}
          <div className="p-4 sm:p-5 bg-[#121829] border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs font-mono text-gray-400 font-semibold uppercase tracking-wider shrink-0">
                Active Tool:
              </span>
              <select
                value={selectedToolName}
                onChange={(e) => handleSelectTool(e.target.value)}
                className="bg-[#080B12] border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 w-full max-w-md cursor-pointer"
              >
                {mcpToolsCatalog.map((t) => (
                  <option key={t.name} value={t.name}>
                    [{t.category}] {t.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleRunTest}
              disabled={isExecuting}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-6 font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              {isExecuting ? 'Executing...' : 'Execute Tool Call'}
            </Button>
          </div>

          {/* Dual Panel Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 min-h-[480px]">
            {/* Left Panel: Tool Info & Parameters Editor */}
            <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-[10px] font-semibold text-indigo-400 font-mono">
                      {selectedTool.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Protocol: JSON-RPC 2.0</span>
                  </div>
                  <h3 className="text-base font-bold text-white pt-1">{selectedTool.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed pt-1">{selectedTool.description}</p>
                </div>

                {/* Parameters Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-300 font-mono flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      JSON-RPC Arguments (`params.arguments`):
                    </label>
                    <button
                      onClick={() => handleSelectTool(selectedToolName)}
                      className="text-[11px] text-gray-500 hover:text-indigo-300 font-mono flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div className="relative rounded-xl bg-black/60 border border-white/10 p-3 font-mono text-xs text-indigo-200">
                    <textarea
                      rows={8}
                      value={paramsJson}
                      onChange={(e) => setParamsJson(e.target.value)}
                      className="w-full bg-transparent resize-none focus:outline-none font-mono text-xs text-indigo-200 leading-relaxed"
                      placeholder="{}"
                    />
                  </div>
                </div>

                {/* Parameter Schema Reference */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                    Schema Requirements:
                  </span>
                  {selectedTool.params.length === 0 ? (
                    <span className="text-[11px] text-gray-500 italic">No parameters required.</span>
                  ) : (
                    <div className="space-y-1 text-xs">
                      {selectedTool.params.map((p) => (
                        <div key={p.name} className="flex items-center gap-2 text-[11px] font-mono text-gray-300">
                          <span className="text-indigo-400 font-bold">{p.name}</span>
                          <span className="text-gray-500">({p.type})</span>
                          <span className="text-gray-400 font-sans">- {p.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Runs securely on sandbox user context</span>
              </div>
            </div>

            {/* Right Panel: JSON-RPC Result Inspector */}
            <div className="p-5 sm:p-6 flex flex-col justify-between bg-[#080C14]">
              <div className="space-y-4">
                {/* Result Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setResponseView('formatted')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        responseView === 'formatted'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      Formatted Output
                    </button>
                    <button
                      onClick={() => setResponseView('jsonrpc')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        responseView === 'jsonrpc'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      Raw JSON-RPC 2.0
                    </button>
                  </div>

                  <button
                    onClick={copyResult}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 font-mono bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Display Area */}
                {responseView === 'formatted' ? (
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-gray-200 overflow-y-auto max-h-[380px] leading-relaxed">
                    <pre className="whitespace-pre-wrap select-all">
                      {typeof parsedContentObj === 'object'
                        ? JSON.stringify(parsedContentObj, null, 2)
                        : String(parsedContentObj)}
                    </pre>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-indigo-300 overflow-y-auto max-h-[380px] leading-relaxed">
                    <pre className="whitespace-pre-wrap select-all">
                      {JSON.stringify(
                        testResult || {
                          jsonrpc: '2.0',
                          id: 1,
                          result: {
                            content: [
                              {
                                type: 'text',
                                text: JSON.stringify(selectedTool.sampleResponse, null, 2),
                              },
                            ],
                          },
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-gray-400 font-mono border-t border-white/5">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  ● Status: 200 OK
                </span>
                <span>Payload Standard: MCP 2024-11-05</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
