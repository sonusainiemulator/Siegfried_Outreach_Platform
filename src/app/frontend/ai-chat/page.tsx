import AiChatFrontend from '@/components/frontend/ai-chat/AiChatFrontend'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chat Assistant | Siegfried Outreach - Social Media Marketing Agency',
  description:
    'Chat with Siegfried Outreach AI — your intelligent multi-model marketing assistant. Select top-tier AI models, send prompts, attach files, and manage conversation history in one sleek interface.',
  alternates: {
    canonical: 'https://siegfriedoutreach.com/frontend/ai-chat',
  },
  openGraph: {
    title: 'AI Chat Assistant | Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Chat with Siegfried Outreach AI — your intelligent multi-model assistant with prompt generation, code assistance, and file analysis.',
    url: 'https://siegfriedoutreach.com/frontend/ai-chat',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach AI Chat Assistant',
      },
    ],
  },
}

export default function AiChatFrontendPage() {
  return <AiChatFrontend />
}
