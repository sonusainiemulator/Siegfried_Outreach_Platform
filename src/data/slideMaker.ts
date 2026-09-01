import { ThemeColors } from '@/types/presentation'

export const themes: Record<string, ThemeColors> = {
  'Executive Light': { bg: '#FFFFFF', titleC: '#1a1a2e', subC: '#555577', headC: '#3a3a6e', bodyC: '#333355', accent: '#6C63FF', mode: 'light' },
  'Midnight Cypher': { bg: '#0d0d0d', titleC: '#FFFFFF', subC: '#cccccc', headC: '#FFFFFF', bodyC: '#dddddd', accent: '#00e5ff', mode: 'dark'  },
  'Vintage Studio':  { bg: '#FEFAF3', titleC: '#5C3D11', subC: '#8a6040', headC: '#7B4F1E', bodyC: '#4a3520', accent: '#D4A056', mode: 'light' },
  'Deep Atlantic':   { bg: '#0A1628', titleC: '#FFFFFF', subC: '#8eb8ff', headC: '#FFFFFF', bodyC: '#c0d4f7', accent: '#3B82F6', mode: 'dark'  },
  'Indigo Fusion':   { bg: '#FFFFFF', titleC: '#1E1B4B', subC: '#4338CA', headC: '#3730A3', bodyC: '#312E81', accent: '#818CF8', mode: 'light' },
  'Royal Orchid':    { bg: '#FFF8F0', titleC: '#4B2067', subC: '#7E3FA0', headC: '#6B21A8', bodyC: '#581C87', accent: '#C084FC', mode: 'light' },
  'Sunlit Crimson':  { bg: '#FFF5F5', titleC: '#9B1C1C', subC: '#DC2626', headC: '#B91C1C', bodyC: '#7f1d1d', accent: '#F87171', mode: 'light' },
  'Industrial Grey': { bg: '#F8F9FA', titleC: '#212529', subC: '#495057', headC: '#343A40', bodyC: '#495057', accent: '#868E96', mode: 'light' },
  'Emerald Peak':    { bg: '#111827', titleC: '#F9FAFB', subC: '#9CA3AF', headC: '#F3F4F6', bodyC: '#D1D5DB', accent: '#34D399', mode: 'dark'  },
  'Elegant Blossom': { bg: '#FFF1F2', titleC: '#881337', subC: '#BE123C', headC: '#9F1239', bodyC: '#881337', accent: '#FB7185', mode: 'light' },
}

export const getTheme = (name: string): ThemeColors => themes[name] || themes['Executive Light']

export const defaultLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese', 'Arabic', 'Hindi']

export const defaultSlidesCounts = ['short', 'informative']

export const defaultSizeOptions = [
  { label: 'Concise', value: 'Brief' },
  { label: 'Standard', value: 'Medium' },
  { label: 'Comprehensive', value: 'Detailed' },
  { label: 'Professional', value: 'Extensive' },
]

export const themeFilters = ['All', 'Dark', 'Light'] as const

export const defaultPresentationState = {
  prompt: '',
  theme: 'Executive Light',
  slidesCount: 'short',
  size: 'Medium',
  language: 'English',
  generateMode: 'generate',
  format: 'presentation',
  cardSplit: 'auto',
  textTone: 'professional',
  textAudience: 'general',
  imageSource: 'none',
  instruction: '',
}

export const advancedOptionsConfig = [
  { key: 'generate', label: 'ai_presentation_text_mode', state: 'generateMode' },
  { key: 'format', label: 'ai_presentation_format', state: 'format' },
  { key: 'cardSplit', label: 'ai_presentation_card_split', state: 'cardSplit' },
  { key: 'textTone', label: 'ai_presentation_text_tone', state: 'textTone' },
  { key: 'textAudience', label: 'ai_presentation_audience', state: 'textAudience' },
  { key: 'imageSource', label: 'ai_presentation_image_source', state: 'imageSource' },
]

export const getLanguages = (optionsData: any, advancedOpts: any): string[] => {
  const raw = optionsData?.languages || advancedOpts?.language?.choices || []
  if (raw.length > 0) return raw.map((l: any) => typeof l === 'string' ? l : l.label || l.value)
  return defaultLanguages
}

export const getSlidesCounts = (advancedOpts: any): string[] => {
  const raw = advancedOpts?.slidesCount?.choices || advancedOpts?.slides?.choices || []
  if (raw.length > 0) return raw.map((s: any) => typeof s === 'string' ? s : String(s.value ?? s))
  return defaultSlidesCounts
}

export const getSizeOptions = (advancedOpts: any): { label: string; value: string }[] => {
  const raw = advancedOpts?.size?.choices || advancedOpts?.cardSize?.choices || []
  if (raw.length > 0) return raw.map((s: any) => typeof s === 'string' ? { label: s, value: s } : { label: s.label, value: s.value })
  return defaultSizeOptions
}