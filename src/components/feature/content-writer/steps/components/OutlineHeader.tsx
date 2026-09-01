'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { OutlineHeaderProps } from '@/types'
import { Check, Plus, RefreshCw, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const OutlineHeader = ({
  outlines,
  selectedTabIndex,
  isLoading,
  onSelectOutlineByIndex,
  onRegenerate,
  onBulkAdd,
}: OutlineHeaderProps) => {
  const { t } = useTranslation()
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [bulkSections, setBulkSections] = useState<string[]>([''])

  const handleBulkAdd = () => {
    const validSections = bulkSections.filter((s) => s.trim())
    if (validSections.length === 0) {
      toast.error(t('add_at_least_one_section', 'Please add at least one section'))
      return
    }

    onBulkAdd(validSections.map((s) => s.trim()))
    setIsBulkModalOpen(false)
    setBulkSections([''])
    toast.success(t('custom_outline_set_added', 'New outline set added successfully!'))
  }

  const handleAddBulkSection = () => {
    if (bulkSections[bulkSections.length - 1]?.trim() === '') return
    setBulkSections((prev) => [...prev, ''])
  }

  const handleRemoveBulkSection = (index: number) => {
    setBulkSections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateBulkSection = (index: number, value: string) => {
    setBulkSections((prev) => prev.map((s, i) => (i === index ? value : s)))
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center bg-muted/20 p-1 rounded-xl border border-border/40">
        {outlines.length > 0 ? (
          <>
            {outlines.map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                onClick={() => onSelectOutlineByIndex(i)}
                className={cn(
                  'w-12 h-10 rounded-lg transition-all flex items-center justify-center font-black text-xs hover:bg-transparent',
                  selectedTabIndex === i
                    ? ' text-primary shadow-md hover:bg-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                0{i + 1}
              </Button>
            ))}

            {/* Bulk Add Trigger */}
            <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-10 h-10 rounded-lg transition-all flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 border border-transparent hover:border-primary/20 group/add-outline"
                >
                  <Plus className="w-4 h-4 group-hover/add-outline:scale-110 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[80vh] rounded-border-radius bg-white! dark:bg-modal-bg-color! border-border/40 backdrop-blur-2xl sm:p-6 p-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    {t('add_custom_outline_set', 'Add Custom Outline Set')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4 max-h-[50vh] overflow-y-auto pr-2">
                  <p className="text-sm text-subtitle-color font-medium ">
                    {t(
                      'bulk_add_manual_desc',
                      'Add your outline sections one by one. Click the plus button to add more sections.',
                    )}
                  </p>

                  {bulkSections.map((section, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-10 w-10 rounded-[8px] bg-primary/10 text-[10px] font-black text-primary border border-primary/20 shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <Input
                        placeholder={t('enter_section_title', 'Enter section title...')}
                        className="flex-1 h-12 rounded-[8px] inner-card glass-dark-card text-sm font-medium px-4 "
                        value={section}
                        onChange={(e) => handleUpdateBulkSection(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddBulkSection()
                          }
                        }}
                      />
                      {bulkSections.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveBulkSection(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className=" h-12 rounded-[8px] bg-primary text-white font-medium text-sm gap-2"
                    onClick={handleAddBulkSection}
                    disabled={bulkSections[bulkSections.length - 1]?.trim() === ''}
                  >
                    <Plus className="w-4 h-4" />
                    {t('add_another_section', 'Add Another Section')}
                  </Button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border/20 flex-wrap">
                  <Button
                    variant="outline"
                    className="flex-1 sm:h-12 h-10 rounded-[8px] bg-light-gray text-light-text-color dark:text-white hover:bg-primary! hover:text-white font-medium"
                    onClick={() => {
                      setIsBulkModalOpen(false)
                      setBulkSections([''])
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    className="flex-1 sm:h-12 h-10 rounded-[8px] btn-color text-white font-medium gap-3"
                    onClick={handleBulkAdd}
                  >
                    <Check className="w-5 h-5" />
                    {t('add_outline_set', 'Add Outline Set')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="w-10 h-8 rounded-lg border border-dashed border-border/40 animate-pulse" />
        )}
      </div>
      {outlines.length > 0 && (
        <Button
          variant="outline"
          className="h-12 rounded-border-radius inner-card shadow-none glass-button border-white/5 bg-white/5 text-title-color font-medium text-sm gap-2 px-6 transition-all hover:text-white! dark:text-white p-button-padding"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
          {t('regenerate')}
        </Button>
      )}
    </div>
  )
}

export default OutlineHeader
