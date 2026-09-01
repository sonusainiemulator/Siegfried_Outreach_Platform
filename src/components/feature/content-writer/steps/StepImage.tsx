'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { useGenerateArticleImageMutation } from '@/redux/api/aiContentApi'
import { StepImageProps } from '@/types'
import { ApiError } from '@/types/api'
import {
  AlertCircle,
  ArrowLeft,
  BookmarkCheck,
  Check,
  ChevronRight,
  Image as ImageIcon,
  LinkIcon,
  Loader2,
  Pencil,
  Wand2,
  X,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const StepImage = ({ data, onNext, onBack, onSaveDraft }: StepImageProps) => {

  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState(data.selectedImage || '')
  const [customUrl, setCustomUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [images, setImages] = useState<string[]>(data.selectedImage ? [data.selectedImage] : [])
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [, setWantsGeneration] = useState(data.selectedImage ? true : false)
  // Custom prompt – seeded with a smart default the user can override
  const [imagePrompt, setImagePrompt] = useState(`A high-quality, professional hero image for: ${data.selectedTitle}`)
  const [showPromptInput, setShowPromptInput] = useState(false)
  const BASE_API_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:5000'
  const [generateImage, { isLoading }] = useGenerateArticleImageMutation()

  const getSafeImageSrc = (raw: string): string | null => {
    if (!raw) return null
    const trimmed = raw.trim()
    try {
      // Case 1: already absolute
      if (/^https?:\/\//i.test(trimmed)) {
        new URL(trimmed)
        return trimmed
      }
      // Case 2 & 3: relative path – ensure leading slash
      const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
      const full = `${BASE_API_URL}${path}`
      new URL(full)
      return full
    } catch {
      return null
    }
  }

  // No auto-generation on mount as per user request

  const handleGenerateImage = async () => {
    setWantsGeneration(true)
    setErrorDetails(null)
    try {
      const res = await generateImage({
        prompt: imagePrompt,
        numImages: 1,
        size: 'Large',
        title: data.selectedTitle,
        keywords: data.keywords,
        topic: data.topic,
      }).unwrap()

      const newImg = res.images?.[0] || res.data?.content || res.data?.images?.[0]
      if (newImg) {
        setImages([newImg, ...images])
        setSelectedImage(newImg)
        toast.success(t('visual_generated'))
      }
    } catch (error) {
      const apiError = error as ApiError
      const msg = apiError?.data?.message || apiError?.message || t('failed_to_generate')
      setErrorDetails(msg)
      toast.error(t('failed_to_generate'))
    }
  }

  const handleApplyUrl = () => {
    const trimmed = customUrl.trim()
    if (!trimmed) return

    // Validate before committing – gives the user early feedback
    if (!getSafeImageSrc(trimmed)) {
      toast.error(t('invalid_image_url', 'Please enter a valid image URL'))
      return
    }

    setSelectedImage(trimmed)
    setImages([trimmed, ...images])
    setCustomUrl('')
    setShowUrlInput(false)
    setWantsGeneration(true)
    toast.success(t('url_applied'))
  }

  const handleRemoveImage = () => {
    setSelectedImage('')
    setWantsGeneration(false)
  }

  return (
    <Card className="rounded-border-radius border border-border/40 bg-card/40 glass-card glass-dark-card! overflow-hidden p-5 sm:p-6 lg:p-8 space-y-6 sm:space-y-10 min-h-[500px] sm:min-h-162.5 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-1 sm:flex-1">
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="text-lg sm:text-xl font-medium text-primary tracking-tight">
                {t('visual_presentation')}
              </span>
            </div>
            <p className="text-subtitle-color font-medium text-xs sm:text-base opacity-70 leading-relaxed">
              {t('image_description_sub')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-11 sm:h-12 rounded-xl border-white/5 bg-white/5 inner-card glass-button text-foreground font-medium text-xs sm:text-sm gap-2 px-4 sm:px-6 transition-all"
              onClick={handleGenerateImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {t('ai_generate_visual', 'AI Visual')}
            </Button>

            <Button
              variant="outline"
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-[8px] border-border/40 hover:bg-primary! text-primary hover:text-white! p-0 transition-all flex items-center justify-center shrink-0 bg-[unset]"
              onClick={() => setShowPromptInput((prev) => !prev)}
              title={t('edit_image_prompt', 'Edit image prompt')}
            >
              {showPromptInput ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5  hover:text-white!" />
              ) : (
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5  hover:text-white!" />
              )}
            </Button>

            {showUrlInput ? (
              <div className="flex-1 sm:flex-none flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                <Input
                  placeholder={t('image_url_placeholder', 'Paste image URL...')}
                  className="flex-1 sm:w-56 h-10 rounded-[8px] border-border/40 bg-background/50 text-xs sm:text-sm font-medium pl-4 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                  value={customUrl}
                  autoFocus
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-lg bg-primary shadow-md hover:shadow-primary/20 transition-all active:scale-95 shrink-0"
                  onClick={handleApplyUrl}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-lg border-border/40 text-muted-foreground hover:bg-primary hover:text-white transition-all shrink-0"
                  onClick={() => setShowUrlInput(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg border-border/40 text-primary bg-primary/5 p-0 transition-all hover:bg-primary hover:text-white active:scale-95 group/url shadow-sm"
                onClick={() => setShowUrlInput(true)}
                title={t('add_url')}
              >
                <LinkIcon className="w-5 h-5  group-hover:text-white transition-all transform group-hover:scale-110" />
              </Button>
            )}
          </div>
        </div>

        {/* Collapsible custom prompt input */}
        {showPromptInput && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
            <p className="text-sm font-medium text-muted-foreground px-1">
              {t('image_prompt_label', 'Image Generation Prompt')}
            </p>
            <div className="flex gap-2">
              <Textarea
                className="flex-1 min-h-[72px] rounded-[8px] border border-light-norder-color  glass-dark-card text-sm font-medium px-4 py-3 shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder={t('image_prompt_placeholder', 'Describe the image you want to generate...')}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl self-start mt-1 hover:text-destructive"
                onClick={() => setShowPromptInput(false)}
                title={t('close')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <Spinner className="w-full max-w-4xl aspect-[21/9]" text={t('rendering_visual')} />
        ) : selectedImage ? (
          <div className="w-full max-w-4xl aspect-square sm:aspect-[21/9] rounded-border-radius overflow-hidden border-2 border-white/5 shadow-2xl relative group bg-background">
            {/* Use getSafeImageSrc to build a validated URL; fall back to native img on invalid URLs */}
            {getSafeImageSrc(selectedImage) ? (
              <Image
                src={getSafeImageSrc(selectedImage) as string}
                alt="Hero"
                fill
                className="object-cover transition-all duration-700"
                unoptimized={true}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <Image src={selectedImage} alt="Hero" width={100} height={100} unoptimized className="w-full h-full object-cover transition-all duration-700" />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 sm:p-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <h3 className="text-base sm:text-xl font-medium text-white tracking-tight leading-tight max-w-2xl">
                {data.selectedTitle}
              </h3>
            </div>
            {/* Always-visible close button – also revealed prominently on hover */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-xl shadow-xl transition-all opacity-70 hover:opacity-100 hover:scale-105 active:scale-95"
              onClick={handleRemoveImage}
              title={t('remove_image', 'Remove image')}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-4xl aspect-video sm:aspect-21/9 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center p-6 sm:p-12 text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-[8px] sm:rounded-border-radius bg-light-gray border border-border/40 flex items-center justify-center relative z-10 scale-90 sm:scale-100">
                <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-light-text-color dark:text-white" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-md">
              <h3 className="text-xl font-medium text-foreground leading-tight">
                {t('visual_opt_in', { defaultValue: 'Hero Visual Strategy' })}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-subtitle-color leading-relaxed opacity-70 px-4 sm:px-0">
                {t('visual_opt_in_desc', {
                  defaultValue: 'Enhance your article with an AI-generated hero image or skip to publish immediately.',
                })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-sm px-4 sm:px-0">
              <Button
                className="w-full sm:h-12 h-10 rounded-[8px] btn-color text-white hover:bg-primary! hover:text-white font-medium text-sm gap-2.5 active:scale-95 transition-all "
                onClick={handleGenerateImage}
              >
                <Zap className="w-4 h-4" />
                {t('generate_now', { defaultValue: 'Generate' })}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:h-12 h-10 rounded-[8px]  border-border/40 btn-color text-white font-medium text-sm active:scale-95 transition-all"
                onClick={() => onNext({ selectedImage: '' })}
              >
                {t('skip_this_step', { defaultValue: 'Skip Visuals' })}
              </Button>
            </div>
          </div>
        )}

        {errorDetails && (
          <div className="mt-6 flex items-center gap-3 p-4 rounded-border-radius bg-destructive/5 border border-destructive/20 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-xs font-medium text-destructive ">{errorDetails}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/20">
        <Button
          variant="ghost"
          size="sm"
          className="sm:h-12 h-10 inner-card glass-button text-black dark:text-white rounded-[8px]  font-medium text-sm gap-2 px-6 p-button-padding! transition-all active:scale-95"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('back')}
        </Button>

        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button
              variant="outline"
              size="lg"
              className="sm:h-12 h-10 rounded-[8px] border-border/40 font-medium glass-button text-sm gap-2 px-6 transition-all active:scale-95"
              onClick={onSaveDraft}
            >
              <BookmarkCheck className="w-4 h-4" />
              {t('save_draft', { defaultValue: 'Save Draft' })}
            </Button>
          )}
          <Button
            size="lg"
            className="sm:h-12 h-10 rounded-[8px]! btn-color text-white font-medium text-sm gap-2.5 p-button-padding! transition-all disabled:opacity-50"
            disabled={isLoading}
            onClick={() => onNext({ selectedImage })}
          >
            {t('continue_craft', { defaultValue: 'Continue Craft' })}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default StepImage
