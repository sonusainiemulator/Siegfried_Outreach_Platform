import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getTheme } from '@/data/slideMaker'
import { PresentationCardProps } from '@/types/presentation'
import { downloadFile } from '@/utils/download'
import { formatDistanceToNow } from 'date-fns'
import { Download, Eye, Loader2, MonitorPlay, Trash2 } from 'lucide-react'
import { useState } from 'react'
import SlideRenderer from './SlideRenderer'

const PresentationCard = ({ item, onView, onDelete, isDeleting }: PresentationCardProps) => {
  const [hovered, setHovered] = useState(false)

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    const fileName = item.title || 'presentation'
    const fileUrl = item.downloadUrl || (item.content?.startsWith('http') ? item.content : `/api${item.content}`)
    downloadFile(fileUrl, `${fileName}.pptx`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const id = (item as any)._id || item.id
    if (!id) return
    if (confirm('Delete this presentation?')) {
      onDelete(id)
    }
  }

  const presentation = item?.data || item
  const presentationData = presentation?.metadata?.presentationData || presentation?.data || {}
  const slides = presentationData?.slides || presentation?.slides || presentation?.presentation?.slides || []
  const firstSlide = presentationData?.title
    ? {
      type: 'title',
      title: presentationData.title,
      subtitle: presentationData.subtitle,
      image: presentationData.image,
    }
    : slides[0]

  const themeName = presentation?.metadata?.options?.theme || presentation?.theme || 'Executive Light'
  const theme = getTheme(themeName)

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group rounded-3xl border border-zinc-200/60 dark:border-glass-border bg-white dark:bg-light-gray overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
    >
      <div className="h-44 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden transition-colors">
        {firstSlide ? (
          <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
            <SlideRenderer slide={firstSlide} theme={theme} index={0} isThumbnail={true} />
          </div>
        ) : (
          <MonitorPlay className="w-14 h-14 text-zinc-300 dark:text-zinc-700 transition-all duration-500 ease-out z-10" />
        )}

        {/* Bottom Right Hover Options */}
        <div
          className={`absolute bottom-3 right-3 flex items-center gap-2 transition-all duration-300 z-30 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-100 lg:opacity-0 lg:translate-y-2 pointer-events-auto lg:pointer-events-none'}`}
        >
          <Button
            onClick={() => onView(item)}
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur shadow-sm text-zinc-800 dark:text-white flex items-center justify-center p-0! hover:bg-primary! hover:text-white transition-all transform hover:scale-110"
            title="View"
          >
            <Eye className="w-4.5 h-4.5" />
          </Button>
          <Button
            onClick={handleDownload}
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur shadow-sm text-zinc-800 dark:text-white flex items-center justify-center p-0! hover:bg-primary! hover:text-white transition-all transform hover:scale-110"
            title="Download"
          >
            <Download className="w-4.5 h-4.5" />
          </Button>
          <Button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur shadow-sm text-red-600 flex items-center justify-center p-0! hover:bg-red-600! hover:text-white transition-all transform hover:scale-110 disabled:opacity-50"
            title="Remove"
          >
            {isDeleting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
          </Button>
        </div>
      </div>
      <div className="p-5" onClick={() => onView(item)}>
        <h3 className="font-semibold text-title-color dark:text-white text-base truncate mb-1">
          {item.title || presentationData?.title || 'Untitled Presentation'}
        </h3>
        <p className="text-xs font-medium text-subtitle-color">
          {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : ''}
        </p>
      </div>
    </Card>
  )
}

export default PresentationCard
