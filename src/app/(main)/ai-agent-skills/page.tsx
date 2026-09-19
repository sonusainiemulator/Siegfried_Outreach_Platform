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
  const activeSkillsCount = skills.filter((s) => s.isActive !== false).length
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
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <PageHeader
        title="Hermes Agent Skills Library"
        showBackButton={true}
        primaryAction={{
          label: 'Add New Skill',
          icon: <Plus className="w-4 h-4 mr-1.5" />,
          onClick: () => handleOpen(),
        }}
      />

      {/* Subtitle & Domain Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure specialized 24/7 autonomous skills, system prompts, and niche directives for your AI agents.
        </p>
        {businessProfile?.category && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary self-start sm:self-auto shrink-0 shadow-xs">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span>Active Niche: {businessProfile.category}</span>
          </div>
        )}
      </div>

      {/* Top Stat Cards */}
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
              : 'Get started by creating a specialized skill with custom system prompts for your autonomous agent.'}
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
