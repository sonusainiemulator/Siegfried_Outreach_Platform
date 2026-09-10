import AiChatFrontend from '@/components/frontend/ai-chat/AiChatFrontend'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chat Assistant | Multi-Model Autonomous Intelligence',
  description:
    'Chat with TTOS — your intelligent multi-model assistant. Select top-tier AI models, send prompts, attach files, and manage conversation history in one sleek interface.',
  alternates: {
    canonical: 'https://ttai.in/frontend/ai-chat',
  },
  openGraph: {
    title: 'AI Chat Assistant | Multi-Model Autonomous Intelligence | TTOS',
    description:
      'Chat with TTOS — your intelligent multi-model assistant with prompt generation, code assistance, and file analysis.',
    url: 'https://ttai.in/frontend/ai-chat',
    siteName: 'TTOS',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS AI Chat Assistant',
      },
    ],
  },
}

export default function AiChatFrontendPage() {
  return <AiChatFrontend />
}
