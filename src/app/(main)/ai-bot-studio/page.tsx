'use client'

import ChatbotDashboard from '@/components/feature/chatbot-builder/ChatbotDashboard'
import ChatbotForm from '@/components/feature/chatbot-builder/ChatbotForm'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AIChatbotsPage() {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Chatbots', 'write')
  const [view, setView] = useState<'dashboard' | 'create'>('dashboard')

  const handleCreateNew = () => {
    setView('create')
  }

  const handleEdit = (chatbotId: string) => {
    router.push(`${ROUTES.CHATBOT_BUILDER}/${chatbotId}`)
  }

  const handleBackToDashboard = () => {
    setView('dashboard')
  }

  if (view === 'create') {
    return <ChatbotForm chatbotId={null} onBack={handleBackToDashboard} isEditing={false} />
  }

  return (
    <div className="space-y-6">
      <ChatbotDashboard onEdit={handleEdit} onCreateNew={handleCreateNew} canManage={canManage} />
    </div>
  )
}
