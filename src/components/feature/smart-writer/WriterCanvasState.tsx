import { WriterCanvasStateProps } from '@/types'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const WriterCanvasState: React.FC<WriterCanvasStateProps> = ({ isGenerating }) => {
  const { t } = useTranslation()

  if (isGenerating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="space-y-8 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-indigo-500/10 flex items-center justify-center relative">
            <motion.div
              className="absolute inset-[-4px] rounded-full border-[3px] border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-indigo-500 animate-pulse" />
          </div>
          <div className="space-y-2 sm:space-y-3 text-center px-4">
            <span className="text-md font-medium  text-title-color dark:text-white block">
              {t('generating_content')}
            </span>
            <span className="text-sm font-medium text-subtitle-color  animate-pulse">{t('almost_there')}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full" />
        <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 text-primary" />
      </motion.div>

      <div className="space-y-4 max-w-xs sm:max-w-sm px-4">
        <h3 className="text-3xl font-medium tracking-tight text-title-color dark:text-white">{t('your_document')}</h3>
        <p className="text-subtitle-color font-medium text-xs sm:text-sm">{t('generate_to_start')}</p>
      </div>
    </div>
  )
}

export default WriterCanvasState
