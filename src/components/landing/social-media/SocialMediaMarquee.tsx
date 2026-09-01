'use client'

import { Star } from 'lucide-react'
import { marqueeItems } from '../../../data/landingSocialMedia'

export default function SocialMediaMarquee() {
  return (
    <div className="py-5 border-y border-border/40 overflow-hidden relative">
      <div className="flex gap-10 animate-[marquee_25s_linear_infinite] whitespace-nowrap w-max">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span
            key={i}
            className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-3"
          >
            <Star className="w-3 h-3 text-primary fill-primary" /> {item}
          </span>
        ))}
      </div>
    </div>
  )
}
