'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  Layers,
  Sparkles,
  Search,
  Coins,
  Loader2,
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useGetTemplatesQuery,
  useUseTemplateMutation,
  useGetBusinessProfileQuery,
} from '@/redux/api/aiSocialApi'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'All',
  'Ethical Mental Health Marketing',
  'Healthcare & Clinic',
  'Dental Clinic',
  'Restaurant & Cafe',
  'Real Estate',
  'Salon & Spa',
  'Fitness & Gym',
  'Education & Coaching',
  'IT & Digital Agency',
  'Retail & E-commerce',
  'Automobile & Detailing',
  'Finance & CA Advisory',
  'Travel & Hospitality',
  'Home Services & Interior',
  'Photography & Weddings',
  'Pet Care & Veterinary',
]

const FORMATS = ['All', 'Image', 'Carousel', 'Reel', 'Video', 'Story']

const FORMAT_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'premium' | 'glass'> = {
  Image: 'secondary',
  Carousel: 'premium',
  Reel: 'default',
  Video: 'destructive',
  Story: 'outline',
}

const ITEMS_PER_PAGE = 24

export default function TemplateMarketplacePage() {
  const router = useRouter()
  const [category, setCategory] = useState('All')
  const [type, setType] = useState('All')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [usingId, setUsingId] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null)

  const { data: profileData } = useGetBusinessProfileQuery(undefined)
  const business = (profileData as any)?.data

  const { data, isLoading } = useGetTemplatesQuery({
    ...(category !== 'All' && { category }),
    ...(type !== 'All' && { type }),
    ...(search && { search }),
  })

  const [useTemplate] = useUseTemplateMutation()
  const allTemplates: any[] = (data as any)?.data || []

  // Pagination calculation
  const totalPages = Math.ceil(allTemplates.length / ITEMS_PER_PAGE) || 1
  const displayedTemplates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return allTemplates.slice(start, start + ITEMS_PER_PAGE)
  }, [allTemplates, currentPage])

  const handleUseTemplate = async (template: any) => {
    if (!business) {
      toast.error('Complete business setup before generating templates', {
        action: { label: 'Setup', onClick: () => router.push('/ai-social/setup') },
      })
      return
    }

    setUsingId(template._id)
    try {
      await useTemplate({ id: template._id, businessId: business._id }).unwrap()
      toast.success(`Template applied! ${template.creditCost} credits deducted. Content sent to Approval Center.`, {
        action: {
          label: 'View Queue',
          onClick: () => router.push('/ai-social/approval'),
        },
      })
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to apply template')
    } finally {
      setUsingId(null)
    }
  }

  const handleCategoryChange = (c: string) => {
    setCategory(c)
    setCurrentPage(1)
  }

  const handleTypeChange = (t: string) => {
    setType(t)
    setCurrentPage(1)
  }

  const handleSearchChange = (s: string) => {
    setSearch(s)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Social Template Marketplace"
        showBackButton={true}
        endContent={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1.5 text-xs font-semibold">
              <span className="text-primary font-bold mr-1">{allTemplates.length.toLocaleString()}</span> Templates Available
            </Badge>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="border border-border">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by keyword, topic, or niche..."
                className="pl-9"
              />
            </div>
            <div className="sm:col-span-3">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="h-12 w-full rounded-[8px] border border-input-border-color bg-background px-3 text-sm focus:outline-none text-foreground inner-card"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="h-12 w-full rounded-[8px] border border-input-border-color bg-background px-3 text-sm focus:outline-none text-foreground inner-card"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{f === 'All' ? 'All Formats' : f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((c) => {
              const isSelected = category === c
              return (
                <Button
                  key={c}
                  variant={isSelected ? 'premium' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(c)}
                  className="rounded-full text-xs shrink-0 h-8"
                >
                  {c}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && allTemplates.length === 0 && (
        <Card className="border border-border text-center py-16 p-6">
          <CardContent className="space-y-4">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold">No templates found for this criteria</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your category or keyword filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCategory('All')
                setType('All')
                setSearch('')
                setCurrentPage(1)
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedTemplates.map((template: any) => {
          const isProcessing = usingId === template._id
          const isEthical = template.category === 'Ethical Mental Health Marketing'

          return (
            <Card
              key={template._id}
              className={`border border-border overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                isEthical ? 'hover:border-emerald-500/50 dark:hover:border-emerald-500/50 bg-gradient-to-b from-card to-background' : 'hover:border-primary/50'
              }`}
            >
              {/* Preview Thumbnail */}
              <div 
                className="h-44 bg-muted/50 border-b border-border/40 relative flex items-center justify-center overflow-hidden cursor-pointer group"
                onClick={() => setPreviewTemplate(template)}
              >
                {template.previewImageUrl ? (
                  <img 
                    src={template.previewImageUrl} 
                    alt={template.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <div className="text-center p-4">
                    <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-muted-foreground">{template.category}</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="bg-background/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5" /> Preview Details
                  </span>
                </div>

                <Badge
                  variant={FORMAT_BADGE_VARIANTS[template.type] || 'secondary'}
                  className="absolute top-3 right-3 text-[11px] font-bold shadow"
                >
                  {template.type}
                </Badge>

                {isEthical && (
                  <Badge
                    variant="outline"
                    className="absolute top-3 left-3 text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border-emerald-500/40 backdrop-blur-sm flex items-center gap-1 shadow"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Clinical Ethics
                  </Badge>
                )}
              </div>

              {/* Template Info */}
              <CardContent className="p-4 space-y-3 flex-1">
                <div>
                  <h3 
                    className="font-bold text-sm text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    {template.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-medium">
                      {template.category}
                    </span>
                    {template.contentType && (
                      <span className="text-[10px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded font-medium">
                        {template.contentType}
                      </span>
                    )}
                    {template.platform && template.platform !== 'All' && (
                      <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {template.platform}
                      </span>
                    )}
                    {template.usageCount > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        {template.usageCount} uses
                      </span>
                    )}
                  </div>
                </div>

                {template.basePrompt && (
                  <p 
                    className="text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-muted/20 p-2 rounded border border-border/40 font-mono cursor-pointer"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    {template.basePrompt}
                  </p>
                )}
              </CardContent>

              {/* Footer */}
              <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/40 mt-auto">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Coins className="w-4 h-4" />
                  <span>{template.creditCost}</span>
                  <span className="text-xs font-normal text-muted-foreground">credits</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate(template)}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                    title="Inspect template details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="premium"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleUseTemplate(template)}
                    className="gap-1.5 text-xs h-8"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Use Template
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Pagination Controls */}
      {!isLoading && allTemplates.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allTemplates.length)} of {allTemplates.length} templates
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>

            <span className="text-xs font-bold px-2">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="gap-1 text-xs"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Template Preview & Details Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {previewTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant={FORMAT_BADGE_VARIANTS[previewTemplate.type] || 'secondary'}>
                    {previewTemplate.type}
                  </Badge>
                  <Badge variant="outline">{previewTemplate.category}</Badge>
                  {previewTemplate.platform && previewTemplate.platform !== 'All' && (
                    <Badge variant="outline">{previewTemplate.platform}</Badge>
                  )}
                  {previewTemplate.category === 'Ethical Mental Health Marketing' && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 flex items-center">
                      <ShieldCheck className="w-3 h-3" /> Clinical Standard
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-lg font-bold">{previewTemplate.name}</DialogTitle>
                <DialogDescription>
                  Detailed generation configuration and prompt variables for this template.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                {previewTemplate.previewImageUrl && (
                  <div className="h-56 rounded-lg overflow-hidden border border-border">
                    <img
                      src={previewTemplate.previewImageUrl}
                      alt={previewTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {previewTemplate.category === 'Ethical Mental Health Marketing' && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    <div>
                      <span className="font-semibold block mb-0.5">Ethical Clinical Philosophy (Christopher Siegfried Standards):</span>
                      This template is engineered to communicate with evidence-based nuance, avoiding clickbait, empty promises, or fear-based triggers. Fully aligned with HIPAA guidelines and patient autonomy.
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    AI Generation Prompt Template
                  </h4>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {previewTemplate.basePrompt}
                  </div>
                </div>

                {previewTemplate.variables && previewTemplate.variables.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Dynamic Variables (Substituted from Business Brain)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {previewTemplate.variables.map((v: string) => (
                        <code key={v} className="text-[11px] px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                          {`{{${v}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Format</span>
                    <span className="font-semibold">{previewTemplate.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Target Platform</span>
                    <span className="font-semibold">{previewTemplate.platform || 'All'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Cost</span>
                    <span className="font-semibold text-amber-500 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> {previewTemplate.creditCost} credits
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Usage Count</span>
                    <span className="font-semibold">{previewTemplate.usageCount || 0} times</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between pt-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
                <Button
                  variant="premium"
                  size="sm"
                  disabled={usingId === previewTemplate._id}
                  onClick={() => {
                    handleUseTemplate(previewTemplate)
                    setPreviewTemplate(null)
                  }}
                  className="gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply This Template
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
