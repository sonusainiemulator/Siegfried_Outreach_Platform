import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export const useAppDirection = () => {
  return useSelector((state: RootState) => state.layout.direction)
}
