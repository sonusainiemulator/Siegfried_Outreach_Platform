'use client'

import {
  Workflow,
  Sparkles,
  ArrowRight,
  Play,
  Bot,
  Layers,
  Zap,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Repeat2,
  Share2,
} from 'lucide-react'

const workflows = [
  {
    title: 'YouTube / Blog to 9-Platform Campaign',
    tag: 'Autonomous Repurposing',
    description: 'Transform a single video URL into platform-native formats in seconds without copy-pasting across tabs.',
    steps: [
      { label: 'Step 1: Source Ingestion', desc: 'Agent calls `siegfried_create_source` with your YouTube video URL or blog article link.' },
      { label: 'Step 2: Format Adaptation', desc: 'AI extracts viral soundbites, creates a 6-post X thread, LinkedIn thought leadership post, and 5-slide IG carousel.' },
      { label: 'Step 3: Visual Generation', desc: 'Calls `siegfried_create_visual` to render high-contrast 1:1 and 4:5 visual cards.' },
      { label: 'Step 4: Simultaneous Broadcast', desc: 'Calls `siegfried_create_post` to schedule and publish across all 9 connected accounts.' },
    ],
    agentPrompt: 'Take this YouTube video https://youtube.com/watch?v=ai-agents, extract the top 3 frameworks, generate a LinkedIn post and X thread, create a 1:1 quote graphic, and schedule them for tomorrow 9 AM.',
  },
  {
    title: 'Autonomous Comment & DM Lead Machine',
    tag: 'ManyChat-Style Conversion',
    description: 'Publish engaging reels and posts with auto-reply DMs that send leads your lead magnet instantly.',
    steps: [
      { label: 'Step 1: Create Interactive Post', desc: 'Agent publishes a Reel or carousel asking viewers to "Comment GUIDE to get the PDF".' },
      { label: 'Step 2: Configure Auto-Reply', desc: 'Enables `autoReplyConfig` with trigger keywords: ["GUIDE", "PDF", "LINK"].' },
      { label: 'Step 3: Instant DM Fulfillment', desc: 'When fans comment, server automatically replies to comment and dispatches the private DM with link.' },
      { label: 'Step 4: Conversation Log', desc: 'Agent tracks lead responses via `siegfried_list_conversations`.' },
    ],
    agentPrompt: 'Publish this Reel to Instagram and Facebook with caption "Comment BLUEPRINT for access", and configure auto-reply to send the URL to their DM instantly.',
  },
  {
    title: 'Weekly Performance Audit & Content Strategy Loop',
    tag: 'Self-Optimizing Strategy',
    description: 'AI reads your actual past analytics, identifies top performing hooks, and autonomously iterates your calendar.',
    steps: [
      { label: 'Step 1: Analytics Audit', desc: 'Agent calls `siegfried_list_top_posts` and `siegfried_get_post_analytics` across X, Instagram, and LinkedIn.' },
      { label: 'Step 2: Pattern Recognition', desc: 'Identifies which topics had the highest reach and engagement rate.' },
      { label: 'Step 3: Schedule Generation', desc: 'Drafts a new 7-day schedule focusing on proven winning angles.' },
      { label: 'Step 4: Calendar Update', desc: 'Calls `siegfried_create_post` with `scheduledDateTime` for the upcoming week.' },
    ],
    agentPrompt: 'Analyze my top 5 posts from the last 30 days. Tell me what worked best, then generate and schedule 7 new variations for next week.',
  },
]

export default function McpWorkflows() {
  return (
    <section id="workflows" className="py-24 bg-[#090D16] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold">
            <Workflow className="w-3.5 h-3.5" />
            <span>End-to-End Automation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            What Does Running Social Media Through MCP Look Like in Practice?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Instead of manually clicking through complex dashboard wizards, your AI agent coordinates the entire marketing
            flywheel from research to publishing and analytics.
          </p>
        </div>

        {/* Workflows Stack */}
        <div className="space-y-10">
          {workflows.map((wf, index) => (
            <div
              key={wf.title}
              className="rounded-3xl bg-[#0D121F] border border-white/10 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl hover:border-indigo-500/30 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Steps */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-semibold">
                      {wf.tag}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Pipeline 0{index + 1}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-outfit">{wf.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{wf.description}</p>
                </div>

                {/* Steps List */}
                <div className="space-y-3 pt-2">
                  {wf.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {sIdx + 1}
                      </span>
                      <div>
                        <strong className="text-white block font-semibold">{step.label}</strong>
                        <span className="text-gray-400">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Prompt Simulation Box */}
              <div className="lg:col-span-5 rounded-2xl bg-[#080C14] border border-white/10 p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-mono text-indigo-400 font-semibold flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    Natural Language Prompt
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Autonomous Execution</span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-gray-200 leading-relaxed italic">
                  &ldquo;{wf.agentPrompt}&rdquo;
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 font-mono space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cross-posts to 9 platforms in 1 call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Handles rate limits & retries automatically</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
