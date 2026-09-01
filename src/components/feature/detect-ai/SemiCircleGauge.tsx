import { gaugeColors } from '@/data/aiAnalysis'
import { SemiCircleGaugeProps } from '@/types/components/detectAI'

const SemiCircleGauge = ({ value, label, type = 'ai', size = 220 }: SemiCircleGaugeProps) => {
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius

  const riskVal = Math.max(0, Math.min(100, value))
  const healthVal = 100 - riskVal

  const riskCirc = (riskVal / 100) * circumference
  const healthCirc = (healthVal / 100) * circumference

  return (
    <div
      className="flex flex-col items-center justify-center relative select-none group"
      style={{ width: size, height: size / 2 + 60 }}
    >
      <svg width={size} height={size / 2 + strokeWidth} className="overflow-visible">
        <path
          d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
          fill="none"
          stroke={gaugeColors.track}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <path
          d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
          fill="none"
          stroke={gaugeColors.risk}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${riskCirc} ${circumference}`}
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: riskVal > 0 ? 1 : 0,
            filter: `drop-shadow(0 0 4px ${gaugeColors.risk}40)`,
          }}
        />

        <path
          d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
          fill="none"
          stroke={gaugeColors.health}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${healthCirc} ${circumference}`}
          strokeDashoffset={-riskCirc}
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: healthVal > 0 ? 1 : 0,
            filter: `drop-shadow(0 0 4px ${gaugeColors.health}40)`,
          }}
        />
      </svg>

      <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-center translate-y-2">
        <div className="flex items-baseline">
          <span className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{value.toFixed(0)}</span>
          <span className="text-xs md:text-sm font-bold text-muted-foreground ml-0.5">%</span>
        </div>
        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-0.5">{label}</span>
      </div>

      <div className="absolute bottom-0 flex items-center justify-center gap-2 md:gap-4 w-full pt-3 border-t border-border/10">
        <div className="flex items-center gap-1 md:gap-1.5">
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full" style={{ backgroundColor: gaugeColors.risk }}></div>
          <span className="text-[8px] md:text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">
            {type === 'ai' ? 'AI' : 'Copy'}
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-1.5">
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full" style={{ backgroundColor: gaugeColors.health }}></div>
          <span className="text-[8px] md:text-[9px] font-bold uppercase text-muted-foreground/70 tracking-wider">
            {type === 'ai' ? 'Human' : 'Unique'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SemiCircleGauge
