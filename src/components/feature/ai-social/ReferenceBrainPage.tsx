'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Link2,
  Brain,
  Loader2,
  Plus,
  Trash2,
  Check,
  Copy,
  Sparkles,
  Wand2,
  RefreshCw,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  FilePlus2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  useStudyReferenceMutation,
  useListReferenceStudiesQuery,
  useGetReferenceStudyQuery,
  useDeleteReferenceStudyMutation,
  useGenerateReferenceContentMutation,
  useCreateReferenceDraftMutation,
  ReferenceStudy,
} from '@/redux/api/aiTeamApi'
import { useGetSocialAccountsQuery } from '@/redux/api/socialMediaApi'

const FORMATS = [
  { value: 'captions', label: 'Post captions' },
  { value: 'reel_script', label: 'Reel / Shorts script' },
  { value: 'carousel', label: 'Carousel content' },
  { value: 'thread', label: 'X thread' },
  { value: 'hooks', label: 'Hook lines only' },
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

export default function ReferenceBrainPage() {
  const { data: studiesData, isLoading } = useListReferenceStudiesQuery()
  const { data: accountsData } = useGetSocialAccountsQuery({})
  const [studyRef, { isLoading: studying }] = useStudyReferenceMutation()
  const [deleteStudy] = useDeleteReferenceStudyMutation()
  const [generate, { isLoading: generating }] = useGenerateReferenceContentMutation()
  const [createDraft, { isLoading: drafting }] = useCreateReferenceDraftMutation()

  const [url, setUrl] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [format, setFormat] = useState('captions')
  const [output, setOutput] = useState('')
  const [genError, setGenError] = useState('')
  const [copied, setCopied] = useState(false)
  const [draftOpen, setDraftOpen] = useState(false)
  const [draftPlatforms, setDraftPlatforms] = useState<string[]>([])
  const [draftMsg, setDraftMsg] = useState('')
  const [studyError, setStudyError] = useState('')

  const studies = studiesData?.studies || []
  const connectedAccounts = accountsData?.socialAccounts || []
  const connectedPlatforms = useMemo(() => {
    const map: Record<string, number> = {}
    connectedAccounts.forEach((a: any) => {
      const p = String(a.platform || '').toLowerCase()
      map[p] = (map[p] || 0) + 1
    })
    return map
  }, [connectedAccounts])

  // Live detail with polling while studying
  const { data: detailData } = useGetReferenceStudyQuery(selectedId || '', {
    skip: !selectedId,
    pollingInterval: 4000,
  })
  const detail = detailData?.study || null
  const selected = detail || studies.find((s) => s._id === selectedId) || null

  const startStudy = async () => {
    if (!url.trim() || studying) return
    setStudyError('')
    setOutput('')
    try {
      const res = await studyRef({ url: url.trim() }).unwrap()
      setSelectedId(String(res.study._id))
    } catch (e: any) {
      setStudyError(e?.data?.message || 'Failed to start study.')
    }
  }

  const runGenerate = async () => {
    if (!selected || !topic.trim() || generating) return
    setGenError('')
    setOutput('')
    setCopied(false)
    try {
      const res = await generate({ id: selected._id, topic: topic.trim(), format }).unwrap()
      setOutput(res.content)
    } catch (e: any) {
      setGenError(e?.data?.message || 'Generation failed.')
    }
  }

  const submitDraft = async () => {
    if (!selected || !output) return
    setDraftMsg('')
    try {
      const targets = draftPlatforms.length ? draftPlatforms : ['instagram']
      const res = await createDraft({ id: selected._id, content: output, title: `${selected.title?.slice(0, 40) || 'Reference'} content`, platforms: targets }).unwrap()
      setDraftOpen(false)
      setDraftPlatforms([])
      setDraftMsg(`✅ Draft created → /ai-social/approval (${res.postId})`)
    } catch (e: any) {
      setDraftMsg(e?.data?.message || 'Draft failed. Connect a social account first.')
    }
  }

  const p = selected?.profile
  const isBusy = selected?.status === 'studying'

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-title-color dark:text-white tracking-tight">Reference Brain</h2>
          <p className="text-xs text-muted-foreground">
            Paste any site or viral reel link — the AI studies it, builds a brain, then creates matching content for you.
          </p>
        </div>
      </div>

      {/* Study input */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startStudy()}
              placeholder="Paste reference URL — website, competitor page, Instagram reel, TikTok, YouTube…"
              className="w-full rounded-xl border border-border/60 bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button onClick={startStudy} disabled={studying || !url.trim()} className="gap-1.5">
            {studying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            Study & build brain
          </Button>
        </div>
        {(studyError || draftMsg) && (
          <p className={cn('text-[11px] font-semibold', studyError ? 'text-red-500' : 'text-emerald-500')}>
            {studyError || draftMsg}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground">
          Works with: any website (niche, tone, style, hashtags) • viral reels/videos (hook structure, reel formula — then generate your own
          version in AI Avatar Studio)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        {/* Left: studies list */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-subtitle-color uppercase tracking-wider">Your brains</p>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto my-8" />
          ) : studies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
              No studies yet. Paste a link above to create your first reference brain.
            </div>
          ) : (
            studies.map((s) => (
              <button
                key={s._id}
                onClick={() => {
                  setSelectedId(s._id)
                  setOutput('')
                  setGenError('')
                }}
                className={cn(
                  'w-full text-left rounded-xl border p-3 transition-all cursor-pointer',
                  selectedId === s._id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/50 bg-card hover:border-primary/40'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-title-color dark:text-white truncate">{s.title || s.url}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{s.url}</p>
                  </div>
                  {s.status === 'studying' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0 mt-0.5" />
                  ) : s.status === 'ready' ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] shrink-0">READY</Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] shrink-0">FAILED</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[9px] text-muted-foreground">
                  {!!s.snapshot?.imageUrls?.length && (
                    <span className="flex items-center gap-0.5">
                      <ImageIcon className="w-3 h-3" /> {s.snapshot.imageUrls.length}
                    </span>
                  )}
                  {!!s.snapshot?.videoUrls?.length && (
                    <span className="flex items-center gap-0.5">
                      <VideoIcon className="w-3 h-3" /> {s.snapshot.videoUrls.length}
                    </span>
                  )}
                  <span className="ml-auto capitalize">{s.sourceType}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteStudy(s._id).unwrap()
                      if (selectedId === s._id) setSelectedId(null)
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: detail + generator */}
        <div className="rounded-2xl border border-border/50 bg-card min-h-[420px]">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-2">
              <Brain className="w-10 h-10 text-primary/30" />
              <p className="text-sm font-semibold text-muted-foreground">Select a study to see its brain & generate content</p>
            </div>
          ) : isBusy ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-bold text-title-color dark:text-white">Studying {selected.url}…</p>
              <p className="text-xs text-muted-foreground">Extracting content, photos & videos, then teaching the AI this brand&apos;s style.</p>
            </div>
          ) : selected.status === 'failed' ? (
            <div className="p-8 text-center">
              <p className="text-sm font-bold text-red-500 mb-1">Study failed</p>
              <p className="text-xs text-muted-foreground">{selected.error || 'Could not read this URL. Try another link.'}</p>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Brain summary */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-bold text-title-color dark:text-white">{selected.title}</p>
                  <div className="flex items-center gap-1.5">
                    {!!selected.snapshot?.imageUrls?.length && (
                      <Badge className="bg-muted text-muted-foreground border-border/40 text-[9px] gap-1">
                        <ImageIcon className="w-3 h-3" /> {selected.snapshot.imageUrls.length} photos
                      </Badge>
                    )}
                    {!!selected.snapshot?.videoUrls?.length && (
                      <Badge className="bg-muted text-muted-foreground border-border/40 text-[9px] gap-1">
                        <VideoIcon className="w-3 h-3" /> {selected.snapshot.videoUrls.length} videos
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                  <Info label="Niche" value={p?.niche} />
                  <Info label="Audience" value={p?.audience} />
                  <Info label="Tone" value={p?.tone} />
                </div>
                {p?.brandStyle && <Info label="Brand / visual style" value={p.brandStyle} className="mt-2" />}
                {!!p?.contentPillars?.length && (
                  <div className="mt-2">
                    <p className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider mb-1">Content pillars</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.contentPillars.map((x) => (
                        <span key={x} className="text-[10px] font-semibold rounded-full bg-primary/10 text-primary px-2.5 py-1">
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!!p?.hashtags?.length && (
                  <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-2">{p.hashtags.map((h) => '#' + h).join(' ')}</p>
                )}
                {!!p?.hooks?.length && (
                  <div className="mt-2">
                    <p className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider mb-1">Hook styles they use</p>
                    {p.hooks.slice(0, 4).map((h, i) => (
                      <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                        • {h}
                      </p>
                    ))}
                  </div>
                )}
                {p?.reelFormula && <Info label="Reel formula" value={p.reelFormula} className="mt-2" />}
              </div>

              <div className="border-t border-border/40 pt-4">
                <p className="text-xs font-bold text-subtitle-color mb-2 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-primary" /> Generate content in this style
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Topic — e.g. '5 ways agencies save time'"
                    className="flex-1 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="rounded-lg border border-border/60 bg-background px-2.5 py-2 text-xs outline-none focus:border-primary"
                  >
                    {FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <Button onClick={runGenerate} disabled={generating || !topic.trim()} className="gap-1.5">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate
                  </Button>
                </div>
                {genError && <p className="text-[11px] font-semibold text-red-500 mt-2">{genError}</p>}

                {output && (
                  <div className="mt-3 rounded-xl border border-border/50 bg-background p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider">Generated content</p>
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] gap-1"
                          onClick={() => {
                            navigator.clipboard?.writeText(output)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 1500)
                          }}
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} Copy
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => setDraftOpen((v) => !v)}>
                          <FilePlus2 className="w-3 h-3" /> Send to Drafts
                        </Button>
                      </div>
                    </div>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">{output}</p>
                  </div>
                )}

                {draftOpen && output && (
                  <div className="mt-2 rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                    <p className="text-[11px] font-bold text-title-color dark:text-white">Send to which platforms? (draft → Approval Center)</p>
                    {Object.keys(connectedPlatforms).length === 0 && (
                      <p className="text-[10px] text-red-500">No connected accounts — connect one in Channels first.</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(connectedPlatforms).map(([plat, count]) => (
                        <button
                          key={plat}
                          onClick={() =>
                            setDraftPlatforms((prev) => (prev.includes(plat) ? prev.filter((x) => x !== plat) : [...prev, plat]))
                          }
                          className={cn(
                            'rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer',
                            draftPlatforms.includes(plat)
                              ? 'bg-primary text-white border-primary'
                              : 'border-border/60 text-muted-foreground hover:border-primary/50'
                          )}
                        >
                          {PLATFORM_LABEL[plat] || plat} ({count})
                        </button>
                      ))}
                    </div>
                    <Button size="sm" onClick={submitDraft} disabled={drafting || Object.keys(connectedPlatforms).length === 0}>
                      {drafting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FilePlus2 className="w-3.5 h-3.5" />} Create draft
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, className }: { label: string; value?: string; className?: string }) {
  if (!value) return null
  return (
    <div className={cn('rounded-lg bg-background/60 border border-border/40 p-2.5', className)}>
      <p className="text-[9px] font-bold text-subtitle-color uppercase tracking-wider">{label}</p>
      <p className="text-[11px] text-foreground/90 mt-0.5 leading-relaxed">{value}</p>
    </div>
  )
}
