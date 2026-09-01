'use client'

import React, { useState } from 'react'
import {
  Video as VideoIcon,
  Sparkles,
  ShoppingBag,
  UserCheck,
  History,
  Palette,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/reusable/PageHeader'
import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { HeroVideoBanner } from './HeroVideoBanner'
import { HowItWorksCard } from './HowItWorksCard'
import { TalkingVideoStudio } from './TalkingVideoStudio'
import { InfluencerStudio } from './InfluencerStudio'
import { ProductShowcaseStudio } from './ProductShowcaseStudio'
import { AvatarImageCreator } from './AvatarImageCreator'
import { AvatarItem } from '@/redux/api/avatarApi'
import { useTranslation } from 'react-i18next'

export const AIAvatarStudio: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'video' | 'influencer' | 'product' | 'image'>('video')
  const [selectedAvatarForVideo, setSelectedAvatarForVideo] = useState<AvatarItem | null>(null)

  const handleUseInVideo = (item: AvatarItem) => {
    setSelectedAvatarForVideo(item)
    setActiveTab('video')
  }

  const tabs = [
    { id: 'video', label: 'AI Talking Video', icon: VideoIcon },
    { id: 'influencer', label: 'AI Influencer Creator', icon: UserCheck },
    { id: 'product', label: 'Product Showcase Videos', icon: ShoppingBag },
    { id: 'image', label: 'Avatar Portrait Studio', icon: Palette },
  ]

  return (
    <div className="flex-1 flex flex-col h-full relative w-full space-y-6 pb-12">
      {/* Top Standard Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageHeader
          title={t('ai_avatar_studio', { defaultValue: 'AI Avatar & Video Studio' })}
          subtitle={t('ai_avatar_desc', {
            defaultValue: 'Create realistic talking videos, consistent AI influencer personas, and marketing ads.',
          })}
          showBackButton={true}
        />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.AI_AVATAR_HISTORY)}
            className="h-10 px-5 border-none rounded-[8px] btn-color text-white transition-all gap-2 font-medium capitalize text-sm cursor-pointer shadow-sm"
          >
            <History className="w-4 h-4" />
            <span>Asset Gallery</span>
          </Button>
          <CreditLimitPill />
        </div>
      </div>

      {/* Navigation Suite Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-border-radius inner-card glass-dark-card border border-glass-border w-fit overflow-x-auto max-w-full custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-medium text-xs md:text-sm transition-all cursor-pointer shrink-0',
                isActive
                  ? 'btn-color text-white shadow-md'
                  : 'text-subtitle-color hover:text-title-color hover:bg-black/5 dark:hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab: Video Studio (with Hero Banner & How It Works) */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <HeroVideoBanner />
          <HowItWorksCard />
          <TalkingVideoStudio initialAvatar={selectedAvatarForVideo} />
        </div>
      )}

      {/* Tab: AI Influencer Studio */}
      {activeTab === 'influencer' && (
        <InfluencerStudio onUseInVideo={handleUseInVideo} />
      )}

      {/* Tab: Product Showcase Videos */}
      {activeTab === 'product' && (
        <ProductShowcaseStudio />
      )}

      {/* Tab: Avatar Image Portrait Creator */}
      {activeTab === 'image' && (
        <AvatarImageCreator onSwitchToVideoTab={handleUseInVideo} />
      )}
    </div>
  )
}
