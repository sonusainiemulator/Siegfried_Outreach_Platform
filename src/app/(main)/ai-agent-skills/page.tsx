'use client'

import React, { useState, useMemo } from 'react'
import {
  useGetHermesSkillsQuery,
  useCreateHermesSkillMutation,
  useUpdateHermesSkillMutation,
  useDeleteHermesSkillMutation,
  useAssignHermesSkillMutation,
} from '@/redux/api/hermesSkillApi'
import { useGetUserSettingsQuery } from '@/redux/api/userSettingApi'
import { useGetBusinessProfileQuery } from '@/redux/api/aiSocialApi'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Bot,
  Brain,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  ShieldCheck,
  Sliders,
  Layers,
  Code2,
  RefreshCw,
  Loader2,
  X,
  Tag,
  FileText,
  Rocket,
  TrendingUp,
  Target,
  BookOpen,
  ArrowRight,
  Shield,
  Lightbulb,
  Award,
  BarChart3,
  Compass,
  CheckCheck,
  Flame,
  Globe,
  Share2,
  HelpCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'All Categories',
  'Content Generation',
  'Competitor Research',
  'Customer Support',
  'Sales',
  'Other',
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Content Generation': {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
  },
  'Competitor Research': {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
  'Customer Support': {
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/20',
  },
  'Sales': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  'Other': {
    bg: 'bg-slate-500/10 dark:bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-500/20',
  },
}

