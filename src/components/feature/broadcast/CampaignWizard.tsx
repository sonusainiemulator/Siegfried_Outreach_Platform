'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { steps } from '@/data/campaign'
import { useCreateCampaignMutation, useGetCampaignQuery, useUpdateCampaignMutation } from '@/redux/api/campaignApi'
import { ApiError, CampaignInput, CampaignWizardProps } from '@/types'
import { isBrowser } from '@/utils/environment'
import { campaignSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import StepAudience from './wizard/StepAudience'
import StepContent from './wizard/StepContent'
import StepDetails from './wizard/StepDetails'
import StepReview from './wizard/StepReview'
import WizardFooter from './wizard/WizardFooter'
import WizardStepper from './wizard/WizardStepper'
const FORM_NAME = 'email-campaign'

const CampaignWizard = ({ campaignId }: CampaignWizardProps) => {
  const { t } = useTranslation()
  const router = useRouter()
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

  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation()
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation()
  const { data: campaignData, isLoading: isLoadingCampaign } = useGetCampaignQuery(campaignId || '', {
    skip: !campaignId,
  })

  const [initialValues, setInitialValues] = useState<CampaignInput & { prompt: string }>(() => {
    // Check for persisted draft if not editing
    if (isBrowser && !campaignId) {
      const saved = localStorage.getItem(`form-draft-${FORM_NAME}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            name: '',
            subject: '',
            prompt: '',
            htmlTemplate: '',
            lists: [],
            segments: [],
            contacts: [],
            logic: 'or',
            scheduledAt: null,
            channel: 'email',
            ...parsed,
          }
        } catch (e) {
          console.error('Error parsing persisted email campaign data', e)
        }
      }
    }

    return {
      name: '',
      subject: '',
      prompt: '',
      htmlTemplate: '',
      lists: [],
      segments: [],
      contacts: [],
      logic: 'or',
      scheduledAt: null,
      channel: 'email',
    }
  })

  const [prevCampaignData, setPrevCampaignData] = useState(campaignData)
  if (campaignData !== prevCampaignData) {
    setPrevCampaignData(campaignData)
    if (campaignData?.data) {
      const campaign = campaignData.data
      setInitialValues({
        name: campaign.name,
        subject: campaign.subject,
        prompt: campaign.prompt || '',
        htmlTemplate: campaign.htmlTemplate,
        lists: (campaign.audience?.lists || []).map((l: any) => (typeof l === 'string' ? l : l.id || l._id)),
        segments: (campaign.audience?.segments || []).map((s: any) => (typeof s === 'string' ? s : s.id || s._id)),
        contacts: (campaign.audience?.contacts || []).map((c: any) => (typeof c === 'string' ? c : c.id || c._id)),
        logic: campaign.audience?.logic || 'or',
        scheduledAt: campaign.scheduledAt || null,
        channel: 'email',
      })
    }
  }

  const isStepValid = (step: number, values: any, errors: any) => {
    switch (step) {
      case 0: // Details step
        return !errors.name && !errors.subject && values.name && values.subject
      case 1: // Audience step
        return true
      case 2: // Content step
        return !!values.htmlTemplate
      case 3: // Review step
        return true
      default:
        return false
    }
  }

  const handleNext = async (validateForm: any, setTouched: any, values: any) => {
    const errors = await validateForm()

    let isValid = true
    if (activeStep === 0) {
      if (errors.name || errors.subject) {
        setTouched({ name: true, subject: true })
        isValid = false
      }
    } else if (activeStep === 1) {
      // Audience is optional now
      isValid = true
    } else if (activeStep === 2) {
      if (errors.htmlTemplate) {
        setTouched({ htmlTemplate: true })
        isValid = false
      }
    }

    if (isValid) {
      setActiveStep((prev: number) => Math.min(prev + 1, steps.length - 1))
    } else {
      console.log('Step validation failed:', errors)
    }
  }

  const handleBack = () => {
    setActiveStep((prev: number) => Math.max(prev - 1, 0))
  }

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
      // No longer clearing on unmount, we keep drafts until explicit submission
    }
  }, [campaignId])

  const handleSubmit = async (values: CampaignInput) => {
    try {
      if (campaignId) {
        const res = await updateCampaign({ id: campaignId, data: values }).unwrap()
        toast.success(res.message || t('campaign_updated_successfully'))
      } else {
        const res = await createCampaign(values).unwrap()
        toast.success(res.message || t('campaign_created_successfully'))
      }
      clearDraft()
      router.push(ROUTES.CAMPAIGN_HUB.BROADCASTS.EMAIL)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  if (isLoadingCampaign) {
    return <Spinner className="h-100" size="md" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <div className="flex items-start flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-title-color dark:text-white title-color">
            {t('create_new_campaign')}
          </h1>
        </div>
        <div className="ml-auto">
          <CreditLimitPill />
        </div>
      </div>
      <WizardStepper steps={steps} activeStep={activeStep} />

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={campaignSchemas.create(t)}
        onSubmit={(values) => {
          console.log('Formik onSubmit called with values:', values)
          handleSubmit(values)
        }}
      >
        {({ values, validateForm, setTouched, errors, isSubmitting: formikIsSubmitting }) => {
          return (
            <Form className="space-y-6">
              <Card>
                {activeStep === 0 && <StepDetails />}
                {activeStep === 1 && <StepAudience />}
                {activeStep === 2 && <StepContent />}
                {activeStep === 3 && <StepReview />}

                <WizardFooter
                  activeStep={activeStep}
                  totalSteps={steps.length}
                  onNext={() => handleNext(validateForm, setTouched, values)}
                  onBack={handleBack}
                  isNextDisabled={!isStepValid(activeStep, values, errors)}
                  isSubmitting={isCreating || isUpdating || formikIsSubmitting}
                  onSaveDraft={() => handleSaveDraft(values)}
                />
              </Card>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default CampaignWizard
