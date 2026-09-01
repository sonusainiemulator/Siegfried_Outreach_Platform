'use client'

import { SidebarContextType } from '@/types'
import { createContext, ReactNode, useContext, useState } from 'react'

export const SidebarContext = createContext<SidebarContextType>({
  openMenuId: null,
  setOpenMenuId: () => {},
})

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  return (
    <SidebarContext.Provider value={{ openMenuId, setOpenMenuId }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebarContext = () => useContext(SidebarContext)
