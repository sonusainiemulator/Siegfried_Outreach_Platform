import { ArticleFormData, Step } from '@/types'
import { TFunction } from 'i18next'
import { ImageIcon, Layout, List, Send, Type } from 'lucide-react'

export const getSteps = (t: TFunction): Step[] => [
  { id: 'topic', label: t('topic_and_keywords'), icon: Layout },
  { id: 'titles', label: t('titles'), icon: Type },
  { id: 'outline', label: t('outline'), icon: List },
  { id: 'image', label: t('image'), icon: ImageIcon },
  { id: 'finalize', label: t('finalize'), icon: Send },
]

export const DRAFT_KEY = 'pixel-ai-content-draft'

export const DEFAULT_FORM_DATA: ArticleFormData = {
  topic: '',
  numKeywords: 10,
  language: 'English (USA)',
  blogLength: 800,
  creativity: 'Balanced',
  keywords: [],
  selectedTitle: '',
  generatedTitles: [],
  selectedOutline: [],
  generatedOutlines: [],
  selectedOutlineTabIndex: 0,
  selectedImage: '',
  articleContent: '',
  articleId: '',
}
