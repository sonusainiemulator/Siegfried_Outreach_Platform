'use client'

import { useState } from 'react'
import { mcpFaqs } from '@/data/landingMcp'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function McpFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-[#090D16] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Developer & Protocol Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-base">
            Everything you need to know about our hosted MCP server architecture, rate limits, and security.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {mcpFaqs.map((faq, index) => {
            const isOpen = openIdx === index
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0D121F] border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-white hover:text-indigo-300 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold font-outfit">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
