'use client'

import React, { useState } from 'react'
import {
  useGetAvatarOptionsQuery,
  useGetAvatarHistoryQuery,
  useGenerateInfluencerMutation,
  useGenerateInfluencerVariationsMutation,
  AvatarItem
} from '@/redux/api/avatarApi'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { Card } from '@/components/ui/card'
import {
  UserCheck,
  RefreshCw,
  Camera,
  Check,
  Zap,
  Sliders
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AvatarPreviewModal } from './AvatarPreviewModal'

interface InfluencerStudioProps {
  onUseInVideo?: (item: AvatarItem) => void
}

const ETHNICITY_OPTIONS = [
  { id: '', label: 'Default / Any' },
  { id: 'Caucasian', label: 'Caucasian' },
  { id: 'Latina', label: 'Latina' },
  { id: 'East Asian', label: 'East Asian' },
  { id: 'South Asian', label: 'South Asian' },
  { id: 'African / Black', label: 'African / Black' },
  { id: 'Middle Eastern', label: 'Middle Eastern' },
  { id: 'Scandinavian', label: 'Scandinavian' }
]

const HAIR_STYLES = [
  { id: '', label: 'Natural / Sleek' },
  { id: 'long wavy brunette', label: 'Long Wavy Brunette' },
  { id: 'blonde beach waves', label: 'Blonde Beach Waves' },
  { id: 'sleek straight black', label: 'Sleek Straight Black' },
  { id: 'short textured bob', label: 'Short Textured Bob' },
  { id: 'curled voluminous', label: 'Curled & Voluminous' }
]

