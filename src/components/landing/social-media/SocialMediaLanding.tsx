'use client'

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { SectionRefsProvider } from '@/context/SectionRefsContext'
import CampaignHubScrollToTop from '../campaign-hub/CampaignHubScrollToTop'
import SocialMediaCTABanner from './SocialMediaCTABanner'
import SocialMediaFAQ from './SocialMediaFAQ'
import SocialMediaFeatures from './SocialMediaFeatures'
import SocialMediaFooter from './SocialMediaFooter'
import SocialMediaHeader from './SocialMediaHeader'
import SocialMediaHero from './SocialMediaHero'
import SocialMediaHowItWorks from './SocialMediaHowItWorks'
import SocialMediaMarquee from './SocialMediaMarquee'
import SocialMediaPlatforms from './SocialMediaPlatforms'
import SocialMediaPricing from './SocialMediaPricing'
import SocialMediaTestimonials from './SocialMediaTestimonials'

const SocialMediaLanding = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <SectionRefsProvider>
      <div className={[isDark ? 'dark' : '', 'min-h-screen text-foreground overflow-x-hidden relative selection:bg-primary/30', isDark ? 'bg-dark-deep' : 'bg-slate-50'].join(' ')}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[calc(900px+(1400-500)*((100vw-320px)/(1920-320)))] h-[calc(650px+(800-650)*((100vw-320px)/(1920-320)))] bg-primary/10 rounded-[100%] blur-[120px] opacity-60" />

          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-[100%] blur-[100px] opacity-40" />

        </div>

        <div className="relative z-10">
          <SocialMediaHeader />
          <main>
            <SocialMediaHero />
            <SocialMediaFeatures />
            <SocialMediaMarquee />
            <SocialMediaPlatforms />
            <SocialMediaHowItWorks />
            <SocialMediaTestimonials />
            <SocialMediaCTABanner />
            <SocialMediaPricing />
            <SocialMediaFAQ />
          </main>
          <SocialMediaFooter />
          <CampaignHubScrollToTop />
        </div>
      </div>
    </SectionRefsProvider>
  )
}

export default SocialMediaLanding
