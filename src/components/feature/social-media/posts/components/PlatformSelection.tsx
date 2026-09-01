'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { PlatformSelectionProps } from '@/types/components/socialMedia'
import {
  Check,
  CheckSquare,
  Plus,
  Share2,
  Square,
  Sparkles,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

// Official Brand Vector Icons
export const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
  </svg>
)

export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

export const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

export const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

export const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
  </svg>
)

export const PinterestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.393-12-12-12z"/>
  </svg>
)

export const RedditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)

export const WordPressIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.186 12c0-1.335.284-2.604.789-3.752l4.34 11.897A8.834 8.834 0 013.186 12zm8.814 8.814a8.81 8.81 0 01-2.466-.351l2.617-7.604 2.68 7.342a.867.867 0 00.065.127 8.833 8.833 0 01-2.896.486zm1.218-12.945c.531-.028.99-.083.99-.083.47-.056.414-.746-.057-.719 0 0-1.4.11-2.304.11-.849 0-2.278-.11-2.278-.11-.47-.027-.526.69-.056.719 0 0 .432.055.914.083l1.358 3.72-1.91 5.725-3.177-9.445c.531-.028.99-.083.99-.083.47-.056.414-.746-.057-.719 0 0-1.4.11-2.304.11a16.56 16.56 0 01-.533-.017A8.836 8.836 0 0112 3.186c2.294 0 4.396.877 5.964 2.313-.038-.002-.074-.009-.113-.009-1.13 0-1.932.984-1.932 2.04 0 .948.548 1.75 1.132 2.697.442.773.958 1.765.958 3.197 0 .993-.381 2.144-.883 3.752l-1.156 3.861-4.196-12.172zm4.9 11.678l2.658-7.687c.496-1.239.662-2.228.662-3.107 0-.319-.021-.616-.056-.893A8.833 8.833 0 0120.814 12c0 3.21-1.726 6.024-4.296 7.547h-.001z"/>
  </svg>
)

