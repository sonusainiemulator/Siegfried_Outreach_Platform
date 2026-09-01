'use client'

import { useState } from 'react'
import {
  useGetUserMcpKeysQuery,
  useCreateMcpKeyMutation,
  useRevokeMcpKeyMutation,
  useGetMcpLogsQuery,
  useGetMcpStatsQuery,
} from '@/redux/api/mcpApi'
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Cpu,
  Terminal,
  Activity,
  ShieldCheck,
  Clock,
  Sparkles,
  Bot,
  RefreshCw,
  ExternalLink,
  Layers,
  Code2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Spinner from '@/components/reusable/Spinner'
import Link from 'next/link'

export default function McpStudio() {
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)
  const [copiedConfigClient, setCopiedConfigClient] = useState<string | null>(null)

  const { data: keysData, isLoading: isLoadingKeys } = useGetUserMcpKeysQuery()
  const { data: statsData } = useGetMcpStatsQuery()
  const { data: logsData, isLoading: isLoadingLogs, refetch: refetchLogs } = useGetMcpLogsQuery({ limit: 20 })

  const [createKey, { isLoading: isSubmittingKey }] = useCreateMcpKeyMutation()
  const [revokeKey, { isLoading: isRevokingKey }] = useRevokeMcpKeyMutation()

  const keys = keysData?.keys || []
  const primaryKey = keys[0]?.key || 'YOUR_API_KEY'

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }

    try {
      const res = await createKey({ name: newKeyName.trim() }).unwrap()
      toast.success(res.message || 'New MCP API Key generated!')
      setNewKeyName('')
      setIsCreatingKey(false)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate key')
    }
  }

  const handleRevoke = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke "${name}"? Any AI agents using this key will immediately lose access.`)) {
      return
    }

    try {
      await revokeKey(id).unwrap()
      toast.success('MCP Key revoked successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to revoke key')
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKeyId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  const copyConfigSnippet = (snippet: string, clientId: string) => {
    navigator.clipboard.writeText(snippet)
    setCopiedConfigClient(clientId)
    toast.success(`Copied ${clientId} configuration!`)
    setTimeout(() => setCopiedConfigClient(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-outfit">
              MCP Agent Studio & Keys
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold font-mono">
              v1.0.0
            </span>
          </div>
          <p className="text-sm text-gray-400 pt-1">
            Generate and manage API keys to connect Claude Code, Cursor, Codex, and Antigravity directly to your 9 social networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/mcp" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 rounded-xl text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public MCP Documentation
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Server Status</span>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-base font-bold text-white">Live & Operational</span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">api.siegfriedoutreach.com</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Active Tools</span>
            <div className="text-xl font-bold text-white pt-0.5">28 Official Tools</div>
            <span className="text-[11px] text-purple-300 font-mono">Across 9 Platforms</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Your Active Keys</span>
            <div className="text-xl font-bold text-white pt-0.5">{keys.length} API Keys</div>
            <span className="text-[11px] text-gray-500 font-mono">Rate limit: 120 req/min</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Protocol Version</span>
            <div className="text-xl font-bold text-white pt-0.5">2024-11-05</div>
            <span className="text-[11px] text-emerald-400 font-mono">&lt; 28ms Latency</span>
          </div>
        </div>
      </div>

      {/* Main Grid: API Keys & Custom Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Key Management */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="rounded-2xl bg-[#0D121F] border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-400" />
                  Your MCP API Keys
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 pt-1">
                  Authenticate your AI agent sessions securely with secret tokens.
                </CardDescription>
              </div>

              {!isCreatingKey && (
                <Button
                  onClick={() => setIsCreatingKey(true)}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Generate New Key
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Create Key Form Drawer */}
              {isCreatingKey && (
                <form
                  onSubmit={handleCreate}
                  className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Create New Key
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingKey(false)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Claude Code Mac Studio / Cursor Production"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreatingKey(false)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmittingKey}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl"
                    >
                      {isSubmittingKey ? 'Generating...' : 'Save & Generate Key'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Keys List */}
              {isLoadingKeys ? (
                <div className="py-12 flex justify-center">
                  <Spinner size="md" />
                </div>
              ) : keys.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 text-gray-500 flex items-center justify-center mx-auto">
                    <Key className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No MCP Keys Generated Yet</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Click &ldquo;Generate New Key&rdquo; to create your first credential and start connecting your AI agents.
                  </p>
                  <Button
                    onClick={() => setIsCreatingKey(true)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs"
                  >
                    Create First Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {keys.map((k) => (
                    <div
                      key={k.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-indigo-500/30 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{k.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                          <code className="text-indigo-300 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                            {k.maskedKey}
                          </code>
                          <button
                            onClick={() => copyToClipboard(k.key, k.id)}
                            className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedKeyId === k.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedKeyId === k.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-500 font-mono pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <span className="text-[11px]">Used: {k.usageCount} times</span>
                        <Button
                          onClick={() => handleRevoke(k.id, k.name)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Call Audit Log */}
          <Card className="rounded-2xl bg-[#0D121F] border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  Recent MCP Tool Invocations
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 pt-1">
                  Live audit log of all tool calls made by your connected AI agents.
                </CardDescription>
              </div>

              <Button
                onClick={() => refetchLogs()}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white rounded-lg h-8"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {isLoadingLogs ? (
                <div className="py-8 flex justify-center">
                  <Spinner size="sm" />
                </div>
              ) : !logsData?.logs || logsData.logs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500 font-mono">
                  No MCP tool calls logged yet. Call any tool from Claude or Cursor to see live logs here.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {logsData.logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="font-bold text-white">{log.toolName}</span>
                        <span className="text-[10px] text-gray-500">[{log.clientAgent}]</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                        <span>{log.durationMs}ms</span>
                        <span className="text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: 1-Click Configurations with User Key */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl bg-[#0D121F] border-white/10 shadow-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
                <Code2 className="w-5 h-5 text-indigo-400" />
                Personalized 1-Click Configs
              </h3>
              <p className="text-xs text-gray-400 pt-1 leading-relaxed">
                Copy pre-filled configurations with your active key pre-injected.
              </p>
            </div>

            {/* Claude Code */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Claude Code Command</span>
                <button
                  onClick={() =>
                    copyConfigSnippet(
                      'claude mcp add --transport http Siegfried https://api.siegfriedoutreach.com/mcp',
                      'Claude Code'
                    )
                  }
                  className="text-[11px] text-gray-400 hover:text-white font-mono flex items-center gap-1"
                >
                  {copiedConfigClient === 'Claude Code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConfigClient === 'Claude Code' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                claude mcp add --transport http Siegfried https://api.siegfriedoutreach.com/mcp
              </div>
            </div>

            {/* Cursor Config */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Cursor (`mcp.json`)</span>
                <button
                  onClick={() =>
                    copyConfigSnippet(
                      JSON.stringify(
                        {
                          mcpServers: {
                            siegfried: {
                              url: 'https://api.siegfriedoutreach.com/mcp',
                              headers: { 'siegfried-api-key': primaryKey },
                            },
                          },
                        },
                        null,
                        2
                      ),
                      'Cursor'
                    )
                  }
                  className="text-[11px] text-gray-400 hover:text-white font-mono flex items-center gap-1"
                >
                  {copiedConfigClient === 'Cursor' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConfigClient === 'Cursor' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                <pre>{JSON.stringify(
                  {
                    mcpServers: {
                      siegfried: {
                        url: 'https://api.siegfriedoutreach.com/mcp',
                        headers: { 'siegfried-api-key': primaryKey },
                      },
                    },
                  },
                  null,
                  2
                )}</pre>
              </div>
            </div>

            {/* Antigravity Config */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Antigravity IDE</span>
                <button
                  onClick={() =>
                    copyConfigSnippet(
                      JSON.stringify(
                        {
                          mcpServers: {
                            siegfried: {
                              url: 'https://api.siegfriedoutreach.com/mcp',
                              headers: { 'siegfried-api-key': primaryKey },
                            },
                          },
                        },
                        null,
                        2
                      ),
                      'Antigravity'
                    )
                  }
                  className="text-[11px] text-gray-400 hover:text-white font-mono flex items-center gap-1"
                >
                  {copiedConfigClient === 'Antigravity' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConfigClient === 'Antigravity' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                <pre>{JSON.stringify(
                  {
                    mcpServers: {
                      siegfried: {
                        url: 'https://api.siegfriedoutreach.com/mcp',
                        headers: { 'siegfried-api-key': primaryKey },
                      },
                    },
                  },
                  null,
                  2
                )}</pre>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
