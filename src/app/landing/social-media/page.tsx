import SocialMediaLanding from '@/components/landing/social-media/SocialMediaLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Studio | Siegfried Outreach',
  description:
    'Boost your social media growth with AI. Create, schedule and publish stunning content for Instagram, Facebook, LinkedIn and Twitter/X — all from one platform.',
}

const SocialMediaLandingPage = () => {
  return <SocialMediaLanding />
}

export default SocialMediaLandingPage
