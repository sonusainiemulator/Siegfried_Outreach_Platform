import PublishingLogsDashboard from '@/components/feature/social-media/logs/PublishingLogsDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publishing Logs & Telemetry | TTOS',
  description: 'Real-time social media publishing telemetry, error diagnostics, and resolution tracking for TTOS Platform.',
}

const Page = () => {
  return <PublishingLogsDashboard />
}

export default Page
