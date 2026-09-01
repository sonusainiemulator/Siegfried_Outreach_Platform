'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { useGenerateKeywordsMutation } from '@/redux/api/aiContentApi'
import { StepTopicProps } from '@/types'
import { BookmarkCheck, Check, ChevronRight, Loader2, Plus, Sparkles, Target, Wand2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const StepTopic = ({ data, onNext, canGenerate, onSaveDraft }: StepTopicProps) => {
  const { t } = useTranslation()
  const [topic, setTopic] = useState(data.topic || '')
  const [showAddInput, setShowAddInput] = useState(false)
  const [customKeyword, setCustomKeyword] = useState('')
  const [keywords, setKeywords] = useState<{ text: string; selected: boolean }[]>(
    data.keywords && data.keywords.length > 0
      ? data.keywords.map((kw) => (typeof kw === 'string' ? { text: kw, selected: true } : kw))
      : [],
  )

  const [generateKeywords, { isLoading }] = useGenerateKeywordsMutation()

  const handleGenerateKeywords = async () => {
    if (!topic.trim()) {
      return toast.error(t('topic_required', { defaultValue: 'Topic is required' }))
    }
    try {
      const res = await generateKeywords({
        topic,
        numKeywords: data.numKeywords,
        language: data.language,
        blogLength: data.blogLength,
        creativity: data.creativity,
      }).unwrap()
      const fetchedKeywords = Array.isArray(res.keywords) ? res.keywords : res.keywords?.keywords || []
      const newKeywords = fetchedKeywords.map((kw: string) => ({ text: kw, selected: false }))
      setKeywords(newKeywords)
      toast.success(res.message || t('keywords_generated_successfully'))
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t('something_went_wrong'))
    }
  }

  const toggleKeyword = (index: number) => {
    const updated = [...keywords]
    updated[index].selected = !updated[index].selected
    setKeywords(updated)
  }

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index))
  }

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !keywords.some((k) => k.text === customKeyword.trim())) {
      setKeywords([{ text: customKeyword.trim(), selected: true }, ...keywords])
      setCustomKeyword('')
      setShowAddInput(false)
    }
  }

  const selectedCount = keywords.filter((k) => k.selected).length

  return (
    <Card className="rounded-border-radius border border-border/40 glass-card glass-dark-card bg-card/40 backdrop-blur-xl overflow-hidden p-4 sm:p-6 space-y-6 sm:space-y-10 min-h-[500px] sm:min-h-[650px] flex flex-col">
      {/* Section 1: Topic Input */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-1 max-w-[400px]">
            <div className="flex items-center gap-2 text-subtitle-color mb-1 sm:mb-2">
              <Target className="w-5 h-5 sm:w-7 sm:h-7 shrink-0" />
              <span className="text-xl font-medium text-title-color dark:text-white tracking-tight">
                {t('core_concept')}
              </span>
            </div>
            <p className="text-subtitle-color font-medium text-sm leading-relaxed">{t('topic_description_sub')}</p>
          </div>

          <Button
            className="w-full sm:w-auto h-10 sm:h-12 rounded-[8px] p-button-padding btn-color text-white font-medium text-sm gap-2 px-6 sm:px-8 transition-all shrink-0"
            onClick={handleGenerateKeywords}
            disabled={isLoading || !topic.trim() || !canGenerate}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {t('generate_keywords')}
          </Button>
        </div>

        <Textarea
          placeholder={t('enter_article_topic', 'What would you like to write about?')}
          className="min-h-[120px] sm:min-h-[140px] glass-dark-card inner-card border-border/40 p-4 sm:p-5 text-sm sm:text-lg font-medium tracking-tight leading-relaxed focus:ring-1 focus:ring-primary/20 transition-all resize-none placeholder:text-muted-foreground/30"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      {/* Section 2: Keywords Management */}
      <div className="space-y-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between px-1 md575:flex-col md575:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-medium text-title-color dark:text-white">{t('seo_optimization')}</span>
            {keywords.length > 0 && (
              <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                {selectedCount} {t('selected')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showAddInput ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                <Input
                  placeholder={t('add_custom', 'Add keyword...')}
                  className="w-40 sm:w-48 h-10 rounded-[8px] border-border/40 text-xs font-medium pl-4 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                  value={customKeyword}
                  autoFocus
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-[8px] glass-card glass-dark-card bg-[unset]! transition-all active:scale-95 shrink-0"
                  onClick={addCustomKeyword}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-lg border-border/40  bg-destructive! hover:text-white bg-unset transition-all shrink-0"
                  onClick={() => setShowAddInput(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="h-10 w-10 rounded-lg border-border/40 bg-primary/5 p-0 transition-all text-primary hover:bg-primary hover:text-white! active:scale-95 group/add"
                onClick={() => setShowAddInput(true)}
                title={t('add_custom')}
              >
                <Plus className="w-5 h-5  group-hover:text-white! hover:text-white! transition-all transform group-hover:scale-110" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 inner-card rounded-border-radius custom-scrollbar border border-dashed border-border/40 bg-muted/5 flex flex-wrap content-start gap-3 sm:gap-5 p-4 sm:p-6 overflow-y-auto max-h-50 relative transition-all group hover:border-border/60">
          {keywords.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mb-3" strokeWidth={1} />
              <p className="text-sm text-subtitle-color dark:text-white font-medium ">{t('empty_keywords')}</p>
            </div>
          ) : (

            keywords.map((kw, i) => (
              <div
                key={i}
                className={cn(
                  'group relative flex items-center gap-2 py-1.5 sm:py-2.5 px-3 sm:px-5 rounded-lg sm:rounded-xl border transition-all select-none cursor-pointer',
                  kw.selected
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10'
                    : 'bg-light-primary border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
                onClick={() => toggleKeyword(i)}
              >
                <span className="text-xs sm:text-sm font-bold tracking-tight">{kw.text}</span>

                {kw.selected ? (
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : (
                  <Button
                    type="button"
                    className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-destructive/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeKeyword(i)
                    }}
                    title={t('remove', { defaultValue: 'Remove' })}
                  >
                    <X className="w-3 h-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        {onSaveDraft && (
          <Button
            variant="outline"
            size="lg"
            className="sm:h-12 h-10 rounded-border-radius border-border/40 glass-dark-card font-medium text-sm gap-2 px-6 transition-all active:scale-95"
            onClick={onSaveDraft}
          >
            <BookmarkCheck className="w-4 h-4" />
            {t('save_draft', { defaultValue: 'Save Draft' })}
          </Button>
        )}
        <Button
          size="lg"
          className="sm:h-12 h-10 rounded-border-radius btn-color text-white font-medium text-base gap-2.5 px-10 transition-all active:scale-95 disabled:opacity-50"
          disabled={selectedCount === 0 || !topic.trim()}
          onClick={() =>
            onNext({
              topic,
              keywords: keywords.filter((k) => k.selected).map((k) => k.text),
            })
          }
        >
          {t('continue_headline', { defaultValue: 'Continue Headline' })}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  )
}

export default StepTopic
