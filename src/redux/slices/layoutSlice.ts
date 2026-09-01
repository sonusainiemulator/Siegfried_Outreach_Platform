import { LayoutState } from '@/types'
import { isBrowser } from '@/utils/environment'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: LayoutState = {
  isSidebarCollapsed: false,
  direction: 'ltr',
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    initializeLayout: (state) => {
      if (isBrowser) {
        state.isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true'
        state.direction = (localStorage.getItem('direction') as 'ltr' | 'rtl') || 'ltr'
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
      if (isBrowser) {
        localStorage.setItem('sidebarCollapsed', String(state.isSidebarCollapsed))
      }
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
      if (isBrowser) {
        localStorage.setItem('sidebarCollapsed', String(state.isSidebarCollapsed))
      }
    },
    toggleDirection: (state) => {
      state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr'
      if (isBrowser) {
        localStorage.setItem('direction', state.direction)
      }
    },
    setDirection: (state, action: PayloadAction<'ltr' | 'rtl'>) => {
      state.direction = action.payload
      if (isBrowser) {
        localStorage.setItem('direction', state.direction)
      }
    },
  },
})

import type { Reducer } from '@reduxjs/toolkit'
export const { toggleSidebar, setSidebarCollapsed, toggleDirection, setDirection, initializeLayout } =
  layoutSlice.actions

export default layoutSlice.reducer as Reducer<LayoutState>
