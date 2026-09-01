import useSettings from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { getMediaUrl } from '@/utils'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const SidebarLogo = ({ isCollapsed, onClick }: { isCollapsed?: boolean; onClick?: () => void }) => {
  const { settings } = useSettings()
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 100)
  }, [])

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'

  // Brand Logo 1: Expanded (Main Brand Logo)
  const expandedLogoLight = settings?.logo_light_url ? getMediaUrl(settings.logo_light_url) : '/images/dark-logo2.png'
  const expandedLogoDark = settings?.logo_dark_url ? getMediaUrl(settings.logo_dark_url) : '/images/light-logo2.png'
  const expandedLogoUrl = currentTheme === 'dark' ? expandedLogoDark : expandedLogoLight
  
  // Brand Logo 2: Collapsed (Small Logo/Icon)
  const collapsedLogoUrl = settings?.sidebar_logo_url ? getMediaUrl(settings.sidebar_logo_url) : '/images/logo.png'

  const appName = settings?.app_name || 'Siegfried Outreach'

  return (
    <div className={cn('px-5 py-4', isCollapsed && 'px-0 py-3')} onClick={onClick}>
      <div className="relative flex items-center w-full h-14 sm:h-16 cursor-pointer overflow-hidden group">
        
        {/* Collapsed Logo (Brand Logo 2) */}
        <div 
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500', 
            isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
          )}
        >
          <Image src={collapsedLogoUrl as string} alt={appName} width={50} height={50} unoptimized className="w-10 h-10 object-contain p-0.5" />
        </div>

        {/* Expanded Logo (Brand Logo 1) */}
        <div 
          className={cn(
            'absolute inset-0 flex items-center justify-start transition-all duration-500 origin-left rtl:origin-right', 
            isCollapsed ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
          )}
        >
          <Image src={expandedLogoUrl as string} alt={appName} width={260} height={60} unoptimized className="w-auto h-12 sm:h-14 max-h-14 max-w-[220px] object-contain" />
        </div> 

      </div>
    </div>
  )
}

export default SidebarLogo
