'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingApi'
import { ApiError, ApiIntegrationForm } from '@/types'
import { Form, Formik } from 'formik'
import { ArrowLeft, Key, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AdminAiModelsCard from './api/AdminAiModelsCard'
import DallE3ImageCard from './api/DallE3ImageCard'
import DefaultAiProviderCard from './api/DefaultAiProviderCard'
import GeminiCard from './api/GeminiCard'
import GrokCard from './api/GrokCard'
import GroqCard from './api/GroqCard'
import HeyGenCard from './api/HeyGenCard'
import HuggingFaceCard from './api/HuggingFaceCard'
import ImagenCard from './api/ImagenCard'
import OpenRouterCard from './api/OpenRouterCard'
import RemotionVideoCard from './api/RemotionVideoCard'
import StableDiffusionCard from './api/StableDiffusionCard'
import WinstonAiCard from './api/WinstonAiCard'

const ApiIntegration = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: userData, isLoading: isFetching } = useGetUserSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation()

  const currentValues: ApiIntegrationForm = {
    huggingface_api_key: userData?.setting?.huggingface_api_key || '',
    winston_api_key: userData?.setting?.winston_api_key || '',
    gemini_api_key: userData?.setting?.gemini_api_key || '',
    openai_api_key: userData?.setting?.openai_api_key || '',
    groq_api_key: userData?.setting?.groq_api_key || '',
    openrouter_api_key: userData?.setting?.openrouter_api_key || '',
    grok_api_key: userData?.setting?.grok_api_key || '',
    stable_diffusion_api_key: userData?.setting?.stable_diffusion_api_key || '',
    aiProvider: userData?.setting?.aiProvider || 'gemini',
    openai_image_api_key: userData?.setting?.openai_image_api_key || '',
    openai_image_quality: userData?.setting?.openai_image_quality || 'standard',
    openai_image_style: userData?.setting?.openai_image_style || 'vivid',
    heygen_api_key: userData?.setting?.heygen_api_key || '',
    heygen_avatar_id: userData?.setting?.heygen_avatar_id || 'josh_lite_20230714',
    heygen_voice_id: userData?.setting?.heygen_voice_id || 'en-US-JennyNeural',
    imagen_api_key: userData?.setting?.imagen_api_key || '',
    remotion_render_url: userData?.setting?.remotion_render_url || '',
    default_image_provider: userData?.setting?.default_image_provider || 'dall-e-3',
    default_video_provider: userData?.setting?.default_video_provider || 'heygen',
  }

  const onSubmit = async (values: ApiIntegrationForm) => {
    try {
      const res = await updateSettings(values).unwrap()
      toast.success(
        res.message || t('api_keys_updated_successfully', { defaultValue: 'API keys updated successfully' }),
      )
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_api_keys', { defaultValue: 'Failed to update API keys' }))
    }
  }

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="h-auto" size="md" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-[1600px] mx-auto">
      <div className="relative  overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>
          <div className="flex items-start flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-title-color dark:text-white title-color">
              {t('api_command_center', { defaultValue: 'API Command Center' })}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Card className="rounded-border-radius glass-dark-card border-border/40 backdrop-blur-3xl overflow-hidden relative">
          <CardHeader className="relative z-10 sm:p-6 p-3 text-center">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div>
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-medium text-title-color dark:text-white">
                  {t('provider_configurations', { defaultValue: 'Provider Configurations' })}
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-medium max-w-2xl text-subtitle-color text-left">
                {t('manage_your_external_identities', {
                  defaultValue: 'Manage your external service identities and access credentials.',
                })}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 sm:p-6 p-4">
            <Formik initialValues={currentValues} enableReinitialize onSubmit={onSubmit}>
              {({ dirty }) => (
                <Form className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-0">
                    <DefaultAiProviderCard />
                    <GeminiCard />
                    <GroqCard />
                    <OpenRouterCard />
                    <GrokCard />
                    <DallE3ImageCard />
                    <ImagenCard />
                    <StableDiffusionCard />
                    <HuggingFaceCard />
                    <HeyGenCard />
                    <RemotionVideoCard />
                    <WinstonAiCard />
                    <AdminAiModelsCard />
                  </div>

                  <div className="flex justify-end pt-6 border-t border-border/10">
                    <Button
                      type="submit"
                      disabled={isUpdating || !dirty}
                      className="rounded-border-radius sm:h-12 h-10 btn-color text-white p-button-padding font-medium text-sm gap-2 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer"
                    >
                      {isUpdating ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-6 h-6" />}
                      {t('sync_credentials')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApiIntegration

