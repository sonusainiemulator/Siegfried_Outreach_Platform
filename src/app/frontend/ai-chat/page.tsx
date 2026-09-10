import AiChatFrontend from '@/components/frontend/ai-chat/AiChatFrontend'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chat Assistant | TTOS',
  description:
    'Chat with TTOS — your intelligent assistant. Select a model, send prompts, attach files and manage your chat history all in one sleek interface.',
}

export default function AiChatFrontendPage() {
  return <AiChatFrontend />
}
