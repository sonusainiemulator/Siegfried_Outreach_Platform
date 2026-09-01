'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { CalendarNote, ChecklistItem, NoteCategory } from '@/types/components/socialMedia'
import { format } from 'date-fns'
import {
  Sparkles,
  Calendar as CalendarIcon,
  Tag,
  CheckSquare,
  Plus,
  Trash2,
  Pin,
  Lightbulb,
  Bell,
  Megaphone,
  CheckCircle2,
  FileText,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateCalendarNoteMutation,
  useUpdateCalendarNoteMutation,
  useDeleteCalendarNoteMutation,
} from '@/redux/api/socialMediaApi'

interface CalendarNoteModalProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date | null
  noteToEdit?: CalendarNote | null
}

const CATEGORIES: Array<{
  id: NoteCategory
  label: string
  icon: React.ComponentType<{ className?: string }>
  defaultColor: string
}> = [
  { id: 'idea', label: 'Content Idea', icon: Lightbulb, defaultColor: '#3b82f6' },
  { id: 'reminder', label: 'Reminder', icon: Bell, defaultColor: '#f59e0b' },
  { id: 'campaign', label: 'Campaign', icon: Megaphone, defaultColor: '#ec4899' },
  { id: 'task', label: 'Task', icon: CheckCircle2, defaultColor: '#10b981' },
  { id: 'general', label: 'Note', icon: FileText, defaultColor: '#8b5cf6' },
]

