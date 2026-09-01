import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export const HorizontalTicker = ({ prompts, onSelect }: { prompts: string[]; onSelect: (p: string) => void }) => {
  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      <div className="flex animate-marquee whitespace-nowrap gap-4">
        {[...prompts, ...prompts].map((prompt: string, i: number) => (
          <Button
            key={i}
            onClick={() => onSelect(prompt)}
            className="flex items-center gap-2 px-5 py-2.5 mb-3 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  )
}
