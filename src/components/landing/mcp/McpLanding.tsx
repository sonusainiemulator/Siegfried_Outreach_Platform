'use client'

import McpHeader from './McpHeader'
import McpHero from './McpHero'
import McpPlatforms from './McpPlatforms'
import McpToolsCatalog from './McpToolsCatalog'
import McpPlayground from './McpPlayground'
import McpClientGuides from './McpClientGuides'
import McpWorkflows from './McpWorkflows'
import McpComparison from './McpComparison'
import McpFAQ from './McpFAQ'
import McpCTA from './McpCTA'
import McpFooter from './McpFooter'

export default function McpLanding() {
  return (
    <div className="min-h-screen bg-[#070A10] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden">
      <McpHeader />
      <main id="main">
        <McpHero />
        <McpPlatforms />
        <McpToolsCatalog />
        <McpPlayground />
        <McpClientGuides />
        <McpWorkflows />
        <McpComparison />
        <McpFAQ />
        <McpCTA />
      </main>
      <McpFooter />
    </div>
  )
}
