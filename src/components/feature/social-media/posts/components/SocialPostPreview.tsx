'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Globe,
  Sparkles,
  Bot,
  Layers,
  Image as ImageIcon,
  Repeat2,
  BarChart2,
  ExternalLink,
  MapPin,
  Star,
  Music2,
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  CheckCircle2,
  Compass,
  Play
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getUploadPreviewUrl } from '@/utils'
import { useTranslation } from 'react-i18next'
import { CarouselSlideItem } from './CarouselSlideManager'
import { SocialAccount } from '@/types/components/socialMedia'

export type PlatformType =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'google'
  | 'tiktok'
  | 'reddit'
  | 'pinterest'
  | 'threads'
  | 'whatsapp'
  | 'telegram'
  | 'wordpress'

import { useAppSelector } from '@/redux/hooks'
import { useGetSocialAccountsQuery } from '@/redux/api/socialMediaApi'

interface SocialPostPreviewProps {
  title: string
  content: string
  slides: CarouselSlideItem[]
  selectedAccounts: SocialAccount[]
  autoReplyKeyword?: string[]
  isAutoReplyEnabled?: boolean
  postTypes?: Record<string, string>
}

// Platform tabs definition

// Official Brand Vector Icons
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6 1.48-1.52 2.72-2.92 2.96-3.23.05-.07.07-.16-.01-.22-.09-.07-.22-.04-.32-.02-.14.03-2.38 1.51-6.73 4.45-.64.44-1.22.65-1.74.64-.57-.01-1.67-.32-2.49-.59-.99-.33-1.78-.5-1.71-1.07.03-.3.43-.6 1.19-.92 4.67-2.03 7.79-3.37 9.35-4.02 4.46-1.85 5.39-2.17 6-.18z"/>
  </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
  </svg>
)

const WordPressIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM3.186 12c0-1.335.284-2.604.789-3.752l4.34 11.897A8.834 8.834 0 013.186 12zm8.814 8.814a8.81 8.81 0 01-2.466-.351l2.617-7.604 2.68 7.342a.867.867 0 00.065.127 8.833 8.833 0 01-2.896.486zm1.218-12.945c.531-.028.99-.083.99-.083.47-.056.414-.746-.057-.719 0 0-1.4.11-2.304.11-.849 0-2.278-.11-2.278-.11-.47-.027-.526.69-.056.719 0 0 .432.055.914.083l1.358 3.72-1.91 5.725-3.177-9.445c.531-.028.99-.083.99-.083.47-.056.414-.746-.057-.719 0 0-1.4.11-2.304.11a16.56 16.56 0 01-.533-.017A8.836 8.836 0 0112 3.186c2.294 0 4.396.877 5.964 2.313-.038-.002-.074-.009-.113-.009-1.13 0-1.932.984-1.932 2.04 0 .948.548 1.75 1.132 2.697.442.773.958 1.765.958 3.197 0 .993-.381 2.144-.883 3.752l-1.156 3.861-4.196-12.172zm4.9 11.678l2.658-7.687c.496-1.239.662-2.228.662-3.107 0-.319-.021-.616-.056-.893A8.833 8.833 0 0120.814 12c0 3.21-1.726 6.024-4.296 7.547h-.001z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
  </svg>
)

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.393-12-12-12z"/>
  </svg>
)

const RedditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)


const PLATFORM_TABS: {
  id: PlatformType
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  activeGradient: string
  activeShadow: string
}[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    icon: TelegramIcon,
    iconColor: 'text-[#0088cc]',
    activeGradient: 'bg-gradient-to-r from-[#0088cc] to-[#0077b5] text-white',
    activeShadow: 'shadow-lg shadow-sky-500/30 ring-2 ring-sky-500/50',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: WhatsAppIcon,
    iconColor: 'text-[#25D366]',
    activeGradient: 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white',
    activeShadow: 'shadow-lg shadow-[#25D366]/30 ring-2 ring-[#25D366]/50',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    iconColor: 'text-pink-500',
    activeGradient: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white',
    activeShadow: 'shadow-lg shadow-pink-500/30 ring-2 ring-pink-500/50',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FacebookIcon,
    iconColor: 'text-[#1877F2]',
    activeGradient: 'bg-gradient-to-r from-[#1877F2] to-[#0d5ec4] text-white',
    activeShadow: 'shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/50',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: LinkedInIcon,
    iconColor: 'text-[#0A66C2]',
    activeGradient: 'bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white',
    activeShadow: 'shadow-lg shadow-sky-600/30 ring-2 ring-sky-500/50',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: TwitterXIcon,
    iconColor: 'text-neutral-900 dark:text-white',
    activeGradient: 'bg-neutral-950 dark:bg-white text-white dark:text-black',
    activeShadow: 'shadow-lg shadow-neutral-900/30 ring-2 ring-neutral-400/50',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: YouTubeIcon,
    iconColor: 'text-[#FF0000]',
    activeGradient: 'bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white',
    activeShadow: 'shadow-lg shadow-red-600/30 ring-2 ring-red-500/50',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: TikTokIcon,
    iconColor: 'text-[#00f2fe]',
    activeGradient: 'bg-gradient-to-r from-neutral-900 to-neutral-800 text-[#00f2fe] border border-[#00f2fe]/40',
    activeShadow: 'shadow-lg shadow-cyan-500/25 ring-2 ring-[#00f2fe]/50',
  },
  {
    id: 'google',
    label: 'Google Business',
    icon: GoogleIcon,
    iconColor: 'text-[#4285F4]',
    activeGradient: 'bg-gradient-to-r from-[#4285F4] to-[#1967D2] text-white',
    activeShadow: 'shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50',
  },
  {
    id: 'reddit',
    label: 'Reddit',
    icon: RedditIcon,
    iconColor: 'text-[#FF4500]',
    activeGradient: 'bg-gradient-to-r from-[#FF4500] to-[#CC3700] text-white',
    activeShadow: 'shadow-lg shadow-orange-600/30 ring-2 ring-orange-500/50',
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    icon: PinterestIcon,
    iconColor: 'text-[#E60023]',
    activeGradient: 'bg-gradient-to-r from-[#E60023] to-[#AD081B] text-white',
    activeShadow: 'shadow-lg shadow-red-700/30 ring-2 ring-red-500/50',
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: TwitterXIcon,
    iconColor: 'text-neutral-900 dark:text-white',
    activeGradient: 'bg-black text-white dark:bg-white dark:text-black',
    activeShadow: 'shadow-lg shadow-black/30 ring-2 ring-neutral-400/50',
  },
  {
    id: 'wordpress',
    label: 'WordPress',
    icon: WordPressIcon,
    iconColor: 'text-[#21759B]',
    activeGradient: 'bg-gradient-to-r from-[#21759B] to-[#135f7e] text-white',
    activeShadow: 'shadow-lg shadow-sky-700/30 ring-2 ring-[#21759B]/50',
  },
]


