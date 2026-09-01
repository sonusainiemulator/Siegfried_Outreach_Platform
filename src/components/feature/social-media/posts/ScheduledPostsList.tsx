'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useDeleteSocialPostMutation, useGetSocialPostsQuery } from '@/redux/api/socialMediaApi'
import { ApiError } from '@/types'
import { SocialPost } from '@/types/components/socialMedia'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EmptyPostState } from './components/EmptyPostState'
import { PostQueueSummary } from './components/PostQueueSummary'
import { PostTimelineItem } from './components/PostTimelineItem'

export default function ScheduledPostsList() {
  const { t } = useTranslation()
  const { data, isLoading, refetch } = useGetSocialPostsQuery({ status: 'scheduled' })
  const [deletePost, { isLoading: isDeleting }] = useDeleteSocialPostMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const posts: SocialPost[] = data?.socialPosts || []
  const router = useRouter()

  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' })

  const sortedPosts = useMemo(() => {
    return [...posts].sort(
      (a, b) => new Date(a.scheduledDateTime!).getTime() - new Date(b.scheduledDateTime!).getTime(),
    )
  }, [posts])

  const nextPost = sortedPosts[0]

  useEffect(() => {
    if (!nextPost) {
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
      <PostQueueSummary postsCount={posts.length} nextPost={nextPost} timeLeft={timeLeft} />

      {/* Timeline Section */}
      <div className="space-y-6 pt-8 max-w-[1100px] m-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium tracking-tight text-title-color capitalize dark:text-white">
              {t('social_roadmap') || 'Upcoming Timeline'}
            </h2>
          </div>

        </div>

        <div className="grid gap-6">
          {posts.length === 0 ? (
            <EmptyPostState />
          ) : (
            posts.map((post) => (
              <PostTimelineItem key={post.id} post={post} onEdit={(id) => router.push(`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?edit=${id}`)} onDelete={handleDelete} />
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
