'use client'

import { useTranslation } from 'react-i18next'

const EmptyState = () => {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
        {t('design_amazing_presentations', { defaultValue: 'Design Amazing Presentations' })}
      </h2>
      <p className="text-slate-500 dark:text-zinc-400 text-lg">
        {t('design_amazing_desc', {
          defaultValue: 'Enter your topic or outline, and SlideMaker AI will draft a complete professional deck in seconds.',
        })}
      </p>
    </div>
  )
}

export default EmptyState
