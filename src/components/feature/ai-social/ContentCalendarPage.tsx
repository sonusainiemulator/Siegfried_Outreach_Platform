'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Filter,
  Plus,
  Eye,
  CalendarDays,
  List,
  Grid,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Tag,
  StickyNote,
  Send,
  Lightbulb,
  CheckSquare,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  useGetContentCalendarQuery,
  useGetBusinessProfileQuery,
} from '@/redux/api/aiSocialApi'
import { useGetSocialPostsQuery, useGetCalendarNotesQuery } from '@/redux/api/socialMediaApi'
import CalendarNoteModal from '@/components/feature/social-media/calendar/components/CalendarNoteModal'
import { CalendarNote } from '@/types/components/socialMedia'
import { useRouter } from 'next/navigation'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { cn } from '@/lib/utils'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PLATFORM_EMOJI: Record<string, string> = {
  Instagram: '📸 Instagram',
  Facebook: '📘 Facebook',
  LinkedIn: '💼 LinkedIn',
  YouTube: '▶️ YouTube',
  GoogleBusinessProfile: '📍 Google Business',
  instagram: '📸 Instagram',
  facebook: '📘 Facebook',
  linkedin: '💼 LinkedIn',
  youtube: '▶️ YouTube',
  whatsapp: '🟢 WhatsApp',
  twitter: '𝕏 Twitter',
}

const STATUS_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Draft: 'outline',
  AI_Review: 'secondary',
  Owner_Review: 'outline',
  Approved: 'default',
  Scheduled: 'default',
  Published: 'default',
  Failed: 'destructive',
}

interface ContextMenuState {
  x: number
  y: number
  date: Date
}

