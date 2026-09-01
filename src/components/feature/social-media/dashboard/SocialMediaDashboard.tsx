'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useDeleteSocialPostMutation, useGetDashboardDataQuery } from '@/redux/api/socialMediaApi'
import { ApiError } from '@/types'
import { DashboardPlatformCardProps } from '@/types/components/socialMedia'
import { isBrowser } from '@/utils/environment'
import { AlertCircle, AtSign, Facebook, Globe, Instagram, Linkedin, Loader2, MessageCircle, MessageSquare, Store, Video, XIcon, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import DashboardHeader from './components/DashboardHeader'
import DashboardPlatformCards from './components/DashboardPlatformCards'
import EngagementChart from './components/EngagementChart'
import PublishedPostsMatrix from './components/PublishedPostsMatrix'
import RecentPostsSection from './components/RecentPostsSection'
import StatsCards from './components/StatsCards'

const SocialMediaDashboard = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()

  const canManagePosts = hasPermission('Manage Posts', 'write')

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetDashboardDataQuery(undefined, {
    pollingInterval: 10000,
  })

  const [deletePost, { isLoading: isDeleting }] = useDeleteSocialPostMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="max-w-md border-destructive/20 bg-destructive/5 backdrop-blur-sm">
          <CardContent className="pt-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <div className="space-y-1">
              <h3 className="font-black text-lg uppercase tracking-tight">{t('social_system_outage')}</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest opacity-60">
                {t('social_telemetry_failed')}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="rounded-xl h-11 px-8 font-black uppercase text-[10px] tracking-widest"
            >
              {t('social_retry_handshake')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = dashboardData?.stats || {}
  const engagementChart = dashboardData?.engagementChart || []
  const publishedPostsChart = dashboardData?.publishedPostsChart || []
  const recentPosts = dashboardData?.recentPosts || []

  const totalFollowers = (Object.values(stats?.followersByPlatform || {}) as number[]).reduce(
    (acc, curr) => acc + curr,
    0,
  )

  const platforms: DashboardPlatformCardProps[] = [
    {
      id: 'whatsapp',
      name: t('social_whatsapp', { defaultValue: 'WhatsApp' }),
      icon: MessageSquare,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      followers: stats?.followersByPlatform?.whatsapp || 0,
    },
    {
      id: 'facebook',
      name: t('social_facebook'),
      icon: Facebook,
      color: 'text-facebook',
      bgColor: 'bg-facebook/10',
      followers: stats?.followersByPlatform?.facebook || 0,
    },
    {
      id: 'instagram',
      name: t('social_instagram'),
      icon: Instagram,
      color: 'text-instagram',
      bgColor: `bg-instagram/10`,
      followers: stats?.followersByPlatform?.instagram || 0,
    },
    {
      id: 'linkedin',
      name: t('social_linkedin'),
      icon: Linkedin,
      color: 'text-linkedin',
      bgColor: 'bg-linkedin/10',
      followers: stats?.followersByPlatform?.linkedin || 0,
    },
    {
      id: 'twitter',
      name: t('social_twitter'),
      icon: XIcon,
      color: 'text-twitter',
      bgColor: 'bg-twitter/10',
      followers: stats?.followersByPlatform?.twitter || 0,
    },
    {
      id: 'youtube',
      name: t('social_youtube', { defaultValue: 'YouTube' }),
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
      followers: stats?.followersByPlatform?.youtube || 0,
    },
    {
      id: 'google',
      name: t('social_google', { defaultValue: 'Google My Business' }),
      icon: Store,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10',
      followers: stats?.followersByPlatform?.google || 0,
    },
    {
      id: 'tiktok',
      name: t('social_tiktok', { defaultValue: 'TikTok' }),
      icon: Video,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      followers: stats?.followersByPlatform?.tiktok || 0,
    },
    {
      id: 'reddit',
      name: t('social_reddit', { defaultValue: 'Reddit' }),
      icon: MessageCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      followers: stats?.followersByPlatform?.reddit || 0,
    },
    {
      id: 'threads',
      name: t('social_threads', { defaultValue: 'Threads' }),
      icon: AtSign,
      color: 'text-neutral-900 dark:text-white',
      bgColor: 'bg-neutral-900/10 dark:bg-white/10',
      followers: stats?.followersByPlatform?.threads || 0,
    },
    {
      id: 'wordpress',
      name: t('social_wordpress', { defaultValue: 'WordPress' }),
      icon: Globe,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      followers: stats?.posts?.wordpress?.total ?? stats?.followersByPlatform?.wordpress ?? 0,
      publishedCount: stats?.posts?.wordpress?.published ?? 0,
      draftCount: stats?.posts?.wordpress?.scheduled ?? 0,
    },
  ]

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPostToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        const res = await deletePost(postToDelete).unwrap()
        toast.success(res.message || t('social_node_purged'))
        setIsDeleteModalOpen(false)
        setPostToDelete(null)
      } catch (err) {
        const error = err as ApiError
        toast.error(error?.data?.message || t('social_purge_failure'))
      }
    }
  }

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?edit=${id}`)
  }

  const isDark = isBrowser && document.documentElement.classList.contains('dark')

  return (
    <div className="space-y-8 animate-fade-in">

      <DashboardHeader/>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-8">
          <StatsCards stats={stats} totalFollowers={totalFollowers} />

          <DashboardPlatformCards platforms={platforms} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EngagementChart data={engagementChart} />
            <PublishedPostsMatrix data={publishedPostsChart} isDark={isDark} />
          </div>

          <RecentPostsSection
            recentPosts={recentPosts}
            platforms={platforms}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canManage={canManagePosts}
          />
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('social_delete_node_confirm')}
        description={t('social_cancel_desc') || t('This action cannot be undone.')}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default SocialMediaDashboard
