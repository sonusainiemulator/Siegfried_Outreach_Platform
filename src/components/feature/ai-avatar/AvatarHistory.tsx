'use client'

import React, { useState } from 'react'
import {
  useGetAvatarHistoryQuery,
  useDeleteAvatarMutation,
  AvatarItem
} from '@/redux/api/avatarApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sparkles,
  Video as VideoIcon,
  Search,
  Trash2,
  Download,
  Eye,
  Calendar,
  Layers,
  ArrowLeft,
  RefreshCw,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { AvatarPreviewModal } from './AvatarPreviewModal'

export const AvatarHistory: React.FC = () => {
  const router = useRouter()
  const [filterType, setFilterType] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const { data, isLoading, refetch } = useGetAvatarHistoryQuery({
    type: filterType,
    search: search.trim() || undefined,
    page,
    limit: 18,
  })

  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation()

  const [selectedItem, setSelectedItem] = useState<AvatarItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const items = data?.data || []
  const meta = data?.meta

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this avatar creation?')) return

    try {
      await deleteAvatar(id).unwrap()
      toast.success('Avatar deleted successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete avatar')
    }
  }

  const handleDownload = (item: AvatarItem, e: React.MouseEvent) => {
    e.stopPropagation()
    const mediaUrl = item.content || item.images?.[0]
    if (!mediaUrl) return

    const a = document.createElement('a')
    a.href = mediaUrl
    a.download = `${item.title || 'avatar'}.${item.type === 'avatar_video' ? 'mp4' : 'png'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Download started')
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/70 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(ROUTES.AI_AVATAR)}
            className="rounded-xl border-border hover:bg-secondary cursor-pointer h-9 px-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Studio
          </Button>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Avatar Creations Gallery
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage, preview, and download your generated avatars and video presentations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-secondary border border-border/60">
            <button
              onClick={() => {
                setFilterType('all')
                setPage(1)
              }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                filterType === 'all' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              All ({meta?.total ?? items.length})
            </button>
            <button
              onClick={() => {
                setFilterType('avatar')
                setPage(1)
              }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1',
                filterType === 'avatar' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Avatars
            </button>
            <button
              onClick={() => {
                setFilterType('avatar_video')
                setPage(1)
              }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1',
                filterType === 'avatar_video' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <VideoIcon className="w-3 h-3 text-fuchsia-500" />
              Videos
            </button>
          </div>

          {/* New Avatar Button */}
          <Button
            onClick={() => router.push(ROUTES.AI_AVATAR)}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white gap-1.5 h-9 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search creations by title or prompt..."
          className="pl-10 h-10 rounded-xl bg-card border-border text-sm"
        />
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Loading your creations...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-card border border-dashed border-border/80 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">No Avatar Creations Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {search ? 'No results matched your search query.' : 'You have not created any AI avatars yet.'}
            </p>
          </div>
          <Button
            onClick={() => router.push(ROUTES.AI_AVATAR)}
            className="rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Avatar
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => {
            const isVideo = item.type === 'avatar_video'
            const mediaUrl = item.content || item.images?.[0] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600'

            return (
              <div
                key={item._id}
                onClick={() => {
                  setSelectedItem(item)
                  setPreviewOpen(true)
                }}
                className="group relative rounded-2xl bg-card border border-border/70 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer flex flex-col justify-between"
              >
                {/* Image / Thumbnail */}
                <div className="aspect-square w-full bg-secondary/30 relative overflow-hidden">
                  <img
                    src={mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                    {isVideo ? <VideoIcon className="w-3 h-3 text-fuchsia-400" /> : <Sparkles className="w-3 h-3 text-indigo-400" />}
                    <span>{isVideo ? 'Video' : 'Avatar'}</span>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedItem(item)
                        setPreviewOpen(true)
                      }}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white text-black hover:text-black transition-colors backdrop-blur-md"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4 text-white hover:text-black" />
                    </button>
                    <button
                      onClick={(e) => handleDownload(item, e)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white text-black hover:text-black transition-colors backdrop-blur-md"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-white hover:text-black" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white transition-colors backdrop-blur-md"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3 bg-card border-t border-border/50">
                  <h4 className="font-bold text-xs text-foreground truncate">{item.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.metadata?.style && (
                      <span className="capitalize font-semibold text-primary">{item.metadata.style}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="rounded-xl"
          >
            Previous
          </Button>
          <span className="text-xs font-semibold text-muted-foreground px-3">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal Preview */}
      <AvatarPreviewModal
        item={selectedItem}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onUseInVideo={(avatar) => {
          router.push(ROUTES.AI_AVATAR)
        }}
      />
    </div>
  )
}
