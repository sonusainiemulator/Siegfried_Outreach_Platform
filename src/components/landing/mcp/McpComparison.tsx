'use client'

import { mcpComparisonData } from '@/data/landingMcp'
import {
  Check,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function McpComparison() {
  return (
    <section id="comparison" className="py-24 bg-[#070A10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Honest Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            How Does Siegfried MCP Compare to Other Servers?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Compare Siegfried against other social media automation APIs and MCP servers.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl bg-[#0D121F] border border-white/10 overflow-hidden shadow-2xl shadow-black/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#131A2B]">
                  <th className="p-5 font-bold text-gray-300 w-1/3">Feature / Capability</th>
                  <th className="p-5 font-extrabold text-indigo-300 bg-indigo-950/40 border-x border-indigo-500/20 text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Siegfried MCP
                    </span>
                  </th>
                  <th className="p-5 font-semibold text-gray-400 text-center">Ayrshare</th>
                  <th className="p-5 font-semibold text-gray-400 text-center">Zernio</th>
                  <th className="p-5 font-semibold text-gray-400 text-center">Outstand</th>
                  <th className="p-5 font-semibold text-gray-400 text-center">Postiz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mcpComparisonData.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-semibold text-white">
                      {row.feature}
                    </td>

                    {/* Siegfried column (highlighted) */}
                    <td className="p-5 bg-indigo-950/20 border-x border-indigo-500/20 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Check className="w-4 h-4" />
                        </span>
                        <span className="text-[11px] text-indigo-200 font-medium">
                          {row.siegfried.note}
                        </span>
                      </div>
                    </td>

                    {/* Ayrshare */}
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {row.ayrshare?.supported ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">{row.ayrshare?.note}</span>
                      </div>
                    </td>

                    {/* Zernio */}
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {row.zernio?.supported ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">{row.zernio?.note}</span>
                      </div>
                    </td>

                    {/* Outstand */}
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {row.outstand?.supported ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">{row.outstand?.note}</span>
                      </div>
                    </td>

                    {/* Postiz */}
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {row.postiz?.supported ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">{row.postiz?.note}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
