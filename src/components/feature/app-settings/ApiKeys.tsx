'use client'

import React, { useState } from 'react'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingApi'
import { ApiError, ApiIntegrationForm } from '@/types'
import { Form, Formik } from 'formik'
import {
  ArrowLeft,
  Key,
  Loader2,
  Save,
  Video,
  Mic,
  Sparkles,
  Search,
  Filter,
  Layers,
  Coins,
  CheckCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

import AdminAiModelsCard from './api/AdminAiModelsCard'
import DallE3ImageCard from './api/DallE3ImageCard'
import DefaultAiProviderCard from './api/DefaultAiProviderCard'
import DefaultMediaEnginesCard from './api/DefaultMediaEnginesCard'
import ElevenLabsCard from './api/ElevenLabsCard'
import GeminiCard from './api/GeminiCard'
import GeminiOmniCard from './api/GeminiOmniCard'
import GoogleVeoCard from './api/GoogleVeoCard'
import GrokCard from './api/GrokCard'
import GroqCard from './api/GroqCard'
import HeyGenCard from './api/HeyGenCard'
import HiggsfieldCard from './api/HiggsfieldCard'
import HuggingFaceCard from './api/HuggingFaceCard'
import ImagenCard from './api/ImagenCard'
import KlingVideoCard from './api/KlingVideoCard'
import MiniMaxHailuoCard from './api/MiniMaxHailuoCard'
import OpenRouterCard from './api/OpenRouterCard'
import RemotionVideoCard from './api/RemotionVideoCard'
import SeedanceVideoCard from './api/SeedanceVideoCard'
import StableDiffusionCard from './api/StableDiffusionCard'
import WinstonAiCard from './api/WinstonAiCard'

type CategoryKey = 'all' | 'video' | 'voice' | 'llm' | 'image' | 'pricing'

const ApiIntegration = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    default_video_provider: userData?.setting?.default_video_provider || 'seedance',
    default_voice_provider: userData?.setting?.default_voice_provider || 'elevenlabs',

    // ElevenLabs Voice & Dubbing
    elevenlabs_api_key: userData?.setting?.elevenlabs_api_key || '',
    elevenlabs_voice_id: userData?.setting?.elevenlabs_voice_id || '21m00Tcm4TlvDq8ikWAM',
    elevenlabs_model_id: userData?.setting?.elevenlabs_model_id || 'eleven_multilingual_v2',

    // Higgsfield Cinematic Video
    higgsfield_api_key: userData?.setting?.higgsfield_api_key || '',
    higgsfield_model: userData?.setting?.higgsfield_model || 'higgsfield-cinematic-1',

    // Seedance 2.0 Video AI (Realistic physics, fight choreography, reference handling)
    seedance_api_key: userData?.setting?.seedance_api_key || '',
    seedance_model: userData?.setting?.seedance_model || 'seedance-2.0-pro',
    seedance_reference_mode: userData?.setting?.seedance_reference_mode || 'audio-video-reference',

    // Kling Video 3.0 Pro (Multi-shot sequencing up to 6 camera cuts, cinematic physics)
    kling_api_key: userData?.setting?.kling_api_key || '',
    kling_model: userData?.setting?.kling_model || 'kling-v3.0-pro',
    kling_multi_shot: userData?.setting?.kling_multi_shot !== undefined ? userData?.setting?.kling_multi_shot : true,

    // Google Veo 3.1 (Photorealistic people, fast iteration speeds, native audio)
    veo_api_key: userData?.setting?.veo_api_key || '',
    veo_model: userData?.setting?.veo_model || 'veo-3.1-cinema',
    veo_native_audio: userData?.setting?.veo_native_audio !== undefined ? userData?.setting?.veo_native_audio : true,

    // Gemini Omni Flash (Budget-friendly multimodal, voice quality, low credit cost)
    gemini_omni_api_key: userData?.setting?.gemini_omni_api_key || '',
    gemini_omni_model: userData?.setting?.gemini_omni_model || 'gemini-2.0-flash',

    // MiniMax Hailuo 2.3 (Product shots, animation, expressive character movements)
    hailuo_api_key: userData?.setting?.hailuo_api_key || '',
    hailuo_model: userData?.setting?.hailuo_model || 'hailuo-2.3-turbo',
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

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim())
  }

  const categories = [
    { id: 'all' as CategoryKey, label: 'All Providers', count: 21, icon: Layers },
    { id: 'video' as CategoryKey, label: 'Cinematic Video AI', count: 7, icon: Video },
    { id: 'voice' as CategoryKey, label: 'Voice & Dubbing', count: 2, icon: Mic },
    { id: 'llm' as CategoryKey, label: 'LLMs & Multimodal', count: 5, icon: Sparkles },
    { id: 'image' as CategoryKey, label: 'Image Synthesis', count: 4, icon: Key },
    { id: 'pricing' as CategoryKey, label: 'Pricing Matrix', count: 1, icon: Coins },
  ]

  return (
    <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9 cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>
          <div className="flex items-start flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-title-color dark:text-white title-color">
                {t('api_command_center', { defaultValue: 'API Command Center' })}
              </h1>
              <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary uppercase">
                Next-Gen Multi-Modal AI
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Configure external AI providers across Video Physics, Cinematic Cameras, Ultra-Realistic Voice, and Multimodal LLMs.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search provider (e.g. Seedance, Kling, ElevenLabs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-xs bg-background/60 border border-border/60 focus:outline-hidden focus:border-primary transition-all text-foreground"
          />
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'bg-background/60 hover:bg-background border border-border/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {cat.count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="w-full">
        <Card className="rounded-border-radius glass-dark-card border-border/40 backdrop-blur-3xl overflow-hidden relative">
          <CardHeader className="relative z-10 sm:p-6 p-4 text-center border-b border-border/10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-medium text-title-color dark:text-white">
                  {t('provider_configurations', { defaultValue: 'Provider Configurations & Credentials' })}
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-medium max-w-3xl text-subtitle-color text-left">
                {t('manage_your_external_identities', {
                  defaultValue: 'Store API keys securely for auto-generating social videos, voice dubbing, AI avatars, and multi-shot reels.',
                })}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 sm:p-6 p-4">
            <Formik initialValues={currentValues} enableReinitialize onSubmit={onSubmit}>
              {({ dirty }) => (
                <Form className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-0">
                    {/* Routing Defaults */}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('default ai provider') && (
                      <DefaultAiProviderCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video' || selectedCategory === 'voice') && matchesSearch('default media engines routing video voice image') && (
                      <DefaultMediaEnginesCard />
                    )}

                    {/* Cutting Edge Video AI Providers */}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('seedance 2.0 physics fight choreography video') && (
                      <SeedanceVideoCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('kling video 3.0 pro multi-shot cuts sequencing') && (
                      <KlingVideoCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('google veo 3.1 deepmind photorealistic people audio') && (
                      <GoogleVeoCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('minimax hailuo 2.3 product shots character motion') && (
                      <MiniMaxHailuoCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('higgsfield ai cinematic camera dop controls') && (
                      <HiggsfieldCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('heygen video sdk talking avatars') && (
                      <HeyGenCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'video') && matchesSearch('remotion video engine kinetic reels') && (
                      <RemotionVideoCard />
                    )}

                    {/* Audio & Voice Synthesis */}
                    {(selectedCategory === 'all' || selectedCategory === 'voice') && matchesSearch('elevenlabs voice cloning dubbing audio speech') && (
                      <ElevenLabsCard />
                    )}

                    {/* LLMs & Multimodal */}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('gemini omni flash budget voice multimodal') && (
                      <GeminiOmniCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('gemini google deepmind') && (
                      <GeminiCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('groq ultra fast llama') && (
                      <GroqCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('openrouter hub models') && (
                      <OpenRouterCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('grok xai') && (
                      <GrokCard />
                    )}

                    {/* Image Generation */}
                    {(selectedCategory === 'all' || selectedCategory === 'image') && matchesSearch('dall-e 3 gpt-4o image openai') && (
                      <DallE3ImageCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'image') && matchesSearch('imagen 3.0 google') && (
                      <ImagenCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'image') && matchesSearch('stable diffusion sdxl') && (
                      <StableDiffusionCard />
                    )}
                    {(selectedCategory === 'all' || selectedCategory === 'image') && matchesSearch('huggingface open source') && (
                      <HuggingFaceCard />
                    )}

                    {/* Safety & Compliance */}
                    {(selectedCategory === 'all' || selectedCategory === 'llm') && matchesSearch('winston ai detection plagiarism') && (
                      <WinstonAiCard />
                    )}

                    {/* Pricing Matrix */}
                    {(selectedCategory === 'all' || selectedCategory === 'pricing') && matchesSearch('admin ai models pricing matrix credits') && (
                      <AdminAiModelsCard />
                    )}
                  </div>

                  {/* Submit Floating Bottom Action Bar */}
                  <div className="sticky bottom-4 z-20 flex justify-between items-center bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-border/40 shadow-xl">
                    <div className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Credentials will be encrypted and saved securely across all cloud workers.</span>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <Button
                        type="submit"
                        disabled={isUpdating || !dirty}
                        className="rounded-border-radius sm:h-11 h-10 btn-color text-white px-6 font-semibold text-xs gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shadow-md shadow-primary/20"
                      >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                        {t('sync_credentials', { defaultValue: 'Save & Sync Credentials' })}
                      </Button>
                    </div>
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
