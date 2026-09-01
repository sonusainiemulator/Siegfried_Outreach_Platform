import { Condition, Contact } from '@/types'
 
export const matchesCondition = (contact: Contact, condition: Condition): boolean => {
  const { field, operator, value } = condition
  const contactValue = (contact as Record<string, any>)[field]

  if (contactValue === undefined || contactValue === null) return false

  if (Array.isArray(contactValue)) {
    // Handling tags or other arrays
    const searchVal = String(value).toLowerCase()
    switch (operator) {
      case 'contains':
        return contactValue.some((item) => String(item).toLowerCase().includes(searchVal))
      case 'equals':
        return contactValue.some((item) => String(item).toLowerCase() === searchVal)
      case 'starts_with':
        return contactValue.some((item) => String(item).toLowerCase().startsWith(searchVal))
      case 'ends_with':
        return contactValue.some((item) => String(item).toLowerCase().endsWith(searchVal))
      default:
        return false
    }
  }

  const val = String(contactValue).toLowerCase()
  const searchVal = String(value).toLowerCase()

  switch (operator) {
    case 'equals':
      return val === searchVal
    case 'contains':
      return val.includes(searchVal)
    case 'starts_with':
      return val.startsWith(searchVal)
    case 'ends_with':
      return val.endsWith(searchVal)
    case 'not_equals':
      return val !== searchVal
    case 'not_contains':
      return !val.includes(searchVal)
    default:
      return false
  }
}

export const matchesSegment = (contact: Contact, conditions: Condition[]): boolean => {
  if (!conditions || conditions.length === 0) return true
  // The backend uses "AND" logic by default in getSegment
  return conditions.every((condition) => matchesCondition(contact, condition))
}

export const calculateSegmentSize = (contacts: Contact[], conditions: Condition[]): number => {
  if (!contacts) return 0
  return contacts.filter((contact) => matchesSegment(contact, conditions)).length
}
