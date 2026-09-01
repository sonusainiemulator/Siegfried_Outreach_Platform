import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    const match = value.match(/(\d+\.?\d*)(.*)/)
    if (!match) return

    const target = parseFloat(match[1])
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(progress)
      const easedCount = easedProgress * target

      setDisplayValue(easedCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, isInView])

  const match = value.match(/(\d+\.?\d*)(.*)/)
  const suffix = match ? match[2] : ''

  return (
    <span ref={ref}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: value.includes('.') ? 1 : 0,
        maximumFractionDigits: value.includes('.') ? 1 : 0,
      })}
      {suffix}
    </span>
  )
}

export function scrollToAnchor(href: string, close?: () => void, targetRef?: HTMLElement | null) {
  if (!href.startsWith('#')) return
  
  const el = targetRef || document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    close?.()
  }
}