import { User } from '../auth'

export interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export interface StatusSwitchProps {
  user: User
  onStatusChange: (id: string, currentStatus: boolean) => Promise<void>
  canManage: boolean
}