// Readymade Niche Starters for 1-Click Setup
const NICHE_STARTER_TEMPLATES = [
  {
    id: 'mental-health',
    title: '🧠 Mental Health Care & Psychology',
    niche: 'Mental Health Care',
    category: 'Content Generation',
    desc: 'Specialized 24/7 autonomous marketing strategist for mental wellness, cognitive resilience, individual differences, and student/professional burnout.',
    parameters: 'Mental Health, Psychology, Individual Differences, Burnout, Resilience, Mindfulness, STEM',
    prompt: `You are the 24x7 Autonomous AI Marketing & Content Strategist for a Mental Health Care & Educational Psychology practice.

CORE PHILOSOPHY & STORY:
Founded on bridging structured problem-solving with empathetic psychological guidance. Curiosity into why individuals struggle under stress drives the mission to understand individual differences in learning, resilience, and emotional regulation.

24x7 DAILY CONTENT CATEGORIES & PILLARS:
1. Category A — Understanding Individual Differences:
   - Why one study method, coping mechanism, or productivity tip doesn't work for everyone.
   - Personality traits, cognitive processing styles, and psychological variance in handling stress.
2. Category B — STEM, Engineering & Academic Burnout:
   - Why high-achieving STEM and university students hit burnout walls.
   - Overcoming imposter syndrome, perfectionism, and academic pressure.
3. Category C — Daily Mental Wellness & Emotional Regulation:
   - Evidence-based nervous system regulation (grounding, breathwork, cognitive pauses).
   - Healthy boundaries, sleep hygiene, and mental recovery for high-pressure professionals.
4. Category D — Cognitive Reframing & Psychoeducation:
   - Transforming catastrophic thoughts into objective, empowering cognitive reframing.
   - Making complex psychological concepts accessible, relatable, and actionable.
5. Category E — Destigmatizing Mental Health & Proactive Care:
   - Why seeking psychological guidance is a sign of high self-awareness and strength.
   - Practical steps to prioritize mental health before crisis points.

VOICE & TONE GUIDELINES:
- Warm, empathetic, scientifically informed, and empowering.
- Avoid cold clinical jargon; speak human-to-human with genuine empathy.
- Always conclude with an actionable takeaway, an engaging question, or an invitation to book a consultation.`,
  },
  {
    id: 'd2c-ecommerce',
    title: '🛍️ D2C E-Commerce Brand Growth',
    niche: 'D2C E-Commerce',
    category: 'Sales',
    desc: 'Autonomous revenue & product marketing engine focused on viral product hooks, unboxings, flash sales, UGC scripts, and high-conversion abandoned cart copy.',
    parameters: 'E-commerce, D2C, Viral Hooks, Flash Sales, UGC, Conversion Optimization, Product Launches',
    prompt: `You are the 24x7 Autonomous E-Commerce Growth Architect & Social Commerce Strategist.

MISSION:
Drive viral discovery, repeat purchases, and customer loyalty for a high-growth D2C consumer brand.

24x7 DAILY CONTENT PILLARS:
1. Category A — Problem-to-Solution Product Demonstrations (Hook → Flaw in ordinary products → Your solution).
2. Category B — Social Proof & Customer Transformations (UGC stories, before/after results, verified reviews).
3. Category C — Behind-The-Scenes & Founder Craftsmanship (Ethical sourcing, packaging, unboxings).
4. Category D — Urgency & Seasonal Drops (Flash sales, VIP early access, bundle savings).
5. Category E — Interactive Community Engagement (Polls, "Which shade are you?", comment giveaways).

VOICE & TONE:
Energetic, aspirational, trendy, fast-paced, and conversion-focused. Use punchy one-liners, vivid benefit verbs, and irresistible CTAs.`,
  },
  {
    id: 'b2b-saas',
    title: '💻 B2B SaaS & Tech Founder Authority',
    niche: 'B2B SaaS / AI Technology',
    category: 'Content Generation',
    desc: 'Thought leadership and pipeline generation engine for software founders. Generates deep LinkedIn posts, case studies, product update teardowns, and ROI breakdowns.',
    parameters: 'B2B SaaS, Tech Founder, LinkedIn Authority, Product Teardowns, Lead Generation, AI Automation',
    prompt: `You are the 24x7 B2B SaaS Growth & Executive Thought Leadership Agent.

MISSION:
Position the software company as the undisputed category leader in its domain, converting enterprise leaders into qualified inbound demo requests.

24x7 DAILY CONTENT PILLARS:
1. Category A — Contrarian Industry Perspectives (Challenging broken legacy workflows with modern software).
2. Category B — Tactical Frameworks & Swipe Files (Actionable playbooks, checklists, and workflow teardowns).
3. Category C — Customer ROI & Case Studies (Quantifiable time saved, costs cut, and productivity unlocked).
4. Category D — Build in Public & Engineering Insights (Product velocity, architecture decisions, customer feedback).
5. Category E — Inbound Conversion Triggers ("Comment 'DEMO' or 'PLAYBOOK' to receive the implementation guide").

VOICE & TONE:
Authoritative, data-backed, concise, and intellectually rigorous. Zero fluff; lead with hard facts, metrics, and actionable frameworks.`,
  },
  {
    id: 'healthcare-clinic',
    title: '🏥 Healthcare & Clinic Practice Authority',
    niche: 'Healthcare / Medical Practice',
    category: 'Customer Support',
    desc: 'Patient education, trust building, and appointment scheduling agent. Combines medical accuracy with empathetic community wellness guidance.',
    parameters: 'Healthcare, Clinic, Medical Wellness, Patient Education, Preventive Care, Appointments',
    prompt: `You are the 24x7 Autonomous Healthcare Communication & Patient Education Specialist.

MISSION:
Educate the local community, answer common health questions with verified medical guidance, and drive appointment bookings with trusted practitioners.

24x7 DAILY CONTENT PILLARS:
1. Category A — Preventive Health & Daily Wellness Tips (Actionable nutrition, sleep, and physical health habits).
2. Category B — Myth-Busting Medical Misconceptions (Clarifying internet medical myths with verified facts).
3. Category C — Clinic Highlights & Patient Journey (Introducing doctors, advanced diagnostic equipment, sanitized environments).
4. Category D — Symptom Awareness & Early Detection (When to see a specialist vs. when to rest).
5. Category E — Proactive Care & Easy Booking (Direct link to schedule consultations or annual checkups).

VOICE & TONE:
Compassionate, reassuring, medically responsible, and professional. Always include disclaimer to seek medical advice for personal diagnoses.`,
  },
]

