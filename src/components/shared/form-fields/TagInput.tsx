'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TagInputProps } from '@/types/components/campaigns'
import { useField } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, Plus, Search, Settings2, Tag as TagIcon, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from './widgets/FormFieldWrapper'

const TagInput = ({ 
  label, 
  placeholder, 
  helperText, 
  formGroupClass, 
  labelClass, 
  onManageClick,
  tags = [],
  isLoading = false,
  ...props 
}: TagInputProps) => {
  const { t } = useTranslation()
  const [field, meta, helpers] = useField(props.name)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedTags = useMemo(() => (Array.isArray(field.value) ? field.value : []), [field.value])

  const toggleTag = useCallback(
    (tagName: string) => {
      if (selectedTags.includes(tagName)) {
        helpers.setValue(selectedTags.filter((t: string) => t !== tagName))
      } else {
        helpers.setValue([...selectedTags, tagName])
      }
    },
    [selectedTags, helpers],
  )

  const filteredTags = useMemo(() => {
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [tags, search])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <FormFieldWrapper
      label={label}
      id={props.name}
      name={props.name}
      error={meta.error}
      touched={meta.touched}
      helperText={helperText}
      labelClass={labelClass}
      formGroupClass={formGroupClass}
    >
      <div className="space-y-4" ref={containerRef}>
        {/* Trigger - Aligned with LanguageSelector but for Multi-select */}
        <div className="relative group/selector">
          <div
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className={cn(
              "w-full min-h-12 py-2 rounded-[8px] inner-card glass-dark-card px-4 flex items-center justify-between cursor-pointer transition-all border border-transparent hover:border-primary/30",
              isSelectOpen && "border-primary/50 ring-2 ring-primary/10",
              meta.touched && meta.error && "border-destructive"
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {selectedTags.length > 0 ? (
                  <TagIcon className="w-4 h-4" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
              
              {/* Selected Tags shown directly inside the trigger */}
              <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 overflow-hidden">
                {selectedTags.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {selectedTags.map((tag: string) => (
                      <motion.div
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex-shrink-0"
                      >
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 gap-1 pr-1 border-primary/20 whitespace-nowrap text-[11px] h-6">
                          {tag}
                          <X
                            size={12}
                            className="cursor-pointer hover:text-destructive transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleTag(tag)
                            }}
                          />
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <span className="font-bold text-sm text-muted-foreground truncate">
                    {placeholder || t('select_tags', { defaultValue: 'Click to choose tags...' })}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center -space-y-1 opacity-40 ml-2">
              <div className="w-1.5 h-1.5 border-r border-b border-foreground rotate-45" />
              <div className="w-1.5 h-1.5 border-r border-b border-foreground rotate-45" />
            </div>
          </div>

          {/* Absolute Dropdown Content */}
          <AnimatePresence>
            {isSelectOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-modal-bg-color border border-glass-border rounded-2xl shadow-2xl z-[100] backdrop-blur-xl"
              >
                {/* Search & Manage Box */}
                <div className="flex items-center gap-2 mb-2 p-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 bg-muted/50 dark:bg-dark-muted/50 rounded-xl text-sm border-none focus:ring-0"
                      placeholder={t('search_tags', { defaultValue: 'Search tags...' })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsSelectOpen(false)
                      onManageClick?.()
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all shrink-0"
                    title={t('manage_tags')}
                  >
                    <Settings2 size={18} />
                  </Button>
                </div>

                {/* List */}
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
                      <Loader2 size={24} className="animate-spin text-primary" />
                      <span className="text-xs">{t('loading')}</span>
                    </div>
                  ) : filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <div
                        key={tag.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTag(tag.name)
                        }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group/tagitem",
                          selectedTags.includes(tag.name) 
                            ? "bg-primary/10 border-primary/20 font-bold" 
                            : "hover:bg-primary/5 hover:scale-[1.01]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            selectedTags.includes(tag.name.toLowerCase()) ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground group-hover/tagitem:bg-primary/20 group-hover/tagitem:text-primary"
                          )}>
                            <TagIcon size={14} />
                          </div>
                          <span className={cn(
                            "text-sm",
                            selectedTags.includes(tag.name.toLowerCase()) ? "text-primary" : "text-foreground"
                          )}>
                            {tag.name}
                          </span>
                        </div>
                        <div className={cn(
                          "h-6 w-6 rounded-lg border flex items-center justify-center transition-all text-white",
                          selectedTags.includes(tag.name.toLowerCase()) 
                            ? "bg-primary border-primary scale-110" 
                            : "bg-background/50 border-glass-border opacity-0 group-hover/tagitem:opacity-100"
                        )}>
                          {selectedTags.includes(tag.name.toLowerCase()) ? <Check size={14} strokeWidth={3}/> : <Plus className="w-3 h-3 text-primary" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 mx-auto flex items-center justify-center">
                        <TagIcon className="w-6 h-6 text-primary/20" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-muted-foreground">{t('no_tag_found', { defaultValue: 'No tag found' })}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FormFieldWrapper>
  )
}

export default TagInput
