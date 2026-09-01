'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to browser console for debugging
    console.error('Frontend Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full bg-white/5 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400">
            An unexpected client-side error occurred while rendering this page.
          </p>
        </div>

        {/* Debug Information Box */}
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
          {error?.stack && (
            <details className="mt-2 text-gray-500 cursor-pointer">
              <summary className="hover:text-gray-300 transition-colors">View Stack Trace</summary>
              <pre className="mt-2 text-[10px] text-red-300/80 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}
