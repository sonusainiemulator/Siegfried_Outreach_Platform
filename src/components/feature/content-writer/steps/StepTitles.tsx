'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useGenerateTitlesMutation } from '@/redux/api/aiContentApi'
import { ApiError, StepTitlesProps } from '@/types'
import { ArrowLeft, BookmarkCheck, Check, ChevronRight, Loader2, Plus, RefreshCw, Sparkles, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const StepTitles = ({ data, onNext, onBack, onDataChange, onSaveDraft }: StepTitlesProps) => {
  const { t } = useTranslation()
  // Initialise from previously persisted generated titles so they survive navigation
  const [titles, setTitles] = useState<string[]>(data.generatedTitles?.length ? data.generatedTitles : [])
  const [selectedTitle, setSelectedTitle] = useState(data.selectedTitle || '')
  const [customTitle, setCustomTitle] = useState('')
  const [showAddInput, setShowAddInput] = useState(false)

  const [generateTitles, { isLoading }] = useGenerateTitlesMutation()

  const handleGenerateTitles = useCallback(async () => {
    try {
      const res = await generateTitles({
        topic: data.topic,
        keywords: data.keywords,
        numTitles: 5,
        language: data.language,
        blogLength: data.blogLength,
        creativity: data.creativity,
      }).unwrap()
      const newTitles = res.titles || []
      setTitles(newTitles)
      onDataChange({ generatedTitles: newTitles })
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }, [data, generateTitles, onDataChange, t])

  useEffect(() => {
    if (titles.length === 0) {
      setTimeout(() => {
        handleGenerateTitles()
      }, 100)
    }
  }, [titles.length, handleGenerateTitles])

  const handleSelect = (title: string) => {
    setSelectedTitle(title)
  }

  const handleAddCustom = () => {
    if (customTitle.trim()) {
      const trimmed = customTitle.trim()
      setSelectedTitle(trimmed)
      const updated = titles.includes(trimmed) ? titles : [trimmed, ...titles]
      setTitles(updated)
      onDataChange({ generatedTitles: updated })
      setCustomTitle('')
      setShowAddInput(false)
    }
  }

  return (
    <Card className="rounded-border-radius border border-border/40 bg-card/40 glass-card glass-dark-card backdrop-blur-xl overflow-hidden p-4 sm:p-6 space-y-6 sm:space-y-10  flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-0.5">
            <span className="text-xl font-medium text-primary">{t('headline_selection')}</span>
          </div>
          <p className="text-subtitle-color font-medium text-base">{t('headline_description_sub')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {titles.length > 0 && (
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-12 rounded-[8px] inner-card glass-dark-card text-foreground font-medium p-button-padding text-sm gap-2 px-4 sm:px-6 transition-all hover:bg-light-primary! hover:text-black dark:hover:text-white active:scale-95"
              onClick={handleGenerateTitles}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {t('regenerate_suggestions')}
            </Button>
          )}

          {showAddInput ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
              <Input
                placeholder={t('type_custom_title', 'Type custom title...')}
                className="w-40 sm:w-56 h-10 rounded-[8px] border-border/40 text-xs sm:text-sm font-medium pl-4 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                value={customTitle}
                autoFocus
                onChange={(e) => setCustomTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <Button
                size="icon"
                className="h-10 w-10 rounded-lg bg-primary shadow-md hover:shadow-primary/20 transition-all active:scale-95 shrink-0"
                onClick={handleAddCustom}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-lg border-border/40 bg-destructive! hover:text-white bg-unset transition-all shrink-0"
                onClick={() => setShowAddInput(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-10 w-10 rounded-lg border-border/40 bg-primary/5 p-0  text-primary transition-all hover:bg-primary hover:text-white! active:scale-95 group/add shadow-sm"
              onClick={() => setShowAddInput(true)}
              title={t('add_custom')}
            >
              <Plus className="w-5 h-5 group-hover:text-white! hover:text-white! transition-all transform group-hover:scale-110" />
            </Button>
          )}
        </div>
      </div>

      {/* Titles List */}
      <div className="flex-1 space-y-3.5 overflow-y-auto custom-scrollbar pr-1 max-h-[500px]">
        {isLoading && titles.length === 0 ? (
          <Spinner className="h-full" text={t('generating_titles')} />
        ) : (
          <div className="grid grid-cols-1 gap-3.5 custom-scrollbar ">
            {titles.map((title, i) => (
              <div
                key={i}
                onClick={() => handleSelect(title)}
                className={cn(
                  'group relative flex items-center justify-between p-4 rounded-border-radius border transition-all duration-300 cursor-pointer',
                  selectedTitle === title
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                    : 'border-border/40 inner-card glass-dark-card hover:border-primary/20',
                )}
              >
                <div className="space-y-2 sm:space-y-3 relative z-10 flex-1 pr-4 sm:pr-8">
                  <div className="flex items-center gap-2 mb-0">
                    <div className="rounded text-title-color text-xs sm:text-base font-medium dark:text-white">
                      {t('option')} 0{i + 1}
                    </div>
                    <div className="h-px w-4 sm:w-6 bg-border/40" />
                  </div>
                  <h3
                    className={cn(
                      'text-sm font-medium tracking-tight leading-snug transition-colors',
                      selectedTitle === title ? 'text-primary' : 'text-subtitle-color group-hover:text-foreground/90',
                    )}
                  >
                    {title}
                  </h3>
                </div>

                <div
                  className={cn(
                    'w-10 h-10 rounded-border-radius border flex items-center justify-center shrink-0 transition-all duration-500',
                    selectedTitle === title
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                      : 'border-border/40 inner-card glass-dark-card',
                  )}
                >
                  {selectedTitle === title ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <Sparkles className="w-4 h-4 text-primary transition-opacity" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between  border-t border-border/20 sm:whitespace-nowrap text-wrap">
        <Button
          variant="ghost"
          size="sm"
          className="sm:h-12 h-10 rounded-[8px] border border-border/60 p-button-padding! inner-card glass-button text-black dark:text-white font-medium text-sm gap-2 px-6 transition-all active:scale-95"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('back')}
        </Button>

        <div className="flex items-center gap-3 text-wrap">
          {onSaveDraft && (
            <Button
              variant="outline"
              size="lg"
              className="sm:h-12 h-10 rounded-[8px] border-border/40 font-medium text-sm gap-2 px-6 glass-dark-card transition-all active:scale-95"
              onClick={onSaveDraft}
            >
              <BookmarkCheck className="w-4 h-4" />
              {t('save_draft', { defaultValue: 'Save Draft' })}
            </Button>
          )}
          <Button
            size="lg"
            className="sm:h-12 h-10 p-button-padding! rounded-[8px] btn-color text-white font-medium text-sm gap-2.5 px-10 transition-all disabled:opacity-50"
            disabled={!selectedTitle}
            onClick={() => onNext({ selectedTitle })}
          >
            {t('continue_structure', { defaultValue: 'Continue Structure' })}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default StepTitles
