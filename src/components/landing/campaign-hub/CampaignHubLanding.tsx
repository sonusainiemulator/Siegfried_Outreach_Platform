'use client';
import { SectionRefsProvider } from '@/context/SectionRefsContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import CampaignHubAIAutomation from './CampaignHubAIAutomation';
import CampaignHubCapabilities from './CampaignHubCapabilities';
import CampaignHubCTABanner from './CampaignHubCTABanner';
import CampaignHubFAQ from './CampaignHubFAQ';
import CampaignHubFeatures from './CampaignHubFeatures';
import CampaignHubFooter from './CampaignHubFooter';
import CampaignHubHeader from './CampaignHubHeader';
import CampaignHubHero from './CampaignHubHero';
import CampaignHubLogoStrip from './CampaignHubLogoStrip';
import CampaignHubPricing from './CampaignHubPricing';
import CampaignHubScrollToTop from './CampaignHubScrollToTop';
import CampaignHubTestimonials from './CampaignHubTestimonials';
import CampaignHubTopTierCapabilities from './CampaignHubTopTierCapabilities';

const CampaignHubLanding = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <SectionRefsProvider>
      <div className={[
        isDark ? 'dark' : '',
        'min-h-screen text-foreground overflow-x-hidden',
        isDark
          ? 'bg-gradient-to-br from-landing-bg-dark via-landing-bg-deep to-landing-bg-dark'
          : 'bg-slate-50',
      ].join(' ')}>
        <CampaignHubHeader />
        <main>
          <CampaignHubHero />
          <CampaignHubLogoStrip />
          <CampaignHubTopTierCapabilities />
          <CampaignHubFeatures />
          <CampaignHubCapabilities />
          <CampaignHubAIAutomation />
          <CampaignHubTestimonials />
          <CampaignHubCTABanner />
          <CampaignHubPricing />
          <CampaignHubFAQ />
        </main>
        <CampaignHubFooter />
        <CampaignHubScrollToTop />
      </div>
    </SectionRefsProvider>
  )
}

export default CampaignHubLanding
