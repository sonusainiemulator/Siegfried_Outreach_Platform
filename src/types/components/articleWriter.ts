import { LucideIcon } from 'lucide-react'
import { DragEndEvent } from '@dnd-kit/core'

export interface ArticleFormData {
  topic: string
  numKeywords: number
  language: string
  blogLength: number
  creativity: string
  keywords: string[]
  selectedTitle: string
  generatedTitles: string[]
  selectedOutline: string[]
  generatedOutlines: string[][]
  /** Index of the active outline tab – persisted so back/forward keeps the right tab highlighted */
  selectedOutlineTabIndex: number
  selectedImage: string
  articleContent: string
  articleId: string
}

export interface Step {
  id: string
  label: string
  icon: LucideIcon
}

export interface ArticleHeaderProps {
  onReset: () => void
  onSelectArticle: (article: Record<string, unknown>) => void
  historyOpen: boolean
  setHistoryOpen: (open: boolean) => void
  canGenerate: boolean
}

export interface JourneyMapProps {
  steps: Step[]
  activeStep: number
  setActiveStep: (step: number) => void
  isFinalStepCompleted?: boolean
}

export interface GlobalConfigProps {
  formData: ArticleFormData
  setFormData: React.Dispatch<React.SetStateAction<ArticleFormData>>
}

export interface ArticleHistoryProps {
  onSelect: (article: Record<string, unknown>) => void
}

export interface StepTopicProps {
  data: Partial<ArticleFormData>
  onNext: (data: Partial<ArticleFormData>) => void
  canGenerate: boolean
  onSaveDraft?: () => void
}

export interface StepTitlesProps {
  data: ArticleFormData
  onNext: (data: Partial<ArticleFormData>) => void
  onBack: () => void
  onDataChange: (data: Partial<ArticleFormData>) => void
  onSaveDraft?: () => void
}

export interface StepOutlineProps {
  data: ArticleFormData
  onNext: (data: Partial<ArticleFormData>) => void
  onBack: () => void
  onDataChange: (data: Partial<ArticleFormData>) => void
  onSaveDraft?: () => void
}

export interface StepImageProps {
  data: ArticleFormData
  onNext: (data: Partial<ArticleFormData>) => void
  onBack: () => void
  onSaveDraft?: () => void
}

export interface StepFinalProps {
  data: ArticleFormData
  onReset: () => void
  onComplete?: (isCompleted: boolean) => void
}

export interface SortableItemProps {
  id: string
  item: string
  index: number
  onRemove: (index: number) => void
  onAddAfter: (index: number) => void
}

export interface OutlineHeaderProps {
  outlines: string[][]
  selectedTabIndex: number
  isLoading: boolean
  onSelectOutlineByIndex: (index: number) => void
  onRegenerate: () => void
  onBulkAdd: (sections: string[]) => void
}

export interface OutlineEditorProps {
  selectedOutline: string[]
  isLoading: boolean
  showAddInput: boolean
  currentSection: string
  insertIndex: number | null
  setShowAddInput: (show: boolean) => void
  setCurrentSection: (section: string) => void
  setInsertIndex: (index: number | null) => void
  onAddSection: (index?: number) => void
  onRemoveSection: (index: number) => void
  onDragEnd: (event: DragEndEvent) => void
}

export interface ArticleContentViewerProps {
  displayedHtml: string
  isAnimating: boolean
  viewMode: 'preview' | 'code'
  selectedTitle: string
  selectedImage: string
}

export interface ArticleStatsProps {
  articleHtml: string
  onReset: () => void
  generationTime?: number | string
}

export interface ArticleHeaderControlsProps {
  viewMode: 'preview' | 'code'
  isCompleted: boolean
  onViewModeChange: (mode: 'preview' | 'code') => void
  onDownload: () => void
  onCopy: () => void
}

export interface ToolbarProps {
  editor: any
  isFullScreen: boolean
  setIsFullScreen: (val: boolean) => void
}

export interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}