'use client'

import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  useCreateContactGroupMutation,
  useGetContactGroupQuery,
  useUpdateContactGroupMutation,
} from '@/redux/api/contactGroupApi'
import { ApiError, Contact, ContactGroupModalProps } from '@/types'
import { contactGroupSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ContactSelector } from './ContactSelector'

export function ContactGroupModal({ isOpen, onClose, list, type }: ContactGroupModalProps) {
  const { t } = useTranslation()
  const [createList, { isLoading: isCreating }] = useCreateContactGroupMutation()
  const [updateList, { isLoading: isUpdating }] = useUpdateContactGroupMutation()
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const isEditing = !!list

  const { data: listData } = useGetContactGroupQuery(list?.id as string, {
    skip: !list?.id || !isOpen,
  })

  const [initialContacts, setInitialContacts] = useState<string[]>([])

  useEffect(() => {
    if (listData?.contacts) {
      const ids = listData.contacts.map((c: Contact) => c.id)
      setTimeout(() => {
        setSelectedContacts(ids)
        setInitialContacts(ids)
      }, 100)
    }
  }, [listData])

  const hasContactsChanged =
    JSON.stringify([...selectedContacts].sort()) !== JSON.stringify([...initialContacts].sort())

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const initialValues = {
    name: list?.name || '',
    description: list?.description || '',
    type: list?.type || type || 'email',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing && list) {
        await updateList({ id: list.id, ...values, contactIds: selectedContacts }).unwrap()
        toast.success(t('contact_group_updated_successfully'))
      } else {
        await createList({ ...values, contactIds: selectedContacts }).unwrap()
        toast.success(t('contact_group_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! rounded-border-radius! no-scrollbar max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('edit') + ' ' + t('contact_group') : t('create') + ' ' + t('contact_group')}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={contactGroupSchemas.create(t)}
          onSubmit={handleSubmit}
        >
          {({ dirty, values }) => (
            <Form className="space-y-4">
              <TextInput name="name" label={t('name') + '*'} placeholder={t('enter_name')} />
              <TextAreaField
                name="description"
                label={t('description') + '*'}
                placeholder={t('enter_description')}
                rows={3}
              />

              <ContactSelector
                selectedContacts={selectedContacts}
                onToggleContact={toggleContact}
                type={values.type as 'email' | 'whatsapp'}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="bg-light-gray w-full shadow-none text-light-text-color dark:text-white  border-none! p-button-padding! sm:h-12 h-10"
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (isEditing && !dirty && !hasContactsChanged)}
                  className="disabled:opacity-50 w-full disabled:grayscale bg-primary! p-button-padding! sm:h-12 h-10 text-white"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? t('update') : t('create')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
