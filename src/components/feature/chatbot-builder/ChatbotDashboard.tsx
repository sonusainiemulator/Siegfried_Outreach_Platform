'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { count } from '@/data/dashboard'
import { cn } from '@/lib/utils'
import { useDeleteChatbotMutation, useGetChatbotsQuery, useToggleChatbotStatusMutation } from '@/redux/api/chatbotApi'
import { ApiError, ChatbotDashboardProps } from '@/types'
import { ArrowLeft, Bot, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ChatbotCard from './ChatbotCard'

const ChatbotDashboard = ({ onEdit, onCreateNew, canManage }: ChatbotDashboardProps) => {
  const { t } = useTranslation()
  const { data, isLoading } = useGetChatbotsQuery({ page: 1, limit: 20 })
  const [deleteChatbot, { isLoading: isDeleting }] = useDeleteChatbotMutation()
  const [toggleStatus] = useToggleChatbotStatusMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [chatbotToDelete, setChatbotToDelete] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const router = useRouter()

  const stats = {
    totalBots: data?.agents?.length || 0,
    activeBots: data?.agents?.filter((b) => b.isActive)?.length || 0,
    inactiveBots: data?.agents?.filter((b) => !b.isActive)?.length || 0,
  }

  const filteredAgents = data?.agents?.filter((chatbot) => {
    if (filter === 'active') return chatbot.isActive
    if (filter === 'inactive') return !chatbot.isActive
    return true
  })

  const handleDelete = (id: string) => {
    setChatbotToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!chatbotToDelete) return
    try {
      const res = await deleteChatbot(chatbotToDelete).unwrap()
      toast.success(res.message || t('chatbot_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setChatbotToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_chatbot'))
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await toggleStatus(id).unwrap()
      toast.success(result.message || (result.isActive ? t('chatbot_activated') : t('chatbot_deactivated')))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status'))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero/Stats Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-10 py-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20  hover:text-primary rounded-[8px] transition-all w-11 h-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <div className="flex items-start flex-col">
              <h1 className="text-3xl font-bold title-color leading-tight">
                {t('chatbot_builder', { defaultValue: 'Chatbot Builder' })}
              </h1>

            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 justify-center">

            {canManage && (
              <Button
                onClick={onCreateNew}
                size="lg"
                className="rounded-[8px] font-medium sm:h-12 h-10  btn-color text-white transition-all text-base p-button-padding!"
              >
                <Plus className="h-5 w-5" />
                {t('create_new_chatbot', { defaultValue: 'Create New Chatbot' })}
              </Button>
            )}
            <CreditLimitPill />
          </div>
        </div>
      </div>

      <div className="grid xxl:grid-cols-8 xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 ">
        <div
          onClick={() => setFilter('all')}
          className={cn(
            'flex flex-row gap-2 items-center text-center justify-center inner-card glass-dark-card backdrop-blur-md rounded-[8px] p-2 cursor-pointer transition-all border border-transparent',
            filter === 'all' ? 'ring-1 ring-primary border-primary/50 bg-primary/5' : 'hover:bg-primary/5',
          )}
        >
          <span className="text-subtitle-color text-base font-medium ">
            {t('total_bots', { defaultValue: 'Total Bots' })}
          </span>
          <span className="text-lg font-medium text-primary tracking-tighter">{stats.totalBots}</span>
        </div>
        <div
          onClick={() => setFilter('active')}
          className={cn(
            'flex flex-row gap-2 items-center text-center justify-center inner-card glass-dark-card backdrop-blur-md rounded-[8px] p-2 cursor-pointer transition-all border border-transparent',
            filter === 'active' ? 'ring-1 ring-emerald-400 border-emerald-400/50 bg-emerald-400/5' : 'hover:bg-primary/5',
          )}
        >
          <span className="text-subtitle-color text-base font-medium ">
            {t('active', { defaultValue: 'Active' })}
          </span>
          <span className="text-lg font-medium text-emerald-400 tracking-tighter">{stats.activeBots}</span>
        </div>
        <div
          onClick={() => setFilter('inactive')}
          className={cn(
            'flex flex-row gap-2 items-center text-center justify-center inner-card glass-dark-card backdrop-blur-md rounded-[8px] p-2 cursor-pointer transition-all border border-transparent',
            filter === 'inactive' ? 'ring-1 ring-red-400 border-red-400/50 bg-red-400/5' : 'hover:bg-primary/5',
          )}
        >
          <span className="text-subtitle-color text-base font-medium ">
            {t('inactive', { defaultValue: 'Inactive' })}
          </span>
          <span className="text-lg font-medium text-red-400 tracking-tighter">{stats.inactiveBots}</span>
        </div>

      </div>

      {/* Active Chatbots Section */}
      <div className="pt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {count.map((i) => (
              <Card key={i} className="p-4 rounded-2xl glass-card glass-dark-card!">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredAgents && filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 [@media(max-width:1535px)]:grid-cols-3 [@media(max-width:850px)]:grid-cols-2 md575:grid-cols-1! xl:grid-cols-4 gap-6">
            {filteredAgents.map((chatbot) => (
              <ChatbotCard
                key={chatbot.id}
                chatbot={chatbot}
                onEdit={() => onEdit(chatbot.id)}
                onDelete={() => handleDelete(chatbot.id)}
                onToggleStatus={() => handleToggleStatus(chatbot.id)}
                canManage={canManage}
              />
            ))}
          </div>
        ) : (
          <Card className="sm:p-20 p-8 border-dashed border-2 bg-muted/20 rounded-[2rem] glass-dark-card flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 rounded-3xl bg-muted/10 flex items-center justify-center mb-8 shadow-2xl border border-border/40 group overflow-hidden">
              <Bot className="h-12 w-12 text-muted-foreground group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {t('no_chatbots_found', { defaultValue: 'No chatbots found' })}
            </h3>
            <p className="text-muted-foreground mb-10 max-w-sm text-base leading-relaxed">
              {t('create_first_chatbot', {
                defaultValue: 'You haven’t created any AI agents yet. Start by building your first bot.',
              })}
            </p>
            <Button onClick={onCreateNew} size="lg" className="rounded-2xl px-12 h-14 font-bold text-base">
              <Plus className=" h-6 w-6" />
              {t('create_your_first_bot', { defaultValue: 'Create Your First Bot' })}
            </Button>
          </Card>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_chatbot_title', { defaultValue: 'Delete Chatbot' })}
        description={t('delete_chatbot_description', {
          defaultValue: 'Are you sure you want to delete this chatbot? This action cannot be undone.',
        })}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ChatbotDashboard
