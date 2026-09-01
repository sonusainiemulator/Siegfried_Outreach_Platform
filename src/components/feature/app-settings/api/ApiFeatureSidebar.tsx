import { features } from '@/data/userSetting'
import { cn } from '@/lib/utils'

const ApiFeatureSidebar = () => {
  return (
    <div className="xl:col-span-12 2xl:col-span-4 space-y-10">
      {features.map((card, idx) => (
        <div
          key={idx}
          className="p-8 rounded-[3rem] bg-card/60 border border-border/40 backdrop-blur-xl shadow-lg group hover:shadow-2xl transition-all"
        >
          <div
            className={cn(
              'h-14 w-14 rounded-2xl flex items-center justify-center mb-6 border border-border/10 shadow-inner',
              card.color,
            )}
          >
            <card.icon className="h-7 w-7" />
          </div>
          <h5 className="text-xl font-medium text-title-color mb-3">{card.title}</h5>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default ApiFeatureSidebar
