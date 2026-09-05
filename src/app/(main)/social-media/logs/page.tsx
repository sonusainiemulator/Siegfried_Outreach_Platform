import PublishingLogsDashboard from '@/components/feature/social-media/logs/PublishingLogsDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publishing Logs & Telemetry | Siegfried Outreach',
  description: 'Real-time social media publishing telemetry, error diagnostics, and resolution tracking for Siegfried Outreach Platform.',
}

const Page = () => {
  return <PublishingLogsDashboard />
}

export default Page
