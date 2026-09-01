export interface UseInternetConnectionReturn {
  isOnline: boolean
  isChecking: boolean
  retry: () => void
}

export interface PromptTemplate {
  id: string
  title: string
  description: string
  category: string
  content: string
  isFavorite: boolean
  isPublic: boolean
  created_at: string
  updated_at: string
}

export interface PromptTemplateResponse {
  data: {
    prompts: PromptTemplate[]
  }
  total: number
}

export interface CreatePromptRequest {
  title: string
  description: string
  category: string
  content: string
}

export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {
  id: string
}

export interface LayoutState {
  isSidebarCollapsed: boolean
  direction: 'ltr' | 'rtl'
}