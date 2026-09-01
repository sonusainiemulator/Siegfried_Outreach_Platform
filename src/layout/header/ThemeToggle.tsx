import { Button } from '@/components/ui/button'
import { useAppDirection } from '@/hooks/useAppDirection'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ThemeToggle = () => {
  const { t } = useTranslation()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const direction = useAppDirection()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const toggleTheme = () => {
    const currentResolved = resolvedTheme || theme || 'light'
    const isDark = currentResolved === 'dark'
    const newTheme = isDark ? 'light' : 'dark'

    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    const x = direction === 'rtl' ? 0 : window.innerWidth
    const y = 0

    const transition = document.startViewTransition(() => {
      // Force next-themes to apply the class synchronously inside the transition callback
      // to ensure the screenshot is captured properly before React hydration catches up
      document.documentElement.classList.remove(isDark ? 'dark' : 'light')
      document.documentElement.classList.add(newTheme)
      document.documentElement.style.colorScheme = newTheme

      setTheme(newTheme)
    })

    transition.ready.then(() => {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 700,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="glass-header-card glass-button h-9 w-9 sm:h-11 sm:w-11 group"
    >
      <Moon className="rotate-0 scale-100 dark:-rotate-90 dark:scale-0 w-[18px]! h-[18px]! text-subtitle-color dark:text-white/70 group-hover:text-primary transition-colors duration-300" />
      <Sun className="absolute h-[18px]! w-[18px]! rotate-90 scale-0 transition-all dark:rotate-0 text-white/70 dark:scale-100" />
      <span className="sr-only text-white">{t('toggle_theme')}</span>
    </Button>
  )
}

export default ThemeToggle
