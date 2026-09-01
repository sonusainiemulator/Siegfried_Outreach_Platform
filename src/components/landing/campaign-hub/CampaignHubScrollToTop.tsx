'use client'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CampaignHubScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const { scrollYProgress } = useScroll()
  const { t } = useTranslation()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const strokeDashoffset = useTransform(scaleX, [0, 1], [213.6, 0])

  useEffect(() => {
    const touchQuery = window.matchMedia('(pointer: coarse)')
    setTimeout(() => {
      setIsTouch(touchQuery.matches)
    }, 10)

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const circleRef = useRef<HTMLDivElement>(null)

  const handleMouse = (e: React.MouseEvent) => {
    if (!circleRef.current || isTouch) return
    const { clientX, clientY } = e
    const { left, top, width, height } = circleRef.current.getBoundingClientRect()
    const mouseX = clientX - (left + width / 2)
    const mouseY = clientY - (top + height / 2)
    setPosition({ x: mouseX * 0.25, y: mouseY * 0.25 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
        y: isVisible ? 0 : 20,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] group"
    >
      <div
        ref={circleRef}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center cursor-pointer select-none"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 96 96" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="48" cy="48" r="34" className="stroke-white/5 fill-none" strokeWidth="2" />
          <motion.circle
            cx="48"
            cy="48"
            r="34"
            className="stroke-primary fill-none shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
            strokeWidth="2"
            strokeDasharray="213.6"
            style={{
              strokeDashoffset,
            }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase whitespace-nowrap">
              {t('back_to_top')}
            </span>
          </motion.div>
        </div>

        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center group/btn shadow-2xl relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity" />
          <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white stroke-[2] group-hover/btn:text-primary transition-colors" />
        </motion.div>
      </div>

      <div className="absolute top-3 right-3 md:top-4 md:right-4 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary blur-[1px] opacity-40 group-hover:scale-150 transition-transform pointer-events-none" />
    </motion.div>
  )
}

export default CampaignHubScrollToTop
