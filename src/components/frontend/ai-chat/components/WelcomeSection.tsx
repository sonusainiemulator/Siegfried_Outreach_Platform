import { Button } from '@/components/ui/button'
import { campaignhubPrompts } from '@/data/landing'
import { WelcomeSectionProps } from '@/types/aiChatFrontend'
import { motion } from 'framer-motion'
import { BotAvatar } from './BotAvatar'
import { PROMPT_SUGGESTIONS } from './constants'
import { HorizontalTicker } from './HorizontalTicker'

export const WelcomeSection = ({ selectedBot, setInput }: WelcomeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] text-center max-w-4xl mx-auto space-y-10"
    >
      <div className="relative group mb-3">
        <BotAvatar bot={selectedBot} size="lg" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"
        />
      </div>

      <div className="space-y-4 sm:mb-2 mb-0">
        <h2 className="sm:text-4xl text-3xl mb-1 font-semibold tracking-tight leading-tight text-black dark:text-white">
          I'm <span className="title-color">{selectedBot?.name || 'Your AI Companion'}</span>
        </h2>
        <p className="text-md font-medium max-w-2xl mx-auto text-subtitle-color dark:text-muted-foreground line-clamp-3">
          {selectedBot?.description ||
            'Your intelligent creative assistant. I can help with code, content, marketing, or general daily tasks.'}
        </p>
      </div>

      <div className="w-full relative sm:py-6 sm:mb-2 mb-0">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-light-body dark:from-black to-transparent z-10 pointer-events-none hidden sm:block" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-light-body dark:from-black to-transparent z-10 pointer-events-none hidden sm:block" />
        <HorizontalTicker prompts={PROMPT_SUGGESTIONS} onSelect={(p) => setInput(p)} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {campaignhubPrompts.map((tag: string) => (
          <Button
            key={tag}
            onClick={() => setInput(tag.split(' ').slice(1).join(' '))}
            className="p-button-padding! rounded-full border border-border/40 hover:border-primary/50 text-sm font-bold bg-muted/20 hover:text-primary hover:bg-primary/5 transition-all"
            variant="ghost"
          >
            {tag}
          </Button>
        ))}
      </div>
    </motion.div>
  )
}
