'use client'

import ChatbotForm from '@/components/feature/chatbot-builder/ChatbotForm'
import { ROUTES } from '@/constants/routes'
import { useParams, useRouter } from 'next/navigation'

export default function ChatbotEditPage() {
  const router = useRouter()
  const params = useParams()
  const chatbotId = params.chatbotId as string

  const handleBack = () => {
    router.push(ROUTES.CHATBOT_BUILDER)
  }

  return (
    <div className="space-y-6">
      <ChatbotForm chatbotId={chatbotId} onBack={handleBack} isEditing={true} />
    </div>
  )
}
