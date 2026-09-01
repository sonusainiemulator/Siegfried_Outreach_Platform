'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import {
  useCreateCampaignMutation,
  useGenerateWhatsappContentMutation,
  useGetCampaignQuery,
  useUpdateCampaignMutation,
} from '@/redux/api/campaignApi'
import { useGetContactsQuery } from '@/redux/api/contactApi'
import { useGetContactGroupsQuery } from '@/redux/api/contactGroupApi'
import { ApiError } from '@/types'
import { FormValues, WhatsAppCampaignFormProps } from '@/types/components/campaigns'
import { isBrowser } from '@/utils/environment'
import { campaignSchemas } from '@/utils/validation-schemas'
import { Form, Formik, FormikHelpers } from 'formik'
import { ArrowLeft, ChevronRight, Loader2, Save, Sparkles, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CampaignMediaUpload } from './components/CampaignMediaUpload'
import { CampaignScheduler } from './components/CampaignScheduler'
import { WhatsAppPreview } from './components/WhatsAppPreview'
import SelectionList from './wizard/SelectionList'

const FORM_NAME = 'whatsapp-campaign'

const WhatsAppCampaignForm = ({ campaignId }: WhatsAppCampaignFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation()
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation()
  const [generateContent, { isLoading: isGenerating }] = useGenerateWhatsappContentMutation()
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaMode, setMediaMode] = useState<'file' | 'url'>('file')

  const [showPreview, setShowPreview] = useState(false)

  const { data: campaignData, isLoading: isLoadingCampaign } = useGetCampaignQuery(campaignId || '', {
    skip: !campaignId,
  })

  const { data: contactsData } = useGetContactsQuery({ type: 'whatsapp' })
  const { data: contactListsData } = useGetContactGroupsQuery({ type: 'whatsapp' })

  const [initialValues, setInitialValues] = useState<FormValues>(() => {
    // Check for persisted draft if not editing
    if (isBrowser && !campaignId) {
      const saved = localStorage.getItem(`form-draft-${FORM_NAME}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            name: '',
            content: '',
            media: '',
            segments: [],
            contacts: [],
            lists: [],
            aiReply: false,
            scheduledAt: null,
            channel: 'whatsapp',
            ai_prompt: '',
            mediaFile: null,
            ...parsed,
          }
        } catch (e) {
          console.error('Error parsing persisted whatsapp campaign data', e)
        }
      }
    }

    return {
      name: '',
      content: '',
      media: '',
      segments: [],
      contacts: [],
      lists: [],
      aiReply: false,
      scheduledAt: null,
      channel: 'whatsapp',
      ai_prompt: '',
      mediaFile: null,
    }
  })

  const [activeStep, setActiveStep] = useState(() => {
    if (isBrowser && !campaignId) {
      const saved = localStorage.getItem(`form-draft-${FORM_NAME}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return parsed.activeStep ?? 0
        } catch (e) {
          return 0
        }
      }
    }
    return 0
  })

  const steps = [
    t('message_design', { defaultValue: 'Message Design' }),
    t('target_audience', { defaultValue: 'Audience Selection' }),
    t('schedule_launch', { defaultValue: 'Schedule & Launch' }),
  ]

  const prevStep = () => setActiveStep((prev: number) => Math.max(prev - 1, 0))

  const handleNext = async (
    validateForm: () => Promise<Record<string, string>>,
    setTouched: (fields: Record<string, boolean>) => void,
    values: FormValues,
  ) => {
    const errors = await validateForm()

    if (activeStep === 0) {
      if (errors.name || errors.content) {
        setTouched({ name: true, content: true })
        return
      }
    } else if (activeStep === 1) {
      const hasAudience =
        (values.lists?.length ?? 0) > 0 ||
        (values.contacts?.length ?? 0) > 0 ||
        (values.segments?.length ?? 0) > 0
      if (!hasAudience) {
        setTouched({ lists: true, contacts: true, segments: true })
        return
      }
    }

    setActiveStep((prev: number) => Math.min(prev + 1, steps.length - 1))
  }

  useEffect(() => {
    if (campaignData?.data) {
      const campaign = campaignData.data
      const content = campaign.content || campaign.htmlTemplate || ''
      const nameHeader = `*${campaign.name || ''}*\n\n`
      const initialContent = content.startsWith(nameHeader) ? content.slice(nameHeader.length) : content

      setInitialValues({
        name: campaign.name || '',
        content: initialContent,
        media: campaign.media || '',
        segments: (campaign.audience?.segments || []).map((s) => (typeof s === 'string' ? s : (s as { id?: string; _id?: string }).id || (s as { id?: string; _id?: string })._id || '')),
        contacts: (campaign.audience?.contacts || []).map((c) => (typeof c === 'string' ? c : (c as { id?: string; _id?: string }).id || (c as { id?: string; _id?: string })._id || '')),
        lists: (campaign.audience?.lists || []).map((l) => (typeof l === 'string' ? l : (l as { id?: string; _id?: string }).id || (l as { id?: string; _id?: string })._id || '')),
        aiReply: campaign.aiReply || false,
        scheduledAt: campaign.scheduledAt || null,
        channel: 'whatsapp',
        ai_prompt: '',
        mediaFile: null,
      })
      if (campaign.media) {
        setMediaPreview(campaign.media)
        if (campaign.media.startsWith('http') || campaign.media.startsWith('/')) setMediaMode('url')
        else setMediaMode('file')
      }
    }
  }, [campaignData])

  const handleSaveDraft = (values: any) => {
    if (isBrowser) {
      localStorage.setItem(`form-draft-${FORM_NAME}`, JSON.stringify({ ...values, activeStep }))
      toast.success(t('draft_saved'))
    }
  }

  const clearDraft = () => {
    if (isBrowser) {
      localStorage.removeItem(`form-draft-${FORM_NAME}`)
    }
  }

  useEffect(() => {
    return () => {
      // Drafts are kept until explicit submission
    }
  }, [campaignId])

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // Build multipart FormData so the file is sent as binary
      const formData = new FormData()
      // Use content directly without prepending name, as name is sent as a separate field
      const finalContent = values.content || ''
      formData.append('name', values.name)
      formData.append('content', finalContent)
      formData.append('htmlTemplate', finalContent)
      formData.append('channel', 'whatsapp')
      if (values.aiReply !== undefined) formData.append('aiReply', String(values.aiReply))
      if (values.scheduledAt) formData.append('scheduledAt', values.scheduledAt)

      // Preserve existing mediaUrl if no new file is selected
      if (mediaMode === 'url' && values.media) {
        formData.append('mediaUrl', values.media)
      } else if (values.media && !values.mediaFile && !values.media.startsWith('blob:')) {
        formData.append('mediaUrl', values.media)
      }

      ; (values.segments || []).forEach((id) => formData.append('segments[]', id as string))
        ; (values.contacts || []).forEach((id) => formData.append('contacts[]', id as string))
        ; (values.lists || []).forEach((id) => formData.append('lists[]', id as string))

      // Attach the binary file if selected
      if (values.mediaFile instanceof File) {
        formData.append('media', values.mediaFile, values.mediaFile.name)
      }

      if (campaignId) {
        const res = await updateCampaign({ id: campaignId, data: formData }).unwrap()
        toast.success(res.message || t('campaign_updated_successfully'))
      } else {
        const res = await createCampaign(formData).unwrap()
        toast.success(res.message || t('campaign_created_successfully'))
      }
      clearDraft()
      router.push(ROUTES.CAMPAIGN_HUB.BROADCASTS.WHATSAPP)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnhanceAI = async (prompt: string, setFieldValue: (field: string, value: string | null) => void) => {
    if (!prompt) return toast.error(t('please_enter_a_prompt'))
    try {
      const res = await generateContent({ prompt }).unwrap()
      if (res.data) {
        setFieldValue('content', res.data)
        toast.success(res.message || t('content_generated_successfully'))
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_generate_content'))
    }
  }

  const mapToSelectionItems = (data: any[] | undefined) => {
    return (data || []).map((item) => ({
      id: item.id || item._id,
      name: item.name || item.full_name || item.email,
    }))
  }

  if (isLoadingCampaign) return <Spinner className="h-screen" />

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={campaignSchemas.whatsapp(t)}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting, validateForm, setTouched }) => (
        <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-100px)]">
          {/* Header & Subtitle */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all shrink-0"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-5 h-5 text-primary" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight title-color sm:leading-loose">
                    {campaignId ? t('edit_whatsapp_campaign') : t('new_whatsapp_campaign')}
                  </h1>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="lg:hidden w-fit gap-2 hover:bg-primary/10 hover:text-primary transition-all bg-primary/5 border-primary/20 rounded-full h-9 px-5 font-medium"
              onClick={() => setShowPreview(true)}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              {t('visual_simulation', { defaultValue: 'Simulation' })}
            </Button>
          </div>

          <Form
            className="flex flex-col lg:flex-row gap-8 xl:gap-16 items-start"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault()
              }
            }}
          >
            {/* Left: Wizard Side */}
            <div className="flex-1 w-full space-y-8 max-w-5xl">

              {/* Minimal Step Indicator */}
              <div className="py-2 px-1">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-xs font-medium text-primary/90 capitalize tracking-widest leading-none">Step {activeStep + 1} of {steps.length}</p>

                  <p className="text-base font-medium tracking-tight text-title-color dark:text-white">{steps[activeStep]}</p>
                </div>
                <div className="flex gap-2 w-full h-1.5">
                  {steps.map((_, i) => (
                    <div key={i} className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= activeStep ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                  ))}
                </div>
              </div>

              <div className="min-h-[450px]">
                {/* Step 1: Campaign Details (Title + Content) merged */}
                {activeStep === 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <div className="glass-card glass-dark-card p-4 sm:p-6 rounded-border-radius space-y-8 border-none">
                      {/* Title */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="name" className="text-base font-medium dark:text-zinc-100">{t('campaign_name', { defaultValue: 'Campaign Name' })}</Label>
                          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium capitalize tracking-wider">Required</span>
                        </div>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t('enter_campaign_name', { defaultValue: 'Enter a name for your campaign...' })}
                          value={values.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('name', e.target.value)}
                          className={`h-12 text-base rounded-[8px] border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-primary/20  ${touched.name && errors.name ? 'border-destructive/50 ring-destructive/10' : ''}`}
                        />
                        {touched.name && errors.name && <p className="text-xs text-destructive font-medium flex items-center gap-1"><X className="w-3 h-3" /> {errors.name as string}</p>}
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="content" className="text-base font-medium dark:text-zinc-100">{t('your_message', { defaultValue: 'Your Message' })}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 px-5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 flex items-center gap-2 font-bold transition-all group"
                            onClick={() => handleEnhanceAI(values.content || values.name, setFieldValue)}
                            disabled={isGenerating || !values.content?.trim()}
                          >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {t('ai_improve', { defaultValue: 'Improve with AI' })}
                          </Button>
                        </div>
                        <Textarea
                          id="content"
                          name="content"
                          placeholder={t('write_your_message_here', { defaultValue: 'Write your message here...' })}
                          value={values.content}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFieldValue('content', e.target.value)}
                          className={`min-h-[180px] text-base leading-relaxed p-5 rounded-[8px] border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-primary/20 bg-white/50 dark:bg-black/10 ${touched.content && errors.content ? 'border-destructive/50 ring-destructive/10' : ''
                            }`}
                        />
                        {touched.content && errors.content && (
                          <p className="text-xs text-destructive font-medium">{errors.content as string}</p>
                        )}
                      </div>

                      <div >
                        <CampaignMediaUpload
                          mediaMode={mediaMode}
                          setMediaMode={setMediaMode}
                          mediaPreview={mediaPreview}
                          setMediaPreview={setMediaPreview}
                          mediaFile={values.mediaFile}
                          setFieldValue={setFieldValue}
                          mediaValue={values.media || ''}
                          t={t}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Audience */}
                {activeStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="glass-card glass-dark-card p-6 sm:p-8 rounded-[2rem] space-y-8 border-none bg-white/40 dark:bg-black/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SelectionList
                          title={t('contact_groups', { defaultValue: 'Contact Groups' })}
                          items={mapToSelectionItems(contactListsData?.lists)}
                          selectedIds={values.lists || []}
                          onSelectionChange={(ids) => setFieldValue('lists', ids)}
                          emptyMessage={t('no_groups_found', { defaultValue: 'No contact groups found.' })}
                          selectionLabel={t('selected')}
                        />
                        <SelectionList
                          title={t('individual_contacts', { defaultValue: 'Individual Contacts' })}
                          items={mapToSelectionItems(contactsData?.contacts)}
                          selectedIds={values.contacts || []}
                          onSelectionChange={(ids) => setFieldValue('contacts', ids)}
                          emptyMessage={t('no_contacts_found', { defaultValue: 'No contacts available.' })}
                          selectionLabel={t('selected')}
                        />
                      </div>
                      {(touched.segments || touched.contacts || touched.lists) &&
                        (errors.segments || errors.contacts || errors.lists) && (
                          <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20 animate-pulse">
                            <p className="text-sm text-destructive text-center font-medium">
                              {(errors.contacts as string) || (errors.segments as string) || (errors.lists as string)}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Step 3: Settings & Scheduling */}
                {activeStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="glass-card glass-dark-card p-6 sm:p-8 rounded-[2rem] space-y-10 border-none bg-white/40 dark:bg-black/20">
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="space-y-1">
                          <Label className="text-base font-bold flex items-center gap-2">
                            {t('auto_reply_assistant', { defaultValue: 'Auto-Reply Assistant' })}
                            <div className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black tracking-widest">BETA</div>
                          </Label>
                          <p className="text-xs text-zinc-500 max-w-[280px] font-medium leading-relaxed">{t('auto_reply_desc', { defaultValue: 'Let AI automatically reply to customer messages based on your business info.' })}</p>
                        </div>
                        <Switch
                          checked={values.aiReply}
                          onCheckedChange={(checked: boolean) => setFieldValue('aiReply', checked)}
                          className="data-[state=checked]:bg-primary scale-110"
                        />
                      </div>

                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <CampaignScheduler scheduledAt={values.scheduledAt} setFieldValue={setFieldValue} t={t} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimal Navigation Buttons */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  className={`rounded-[8px] inner-card glass-dark-card px-8 h-12 text-zinc-500 hover:text-zinc-900 transition-all font-medium tracking-tight gap-2 ${activeStep === 0 ? 'invisible' : ''}`}
                  onClick={prevStep}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('back', { defaultValue: 'Back' })}
                </Button>

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="rounded-full h-12 border-primary/20 text-black dark:text-white glass-button hover:bg-primary/5 transition-all font-medium text-base flex items-center justify-center gap-2"
                    onClick={() => handleSaveDraft(values)}
                  >
                    <Save className="w-4 h-4" />
                    {t('save_draft')}
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button
                      key="next-btn"
                      type="button"
                      size="lg"
                      className="rounded-full h-12 btn-color text-white transition-all font-medium text-base flex items-center justify-center gap-2 group"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNext(validateForm, setTouched, values)
                      }}
                    >
                      {t('next', { defaultValue: 'Next' })}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      key="submit-btn"
                      type="button"
                      size="lg"
                      className="rounded-full h-12 btn-color text-white transition-all hover:-translate-y-1 active:translate-y-0 font-medium text-base flex items-center justify-center gap-3"
                      disabled={isSubmitting || isCreating || isUpdating}
                      onClick={() => handleSubmit(values, { setSubmitting: () => { } } as unknown as FormikHelpers<FormValues>)}
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : t('send_now', { defaultValue: 'Send Broadcast' })}
                      {!isSubmitting && <ChevronRight className="w-5 h-5 opacity-70" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Sticky Preview Panel (Persistent) */}
            <div className="hidden lg:block lg:w-[420px] xl:w-[480px] shrink-0 lg:sticky lg:top-24">
              <div className="relative glass-card glass-dark-card rounded-border-radius p-5 flex flex-col items-center justify-center min-h-[740px] border-none">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-40" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  <WhatsAppPreview values={values} mediaPreview={mediaPreview} t={t} />
                  <div className="mt-12 space-y-1.5 text-center px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-medium capitalize">{t('visual_simulator', { defaultValue: 'Visual Simulator' })}</span>
                    </div>
                    <p className="text-xs text-subtitle-color font-medium leading-relaxed mt-2">{t('sync_description', { defaultValue: 'Every creative adjustment is rendered instantly in the simulation.' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogPortal>
                <DialogOverlay className="z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg animate-in fade-in duration-300" />
                <DialogContent className="z-51 border-none bg-transparent shadow-none p-0 max-w-none w-full h-full flex items-center justify-center focus:outline-none focus-visible:outline-none overflow-hidden">
                  <DialogTitle className="sr-only">{t('whatsapp_campaign_preview', { defaultValue: 'WhatsApp Campaign Preview' })}</DialogTitle>
                  <div className="relative flex flex-col items-center justify-center w-full h-full p-6">
                    <div className="relative flex items-center justify-center transition-transform duration-300 ease-in-out transform-gpu scale-95 max-h-[90vh]">
                      <div className="overflow-visible">
                        <WhatsAppPreview values={values} mediaPreview={mediaPreview} t={t} />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default WhatsAppCampaignForm