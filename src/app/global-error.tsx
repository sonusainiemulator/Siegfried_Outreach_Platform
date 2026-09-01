'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0C10] text-white flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="max-w-xl w-full bg-white/5 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Global System Error</h2>
            <p className="text-sm text-gray-400">
              A critical layout error occurred.
            </p>
          </div>

          <div className="text-left bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-red-400 font-semibold uppercase tracking-wider">Debug Info</div>
            <div className="text-gray-300 font-bold break-all">
              {error?.message || 'Unknown Error'}
            </div>
            {error?.digest && (
              <div className="text-gray-500 text-[11px]">
                Digest: <span className="text-gray-400">{error.digest}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all shadow-lg cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
