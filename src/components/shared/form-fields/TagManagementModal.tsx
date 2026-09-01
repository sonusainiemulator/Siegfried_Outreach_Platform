'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import { useCreateTagMutation, useDeleteTagsMutation, useGetTagsQuery, useUpdateTagMutation } from '@/redux/api/tagApi'
import { ApiError } from '@/types'
import { TagManagementModalProps } from '@/types/components/campaigns'
import { Check, ChevronLeft, Edit2, Loader2, Plus, Tag as TagIcon, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'


const TagManagementModal = ({ isOpen, onClose, onSave }: TagManagementModalProps) => {
  const { t } = useTranslation()
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [search, setSearch] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const { data: tagsData, isLoading: isLoadingTags } = useGetTagsQuery({ search, limit: 100 })
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation()
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation()
  const [deleteTags, { isLoading: isDeleting }] = useDeleteTagsMutation()

  // Reset dirty state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false)
    }
  }, [isOpen])

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return
    try {
      const res = await createTag({ name: newTagName.trim() }).unwrap()
      toast.success(res.message || t('tag_created_successfully'))
      setNewTagName('')
      setIsDirty(true)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return
    try {
      const res = await updateTag({ id: editingTag.id, name: editingTag.name.trim() }).unwrap()
      toast.success(res.message || t('tag_updated_successfully'))
      setEditingTag(null)
      setIsDirty(true)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleDeleteTag = async (id: string) => {
    try {
      const res = await deleteTags([id]).unwrap()
      toast.success(res.message || t('tag_deleted_successfully'))
      setIsDirty(true)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! rounded-border-radius no-scrollbar p-0 overflow-hidden dark:bg-modal-bg-color">
        <DialogHeader className=" pb-2 relative flex flex-row items-center justify-center border-b border-glass-border">
          <Button
            onClick={onClose}
            className="absolute left-4 p-2! h-8 rounded-full hover:bg-muted transition-all active:scale-95"
            title={t('back')}
          >
            <ChevronLeft size={20} />
          </Button>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TagIcon size={18} />
            </div>
            {t('manage_tags')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group/input">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                <TagIcon size={16} />
              </div>
              <Input
                placeholder={t('create_tag')}
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-12 pl-10 text-sm rounded-[8px] glass-dark-card border-glass-border focus:border-primary/50 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
            </div>
            <Button 
                onClick={handleCreateTag} 
                className="h-12 px-6 bg-primary! text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95" 
                disabled={isCreating || !newTagName.trim()}
            >
              {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
              {t('create')}
            </Button>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-2">
            {isLoadingTags ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 size={40} className="animate-spin text-primary opacity-50" />
                <span className="text-sm font-medium">{t('loading')}</span>
              </div>
            ) : tagsData?.tags && tagsData.tags.length > 0 ? (
              <div className="grid gap-2 custom-scrollbar overflow-auto h-[250px]">
                {tagsData.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="group flex items-center justify-between p-4 rounded-[10px] glass-dark-card border border-glass-border hover:border-primary/30 transition-all"
                  >
                    {editingTag?.id === tag.id ? (
                      <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-left-2 duration-200">
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="h-10 text-sm rounded-lg"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateTag()}
                        />
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-10 w-10 text-green-500 hover:bg-green-500/10 hover:text-green-500 rounded-lg" onClick={handleUpdateTag} disabled={isUpdating}>
                            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg" onClick={() => setEditingTag(null)}>
                            <X size={18} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                            <TagIcon size={18} className="text-primary/60 group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{tag.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                            onClick={() => setEditingTag({ id: tag.id, name: tag.name })}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all" 
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-glass-border rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <TagIcon size={32} className="opacity-20" />
                </div>
                <span className="text-sm font-medium">{t('no_tags_found')}</span>
                <p className="text-xs opacity-50 mt-1">{t('start_by_creating_one_above')}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TagManagementModal
