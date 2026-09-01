import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import {
  useCreatePromptMutation,
  useDeletePromptMutation,
  useGetPromptsQuery,
  useTogglePromptFavoriteMutation,
  useUpdatePromptMutation,
} from '@/redux/api/promptApi'
import { PromptLibraryModalProps, PromptTemplate } from '@/types'
import { ApiError } from '@/types/api'
import useDebounce from '@/utils/useDebounce'
import { AlertTriangle, ArrowLeft, Copy, Edit, Plus, Search, Star, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const CATEGORIES = ['general', 'development', 'business', 'creative', 'education', 'personal', 'other']

const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({ isOpen, onClose, onSelectPrompt }) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'all' | 'favorite'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const [newPromptTitle, setNewPromptTitle] = useState('')
  const [newPromptContent, setNewPromptContent] = useState('')
  const [newPromptCategory, setNewPromptCategory] = useState('general')

  const { data, isLoading } = useGetPromptsQuery(
    {
      search: debouncedSearchQuery,
      isFavorite: activeTab === 'favorite' ? true : undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const [toggleFavorite] = useTogglePromptFavoriteMutation()
  const [deletePrompt, { isLoading: isDeleting }] = useDeletePromptMutation()
  const [createPrompt, { isLoading: isCreating }] = useCreatePromptMutation()
  const [updatePrompt, { isLoading: isUpdating }] = useUpdatePromptMutation()

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success(t('copied_to_clipboard', { defaultValue: 'Copied to clipboard' }))
  }

  const handleUsePrompt = (content: string) => {
    onSelectPrompt(content)
    onClose()
    toast.success(t('prompt_applied', { defaultValue: 'Prompt applied' }))
  }

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await toggleFavorite(id).unwrap()
      if (res.message) {
        toast.success(res.message)
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update', { defaultValue: 'Failed to update' }))
    }
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteId(id)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const res = await deletePrompt(deleteId).unwrap()
      toast.success(res.message || t('prompt_deleted', { defaultValue: 'Prompt deleted' }))
      setIsDeleteConfirmOpen(false)
      setDeleteId(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete', { defaultValue: 'Failed to delete' }))
    }
  }

  const handleAddPrompt = async () => {
    if (!newPromptTitle.trim() || !newPromptContent.trim()) {
      toast.error(t('please_fill_all_fields', { defaultValue: 'Please fill all fields' }))
      return
    }

    try {
      if (isEditing && editingId) {
        const res = await updatePrompt({
          id: editingId,
          title: newPromptTitle,
          content: newPromptContent,
          description: newPromptContent.slice(0, 50) + (newPromptContent.length > 50 ? '...' : ''),
          category: newPromptCategory,
        }).unwrap()

        toast.success(res.message || t('prompt_updated', { defaultValue: 'Prompt updated successfully' }))
      } else {
        const res = await createPrompt({
          title: newPromptTitle,
          content: newPromptContent,
          description: newPromptContent.slice(0, 50) + (newPromptContent.length > 50 ? '...' : ''),
          category: newPromptCategory,
        }).unwrap()

        toast.success(res.message || t('prompt_created', { defaultValue: 'Prompt created successfully' }))
      }

      handleCancelAdd()
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          (isEditing
            ? t('failed_to_update_prompt', { defaultValue: 'Failed to update prompt' })
            : t('failed_to_create_prompt', { defaultValue: 'Failed to create prompt' })),
      )
    }
  }

  const handleCancelAdd = () => {
    setNewPromptTitle('')
    setNewPromptContent('')
    setNewPromptCategory('general')
    setIsAdding(false)
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEditClick = (prompt: PromptTemplate, e: React.MouseEvent) => {
    e.stopPropagation()
    setNewPromptTitle(prompt.title)
    setNewPromptContent(prompt.content)
    setNewPromptCategory(prompt.category || 'general')
    setEditingId(prompt.id)
    setIsEditing(true)
    setIsAdding(true)
  }

  const prompts = data?.data?.prompts || []

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open: any) => {
          if (!open) {
            handleCancelAdd()
            onClose()
          }
        }}
      >
        <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none  bg-background rounded-border-radius! bg-light-body max-h-[85vh]">
          <DialogHeader className="p-6 pr-12 pb-4 flex flex-row items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              {isAdding && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelAdd}
                  className="h-8 w-8 rounded-full -ml-2 mr-1 dark:text-white"
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
              )}
              <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
                {isAdding
                  ? isEditing
                    ? t('edit_prompt', { defaultValue: 'Edit Prompt' })
                    : t('add_new_prompt', { defaultValue: 'Add New Prompt' })
                  : t('prompt_library', { defaultValue: 'Prompt Library' })}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="sm:p-6 p-4 pt-0! space-y-4 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar">
            {isAdding ? (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div className="space-y-4">
                  <div className="space-y-1 flex flex-col">
                    <Label className="text-sm font-medium ml-1 dark:text-white">
                      {t('title', { defaultValue: 'Title' })}
                    </Label>
                    <Input
                      placeholder={t('add_title', { defaultValue: 'Add Title' })}
                      value={newPromptTitle}
                      onChange={(e) => setNewPromptTitle(e.target.value)}
                      className="text-lg font-medium border-border/50 placeholder:text-sm h-12 glass-dark-card rounded-[8px]"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <Label className="text-sm font-medium ml-1 dark:text-white">
                      {t('category', { defaultValue: 'Category' })}
                    </Label>
                    <Select value={newPromptCategory} onValueChange={setNewPromptCategory}>
                      <SelectTrigger className="h-12 rounded-[8px] border-border/50 glass-dark-card">
                        <SelectValue placeholder={t('select_category', { defaultValue: 'Select Category' })} />
                      </SelectTrigger>
                      <SelectContent className="bg-white! dark:bg-modal-bg-color!">
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <Label className="text-sm font-medium ml-1 dark:text-white">
                      {t('prompt', { defaultValue: 'Prompt' })}
                    </Label>
                    <Textarea
                      placeholder={t('add_custom_prompt', { defaultValue: 'Add custom prompt' })}
                      value={newPromptContent}
                      onChange={(e) => setNewPromptContent(e.target.value)}
                      className="min-h-50 resize-none border-border/50 glass-dark-card rounded-[8px] p-4 text-base"
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2 pb-0! gap-[12px]">
                  <Button
                    variant="outline"
                    onClick={handleCancelAdd}
                    className="rounded-[8px] p-button-padding! h-10 sm:h-12 bg-light-gray glass-card text-light-text-color dark:text-white px-6 w-full"
                    disabled={isCreating || isUpdating}
                  >
                    {t('cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleAddPrompt}
                    className="rounded-[8px] h-10 sm:h-12 bg-primary! text-white p-button-padding! px-6 w-full"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isEditing ? (
                      t('update', { defaultValue: 'Update' })
                    ) : (
                      t('add', { defaultValue: 'Add' })
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between  overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-4 border-b border-border/30">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('all')}
                      className={cn(
                        'pb-3 px-1 h-auto text-sm font-semibold transition-all relative whitespace-nowrap rounded-none hover:bg-transparent',
                        activeTab === 'all' ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t('all', { defaultValue: 'All' })}
                      {activeTab === 'all' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('favorite')}
                      className={cn(
                        'pb-3 px-1 h-auto text-sm font-semibold transition-all relative whitespace-nowrap rounded-none hover:bg-transparent',
                        activeTab === 'favorite' ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t('favorite', { defaultValue: 'Favorite' })}
                      {activeTab === 'favorite' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isAdding && (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-10 p-button-padding! bg-primary! text-white rtl:mr-0 rtl:ml-3.75 rounded-[8px] gap-2"
                        onClick={() => setIsAdding(true)}
                      >
                        <Plus className="w-4 h-4" />
                        {t('add', { defaultValue: 'Add' })}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search_prompts', { defaultValue: 'Search prompts...' })}
                      className="pl-10 h-10 rounded-[8px]  glass-card glass-dark-card border-border/50"
                    />
                  </div>
                  <div className="w-full sm:w-[180px]">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-10 rounded-[8px] glass-card glass-dark-card border-border/50">
                        <SelectValue placeholder={t('category', { defaultValue: 'Category' })} />
                      </SelectTrigger>
                      <SelectContent className="bg-white! dark:bg-modal-bg-color! dark:text-white">
                        <SelectItem value="all">{t('all_categories', { defaultValue: 'All Categories' })}</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : prompts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">{t('no_prompts_found', { defaultValue: 'No prompts found' })}</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prompts.map((prompt: PromptTemplate) => (
                        <div
                          key={prompt.id}
                          className="group relative p-5 border rounded-border-radius glass-dark-card bg-accent/10 border-primary/30 transition-all cursor-pointer"
                          onClick={() => handleUsePrompt(prompt.content)}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[12px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {prompt.category || 'General'}
                                </span>
                              </div>
                              <h3 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{prompt.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">{prompt.content}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-accent/50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyPrompt(prompt.content)
                                }}
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-accent/50"
                                onClick={(e) => handleToggleFavorite(prompt.id, e)}
                              >
                                <Star
                                  className={cn(
                                    'w-3.5 h-3.5 transition-all',
                                    prompt.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground',
                                  )}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 dark:bg-destructive dark:text-white rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => handleDeleteClick(prompt.id, e)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs rounded-lg bg-light-primary flex-1 text-title-color dark:text-white"
                              onClick={(e) => handleEditClick(prompt, e)}
                            >
                              <Edit className="w-3 h-3 mr-1.5" />
                              {t('edit', { defaultValue: 'Edit' })}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8 text-xs bg-primary! text-white rounded-lg flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUsePrompt(prompt.content)
                              }}
                            >
                              {t('use', { defaultValue: 'Use' })}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! rounded-2xl border-none shadow-2xl bg-background">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl">
              {t('delete_prompt', { defaultValue: 'Delete Prompt?' })}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">{t('delete_prompt_confirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="rounded-[8px] w-full  sm:h-12 h-10 "
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounded-[8px] w-full sm:h-12 h-10 "
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('delete', { defaultValue: 'Delete' })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PromptLibraryModal
