'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import {
  useCreateSocialPostMutation,
  useGetSocialAccountsQuery,
  useGetSocialPostQuery,
  useUpdateSocialPostMutation,
} from '@/redux/api/socialMediaApi'
import { ApiError } from '@/types'
import { PostComposerFormData, SocialPost } from '@/types/components/socialMedia'
import { useFormik } from 'formik'
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  Wand2,
  CheckCircle2,
  Info,
  Palette,
  Bookmark,
  FileText,
  Clock
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'
import AutoReplyOptions from './components/AutoReplyOptions'
import YouTubeStudioOptions, { YouTubeConfig } from './components/YouTubeStudioOptions'
import PlatformSelection from './components/PlatformSelection'
import PostComposerHeader from './components/PostComposerHeader'
import SchedulingOptions from './components/SchedulingOptions'
import CarouselSlideManager, { CarouselSlideItem } from './components/CarouselSlideManager'
import SocialPostPreview from './components/SocialPostPreview'
import AICarouselModal from './components/AICarouselModal'
import AIPostGeneratorModal from './components/AIPostGeneratorModal'
import { AISocialImageGeneratorModal } from './components/AISocialImageGeneratorModal'
import { AIImageVisionModal } from './components/AIImageVisionModal'
import { useGenerateSocialCaptionMutation } from '@/redux/api/aiContentApi'

