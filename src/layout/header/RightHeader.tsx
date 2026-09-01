import CreditsDropdown from './CreditsDropdown'
import DirectionToggle from './DirectionToggle'
import LanguageDropdown from './LanguageDropdown'
import NotificationDropdown from './NotificationDropdown'
import ThemeToggle from './ThemeToggle'
import UserDropdown from './UserDropdown'
import WhatsAppCallButton from './WhatsAppCallButton'

const RightHeader = () => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 ml-0 sm:ml-4 rtl:sm:ml-0 rtl:sm:mr-3 rtl:mr-0 shrink-0">
      <WhatsAppCallButton />
      <CreditsDropdown />
      <LanguageDropdown />
      <div>
        <DirectionToggle />
      </div>
      <ThemeToggle />
      <NotificationDropdown />
      <UserDropdown />
    </div>
  )
}

export default RightHeader
