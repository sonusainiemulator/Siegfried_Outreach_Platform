'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scrollArea'
import { ROUTES } from '@/constants/routes'
import { platformBgColors, platformColors } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { DayPostsSidebarProps, CalendarNote } from '@/types'
import { formatDate } from '@/utils'
import { format } from 'date-fns'
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Plus,
  Sparkles,
  XCircle,
  Youtube,
  Pin,
  Lightbulb,
  Bell,
  Megaphone,
  FileText,
  CheckSquare,
  Trash2,
  Edit2,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  idea: Lightbulb,
  reminder: Bell,
  campaign: Megaphone,
  task: CheckCircle2,
  general: FileText,
}

const DayPostsSidebar = ({
  selectedDate,
  posts,
  notes = [],
  allDrafts = [],
  onPostClick,
  onNoteClick,
  onAddNote,
  onToggleChecklistItem,
  onDeleteNote,
  onEditPost,
}: DayPostsSidebarProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'notes' | 'drafts'>('all')

  const showPosts = activeTab === 'all' || activeTab === 'posts'
  const showNotes = activeTab === 'all' || activeTab === 'notes'
  const showDrafts = activeTab === 'drafts'

  const totalItems = posts.length + notes.length

  return (
    <Card className="rounded-border-radius border-border/40 glass-dark-card bg-card/40 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="sm:p-5 p-4 border-b border-border/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-title-color dark:text-white truncate">
                {selectedDate ? formatDate(selectedDate) : 'Day Timeline'}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {selectedDate
                  ? `${posts.length} posts • ${notes.length} notes • ${allDrafts.length} drafts`
                  : `${allDrafts.length} Drafts available`}
              </p>
            </div>
          </div>

          {selectedDate && onAddNote && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddNote(selectedDate)}
              className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-lg border-primary/30 hover:bg-primary/10 text-primary"
            >
              <Plus className="w-3.5 h-3.5" /> Note
            </Button>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 mt-3 p-1 rounded-lg bg-muted/20 border border-border/10 overflow-x-auto">
          {selectedDate && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({totalItems})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all shrink-0 ${
                  activeTab === 'posts'
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all shrink-0 ${
                  activeTab === 'notes'
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Notes ({notes.length})
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all shrink-0 ${
              activeTab === 'drafts'
                ? 'bg-purple-500 text-white shadow-xs'
                : 'text-purple-600 dark:text-purple-400 hover:text-purple-500'
            }`}
          >
            Drafts ({allDrafts.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea>
        <div className="sm:p-5 p-4 space-y-3 custom-scrollbar overflow-auto max-h-[420px]">
          {!selectedDate ? (
            <div className="space-y-4">
              <div className="text-center py-6 border-b border-border/10">
                <CalendarDays className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs font-medium text-subtitle-color">
                  {t('choose_a_date_to_view_posts')}
                </p>
              </div>
              {allDrafts.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Draft Posts ({allDrafts.length})
                    </span>
                    <Link
                      href={ROUTES.SOCIAL_MEDIA.CREATE_POST}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      + New
                    </Link>
                  </div>
                  {allDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => onPostClick(draft as any)}
                      className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge className="text-[8px] font-black uppercase px-2 py-0.5 border-none bg-purple-500/15 text-purple-600 dark:text-purple-300">
                          <FileText className="w-3 h-3 mr-1" />
                          DRAFT
                        </Badge>
                        {onEditPost && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditPost(draft.id)
                            }}
                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Edit
                          </button>
                        )}
                      </div>
                      <h4 className="font-semibold text-xs truncate group-hover:text-primary transition-colors">
                        {draft.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 opacity-80">
                        {draft.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : showDrafts ? (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Draft Posts ({allDrafts.length})
              </div>
              {allDrafts.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
                  <p className="text-xs text-muted-foreground">No draft posts found</p>
                </div>
              ) : (
                allDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    onClick={() => onPostClick(draft as any)}
                    className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="text-[8px] font-black uppercase px-2 py-0.5 border-none bg-purple-500/15 text-purple-600 dark:text-purple-300">
                        <FileText className="w-3 h-3 mr-1" />
                        DRAFT
                      </Badge>
                      {onEditPost && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditPost(draft.id)
                          }}
                          className="h-6 px-2 text-[10px] font-bold rounded border-purple-500/30 text-purple-600 hover:bg-purple-500/10 gap-1"
                        >
                          <Edit2 className="w-2.5 h-2.5" /> Edit & Schedule
                        </Button>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {draft.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 opacity-70">
                      {draft.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-10">
              <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-sm font-medium text-subtitle-color">No posts or notes on this date</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                {onAddNote && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAddNote(selectedDate)}
                    className="h-8 text-xs font-medium gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Note
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 text-xs font-medium gap-1 bg-primary text-white"
                  asChild
                >
                  <Link href={ROUTES.SOCIAL_MEDIA.CREATE_POST}>
                    <Plus className="w-3.5 h-3.5" />
                    {t('create_post')}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Notes List */}
              {showNotes && notes.length > 0 && (
                <div className="space-y-2">
                  {activeTab === 'all' && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                      Notes & Tasks ({notes.length})
                    </div>
                  )}
                  {notes.map((note) => {
                    const CategoryIcon = CATEGORY_ICONS[note.category] || FileText
                    return (
                      <div
                        key={note.id}
                        onClick={() => onNoteClick && onNoteClick(note)}
                        className="p-3.5 rounded-xl border transition-all cursor-pointer group hover:border-primary/50 relative overflow-hidden"
                        style={{
                          backgroundColor: `${note.color}08`,
                          borderColor: `${note.color}35`,
                        }}
                      >
                        {/* Note top header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1"
                              style={{
                                backgroundColor: `${note.color}20`,
                                color: note.color,
                              }}
                            >
                              <CategoryIcon className="w-3 h-3" />
                              {note.category}
                            </span>
                            {note.isPinned && (
                              <span className="p-0.5 text-amber-500" title="Pinned Note">
                                <Pin className="w-3 h-3 fill-current" />
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onDeleteNote && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteNote(note.id)
                                }}
                                className="p-1 hover:bg-destructive/10 text-destructive rounded"
                                title="Delete Note"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onNoteClick && onNoteClick(note)
                              }}
                              className="p-1 hover:bg-primary/10 text-primary rounded"
                              title="Edit Note"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {note.title}
                        </h4>

                        {note.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {note.content}
                          </p>
                        )}

                        {/* Checklist items */}
                        {note.checklist && note.checklist.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-border/10 space-y-1">
                            {note.checklist.map((item) => (
                              <div
                                key={item.id}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-xs"
                              >
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  onChange={(e) => {
                                    if (onToggleChecklistItem) {
                                      onToggleChecklistItem(note.id, item.id, e.target.checked)
                                    }
                                  }}
                                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                                />
                                <span
                                  className={`text-[11px] ${
                                    item.completed
                                      ? 'line-through text-muted-foreground opacity-60'
                                      : 'text-foreground'
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Posts List */}
              {showPosts && posts.length > 0 && (
                <div className="space-y-2">
                  {activeTab === 'all' && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1 mt-3">
                      Social Posts ({posts.length})
                    </div>
                  )}
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onPostClick(post)}
                      className="p-3.5 rounded-xl border-glass-border hover:border-primary/50 border transition-all cursor-pointer group bg-muted/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={cn(
                            'text-[8px] font-black uppercase px-2 py-0.5 border-none',
                            post.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : post.status === 'failed'
                                ? 'bg-destructive/10 text-destructive'
                                : post.status === 'cancelled'
                                  ? 'bg-slate-500/20 text-slate-500'
                                  : post.status === 'draft'
                                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                                    : 'bg-amber-500/10 text-amber-500',
                          )}
                        >
                          {post.status === 'published' ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : post.status === 'failed' ? (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          ) : post.status === 'cancelled' ? (
                            <XCircle className="w-3 h-3 mr-1" />
                          ) : post.status === 'draft' ? (
                            <FileText className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {post.status}
                        </Badge>
                        <div className="flex -space-x-1 gap-1.5">
                          {post.platforms?.slice(0, 3).map((p, i) => {
                            const Icon = platformIcons[p.platform?.toLowerCase()] || Globe
                            return (
                              <div
                                key={i}
                                className={cn(
                                  'w-5 h-5 rounded-md flex items-center justify-center border border-border/10',
                                  platformBgColors[p.platform?.toLowerCase()] || 'bg-muted/20',
                                )}
                              >
                                <Icon className={cn('w-2.5 h-2.5', platformColors[p.platform?.toLowerCase()])} />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 opacity-70">
                        {post.content}
                      </p>
                      {post.scheduledDateTime && (
                        <p className="text-[9px] font-bold text-primary mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.scheduledDateTime), 'hh:mm a')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default DayPostsSidebar
