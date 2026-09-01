import { Contact, ContactGroup, Segment } from '../api'

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact | null
  type?: 'email' | 'whatsapp'
}

export interface ContactSelectorProps {
  selectedContacts: string[]
  onToggleContact: (contactId: string) => void
  type?: 'email' | 'whatsapp'
}

export interface ContactGroupModalProps {
  isOpen: boolean
  onClose: () => void
  list?: ContactGroup | null
  type?: 'email' | 'whatsapp'
}

export interface SegmentModalProps {
  isOpen: boolean
  onClose: () => void
  segment?: Segment | null
}
