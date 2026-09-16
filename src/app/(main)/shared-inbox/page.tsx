import SharedInboxDashboard from '@/components/feature/inbox/SharedInboxDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shared Inbox | Siegfried Outreach Platform',
  description: 'Omnichannel Shared Inbox with real-time customer messaging, internal team notes, CRM synchronization, and AI Copilot.',
}

export default function SharedInboxPage() {
  return <SharedInboxDashboard />
}
