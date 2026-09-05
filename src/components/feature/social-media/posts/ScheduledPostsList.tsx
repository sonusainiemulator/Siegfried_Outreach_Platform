'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/routes'
import { useDeleteSocialPostMutation, useRetrySocialPostMutation, useGetSocialPostsQuery } from '@/redux/api/socialMediaApi'
import { ApiError } from '@/types'
import { SocialPost } from '@/types/components/socialMedia'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, FileText, Layers, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { EmptyPostState } from './components/EmptyPostState'
import { PostQueueSummary } from './components/PostQueueSummary'
import { PostTimelineItem } from './components/PostTimelineItem'

export default function ScheduledPostsList() {
  const { t } = useTranslation()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'published' | 'draft' | 'failed'>('all')

  const queryArgs = useMemo(() => {
    if (selectedFilter === 'all') return {}
    return { status: selectedFilter }
  }, [selectedFilter])

  const { data, isLoading, refetch } = useGetSocialPostsQuery(queryArgs)
  const [deletePost, { isLoading: isDeleting }] = useDeleteSocialPostMutation()
  const [retrySocialPost, { isLoading: isRetrying }] = useRetrySocialPostMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const posts: SocialPost[] = data?.socialPosts || []
  const router = useRouter()

  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' })

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const timeA = new Date(a.scheduledDateTime || (a as any).createdAt || Date.now()).getTime()
      const timeB = new Date(b.scheduledDateTime || (b as any).createdAt || Date.now()).getTime()
      if (selectedFilter === 'scheduled') {
        return timeA - timeB
      }
      return timeB - timeA
    })
  }, [posts, selectedFilter])

  const nextPost = useMemo(() => {
    return posts.find((p) => p.status === 'scheduled' && p.scheduledDateTime) || sortedPosts[0]
  }, [posts, sortedPosts])

  useEffect(() => {
    if (!nextPost || !nextPost.scheduledDateTime) {
      setTimeLeft({ h: '00', m: '00', s: '00' })
      return
    }

    const calculateTimeLeft = () => {
      const diff = new Date(nextPost.scheduledDateTime!).getTime() - new Date().getTime()

      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' })
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({
        h: hours.toString().padStart(2, '0'),
        m: minutes.toString().padStart(2, '0'),
        s: seconds.toString().padStart(2, '0'),
      })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [nextPost])

  const handleDelete = (id: string) => {
    setPostToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        const res = await deletePost(postToDelete).unwrap()
        toast.success(res.message || t('social_deployment_cancelled'))
        refetch()
        setIsDeleteModalOpen(false)
        setPostToDelete(null)
      } catch (err) {
        const error = err as ApiError
        toast.error(error?.data?.message || t('social_cancellation_failure'))
      }
    }
  }

  const handleRetry = async (id: string, socialAccountId?: string) => {
    try {
      const res = await retrySocialPost({ id, socialAccountId }).unwrap()
      toast.success(res?.message || 'Publishing retry initiated!')
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to retry publishing.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-vh-50">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-xl shadow-primary/10" />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">
            {t('social_sync_queue')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-11 p-0 bg-primary/10 text-primary hover:bg-primary/20 rounded-[8px] transition-all shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight title-color dark:text-white leading-none">
              {t('social_scheduled_posts')}
            </h1>
          </div>
        </div>
        <Button
          className="w-full md:w-auto sm:h-12 h-10 text-base btn-color rounded-[8px] text-white px-6 font-medium active:translate-y-0.5"
          asChild
        >
          <Link href={ROUTES.SOCIAL_MEDIA.CREATE_POST}>
            <Plus className="w-5 h-5" />
            {t('social_init_post')}
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <PostQueueSummary postsCount={posts.filter((p) => p.status === 'scheduled').length} nextPost={nextPost} timeLeft={timeLeft} />

      {/* Timeline Section */}
      <div className="space-y-6 pt-4 max-w-[1100px] m-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium tracking-tight text-title-color capitalize dark:text-white">
              {selectedFilter === 'scheduled'
                ? t('social_roadmap') || 'Upcoming Queue'
                : selectedFilter === 'published'
                ? 'Published & Live Posts'
                : selectedFilter === 'draft'
                ? 'Draft Posts'
                : 'All Social Posts'}
            </h2>
            <Badge variant="outline" className="text-xs font-mono">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </Badge>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-muted/30 p-1.5 rounded-xl border border-border/10">
            <button
              onClick={() => setSelectedFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap',
                selectedFilter === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Posts</span>
            </button>
            <button
              onClick={() => setSelectedFilter('scheduled')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap',
                selectedFilter === 'scheduled'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Scheduled Queue</span>
            </button>
            <button
              onClick={() => setSelectedFilter('published')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap',
                selectedFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Published & Live</span>
            </button>
            <button
              onClick={() => setSelectedFilter('draft')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap',
                selectedFilter === 'draft'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Drafts</span>
            </button>
            <button
              onClick={() => setSelectedFilter('failed')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap',
                selectedFilter === 'failed'
                  ? 'bg-destructive text-white shadow-md shadow-destructive/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Failed & Issues</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {sortedPosts.length === 0 ? (
            <EmptyPostState />
          ) : (
            sortedPosts.map((post) => (
              <PostTimelineItem
                key={post.id}
                post={post}
                onEdit={(id) => router.push(`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?edit=${id}`)}
                onDelete={handleDelete}
                onRetry={handleRetry}
                isRetrying={isRetrying}
              />
            ))
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('social_cancel_confirm')}
        description={t('social_cancel_desc') || t('This action cannot be undone.')}
        isLoading={isDeleting}
      />
    </div>
  )
}
