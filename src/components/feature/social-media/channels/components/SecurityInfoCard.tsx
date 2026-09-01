'use client'

const SecurityInfoCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-border-radius bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h5 className="font-medium text-sm md:text-base text-title-color mb-0 dark:text-white leading-tight">{title}</h5>
      <p className="text-xs md:text-sm text-subtitle-color leading-relaxed font-medium opacity-80">{description}</p>
    </div>
  )
}

export default SecurityInfoCard