const COLOR_PRESETS = [
  { label: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { label: 'Emerald', value: '#10b981', bg: 'bg-emerald-500' },
  { label: 'Amber', value: '#f59e0b', bg: 'bg-amber-500' },
  { label: 'Rose', value: '#ec4899', bg: 'bg-rose-500' },
  { label: 'Purple', value: '#8b5cf6', bg: 'bg-purple-500' },
  { label: 'Cyan', value: '#06b6d4', bg: 'bg-cyan-500' },
  { label: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500' },
]

export default function CalendarNoteModal({
  isOpen,
  onClose,
  initialDate,
  noteToEdit,
}: CalendarNoteModalProps) {
  const [targetDateStr, setTargetDateStr] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<NoteCategory>('idea')
  const [color, setColor] = useState('#3b82f6')
  const [isPinned, setIsPinned] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [newChecklistText, setNewChecklistText] = useState('')

  const [createNote, { isLoading: isCreating }] = useCreateCalendarNoteMutation()
  const [updateNote, { isLoading: isUpdating }] = useUpdateCalendarNoteMutation()
  const [deleteNote, { isLoading: isDeleting }] = useDeleteCalendarNoteMutation()

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '')
      setContent(noteToEdit.content || '')
      setCategory(noteToEdit.category || 'idea')
      setColor(noteToEdit.color || '#3b82f6')
      setIsPinned(Boolean(noteToEdit.isPinned))
      setChecklist(noteToEdit.checklist || [])
      if (noteToEdit.targetDate) {
        setTargetDateStr(format(new Date(noteToEdit.targetDate), 'yyyy-MM-dd'))
      }
    } else if (initialDate) {
      setTitle('')
      setContent('')
      setCategory('idea')
      setColor('#3b82f6')
      setIsPinned(false)
      setChecklist([])
      setNewChecklistText('')
      setTargetDateStr(format(initialDate, 'yyyy-MM-dd'))
    } else {
      setTitle('')
      setContent('')
      setCategory('idea')
      setColor('#3b82f6')
      setIsPinned(false)
      setChecklist([])
      setNewChecklistText('')
      setTargetDateStr(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [noteToEdit, initialDate, isOpen])

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return
    const newItem: ChecklistItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text: newChecklistText.trim(),
      completed: false,
    }
    setChecklist((prev) => [...prev, newItem])
    setNewChecklistText('')
  }

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const handleDeleteChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a note title')
      return
    }

    if (!targetDateStr) {
      toast.error('Please select a date')
      return
    }

    try {
      if (noteToEdit) {
        await updateNote({
          id: noteToEdit.id,
          data: {
            title: title.trim(),
            content: content.trim(),
            targetDate: new Date(targetDateStr).toISOString(),
            category,
            color,
            isPinned,
            checklist,
          },
        }).unwrap()
        toast.success('Calendar note updated successfully!')
      } else {
        await createNote({
          title: title.trim(),
          content: content.trim(),
          targetDate: new Date(targetDateStr).toISOString(),
          category,
          color,
          isPinned,
          checklist,
        }).unwrap()
        toast.success('Calendar note created successfully!')
      }
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save note')
    }
  }

  const handleDelete = async () => {
    if (!noteToEdit) return
    try {
      await deleteNote(noteToEdit.id).unwrap()
      toast.success('Calendar note deleted!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete note')
    }
  }

  const isBusy = isCreating || isUpdating || isDeleting

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar glass-dark-card border-border/40">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: color }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {noteToEdit ? 'Edit Calendar Note' : 'Create Calendar Note'}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Plan ideas, tasks, campaign milestones, and reminders
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg border transition-all ${
                isPinned
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                  : 'bg-muted/10 border-border/20 text-muted-foreground hover:text-foreground'
              }`}
              title={isPinned ? 'Unpin Note' : 'Pin to top of day'}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-primary" /> Target Date
            </label>
            <Input
              type="date"
              value={targetDateStr}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetDateStr(e.target.value)}
              className="bg-background/50 border-input-border-color h-10 rounded-lg text-sm"
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> Note Title *
            </label>
            <Input
              placeholder="e.g., Launch Spring Promo Reel, Brainstorm TikTok Hooks..."
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="bg-background/50 border-input-border-color h-10 rounded-lg text-sm font-medium"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isSelected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id)
                      if (!noteToEdit) setColor(cat.defaultColor)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30 font-semibold'
                        : 'bg-muted/20 hover:bg-muted/30 border-border/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Tag Color</label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  className={`w-7 h-7 rounded-full ${preset.bg} transition-all cursor-pointer flex items-center justify-center ${
                    color.toLowerCase() === preset.value.toLowerCase()
                      ? 'ring-2 ring-offset-2 ring-primary ring-offset-background scale-110'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  title={preset.label}
                />
              ))}
            </div>
          </div>

          {/* Content / Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Description & Details (Optional)
            </label>
            <Textarea
              placeholder="Add talking points, caption outlines, or specific directions..."
              rows={3}
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              className="bg-background/50 border-input-border-color rounded-lg text-sm resize-none"
            />
          </div>

          {/* Checklist / Action Items */}
          <div className="space-y-2 pt-2 border-t border-border/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-primary" /> Checklist / Action Items
              </label>
              {checklist.length > 0 && (
                <span className="text-[10px] font-bold text-muted-foreground">
                  {checklist.filter((i) => i.completed).length}/{checklist.length} Completed
                </span>
              )}
            </div>

            {/* Existing Checklist Items */}
            {checklist.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border/20 group"
                  >
                    <label className="flex items-center gap-2 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(item.id)}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span
                        className={`text-xs ${
                          item.completed ? 'line-through text-muted-foreground opacity-60' : 'text-foreground'
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Checklist Item Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add actionable task (e.g. Design thumbnail, Record audio)..."
                value={newChecklistText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChecklistText(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddChecklistItem()
                  }
                }}
                className="bg-background/50 border-input-border-color h-9 rounded-lg text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddChecklistItem}
                className="h-9 px-3 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 pt-2 border-t border-border/20">
          {noteToEdit ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isBusy}
              className="gap-1.5"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete Note
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isBusy}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isBusy}
              className="gap-1.5 bg-primary hover:bg-primary/90 text-white"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {noteToEdit ? 'Save Changes' : 'Create Note'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
