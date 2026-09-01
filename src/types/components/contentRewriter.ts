import React from 'react'

export interface RewriterMode {
  id: string
  name: string
  description: string
}

export interface RewriterEditorProps {
  docTitle: string
  setDocTitle: (val: string) => void
  content: string
  setContent: (val: string) => void
  generatedContent: string
  setGeneratedContent: (val: string) => void
  mode: string
  setMode: (val: string) => void
  language: string
  setLanguage: (val: string) => void
  isRewriting: boolean
  isSaving: boolean
  isCopied: boolean
  modes: RewriterMode[]
  modesLoading: boolean
  handleGenerate: () => void
  handleCopy: () => void
  handleSave: () => void
  handleDownload: () => void
}

export interface RewriterSidebarProps {
  content: string
  setContent: (val: string) => void
  mode: string
  setMode: (val: string) => void
  language: string
  setLanguage: (val: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (val: boolean) => void
  handleGenerate: (e?: React.FormEvent) => void
  isRewriting: boolean
  modes: RewriterMode[]
  modesLoading: boolean
}

export interface HistoryPageHeaderProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
}

export interface RewriterHeaderProps {
  onReset: () => void
}
