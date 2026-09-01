'use client'

import { SectionRefsContextType } from '@/types/shared'
import React, { createContext, useContext, useRef, useCallback } from 'react'

const SectionRefsContext = createContext<SectionRefsContextType | null>(null)

export const SectionRefsProvider = ({ children }: { children: React.ReactNode }) => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (id) {
      sectionRefs.current[id] = el
    }
  }, [])

  return (
    <SectionRefsContext.Provider value={{ sectionRefs, registerRef }}>
      {children}
    </SectionRefsContext.Provider>
  )
}

export const useSectionRefs = () => {
  const context = useContext(SectionRefsContext)
  if (!context) {
    throw new Error('useSectionRefs must be used within a SectionRefsProvider')
  }
  return context
}