const PLATFORM_CONFIG: Record<string, {
  name: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  activeBorder: string
  activeRing: string
  formats: { id: string; name: string; desc: string; badge?: string }[]
}> = {
  whatsapp: {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
    iconBg: 'bg-[#25D366] text-white',
    activeBorder: 'border-[#25D366]',
    activeRing: 'ring-[#25D366]/30',
    formats: [
      { id: 'channel_post', name: '📢 Channel Broadcast', desc: 'Public/Private WhatsApp Channels', badge: 'High Reach' },
      { id: 'status', name: '🟢 Status (Story)', desc: '24-hour 9:16 vertical story', badge: 'Disappearing' },
    ]
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    iconBg: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white',
    activeBorder: 'border-pink-500',
    activeRing: 'ring-pink-500/30',
    formats: [
      { id: 'post', name: '📸 Feed Post', desc: 'Single Photo / Square / Landscape' },
      { id: 'carousel', name: '🖼️ Carousel Slides', desc: 'Multi-photo swipeable album', badge: 'Engagement' },
      { id: 'reel', name: '🎬 Reel (9:16)', desc: 'Short-form viral video', badge: 'Viral' },
      { id: 'story', name: '⚡ Story (24h)', desc: '24-hour temporary story' },
    ]
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    iconBg: 'bg-[#1877F2] text-white',
    activeBorder: 'border-[#1877F2]',
    activeRing: 'ring-[#1877F2]/30',
    formats: [
      { id: 'post', name: '📰 Page Feed Post', desc: 'Standard photo & status update' },
      { id: 'carousel', name: '🖼️ Multi-Photo Album', desc: 'Grouped image cards' },
      { id: 'story', name: '⚡ Facebook Story', desc: '24-hour story highlight' },
      { id: 'reel', name: '🎬 Facebook Reel', desc: 'Short vertical video' },
    ]
  },
  youtube: {
    name: 'YouTube',
    icon: YouTubeIcon,
    iconBg: 'bg-[#FF0000] text-white',
    activeBorder: 'border-[#FF0000]',
    activeRing: 'ring-[#FF0000]/30',
    formats: [
      { id: 'video', name: '🎥 Standard Video (16:9)', desc: 'Full length HD/4K landscape video' },
      { id: 'shorts', name: '⚡ YouTube Shorts (9:16)', desc: 'Vertical short-form video', badge: 'Shorts Feed' },
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    iconBg: 'bg-[#0A66C2] text-white',
    activeBorder: 'border-[#0A66C2]',
    activeRing: 'ring-[#0A66C2]/30',
    formats: [
      { id: 'post', name: '💼 Professional Feed Post', desc: 'Industry update with image / video' },
      { id: 'carousel', name: '📑 Document / Slide Carousel', desc: 'Multi-slide presentation cards', badge: 'B2B' },
    ]
  },
  twitter: {
    name: 'X (Twitter)',
    icon: TwitterXIcon,
    iconBg: 'bg-black text-white dark:bg-white dark:text-black',
    activeBorder: 'border-neutral-800 dark:border-white',
    activeRing: 'ring-neutral-500/30',
    formats: [
      { id: 'post', name: '𝕏 Standard Post', desc: 'Tweet with media attachments' },
      { id: 'thread', name: '🧵 Multi-Post Thread', desc: 'Connected multi-tweet sequence', badge: 'Long-form' },
    ]
  },
  tiktok: {
    name: 'TikTok',
    icon: TikTokIcon,
    iconBg: 'bg-neutral-900 text-[#00f2fe] border border-[#00f2fe]/30',
    activeBorder: 'border-[#00f2fe]',
    activeRing: 'ring-[#00f2fe]/30',
    formats: [
      { id: 'video', name: '🎵 TikTok Video (9:16)', desc: 'Vertical video with sound sync' },
      { id: 'carousel', name: '📸 Photo Mode Slides', desc: 'Swipeable photo cards with music' },
    ]
  },
  google: {
    name: 'Google Business',
    icon: GoogleIcon,
    iconBg: 'bg-[#4285F4] text-white',
    activeBorder: 'border-[#4285F4]',
    activeRing: 'ring-[#4285F4]/30',
    formats: [
      { id: 'post', name: '📢 What\'s New Update', desc: 'Business announcement & photo' },
      { id: 'offer', name: '🏷️ Promotional Offer', desc: 'Special deal with coupon code', badge: 'Offers' },
    ]
  },
  pinterest: {
    name: 'Pinterest',
    icon: PinterestIcon,
    iconBg: 'bg-[#E60023] text-white',
    activeBorder: 'border-[#E60023]',
    activeRing: 'ring-[#E60023]/30',
    formats: [
      { id: 'pin', name: '📌 Standard Pin (3:4)', desc: 'Vertical image pin' },
      { id: 'idea_pin', name: '💡 Idea Pin / Story', desc: 'Multi-slide video idea pin', badge: 'Idea Pin' },
    ]
  },
  reddit: {
    name: 'Reddit',
    icon: RedditIcon,
    iconBg: 'bg-[#FF4500] text-white',
    activeBorder: 'border-[#FF4500]',
    activeRing: 'ring-[#FF4500]/30',
    formats: [
      { id: 'post', name: '💬 Community Post', desc: 'Subreddit discussion & media' },
    ]
  },
  telegram: {
    name: 'Telegram',
    icon: Send,
    iconBg: 'bg-[#0088cc] text-white',
    activeBorder: 'border-[#0088cc]',
    activeRing: 'ring-[#0088cc]/30',
    formats: [
      { id: 'channel_post', name: '📢 Channel Broadcast', desc: 'Post directly to public/private channels', badge: 'Broadcast' },
      { id: 'post', name: '💬 Group Update', desc: 'Send update message to group chats', badge: 'Interactive' },
    ]
  },
  wordpress: {
    name: 'WordPress',
    icon: WordPressIcon,
    iconBg: 'bg-[#21759B] text-white',
    activeBorder: 'border-[#21759B]',
    activeRing: 'ring-[#21759B]/30',
    formats: [
      { id: 'post', name: '📝 Blog Post', desc: 'Full article with featured image & SEO', badge: 'Blog' },
      { id: 'page', name: '📄 Static Page', desc: 'Standalone published page', badge: 'Page' },
    ]
  }
}

const PlatformSelection = ({
  accounts,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms,
  onDeselectAllPlatforms,
  postTypes,
  onChangePostType,
}: PlatformSelectionProps) => {
  const { t } = useTranslation()

  const allSelected = accounts.length > 0 && selectedPlatforms.length === accounts.length
  const hasVideoPlatforms = accounts.some((a) => ['youtube', 'tiktok'].includes(a.platform.toLowerCase()))
  const hasSocialPlatforms = accounts.some((a) => ['facebook', 'instagram', 'linkedin', 'twitter'].includes(a.platform.toLowerCase()))
  const hasWhatsApp = accounts.some((a) => a.platform.toLowerCase() === 'whatsapp')

  // Multi-format toggle handler
  const handleFormatToggle = (accId: string, platformKey: string, formatId: string) => {
    const current = postTypes?.[accId] || 'default'
    const platformConfig = PLATFORM_CONFIG[platformKey] || PLATFORM_CONFIG.instagram
    const formatIds = platformConfig.formats.map((f) => f.id)

    let currentSelected: string[] = []
    if (current === 'both' || current === 'all') {
      currentSelected = [...formatIds]
    } else if (current === 'default') {
      currentSelected = [formatIds[0]]
    } else if (current.includes(',')) {
      currentSelected = current.split(',').map((s) => s.trim())
    } else {
      currentSelected = [current]
    }

    if (currentSelected.includes(formatId)) {
      if (currentSelected.length > 1) {
        currentSelected = currentSelected.filter((id) => id !== formatId)
      } else {
        // keep at least one format
        return
      }
    } else {
      currentSelected.push(formatId)
    }

    let nextValue: string
    if (currentSelected.length === formatIds.length) {
      nextValue = 'both'
    } else if (currentSelected.length === 1) {
      nextValue = currentSelected[0]
    } else {
      nextValue = currentSelected.join(',')
    }

    onChangePostType?.(accId, nextValue)
  }

  const isFormatActive = (accId: string, platformKey: string, formatId: string, index: number) => {
    const current = postTypes?.[accId]
    if (!current) return index === 0
    if (current === 'both' || current === 'all') return true
    if (current.includes(',')) {
      return current.split(',').map((s) => s.trim()).includes(formatId)
    }
    return current === formatId
  }

  return (
    <Card className="border-border/40 bg-card/40 glass-dark-card backdrop-blur-xl rounded-border-radius overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-medium text-title-color dark:text-white">{t('social_broadcast_hubs', 'Social Platforms')}</h3>
          </div>
          {accounts.length > 0 && (
            <button
              type="button"
              onClick={allSelected ? onDeselectAllPlatforms : () => onSelectAllPlatforms?.(accounts.map((a) => a.id))}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg"
            >
              {allSelected ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5" />
                  {t('deselect_all', 'Deselect All')}
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  {t('select_all', 'Select All')} ({accounts.length})
                </>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-sm font-medium text-subtitle-color">
          <span>{t('social_post_on', 'Post On')}</span>
          {accounts.length > 0 && (
            <span className="text-xs text-muted-foreground font-semibold">
              {selectedPlatforms.length} / {accounts.length} {t('selected', 'Selected')}
            </span>
          )}
        </div>
      </CardHeader>

      {accounts.length > 0 && (
        <div className="px-4 sm:px-6 pb-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-muted-foreground me-1 uppercase">{t('quick_select', 'Quick Select:')}</span>
          <button
            type="button"
            onClick={() => onSelectAllPlatforms?.(accounts.map((a) => a.id))}
            className={cn(
              'text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer font-medium',
              allSelected
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'border-border/30 hover:border-primary/50 text-foreground bg-background/50 dark:bg-dark-muted',
            )}
          >
            {t('all', 'All Channels')}
          </button>
          {hasWhatsApp && (
            <button
              type="button"
              onClick={() =>
                onSelectAllPlatforms?.(
                  accounts
                    .filter((a) => a.platform.toLowerCase() === 'whatsapp')
                    .map((a) => a.id),
                )
              }
              className="text-xs px-2.5 py-1 rounded-md border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] bg-[#25D366]/10 transition-all cursor-pointer font-medium flex items-center gap-1.5"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
              <span>WhatsApp</span>
            </button>
          )}
          {hasVideoPlatforms && (
            <button
              type="button"
              onClick={() =>
                onSelectAllPlatforms?.(
                  accounts
                    .filter((a) => ['youtube', 'tiktok'].includes(a.platform.toLowerCase()))
                    .map((a) => a.id),
                )
              }
              className="text-xs px-2.5 py-1 rounded-md border border-border/30 hover:border-primary/50 text-foreground bg-background/50 dark:bg-dark-muted transition-all cursor-pointer font-medium flex items-center gap-1"
            >
              <span>🎥 Video/Shorts</span>
            </button>
          )}
          {hasSocialPlatforms && (
            <button
              type="button"
              onClick={() =>
                onSelectAllPlatforms?.(
                  accounts
                    .filter((a) => ['facebook', 'instagram', 'linkedin', 'twitter'].includes(a.platform.toLowerCase()))
                    .map((a) => a.id),
                )
              }
              className="text-xs px-2.5 py-1 rounded-md border border-border/30 hover:border-primary/50 text-foreground bg-background/50 dark:bg-dark-muted transition-all cursor-pointer font-medium flex items-center gap-1"
            >
              <Share2 className="w-3 h-3 text-blue-500" />
              <span>Social Feeds</span>
            </button>
          )}
          {selectedPlatforms.length > 0 && (
            <button
              type="button"
              onClick={onDeselectAllPlatforms}
              className="text-xs px-2 py-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer ms-auto font-medium"
            >
              {t('clear', 'Clear')}
            </button>
          )}
        </div>
      )}

      <CardContent className="p-4 sm:p-6 pt-0! space-y-4">
        {accounts.length === 0 ? (
          <div className="text-center py-10 bg-background/20 glass-card glass-dark-card rounded-border-radius border border-dashed border-border/40">
            <Plus className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium text-title-color dark:text-white">{t('social_zero_nodes')}</p>
            <Link
              href={ROUTES.SOCIAL_MEDIA.CHANNELS}
              className="text-sm font-medium text-primary mt-3 block hover:underline"
            >
              {t('social_sync_platforms')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {accounts.map((acc) => {
              const isSelected = selectedPlatforms.includes(acc.id)
              const platformKey = acc.platform.toLowerCase()
              const config = PLATFORM_CONFIG[platformKey] || PLATFORM_CONFIG.instagram
              const Icon = config.icon

              return (
                <div
                  key={acc.id}
                  onClick={() => onTogglePlatform(acc.id)}
                  className={cn(
                    'p-3.5 rounded-border-radius border cursor-pointer transition-all flex flex-col overflow-hidden group',
                    isSelected
                      ? cn(config.activeBorder, 'bg-card/60 shadow-lg ring-1', config.activeRing)
                      : 'border-border/20 inner-card glass-dark-card hover:border-primary/20',
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={cn(
                          'w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-xs',
                          config.iconBg
                        )}
                      >
                        <Icon className="w-5 h-5 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold truncate transition-colors dark:text-white">
                            {acc.accountName}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold">
                            {config.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isSelected ? 'Click below to choose one or multiple formats' : 'Click to select platform'}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'w-6 h-6 rounded-lg border flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-primary border-primary text-white scale-110 shadow-md'
                          : 'border-border/40 bg-background/20 dark:bg-dark-muted',
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Multi-Select Format Cards (One, Multiple, or All) */}
                  {isSelected && config.formats && config.formats.length > 0 && (
                    <div
                      className="mt-3 pt-3 border-t border-border/10 w-full space-y-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          Select Formats (Choose Any or Multiple):
                        </span>
                        {config.formats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onChangePostType?.(acc.id, 'both')}
                            className="text-[11px] text-primary hover:underline font-bold"
                          >
                            Select All Formats
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {config.formats.map((fmt, idx) => {
                          const active = isFormatActive(acc.id, platformKey, fmt.id, idx)
                          return (
                            <div
                              key={fmt.id}
                              onClick={() => handleFormatToggle(acc.id, platformKey, fmt.id)}
                              className={cn(
                                'p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer select-none',
                                active
                                  ? cn(config.activeBorder, 'bg-primary/10 shadow-xs font-semibold ring-1', config.activeRing)
                                  : 'border-border/20 bg-background/30 hover:border-primary/40 opacity-70'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0',
                                  active ? 'bg-primary border-primary text-white' : 'border-neutral-400'
                                )}
                              >
                                {active && <Check className="w-3 h-3" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold block text-foreground truncate">{fmt.name}</span>
                                  {fmt.badge && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-primary/20 text-primary font-bold shrink-0">
                                      {fmt.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground block truncate">{fmt.desc}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PlatformSelection
