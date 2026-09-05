'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useGetUserMcpKeysQuery,
  useCreateMcpKeyMutation,
  useRevokeMcpKeyMutation,
  useGetMcpLogsQuery,
  useGetMcpStatsQuery,
} from '@/redux/api/mcpApi'
import {
  mcpPlatforms,
  mcpToolsCatalog,
  mcpClientGuides,
} from '@/data/landingMcp'
import { usePermission } from '@/hooks/usePermission'
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
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Share2,
  Wrench,
  Shield,
  Zap,
  BookOpen,
  Send,
  Users,
  Compass,
  Laptop,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Spinner from '@/components/reusable/Spinner'
import Link from 'next/link'

// Extended guide details for in-app assistant connection
const EXTENDED_CLIENT_GUIDES = [
  {
    id: 'claude-desktop',
    name: 'Claude Desktop & Cowork',
    badge: 'Custom Connector / OAuth',
    icon: 'Bot',
    recommended: true,
    transport: 'HTTP / SSE',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Connect Claude Desktop app directly to publish, schedule, and read analytics across all 9 social networks.',
    snippetType: 'URL',
    getConfig: (_key: string) => 'https://api.siegfriedoutreach.com/mcp',
    instructions: [
      'Open Claude Desktop on your computer (Mac or Windows).',
      'Go to Claude Desktop Settings > Connectors (or Developer Settings).',
      'Click "Add Custom Connector".',
      'Enter Connector URL: https://api.siegfriedoutreach.com/mcp',
      'Click Connect and approve access. Claude will now recognize all 32 Siegfried social tools.',
    ],
    samplePrompts: [
      'List all my connected social media accounts and their follower counts.',
      'Draft a 5-slide visual carousel about AI agents and schedule for Instagram tomorrow at 10 AM.',
      'Check recent performance and engagement on my LinkedIn and X accounts.',
    ],
  },
  {
    id: 'claude-code',
    name: 'Claude Code (CLI)',
    badge: 'Terminal CLI Tool',
    icon: 'Terminal',
    recommended: true,
    transport: 'Streamable HTTP',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'One terminal command to hook Claude Code command-line agent directly into your social channels.',
    snippetType: 'Shell Command',
    getConfig: (_key: string) =>
      'claude mcp add --transport http Siegfried https://api.siegfriedoutreach.com/mcp',
    instructions: [
      'Open your terminal where Claude Code CLI is installed.',
      'Run the single command shown below to register the Siegfried MCP server.',
      'Open Claude Code and enter /mcp to authenticate your account session.',
      'Claude CLI can now inspect your code repository and publish release updates directly to social media.',
    ],
    samplePrompts: [
      'Review my latest git commit and post an update thread to X with key highlights.',
      'Schedule a changelog announcement across LinkedIn, X, and Facebook.',
      'Draft a technical breakdown of this repo and schedule as a LinkedIn post.',
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor IDE',
    badge: 'mcp.json Header Auth',
    icon: 'Code2',
    recommended: true,
    transport: 'HTTP + Header',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Give Cursor AI Composer direct social media superpowers right from inside your coding workspace.',
    snippetType: 'JSON Config',
    getConfig: (key: string) =>
      JSON.stringify(
        {
          mcpServers: {
            siegfried: {
              url: 'https://api.siegfriedoutreach.com/mcp',
              headers: {
                'siegfried-api-key': key || 'YOUR_API_KEY',
              },
            },
          },
        },
        null,
        2
      ),
    instructions: [
      'Open Cursor Settings (Cmd+, or Ctrl+,) > Features > MCP.',
      'Click "Add New MCP Server" or edit ~/.cursor/mcp.json directly.',
      'Paste the JSON configuration with your pre-injected API key below.',
      'Restart Cursor or click the reload button. Cursor Composer will now display 32 active social tools.',
    ],
    samplePrompts: [
      'Compose a launch announcement based on our latest feature in /src and schedule to LinkedIn.',
      'Generate a Twitter/X thread announcing our open source milestone with metrics.',
      'Fetch recent comments on our social channels and summarize customer feedback.',
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT / Custom GPTs',
    badge: 'Custom Action / Developer Mode',
    icon: 'MessageSquare',
    recommended: false,
    transport: 'OpenAPI / HTTP',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Connect ChatGPT via Custom GPT Actions or Developer Mode web connector to execute social tools.',
    snippetType: 'Endpoint & Header',
    getConfig: (key: string) =>
      `URL: https://api.siegfriedoutreach.com/mcp\nHeader: siegfried-api-key: ${key || 'YOUR_API_KEY'}`,
    instructions: [
      'In ChatGPT web interface, navigate to Explore GPTs > Create a GPT > Configure.',
      'Under Actions, click "Create New Action".',
      'Set Server URL to https://api.siegfriedoutreach.com/mcp and configure Authentication (API Key).',
      'Set Auth type to Custom Header: siegfried-api-key with your API key.',
      'Test the action in the preview playground and publish your custom Social Media Agent GPT.',
    ],
    samplePrompts: [
      'Create an engaging product showcase caption and publish to Instagram with image.',
      'Repurpose this article into a LinkedIn post and schedule for Wednesday afternoon.',
      'Create 3 pin descriptions with board keywords and publish to Pinterest.',
    ],
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    badge: 'Agentic IDE Settings',
    icon: 'Cpu',
    recommended: false,
    transport: 'HTTP + Header',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Seamless integration with Google Antigravity agentic coding environment and sidecars.',
    snippetType: 'JSON Config',
    getConfig: (key: string) =>
      JSON.stringify(
        {
          mcpServers: {
            siegfried: {
              url: 'https://api.siegfriedoutreach.com/mcp',
              headers: {
                'siegfried-api-key': key || 'YOUR_API_KEY',
              },
            },
          },
        },
        null,
        2
      ),
    instructions: [
      'Open Antigravity IDE Settings > MCP Servers.',
      'Add a new server named "siegfried".',
      'Paste the JSON configuration snippet with your active API key.',
      'Save and reload. Antigravity can now autonomously interact with your social media marketing channels.',
    ],
    samplePrompts: [
      'Run social media analytics for the past 30 days and summarize our top performing hooks.',
      'Check scheduled queue for the upcoming week and identify open posting slots.',
      'Auto-generate multi-channel captions for tomorrow\'s scheduled releases.',
    ],
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    badge: 'Streamable HTTP',
    icon: 'Terminal',
    recommended: false,
    transport: 'Streamable HTTP',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Codex MCP transport configuration for terminal or automated server workflows.',
    snippetType: 'Config Fields',
    getConfig: (key: string) =>
      `Server URL: https://api.siegfriedoutreach.com/mcp\nTransport: Streamable HTTP\nHeader Name: siegfried-api-key\nHeader Value: ${key || 'YOUR_API_KEY'}`,
    instructions: [
      'In Codex MCP configuration settings, select transport "Streamable HTTP".',
      'Set Server URL to https://api.siegfriedoutreach.com/mcp.',
      'Add custom header: siegfried-api-key with your API token.',
      'Save configuration. Codex is now authenticated and ready to run social publishing tools.',
    ],
    samplePrompts: [
      'Schedule a week of content across my LinkedIn and X accounts.',
      'Draft an infographic text outline and post to Pinterest and LinkedIn.',
      'Fetch top questions from recent comments on Instagram and suggest answers.',
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf / Cascade',
    badge: 'Cascade MCP Settings',
    icon: 'Laptop',
    recommended: false,
    transport: 'JSON Config',
    endpoint: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Add to Windsurf Cascade editor to draft, format, and push social posts while coding.',
    snippetType: 'JSON Config',
    getConfig: (key: string) =>
      JSON.stringify(
        {
          mcpServers: {
            siegfried: {
              url: 'https://api.siegfriedoutreach.com/mcp',
              headers: {
                'siegfried-api-key': key || 'YOUR_API_KEY',
              },
            },
          },
        },
        null,
        2
      ),
    instructions: [
      'Open Windsurf Settings > MCP Servers (or ~/.codeium/windsurf/mcp_config.json).',
      'Paste the JSON configuration snippet into the mcpServers block.',
      'Restart the Cascade session.',
      'Prompt Cascade directly to draft release notes and post to your connected social channels.',
    ],
    samplePrompts: [
      'Draft a release announcement from this project and post to X and LinkedIn.',
      'Create 3 carousel slides summarizing our system architecture and schedule to Instagram.',
      'Check analytics for our recent launch post on Reddit and X.',
    ],
  },
  {
    id: 'siegfried-assistant',
    name: 'Siegfried In-App Chat Assistant',
    badge: 'Built-in Native Chat',
    icon: 'Sparkles',
    recommended: true,
    transport: 'Native Internal Bridge',
    endpoint: 'In-App Dashboard',
    description: 'Use the built-in Siegfried AI Chat Assistant with zero setup required—MCP tools are pre-integrated!',
    snippetType: 'In-App Action',
    getConfig: (_key: string) => 'Navigate to: /ai-chat-assistant',
    instructions: [
      'No API key or external configuration required!',
      'Click the button below to navigate directly to the Siegfried AI Chat Assistant.',
      'Select any assistant (e.g. GPT-4, Claude, or Custom Bot).',
      'Directly prompt the assistant to publish posts, schedule campaigns, or check your connected channels.',
    ],
    samplePrompts: [
      'Publish this draft post to my connected Instagram and LinkedIn accounts right now.',
      'Show me all connected social media channels and their verification status.',
      'Generate a 7-day content schedule for X and schedule each post at peak engagement hours.',
    ],
  },
]

// Talent Workflow Steps & Prompt Library
const TALENT_PROMPT_LIBRARY = [
  {
    category: 'Carousels & Graphics',
    title: '5-Slide Visual Educational Carousel',
    prompt:
      'Design a 5-slide visual carousel for Instagram and LinkedIn on "[TOPIC]". For each slide, write a captivating headline, 2 bullet points, and visual design layout advice. Schedule the carousel for tomorrow at 10 AM.',
  },
  {
    category: 'Threads & Copy',
    title: 'High-Retention X (Twitter) Thread',
    prompt:
      'Convert this blog update: "[PASTE TEXT]" into a punchy 6-tweet thread with a strong hook, 4 core value drops, key takeaways, and a clear call-to-action. Add relevant hashtags and schedule for 3 PM today.',
  },
  {
    category: 'Cross-Platform Publishing',
    title: 'Multi-Channel Repurposing Blitz',
    prompt:
      'Take this product announcement: "[PASTE TEXT]". Adapt and publish it simultaneously across LinkedIn (professional tone), X (punchy thread), Facebook Page (community-friendly), and Instagram (caption with emoji cues).',
  },
  {
    category: 'Video & Shorts',
    title: 'YouTube Shorts & TikTok Viral Hook Script',
    prompt:
      'Write a 45-second fast-paced script for YouTube Shorts and TikTok on "[TOPIC]". Include a 3-second visual hook, on-screen text instructions, caption with 5 high-traffic hashtags, and draft the post for scheduling.',
  },
  {
    category: 'Scheduling & Queue Management',
    title: 'Peak Hours 7-Day Auto-Scheduler',
    prompt:
      'Inspect my connected social accounts on Instagram, LinkedIn, and X. Draft 7 educational micro-posts on our industry niche and schedule them automatically across the next 7 days at peak engagement hours.',
  },
  {
    category: 'Engagement & DMs',
    title: 'Comments & DM Lead Trigger Automation',
    prompt:
      'Fetch the latest comments on our recent Instagram and YouTube posts. Categorize them into Questions, Compliments, and Inquiries. Draft warm, helpful responses and set up a keyword DM trigger for anyone commenting "GUIDE".',
  },
  {
    category: 'Analytics & ROI',
    title: 'Weekly Social ROI & Performance Breakdown',
    prompt:
      'Analyze the performance of all posts published across LinkedIn, X, and Instagram in the past 14 days. Show the highest performing post by engagement rate, best posting time, audience growth, and 3 specific recommendations for next week.',
  },
  {
    category: 'Blog & Articles',
    title: 'WordPress Long-Form SEO Article & Featured Media',
    prompt:
      'Write a comprehensive, SEO-optimized 1,200-word article on "[TOPIC]". Format with H2/H3 subheadings, actionable bullet points, meta description, and publish it directly to our connected WordPress site using siegfried_publish_wordpress as a "draft" with tags and categories.',
  },
  {
    category: 'Discussions & Communities',
    title: 'Targeted Reddit Discussion & Subreddit Value Post',
    prompt:
      'First, list our connected subreddits using siegfried_list_subreddits. Then draft an authentic, non-promotional value-first discussion post for r/[SUBREDDIT] sharing real-world insights on "[TOPIC]". Publish or submit using siegfried_publish_reddit.',
  },
  {
    category: 'Cross-Platform Publishing',
    title: 'Reddit & Pinterest Discovery Campaign',
    prompt:
      'Draft an informative, value-first Reddit post for r/marketing discussing "[TOPIC]" without sounding promotional. Then create a high-contrast Pinterest pin title, description, and board recommendation for the same topic.',
  },
]

export default function McpStudio() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAdmin } = usePermission()

  const tabParam = searchParams.get('tab') as 'connect' | 'talent' | 'keys' | 'admin' | null
  const [activeTab, setActiveTabState] = useState<'connect' | 'talent' | 'keys' | 'admin'>(() => {
    if (tabParam && ['connect', 'talent', 'keys', 'admin'].includes(tabParam)) {
      return tabParam
    }
    return 'connect'
  })

  // Sync state if URL query param changes
  useEffect(() => {
    if (tabParam && ['connect', 'talent', 'keys', 'admin'].includes(tabParam) && tabParam !== activeTab) {
      setActiveTabState(tabParam)
    }
  }, [tabParam, activeTab])

  const setActiveTab = (tab: 'connect' | 'talent' | 'keys' | 'admin') => {
    setActiveTabState(tab)
    const newUrl = tab === 'connect' ? '/mcp-studio' : `/mcp-studio?tab=${tab}`
    router.push(newUrl, { scroll: false })
  }

  const [selectedClient, setSelectedClient] = useState<string>('claude-desktop')
  const [toolSearch, setToolSearch] = useState('')
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all')
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('All')
  const [logStatusFilter, setLogStatusFilter] = useState<'all' | 'success' | 'failed'>('all')
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)
  const [copiedSnippet, setCopiedSnippet] = useState(false)
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null)

  const { data: keysData, isLoading: isLoadingKeys } = useGetUserMcpKeysQuery()
  const { data: statsData } = useGetMcpStatsQuery()
  const { data: logsData, isLoading: isLoadingLogs, refetch: refetchLogs } = useGetMcpLogsQuery({ limit: 25 })

  const [createKey, { isLoading: isSubmittingKey }] = useCreateMcpKeyMutation()
  const [revokeKey, { isLoading: isRevokingKey }] = useRevokeMcpKeyMutation()

  const keys = keysData?.keys || []
  const primaryKey = keys[0]?.key || ''
  const userRole = user?.role || 'user'
  const isUserAdmin = isAdmin()

  const currentGuide =
    EXTENDED_CLIENT_GUIDES.find((g) => g.id === selectedClient) || EXTENDED_CLIENT_GUIDES[0]

  // Filter tools for the tools catalog
  const filteredTools = useMemo(() => {
    return mcpToolsCatalog.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.title.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.description.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.category.toLowerCase().includes(toolSearch.toLowerCase())

      const matchesPlatform =
        selectedPlatformFilter === 'all' ||
        tool.category.toLowerCase() === selectedPlatformFilter.toLowerCase()

      return matchesSearch && matchesPlatform
    })
  }, [toolSearch, selectedPlatformFilter])

  // Filter prompts by category
  const filteredPrompts = useMemo(() => {
    if (selectedPromptCategory === 'All') return TALENT_PROMPT_LIBRARY
    return TALENT_PROMPT_LIBRARY.filter((p) => p.category === selectedPromptCategory)
  }, [selectedPromptCategory])

  // Filter logs by status
  const displayedLogs = useMemo(() => {
    const rawLogs = logsData?.logs || []
    if (logStatusFilter === 'all') return rawLogs
    return rawLogs.filter((l) => l.status === logStatusFilter)
  }, [logsData?.logs, logStatusFilter])

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
    if (
      !confirm(
        `Are you sure you want to revoke "${name}"? Any AI agents using this key will immediately lose access.`
      )
    ) {
      return
    }

    try {
      await revokeKey(id).unwrap()
      toast.success('MCP Key revoked successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to revoke key')
    }
  }

  const copyToClipboard = (text: string, id: string, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text)
    setCopiedKeyId(id)
    toast.success(message)
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippet(true)
    toast.success('Configuration copied to clipboard!')
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  const copyPrompt = (prompt: string, idx: number, message = 'Prompt copied to clipboard!') => {
    navigator.clipboard.writeText(prompt)
    setCopiedPromptIdx(idx)
    toast.success(message)
    setTimeout(() => setCopiedPromptIdx(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in p-2 sm:p-4 text-white">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1528] via-[#12102A] to-[#0A1220] border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Model Context Protocol (MCP)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Server Online
              </span>
              {isUserAdmin ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Operator Access
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Talent & Creator Mode
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-outfit">
              Connect Any AI Assistant to Your Social Media
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Model Context Protocol (MCP) is the open standard that connects Claude Desktop, Cursor, ChatGPT, Codex, and Antigravity directly to your 9 connected social networks. Publish posts, generate carousels, schedule drops, and analyze engagement in natural language.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => copyToClipboard('https://api.siegfriedoutreach.com/mcp', 'endpoint-copy', 'Copied MCP Server URL!')}
              variant="outline"
              size="sm"
              className="bg-white/5 hover:bg-white/10 border-white/15 text-gray-200 rounded-xl text-xs flex items-center gap-2 h-10 px-4"
            >
              {copiedKeyId === 'endpoint-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="font-mono">api.siegfriedoutreach.com/mcp</span>
            </Button>

            <Link href="/ai-chat-assistant">
              <Button
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs flex items-center gap-2 h-10 px-4 shadow-lg shadow-indigo-600/25"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Launch In-App Chat
              </Button>
            </Link>

            <Link href="/mcp" target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5 h-10"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Server Status</span>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-base font-bold text-white">Live & Operational</span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">&lt; 28ms Latency</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">MCP Tool Capabilities</span>
            <div className="text-xl font-bold text-white pt-0.5">32 Native Tools</div>
            <span className="text-[11px] text-purple-300 font-mono">Across 11 Social Platforms</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Your API Keys</span>
            <div className="text-xl font-bold text-white pt-0.5">{keys.length} Active Keys</div>
            <span className="text-[11px] text-gray-500 font-mono">120 requests / min limit</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D121F] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">Assistant Clients</span>
            <div className="text-xl font-bold text-white pt-0.5">8 Supported Clients</div>
            <span className="text-[11px] text-emerald-400 font-mono">Protocol 2024-11-05</span>
          </div>
        </div>
      </div>

      {/* Interactive Role Guide & Mode Selector: How Admin & Talent Users Use MCP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 sm:p-6 rounded-3xl bg-[#090D18]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Talent Guide Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#0E1528] to-indigo-950/30 border border-purple-500/20 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-semibold border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                For Talent & Creators
              </span>
              <span className="text-[11px] text-gray-400 font-mono">0 Manual UI Clicks</span>
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">
              How Talent Uses MCP: Conversational Social Co-Pilot
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Connect Claude Desktop, Cursor, or ChatGPT to publish, schedule carousels, run auto-reply campaigns, and track analytics across 9 social networks using natural language prompts.
            </p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>One-shot cross-platform publishing & scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Multi-slide Instagram & LinkedIn carousel creation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Curated prompt templates with 1-click clipboard copy</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <Button
              onClick={() => setActiveTab('talent')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold h-9 px-4 flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Talent Playbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Link href="/ai-chat-assistant">
              <Button
                variant="outline"
                className="border-white/10 text-gray-300 hover:text-white rounded-xl text-xs h-9 px-3"
              >
                In-App AI Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin Guide Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-[#0E1528] to-orange-950/20 border border-amber-500/20 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                For Admin Operators
              </span>
              <span className="text-[11px] text-gray-400 font-mono">120 req/min Rate Limit</span>
            </div>
            <h3 className="text-lg font-bold text-white font-outfit">
              How Admins Use MCP: Governance, Auditing & Schemas
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Supervise server telemetry, inspect JSON schemas for all 32 tools, audit live tool invocations across the team, and manage API keys with instant revocation switches.
            </p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Live tool execution audit logs with caller & duration telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Run official local CLI inspector (`npx @modelcontextprotocol/inspector`)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>32 native tools schema browser with parameter inspection</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <Button
              onClick={() => setActiveTab('admin')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold h-9 px-4 flex items-center gap-2 shadow-lg shadow-amber-600/20"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Admin Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={() => setActiveTab('keys')}
              variant="outline"
              className="border-white/10 text-gray-300 hover:text-white rounded-xl text-xs h-9 px-3"
            >
              Manage Keys
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-white/10 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'connect'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-[#0D121F] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Connect Chat Assistants</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">8 Clients</span>
          </button>

          <button
            onClick={() => setActiveTab('talent')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'talent'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-[#0D121F] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Talent & Creator Playbook</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'keys'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-[#0D121F] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys & Credentials</span>
            {keys.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                {keys.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-[#0D121F] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Admin Controls & Diagnostics</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
              Inspector & 32 Tools
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONNECT CHAT ASSISTANTS */}
      {/* ========================================================================= */}
      {activeTab === 'connect' && (
        <div className="space-y-8 animate-fade-in">
          {/* Intro Card */}
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
                <Bot className="w-5 h-5 text-indigo-400" />
                Select Your AI Chat Assistant
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Choose the assistant you currently use. Configurations below automatically inject your active API key.
              </p>
            </div>

            {!primaryKey && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Tip: Generate an API key in the <strong>API Keys</strong> tab to populate configs with your credentials.
                </span>
                <Button
                  onClick={() => setActiveTab('keys')}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] h-7 rounded-lg"
                >
                  Generate Key
                </Button>
              </div>
            )}
          </div>

          {/* Client Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {EXTENDED_CLIENT_GUIDES.map((client) => {
              const isSelected = selectedClient === client.id
              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-950/60 to-purple-950/60 border-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                      : 'bg-[#0D121F] border-white/10 hover:border-white/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      {client.id === 'claude-desktop' && <Bot className="w-5 h-5" />}
                      {client.id === 'claude-code' && <Terminal className="w-5 h-5" />}
                      {client.id === 'cursor' && <Code2 className="w-5 h-5" />}
                      {client.id === 'chatgpt' && <MessageSquare className="w-5 h-5" />}
                      {client.id === 'antigravity' && <Cpu className="w-5 h-5" />}
                      {client.id === 'openai-codex' && <Terminal className="w-5 h-5" />}
                      {client.id === 'windsurf' && <Laptop className="w-5 h-5" />}
                      {client.id === 'siegfried-assistant' && <Sparkles className="w-5 h-5 text-amber-300" />}
                    </div>
                    {client.recommended && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        Top Pick
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs leading-tight text-white">{client.name}</h3>
                    <span className="text-[10px] text-gray-400 font-mono line-clamp-1 pt-0.5">
                      {client.badge}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Guide Detail Card */}
          <div className="rounded-3xl bg-[#0D121F] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-outfit">
                    {currentGuide.name} Setup Guide
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold font-mono">
                    {currentGuide.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                    Transport: {currentGuide.transport}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl">
                  {currentGuide.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {currentGuide.id === 'siegfried-assistant' ? (
                  <Link href="/ai-chat-assistant">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Open AI Chat Assistant
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => copySnippet(currentGuide.getConfig(primaryKey))}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 font-mono text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30"
                  >
                    {copiedSnippet ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copiedSnippet ? 'Copied Config!' : 'Copy Configuration'}
                  </Button>
                )}
              </div>
            </div>

            {/* Code / Command Display Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>{currentGuide.snippetType} Preview</span>
                {primaryKey ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" /> API Key Pre-Injected
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Placeholder Key (Create key in API Keys tab)
                  </span>
                )}
              </div>
              <div className="relative rounded-2xl bg-black/80 border border-white/10 p-5 font-mono text-xs text-indigo-300 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre-wrap leading-relaxed select-all">
                  {currentGuide.getConfig(primaryKey)}
                </pre>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Step-by-Step Installation Walkthrough
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentGuide.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test It: Sample Prompts */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Test Prompts: Try These in {currentGuide.name}
              </h4>
              <p className="text-xs text-gray-400">
                Once connected, paste any of these prompts directly into your chat assistant to verify tool execution:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentGuide.samplePrompts.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3 text-xs"
                  >
                    <p className="text-gray-300 italic leading-relaxed">&ldquo;{prompt}&rdquo;</p>
                    <Button
                      onClick={() => copyPrompt(prompt, idx)}
                      variant="ghost"
                      size="sm"
                      className="self-start text-[11px] font-mono text-indigo-400 hover:text-white p-0 h-auto flex items-center gap-1.5"
                    >
                      {copiedPromptIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPromptIdx === idx ? 'Copied Prompt' : 'Copy Prompt'}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TALENT & CREATOR PLAYBOOK */}
      {/* ========================================================================= */}
      {activeTab === 'talent' && (
        <div className="space-y-8 animate-fade-in">
          {/* Talent Header */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0D121F] to-indigo-950/40 border border-white/10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono">
              <Users className="w-3.5 h-3.5" />
              Talent & Creator Playbook
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              How Talent & Social Media Managers Use Siegfried MCP
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-4xl leading-relaxed">
              Instead of logging into 9 separate social media dashboards, copying and pasting captions, and re-uploading media manually, MCP lets you manage your entire social media presence directly through your AI chat interface.
            </p>
          </div>

          {/* 3-Step Talent Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Generate Your Key & Connect</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Head to the <strong>API Keys</strong> tab to generate your personal key. Follow the 1-click guide to connect Claude Desktop, Cursor, or ChatGPT.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">Prompt in Natural Language</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tell your AI assistant what you need: draft a carousel, repurpose an article, schedule drops across X and LinkedIn, or fetch analytics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Automate & Review</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                The assistant calls Siegfried MCP tools in real-time. Posts are queued, carousels are published, and comments are answered safely.
              </p>
            </div>
          </div>

          {/* Talent Prompt Library */}
          <div className="rounded-3xl bg-[#0D121F] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Ready-to-Use Prompt Library for Talent
                </h3>
                <p className="text-xs text-gray-400 pt-1">
                  Copy these battle-tested prompts directly into your connected chat assistant or run directly in Siegfried.
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {filteredPrompts.length} Prompts Available
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Carousels & Graphics', 'Threads & Copy', 'Blog & Articles', 'Discussions & Communities', 'Cross-Platform Publishing', 'Video & Shorts', 'Scheduling & Queue Management', 'Engagement & DMs', 'Analytics & ROI'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPromptCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                      selectedPromptCategory === cat
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrompts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-4 group hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Template #{idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-gray-300 font-mono bg-white/5 p-3 rounded-xl leading-relaxed">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <Button
                      onClick={() => copyPrompt(item.prompt, 100 + idx)}
                      size="sm"
                      className="bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-mono flex items-center gap-2 self-start"
                    >
                      {copiedPromptIdx === 100 + idx ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPromptIdx === 100 + idx ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                    </Button>
                    <Link href="/ai-chat-assistant">
                      <Button
                        onClick={() => copyPrompt(item.prompt, 100 + idx, 'Prompt copied! Opening AI Chat...')}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-400 hover:text-white rounded-xl flex items-center gap-1.5"
                      >
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                        <span>Run in AI Chat</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 11 Platforms Capability Matrix */}
          <div className="rounded-3xl bg-[#0D121F] border border-white/10 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                11 Supported Social Platforms & Capabilities
              </h3>
              <p className="text-xs text-gray-400 pt-1">
                Overview of what your AI chat assistant can do on each connected network via Siegfried MCP.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mcpPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        {platform.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {platform.badgeText}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {platform.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {platform.capabilities.publishing && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                          Publish
                        </span>
                      )}
                      {platform.capabilities.scheduling && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                          Schedule
                        </span>
                      )}
                      {platform.capabilities.analytics && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">
                          Analytics
                        </span>
                      )}
                      {platform.capabilities.comments && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400">
                          Comments
                        </span>
                      )}
                      {platform.capabilities.dms && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/15 text-pink-400">
                          DM Triggers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: API KEYS & CREDENTIALS */}
      {/* ========================================================================= */}
      {activeTab === 'keys' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-2xl bg-[#0D121F] border-white/10 shadow-2xl overflow-hidden">
              <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
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
                {isCreatingKey && (
                  <form
                    onSubmit={handleCreate}
                    className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Create New MCP Key
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
                      placeholder="e.g. Claude Desktop Work / Cursor Mac Studio"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
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
                          <span className="text-[11px]">Invocations: {k.usageCount}</span>
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
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-2xl bg-[#0D121F] border-white/10 shadow-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-outfit">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Security & Rate Limits
              </h3>
              <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
                <p>
                  • <strong>Rate Limiting:</strong> Each key is limited to 120 requests per minute to safeguard your connected social media API quotas.
                </p>
                <p>
                  • <strong>Encryption:</strong> Credentials are encrypted with TLS 1.3 in transit and stored hashed in our secure database.
                </p>
                <p>
                  • <strong>Instant Revocation:</strong> Revoking a key immediately terminates any active AI sessions using that key.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-white font-mono">Server Endpoint</span>
                <div className="flex items-center justify-between font-mono text-xs text-indigo-300 bg-black/60 p-2.5 rounded-lg border border-white/5">
                  <span>https://api.siegfriedoutreach.com/mcp</span>
                  <button
                    onClick={() => copyToClipboard('https://api.siegfriedoutreach.com/mcp', 'endpoint-box')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedKeyId === 'endpoint-box' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ADMIN CONTROLS & DIAGNOSTICS */}
      {/* ========================================================================= */}
      {activeTab === 'admin' && (
        <div className="space-y-8 animate-fade-in">
          {/* Admin Inspector Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#0D121F] to-orange-950/30 border border-amber-500/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Diagnostics & Inspector Hub
                </div>
                <h2 className="text-2xl font-extrabold text-white font-outfit">
                  Live MCP Server Inspector & 32 Tools Directory
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Inspect JSON schemas, test tool arguments, review live agent logs, and monitor server diagnostics.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-center gap-3">
                <span>Protocol: 2024-11-05</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Transport: Streamable HTTP + SSE</span>
              </div>
            </div>

            {/* MCP Inspector Command Box */}
            <div className="p-4 rounded-2xl bg-black/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Run Official MCP Inspector Locally
                </span>
                <Button
                  onClick={() =>
                    copyToClipboard(
                      'npx @modelcontextprotocol/inspector https://api.siegfriedoutreach.com/mcp',
                      'inspector-cmd',
                      'Copied Inspector command!'
                    )
                  }
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-mono h-7 px-3 flex items-center gap-1.5"
                >
                  {copiedKeyId === 'inspector-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKeyId === 'inspector-cmd' ? 'Copied' : 'Copy CLI Command'}</span>
                </Button>
              </div>
              <div className="font-mono text-xs text-amber-200 bg-white/5 p-2.5 rounded-xl select-all overflow-x-auto">
                npx @modelcontextprotocol/inspector https://api.siegfriedoutreach.com/mcp
              </div>
              <p className="text-[11px] text-gray-400 pt-1">
                The Model Context Protocol Inspector launches a local web UI where you can inspect all tool parameters, view OpenAPI schemas, and run mock tool calls directly.
              </p>
            </div>
          </div>

          {/* Real-time Tool Audit Log */}
          <Card className="rounded-2xl bg-[#0D121F] border-white/10 shadow-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  Live Tool Invocations Audit Feed
                </CardTitle>
                <CardDescription className="text-xs text-gray-400 pt-1">
                  Real-time telemetry of tool calls executed by connected AI clients.
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                  {(['all', 'success', 'failed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setLogStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        logStatusFilter === st
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => refetchLogs()}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-400 hover:text-white rounded-lg h-8 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Logs</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoadingLogs ? (
                <div className="py-8 flex justify-center">
                  <Spinner size="sm" />
                </div>
              ) : displayedLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500 font-mono">
                  No MCP tool calls match the filter. Run any tool from Claude Desktop, Cursor, or ChatGPT to see telemetry.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {displayedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="font-bold text-white">{log.toolName}</span>
                        <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded bg-white/5">
                          {log.clientAgent}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-gray-400 text-[11px]">
                        <span>{log.durationMs}ms</span>
                        <span className="text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 32 Tools Directory Explorer */}
          <div className="rounded-3xl bg-[#0D121F] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-indigo-400" />
                  All 32 Native MCP Tools
                </h3>
                <p className="text-xs text-gray-400 pt-1">
                  Filter and inspect tools available across all 11 connected social networks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    placeholder="Search tools or platforms..."
                    className="pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Platform Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedPlatformFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedPlatformFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                All Platforms ({mcpToolsCatalog.length})
              </button>
              {['Accounts', 'Instagram', 'LinkedIn', 'Twitter', 'TikTok', 'YouTube', 'Facebook', 'Pinterest', 'Threads', 'Reddit', 'WordPress'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPlatformFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                      selectedPlatformFilter.toLowerCase() === cat.toLowerCase()
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.name}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4 group hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 font-mono">
                        {tool.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {tool.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{tool.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-gray-500 block">
                      Parameters ({tool.params.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tool.params.length === 0 ? (
                        <span className="text-[10px] font-mono text-gray-500 italic">None</span>
                      ) : (
                        tool.params.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/5 text-gray-300"
                          >
                            {p.name}
                            {p.required ? '*' : ''} ({p.type})
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
