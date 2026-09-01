'use client'

import { useGetPageBySlugQuery } from '@/redux/api/pageApi'
import { SectionRefsProvider } from '@/context/SectionRefsContext'
import CampaignHubHeader from '@/components/landing/campaign-hub/CampaignHubHeader'
import CampaignHubFooter from '@/components/landing/campaign-hub/CampaignHubFooter'

export default function PageClient({ slug }: { slug: string }) {
  const { data, isLoading, error } = useGetPageBySlugQuery(slug)

  if (isLoading) {
    return (
      <SectionRefsProvider>
        <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col">
          <CampaignHubHeader />
          <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-700/50 rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                <div className="h-4 bg-gray-700/50 rounded w-4/5"></div>
              </div>
            </div>
          </main>
          <CampaignHubFooter />
        </div>
      </SectionRefsProvider>
    )
  }

  if (error || !data || !data.page) {
    return (
      <SectionRefsProvider>
        <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col">
          <CampaignHubHeader />
          <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Page Not Found</h1>
              <p className="text-lg text-gray-400">The page you are looking for does not exist or has been removed.</p>
            </div>
          </main>
          <CampaignHubFooter />
        </div>
      </SectionRefsProvider>
    )
  }

  const { page } = data

  return (
    <SectionRefsProvider>
      <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col">
        <CampaignHubHeader />
        <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
          {page.content ? (
            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-gray-400 text-lg">This page has no content.</p>
          )}
        </main>
        <CampaignHubFooter />
      </div>
    </SectionRefsProvider>
  )
}
