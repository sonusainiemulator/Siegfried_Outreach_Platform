import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SmartWriterEmpty = () => {
  const { t } = useTranslation()

  return (
    <motion.div
      key="canvas-empty"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="h-full min-h-[500px] flex flex-col items-center justify-center relative p-8 bg-white/40 dark:bg-white/[0.02] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-border-radius"
    >
      <div className="max-w-xl text-center space-y-6">
        <div className="relative inline-block mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-tr from-primary to-indigo-500 blur-3xl opacity-20 rounded-full"
          />
          <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center relative z-10 mx-auto">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-medium mb-0 title-color dark:text-white capitalize tracking-tighter">
          {t('your_creative_canvas', { defaultValue: 'Your Creative Canvas' })}
        </h2>
        <p className="text-subtitle-color font-medium text-base opacity-60 leading-relaxed">
          {t('select_template_journey')}
        </p>
      </div>
    </motion.div>
  )
}

export default SmartWriterEmpty