const PostComposer = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [createPost, { isLoading: isCreating }] = useCreateSocialPostMutation()
  const [updatePost, { isLoading: isUpdating }] = useUpdateSocialPostMutation()
  const { data: accountsData } = useGetSocialAccountsQuery({})
  const { data: editPostData, isLoading: isLoadingPost } = useGetSocialPostQuery(editId, { skip: !editId })

  const rawAccounts = accountsData?.socialAccounts || []
  const hasWhatsApp = rawAccounts.some((a: any) => a.platform.toLowerCase() === 'whatsapp')
  const defaultWhatsAppAccount = !hasWhatsApp ? [{
    id: 'whatsapp-channel-default',
    platform: 'whatsapp',
    accountName: 'Official WhatsApp Channel',
    isActive: true,
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
  }] : []
  const accounts = [...rawAccounts, ...defaultWhatsAppAccount]
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState('')
  const [postTypes, setPostTypes] = useState<Record<string, string>>({})
  const [youTubeConfig, setYouTubeConfig] = useState<YouTubeConfig>({
    format: 'video',
    tags: ['AI', 'Tech', 'Growth'],
    visibility: 'public',
    madeForKids: false,
  })
  const [slides, setSlides] = useState<CarouselSlideItem[]>([])
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [isAIPostModalOpen, setIsAIPostModalOpen] = useState(false)
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false)
  const [isAIImageGenModalOpen, setIsAIImageGenModalOpen] = useState(false)
  const [visionTargetSlideIndex, setVisionTargetSlideIndex] = useState(0)
  const [inlineActionLoading, setInlineActionLoading] = useState<string | null>(null)
  const [generateSocialCaption, { isLoading: isGeneratingInline }] = useGenerateSocialCaptionMutation()
  const [activeTab, setActiveTab] = useState<'composer' | 'preview'>('composer')
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  const handlePostTypeChange = (accountId: string, type: string) => {
    setPostTypes((prev) => ({
      ...prev,
      [accountId]: type,
    }))
  }


  const validationSchema = Yup.object({
    title: Yup.string().required(t('social_title_required', { defaultValue: 'Title is required' })),
    content: Yup.string().required(t('social_content_required', { defaultValue: 'Content is required' })),
  })

  const formik = useFormik<PostComposerFormData>({
    initialValues: {
      title: '',
      content: '',
      platforms: [],
      mediaUrls: '',
      autoReplyConfig: {
        isEnabled: false,
        triggerKeyword: ['DM'],
        publicMessage: 'Please check your DM for the information you requested! 📩',
        privateMessage: '',
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.platforms.length === 0) {
        toast.error(
          t('hub_selection_required', {
            defaultValue: 'At least one social account must be selected',
          }),
        )
        return
      }

      // Check carousel validation if Carousel format is selected
      const hasCarouselAccount = values.platforms.some((pId) => postTypes[pId] === 'carousel')
      if (hasCarouselAccount && slides.length < 2) {
        toast.error(
          t('carousel_min_two_required', {
            defaultValue: 'Carousel posts require at least 2 media items (images or videos).',
          }),
        )
        return
      }
      if (hasCarouselAccount && slides.length > 10) {
        toast.error(
          t('carousel_max_ten_allowed', {
            defaultValue: 'Carousel posts support a maximum of 10 media items.',
          }),
        )
        return
      }

      try {
        let scheduledDateTime = undefined
        if (isScheduled) {
          if (!scheduledDate || !scheduledTime) {
            toast.error(t('date_time_required', { defaultValue: 'Date and time are required' }))
            return
          }
          const date = new Date(scheduledDate)
          const [hours, minutes] = scheduledTime.split(':')
          date.setHours(parseInt(hours), parseInt(minutes))
          scheduledDateTime = date.toISOString()
        }

        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('content', values.content)
        formData.append('isImmediate', String(!isScheduled))
        formData.append('postTypes', JSON.stringify(postTypes))

        if (scheduledDateTime) {
          formData.append('scheduledDateTime', scheduledDateTime)
        }

        values.platforms.forEach((platform) => {
          formData.append('platformAccounts', platform)
        })

        // Append media in exact ordered sequence from slides array
        slides.forEach((slide) => {
          if (slide.isExisting && slide.url) {
            formData.append('mediaUrls', slide.url)
          } else if (slide.file) {
            formData.append('files', slide.file)
          }
        })

        // Also append manual comma-separated mediaUrls if specified
        if (values.mediaUrls) {
          const urls = values.mediaUrls
            .split(',')
            .map((u) => u.trim())
            .filter(Boolean)
          urls.forEach((url) => formData.append('mediaUrls', url))
        }

        if (values.autoReplyConfig?.isEnabled) {
          formData.append('autoReplyConfig', JSON.stringify(values.autoReplyConfig))
        }

        if (editId) {
          const res = await updatePost({ id: editId, data: formData }).unwrap()
          toast.success(res.message || t('mission_recalibrated', { defaultValue: 'Mission Re-calibrated' }))
        } else {
          const res = await createPost(formData).unwrap()
          toast.success(
            res.message ||
            (isScheduled
              ? t('mission_queued', { defaultValue: 'Mission Queued' })
              : t('broadcast_successful', { defaultValue: 'Broadcast Successful' })),
          )
        }

        router.push(ROUTES.SOCIAL_MEDIA.DASHBOARD)
      } catch (error) {
        const apiError = error as ApiError
        console.error('Submit post error:', error)
        toast.error(apiError?.data?.message || t('nexus_core_failure', { defaultValue: 'Nexus core failure' }))
      }
    },
  })

  // Save as Draft Handler (Does not require platforms or immediate publishing)
  const handleSaveDraft = async () => {
    const titleVal = formik.values.title?.trim()
    const contentVal = formik.values.content?.trim()

    if (!titleVal && !contentVal && slides.length === 0) {
      toast.error(
        t('draft_min_content_needed', {
          defaultValue: 'Please enter a title, content, or add media before saving a draft.',
        })
      )
      return
    }

    try {
      setIsSavingDraft(true)
      const formData = new FormData()
      formData.append('title', titleVal || 'Untitled Draft')
      formData.append('content', contentVal || '')
      formData.append('status', 'draft')
      formData.append('isDraft', 'true')
      formData.append('isImmediate', 'false')
      formData.append('postTypes', JSON.stringify(postTypes))

      if (isScheduled && scheduledDate && scheduledTime) {
        const date = new Date(scheduledDate)
        const [hours, minutes] = scheduledTime.split(':')
        date.setHours(parseInt(hours), parseInt(minutes))
        formData.append('scheduledDateTime', date.toISOString())
      }

      formik.values.platforms.forEach((platform) => {
        formData.append('platformAccounts', platform)
      })

      // Append media in exact sequence
      slides.forEach((slide) => {
        if (slide.isExisting && slide.url) {
          formData.append('mediaUrls', slide.url)
        } else if (slide.file) {
          formData.append('files', slide.file)
        }
      })

      if (formik.values.mediaUrls) {
        const urls = formik.values.mediaUrls
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
        urls.forEach((url) => formData.append('mediaUrls', url))
      }

      if (formik.values.autoReplyConfig?.isEnabled) {
        formData.append('autoReplyConfig', JSON.stringify(formik.values.autoReplyConfig))
      }

      if (editId) {
        const res = await updatePost({ id: editId, data: formData }).unwrap()
        toast.success(res.message || t('draft_updated_success', { defaultValue: 'Draft updated successfully!' }))
      } else {
        const res = await createPost(formData).unwrap()
        toast.success(res.message || t('draft_saved_success', { defaultValue: 'Post saved as draft! You can edit, schedule, or publish anytime.' }))
      }

      router.push(ROUTES.SOCIAL_MEDIA.CALENDAR)
    } catch (error) {
      const apiError = error as ApiError
      console.error('Save draft error:', error)
      toast.error(apiError?.data?.message || t('failed_to_save_draft', { defaultValue: 'Failed to save draft' }))
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Detect if any selected platform is set to Carousel format
  const isCarouselSelected = Object.entries(postTypes).some(([accId, type]) => {
    const isSelected = formik?.values?.platforms?.includes(accId)
    return isSelected && type === 'carousel'
  }) || slides.length > 1

  // Load existing post if editing
  useEffect(() => {
    if (editPostData?.socialPost) {
      const post = editPostData.socialPost as SocialPost
      const config = post.autoReplyConfig
      const triggerKeyword = Array.isArray(config?.triggerKeyword)
        ? config.triggerKeyword
        : [config?.triggerKeyword || 'DM']

      formik.setValues({
        title: post.title || '',
        content: post.content || '',
        platforms: post.platforms?.map((p: any) => p.id || p.socialAccountId?._id || p.socialAccountId) || [],
        mediaUrls: '',
        autoReplyConfig: {
          isEnabled: config?.isEnabled || false,
          triggerKeyword,
          publicMessage: config?.publicMessage || 'Please check your DM for the information you requested! 📩',
          privateMessage: config?.privateMessage || '',
        },
      })

      if (post.scheduledDateTime) {
        const date = new Date(post.scheduledDateTime)
        setTimeout(() => {
          setIsScheduled(true)
          setScheduledDate(date)
          setScheduledTime(
            `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
          )
        }, 100)
      } else {
        setTimeout(() => {
          setIsScheduled(false)
        }, 100)
      }

      if (post.mediaUrls && Array.isArray(post.mediaUrls)) {
        const existingSlides: CarouselSlideItem[] = post.mediaUrls.map((url, idx) => {
          const ext = String(url).split('?')[0].split('.').pop()?.toLowerCase() || ''
          const isVid = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)
          return {
            id: `existing-${idx}-${Date.now()}`,
            url,
            isExisting: true,
            originalIndex: idx,
            type: isVid ? 'video' : 'image',
          }
        })
        setSlides(existingSlides)
      }

      if (post.platforms) {
        const types: Record<string, string> = {}
        post.platforms.forEach((p: any) => {
          const accId = p.id || p.socialAccountId?._id || p.socialAccountId
          if (p.postType && accId) {
            types[accId] = p.postType
          }
        })
        setTimeout(() => {
          setPostTypes(types)
        }, 100)
      }
    }
  }, [editPostData])

  // Slide Management Helpers
  const handleAddFiles = (files: File[]) => {
    const newSlideItems: CarouselSlideItem[] = files.map((file, i) => {
      const isVid = file.type.startsWith('video/')
      return {
        id: `new-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        isExisting: false,
        originalIndex: slides.length + i,
        file,
        type: isVid ? 'video' : 'image',
      }
    })

    setSlides((prev) => {
      const combined = [...prev, ...newSlideItems]
      if (combined.length > 10) {
        toast.warning(
          t('max_ten_slides_warning', {
            defaultValue: 'Meta carousels support up to 10 slides. Extra items were trimmed.',
          }),
        )
        return combined.slice(0, 10)
      }
      return combined
    })
  }

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= slides.length || toIndex < 0 || toIndex >= slides.length) return

    setSlides((prev) => {
      const copy = [...prev]
      const [moved] = copy.splice(fromIndex, 1)
      copy.splice(toIndex, 0, moved)
      return copy
    })
  }

  const handleRemoveSlide = (index: number) => {
    setSlides((prev) => {
      const slide = prev[index]
      if (!slide.isExisting && slide.url?.startsWith('blob:')) {
        URL.revokeObjectURL(slide.url)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleClearAllSlides = () => {
    slides.forEach((s) => {
      if (!s.isExisting && s.url?.startsWith('blob:')) {
        URL.revokeObjectURL(s.url)
      }
    })
    setSlides([])
  }

  const togglePlatform = (accountId: string) => {
    const current = formik.values.platforms
    const isAdding = !current.includes(accountId)
    const updated = isAdding ? [...current, accountId] : current.filter((id) => id !== accountId)

    if (isAdding && formik.values.autoReplyConfig?.isEnabled) {
      const account = accounts.find((acc: any) => acc.id === accountId)
      if (account && !['instagram', 'facebook', 'youtube'].includes(account.platform.toLowerCase())) {
        toast.error(
          t('autoreply_incompatible', {
            defaultValue: `Tactical Alert: Auto-Reply sequence is incompatible with ${account.platform} nodes.`,
          }),
        )
        return
      }
    }

    formik.setFieldValue('platforms', updated)
  }

  const handleSelectAllPlatforms = (accountIdsToSelect?: string[]) => {
    const idsToSelect = accountIdsToSelect || accounts.map((acc: any) => acc.id)
    if (formik.values.autoReplyConfig?.isEnabled) {
      const selectedAccs = accounts.filter((acc: any) => idsToSelect.includes(acc.id))
      const hasUnsupported = selectedAccs.some(
        (acc: any) => !['instagram', 'facebook', 'youtube'].includes(acc.platform.toLowerCase()),
      )

      if (hasUnsupported) {
        toast.error(
          t('autoreply_supported_only', {
            defaultValue: 'Tactical Alert: Auto-Reply sequence currently only compatible with Instagram, Facebook, and YouTube nodes.',
          }),
        )
        return
      }
    }
    formik.setFieldValue('platforms', idsToSelect)
  }

  const handleDeselectAllPlatforms = () => {
    formik.setFieldValue('platforms', [])
  }

  const handleAutoReplyToggle = (config: any) => {
    const selectedAccounts = accounts.filter((acc: any) => formik.values.platforms.includes(acc.id))
    const hasUnsupported = selectedAccounts.some(
      (acc: any) => !['instagram', 'facebook', 'youtube'].includes(acc.platform.toLowerCase())
    )

    if (config.isEnabled && hasUnsupported) {
      toast.error(
        t('autoreply_supported_only', {
          defaultValue: 'Tactical Alert: Auto-Reply sequence currently only compatible with Instagram, Facebook, and YouTube nodes.',
        }),
      )
      return
    }
    formik.setFieldValue('autoReplyConfig', config)
  }

  // Handle Apply from AI Carousel Generator Modal
  const handleApplyAICarousel = (data: {
    title: string
    content: string
    autoReplyKeyword: string
    autoReplyMessage: string
    slides: any[]
    files?: File[]
  }) => {
    if (data.title) formik.setFieldValue("title", data.title)
    if (data.content) formik.setFieldValue("content", data.content)

    if (data.autoReplyKeyword) {
      formik.setFieldValue("autoReplyConfig", {
        isEnabled: true,
        triggerKeyword: [data.autoReplyKeyword],
        publicMessage: "Please check your DM for the information you requested! 📩",
        privateMessage: data.autoReplyMessage || "Here is the resource you requested! 🚀",
      })
    }

    if (data.files && data.files.length > 0) {
      handleAddFiles(data.files)

      // Set carousel post type for selected platform accounts
      const updatedTypes = { ...postTypes }
      formik.values.platforms.forEach((pId) => {
        updatedTypes[pId] = "carousel"
      })
      setPostTypes(updatedTypes)
    }
  }

  // Handle Apply from AI Post & Caption Generator Modal
  const handleApplyAIPost = (data: {
    title: string
    content: string
    autoReplyKeyword?: string
    autoReplyMessage?: string
    hashtags?: string[]
  }) => {
    if (data.title) formik.setFieldValue('title', data.title)
    if (data.content) formik.setFieldValue('content', data.content)

    if (data.autoReplyKeyword) {
      formik.setFieldValue('autoReplyConfig', {
        isEnabled: true,
        triggerKeyword: [data.autoReplyKeyword],
        publicMessage: 'Please check your DM for the information you requested! 📩',
        privateMessage: data.autoReplyMessage || 'Here is the resource you requested! 🚀',
      })
    }
  }

  // Handle Quick Inline AI Actions on Caption
  const handleQuickAIAction = async (action: 'enhance_caption' | 'add_hashtags' | 'add_cta') => {
    const currentContent = formik.values.content.trim()
    const currentTitle = formik.values.title.trim()

    if (!currentContent && !currentTitle) {
      setIsAIPostModalOpen(true)
      return
    }

    setInlineActionLoading(action)
    try {
      const selectedAccs = accounts.filter((acc: any) => formik.values.platforms.includes(acc.id))
      const platformNames = selectedAccs.map((acc: any) => acc.platform)

      const res: any = await generateSocialCaption({
        action,
        existingContent: currentContent,
        existingTitle: currentTitle,
        platforms: platformNames.length > 0 ? platformNames : ['instagram', 'facebook'],
      }).unwrap()

      if (res?.data) {
        if (action === 'add_hashtags' && res.data.hashtags?.length > 0) {
          const tagsString = res.data.hashtags.map((h: string) => h.startsWith('#') ? h : '#' + h).join(' ')
          formik.setFieldValue('content', currentContent ? `${currentContent}\n\n${tagsString}` : tagsString)
          toast.success(t('hashtags_added', { defaultValue: 'Hashtags appended to caption!' }))
        } else if (res.data.caption) {
          formik.setFieldValue('content', res.data.caption)
          if (res.data.title && !currentTitle) {
            formik.setFieldValue('title', res.data.title)
          }
          toast.success(t('caption_enhanced', { defaultValue: 'Caption updated by AI!' }))
        }
      }
    } catch (err: any) {
      console.error('Quick AI action failed:', err)
      toast.error(err?.data?.message || err?.message || 'AI action failed')
    } finally {
      setInlineActionLoading(null)
    }
  }



  const isLoading = isCreating || isUpdating || isLoadingPost

  const hasPostDetails =
    formik.values.title.trim() !== '' ||
    formik.values.content.trim() !== '' ||
    slides.length > 0

  const selectedAccountObjects = accounts.filter((acc: any) => formik.values.platforms.includes(acc.id))

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in px-0">
      {/* Post Composer Header with AI Agent shortcut */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border/20">
        <PostComposerHeader
          editId={editId}
          onNavigateToDashboard={() => router.push(ROUTES.SOCIAL_MEDIA.DASHBOARD)}
        />

        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className="flex sm:hidden items-center bg-background/60 p-1 rounded-xl border border-border/30 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('composer')}
              className={cn(
                'px-2.5 py-1 text-xs rounded-lg font-semibold flex items-center gap-1',
                activeTab === 'composer' ? 'bg-primary text-white' : 'text-muted-foreground'
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={cn(
                'px-2.5 py-1 text-xs rounded-lg font-semibold flex items-center gap-1',
                activeTab === 'preview' ? 'bg-primary text-white' : 'text-muted-foreground'
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={() => router.push('/ai-social/indian-festivals')}
            className="h-10 px-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🇮🇳 Indian Festivals Auto-Pilot</span>
          </Button>

          <Button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            className="h-10 px-3.5 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{t('ai_carousel_agent', { defaultValue: 'AI Carousel Agent' })}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left Column (8 cols): Composer & Carousel Studio */}
        <div className={cn('lg:col-span-8 space-y-6 md:space-y-8', activeTab === 'preview' ? 'hidden sm:block' : '')}>
          <Card className="border-border/40 glass-card glass-dark-card backdrop-blur-xl rounded-border-radius overflow-hidden shadow-xl">
            <CardHeader className="p-4 sm:p-6 pb-0! border-b border-border/10">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-xl font-medium text-title-color dark:text-white">
                    {t('social_msg_architecture', { defaultValue: 'Post Transmission Studio' })}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {editPostData?.socialPost?.status === 'draft' && (
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t('draft_mode', { defaultValue: 'Draft Post' })}</span>
                    </Badge>
                  )}
                  {isCarouselSelected && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{t('carousel_mode_active', { defaultValue: 'Carousel Mode Active' })}</span>
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAIPostModalOpen(true)}
                    className="h-8 px-2.5 text-xs font-bold text-primary hover:bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('generate_with_ai', { defaultValue: 'Generate with AI' })}</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6 md:space-y-8 pt-4">
              <form onSubmit={formik.handleSubmit} id="post-form" className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 gap-5">
                  {/* Internal Reference Title */}
                  <div className="space-y-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-title-color dark:text-white">
                        {t('social_internal_reference', { defaultValue: 'Internal Reference Title' })} *
                      </Label>
                      <button
                        type="button"
                        onClick={() => setIsAIPostModalOpen(true)}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Title Generator</span>
                      </button>
                    </div>
                    <Input
                      name="title"
                      placeholder={t('social_ref_placeholder', { defaultValue: 'e.g., Q3 Product Launch Promo' })}
                      className={cn(
                        "h-11 md:h-12 rounded-[10px] border-border/40 focus:ring-primary/20 text-sm font-medium px-4 md:px-5 w-full shadow-none bg-background/40",
                        formik.touched.title && formik.errors.title && "border-destructive focus:border-destructive"
                      )}
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-xs text-destructive mt-0.5 font-medium">{formik.errors.title}</p>
                    )}
                  </div>

                  {/* Post Content / Caption */}
                  <div className="space-y-2.5 flex flex-col">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Label className="text-sm font-semibold text-title-color dark:text-white">
                        {t('social_dispatch_content', { defaultValue: 'Post Copy & Caption' })} *
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {formik.values.content.length} / 2200
                        </span>
                      </div>
                    </div>

                    {/* Inline AI Quick Tools Bar */}
                    <div className="flex items-center gap-1.5 flex-wrap p-1.5 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => setIsAIPostModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary to-purple-600 text-white shadow-xs flex items-center gap-1 hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>AI Writer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVisionTargetSlideIndex(0)
                          setIsVisionModalOpen(true)
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>AI Image Vision</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAIImageGenModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>AI Image Studio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAIAction('enhance_caption')}
                        disabled={inlineActionLoading !== null}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium border border-border/40 hover:border-primary/40 hover:bg-primary/5 text-title-color dark:text-gray-200 transition-all flex items-center gap-1 cursor-pointer bg-background/60"
                      >
                        {inlineActionLoading === 'enhance_caption' ? (
                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        ) : (
                          <Wand2 className="w-3 h-3 text-purple-500" />
                        )}
                        <span>Polish Caption</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAIAction('add_hashtags')}
                        disabled={inlineActionLoading !== null}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium border border-border/40 hover:border-primary/40 hover:bg-primary/5 text-title-color dark:text-gray-200 transition-all flex items-center gap-1 cursor-pointer bg-background/60"
                      >
                        {inlineActionLoading === 'add_hashtags' ? (
                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        ) : (
                          <span className="text-primary font-bold">#</span>
                        )}
                        <span>Add Hashtags</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAIAction('add_cta')}
                        disabled={inlineActionLoading !== null}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium border border-border/40 hover:border-primary/40 hover:bg-primary/5 text-title-color dark:text-gray-200 transition-all flex items-center gap-1 cursor-pointer bg-background/60"
                      >
                        {inlineActionLoading === 'add_cta' ? (
                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                        <span>Add CTA</span>
                      </button>
                    </div>

                    <div className="relative">
                      <Textarea
                        name="content"
                        placeholder={t('social_type_transmission', {
                          defaultValue: 'Write your caption with emojis, value points, and hashtags... (#Outreach #Marketing)',
                        })}
                        className={cn(
                          "min-h-36 rounded-[10px] border-border/40 focus:ring-primary/20 text-sm inner-card leading-relaxed p-4 resize-y w-full shadow-none bg-background/40",
                          formik.touched.content && formik.errors.content && "border-destructive focus:border-destructive"
                        )}
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.content && formik.errors.content && (
                        <p className="text-xs text-destructive mt-0.5 font-medium">{formik.errors.content}</p>
                      )}
                    </div>
                  </div>

                  {/* Carousel Slide Studio / Multi-Media Manager */}
                  <div className="pt-2">
                    <CarouselSlideManager
                      slides={slides}
                      onMoveSlide={handleMoveSlide}
                      onRemoveSlide={handleRemoveSlide}
                      onAddFiles={handleAddFiles}
                      onClearAll={handleClearAllSlides}
                      onOpenAIGenerator={() => setIsAIModalOpen(true)}
                      isCarouselMode={isCarouselSelected}
                    />
                  </div>

                  {/* YouTube Studio Suite (Auto Thumbnail Extraction & AI Studio) */}
                  {selectedAccountObjects.some((a: any) => a.platform?.toLowerCase() === 'youtube') && (
                    <div className="pt-2">
                      <YouTubeStudioOptions
                        config={youTubeConfig}
                        onChange={setYouTubeConfig}
                        currentTitle={formik.values.title}
                        currentContent={formik.values.content}
                        slides={slides}
                        onApplyAITitle={(val) => formik.setFieldValue('title', val)}
                        onApplyAIDescription={(val) => formik.setFieldValue('content', val)}
                        onAddThumbnailToSlides={(thumbFile) => {
                          const newSlide: CarouselSlideItem = {
                            id: 'yt-thumb-' + Date.now(),
                            url: URL.createObjectURL(thumbFile),
                            isExisting: false,
                            originalIndex: 0,
                            file: thumbFile,
                            type: 'image',
                          }
                          setSlides((prev) => [newSlide, ...prev.filter(s => !s.id.startsWith('yt-thumb-'))])
                          toast.success(t('youtube_thumbnail_applied', { defaultValue: 'Auto 16:9 Thumbnail applied as primary cover!' }))
                        }}
                      />
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Auto-Reply & Scheduling Options */}
          <div className="rounded-border-radius glass-card glass-dark-card p-4 sm:p-6 space-y-6 md:space-y-8 shadow-xl">
            <AutoReplyOptions
              config={formik.values.autoReplyConfig!}
              onConfigChange={handleAutoReplyToggle}
              disabled={isLoading}
              selectedAccounts={selectedAccountObjects}
            />

            <SchedulingOptions
              isScheduled={isScheduled}
              onScheduleToggle={setIsScheduled}
              scheduledDate={scheduledDate}
              onDateChange={setScheduledDate}
              scheduledTime={scheduledTime}
              onTimeChange={setScheduledTime}
            />
          </div>
        </div>

        {/* Right Column (4 cols): Platform Selection & Live Interactive Preview */}
        <div className={cn('lg:col-span-4 space-y-6', activeTab === 'composer' ? 'hidden sm:block' : '')}>
          <PlatformSelection
            accounts={accounts}
            selectedPlatforms={formik.values.platforms}
            onTogglePlatform={togglePlatform}
            onSelectAllPlatforms={handleSelectAllPlatforms}
            onDeselectAllPlatforms={handleDeselectAllPlatforms}
            postTypes={postTypes}
            onChangePostType={handlePostTypeChange}
          />

          {/* Live Interactive Post & Carousel Preview Mockup */}
          <Card className="border-border/40 glass-card glass-dark-card backdrop-blur-xl rounded-border-radius overflow-hidden p-4 sm:p-5 shadow-xl">
            <SocialPostPreview
              title={formik.values.title}
              content={formik.values.content}
              slides={slides}
              selectedAccounts={selectedAccountObjects}
              autoReplyKeyword={formik.values.autoReplyConfig?.triggerKeyword}
              isAutoReplyEnabled={formik.values.autoReplyConfig?.isEnabled}
              postTypes={postTypes}
            />
          </Card>
        </div>

        {/* Submit, Draft & Deploy Action Bar */}
        <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {editId && editPostData?.socialPost?.status === 'draft'
                ? t('editing_draft_mode_hint', { defaultValue: 'Draft Mode: Update your draft, or publish/schedule to live channels when ready.' })
                : t('draft_mode_hint', { defaultValue: 'Draft posts can be edited, scheduled, or published anytime from Calendar & Dashboard.' })}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
            {/* Save as Draft Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading || isSavingDraft}
              className="sm:h-12 h-11 flex-1 sm:flex-initial px-5 rounded-[10px] border-amber-500/30 hover:border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isSavingDraft ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              ) : (
                <Bookmark className="w-4 h-4 text-amber-500" />
              )}
              <span>
                {editId && editPostData?.socialPost?.status === 'draft'
                  ? t('update_draft_btn', { defaultValue: 'Update Draft' })
                  : t('save_as_draft_btn', { defaultValue: 'Save as Draft' })}
              </span>
            </Button>

            {/* Main Publish / Schedule Broadcast Button */}
            <Button
              form="post-form"
              type="submit"
              onClick={() => {
                if (!formik.values.title?.trim() || !formik.values.content?.trim()) {
                  formik.setFieldTouched('title', true)
                  formik.setFieldTouched('content', true)
                  if (!formik.values.title?.trim() && !formik.values.content?.trim()) {
                    toast.error(t('title_and_caption_required', { defaultValue: 'Please enter a Post Title and Caption before publishing.' }))
                  } else if (!formik.values.title?.trim()) {
                    toast.error(t('title_required', { defaultValue: 'Please enter a Post Title.' }))
                  } else if (!formik.values.content?.trim()) {
                    toast.error(t('caption_required', { defaultValue: 'Please enter a Post Caption / Copy.' }))
                  }
                }
                if (formik.values.platforms.length === 0) {
                  toast.error(t('hub_selection_required', { defaultValue: 'Please select at least one social account to publish to.' }))
                }
              }}
              disabled={isLoading || isSavingDraft}
              className={cn(
                'sm:h-12 h-11 flex-1 sm:flex-initial rounded-[10px] p-button-padding! btn-color text-white font-semibold transition-all text-sm border-none gap-2 flex items-center justify-center shadow-xl cursor-pointer',
                (isLoading || isSavingDraft) && 'opacity-50 cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : editId && editPostData?.socialPost?.status !== 'draft' ? (
                t('social_redeploy_sequence', { defaultValue: 'Update Post' })
              ) : isScheduled ? (
                t('social_initiate_queue', { defaultValue: 'Schedule Broadcast' })
              ) : (
                t('social_execute_broadcast', { defaultValue: 'Publish Immediately' })
              )}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Carousel Generator Modal */}
      <AICarouselModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApply={handleApplyAICarousel}
      />

      {/* AI Post & Caption Generator Studio Modal */}
      <AISocialImageGeneratorModal
        isOpen={isAIImageGenModalOpen}
        onClose={() => setIsAIImageGenModalOpen(false)}
        initialPlatform={accounts.find((a: any) => formik.values.platforms.includes(a.id))?.platform || 'instagram'}
        onAddGeneratedImage={(item) => {
          const newSlide = {
            id: 'ai-img-' + Date.now(),
            url: item.url,
            isExisting: true,
            originalIndex: slides.length,
            type: 'image' as const
          }
          setSlides((prev) => [...prev, newSlide])
        }}
      />

      <AIImageVisionModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        slides={slides}
        initialSlideIndex={visionTargetSlideIndex}
        onApply={(data) => {
          if (data.title) formik.setFieldValue('title', data.title)
          if (data.content) formik.setFieldValue('content', data.content)
        }}
      />

      <AIPostGeneratorModal
        isOpen={isAIPostModalOpen}
        onClose={() => setIsAIPostModalOpen(false)}
        onApply={handleApplyAIPost}
        initialTopic={formik.values.title}
        initialContent={formik.values.content}
        selectedPlatforms={accounts.filter((acc: any) => formik.values.platforms.includes(acc.id)).map((a: any) => a.platform)}
      />
    </div>
  )
}

export default PostComposer
