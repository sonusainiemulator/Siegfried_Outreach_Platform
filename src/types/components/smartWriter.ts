import React from 'react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number'
  placeholder?: string
  options?: string[]
  required?: boolean
}

export interface Template {
  id: string
  _id?: string
  title: string
  description: string
  category: string
  icon: string
  slug: string
  isFavorite?: boolean
  formFields?: FormField[]
}

export interface GenerationFormProps {
  template: Template
  onSubmit: (data: any) => void
  isLoading: boolean
  onBack: () => void
}

export interface TemplateCardProps {
  template: Template
  onClick: (template: Template) => void
  onToggleFavorite: (e: React.MouseEvent, id: string) => void
}

export interface TemplateGalleryHeaderProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  categories: string[]
  activeCategory: string
  setActiveCategory: (val: string) => void
}

export interface WriterEditorHeaderProps {
  docTitle: string
  setDocTitle: (val: string) => void
  generatedContent: string
  isCopied: boolean
  isSaving: boolean
  handleCopy: () => void
  handleSave: () => void
  handleDownload: () => void
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export interface SmartWriterNavigationProps {
    categories: string[]
    activeCategory: string
    setActiveCategory: (cat: string) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    showTemplateTray: boolean
    setShowTemplateTray: (show: boolean) => void
    filteredTemplates: Template[]
    handleTemplateSelect: (template: Template) => void
    handleToggleFavorite: (e: React.MouseEvent, id: string) => void
    templatesLoading: boolean
}

export interface SmartWriterWorkspaceProps {
  selectedTemplate: Template
  setSelectedTemplate: (template: Template | null) => void
  showOptions: boolean
  setShowOptions: (show: boolean) => void
  docTitle: string
  setDocTitle: (title: string) => void
  generatedContent: string
  setGeneratedContent: (content: string) => void
  isCopied: boolean
  isGenerating: boolean
  isSaving: boolean
  handleGenerate: (formData: any) => void
  handleCopy: () => void
  handleSave: () => void
  handleDownload: () => void
}

export interface WriterCanvasStateProps {
  isGenerating: boolean
}