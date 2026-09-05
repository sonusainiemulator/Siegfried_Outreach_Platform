'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bot,
  Plus,
  Sparkles,
  Send,
  Copy,
  Trash2,
  Pencil,
  Loader2,
  MessageSquare,
  FilePlus2,
  Check,
  Pause,
  Play,
  X,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  useGetRoleTemplatesQuery,
  useListEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useChatEmployeeMutation,
  useCreateEmployeeDraftMutation,
  RoleTemplate,
  Employee,
} from '@/redux/api/aiTeamApi'
import { useGetSocialAccountsQuery } from '@/redux/api/socialMediaApi'

const ALL_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube', 'threads', 'pinterest', 'reddit', 'wordpress']
const PROVIDERS = [
  { value: '', label: 'Auto (best available key)' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'groq', label: 'Groq' },
  { value: 'grok', label: 'Grok (xAI)' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'gemini', label: 'Gemini' },
]

const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  threads: 'Threads',
  pinterest: 'Pinterest',
  reddit: 'Reddit',
  wordpress: 'WordPress',
  google: 'Google',
}

const fmtCount = (n?: number) => (n ? n.toLocaleString() : '0')

/* ============================ New / Edit Modal ============================ */
function EmployeeFormModal({
  open,
  onOpenChange,
  existing,
  roleTemplates,
  connectedCountByPlatform,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  existing?: Employee | null
  roleTemplates: RoleTemplate[]
  connectedCountByPlatform: Record<string, number>
}) {
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation()
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation()

  const [name, setName] = useState('')
  const [roleKey, setRoleKey] = useState('content_strategist')
  const [brandVoice, setBrandVoice] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [provider, setProvider] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName(existing?.name || '')
      setRoleKey(existing?.roleTemplate || 'content_strategist')
      setBrandVoice(existing?.brandVoice || '')
      setPlatforms(existing?.platforms || [])
      setProvider(existing?.provider || '')
      setError('')
    }
  }, [open, existing])

  const tpl = roleTemplates.find((r) => r.key === roleKey) || roleTemplates[0]

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))

  const submit = async () => {
    if (!name.trim()) return setError('Employee name is required.')
    const payload = {
      name: name.trim(),
      roleTemplate: roleKey,
      brandVoice: brandVoice.trim() || undefined,
      platforms: platforms.length ? platforms : undefined,
      provider,
    }
    try {
      if (existing) {
        await updateEmployee({ id: existing._id, patch: payload }).unwrap()
      } else {
        await createEmployee(payload).unwrap()
      }
      onOpenChange(false)
    } catch (e: any) {
      setError(e?.data?.message || 'Failed to save employee.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border/60 rounded-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-title-color dark:text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            {existing ? `Edit ${existing.name}` : 'Hire a new AI Employee'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-subtitle-color">Employee name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Riya — Reels Expert"
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-subtitle-color">AI provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.value || 'auto'} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-subtitle-color">Role template</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {roleTemplates.map((r) => (
                <button
                  type="button"
                  key={r.key}
                  onClick={() => setRoleKey(r.key)}
                  className={cn(
                    'text-left rounded-xl border p-2.5 transition-all cursor-pointer',
                    roleKey === r.key
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border/60 hover:border-primary/50 bg-background'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-xs font-bold text-title-color dark:text-white">{r.name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-subtitle-color">
              Brand voice <span className="text-muted-foreground font-normal">(optional — how it should talk)</span>
            </label>
            <textarea
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              placeholder="e.g. Friendly, desi-English, short sentences, always end with a question…"
              rows={2}
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-subtitle-color">Focus platforms</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PLATFORMS.map((p) => {
                const active = platforms.includes(p) || (!platforms.length && (tpl?.platforms || []).includes(p))
                const connected = connectedCountByPlatform[p] || 0
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer',
                      active
                        ? 'bg-primary text-white border-primary'
                        : 'border-border/60 text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {PLATFORM_LABEL[p] || p}
                    {connected > 0 && <span className={cn('text-[9px] px-1 rounded-full', active ? 'bg-white/20' : 'bg-primary/10 text-primary')}>{connected}</span>}
                  </button>
                )
              })}
            </div>
            {!platforms.length && (
              <p className="text-[10px] text-muted-foreground">No selection = role template defaults used ({tpl?.platforms?.join(', ') || '—'})</p>
            )}
          </div>

          {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit} disabled={creating || updating} className="gap-1.5">
            {(creating || updating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {existing ? 'Save changes' : 'Hire employee'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ============================ Chat Modal ============================ */
function EmployeeChatModal({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [chatEmployee, { isLoading: sending }] = useChatEmployeeMutation()
  const [createDraft, { isLoading: drafting }] = useCreateEmployeeDraftMutation()
  const { data: accountsData } = useGetSocialAccountsQuery({})

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [chatId, setChatId] = useState<string | undefined>(undefined)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [draftFor, setDraftFor] = useState<string | null>(null)
  const [draftPlatforms, setDraftPlatforms] = useState<string[]>([])
  const [draftNote, setDraftNote] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const connectedAccounts = accountsData?.socialAccounts || []
  const connectedPlatforms = useMemo(() => {
    const map: Record<string, number> = {}
    connectedAccounts.forEach((a: any) => {
      const p = String(a.platform || '').toLowerCase()
      map[p] = (map[p] || 0) + 1
    })
    return map
  }, [connectedAccounts])

  useEffect(() => {
    if (open) {
      setMessages([])
      setChatId(undefined)
      setError('')
      setDraftFor(null)
    }
  }, [open, employee._id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const send = async () => {
    const msg = input.trim()
    if (!msg || sending) return
    setInput('')
    setError('')
    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    try {
      const res = await chatEmployee({ id: employee._id, message: msg, chatId }).unwrap()
      setChatId(res.chatId)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }])
    } catch (e: any) {
      setError(e?.data?.message || 'Chat failed. Check your AI provider key in Settings.')
      setMessages((prev) => prev.slice(0, -1))
    }
  }

  const copyMsg = (content: string) => {
    navigator.clipboard?.writeText(content)
    setCopied(content.slice(0, 40))
    setTimeout(() => setCopied(''), 1500)
  }

  const submitDraft = async () => {
    if (!draftFor || drafting) return
    const targetPlatforms = draftPlatforms.length ? draftPlatforms : employee.platforms?.slice(0, 1) || ['instagram']
    try {
      const res = await createDraft({
        id: employee._id,
        content: draftFor,
        title: draftNote || `${employee.name} draft`,
        platforms: targetPlatforms,
      }).unwrap()
      setDraftFor(null)
      setDraftNote('')
      setDraftPlatforms([])
      setError('')
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `✅ Draft created! Review & publish it from the Approval Center → /ai-social/approval (draft id: ${res.postId})` },
      ])
    } catch (e: any) {
      setError(e?.data?.message || 'Failed to create draft. Connect a social account first.')
    }
  }

  const quickPrompts = [
    'Write 5 Instagram caption hooks for my niche',
    'Plan this week\u2019s content calendar',
    'Write a 30s reel script for my next video',
    'Repurpose my last post into a LinkedIn version',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border/60 rounded-2xl p-0 overflow-hidden h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/40">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
            {employee.emoji || '🤖'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-title-color dark:text-white truncate">{employee.name}</h4>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold">
                {employee.roleTemplate}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {employee.description || 'AI Social Media Employee'} • speaks your business niche
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 px-5 py-4 overflow-y-auto">
          {messages.length === 0 && !sending ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-title-color dark:text-white">
                Ask {employee.name} to create content for your business
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                    }}
                    className="text-[11px] rounded-full border border-border/60 px-3 py-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-muted dark:bg-neutral-800/70 text-foreground rounded-bl-sm'
                    )}
                  >
                    {m.content}
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/20">
                        <button
                          onClick={() => copyMsg(m.content)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          {copied === m.content.slice(0, 40) ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copied === m.content.slice(0, 40) ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => {
                            setDraftFor(m.content)
                            setDraftPlatforms([])
                            setDraftNote('')
                          }}
                          className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          <FilePlus2 className="w-3 h-3" /> Send to Drafts
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-muted dark:bg-neutral-800/70 px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              )}
              {error && <p className="text-[11px] font-semibold text-red-500 text-center">{error}</p>}
            </div>
          )}
        </div>

        {/* Draft inline form */}
        {draftFor && (
          <div className="border-t border-border/40 bg-background/60 px-5 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-title-color dark:text-white flex items-center gap-1.5">
                <FilePlus2 className="w-3.5 h-3.5 text-primary" /> Send this content to Approval Center drafts
              </p>
              <button onClick={() => setDraftFor(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(connectedPlatforms).length === 0 && (
                <span className="text-[10px] text-red-500">No connected social accounts yet — connect one in Channels first.</span>
              )}
              {Object.entries(connectedPlatforms).map(([p, count]) => (
                <button
                  key={p}
                  onClick={() => setDraftPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer',
                    draftPlatforms.includes(p)
                      ? 'bg-primary text-white border-primary'
                      : 'border-border/60 text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {PLATFORM_LABEL[p] || p} ({count})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="Draft title (optional)"
                className="flex-1 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
              />
              <Button size="sm" onClick={submitDraft} disabled={drafting || Object.keys(connectedPlatforms).length === 0}>
                {drafting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FilePlus2 className="w-3.5 h-3.5" />} Create draft
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/40 px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={`Message ${employee.name}… (Enter to send, Shift+Enter for new line)`}
              rows={1}
              className="flex-1 rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary resize-none max-h-32"
            />
            <Button size="icon" onClick={send} disabled={sending || !input.trim()} className="h-10 w-10 shrink-0">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Tip: ask for captions, hooks, reel scripts, threads or a weekly plan — then send any reply straight to Drafts → Approval Center.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ============================ Page ============================ */
export default function AiTeamPage() {
  const { data: templatesData } = useGetRoleTemplatesQuery()
  const { data: employeesData, isLoading } = useListEmployeesQuery()
  const [deleteEmployee] = useDeleteEmployeeMutation()
  const [updateEmployee] = useUpdateEmployeeMutation()
  const { data: accountsData } = useGetSocialAccountsQuery({})

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [chatting, setChatting] = useState<Employee | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Employee | null>(null)

  const roleTemplates = templatesData?.roleTemplates || []
  const employees = employeesData?.employees || []
  const connectedAccounts = accountsData?.socialAccounts || []

  const connectedCountByPlatform = useMemo(() => {
    const map: Record<string, number> = {}
    connectedAccounts.forEach((a: any) => {
      const p = String(a.platform || '').toLowerCase()
      map[p] = (map[p] || 0) + 1
    })
    return map
  }, [connectedAccounts])

  const templateMeta = (key: string) => roleTemplates.find((r) => r.key === key)

  const toggleStatus = async (emp: Employee) => {
    try {
      await updateEmployee({ id: emp._id, patch: { status: emp.status === 'active' ? 'paused' : 'active' } }).unwrap()
    } catch {
      /* noop */
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-title-color dark:text-white tracking-tight">AI Team</h2>
              <p className="text-xs text-muted-foreground">
                Your content employees — chat with each one to build posts, scripts & plans in your business voice.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" /> Hire Employee
        </Button>
      </div>

      {/* Role template quick info */}
      {!isLoading && employees.length === 0 && (
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-transparent p-5">
          <p className="text-sm font-bold text-title-color dark:text-white mb-3">Hire your first AI employee — pick a role:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {roleTemplates.slice(0, 8).map((r) => (
              <button
                key={r.key}
                onClick={() => {
                  setEditing(null)
                  setFormOpen(true)
                }}
                className="text-left rounded-xl border border-border/60 bg-background p-3 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="text-xl">{r.emoji}</div>
                <p className="text-xs font-bold text-title-color dark:text-white mt-1">{r.name}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{r.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Employees grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bot className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No employees yet — click “Hire Employee” to build your team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const meta = templateMeta(emp.roleTemplate)
            const active = emp.status === 'active'
            return (
              <div
                key={emp._id}
                className={cn(
                  'rounded-2xl border bg-card p-4 space-y-3 transition-all',
                  active ? 'border-border/60' : 'border-border/30 opacity-75'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                      {emp.emoji || '🤖'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-title-color dark:text-white truncate">{emp.name}</p>
                      <p className="text-[10px] font-semibold text-primary truncate">
                        {meta?.emoji} {meta?.name || emp.roleTemplate}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn('text-[9px] font-bold', active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/40')}>
                    {active ? 'Active' : 'Paused'}
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[2rem]">
                  {emp.brandVoice || emp.description || meta?.description || 'Your AI social media employee.'}
                </p>

                <div className="flex flex-wrap gap-1">
                  {(emp.platforms || []).slice(0, 4).map((p) => (
                    <span key={p} className="text-[9px] font-bold rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      {PLATFORM_LABEL[p] || p}
                    </span>
                  ))}
                  {(emp.platforms || []).length > 4 && (
                    <span className="text-[9px] font-bold rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      +{(emp.platforms || []).length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
                    <span>{fmtCount(emp.stats?.messages)} msgs</span>
                    <span>{fmtCount(emp.stats?.draftsCreated)} drafts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title={active ? 'Pause' : 'Activate'}
                      onClick={() => toggleStatus(emp)}
                    >
                      {active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Edit"
                      onClick={() => {
                        setEditing(emp)
                        setFormOpen(true)
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" title="Delete" onClick={() => setConfirmDelete(emp)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full gap-1.5" size="sm" onClick={() => setChatting(emp)} disabled={!active}>
                  <MessageSquare className="w-3.5 h-3.5" /> Chat with {emp.name.split(' ')[0]}
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <EmployeeFormModal
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v)
          if (!v) setEditing(null)
        }}
        existing={editing}
        roleTemplates={roleTemplates}
        connectedCountByPlatform={connectedCountByPlatform}
      />

      {chatting && <EmployeeChatModal employee={chatting} open={!!chatting} onOpenChange={(v) => !v && setChatting(null)} />}

      <Dialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm bg-card border-border/60 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-title-color dark:text-white">Delete {confirmDelete?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">This removes the employee and all its chat history. This cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                if (confirmDelete) await deleteEmployee(confirmDelete._id).unwrap()
                setConfirmDelete(null)
              }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
