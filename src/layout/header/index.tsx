import { HeaderProps } from '@/types'
import LeftHeader from './LeftHeader'
import RightHeader from './RightHeader'

const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="rounded-border-radius sticky top-0 z-50 transition-all duration-300 backdrop-blur-3xl">
      <div className="px-4 sm:px-8 md:py-6 py-4 pb-2! sm:pb-0 flex items-center justify-between">
        <LeftHeader onMenuToggle={onMenuToggle} />
        <RightHeader />
      </div>
    </header>
  )
}

export default Header
