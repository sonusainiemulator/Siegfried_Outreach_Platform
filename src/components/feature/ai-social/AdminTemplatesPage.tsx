'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  Loader2,
  Layers,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import {
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
} from '@/redux/api/aiSocialApi'

const TYPES = ['Image', 'Carousel', 'Reel', 'Video', 'Story']
const PLATFORMS = ['All', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'GoogleBusinessProfile']

export default function AdminTemplatesPage() {
  const { data, isLoading } = useGetTemplatesQuery({})
  const [createTemplate, { isLoading: creating }] = useCreateTemplateMutation()
  const [deleteTemplate] = useDeleteTemplateMutation()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: '',
    contentType: 'Promotional',
    platform: 'All',
    type: 'Image',
    creditCost: 5,
    basePrompt: '',
    previewImageUrl: '',
  })

  const templates: any[] = (data as any)?.data || []

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category) {
      toast.error('Name and category are required')
      return
    }

    try {
      await createTemplate(form).unwrap()
      toast.success('Template registered in global marketplace!')
      setForm({
        name: '',
        category: '',
        contentType: 'Promotional',
        platform: 'All',
        type: 'Image',
        creditCost: 5,
        basePrompt: '',
        previewImageUrl: '',
      })
      setShowForm(false)
    } catch {
      toast.error('Failed to create template')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id).unwrap()
      toast.success('Template deactivated')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Admin: Social Templates"
        showBackButton={true}
        primaryAction={{
          label: showForm ? 'Close Form' : 'New Template',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => setShowForm(!showForm),
        }}
      />

      {showForm && (
        <Card className="border-primary/40 shadow-lg">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold">Create New Template</CardTitle>
            <CardDescription>
              Available variables: <span className="font-mono text-primary font-semibold">{'{{business_name}}, {{phone}}, {{offer}}, {{location}}, {{service}}, {{usp}}'}</span>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleCreate}>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Dental Painless RCT Offer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Business Category *</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Dental Clinic, Restaurant"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Platform Target</Label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                    className="h-12 w-full rounded-[8px] border border-input-border-color bg-background px-3 text-sm focus:outline-none text-foreground inner-card"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Content Format</Label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className="h-12 w-full rounded-[8px] border border-input-border-color bg-background px-3 text-sm focus:outline-none text-foreground inner-card"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Credit Cost</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.creditCost}
                    onChange={(e) => setForm((p) => ({ ...p, creditCost: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preview Image URL</Label>
                <Input
                  value={form.previewImageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, previewImageUrl: e.target.value }))}
                  placeholder="https://example.com/preview.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Base Prompt</Label>
                <Textarea
                  rows={3}
                  value={form.basePrompt}
                  onChange={(e) => setForm((p) => ({ ...p, basePrompt: e.target.value }))}
                  placeholder="Create a social post for {{business_name}} in {{location}}. Feature offer {{offer}} on {{service}}. Contact: {{phone}}."
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="premium" size="sm" disabled={creating} className="gap-1.5">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save Template
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Templates List */}
      <div className="grid gap-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <Card className="border border-border p-8 text-center">
            <p className="text-xs text-muted-foreground">No templates configured yet. Click "New Template" to add one.</p>
          </Card>
        ) : (
          templates.map((t: any) => (
            <Card key={t._id} className="border border-border p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                  {t.previewImageUrl ? (
                    <img src={t.previewImageUrl} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">📋</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{t.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{t.type}</Badge>
                    <span className="text-[11px] text-muted-foreground">{t.platform}</span>
                    <span className="text-[11px] font-bold text-amber-500">{t.creditCost} credits</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => handleDelete(t._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
