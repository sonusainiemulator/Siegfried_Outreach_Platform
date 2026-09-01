'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { LanguageModalProps } from '@/types/language'
import { Check, Loader2, Plus, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from './LanguageSelector'
import { TranslationDropzone } from './TranslationDropzone'
import Input from '@/components/ui/input'

export default function LanguageModal({ isOpen, onClose, onSave, language, isLoading }: LanguageModalProps) {
  const { t } = useTranslation()
  const isEditing = !!language

  const [selectedLang, setSelectedLang] = useState<any>(null)
  const [isActive, setIsActive] = useState(true)
  const [flagFile, setFlagFile] = useState<File | null>(null)
  const [translationFile, setTranslationFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [, setIsFlagLoading] = useState(false)
  const [flagPreview, setFlagPreview] = useState<string | null>(null)
  const [initialFlagPreview, setInitialFlagPreview] = useState<string | null>(null)
  const [isFlagDragOver, setIsFlagDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isDirty = useMemo(() => {
    const isFlagChanged = !!flagFile || (initialFlagPreview !== null && flagPreview === null)
    if (!isEditing) return !!selectedLang?.name || !!selectedLang?.locale || !!flagFile
    return (
      (selectedLang?.name || '') !== (language?.name || '') ||
      (selectedLang?.locale || '') !== (language?.locale || '') ||
      (selectedLang?.emoji || '') !== (language?.emoji || '') ||
      isActive !== (language?.is_active ?? true) ||
      isFlagChanged ||
      !!translationFile
    )
  }, [isEditing, selectedLang, language, isActive, flagFile, translationFile, initialFlagPreview, flagPreview])

  useEffect(() => {
    if (isOpen) {
      if (language) {
        setSelectedLang({
          name: language.name,
          locale: language.locale,
          emoji: language.emoji || '',
          code: ''
        })
        if (language.flag) {
          const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''
          const preview = language.flag.startsWith('http')
              ? language.flag
              : `${storageUrl.replace(/\/$/, '')}/${language.flag.replace(/^\//, '')}`
          setFlagPreview(preview)
          setInitialFlagPreview(preview)
        } else {
          setFlagPreview(null)
          setInitialFlagPreview(null)
        }
      } else {
        setSelectedLang(null)
        setFlagPreview(null)
        setInitialFlagPreview(null)
      }
      setIsActive(language?.is_active ?? true)
      setFlagFile(null)
      setTranslationFile(null)
      setErrors({})
      setSearchQuery('')
      setIsSelectOpen(false)
    }
  }, [isOpen, language])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedLang) newErrors.language = t('please_select_a_language')
    if (selectedLang && !selectedLang.name) newErrors.name = t('name_is_required')
    if (selectedLang && !selectedLang.locale) newErrors.locale = t('locale_is_required')
    else if (selectedLang && selectedLang.locale.length < 2) newErrors.locale = t('invalid_locale')

    if (!isEditing && !translationFile) newErrors.translation = t('json_file_is_required')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const autoFetchFlag = async (code: string) => {
    if (!code) return
    setIsFlagLoading(true)
    try {
      const flagUrl = `https://flagcdn.com/w160/${code.toLowerCase()}.png`
      const response = await fetch(flagUrl)
      if (!response.ok) throw new Error('Failed to fetch flag')

      const blob = await response.blob()
      const file = new File([blob], `${code}_flag.png`, { type: 'image/png' })
      setFlagFile(file)
      setFlagPreview(URL.createObjectURL(file))
    } catch (error) {
      console.error('Error fetching flag:', error)
    } finally {
      setIsFlagLoading(false)
    }
  }

  const handleSelectLanguage = (lang: any) => {
    setSelectedLang(lang)
    if (lang.code) {
      autoFetchFlag(lang.code)
    }
    setIsSelectOpen(false)
    setErrors({})
  }

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFlagFile(file)
      setFlagPreview(URL.createObjectURL(file))
    }
  }

  const handleFlagDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFlagDragOver(true)
  }

  const handleFlagDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFlagDragOver(false)
  }

  const handleFlagDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFlagDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setFlagFile(file)
      setFlagPreview(URL.createObjectURL(file))
    }
  }

  const removeFlag = () => {
    setFlagFile(null)
    setFlagPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !selectedLang) return

    const formData = new FormData()
    formData.append('name', selectedLang.name)
    formData.append('locale', selectedLang.locale.toLowerCase())
    formData.append('isActive', String(isActive))
    formData.append('emoji', selectedLang.emoji || '🌐')
    if (flagFile) formData.append('flag', flagFile)
    if (translationFile) formData.append('translation', translationFile)

    await onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-w-[95vw] sm:p-6 p-4 overflow-y-auto max-h-[90vh] border-none rounded-border-radius dark:bg-modal-bg-color backdrop-blur-xl no-scrollbar flex flex-col">
        <DialogHeader className="px-0">
          <DialogTitle>
            {isEditing ? t('edit_language') : t('add_language')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 w-full mx-auto">
          {/* Main Language Info Card */}
          <div className="relative group w-full">
            <div className="relative sm:p-6 px-4 py-6 glass-dark-card rounded-border-radius inner-card space-y-6 w-full">
              <div className="space-y-2 flex flex-col">

                <div className="space-y-6 animate-in fade-in duration-500">
                  {!isEditing && (
                    <LanguageSelector
                      selectedLang={selectedLang}
                      onSelect={handleSelectLanguage}
                      isSelectOpen={isSelectOpen}
                      setIsSelectOpen={setIsSelectOpen}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      error={errors.language}
                    />
                  )}

                  {(isEditing || selectedLang) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative overflow-hidden group/identity">
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-sm text-foreground mb-2! font-medium">
                          {t('language_name')}
                        </Label>
                        <Input
                          type="text"
                          value={selectedLang?.name || ''}
                          onChange={(e) => {
                            setSelectedLang(selectedLang ? { ...selectedLang, name: e.target.value } : null)
                            if (errors.name) {
                              setErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.name
                                return newErrors
                              })
                            }
                          }}
                          className={cn(
                            "w-full h-11 rounded-[8px] px-4 inner-card glass-dark-card font-bold text-sm focus:outline-none focus:ring-0 transition-all file:bg-transparent file:text-sm file:font-medium  file:text-foreground placeholder:text-muted-foreground/60",
                            errors.name ? "border-destructive" : " "
                          )}
                          placeholder={t('e_g_spanish')}
                        />
                        {errors.name && <p className="text-[10px] text-destructive font-bold ml-1">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground mb-2!">
                          {t('identity_locale')}
                        </Label>
                        <Input
                          type="text"
                          value={selectedLang?.locale || ''}
                          onChange={(e) => {
                            setSelectedLang(selectedLang ? { ...selectedLang, locale: e.target.value.toLowerCase() } : null)
                            if (errors.locale) {
                              setErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.locale
                                return newErrors
                              })
                            }
                          }}
                          className={cn(
                            "w-full h-11  rounded-[8px] px-4 font-mono text-sm uppercase font-bold focus:outline-none focus:ring-0 transition-all",
                            errors.locale ? "border-destructive" : "border-glass-border focus:border-primary/30"
                          )}
                          placeholder="e.g. es"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground mb-2!">
                          {t('visual_identity')}
                        </Label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={selectedLang?.emoji || ''}
                            onChange={(e) => setSelectedLang(selectedLang ? { ...selectedLang, emoji: e.target.value } : null)}
                            className="w-full h-11 rounded-[8px] px-4 text-lg focus:outline-none focus:border-primary/30 transition-all text-center"
                            placeholder="🌐"
                          />
                        </div>
                      </div>

                      {errors.locale && <p className="sm:col-span-2 text-[10px] text-destructive font-bold ml-1">{errors.locale}</p>}
                    </div>
                  )}

                  {/* Flag Upload Section */}
                  {(isEditing || selectedLang) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-foreground">{t('flag_icon_optional')}</Label>
                        {flagPreview && (
                          <Button
                            type="button"
                            onClick={removeFlag}
                            className="text-xs text-destructive p-0! bg-[unset]! font-bold hover:underline transition-all"
                          >
                            {t('remove_flag')}
                          </Button>
                        )}
                      </div>
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleFlagDragOver}
                        onDragEnter={handleFlagDragOver}
                        onDragLeave={handleFlagDragLeave}
                        onDrop={handleFlagDrop}
                        className={cn(
                          'relative h-32 w-full rounded-2xl border-2 border-dashed flex items-center px-6 gap-6 cursor-pointer transition-all duration-300 group/file',
                          isFlagDragOver
                            ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/10'
                            : flagPreview
                              ? 'border-primary/20 bg-primary/5 hover:border-primary/40'
                              : 'border-glass-border bg-muted/10 hover:border-primary/40 hover:bg-primary/5'
                        )}
                      >
                        <div className="relative h-20 w-32 rounded-xl border-2 border-dashed border-glass-border flex items-center justify-center overflow-hidden bg-background/50 group/flaghouse shadow-sm transition-transform group-hover/file:scale-[1.02]">
                          {flagPreview ? (
                            <>
                              <Image src={flagPreview} alt="Flag preview" fill className="object-cover" unoptimized />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/flaghouse:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="w-6 h-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="p-2 rounded-full bg-primary/10">
                                <Upload className="w-5 h-5 text-primary" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-foreground/80">
                            {isFlagDragOver
                              ? t('release_to_drop_flag', { defaultValue: 'Release to drop flag icon' })
                              : flagPreview
                                ? t('change_flag_icon')
                                : t('upload_custom_flag')}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {t('file_format_extenstion')}
                            <br />
                            {t('recommended_size_160x100')}
                          </p>
                          <Input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFlagChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Translation Dropzone */}
              <TranslationDropzone
                translationFile={translationFile}
                setTranslationFile={(file) => {
                  setTranslationFile(file)
                  if (file && errors.translation) {
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.translation
                      return newErrors
                    })
                  }
                }}
                error={errors.translation}
              />
            </div>
          </div>

          <div className={cn(
            "flex sm:items-center items-start justify-between sm:px-6 px-4 py-4 rounded-border-radius glass-dark-card border gap-4 w-full transition-opacity",
            language?.is_default && "opacity-60 cursor-not-allowed"
          )}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "h-4 w-4 rounded-full shrink-0",
                isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"
              )} />
              <div className="min-w-0 font-bold overflow-hidden">
                <Label
                  className={cn(
                    "text-sm font-medium flex items-center gap-2 truncate",
                    !language?.is_default && "cursor-pointer"
                  )}
                  htmlFor="lang-active"
                >
                  {t('global_availability')}
                  {language?.is_default && (
                    <span className="text-[9px] font-black uppercase text-primary/60 border border-primary/20 px-2 rounded-full">
                      {t('default')}
                    </span>
                  )}
                </Label>
              </div>
            </div>
            <Switch
              id="lang-active"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={language?.is_default}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <DialogFooter className="sm:flex-row flex-col-reverse items-center gap-3 mt-4 w-full px-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="sm:h-12 h-10 rounded-border-radius bg-light-gray text-light-text-color dark:text-white font-medium w-full border-glass-border transition-all active:scale-95"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedLang || (isEditing && !isDirty)}
              className="sm:h-12 h-10 rounded-border-radius font-medium w-full bg-primary! text-white transition-all active:scale-95 gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isEditing ? t('apply_updates') : t('build_language')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
