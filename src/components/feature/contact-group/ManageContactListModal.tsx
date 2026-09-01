'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGetContactGroupQuery, useUpdateContactGroupMutation } from '@/redux/api/contactGroupApi'
import { ApiError, ContactGroupModalProps } from '@/types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ContactSelector } from './ContactSelector'

export function ManageContactGroupModal({ isOpen, onClose, list }: ContactGroupModalProps) {
  const { t } = useTranslation()
  const [updateList, { isLoading: isUpdating }] = useUpdateContactGroupMutation()

  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const { data: listData, isLoading: isLoadingListData } = useGetContactGroupQuery(list?.id as string, {
    skip: !list?.id || !isOpen,
  })

  const [prevListData, setPrevListData] = useState(listData)
  if (listData !== prevListData) {
    setPrevListData(listData)
    if (listData?.contacts) {
      setSelectedContacts(listData.contacts.map((c: any) => c.id) || [])
    }
  }

  const handleSave = async () => {
    if (!list) return

    try {
      await updateList({
        id: list.id,
        contactIds: selectedContacts,
      }).unwrap()
      toast.success(t('contact_group_updated_successfully'))
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! rounded-border-radius! max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('manage_contacts')}</DialogTitle>
        </DialogHeader>

        <div className="py-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          <ContactSelector
            selectedContacts={selectedContacts}
            onToggleContact={toggleContact}
            type={list?.type as 'email' | 'whatsapp'}
          />
        </div>

        <DialogFooter className="bg-light-body sticky bottom-0 pt-2">
          <Button
            className="sm:h-12 h-10 bg-light-gray text-light-text-color dark:text-white w-full border-none shadow-none"
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            className="sm:h-12 h-10 bg-primary! text-white w-full"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('save_changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
