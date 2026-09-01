import { LucideIcon } from 'lucide-react'

export interface CodeLanguage {
  value: string
  label: string
  icon: LucideIcon
  color: string
}

export interface CodeModel {
  value: string
  label: string
  desc: string
  badge: string
  color: string
}

export interface CodeStyle {
  value: string
  label: string
  icon: LucideIcon
}

export interface CodeHeaderProps {
  models: CodeModel[]
  selectedModel: string
  onModelSelect: (model: string) => void
}

export interface CodeLanguageSelectorProps {
  languages: CodeLanguage[]
  selectedLanguage: string
  onLanguageSelect: (lang: string) => void
  searchLang?: string
  onSearchChange?: (val: string) => void
}

export interface ConfigPanelProps {
  styles: CodeStyle[]
  selectedStyle: string
  onStyleSelect: (style: string) => void
  includeComments: boolean
  onCommentsToggle: (val: boolean) => void
  giveInstructions: boolean
  onInstructionsToggle: (val: boolean) => void
}

export interface PromptAreaProps {
  prompt: string
  onPromptChange: (val: string) => void
  title: string
  onTitleChange: (val: string) => void
  onClear: () => void
  language: string
  model: string
  onGenerate: () => void
  isLoading: boolean
}

export interface CodeOutputProps {
  isLoading: boolean
  generatedCode: string
  language: string
  model: string
  onCopy: (code: string) => void
  onDownload: (code: string, lang: string) => void
  copied: boolean
}

