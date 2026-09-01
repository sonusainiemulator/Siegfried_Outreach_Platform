
'use client'

import ChatbotCard from '@/components/feature/chat-assistant/ChatbotCard'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useGetChatbotsQuery, useToggleChatbotFavoriteMutation } from '@/redux/api/chatbotApi'
import { ApiError, Chatbot } from '@/types'
import { motion } from 'framer-motion'
import { ArrowLeft, Bot, Filter, Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const AIChatListPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canViewChatbots = hasPermission('View Chatbots', 'read')

  const { data, isLoading } = useGetChatbotsQuery({}, { skip: !canViewChatbots })
  const [toggleFavoriteMutation] = useToggleChatbotFavoriteMutation()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('all')

  const toggleFavorite = async (e: React.MouseEvent, botId: string) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const res = await toggleFavoriteMutation(botId).unwrap()
      console.log(res.message)
    } catch (error) {
      const apiError = error as ApiError
      console.log(apiError?.data?.message || 'Failed to update favorite status')
    }
  }

  const categories = [
    'All',
    'Favorites',
    'Personal Assistants',
    'Learning & Education',
    'Personal Development',
    'Technical Support',
    'Entertainment',
  ]
  const [activeCategory, setActiveCategory] = useState('All')
  const tabsRef = React.useRef<Map<string, HTMLButtonElement | null>>(new Map())
  const [, setBubbleStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 })

  useEffect(() => {
    // Small delay to ensure layout has shifted correctly (fonts/HMR)
    const timeout = setTimeout(() => {
      const activeTab = tabsRef.current.get(activeCategory)
      if (activeTab) {
        setBubbleStyle({
          left: activeTab.offsetLeft,
          top: activeTab.offsetTop,
          width: activeTab.offsetWidth,
          height: activeTab.offsetHeight,
          opacity: 1,
        })
      }
    }, 50)
    return () => clearTimeout(timeout)
  }, [activeCategory, isLoading, data])

  const filteredChatbots = useMemo(() => {
    if (!data?.agents) return []
    return data.agents.filter((bot: Chatbot) => {
      const creatorRole = bot.createdBy?.role?.toLowerCase()
      const isAdminBot = creatorRole === 'admin' || creatorRole === 'super_admin'
      const matchesSearch =
        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Favorites' && bot.isFavorite) ||
        (activeCategory !== 'Favorites' && bot.category === activeCategory)

      const matchesSortBy = sortBy === 'all' || (sortBy === 'favorite' && bot.isFavorite)

      return isAdminBot && matchesSearch && matchesCategory && matchesSortBy
    })
  }, [data, searchQuery, activeCategory, sortBy])

  if (isLoading) {
    return <Spinner />
  }

  if (!canViewChatbots) {
    return (
      <div className="flex flex-col items-center justify-center py-20  rounded-border-radius glass-card glass-dark-card m-8">
        <div className="bg-primary/10 sm:p-6 p-4 rounded-[8px] mb-6 transform ">
          <Bot className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-medium text-title-color dark:text-white mb-2">
          {t('access_denied', { defaultValue: 'Access Denied' })}
        </h2>
        <p className="text-subtitle-color text-sm max-w-sm text-center">
          {t('no_permission_view_chatbots', { defaultValue: 'You do not have permission to view AI chatbots.' })}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-3">
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
            <h1 className="text-3xl font-bold tracking-tight text-title-color title-color dark:text-white leading-[1.1]">
              {t('chat_assistant')}
            </h1>
          </div>
        </div>
        <div className="relative w-full md:w-87.5 group">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground   transition-colors" />
          <Input
            placeholder={t('search_chatbots', { defaultValue: 'Search specialized chatbots...' })}
            className="pl-11 rtl:pl-0 rtl:pr-11 h-12 inner-card glass-dark-card rounded-[8px] focus-visible:ring-primary/20 transition-all border"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories / Filter Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5 xl:mb-0">
        <div className="relative group/filters">
          <div className="flex items-center gap-2 pt-2 px-1 justify-center xl:justify-start">
            <div className="flex items-center gap-1.5 p-1.5 rounded-[8px] relative flex-wrap justify-center inner-card glass-dark-card">
              <div className="absolute bg-light-gray dark:bg-muted-foreground/10 text-light-text-color rounded-[8px] transition-all duration-500 shadow-sm z-0" />

              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <Button
                    key={cat}
                    variant="ghost"
                    ref={(el) => {
                      tabsRef.current.set(cat, el)
                    }}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'relative z-10 hover:bg-transparent text-sm h-10 font-medium transition-all p-3! duration-300 whitespace-nowrap outline-none',
                      isActive
                        ? 'bg-primary text-white dark:text-white hover:text-white hover:bg-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {cat}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-center xl:self-end">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t('sort_by')}:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-11 inner-card glass-dark-card shadow-none rounded-[8px] focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <SelectValue placeholder={t('select_option')} />
              </div>
            </SelectTrigger>
            <SelectContent className="inner-card dark:glass-dark-card border-border/40 rounded-[12px]">
              <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10 rounded-[6px] transition-colors cursor-pointer">
                {t('all')}
              </SelectItem>
              <SelectItem value="favorite" className="hover:bg-primary/10 focus:bg-primary/10 rounded-[6px] transition-colors cursor-pointer">
                {t('favorite')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Section */}
      {filteredChatbots.length > 0 ? (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="grid [@media(max-width:470px)]:grid-cols-1! pt-6  md720:grid-cols-2! xl1095:grid-cols-3! lg:grid-cols-3 xl1570:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {filteredChatbots.map((bot) => (
            <ChatbotCard key={bot.id} bot={bot} isFavorite={!!bot.isFavorite} onToggleFavorite={toggleFavorite} />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 mt-6 bg-muted/20 rounded-border-radius border glass-card glass-dark-card border-dashed border-muted shadow-inner">
          <div className="bg-blue-gray/10 p-5 rounded-border-radius shadow-lg mb-6 transform -rotate-6">
            <Sparkles className="w-11 h-11 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-title-color dark:text-white mb-2">{t('no_chatbots_found')}</h2>
          <p className="text-subtitle-color text-sm text-center">
            {t('no_admin_chatbots_desc', {
              defaultValue: 'Try searching for something else or check back later for new specialized AI assistants.',
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default AIChatListPage