export const SocialPostPreview: React.FC<SocialPostPreviewProps> = ({
  title,
  content,
  slides,
  selectedAccounts,
  autoReplyKeyword = ['DM'],
  isAutoReplyEnabled = false,
  postTypes = {},
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<PlatformType>('instagram')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [redditVote, setRedditVote] = useState<number>(0)
  const [whatsAppMode, setWhatsAppMode] = useState<'channel' | 'status'>('channel')
  const platformScrollRef = React.useRef<HTMLDivElement>(null)

  const handleScrollLeft = () => {
    if (platformScrollRef.current) {
      platformScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const handleScrollRight = () => {
    if (platformScrollRef.current) {
      platformScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const { user: authUser } = useAppSelector((state) => state.auth)
  const { data: accountsData } = useGetSocialAccountsQuery({})
  const allConnectedAccounts: SocialAccount[] = accountsData?.socialAccounts || []

  // Find account info if available in selected accounts, then in all connected accounts
  const matchingAccount =
    selectedAccounts.find(
      (a) => a.platform.toLowerCase() === activeTab.toLowerCase() || (activeTab === 'twitter' && a.platform.toLowerCase() === 'x')
    ) ||
    allConnectedAccounts.find(
      (a) => a.platform.toLowerCase() === activeTab.toLowerCase() || (activeTab === 'twitter' && a.platform.toLowerCase() === 'x')
    ) ||
    selectedAccounts[0] ||
    allConnectedAccounts[0]

  const accountName =
    matchingAccount?.accountName ||
    authUser?.name ||
    (authUser?.email ? authUser.email.split('@')[0] : 'My Account')
  const profilePicture =
    matchingAccount?.profilePicture ||
    (authUser as any)?.avatar ||
    (authUser as any)?.profilePicture ||
    null

  const slideCount = slides.length
  const currentSlide = slides[activeSlideIndex]
  const isVideoUrl = (url?: string | null) => Boolean(url && /\.(mp4|webm|mov|ogg)$/i.test(url))
  const currentMediaUrl = currentSlide
    ? currentSlide.isExisting
      ? getUploadPreviewUrl(currentSlide.url)
      : currentSlide.url
    : null

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSlideIndex((prev) => (prev < slideCount - 1 ? prev + 1 : prev))
  }

  // Format content to highlight hashtags and keywords
  const renderFormattedContent = (text: string) => {
    if (!text)
      return (
        <span className="text-muted-foreground italic">
          {t('preview_content_placeholder', { defaultValue: 'Your transmission copy will materialize here...' })}
        </span>
      )

    const parts = text.split(/(\s+)/)
    return parts.map((part, i) => {
      if (part.startsWith('#') || part.startsWith('@')) {
        return (
          <span key={i} className="text-blue-500 font-semibold hover:underline cursor-pointer">
            {part}
          </span>
        )
      }
      if (isAutoReplyEnabled && autoReplyKeyword.some((kw) => kw.toLowerCase() === part.trim().toLowerCase())) {
        return (
          <span key={i} className="bg-primary/20 text-primary font-bold px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="space-y-4">
      {/* Header with Platform Toggle */}
      <div className="space-y-2.5 pb-2 border-b border-border/20">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-title-color dark:text-white">
                {t('live_mockup_preview', { defaultValue: 'Live Feed Preview' })}
              </h4>
              <p className="text-xs text-muted-foreground">
                {slideCount > 1
                  ? t('multi_slide_preview_note', { defaultValue: `Simulating ${slideCount}-slide interactive carousel across platforms` })
                  : t('feed_preview_note', { defaultValue: 'Interactive multi-platform feed simulation' })}
              </p>
            </div>
          </div>

          <div className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="capitalize">{activeTab} Mode</span>
          </div>
        </div>

        
        
        {/* Scroll Slider Platform Selector Pills */}
        <div className="relative group/slider flex items-center">
          <button
            type="button"
            onClick={handleScrollLeft}
            className="w-8 h-8 rounded-full bg-card/90 dark:bg-neutral-900/90 border border-border/50 hover:border-primary text-foreground hover:bg-primary hover:text-white flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95 z-10 -mr-2"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={platformScrollRef}
            className="flex items-center gap-2 overflow-x-auto py-2 px-3 scroll-smooth scrollbar-none custom-scrollbar w-full no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PLATFORM_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 group relative select-none shadow-xs',
                    isActive
                      ? cn(tab.activeGradient, tab.activeShadow, 'scale-105')
                      : 'border border-border/40 bg-background/60 dark:bg-dark-muted/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-background/90 backdrop-blur-md hover:scale-[1.02]'
                  )}
                >
                  <div className={cn('w-4 h-4 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : tab.iconColor)}>
                    <Icon className="w-4 h-4 fill-current" />
                  </div>
                  <span className="tracking-tight">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleScrollRight}
            className="w-8 h-8 rounded-full bg-card/90 dark:bg-neutral-900/90 border border-border/50 hover:border-primary text-foreground hover:bg-primary hover:text-white flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95 z-10 -ml-2"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-Reply Banner Notice if enabled */}
      {isAutoReplyEnabled && (
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 text-xs text-primary font-medium">
          <Bot className="w-4 h-4 shrink-0 text-primary animate-pulse" />
          <span>
            {t('auto_reply_active_hint', { defaultValue: 'Auto-DM active on keywords: ' })}
            <strong>{autoReplyKeyword.join(', ')}</strong>
          </span>
        </div>
      )}

      {/* Simulation Device Frame */}
      <div className="mx-auto max-w-[440px] rounded-[28px] border-4 border-neutral-800/80 dark:border-neutral-700/80 bg-background dark:bg-card shadow-2xl overflow-hidden text-foreground">
        {/* ================= 1. INSTAGRAM MOCKUP ================= */}
        {activeTab === 'instagram' && (
          <div className="flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                  <div className="relative w-full h-full rounded-full bg-white dark:bg-neutral-900 overflow-hidden">
                    {profilePicture ? (
                      <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-xs text-primary bg-primary/10">
                        {accountName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold truncate">{accountName}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {slideCount > 1 ? 'Carousel • Original audio' : 'Original audio'}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Media Area */}
            <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center group">
              {currentMediaUrl ? (
                currentSlide?.type === 'video' ? (
                  <video key={currentMediaUrl} src={currentMediaUrl} className="w-full h-full object-cover" controls muted />
                ) : (
                  <Image key={currentMediaUrl} src={currentMediaUrl} alt="Instagram Post" fill className="object-cover" unoptimized />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-2 text-neutral-400">
                  <ImageIcon className="w-10 h-10 stroke-1 opacity-50" />
                  <p className="text-xs font-medium">Upload images to preview carousel</p>
                </div>
              )}

              {slideCount > 1 && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="h-6 px-2.5 bg-black/75 hover:bg-black/75 text-white backdrop-blur-md rounded-full text-[11px] font-bold border-none shadow-md">
                    {activeSlideIndex + 1}/{slideCount}
                  </Badge>
                </div>
              )}

              {slideCount > 1 && (
                <>
                  {activeSlideIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all shadow-lg z-10 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  {activeSlideIndex < slideCount - 1 && (
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all shadow-lg z-10 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-3.5 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setIsLiked(!isLiked)} className="cursor-pointer transition-transform active:scale-125">
                  <Heart className={cn('w-5 h-5 transition-colors', isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-800 dark:text-neutral-200')} />
                </button>
                <button type="button" className="cursor-pointer">
                  <MessageCircle className="w-5 h-5 text-neutral-800 dark:text-neutral-200 -rotate-90" />
                </button>
                <button type="button" className="cursor-pointer">
                  <Send className="w-5 h-5 text-neutral-800 dark:text-neutral-200 -rotate-12" />
                </button>
              </div>

              {slideCount > 1 && (
                <div className="flex items-center gap-1">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveSlideIndex(dotIdx)}
                      className={cn(
                        'h-1.5 rounded-full transition-all cursor-pointer',
                        dotIdx === activeSlideIndex ? 'w-4 bg-blue-500' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'
                      )}
                    />
                  ))}
                </div>
              )}

              <button type="button" onClick={() => setIsSaved(!isSaved)} className="cursor-pointer transition-transform active:scale-125">
                <Bookmark className={cn('w-5 h-5 transition-colors', isSaved ? 'fill-neutral-900 dark:fill-white' : 'text-neutral-800 dark:text-neutral-200')} />
              </button>
            </div>

            <div className="px-3.5 text-xs font-bold">{isLiked ? '1 like' : 'Be the first to like'}</div>

            <div className="px-3.5 pt-1.5 pb-4 space-y-1 text-xs">
              <p className="leading-relaxed">
                <span className="font-bold mr-1.5">{accountName}</span>
                {isCaptionExpanded || (content && content.length <= 90) ? (
                  renderFormattedContent(content)
                ) : (
                  <>
                    {renderFormattedContent(content.slice(0, 90))}...
                    <button type="button" onClick={() => setIsCaptionExpanded(true)} className="text-neutral-500 dark:text-neutral-400 font-semibold ml-1 cursor-pointer">
                      more
                    </button>
                  </>
                )}
              </p>
              <p className="text-[11px] text-neutral-400 pt-1">Add a comment...</p>
            </div>
          </div>
        )}

        {/* ================= 2. FACEBOOK MOCKUP ================= */}
        {activeTab === 'facebook' && (
          <div className="flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-10 h-10 rounded-full bg-blue-600 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm">
                  {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-xs font-bold truncate">{accountName}</p>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                    <span>Just now</span>
                    <span>•</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-500" />
            </div>

            <div className="px-4 pb-2.5 text-xs leading-relaxed">{renderFormattedContent(content)}</div>

            {/* Media Area */}
            <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center group">
              {currentMediaUrl ? (
                currentSlide?.type === 'video' ? (
                  <video key={currentMediaUrl} src={currentMediaUrl} className="w-full h-full object-cover" controls muted />
                ) : (
                  <Image key={currentMediaUrl} src={currentMediaUrl} alt="Facebook Post" fill className="object-cover" unoptimized />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-2 text-neutral-400">
                  <ImageIcon className="w-10 h-10 stroke-1 opacity-50" />
                  <p className="text-xs font-medium">Upload photos to preview post</p>
                </div>
              )}
            </div>

            <div className="px-4 py-2 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">👍</span>
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </div>
            </div>

            <div className="px-2 py-1 flex items-center justify-around border-b border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={cn('flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors', isLiked && 'text-blue-600 font-bold')}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>
              <button type="button" className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button type="button" className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. LINKEDIN MOCKUP ================= */}
        {activeTab === 'linkedin' && (
          <div className="flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full bg-[#0077b5] overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold truncate">{accountName}</p>
                    <span className="text-[10px] text-neutral-400 font-normal">• 1st</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate">{accountName} • Connected Account</p>
                  <p className="text-[9px] text-neutral-400 flex items-center gap-1 mt-0.5">
                    <span>Just now</span>
                    <span>•</span>
                    <Globe className="w-2.5 h-2.5" />
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-[#0077b5] font-bold hover:bg-[#0077b5]/10 rounded-full">
                + Follow
              </Button>
            </div>

            {/* LinkedIn Post Copy */}
            <div className="px-4 py-3 text-xs leading-relaxed space-y-2">
              {title && <h5 className="font-bold text-sm text-neutral-900 dark:text-white">{title}</h5>}
              <p>{renderFormattedContent(content)}</p>
            </div>

            {/* Media Area / Document Carousel */}
            <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center group border-y border-neutral-100 dark:border-neutral-800">
              {currentMediaUrl ? (
                currentSlide?.type === 'video' ? (
                  <video key={currentMediaUrl} src={currentMediaUrl} className="w-full h-full object-cover" controls muted />
                ) : (
                  <Image key={currentMediaUrl} src={currentMediaUrl} alt="LinkedIn Slide" fill className="object-cover" unoptimized />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-2 text-neutral-400">
                  <Layers className="w-10 h-10 stroke-1 opacity-50" />
                  <p className="text-xs font-medium">LinkedIn Document Carousel</p>
                </div>
              )}

              {slideCount > 1 && (
                <div className="absolute bottom-3 right-3 z-10">
                  <Badge className="bg-black/80 text-white backdrop-blur-md rounded-md text-[10px] font-bold px-2 py-0.5 border-none">
                    Slide {activeSlideIndex + 1} of {slideCount}
                  </Badge>
                </div>
              )}
            </div>

            {/* Reactions bar */}
            <div className="px-4 py-2 flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1">
                <span className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">👍</span>
                  <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px]">👏</span>
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px]">❤️</span>
                </span>
                <span className="ml-1 font-semibold">{isLiked ? 'Liked' : 'React'}</span>
              </div>
            </div>

            <div className="px-2 py-1.5 flex items-center justify-around text-neutral-600 dark:text-neutral-400 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={cn('flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer', isLiked && 'text-[#0077b5] font-bold')}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                <Repeat2 className="w-3.5 h-3.5" />
                <span>Repost</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 4. X / TWITTER MOCKUP ================= */}
        {activeTab === 'twitter' && (
          <div className="flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-white font-sans p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm">
                  {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm truncate">{accountName}</span>
                    <span className="w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">✓</span>
                  </div>
                  <span className="text-xs text-neutral-500">@{accountName.replace(/\s+/g, '_').toLowerCase()}</span>
                </div>
              </div>
              <span className="font-mono text-sm font-black">𝕏</span>
            </div>

            {/* Tweet Copy */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderFormattedContent(content)}
            </div>

            {/* Media Area */}
            {currentMediaUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                {currentSlide?.type === 'video' ? (
                  <video key={currentMediaUrl} src={currentMediaUrl} className="w-full h-full object-cover" controls muted />
                ) : (
                  <Image key={currentMediaUrl} src={currentMediaUrl} alt="X Media" fill className="object-cover" unoptimized />
                )}
              </div>
            )}

            <div className="text-xs text-neutral-500 pt-1 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Live Feed Preview
            </div>

            <div className="flex items-center justify-between text-neutral-500 text-xs px-2 pt-1">
              <button type="button" className="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button type="button" className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setIsLiked(!isLiked)} className={cn('flex items-center gap-1.5 hover:text-pink-500 transition-colors', isLiked && 'text-pink-500 font-bold')}>
                <Heart className={cn('w-4 h-4', isLiked && 'fill-pink-500')} />
                <span>{isLiked ? 1 : 0}</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
                <Bookmark className="w-4 h-4" />
                <span>0</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 5. YOUTUBE VIDEO & SHORTS MOCKUP ================= */}
        {activeTab === 'youtube' && (
          <div className="flex flex-col bg-white dark:bg-[#0f0f0f] text-neutral-900 dark:text-white font-sans p-4 space-y-3.5">
            {/* Header with Channel Details & Subscribe Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#FF0000] overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : (accountName ? accountName.charAt(0).toUpperCase() : 'Y')}
                </div>
                <div>
                  <h5 className="text-xs font-bold truncate flex items-center gap-1">
                    <span>{accountName || 'YouTube Creator Channel'}</span>
                    <span className="text-[10px] text-red-500">✓</span>
                  </h5>
                  <p className="text-[10px] text-neutral-400">Verified Channel • Just now</p>
                </div>
              </div>
              <Button size="sm" className="h-7 px-3.5 bg-[#FF0000] hover:bg-[#CC0000] text-white text-[11px] font-bold rounded-full shadow-xs">
                Subscribe
              </Button>
            </div>

            {/* Post Title & Formatted Description */}
            <div className="text-xs leading-relaxed space-y-1.5">
              {title ? (
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-snug">{title}</h4>
              ) : (
                <h4 className="font-bold text-sm text-neutral-400 italic">YouTube Video Title</h4>
              )}
              <div className="text-xs text-neutral-600 dark:text-neutral-300 max-h-24 overflow-y-auto custom-scrollbar">
                {content ? renderFormattedContent(content) : (
                  <p className="text-neutral-400 italic">
                    Video description and notes will appear here...
                  </p>
                )}
              </div>
            </div>

            {/* Video / Thumbnail Player */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center group shadow-md border border-neutral-800">
              {currentMediaUrl ? (
                currentSlide?.type === 'video' ? (
                  <video key={currentMediaUrl} src={currentMediaUrl} className="w-full h-full object-cover" controls muted />
                ) : (
                  <>
                    <Image key={currentMediaUrl} src={currentMediaUrl} alt="YouTube Video Thumbnail" fill className="object-cover" unoptimized />
                    <div className="absolute w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </>
                )
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 via-black to-red-950 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mb-2 shadow-inner">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="text-xs font-bold text-white">YouTube 16:9 HD Video Player</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Upload a video or auto generate thumbnail</span>
                </div>
              )}
            </div>

            {/* YouTube Engagement Action Bar */}
            <div className="flex items-center gap-3 pt-1 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center bg-neutral-100 dark:bg-white/10 rounded-full p-1 px-3 gap-2.5">
                <button type="button" onClick={() => setIsLiked(!isLiked)} className={cn('flex items-center gap-1.5 cursor-pointer', isLiked && 'text-red-500 font-bold')}>
                  <ThumbsUp className={cn('w-3.5 h-3.5', isLiked && 'fill-red-500')} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <div className="w-px h-3.5 bg-neutral-300 dark:bg-neutral-700" />
                <button type="button" className="cursor-pointer hover:text-neutral-900">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center bg-neutral-100 dark:bg-white/10 rounded-full p-1.5 px-3 gap-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-white/15 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </div>

              <div className="flex items-center bg-neutral-100 dark:bg-white/10 rounded-full p-1.5 px-3 gap-1.5 cursor-pointer ml-auto hover:bg-neutral-200 dark:hover:bg-white/15 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. GOOGLE BUSINESS / GMB MOCKUP ================= */}
        {activeTab === 'google' && (
          <div className="flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-sans p-4 space-y-3.5">
            {/* Google Search Listing Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#4285F4] font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google Business Profile • Updates</span>
                </div>
                <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">{accountName}</h4>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                </div>
              </div>
              <Badge className="bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20 text-[10px] font-bold">
                Verified Listing
              </Badge>
            </div>

            {/* Media Area */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shadow-inner">
              {currentMediaUrl ? (
                <Image key={currentMediaUrl} src={currentMediaUrl} alt="Google Business Photo" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <MapPin className="w-8 h-8 text-[#4285F4]" />
                  <span className="text-xs font-medium">Business Update & Offer Photo</span>
                </div>
              )}
            </div>

            {/* Update Description */}
            <div className="space-y-1.5 text-xs leading-relaxed">
              {title && <h5 className="font-bold text-sm text-neutral-900 dark:text-white">{title}</h5>}
              <p>{renderFormattedContent(content)}</p>
            </div>

            {/* Action CTA Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button className="h-9 bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold text-xs rounded-xl shadow-md gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Learn More</span>
              </Button>
              <Button variant="outline" className="h-9 border-neutral-300 dark:border-white/15 font-bold text-xs rounded-xl gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Get Directions</span>
              </Button>
            </div>
          </div>
        )}

        {/* ================= 7. TIKTOK MOCKUP ================= */}
        {activeTab === 'tiktok' && (
          <div className="relative aspect-[9/16] w-full bg-neutral-950 text-white font-sans overflow-hidden flex flex-col justify-between p-4">
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
              {currentMediaUrl ? (
                currentSlide?.type === 'video' ? (
                  <video key={currentMediaUrl} src={currentMediaUrl} className="w-full h-full object-cover" controls muted autoPlay loop />
                ) : (
                  <Image key={currentMediaUrl} src={currentMediaUrl} alt="TikTok Background" fill className="object-cover" unoptimized />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black text-neutral-500 text-xs font-medium">
                  TikTok Vertical Video Simulation
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-4 text-white/70">
                <span>Following</span>
                <span className="text-white border-b-2 border-white pb-0.5">For You</span>
              </div>
              <Sparkles className="w-4 h-4 text-[#00f2fe]" />
            </div>

            {/* Right Action Rail */}
            <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4">
              {/* Creator Avatar with + badge */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-neutral-800 flex items-center justify-center font-bold text-xs">
                  {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#fe2c55] text-white flex items-center justify-center text-[11px] font-black">
                  +
                </div>
              </div>

              <button type="button" onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <Heart className={cn('w-6 h-6', isLiked ? 'fill-[#fe2c55] text-[#fe2c55]' : 'text-white')} />
                </div>
                <span className="text-[11px] font-bold">{isLiked ? '1' : '0'}</span>
              </button>

              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white -rotate-90" />
                </div>
                <span className="text-[11px] font-bold">0</span>
              </div>

              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold">0</span>
              </div>

              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold">Share</span>
              </div>

              {/* Vinyl Sound Disc */}
              <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 animate-spin flex items-center justify-center">
                <Music2 className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="relative z-10 space-y-2 pr-14">
              <h5 className="text-xs font-black">@{accountName.replace(/\s+/g, '').toLowerCase()}</h5>
              <p className="text-xs leading-relaxed line-clamp-2 text-white/90">{content || 'Viral hook & caption goes here #fyp #viral #trending'}</p>
              <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium">
                <Music2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="truncate">Original Sound - {accountName} Official</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. REDDIT MOCKUP ================= */}
        {activeTab === 'reddit' && (
          <div className="flex flex-col bg-white dark:bg-[#1a1a1b] text-neutral-900 dark:text-neutral-100 font-sans p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-[#FF4500] text-white font-black flex items-center justify-center text-xs">
                r/
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-neutral-900 dark:text-white">r/outreach</span>
                  <span className="text-neutral-400">• Just now</span>
                </div>
                <p className="text-[10px] text-neutral-400">Posted by u/{accountName.replace(/\s+/g, '_').toLowerCase()}</p>
              </div>
              <Button size="sm" className="h-6 px-3 bg-[#FF4500] text-white text-[10px] font-bold rounded-full ml-auto">
                Join
              </Button>
            </div>

            {/* Post Title */}
            <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white leading-snug">
              {title || 'Reddit Post Title'}
            </h4>

            {/* Post Body */}
            <div className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-300">
              {renderFormattedContent(content)}
            </div>

            {/* Media Area */}
            {currentMediaUrl && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <Image key={currentMediaUrl} src={currentMediaUrl} alt="Reddit Post Media" fill className="object-cover" unoptimized />
              </div>
            )}

            {/* Reddit Vote & Comment Action Bar */}
            <div className="flex items-center gap-2 pt-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center bg-neutral-100 dark:bg-white/5 rounded-full px-2 py-1 gap-1">
                <button
                  type="button"
                  onClick={() => setRedditVote(redditVote === 1 ? 0 : 1)}
                  className={cn('p-0.5 hover:text-[#FF4500]', redditVote === 1 && 'text-[#FF4500]')}
                >
                  <ArrowBigUp className="w-5 h-5" />
                </button>
                <span>{redditVote === 1 ? '1' : redditVote === -1 ? '-1' : 'Vote'}</span>
                <button
                  type="button"
                  onClick={() => setRedditVote(redditVote === -1 ? 0 : -1)}
                  className={cn('p-0.5 hover:text-blue-500', redditVote === -1 && 'text-blue-500')}
                >
                  <ArrowBigDown className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center bg-neutral-100 dark:bg-white/5 rounded-full px-3 py-1.5 gap-1.5 cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comment</span>
              </div>

              <div className="flex items-center bg-neutral-100 dark:bg-white/5 rounded-full px-3 py-1.5 gap-1.5 cursor-pointer">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. PINTEREST MOCKUP ================= */}
        {activeTab === 'pinterest' && (
          <div className="flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-sans p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E60023] text-white flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <span className="text-xs font-bold">{accountName}</span>
              </div>
              <Button size="sm" className="h-8 px-4 bg-[#E60023] hover:bg-[#ad081b] text-white font-extrabold text-xs rounded-full shadow-md">
                Save
              </Button>
            </div>

            {/* Pin Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-md">
              {currentMediaUrl ? (
                <Image key={currentMediaUrl} src={currentMediaUrl} alt="Pinterest Pin" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
                  <ImageIcon className="w-10 h-10 opacity-50" />
                  <span className="text-xs font-medium">3:4 Vertical Pin Image</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">{title || 'Creative Pin Title'}</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">{content}</p>
            </div>
          </div>
        )}

        
        {/* ================= 11. WHATSAPP LIVE FEED PREVIEW (CHANNEL & STATUS) ================= */}
        {activeTab === 'whatsapp' && (
          <div className="flex flex-col bg-[#e5ddd5] dark:bg-[#0b141a] text-neutral-900 dark:text-neutral-100 font-sans">
            {/* WhatsApp Mode Sub-Switcher */}
            <div className="flex items-center justify-between p-2 bg-[#008069] dark:bg-[#1f2c34] text-white border-b border-black/10">
              <div className="flex items-center gap-1.5 bg-black/20 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setWhatsAppMode('channel')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                    whatsAppMode === 'channel' ? 'bg-[#25D366] text-white shadow-sm' : 'text-white/80 hover:text-white'
                  )}
                >
                  📢 Channel Feed
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsAppMode('status')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                    whatsAppMode === 'status' ? 'bg-[#25D366] text-white shadow-sm' : 'text-white/80 hover:text-white'
                  )}
                >
                  🟢 Status Story
                </button>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                Live Feed
              </span>
            </div>

            {/* Mode 1: WhatsApp Broadcast Channel Feed */}
            {whatsAppMode === 'channel' && (
              <div className="flex flex-col">
                {/* Channel Header Bar */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-[#008069] dark:bg-[#1f2c34] text-white shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs overflow-hidden border border-white/20">
                      {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold">{accountName || 'Official Channel'}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 fill-[#25D366] text-white" />
                      </div>
                      <span className="text-[10px] text-white/80 block">Channel • Verified Broadcast</span>
                    </div>
                  </div>

                  <button type="button" className="px-3 py-1 rounded-full bg-white text-[#008069] text-xs font-bold hover:bg-white/90 transition-all cursor-pointer shadow-xs">
                    Follow
                  </button>
                </div>

                {/* Channel Message Feed Canvas */}
                <div className="p-3.5 space-y-3 min-h-[320px] bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]">
                  {/* Date Pill */}
                  <div className="flex justify-center">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-neutral-800/80 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 shadow-xs">
                      Today
                    </span>
                  </div>

                  {/* Channel Message Bubble */}
                  <div className="max-w-[92%] bg-white dark:bg-[#1f2c34] rounded-2xl rounded-tl-sm p-3 shadow-md border border-black/5 dark:border-white/5 space-y-2 relative">
                    {/* Media Preview (Image or Video) */}
                    {currentMediaUrl && (
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/10">
                        {isVideoUrl(currentMediaUrl) ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-neutral-900">
                            <video src={currentMediaUrl} className="w-full h-full object-cover" controls={false} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-10 h-10 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                              VIDEO
                            </span>
                          </div>
                        ) : (
                          <Image key={currentMediaUrl} src={currentMediaUrl} alt="WhatsApp Media" fill className="object-cover" unoptimized />
                        )}
                      </div>
                    )}

                    {/* Headline */}
                    {title && (
                      <h4 className="font-bold text-xs text-neutral-900 dark:text-white leading-snug">
                        {title}
                      </h4>
                    )}

                    {/* Message Body */}
                    <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                      {renderFormattedContent(content)}
                    </div>

                    {/* Bottom Metadata & Status Check */}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-400 pt-1">
                      <span>10:45 AM</span>
                      <span className="text-[#53bdeb] font-black">✓✓</span>
                    </div>

                    {/* Channel Emoji Reactions Bar */}
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-xs cursor-pointer hover:scale-105 transition-transform">
                        ❤️
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-xs cursor-pointer hover:scale-105 transition-transform">
                        👍
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-xs cursor-pointer hover:scale-105 transition-transform">
                        🔥
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: WhatsApp 9:16 Vertical Status Story */}
            {whatsAppMode === 'status' && (
              <div className="p-3 flex justify-center bg-black/90">
                <div className="w-full max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl relative flex flex-col justify-between p-3.5 text-white">
                  {/* Background Media */}
                  {currentMediaUrl ? (
                    <div className="absolute inset-0 w-full h-full">
                      {isVideoUrl(currentMediaUrl) ? (
                        <video src={currentMediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                      ) : (
                        <Image src={currentMediaUrl} alt="WhatsApp Status" fill className="object-cover" unoptimized />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 flex items-center justify-center p-6 text-center">
                      <p className="text-sm font-bold leading-relaxed">{content || 'WhatsApp Text Status'}</p>
                    </div>
                  )}

                  {/* Top Segmented Story Progress Bars & Header */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex gap-1 w-full">
                      <div className="h-1 flex-1 bg-white rounded-full" />
                      <div className="h-1 flex-1 bg-white/40 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden border border-white/40">
                          {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold block leading-tight">{accountName || 'My Status'}</span>
                          <span className="text-[9px] text-white/70">Today, 10:45 AM</span>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-white/80" />
                    </div>
                  </div>

                  {/* Bottom Caption & Reply Bar */}
                  <div className="relative z-10 space-y-2">
                    {currentMediaUrl && content && (
                      <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-xs text-white leading-snug line-clamp-3 text-center border border-white/10">
                        {content}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-1 text-[11px] text-white/80 pt-1">
                      <ChevronRight className="w-3.5 h-3.5 -rotate-90 animate-bounce" />
                      <span className="font-semibold text-[10px] uppercase tracking-wider">Swipe up to reply</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 12. TELEGRAM MOCKUP ================= */}
        {activeTab === 'telegram' && (
          <div className="flex flex-col bg-[#547596] text-white font-sans p-4 space-y-3 min-h-[400px] justify-end relative rounded-2xl overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at center, #5b87a8 0%, #3e5a75 100%)' }}>
            <div className="flex flex-col space-y-2 max-w-[85%] self-start bg-[#182533] text-white rounded-2xl rounded-tl-none p-3 shadow-md border border-[#243447]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#0088cc] flex items-center justify-center font-bold text-[9px] text-white shrink-0 relative overflow-hidden">
                  {profilePicture ? <img src={profilePicture} alt={accountName} className="w-full h-full object-cover rounded-full" /> : accountName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold text-[#4da3ff]">{accountName || 'Telegram Channel'}</span>
              </div>
              
              {currentMediaUrl && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/5 mb-1.5">
                  <img src={currentMediaUrl} alt="Telegram Media" className="w-full h-full object-cover" />
                </div>
              )}
              
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{content || 'Telegram post content...'}</p>
              
              <div className="flex items-center justify-end gap-1.5 text-[9px] text-white/50 pt-1">
                <span>10:45 AM</span>
                <span className="text-[#4da3ff]">✓✓</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 10. THREADS MOCKUP ================= */}
        {activeTab === 'threads' && (
          <div className="flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-white font-sans p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                  {profilePicture ? <Image src={profilePicture} alt={accountName} fill className="object-cover" unoptimized /> : accountName.charAt(0).toUpperCase()}
                </div>
                <div className="w-0.5 h-16 bg-neutral-200 dark:bg-neutral-800 my-1.5" />
                <div className="w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{accountName.replace(/\s+/g, '_').toLowerCase()}</span>
                    <span className="text-[10px] text-neutral-400">Just now</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                </div>

                <p className="text-xs leading-relaxed">{renderFormattedContent(content)}</p>

                {currentMediaUrl && (
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <Image key={currentMediaUrl} src={currentMediaUrl} alt="Threads Media" fill className="object-cover" unoptimized />
                  </div>
                )}

                <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-300 pt-1">
                  <button type="button" onClick={() => setIsLiked(!isLiked)} className="cursor-pointer">
                    <Heart className={cn('w-4 h-4', isLiked && 'fill-red-500 text-red-500')} />
                  </button>
                  <MessageCircle className="w-4 h-4 -rotate-90 cursor-pointer" />
                  <Repeat2 className="w-4 h-4 cursor-pointer" />
                  <Send className="w-4 h-4 cursor-pointer" />
                </div>

                <div className="text-[11px] text-neutral-400 pt-0.5">
                  {isLiked ? '1 like' : 'Be the first to like'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 11. WORDPRESS MOCKUP ================= */}
        {activeTab === 'wordpress' && (
          <div className="flex flex-col bg-white text-neutral-900 font-serif">
            {/* WP Admin-style top bar */}
            <div className="bg-[#1d2327] text-white/70 px-3 py-1.5 flex items-center gap-2 text-[10px] font-sans">
              <WordPressIcon className="w-3.5 h-3.5 text-[#21759B] fill-[#21759B]" />
              <span className="font-semibold text-white/90">WordPress</span>
              <span className="mx-1 text-white/30">·</span>
              <span>My Site</span>
              <span className="mx-1 text-white/30">›</span>
              <span>Posts</span>
            </div>

            {/* Featured image */}
            <div className="relative w-full aspect-video bg-neutral-100 overflow-hidden">
              {currentMediaUrl ? (
                <img src={currentMediaUrl} alt="Featured" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-300">
                  <Globe className="w-8 h-8" />
                  <span className="text-xs font-sans">Featured Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <span className="inline-block bg-[#21759B] text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">Published</span>
                <h2 className="text-white text-sm font-bold leading-snug line-clamp-2 drop-shadow-lg font-sans">
                  {title || 'Your Post Title'}
                </h2>
              </div>
            </div>

            {/* Post body */}
            <div className="p-4 space-y-3 font-sans">
              {/* Meta */}
              <div className="flex items-center gap-2 text-[10px] text-neutral-400 flex-wrap">
                <div className="w-5 h-5 rounded-full bg-[#21759B] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                  {accountName.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-neutral-600">{accountName}</span>
                <span className="text-neutral-300">·</span>
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-neutral-300">·</span>
                <span>{Math.max(1, Math.ceil((content?.length || 0) / 1200))} min read</span>
              </div>

              {/* Categories */}
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[9px] bg-[#21759B]/10 text-[#21759B] font-semibold px-2 py-0.5 rounded-full border border-[#21759B]/20">Blog</span>
                <span className="text-[9px] bg-neutral-100 text-neutral-500 font-semibold px-2 py-0.5 rounded-full">Uncategorized</span>
              </div>

              {/* Excerpt */}
              <p className="text-xs text-neutral-700 leading-relaxed line-clamp-4">
                {content || 'Start writing your blog post content. This will appear as the excerpt on your WordPress site and in search engine results...'}
              </p>

              {/* Read more + actions */}
              <div className="pt-1 flex items-center justify-between">
                <button type="button" className="text-xs text-[#21759B] font-semibold hover:underline cursor-pointer flex items-center gap-1">
                  Read more
                  <ExternalLink className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-3 text-neutral-400">
                  <button type="button" onClick={() => setIsLiked(!isLiked)} className="flex items-center gap-1 cursor-pointer">
                    <Heart className={cn('w-3.5 h-3.5', isLiked && 'fill-red-500 text-red-500')} />
                    <span className="text-[10px]">{isLiked ? 24 : 23}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px]">7</span>
                  </div>
                  <Share2 className="w-3.5 h-3.5 cursor-pointer" />
                </div>
              </div>

              {/* WP footer */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-300">
                <span>Powered by WordPress</span>
                <WordPressIcon className="w-3.5 h-3.5 fill-neutral-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialPostPreview
