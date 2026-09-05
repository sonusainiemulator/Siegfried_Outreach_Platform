'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import {
  useDeleteSocialPostMutation,
  useRetrySocialPostMutation,
  useGetSocialPostsQuery,
  useGetCalendarNotesQuery,
  useToggleChecklistItemMutation,
  useDeleteCalendarNoteMutation,
} from '@/redux/api/socialMediaApi'
import { ApiError, Post, CalendarNote } from '@/types'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CalendarGrid from './components/CalendarGrid'
import CalendarHeader from './components/CalendarHeader'
import CalendarPageHeader from './components/CalendarPageHeader'
import CalendarStats from './components/CalendarStats'
import DayPostsSidebar from './components/DayPostsSidebar'
import MetricsPostsModal from './components/MetricsPostsModal'
import PostModal from './components/PostModal'
import AIBatchQueueModal from './components/AIBatchQueueModal'
import CalendarNoteModal from './components/CalendarNoteModal'

const SocialMediaCalendar = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'published' | 'draft' | 'failed'>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedNote, setSelectedNote] = useState<CalendarNote | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [metricsModalTitle, setMetricsModalTitle] = useState('')
  const [filteredMetricPosts, setFilteredMetricPosts] = useState<Post[]>([])

  const { data, isLoading, error } = useGetSocialPostsQuery(
    {},
    {
      pollingInterval: 30000,
    },
  )

  const { data: notesData } = useGetCalendarNotesQuery(undefined, {
    pollingInterval: 30000,
  })

  const [deletePost, { isLoading: isDeleting }] = useDeleteSocialPostMutation()
  const [retrySocialPost, { isLoading: isRetryingPost }] = useRetrySocialPostMutation()
  const [toggleChecklistItem] = useToggleChecklistItemMutation()
  const [deleteCalendarNote] = useDeleteCalendarNoteMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const posts: Post[] = data?.socialPosts || []
  const notes: CalendarNote[] = notesData?.notes || []

  // Extract all drafts
  const drafts = useMemo(() => {
    return posts.filter((p) => p.status === 'draft')
  }, [posts])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Group posts by date
  const postsByDate = useMemo(() => {
    const grouped: Record<string, Post[]> = {}
    posts.forEach((post) => {
      const rawDate = post.scheduledDateTime || post.createdAt || (post as any).created_at
      if (!rawDate) return
      const parsed = new Date(rawDate)
      if (isNaN(parsed.getTime())) return
      const dateStr = format(parsed, 'yyyy-MM-dd')
      if (!grouped[dateStr]) {
        grouped[dateStr] = []
      }
      grouped[dateStr].push(post)
    })
    return grouped
  }, [posts])

  // Group notes by date
  const notesByDate = useMemo(() => {
    const grouped: Record<string, CalendarNote[]> = {}
    notes.forEach((note) => {
      if (note.targetDate) {
        const parsed = new Date(note.targetDate)
        if (!isNaN(parsed.getTime())) {
          const dateStr = format(parsed, 'yyyy-MM-dd')
          if (!grouped[dateStr]) {
            grouped[dateStr] = []
          }
          grouped[dateStr].push(note)
        }
      }
    })
    return grouped
  }, [notes])

  // Get posts for selected date
  const selectedDatePosts = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    return postsByDate[dateStr] || []
  }, [selectedDate, postsByDate])

  // Get notes for selected date
  const selectedDateNotes = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    return notesByDate[dateStr] || []
  }, [selectedDate, notesByDate])

  // Stats calculations
  const stats = useMemo(() => {
    const scheduled = posts.filter((p) => p.status === 'scheduled').length
    const published = posts.filter((p) => p.status === 'published').length
    const failed = posts.filter((p) => p.status === 'failed').length
    const draft = posts.filter((p) => p.status === 'draft').length
    const thisMonth = posts.filter((p) => {
      const rawDate = p.scheduledDateTime || p.createdAt || (p as any).created_at
      if (!rawDate) return false
      const postDate = new Date(rawDate)
      if (isNaN(postDate.getTime())) return false
      return postDate.getMonth() === currentMonth.getMonth() && postDate.getFullYear() === currentMonth.getFullYear()
    }).length

    return { scheduled, published, failed, draft, thisMonth }
  }, [posts, currentMonth])

  // Handlers
  const handleNavigatePrevious = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const handleNavigateNext = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  const handleGoToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setIsPostModalOpen(true)
  }

  const handleNoteClick = (note: CalendarNote) => {
    setSelectedNote(note)
    setIsNoteModalOpen(true)
  }

  const handleOpenNewNote = (date?: Date) => {
    setSelectedNote(null)
    if (date) {
      setSelectedDate(date)
    }
    setIsNoteModalOpen(true)
  }

  const handleToggleChecklist = async (noteId: string, itemId: string, completed: boolean) => {
    try {
      await toggleChecklistItem({ id: noteId, itemId, completed }).unwrap()
    } catch (err: any) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteCalendarNote(noteId).unwrap()
      toast.success('Note deleted')
    } catch (err: any) {
      toast.error('Failed to delete note')
    }
  }

  const handlePostModalClose = () => {
    setIsPostModalOpen(false)
    setSelectedPost(null)
  }

  const handleEditPost = (postId: string) => {
    router.push(`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?editId=${postId}`)
  }

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    try {
      await deletePost(postToDelete).unwrap()
      toast.success(t('post_deleted_successfully'))
      handlePostModalClose()
    } catch (error) {
      const err = error as ApiError
      toast.error(err?.data?.message || t('failed_to_delete_post'))
    } finally {
      setIsDeleteModalOpen(false)
      setPostToDelete(null)
    }
  }

  const handleRetryPost = async (postId: string, socialAccountId?: string) => {
    try {
      const res = await retrySocialPost({ id: postId, socialAccountId }).unwrap()
      toast.success(res?.message || 'Publishing retry initiated!')
    } catch (error) {
      const err = error as ApiError
      toast.error(err?.data?.message || 'Failed to retry publishing.')
    }
  }

  const handleMetricClick = (type: 'thisMonth' | 'scheduled' | 'published' | 'failed' | 'draft') => {
    let filtered: Post[] = []
    let title = ''

    switch (type) {
      case 'thisMonth':
        filtered = posts.filter((p) => {
          const rawDate = p.scheduledDateTime || p.createdAt || (p as any).created_at
          if (!rawDate) return false
          const postDate = new Date(rawDate)
          if (isNaN(postDate.getTime())) return false
          return postDate.getMonth() === currentMonth.getMonth() && postDate.getFullYear() === currentMonth.getFullYear()
        })
        title = `${format(currentMonth, 'MMMM yyyy')} Posts`
        break
      case 'scheduled':
        filtered = posts.filter((p) => p.status === 'scheduled')
        title = 'Scheduled Posts'
        break
      case 'published':
        filtered = posts.filter((p) => p.status === 'published')
        title = 'Published Posts'
        break
      case 'draft':
        filtered = posts.filter((p) => p.status === 'draft')
        title = 'Draft Posts'
        break
      case 'failed':
        filtered = posts.filter((p) => p.status === 'failed')
        title = 'Failed Posts'
        break
    }

    setFilteredMetricPosts(filtered)
    setMetricsModalTitle(title)
    setIsMetricsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center glass-dark-card border-border/40">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('failed_to_load_calendar')}</h3>
        <p className="text-muted-foreground mb-4">{t('something_went_wrong_while_loading_your_posts')}</p>
        <Button onClick={() => window.location.reload()}>{t('retry')}</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <CalendarPageHeader
        onGoToToday={handleGoToToday}
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
        onOpenNewNote={() => handleOpenNewNote(selectedDate || new Date())}
        onOpenDraftsModal={() => handleMetricClick('draft')}
        draftsCount={drafts.length}
      />

      {/* Stats Cards */}
      <CalendarStats
        stats={stats}
        notesCount={notes.length}
        draftsCount={drafts.length}
        onMetricClick={handleMetricClick}
      />

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid - Takes 3 columns on large screens */}
        <div className="lg:col-span-3">
          <Card className="rounded-border-radius border-border/40 glass-dark-card bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <CalendarHeader
                currentMonth={currentMonth}
                onNavigatePrevious={handleNavigatePrevious}
                onNavigateNext={handleNavigateNext}
                notesCount={notes.length}
                draftsCount={drafts.length}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                onViewDrafts={() => handleMetricClick('draft')}
              />
              <CalendarGrid
                currentMonth={currentMonth}
                calendarDays={calendarDays}
                postsByDate={postsByDate}
                notesByDate={notesByDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onPostClick={handlePostClick}
                onNoteClick={handleNoteClick}
                onAddNoteForDate={handleOpenNewNote}
                activeFilter={activeFilter}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <DayPostsSidebar
            selectedDate={selectedDate}
            posts={selectedDatePosts}
            notes={selectedDateNotes}
            allDrafts={drafts}
            onPostClick={handlePostClick}
            onNoteClick={handleNoteClick}
            onAddNote={handleOpenNewNote}
            onToggleChecklistItem={handleToggleChecklist}
            onDeleteNote={handleDeleteNote}
            onEditPost={handleEditPost}
          />
        </div>
      </div>

      {/* Note Modal */}
      <CalendarNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false)
          setSelectedNote(null)
        }}
        initialDate={selectedDate || new Date()}
        noteToEdit={selectedNote}
      />

      {/* Post Details Modal */}
      {selectedPost && (
        <PostModal
          post={posts.find((p) => p.id === selectedPost.id) || selectedPost}
          isOpen={isPostModalOpen}
          onClose={handlePostModalClose}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onRetry={handleRetryPost}
          isRetrying={isRetryingPost}
        />
      )}

      {/* Metrics Posts Modal */}
      <MetricsPostsModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
        title={metricsModalTitle}
        posts={filteredMetricPosts}
        onPostClick={handlePostClick}
      />

      {/* AI Batch Queue Modal */}
      <AIBatchQueueModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPostToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title={t('delete_post')}
        description={t('are_you_sure_you_want_to_delete_this_post_this_action_cannot_be_undone')}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default SocialMediaCalendar
