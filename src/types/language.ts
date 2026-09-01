export interface Language {
  id: string
  name: string
  locale: string
  is_active: boolean
  is_default: boolean
  translation_json: Record<string, string> | null
  flag: string | null
  emoji?: string
  metadata: {
    fileName?: string
    fileSize?: number
    uploadedAt?: string
  }
  created_at: string
  updated_at: string
}

export interface LanguageResponse {
  message: string
  data: {
    pages: Language[]
    total: number
    totalPages: number
    page: number
    limit: number
  }
}

export interface ActiveLanguageResponse {
  message: string
  data: {
    pages: Language[]
    total: number
    totalPages: number
    page: number
    limit: number
  }
}

export interface LanguageHeaderProps {
  onAddClick: () => void
  canManage: boolean
  search: string
  onSearchChange: (value: string) => void
}

export interface LanguageTableProps {
  data: Language[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
  onEdit: (language: Language) => void
  onDelete: (id: string) => void
  onStatusChange: (language: Language) => Promise<void>
  onDownload: (language: Language) => void
  onSetDefault: (language: Language) => void
  onBulkDelete: (rows: Language[]) => void
  canManage: boolean
  limit: number
  onLimitChange?: (value: number) => void
  search?: string
  onSearchChange?: (value: string) => void
}

export interface LanguageModalsProps {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  selectedLanguage: Language | null
  setSelectedLanguage: (lang: Language | null) => void
  onSave: (formData: FormData) => Promise<void>
  onDeleteConfirm: () => Promise<void>
  isSaving: boolean
  isDeleting: boolean
}

export interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FormData) => Promise<void>
  language: Language | null
  isLoading: boolean
}

export interface TranslationDropzoneProps {
  translationFile: File | null
  setTranslationFile: (file: File | null) => void
  error?: string
}

export interface LanguageSelectorProps {
  selectedLang: any
  onSelect: (lang: any) => void
  isSelectOpen: boolean
  setIsSelectOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  error?: string
}