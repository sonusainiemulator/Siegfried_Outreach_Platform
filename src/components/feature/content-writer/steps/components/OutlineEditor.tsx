'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { OutlineEditorProps } from '@/types'
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Check, List, Plus, X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import SortableOutlineItem from './SortableOutlineItem'

const OutlineEditor = ({
  selectedOutline,
  isLoading,
  showAddInput,
  currentSection,
  insertIndex,
  setShowAddInput,
  setCurrentSection,
  setInsertIndex,
  onAddSection,
  onRemoveSection,
  onDragEnd,
}: OutlineEditorProps) => {
  const { t } = useTranslation()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <div className="flex-1 space-y-5 flex flex-col">
      <div className="flex items-center justify-between px-1 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-medium text-muted-foreground">{t('structure_sections')}</span>
          <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
            {selectedOutline.length} {t('sections')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showAddInput && insertIndex === null ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
              <Input
                placeholder={t('add_subheading', 'Add subheading...')}
                className="w-40 sm:w-56 h-10 rounded-[8px] border-border/40  text-xs sm:text-sm font-medium pl-4 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                value={currentSection}
                autoFocus
                onChange={(e) => setCurrentSection(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddSection()}
              />
              <Button
                size="icon"
                className="h-10 w-10 rounded-lg bg-primary shadow-md hover:shadow-primary/20 transition-all active:scale-95 shrink-0"
                onClick={() => onAddSection()}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-lg border-border/40 bg-destructive! hover:text-white transition-all shrink-0"
                onClick={() => setShowAddInput(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-10 w-10 rounded-lg border-border/40 bg-primary/5 p-0 text-primary transition-all hover:bg-primary hover:text-white active:scale-95 group/add shadow-sm"
              onClick={() => {
                setShowAddInput(true)
                setInsertIndex(null)
              }}
              title={t('add_custom')}
            >
              <Plus className="w-5 h-5  group-hover:text-white hover:text-white transition-all transform group-hover:scale-110" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-border-radius  custom-scrollbar overflow-y-auto space-y-1.5 max-h-75 group hover:border-border/60 transition-all">
        {isLoading && selectedOutline.length === 0 ? (
          <Spinner className="h-full" text={t('architecting_article')} />
        ) : selectedOutline.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-12">
            <List className="w-14 h-14" strokeWidth={1} />
            <p className="font-medium text-sm mt-3">{t('empty_outline')}</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={selectedOutline.map((_, i) => `item-${i}`)} strategy={verticalListSortingStrategy}>
              {selectedOutline.map((item, i) => (
                <React.Fragment key={`item-${i}`}>
                  <SortableOutlineItem
                    id={`item-${i}`}
                    item={item}
                    index={i}
                    onRemove={onRemoveSection}
                    onAddAfter={(index) => {
                      setShowAddInput(true)
                      setInsertIndex(index)
                    }}
                  />

                  {showAddInput && insertIndex === i && (
                    <div className="flex items-center gap-2 p-2 animate-in slide-in-from-top-2 duration-300">
                      <Input
                        placeholder={t('add_subheading', 'Add subheading...')}
                        className="flex-1 h-10 rounded-[8px] border-border/40 text-xs sm:text-sm font-medium pl-4 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                        value={currentSection}
                        autoFocus
                        onChange={(e) => setCurrentSection(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onAddSection(i)}
                      />
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-lg bg-primary shadow-md hover:shadow-primary/20 transition-all active:scale-95 shrink-0"
                        onClick={() => onAddSection(i)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-lg border-border/40 text-muted-foreground hover:bg-primary hover:text-white transition-all shrink-0"
                        onClick={() => {
                          setShowAddInput(false)
                          setInsertIndex(null)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default OutlineEditor
