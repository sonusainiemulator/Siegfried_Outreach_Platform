'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useGenerateOutlinesMutation } from '@/redux/api/aiContentApi'
import { StepOutlineProps } from '@/types'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { ArrowLeft, BookmarkCheck, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import OutlineEditor from './components/OutlineEditor'
import OutlineHeader from './components/OutlineHeader'

const StepOutline = ({ data, onNext, onBack, onDataChange, onSaveDraft }: StepOutlineProps) => {
  const { t } = useTranslation()

  const [outlines, setOutlines] = useState<string[][]>(data.generatedOutlines || [])
  const [selectedOutline, setSelectedOutline] = useState<string[]>(data.selectedOutline || [])
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(data.selectedOutlineTabIndex ?? 0)
  const [numGenerated, setNumGenerated] = useState<number>(
    data.generatedOutlines?.length ?? 0,
  )

  const [currentSection, setCurrentSection] = useState('')
  const [showAddInput, setShowAddInput] = useState(false)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)

  const [generateOutlines, { isLoading }] = useGenerateOutlinesMutation()

  const syncToParent = (newSelected: string[], newOutlines: string[][], newTabIndex: number) => {
    onDataChange?.({
      selectedOutline: newSelected,
      generatedOutlines: newOutlines,
      selectedOutlineTabIndex: newTabIndex,
    })
  }

  const handleInitialGeneration = async () => {
    try {
      const res = await generateOutlines({
        topic: data.topic,
        keywords: data.keywords,
        title: data.selectedTitle,
        numSubtitles: 10,
        numOutlines: 3,
        language: data.language,
        blogLength: data.blogLength,
        creativity: data.creativity,
      }).unwrap()

      const fetched: string[][] = Array.isArray(res.outlines) ? res.outlines : res.outlines?.outlines || []

      const customOutlines = outlines.slice(numGenerated)
      const nextOutlines = [...fetched, ...customOutlines]

      setNumGenerated(fetched.length)
      setOutlines(nextOutlines)

      const first = fetched[0] || []
      setSelectedOutline(first)
      setSelectedTabIndex(0)
      syncToParent(first, nextOutlines, 0)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('something_went_wrong'))
    }
  }

  // Auto-generate only on first ever visit (nothing saved yet)
  useEffect(() => {
    if (outlines.length === 0 && selectedOutline.length === 0) {
      // eslint-disable-next-line
      handleInitialGeneration()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectOutlineByIndex = (index: number) => {
    const outline = outlines[index] || []
    setSelectedTabIndex(index)
    setSelectedOutline(outline)
    syncToParent(outline, outlines, index)
  }

  const handleBulkAdd = (sections: string[]) => {
    const nextOutlines = [...outlines, sections]
    const newIndex = nextOutlines.length - 1
    setOutlines(nextOutlines)
    setSelectedTabIndex(newIndex)
    setSelectedOutline(sections)
    syncToParent(sections, nextOutlines, newIndex)
  }

  const handleAddSection = (index?: number) => {
    if (currentSection.trim()) {
      const newOutline = [...selectedOutline]
      if (typeof index === 'number') {
        newOutline.splice(index + 1, 0, currentSection.trim())
      } else {
        newOutline.push(currentSection.trim())
      }
      setSelectedOutline(newOutline)
      setCurrentSection('')
      setShowAddInput(false)
      setInsertIndex(null)
      syncToParent(newOutline, outlines, selectedTabIndex)
    }
  }

  const removeSection = (index: number) => {
    const newOutline = selectedOutline.filter((_, i) => i !== index)
    setSelectedOutline(newOutline)

    const isCustomTab = selectedTabIndex >= numGenerated
    if (newOutline.length === 0 && isCustomTab && outlines.length > 1) {
      const nextOutlines = outlines.filter((_, i) => i !== selectedTabIndex)
      const fallbackIndex = Math.max(0, selectedTabIndex - 1)
      const fallback = nextOutlines[fallbackIndex] || []
      setOutlines(nextOutlines)
      setSelectedTabIndex(fallbackIndex)
      setSelectedOutline(fallback)
      syncToParent(fallback, nextOutlines, fallbackIndex)
    } else {
      syncToParent(newOutline, outlines, selectedTabIndex)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = selectedOutline.findIndex((_, i) => `item-${i}` === active.id)
      const newIndex = selectedOutline.findIndex((_, i) => `item-${i}` === over.id)
      const newOutline = arrayMove(selectedOutline, oldIndex, newIndex)
      setSelectedOutline(newOutline)
      syncToParent(newOutline, outlines, selectedTabIndex)
    }
  }

  return (
    <Card className="border border-border/40 glass-dark-card bg-card/40 backdrop-blur-xl overflow-hidden p-4 sm:p-6 space-y-6 sm:space-y-10  flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-2">
        <div className="space-y-1 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="text-lg sm:text-xl font-medium text-primary tracking-tight">
              {t('content_architecture')}
            </span>
          </div>
          <p className="text-subtitle-color font-medium text-xs sm:text-base opacity-70 leading-relaxed">
            {t('outline_description_sub')}
          </p>
        </div>

        <OutlineHeader
          outlines={outlines}
          selectedTabIndex={selectedTabIndex}
          isLoading={isLoading}
          onSelectOutlineByIndex={handleSelectOutlineByIndex}
          onRegenerate={handleInitialGeneration}
          onBulkAdd={handleBulkAdd}
        />
      </div>

      <OutlineEditor
        selectedOutline={selectedOutline}
        isLoading={isLoading}
        showAddInput={showAddInput}
        currentSection={currentSection}
        insertIndex={insertIndex}
        setShowAddInput={setShowAddInput}
        setCurrentSection={setCurrentSection}
        setInsertIndex={setInsertIndex}
        onAddSection={handleAddSection}
        onRemoveSection={removeSection}
        onDragEnd={handleDragEnd}
      />

      <div className="flex items-center justify-between  border-t border-border/20">
        <Button
          variant="outline"
          size="sm"
          className="sm:h-12 h-10 rounded-[8px] border border-border/60 bg-white/5! inner-card! glass-button p-button-padding! font-medium text-sm gap-2 px-10 transition-all active:scale-95"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('back')}
        </Button>

        <div className="flex items-center gap-3 text-wrap">
          {onSaveDraft && (
            <Button
              variant="outline"
              size="lg"
              className="sm:h-12 h-10 rounded-border-radius border-border/40 glass-dark-card font-medium text-sm gap-2 px-6 transition-all active:scale-95"
              onClick={onSaveDraft}
            >
              <BookmarkCheck className="w-4 h-4" />
              {t('save_draft', { defaultValue: 'Save Draft' })}
            </Button>
          )}
          <Button
            size="lg"
            className="sm:h-12 h-10 rounded-border-radius  btn-color text-white p-button-padding font-medium text-sm gap-2.5 px-10 transition-all disabled:opacity-50"
            disabled={selectedOutline.length === 0}
            onClick={() => onNext({ selectedOutline })}
          >
            {t('continue_visuals', { defaultValue: 'Continue Visuals' })}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default StepOutline
