'use client'

import { useState } from 'react'
import { mcpToolsCatalog } from '@/data/landingMcp'
import {
  Code2,
  Search,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Layers,
  Sparkles,
  ArrowUpRight,
  Eye,
  X,
  FileCode,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const categories = [
  'All',
  'Accounts',
  'Publishing',
  'Content Calendar',
  'Analytics',
  'Comments',
  'Messages and DMs',
  'Videos and Images',
  'Content Extraction',
  'Media and Credits',
  'Reddit',
  'WordPress',
]

export default function McpToolsCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalTool, setActiveModalTool] = useState<any | null>(null)
  const [copiedToolName, setCopiedToolName] = useState<string | null>(null)

  const filteredTools = mcpToolsCatalog.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'All' || tool.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopiedToolName(name)
    toast.success(`Copied tool name: "${name}"`)
    setTimeout(() => setCopiedToolName(null), 2000)
  }

  return (
    <section id="tools" className="py-24 bg-[#070A10] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>32 MCP Tools • Full Specification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            The Exact 32 Tools Your Agent Can Call
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Your AI agent autonomously invokes these tools based on your natural language prompt. Complete JSON-RPC 2.0
            parameter schemas and high-throughput execution.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 32 tools by name or purpose (e.g., 'create_post', 'wordpress', 'reddit', 'analytics')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>

          {/* Categories Pill List */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Count & Grid */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Showing {filteredTools.length} of {mcpToolsCatalog.length} tools</span>
          <span>JSON-RPC 2.0 Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl bg-[#0D121F]/90 border border-white/10 p-5 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#111728] transition-all duration-300 group shadow-lg"
            >
              <div className="space-y-3">
                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-400">
                    {tool.category}
                  </span>
                  <button
                    onClick={() => copyName(tool.name)}
                    className="text-[11px] text-gray-400 hover:text-indigo-300 font-mono flex items-center gap-1 transition-colors"
                    title="Copy tool name"
                  >
                    {copiedToolName === tool.name ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Tool Name & Title */}
                <div>
                  <h3 className="text-sm font-bold text-white font-mono group-hover:text-indigo-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium pt-0.5">{tool.title}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed min-h-[40px]">
                  {tool.description}
                </p>

                {/* Parameters preview */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                    Parameters ({tool.params.length})
                  </span>
                  {tool.params.length === 0 ? (
                    <span className="text-[11px] text-gray-500 italic">No parameters required</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {tool.params.map((p) => (
                        <span
                          key={p.name}
                          className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-gray-300"
                        >
                          {p.name}
                          {p.required && <span className="text-red-400">*</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Inspect Button */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">
                  Standard: JSON-RPC 2.0
                </span>
                <Button
                  onClick={() => setActiveModalTool(tool)}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2.5 rounded-lg flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View Schema
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schema / Payload Drawer Modal */}
      {activeModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D121F] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#131A2B]">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{activeModalTool.name}</h3>
                  <span className="text-xs text-gray-400">Category: {activeModalTool.category}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalTool(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono mb-1">
                  Description
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed">{activeModalTool.description}</p>
              </div>

              {/* Parameter Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono mb-2">
                  Parameters & Types
                </h4>
                {activeModalTool.params.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">None required.</p>
                ) : (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-white/5 text-gray-400 font-mono border-b border-white/10">
                        <tr>
                          <th className="p-2.5">Parameter</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Required</th>
                          <th className="p-2.5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {activeModalTool.params.map((p: any) => (
                          <tr key={p.name} className="text-gray-300">
                            <td className="p-2.5 font-bold text-indigo-300">{p.name}</td>
                            <td className="p-2.5 text-purple-300">{p.type}</td>
                            <td className="p-2.5">
                              {p.required ? (
                                <span className="text-red-400 font-bold">Yes</span>
                              ) : (
                                <span className="text-gray-500">No</span>
                              )}
                            </td>
                            <td className="p-2.5 font-sans text-gray-300">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sample JSON-RPC Payload */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono mb-2">
                  Sample JSON-RPC 2.0 Response
                </h4>
                <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-indigo-300 overflow-x-auto">
                  <pre>{JSON.stringify(activeModalTool.sampleResponse, null, 2)}</pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#131A2B] flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Compatible with Claude Code, Cursor & Codex</span>
              <Button
                onClick={() => {
                  copyName(activeModalTool.name)
                  setActiveModalTool(null)
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl"
              >
                Copy Tool Name & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
