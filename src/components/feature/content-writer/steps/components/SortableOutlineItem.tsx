'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SortableItemProps } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'

const SortableOutlineItem = ({ id, item, index, onRemove }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-border-radius inner-card glass-dark-card border border-border/40 transition-all cursor-default',
          isDragging && 'shadow-2xl ring-2 ring-primary/20',
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-[10px] font-black text-primary border border-primary/20 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>

        <h4 className="flex-1 text-base font-medium tracking-tight text-foreground/80 group-hover:text-foreground line-clamp-2">
          {item}
        </h4>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg dark:hover:bg-red-900/20 text-muted-foreground hover:text-destructive active:scale-90"
            onClick={() => onRemove(index)}
          >
            <X className="w-4 h-4" />
          </Button>
          <div
            {...attributes}
            {...listeners}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-muted/20 transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>

  )
}

export default SortableOutlineItem
