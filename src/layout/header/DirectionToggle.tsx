'use client'

import { Button } from '@/components/ui/button'
import { toggleDirection } from '@/redux/slices/layoutSlice'
import { RootState } from '@/redux/store'
import { PilcrowLeft, PilcrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

const DirectionToggle = () => {
  const dispatch = useDispatch()
  const direction = useSelector((state: RootState) => state.layout.direction)

  const handleToggle = () => {

    dispatch(toggleDirection())
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9 sm:h-11 sm:w-11 glass-button glass-header-card rounded-[8px] transition-all duration-300 group"
      title={direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
    >
      {direction === 'ltr' ? (
        <PilcrowRight className="w-[18px]! h-[18px]! text-subtitle-color dark:text-white/70 group-hover:text-primary transition-colors duration-300" />
      ) : (
        <PilcrowLeft className="w-[18px]! h-[18px]! text-subtitle-color dark:text-white/70 group-hover:text-primary transition-colors duration-300" />
      )}
    </Button>
  )
}

export default DirectionToggle
