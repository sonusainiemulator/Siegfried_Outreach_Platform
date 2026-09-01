import Spinner from '@/components/reusable/Spinner'
import { Checkbox } from '@/components/ui/checkbox'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { useGetContactsQuery } from '@/redux/api/contactApi'
import { ContactSelectorProps } from '@/types'
import { Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ContactSelector({ selectedContacts, onToggleContact, type }: ContactSelectorProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: contactsData, isLoading: isLoadingContacts } = useGetContactsQuery({
    limit: 1000,
    type: type,
  },)

  const filteredContacts = useMemo(() => {
    if (!contactsData?.contacts) return []
    return contactsData.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [contactsData, searchTerm])

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('select_contacts')}
          </Label>
          <span className="text-xs text-muted-foreground">
            {selectedContacts.length} {t('selected')}
          </span>
        </div>

        <div className="relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground   transition-colors" />
          <Input
            type="text"
            placeholder={t('search_contacts')}
            className="flex w-full dark:border-gray-600 px-3 py-4 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-11 h-12 border border-input-border-color rounded-[10px] text-base text-muted-foreground focus-visible:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border rounded-border-radius  max-h-60 overflow-y-auto no-scrollbar">
          {isLoadingContacts ? (
            <Spinner className="min-h-40" size="sm" />
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{t('no_contacts_found')}</div>
          ) : (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 dark:hover:bg-modal-bg-color cursor-pointer transition-colors"
                  onClick={() => onToggleContact(contact.id)}
                >
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    readOnly
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