export const InfluencerStudio: React.FC<InfluencerStudioProps> = ({ onUseInVideo }) => {
  const { data: optionsData } = useGetAvatarOptionsQuery()
  const { data: historyData } = useGetAvatarHistoryQuery({ type: 'influencer', limit: 20 })
  const [generateInfluencer, { isLoading: isGeneratingInfluencer }] = useGenerateInfluencerMutation()
  const [generateVariations, { isLoading: isGeneratingVariation }] = useGenerateInfluencerVariationsMutation()

  const [influencerName, setInfluencerName] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('fashion-lifestyle')
  const [ethnicity, setEthnicity] = useState('')
  const [gender, setGender] = useState('female')
  const [hairStyle, setHairStyle] = useState('')
  const [eyeColor, setEyeColor] = useState('')
  const [customDetails, setCustomDetails] = useState('')
  const [aspectRatio, setAspectRatio] = useState('9:16')

  const [selectedInfluencer, setSelectedInfluencer] = useState<AvatarItem | null>(null)
  const [selectedSceneId, setSelectedSceneId] = useState('paris-street')
  const [customScenePrompt, setCustomScenePrompt] = useState('')

  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<AvatarItem | null>(null)

  const niches = optionsData?.influencerNiches || []
  const variationScenes = optionsData?.variationScenes || []
  const influencers = historyData?.data || []

  const handleCreateInfluencer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await generateInfluencer({
        name: influencerName.trim() || undefined,
        niche: selectedNiche,
        ethnicity,
        gender,
        hairStyle,
        eyeColor,
        customDetails: customDetails.trim() || undefined,
        aspectRatio
      }).unwrap()

      toast.success(res.message || 'AI Influencer model created!')
      setSelectedInfluencer(res.data)
      setPreviewItem(res.data)
      setPreviewModalOpen(true)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate AI influencer')
    }
  }

  const handleGenerateVariation = async () => {
    if (!selectedInfluencer) {
      toast.error('Please select an AI Influencer model first')
      return
    }

    try {
      const res = await generateVariations({
        influencerId: selectedInfluencer._id,
        sceneId: selectedSceneId,
        customScenePrompt: customScenePrompt.trim() || undefined,
        aspectRatio: '9:16'
      }).unwrap()

      toast.success(res.message || 'New scene variation generated!')
      if (selectedInfluencer) {
        setSelectedInfluencer({
          ...selectedInfluencer,
          images: [...(selectedInfluencer.images || []), res.data.imageUrl]
        })
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate variation')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Persona Form */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        <form onSubmit={handleCreateInfluencer} className="space-y-6">
          <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm space-y-4">
            <Label className="text-sm font-bold text-title-color flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Influencer Persona &amp; Niche
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Model Name (Optional)</Label>
                <Input
                  value={influencerName}
                  onChange={(e) => setInfluencerName(e.target.value)}
                  placeholder="e.g. Sophia Vance"
                  className="h-10 inner-card rounded-[8px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Gender</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] inner-card border border-glass-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Label className="text-xs font-medium text-subtitle-color block">Select Content Niche</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {niches.map((niche) => {
                  const isSelected = selectedNiche === niche.id
                  return (
                    <button
                      key={niche.id}
                      type="button"
                      onClick={() => setSelectedNiche(niche.id)}
                      className={cn(
                        'p-3 rounded-[8px] border text-left transition-all cursor-pointer flex flex-col justify-between',
                        isSelected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-xs'
                          : 'border-glass-border inner-card hover:border-primary/40'
                      )}
                    >
                      <span className="text-xs font-bold text-title-color block">{niche.name}</span>
                      <span className="text-[10px] text-subtitle-color line-clamp-2 mt-1">{niche.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-5 md:p-6 shadow-sm space-y-4">
            <Label className="text-sm font-bold text-title-color flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Facial &amp; Aesthetic Appearance
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Ethnicity</Label>
                <select
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] inner-card border border-glass-border text-xs"
                >
                  {ETHNICITY_OPTIONS.map((eth) => (
                    <option key={eth.id} value={eth.id}>{eth.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Hair Style</Label>
                <select
                  value={hairStyle}
                  onChange={(e) => setHairStyle(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] inner-card border border-glass-border text-xs"
                >
                  {HAIR_STYLES.map((h) => (
                    <option key={h.id} value={h.id}>{h.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-subtitle-color">Eye Color</Label>
                <Input
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value)}
                  placeholder="e.g. Emerald Green"
                  className="h-10 inner-card rounded-[8px] text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-medium text-subtitle-color">Custom Aesthetic Details</Label>
              <Textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="e.g. Subtle freckles, designer sunglasses, luxury gold jewelry..."
                rows={2}
                className="inner-card rounded-[8px] text-xs p-3"
              />
            </div>
          </Card>

          <Button
            type="submit"
            disabled={isGeneratingInfluencer}
            className="w-full h-12 rounded-[8px] text-sm font-bold uppercase tracking-wider btn-color text-white shadow-md cursor-pointer transition-all gap-2"
          >
            {isGeneratingInfluencer ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating AI Influencer Model...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                Generate AI Influencer Model (1 Credit)
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Right: Scene Variations Stage */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-6">
        <Card className="rounded-border-radius inner-card glass-dark-card border border-glass-border p-4 md:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-glass-border">
            <h3 className="font-bold text-xs uppercase tracking-wider text-title-color flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-primary" />
              Scene Variations
            </h3>
            {selectedInfluencer && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {selectedInfluencer.metadata?.name || 'Active Model'}
              </span>
            )}
          </div>

          <div>
            <Label className="text-xs font-medium text-subtitle-color block mb-2">Choose Model:</Label>
            {influencers.length === 0 ? (
              <div className="p-4 rounded-[8px] inner-card text-center border border-dashed border-glass-border">
                <p className="text-xs text-subtitle-color">
                  Generate your first model on the left to unlock scene variations!
                </p>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {influencers.map((inf) => {
                  const isSelected = selectedInfluencer?._id === inf._id
                  return (
                    <div
                      key={inf._id}
                      onClick={() => setSelectedInfluencer(inf)}
                      className={cn(
                        'w-16 shrink-0 rounded-[8px] border p-1 text-center cursor-pointer transition-all',
                        isSelected ? 'border-primary ring-2 ring-primary/40' : 'border-glass-border'
                      )}
                    >
                      <div className="aspect-[9/16] rounded-[6px] overflow-hidden relative mb-1">
                        <img src={inf.content} alt={inf.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-bold text-title-color block truncate">
                        {inf.metadata?.name?.split(' ')[0] || 'Model'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {selectedInfluencer && (
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-medium text-subtitle-color block">Select Scene / Setting:</Label>
              <div className="grid grid-cols-2 gap-2">
                {variationScenes.map((scene) => {
                  const isSelected = selectedSceneId === scene.id
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedSceneId(scene.id)}
                      className={cn(
                        'p-2 rounded-[6px] border text-left transition-all cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/10 font-bold text-title-color ring-1 ring-primary'
                          : 'border-glass-border inner-card text-subtitle-color hover:border-primary/40'
                      )}
                    >
                      <span className="text-[11px] block font-bold text-title-color">{scene.name}</span>
                    </button>
                  )
                })}
              </div>

              <Button
                onClick={handleGenerateVariation}
                disabled={isGeneratingVariation}
                className="w-full mt-2 rounded-[8px] btn-color text-white font-bold h-9 text-xs gap-1.5 cursor-pointer"
              >
                {isGeneratingVariation ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Rendering Variation...
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    Render in this Scene
                  </>
                )}
              </Button>

              {selectedInfluencer.images && selectedInfluencer.images.length > 0 && (
                <div className="pt-2 border-t border-glass-border">
                  <Label className="text-[11px] font-medium text-subtitle-color block mb-1.5">
                    Gallery ({selectedInfluencer.images.length} photos):
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {selectedInfluencer.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setPreviewItem({
                            ...selectedInfluencer,
                            content: imgUrl
                          })
                          setPreviewModalOpen(true)
                        }}
                        className="aspect-[9/16] rounded-[6px] overflow-hidden border border-glass-border group relative cursor-pointer"
                      >
                        <img src={imgUrl} alt="Variation" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <AvatarPreviewModal
        item={previewItem}
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        onUseInVideo={onUseInVideo}
      />
    </div>
  )
}
