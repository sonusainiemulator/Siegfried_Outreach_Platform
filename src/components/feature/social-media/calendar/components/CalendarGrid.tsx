'use client'

import React, { useState, useEffect } from 'react'
import { weekDays } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { CalendarGridProps, CalendarNote } from '@/types'
import { isSameDay, isSameMonth, isToday } from 'date-fns'
import { format } from 'date-fns/format'
import {
  Pin,
  Lightbulb,
  Bell,
  Megaphone,
  CheckCircle2,
  FileText,
  Plus,
  StickyNote,
  Send,
  CalendarDays,
  CheckSquare,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  idea: Lightbulb,
  reminder: Bell,
  campaign: Megaphone,
  task: CheckCircle2,
  general: FileText,
}

interface ContextMenuState {
  x: number
  y: number
  date: Date
}

const CalendarGrid = ({
  currentMonth,
  calendarDays,
  postsByDate,
  notesByDate = {},
  selectedDate,
  onDateSelect,
  onPostClick,
  onNoteClick,
  onAddNoteForDate,
}: CalendarGridProps) => {
  const router = useRouter()
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  // Close context menu on outside click or scroll
  useEffect(() => {
    const handleClose = () => setContextMenu(null)
    window.addEventListener('click', handleClose)
    window.addEventListener('scroll', handleClose, true)
    window.addEventListener('contextmenu', (e: MouseEvent) => {
      // If right click happened outside calendar cells, close current menu
      const target = e.target as HTMLElement
      if (!target.closest('.calendar-date-cell')) {
        setContextMenu(null)
      }
    })
    return () => {
      window.removeEventListener('click', handleClose)
      window.removeEventListener('scroll', handleClose, true)
    }
  }, [])

  const handleContextMenu = (e: React.MouseEvent, day: Date) => {
    e.preventDefault()
    e.stopPropagation()
    onDateSelect(day)

    // Ensure menu stays within screen viewport
    const menuWidth = 220
    const menuHeight = 260
    let x = e.clientX
    let y = e.clientY

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }

    setContextMenu({ x, y, date: day })
  }

  return (
    <>
      <div className="grid grid-cols-7 border-b border-border/10 bg-primary/5">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-1.5 md:p-4 text-center text-[8px] md:text-[14px] font-black text-muted-foreground/60 bg-calendar-header-bg dark:bg-black-jet!"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="inline sm:hidden">{day[0]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 relative">
        {calendarDays.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayPosts = postsByDate[dateStr] || []
          const dayNotes = notesByDate[dateStr] || []
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isTodayDate = isToday(day)
          const hasScheduled = dayPosts.some((p) => p.status === 'scheduled')
          const hasPublished = dayPosts.some((p) => p.status === 'published')
          const hasFailed = dayPosts.some((p) => p.status === 'failed')
          const hasNotes = dayNotes.length > 0
          const hasPinnedNote = dayNotes.some((n) => n.isPinned)

          return (
            <div
              key={idx}
              onClick={() => onDateSelect(day)}
              onContextMenu={(e) => handleContextMenu(e, day)}
              className={cn(
                'calendar-date-cell min-h-[60px] sm:min-h-[85px] md:min-h-[135px] p-1 md:p-2.5 border-r border-b border-border/10 cursor-pointer transition-all duration-300 relative group/day select-none',
                !isCurrentMonth && 'bg-muted/5 opacity-40',
                isCurrentMonth && 'hover:bg-primary/5',
                isSelected && 'bg-primary/10 ring-1 md:ring-2 ring-inset ring-primary/30',
                isTodayDate && 'bg-primary/5'
              )}
            >
              <div className="flex items-center justify-between mb-1 md:mb-1.5">
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-md md:rounded-lg text-[9px] md:text-xs font-black transition-all',
                      isTodayDate && 'bg-primary text-white shadow-lg shadow-primary/20',
                      isSelected && !isTodayDate && 'bg-primary/20 text-primary',
                      !isTodayDate && !isSelected && 'text-foreground/80 group-hover/day:text-primary'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {hasPinnedNote && (
                    <Pin className="w-3 h-3 text-amber-500 fill-amber-500 hidden sm:inline" />
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Indicators for posts and notes */}
                  {dayPosts.length > 0 && (
                    <div className="flex gap-0.5 md:gap-1">
                      {hasPublished && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      )}
                      {hasScheduled && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                      )}
                      {hasFailed && (
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive shadow-sm shadow-destructive/50" />
                      )}
                    </div>
                  )}
                  {hasNotes && (
                    <div
                      className="w-1.5 h-1.5 rounded-full shadow-sm"
                      style={{ backgroundColor: dayNotes[0]?.color || '#3b82f6' }}
                    />
                  )}
                </div>
              </div>

              {/* Items Display (Notes + Posts) */}
              <div className="hidden md:block space-y-1">
                {/* Notes Preview First */}
                {dayNotes.slice(0, 2).map((note) => {
                  const CategoryIcon = CATEGORY_ICONS[note.category] || FileText
                  return (
                    <div
                      key={note.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onNoteClick) onNoteClick(note)
                      }}
                      className="px-1.5 py-1 rounded-md text-[9px] font-bold truncate cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-1 border shadow-xs"
                      style={{
                        backgroundColor: `${note.color}15`,
                        borderColor: `${note.color}40`,
                        color: note.color,
                      }}
                    >
                      {note.isPinned ? (
                        <Pin className="w-2.5 h-2.5 fill-current shrink-0" />
                      ) : (
                        <CategoryIcon className="w-2.5 h-2.5 shrink-0" />
                      )}
                      <span className="truncate">{note.title}</span>
                      {note.checklist && note.checklist.length > 0 && (
                        <span className="ml-auto text-[8px] opacity-70 shrink-0 font-normal">
                          {note.checklist.filter((i) => i.completed).length}/{note.checklist.length}
                        </span>
                      )}
                    </div>
                  )
                })}

                {/* Posts Preview */}
                {dayPosts.slice(0, Math.max(1, 3 - dayNotes.length)).map((post) => (
                  <div
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onPostClick(post)
                    }}
                    className={cn(
                      'px-1.5 py-1 rounded-md text-[9px] font-bold uppercase truncate cursor-pointer transition-all hover:scale-[1.02]',
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                        : post.status === 'failed'
                          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                    )}
                  >
                    {post.title}
                  </div>
                ))}

                {dayPosts.length + dayNotes.length > 3 && (
                  <div className="text-[8px] font-bold text-muted-foreground text-center opacity-70">
                    +{dayPosts.length + dayNotes.length - 3} more
                  </div>
                )}
              </div>

              {/* Mobile View Indicators */}
              <div className="block md:hidden text-center mt-0.5 space-y-0.5">
                {dayNotes.length > 0 && (
                  <div
                    className="text-[7px] font-bold uppercase px-1 py-0.2 rounded truncate"
                    style={{
                      backgroundColor: `${dayNotes[0]?.color}20`,
                      color: dayNotes[0]?.color,
                    }}
                  >
                    {dayNotes.length} note{dayNotes.length > 1 ? 's' : ''}
                  </div>
                )}
                {dayPosts.length > 0 && (
                  <div className="text-[7px] font-bold text-muted-foreground/80 uppercase truncate">
                    {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-56 rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/40 text-popover-foreground animate-in fade-in-0 zoom-in-95 duration-100 font-sans"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-border/20 mb-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              {format(contextMenu.date, 'EEEE, MMM d')}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                const date = contextMenu.date
                setContextMenu(null)
                if (onAddNoteForDate) onAddNoteForDate(date)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 group-hover:bg-white/20 flex items-center justify-center text-primary group-hover:text-white">
                <StickyNote className="w-3.5 h-3.5" />
              </div>
              <span>Create Note</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const date = contextMenu.date
                setContextMenu(null)
                if (onAddNoteForDate) onAddNoteForDate(date)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-amber-500 hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 group-hover:bg-white/20 flex items-center justify-center text-amber-500 group-hover:text-white">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span>Add Content Idea</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const date = contextMenu.date
                setContextMenu(null)
                if (onAddNoteForDate) onAddNoteForDate(date)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 group-hover:bg-white/20 flex items-center justify-center text-emerald-500 group-hover:text-white">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span>Add Task / Checklist</span>
            </button>

            <div className="my-1 border-t border-border/20" />

            <button
              type="button"
              onClick={() => {
                setContextMenu(null)
                router.push(ROUTES.SOCIAL_MEDIA.CREATE_POST)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 group-hover:bg-white/20 flex items-center justify-center text-blue-500 group-hover:text-white">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span>Schedule Post</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CalendarGrid