export default function HermesSkillsAdminPage() {
  const { data: response, isLoading: isLoadingSkills, refetch } = useGetHermesSkillsQuery({})
  const { data: userSettingsResponse } = useGetUserSettingsQuery({})
  const { data: businessRes } = useGetBusinessProfileQuery(undefined)
  const businessProfile = businessRes?.data

  const [createSkill, { isLoading: isCreating }] = useCreateHermesSkillMutation()
  const [updateSkill, { isLoading: isUpdating }] = useUpdateHermesSkillMutation()
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteHermesSkillMutation()
  const [assignSkill, { isLoading: isAssigning }] = useAssignHermesSkillMutation()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null)
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)
  const [showGuideSection, setShowGuideSection] = useState(true)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    systemPrompt: '',
    parameters: '',
    category: 'Content Generation',
    isActive: true,
  })

  const skills: any[] = response?.data || []
  const activeUserSkillIds: string[] = userSettingsResponse?.data?.activeHermesSkills || []

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === 'All Categories' || skill.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        skill.name?.toLowerCase().includes(q) ||
        skill.description?.toLowerCase().includes(q) ||
        skill.parameters?.some((p: string) => p.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [skills, selectedCategory, searchQuery])

  // Stats
  const totalSkills = skills.length
  const assignedToAgentCount = skills.filter((s) =>
    activeUserSkillIds.some((id: any) => id?.toString() === (s.id || s._id)?.toString())
  ).length

  const handleOpen = (skill: any = null) => {
    if (skill) {
      setFormData({
        id: skill.id || skill._id,
        name: skill.name || '',
        description: skill.description || '',
        systemPrompt: skill.systemPrompt || '',
        parameters: skill.parameters?.join(', ') || '',
        category: skill.category || 'Content Generation',
        isActive: skill.isActive !== false,
      })
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        systemPrompt: '',
        parameters: '',
        category: 'Content Generation',
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleApplyTemplate = (tpl: typeof NICHE_STARTER_TEMPLATES[0]) => {
    setFormData({
      id: '',
      name: tpl.title.replace(/^[^\s]+\s/, ''),
      description: tpl.desc,
      systemPrompt: tpl.prompt,
      parameters: tpl.parameters,
      category: tpl.category,
      isActive: true,
    })
    setIsModalOpen(true)
    toast.success(`Template loaded: ${tpl.title}! Customize and click Save Skill.`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Skill Name is required')
      return
    }
    if (!formData.systemPrompt.trim()) {
      toast.error('System Prompt is required')
      return
    }

    const payload = {
      ...formData,
      parameters: formData.parameters
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    }

    try {
      if (formData.id) {
        await updateSkill(payload).unwrap()
        toast.success('Hermes Skill updated successfully!')
      } else {
        await createSkill(payload).unwrap()
        toast.success('Hermes Skill created successfully!')
      }
      setIsModalOpen(false)
      refetch()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.data?.message || err?.message || 'Failed to save skill')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the skill "${name}"?`)) {
      try {
        await deleteSkill(id).unwrap()
        toast.success(`Skill "${name}" deleted`)
        refetch()
      } catch (err: any) {
        console.error(err)
        toast.error(err?.data?.message || 'Failed to delete skill')
      }
    }
  }

  const handleToggleAgentAssignment = async (skillId: string, isCurrentlyAssigned: boolean) => {
    try {
      await assignSkill({ skillId, enable: !isCurrentlyAssigned }).unwrap()
      toast.success(
        !isCurrentlyAssigned
          ? 'Skill assigned to your 24/7 Autonomous AI Agent!'
          : 'Skill removed from your 24/7 Autonomous AI Agent'
      )
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to update agent skill assignment')
    }
  }

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText)
    setCopiedPromptId(id)
    toast.success('System Prompt copied to clipboard!')
    setTimeout(() => setCopiedPromptId(null), 2000)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <PageHeader
        title="Hermes Agent Skills Library"
        showBackButton={true}
        primaryAction={{
          label: 'Create Custom Skill',
          icon: <Plus className="w-4 h-4 mr-1.5" />,
          onClick: () => handleOpen(),
        }}
      />

      {/* 🚀 FLAGSHIP FEATURE HERO BANNER: 24/7 AUTONOMOUS SELF-IMPROVING AGENT */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-purple-500/10 to-blue-500/5 dark:from-primary/25 dark:via-purple-900/20 dark:to-[#111420] p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-md">
        {/* Subtle decorative glow balls */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-bold text-primary tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Autonomous Self-Improving AI Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Supercharge Your 24/7 AI Agent with Domain-Specific Hermes Skills
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
            Generic AI writes boring, generic content that looks like a robot. With **Hermes Skills**, you infuse your agent with your exact **Founder Journey**, **Clinical or Technical Authority**, **Brand Tone**, and **5 Daily Pillars**. The agent runs 24/7 in the background—creating viral posts, managing leads, and self-improving with every campaign.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={() => handleOpen()}
              className="rounded-xl h-11 px-5 bg-primary text-white hover:bg-primary/90 font-semibold shadow-md shadow-primary/25 gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Setup Your Business Skill</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowGuideSection(!showGuideSection)}
              className="rounded-xl h-11 px-5 border-border/80 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200 font-semibold gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{showGuideSection ? 'Hide Guide & Architecture' : 'View Architecture & Benefits'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 🌟 EXHAUSTIVE BENEFITS & ARCHITECTURE SHOWCASE (BENTO GRID) */}
      {showGuideSection && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>How Your Business Grows 24/7 with Hermes Skills</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Why specialized Hermes skills outperform basic prompts by over 400% in engagement and conversion.
              </p>
            </div>
          </div>

          {/* Bento Grid: 4 Flagship Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <Card className="rounded-2xl border-border/80 bg-white/80 dark:bg-[#151824]/90 p-5 space-y-3 backdrop-blur-md shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Deep Domain Specialization
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                No more surface-level advice. The agent understands your educational psychology, clinical nuances, engineering background, or specialized industry terminology.
              </p>
              <div className="pt-2 border-t border-border/50 text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <span>0% Generic Robot Fluff</span>
                <Check className="w-3 h-3" />
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="rounded-2xl border-border/80 bg-white/80 dark:bg-[#151824]/90 p-5 space-y-3 backdrop-blur-md shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Self-Improving Agent Loop
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                The agent memorizes your highest-performing posts, top viral hooks, and successful conversion keywords. Every piece of content it writes is smarter than the last.
              </p>
              <div className="pt-2 border-t border-border/50 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Adaptive Campaign Memory</span>
                <Check className="w-3 h-3" />
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="rounded-2xl border-border/80 bg-white/80 dark:bg-[#151824]/90 p-5 space-y-3 backdrop-blur-md shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Omnichannel Auto-Repurposing
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                One core insight is synthesized into Instagram Reels, LinkedIn Thought Leadership, X Threads, Facebook Groups, and SEO Blogs without manual writing.
              </p>
              <div className="pt-2 border-t border-border/50 text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                <span>9 Channels Synced</span>
                <Check className="w-3 h-3" />
              </div>
            </Card>

            {/* Card 4 */}
            <Card className="rounded-2xl border-border/80 bg-white/80 dark:bg-[#151824]/90 p-5 space-y-3 backdrop-blur-md shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Zero-Hallucination Guardrails
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Strict boundaries prevent false promises, fabricated testimonials, or medical inaccuracies. Your reputation is protected with rigorous enterprise safety.
              </p>
              <div className="pt-2 border-t border-border/50 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>100% Brand Compliance</span>
                <Check className="w-3 h-3" />
              </div>
            </Card>
          </div>

          {/* 📊 BEFORE VS AFTER COMPARATIVE MATRIX */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Without Skills */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] dark:bg-red-500/[0.05] p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
                <X className="w-4 h-4" />
                <span>Standard AI Without Hermes Skills</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Robotic & Repetitive:</strong> Sounds like ChatGPT; lacks personal empathy or founder voice.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>No Context Memory:</strong> Starts from zero every day; forgets past winning campaigns and brand guidelines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Zero Strategic Pillars:</strong> Spits out random ideas with no conversion funnel or intentional roadmap.</span>
                </li>
              </ul>
            </div>

            {/* With Skills */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.07] p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <CheckCheck className="w-4 h-4" />
                <span>With 24/7 Autonomous Hermes Skills</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Authentic Founder Voice:</strong> Grounded in your real story, university journey, and personal philosophy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>5 Daily Pillars:</strong> Balanced rotation between educational insights, student burnout, daily habits, and CTAs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Compounding Growth:</strong> Autonomous feedback loop optimizes captions, triggers, and bookings 24/7.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 🗺️ 4-STEP VISUAL ROADMAP: HOW TO SETUP YOUR BUSINESS SKILLS */}
          <div className="rounded-2xl border border-border/80 bg-white/70 dark:bg-[#151824]/90 p-5 sm:p-6 backdrop-blur-md space-y-4">
            <h4 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <span>Simple 4-Step Blueprint to Setup Your Business Skills</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 border border-border/60 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                  1
                </div>
                <h5 className="text-xs font-bold text-neutral-900 dark:text-white">Founder Story & Niche</h5>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  State why you started (e.g. from engineering curiosity to psychology passion) and who you serve.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 border border-border/60 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                  2
                </div>
                <h5 className="text-xs font-bold text-neutral-900 dark:text-white">5 Daily Pillars</h5>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Define 5 categories (Individual Differences, Student Burnout, Daily Habits, Reframing, Care).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 border border-border/60 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                  3
                </div>
                <h5 className="text-xs font-bold text-neutral-900 dark:text-white">Voice & Directives</h5>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Set tone guidelines (warm, empathetic, scientifically grounded) and clear conversion CTAs.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 border border-border/60 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                  4
                </div>
                <h5 className="text-xs font-bold text-neutral-900 dark:text-white">Enable 24/7 Loop</h5>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Click &quot;Assign to Agent&quot; below. The agent automatically activates across Post Studio and Daily Planner!
                </p>
              </div>
            </div>
          </div>

          {/* ⚡ READYMADE NICHE STARTERS (1-CLICK LOAD) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>One-Click Niche Starters (Select to Pre-fill)</span>
              </h4>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Click any card to load into editor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {NICHE_STARTER_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-4 rounded-2xl border border-border/80 bg-white/90 dark:bg-[#151824] hover:border-primary/60 hover:shadow-md transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                      {tpl.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30">
                      {tpl.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {tpl.desc}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-primary">
                    <span>Load Template</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/80 bg-white/70 dark:bg-[#151824]/90 backdrop-blur-md shadow-xs transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Skills
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">{totalSkills}</div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Available in platform library
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-white/70 dark:bg-[#151824]/90 backdrop-blur-md shadow-xs transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Assigned to Agent
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {assignedToAgentCount}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Active in your 24/7 autonomous loop
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-white/70 dark:bg-[#151824]/90 backdrop-blur-md shadow-xs transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Content Generation
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {skills.filter((s) => s.category === 'Content Generation').length}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Posts, reels & daily calendars
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-white/70 dark:bg-[#151824]/90 backdrop-blur-md shadow-xs transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Specialized Niche
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-neutral-900 dark:text-white truncate">
              {businessProfile?.name ? businessProfile.name.split('-')[0].trim() : 'Christopher Siegfried, MA'}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              {businessProfile?.category || 'Mental Health Care'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/70 dark:bg-[#151824]/90 p-3.5 rounded-2xl border border-border/80 backdrop-blur-md shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, description, tags..."
            className="pl-9 pr-8 h-10 text-xs rounded-xl bg-neutral-50 dark:bg-white/5 border-border/80 focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            const count =
              cat === 'All Categories'
                ? skills.length
                : skills.filter((s) => s.category === cat).length

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs',
                  isSelected
                    ? 'bg-primary text-white shadow-primary/20 shadow-md'
                    : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10'
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-200 dark:bg-white/10 text-neutral-500 dark:text-neutral-400'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Skills Grid */}
      {isLoadingSkills ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-neutral-500">Loading Hermes Agent Skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <Card className="p-12 text-center rounded-3xl border-dashed border-2 border-border/80 bg-white/40 dark:bg-[#151824]/40">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            No matching skills found
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No skills matching "${searchQuery}". Try adjusting your search query or category filter.`
              : 'Get started by creating a specialized skill or loading one of our readymade niche starters above.'}
          </p>
          <Button
            onClick={() => handleOpen()}
            size="sm"
            className="mt-4 rounded-xl bg-primary text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Skill
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredSkills.map((skill: any) => {
            const skillId = skill.id || skill._id
            const isAssigned = activeUserSkillIds.some(
              (id: any) => id?.toString() === skillId?.toString()
            )
            const catColor = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS['Other']
            const isExpanded = expandedPromptId === skillId

            return (
              <Card
                key={skillId}
                className={cn(
                  'rounded-2xl border transition-all duration-300 bg-white dark:bg-[#151824] shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden',
                  isAssigned
                    ? 'border-primary/50 dark:border-primary/40 ring-1 ring-primary/20'
                    : 'border-border/80'
                )}
              >
                {/* Card Top Section */}
                <div className="p-5 space-y-3.5">
                  {/* Category, Status & Action Controls */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-lg text-xs font-bold border',
                          catColor.bg,
                          catColor.text,
                          catColor.border
                        )}
                      >
                        {skill.category || 'Content Generation'}
                      </span>
                      {isAssigned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active on Agent</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded-full">
                          <span>Unassigned</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpen(skill)}
                        className="w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300"
                        title="Edit Skill"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(skillId, skill.name)}
                        className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </div>

                  {/* Parameter Tags */}
                  {skill.parameters && skill.parameters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {skill.parameters.map((param: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-white/10"
                        >
                          <Tag className="w-2.5 h-2.5 text-neutral-400" />
                          <span>{param}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expandable System Prompt Drawer */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedPromptId(isExpanded ? null : skillId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Hide System Prompt' : 'View System Prompt'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPrompt(skillId, skill.systemPrompt)}
                        className="h-7 px-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-primary gap-1"
                      >
                        {copiedPromptId === skillId ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-neutral-900 dark:bg-black/60 text-neutral-200 font-mono text-[11.5px] leading-relaxed max-h-56 overflow-y-auto custom-scrollbar border border-neutral-800 whitespace-pre-wrap select-text">
                        {skill.systemPrompt}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom / Toggle Action Bar */}
                <div className="px-5 py-3 bg-neutral-50/80 dark:bg-white/[0.02] border-t border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Enable for 24/7 Agent
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={isAssigned ? 'default' : 'outline'}
                    disabled={isAssigning}
                    onClick={() => handleToggleAgentAssignment(skillId, isAssigned)}
                    className={cn(
                      'rounded-xl text-xs font-semibold h-8 px-3.5 cursor-pointer transition-all shadow-xs gap-1.5',
                      isAssigned
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'border-border/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10'
                    )}
                  >
                    {isAssigned ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Assigned</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Assign to Agent</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Styled Add / Edit Hermes Skill Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#151824] border border-border/80 text-neutral-900 dark:text-white rounded-3xl p-0 overflow-hidden shadow-2xl">
          {/* Header */}
          <DialogHeader className="p-5 sm:p-6 border-b border-border/80 bg-neutral-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                  {formData.id ? 'Edit Hermes Agent Skill' : 'Create Hermes Agent Skill'}
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Define specialized autonomous directives, domain knowledge, and instructions for your 24/7 AI agent.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Skill Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Skill Name *
              </Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mental Health Care & Psychology — Christopher Siegfried, MA"
                className="h-11 rounded-xl bg-neutral-50 dark:bg-white/5 border-border/80 text-xs focus:border-primary"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Category
              </Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-3 text-xs rounded-xl bg-neutral-50 dark:bg-[#1C2030] border border-border/80 text-neutral-900 dark:text-white focus:outline-none focus:border-primary cursor-pointer shadow-xs"
              >
                <option value="Content Generation">Content Generation</option>
                <option value="Competitor Research">Competitor Research</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Description *
              </Label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what this skill accomplishes for your brand..."
                className="min-h-[70px] text-xs leading-relaxed rounded-xl bg-neutral-50 dark:bg-white/5 border-border/80 focus:border-primary p-3"
              />
            </div>

            {/* System Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  System Prompt (Autonomous Directives) *
                </Label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {formData.systemPrompt.length} chars
                </span>
              </div>
              <Textarea
                required
                rows={7}
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                placeholder="Enter the system instructions, tone guidelines, content pillars, and core domain knowledge..."
                className="font-mono text-xs leading-relaxed rounded-xl bg-neutral-50 dark:bg-white/5 border-border/80 focus:border-primary p-3 custom-scrollbar"
              />
            </div>

            {/* Parameters */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Parameters / Tags (comma separated)
              </Label>
              <Input
                value={formData.parameters}
                onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                placeholder="e.g. Mental Health, Psychology, Individual Differences, Burnout, Resilience"
                className="h-11 rounded-xl bg-neutral-50 dark:bg-white/5 border-border/80 text-xs focus:border-primary"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-border/80">
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  Skill Status Active
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  When enabled, this skill can be used across autonomous AI agent workflows.
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
              />
            </div>

            {/* Modal Footer */}
            <DialogFooter className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl text-xs font-semibold h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="rounded-xl text-xs font-semibold h-10 px-5 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 gap-1.5"
              >
                {(isCreating || isUpdating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{formData.id ? 'Save Changes' : 'Create Skill'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