export default function ContentCalendarPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [platformFilter, setPlatformFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<CalendarNote | null>(null)

  const monthName = MONTHS[currentMonth.getMonth()]
  const currentYear = currentMonth.getFullYear()

  const { data: profileData } = useGetBusinessProfileQuery(undefined)
  const business = (profileData as any)?.data

  // Fetch AI Planned items
  const { data: calendarData, isLoading: isLoadingCalendar } = useGetContentCalendarQuery(
    { businessId: business?._id, month: monthName, year: currentYear },
    { skip: !business?._id }
  )

  // Fetch standard Social Media Posts
  const { data: socialPostsData, isLoading: isLoadingPosts } = useGetSocialPostsQuery({})

  // Fetch Calendar Notes
  const { data: notesData } = useGetCalendarNotesQuery(undefined)

  const plannedItems: any[] = (calendarData as any)?.data?.items || []
  const socialPosts: any[] = (socialPostsData as any)?.socialPosts || []
  const calendarNotes: any[] = (notesData as any)?.notes || []

  // Close context menu on outside click or scroll
  useEffect(() => {
    const handleClose = () => setContextMenu(null)
    window.addEventListener('click', handleClose)
    window.addEventListener('scroll', handleClose, true)
    return () => {
      window.removeEventListener('click', handleClose)
      window.removeEventListener('scroll', handleClose, true)
    }
  }, [])

  const handleContextMenu = (e: React.MouseEvent, day: Date) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedDate(day)

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

  // Filter planned items by platform
  const filteredPlanned = useMemo(() => {
    if (platformFilter === 'All') return plannedItems
    return plannedItems.filter((i: any) => i.platform?.toLowerCase() === platformFilter.toLowerCase())
  }, [plannedItems, platformFilter])

  // Filter social posts by platform
  const filteredPosts = useMemo(() => {
    if (platformFilter === 'All') return socialPosts
    return socialPosts.filter((p: any) =>
      p.platforms?.some((plat: any) => plat.platform?.toLowerCase() === platformFilter.toLowerCase())
    )
  }, [socialPosts, platformFilter])

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Group all items by date YYYY-MM-DD
  const itemsByDate = useMemo(() => {
    const grouped: Record<string, { planned: any[]; posts: any[]; notes: any[] }> = {}

    // Planned items
    filteredPlanned.forEach((item) => {
      if (item.publishDate) {
        const dateStr = format(new Date(item.publishDate), 'yyyy-MM-dd')
        if (!grouped[dateStr]) grouped[dateStr] = { planned: [], posts: [], notes: [] }
        grouped[dateStr].planned.push(item)
      }
    })

    // Social Posts
    filteredPosts.forEach((post) => {
      const dateStr = format(new Date(post.scheduledDateTime || post.createdAt), 'yyyy-MM-dd')
      if (!grouped[dateStr]) grouped[dateStr] = { planned: [], posts: [], notes: [] }
      grouped[dateStr].posts.push(post)
    })

    // Calendar Notes
    calendarNotes.forEach((note) => {
      if (note.targetDate) {
        const dateStr = format(new Date(note.targetDate), 'yyyy-MM-dd')
        if (!grouped[dateStr]) grouped[dateStr] = { planned: [], posts: [], notes: [] }
        grouped[dateStr].notes.push(note)
      }
    })

    return grouped
  }, [filteredPlanned, filteredPosts, calendarNotes])

  // Selected Date items
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedDayData = itemsByDate[selectedDateStr] || { planned: [], posts: [], notes: [] }
  const totalSelectedItems = selectedDayData.planned.length + selectedDayData.posts.length + selectedDayData.notes.length

  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1))
  const handleGoToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const handleOpenNewNote = (date?: Date) => {
    setSelectedNote(null)
    if (date) setSelectedDate(date)
    setIsNoteModalOpen(true)
  }

  const isLoading = isLoadingCalendar || isLoadingPosts

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Page Header */}
      <PageHeader
        title="Social Media Content Calendar"
        showBackButton={true}
        endContent={
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-muted/40 border border-border/40">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all',
                  viewMode === 'grid' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Grid className="w-3.5 h-3.5" /> Month Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={cn(
                  'px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all',
                  viewMode === 'timeline' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-3.5 h-3.5" /> Timeline
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenNewNote(selectedDate)}
              className="h-9 px-3 text-xs font-semibold gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <StickyNote className="w-4 h-4 text-primary" /> + Create Note
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToToday}
              className="h-9 px-3 text-xs font-semibold gap-1.5"
            >
              <CalendarDays className="w-4 h-4 text-primary" /> Today
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/ai-social/indian-festivals')}
              className="h-9 gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-xs hover:opacity-90"
            >
              <span>🇮🇳 Festivals Auto-Pilot</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/ai-social/planner')}
              className="h-9 gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-primary" /> AI Planner
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/social-media/create-post')}
              className="h-9 gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4" /> New Post
            </Button>
          </div>
        }
      />

      {/* Indian Festivals 1-Click Auto-Pilot Banner */}
      <Card className="border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            🪔
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-foreground">365-Day Indian Festivals Auto-Pilot Engine</h3>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px] font-bold">Zero Human Approval</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Auto-generate and schedule Diwali, Raksha Bandhan, Holi, Eid, Navratri & 30+ festival posts, reels, WhatsApp campaigns & WordPress blogs in 1 click.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => router.push('/ai-social/indian-festivals')}
          className="h-8 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shrink-0 rounded-lg"
        >
          Launch Festival Hub ➔
        </Button>
      </Card>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border/60 glass-dark-card">
          <CardContent className="p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">AI Planned Items</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{plannedItems.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 glass-dark-card">
          <CardContent className="p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Awaiting Review</p>
            <p className="text-2xl font-black text-amber-500 mt-0.5">
              {plannedItems.filter((i) => i.status === 'Owner_Review' || i.status === 'AI_Review').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 glass-dark-card">
          <CardContent className="p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Scheduled Posts</p>
            <p className="text-2xl font-black text-emerald-500 mt-0.5">
              {socialPosts.filter((p) => p.status === 'scheduled').length + plannedItems.filter((i) => i.status === 'Approved' || i.status === 'Scheduled').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 glass-dark-card">
          <CardContent className="p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Live Published</p>
            <p className="text-2xl font-black text-primary mt-0.5">
              {socialPosts.filter((p) => p.status === 'published').length + plannedItems.filter((i) => i.status === 'Published').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter by Platform Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-muted-foreground mr-1 shrink-0">Channels:</span>
        {['All', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'GoogleBusinessProfile'].map((p) => {
          const isSelected = platformFilter.toLowerCase() === p.toLowerCase()
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPlatformFilter(p)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0',
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                  : 'bg-card/70 hover:bg-card border-border/50 text-muted-foreground hover:text-foreground'
              )}
            >
              {p === 'All' ? '🌐 All Channels' : PLATFORM_EMOJI[p] || p}
            </button>
          )
        })}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Main Calendar Month View */}
      {!isLoading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3-Column Monthly Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="rounded-2xl border-border/40 glass-dark-card overflow-hidden shadow-xl">
              {/* Month Navigation Header */}
              <div className="p-4 sm:p-5 border-b border-border/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="h-9 w-9 rounded-xl hover:bg-muted/50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-lg sm:text-2xl font-black text-foreground">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="h-9 w-9 rounded-xl hover:bg-muted/50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Status Legend */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Published</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Scheduled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>AI Plan</span>
                  </div>
                </div>
              </div>

              {/* Day Name Headers */}
              <div className="grid grid-cols-7 border-b border-border/10 bg-muted/20">
                {weekDays.map((d) => (
                  <div key={d} className="p-2 sm:p-3 text-center text-xs font-black text-muted-foreground uppercase">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 relative">
                {calendarDays.map((day, idx) => {
                  const dateStr = format(day, 'yyyy-MM-dd')
                  const dayData = itemsByDate[dateStr] || { planned: [], posts: [], notes: [] }
                  const isCurMonth = isSameMonth(day, currentMonth)
                  const isSel = isSameDay(day, selectedDate)
                  const isTod = isToday(day)

                  const totalDayCount = dayData.planned.length + dayData.posts.length + dayData.notes.length

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      onContextMenu={(e) => handleContextMenu(e, day)}
                      className={cn(
                        'min-h-[75px] sm:min-h-[110px] p-1.5 sm:p-2 border-r border-b border-border/10 cursor-pointer transition-all duration-200 relative group select-none',
                        !isCurMonth && 'bg-muted/5 opacity-40',
                        isCurMonth && 'hover:bg-primary/5',
                        isSel && 'bg-primary/10 ring-2 ring-inset ring-primary/40',
                        isTod && 'bg-primary/5'
                      )}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            'w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-[10px] sm:text-xs font-black transition-all',
                            isTod && 'bg-primary text-white shadow-md',
                            isSel && !isTod && 'bg-primary/20 text-primary font-bold',
                            !isTod && !isSel && 'text-foreground/80 group-hover:text-primary'
                          )}
                        >
                          {format(day, 'd')}
                        </span>

                        {totalDayCount > 0 && (
                          <span className="text-[9px] font-bold text-muted-foreground bg-muted/40 px-1 rounded">
                            {totalDayCount}
                          </span>
                        )}
                      </div>

                      {/* Content Chips Preview */}
                      <div className="space-y-1 hidden sm:block">
                        {/* AI Planned items */}
                        {dayData.planned.slice(0, 2).map((item) => (
                          <div
                            key={item._id}
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push('/ai-social/approval')
                            }}
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold truncate bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:scale-[1.02] transition-transform"
                            title={item.topic}
                          >
                            🤖 {item.topic}
                          </div>
                        ))}

                        {/* Social Media Posts */}
                        {dayData.posts.slice(0, Math.max(1, 2 - dayData.planned.length)).map((p) => (
                          <div
                            key={p.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push('/social-media/calendar')
                            }}
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[9px] font-bold truncate hover:scale-[1.02] transition-transform',
                              p.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            )}
                            title={p.title}
                          >
                            📱 {p.title}
                          </div>
                        ))}

                        {/* Notes */}
                        {dayData.notes.slice(0, 1).map((n) => (
                          <div
                            key={n.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedNote(n)
                              setIsNoteModalOpen(true)
                            }}
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold truncate border flex items-center gap-1 cursor-pointer hover:scale-[1.02] transition-transform"
                            style={{
                              backgroundColor: `${n.color}15`,
                              borderColor: `${n.color}35`,
                              color: n.color,
                            }}
                          >
                            <StickyNote className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{n.title}</span>
                          </div>
                        ))}

                        {totalDayCount > 3 && (
                          <div className="text-[8px] font-bold text-muted-foreground text-center opacity-70">
                            +{totalDayCount - 3} more
                          </div>
                        )}
                      </div>

                      {/* Mobile indicator dots */}
                      <div className="flex sm:hidden gap-1 mt-1 justify-center flex-wrap">
                        {dayData.planned.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        {dayData.posts.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                        {dayData.notes.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* 1-Column Day Timeline Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-border/40 glass-dark-card overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 border-b border-border/10 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {format(selectedDate, 'EEEE, MMM d')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {totalSelectedItems} items scheduled for this day
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenNewNote(selectedDate)}
                    className="h-8 px-2.5 text-xs font-semibold gap-1 text-primary border-primary/30"
                  >
                    <Plus className="w-3.5 h-3.5" /> Note
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {totalSelectedItems === 0 ? (
                  <div className="text-center py-12 text-muted-foreground space-y-3">
                    <Sparkles className="w-10 h-10 mx-auto opacity-30" />
                    <p className="text-xs font-medium">No content scheduled for this date</p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenNewNote(selectedDate)}
                        className="text-xs h-8"
                      >
                        + Add Note
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => router.push('/ai-social/planner')}
                        className="text-xs h-8 bg-primary text-white"
                      >
                        Generate AI Plan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Notes for Selected Day */}
                    {selectedDayData.notes.map((note: any) => (
                      <div
                        key={note.id}
                        onClick={() => {
                          setSelectedNote(note)
                          setIsNoteModalOpen(true)
                        }}
                        className="p-3 rounded-xl border space-y-1.5 cursor-pointer hover:border-primary/50 transition-colors"
                        style={{
                          backgroundColor: `${note.color}08`,
                          borderColor: `${note.color}35`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded"
                            style={{ backgroundColor: `${note.color}20`, color: note.color }}
                          >
                            {note.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-foreground">{note.title}</h4>
                        {note.content && <p className="text-[11px] text-muted-foreground line-clamp-2">{note.content}</p>}
                      </div>
                    ))}

                    {/* AI Planned Items for Selected Day */}
                    {selectedDayData.planned.map((item: any) => (
                      <div
                        key={item._id}
                        onClick={() => router.push('/ai-social/approval')}
                        className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            {PLATFORM_EMOJI[item.platform] || item.platform}
                          </span>
                          <Badge variant={STATUS_BADGE_VARIANTS[item.status] || 'secondary'} className="text-[9px] px-1.5 py-0">
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.topic}
                        </h4>
                        {item.hook && (
                          <p className="text-[11px] text-muted-foreground italic line-clamp-1">
                            "{item.hook}"
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                          <span className="font-mono bg-muted/60 px-1 rounded">{item.format}</span>
                          <span className="text-primary font-semibold flex items-center gap-0.5">
                            Review & Approve <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Social Media Scheduled Posts */}
                    {selectedDayData.posts.map((post: any) => (
                      <div
                        key={post.id}
                        onClick={() => router.push('/social-media/calendar')}
                        className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className="text-[9px] font-black uppercase px-1.5 py-0 bg-amber-500/20 text-amber-600 border-none">
                            {post.status}
                          </Badge>
                          {post.scheduledDateTime && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                              <Clock className="w-3 h-3 text-amber-500" />
                              {format(new Date(post.scheduledDateTime), 'hh:mm a')}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{post.content}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Timeline List Mode */}
      {!isLoading && viewMode === 'timeline' && (
        <div className="space-y-6">
          {Object.entries(itemsByDate).length === 0 ? (
            <Card className="border border-border text-center py-16 p-6">
              <CardContent className="space-y-4">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-base font-bold">No content planned for {monthName} {currentYear}</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Use the AI Marketing Planner to generate a full month of balanced posts.
                </p>
                <Button variant="default" onClick={() => router.push('/ai-social/planner')} className="bg-primary text-white">
                  Generate Content Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(itemsByDate).map(([dateStr, dayData]) => (
              <div key={dateStr} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                  {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')} ({dayData.planned.length + dayData.posts.length + dayData.notes.length} items)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Planned items */}
                  {dayData.planned.map((item: any) => (
                    <Card
                      key={item._id}
                      onClick={() => router.push('/ai-social/approval')}
                      className="border border-border cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md"
                    >
                      <CardContent className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {PLATFORM_EMOJI[item.platform] || item.platform}
                          </span>
                          <Badge variant={STATUS_BADGE_VARIANTS[item.status] || 'secondary'} className="text-[10px]">
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                          {item.topic}
                        </h4>
                        {item.hook && (
                          <p className="text-xs text-primary italic line-clamp-1">
                            "{item.hook}"
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                          <span className="bg-muted px-1.5 py-0.5 rounded font-mono">{item.format}</span>
                          <span className="text-primary font-semibold flex items-center gap-0.5">
                            Review <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Social Posts */}
                  {dayData.posts.map((post: any) => (
                    <Card
                      key={post.id}
                      onClick={() => router.push('/social-media/calendar')}
                      className="border border-amber-500/30 bg-amber-500/5 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all"
                    >
                      <CardContent className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge className="text-[10px] bg-amber-500/20 text-amber-600 border-none font-bold">
                            {post.status}
                          </Badge>
                          {post.scheduledDateTime && (
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {format(new Date(post.scheduledDateTime), 'hh:mm a')}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-56 rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/40 text-popover-foreground animate-in fade-in-0 zoom-in-95 duration-100 font-sans"
        >
          <div className="px-3 py-2 border-b border-border/20 mb-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              {format(contextMenu.date, 'EEEE, MMM d')}
            </p>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                const date = contextMenu.date
                setContextMenu(null)
                handleOpenNewNote(date)
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
                handleOpenNewNote(date)
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
                handleOpenNewNote(date)
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
                router.push('/social-media/create-post')
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 group-hover:bg-white/20 flex items-center justify-center text-blue-500 group-hover:text-white">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span>Schedule Post</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContextMenu(null)
                router.push('/ai-social/planner')
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-purple-600 hover:text-white transition-colors cursor-pointer text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 group-hover:bg-white/20 flex items-center justify-center text-purple-500 group-hover:text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>AI Plan This Month</span>
            </button>
          </div>
        </div>
      )}

      {/* Calendar Note Modal */}
      <CalendarNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false)
          setSelectedNote(null)
        }}
        initialDate={selectedDate}
        noteToEdit={selectedNote}
      />
    </div>
  )
}
