import CampaignHubHeader from '@/components/landing/campaign-hub/CampaignHubHeader'
import CampaignHubFooter from '@/components/landing/campaign-hub/CampaignHubFooter'
import { SectionRefsProvider } from '@/context/SectionRefsContext'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Deletion Instructions | Siegfried Outreach',
  description: 'Instructions on how to delete your personal data collected via Facebook Login on Siegfried Outreach.',
}

export default function DataDeletionPage() {
  return (
    <SectionRefsProvider>
      <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col">
        <CampaignHubHeader />
        <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Data Deletion Instructions</h1>
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary/80">
            <p>
              Siegfried Outreach uses Facebook Login to authenticate users and provide a seamless integration with Facebook social media features. 
              In compliance with Facebook's platform policies, we provide this page to instruct users on how to delete their activities and associated data from our application.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">How to Delete Your Data</h2>
            <p>
              If you wish to delete your activities or request deletion of data associated with Siegfried Outreach, you can do so by following these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Go to your Facebook Profile's <strong>Settings & Privacy</strong> and click on <strong>Settings</strong>.
              </li>
              <li>
                In the left menu, scroll down and click on <strong>Apps and Websites</strong>.
              </li>
              <li>
                Find and select <strong>Siegfried Outreach</strong> from the list of active apps.
              </li>
              <li>
                Click the <strong>Remove</strong> button next to the app name.
              </li>
              <li>
                Confirm the removal. Once removed, our app will no longer have access to your Facebook information.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Requesting Manual Data Deletion</h2>
            <p>
              Alternatively, if you want us to completely erase all user account records and data collected from your Facebook profile from our servers, please send an email request:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Email:</strong> <a href="mailto:chris@siegfriedmarketing.org">chris@siegfriedmarketing.org</a>
              </li>
              <li>
                <strong>Subject:</strong> Facebook Data Deletion Request
              </li>
              <li>
                <strong>Details:</strong> Please provide your registered email address or account ID associated with the platform.
              </li>
            </ul>
            <p>
              Upon receiving your request, our support team will verify your identity and delete all associated personal data from our databases within 30 days. You will receive a confirmation email once the process is complete.
            </p>
          </div>
        </main>
        <CampaignHubFooter />
      </div>
    </SectionRefsProvider>
  )
}
