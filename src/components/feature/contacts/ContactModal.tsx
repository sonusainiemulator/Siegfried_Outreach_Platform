'use client'

import { Flag } from '@/components/reusable/Flag'
import TagInput from '@/components/shared/form-fields/TagInput'
import TagManagementModal from '@/components/shared/form-fields/TagManagementModal'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COUNTRIES } from '@/data/countries'
import { useCreateContactMutation, useUpdateContactMutation } from '@/redux/api/contactApi'
import { useGetTagsQuery } from '@/redux/api/tagApi'
import { ApiError, ContactModalProps } from '@/types'
import { contactSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { Loader2, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

// Helper to get dial code from ISO code
const getDialCode = (code: string) => COUNTRIES.find((c) => c.code === code)?.dial_code || '+91'

export function ContactModal({ isOpen, onClose, contact, type }: ContactModalProps) {
  const { t } = useTranslation()
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation()
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation()
  const [searchTerm, setSearchTerm] = useState('')
   const inputRef = useRef<HTMLInputElement>(null)
 
    const [isContactModalVisible, setIsContactModalVisible] = useState(true)
    const [isTagManagerVisible, setIsTagManagerVisible] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [snapshotTags, setSnapshotTags] = useState<any[]>([])
    const [hasTakenInitialSnapshot, setHasTakenInitialSnapshot] = useState(false)
    const [formDraft, setFormDraft] = useState<any>(null)
 
    const { data: tagsData, isLoading: isLoadingTags, refetch: refetchTags } = useGetTagsQuery({ limit: 100 }, { skip: !isOpen })
 
    // Handle snapshot logic
    useEffect(() => {
      // 1. Initial Load: Take a snapshot when data first arrives
      if (tagsData?.tags && !hasTakenInitialSnapshot) {
        setSnapshotTags(tagsData.tags)
        setHasTakenInitialSnapshot(true)
      }
    }, [tagsData, hasTakenInitialSnapshot])
 
    useEffect(() => {
      // 2. Explicit Refresh: Update snapshot when refreshKey changes (clicked Save)
      if (tagsData?.tags && refreshKey > 0) {
        setSnapshotTags(tagsData.tags)
      }
    }, [refreshKey, tagsData])
 
    // Reset snapshot state when the entire modal is closed/reopened from the page level
    useEffect(() => {
     if (!isOpen) {
       setHasTakenInitialSnapshot(false)
       setRefreshKey(0)
       setFormDraft(null)
     }
    }, [isOpen])
 
    const handleManageTags = (values: any) => {
     setFormDraft(values)
     setIsContactModalVisible(false)
     setIsTagManagerVisible(true)
   }
 
   const handleSaveTags = () => {
     setIsTagManagerVisible(false)
     setIsContactModalVisible(true)
     refetchTags()
     setRefreshKey(prev => prev + 1)
   }
 
   const handleBackToContact = () => {
     setIsTagManagerVisible(false)
     setIsContactModalVisible(true)
     refetchTags()
     setRefreshKey(prev => prev + 1)
   }
 
   const handleCloseAll = () => {
     setIsTagManagerVisible(false)
     setIsContactModalVisible(true)
     onClose()
   }
 
   const isEditing = !!contact

  const getInitialPhoneData = (phone?: string) => {
    if (!phone) return { countryCode: 'IN', phone: '' }

    // Remove leading + if it exists for consistent prefix matching
    const cleanPhone = phone.startsWith('+') ? phone.slice(1) : phone

    // Find a matching country code prefix from our list
    // Sort countries by dial code length (descending) to match longest prefixes first
    const sortedCountries = [...COUNTRIES].sort((a, b) => b.dial_code.length - a.dial_code.length)

    for (const country of sortedCountries) {
      const dialPrefix = country.dial_code.replace('+', '')
      if (cleanPhone.startsWith(dialPrefix)) {
        return {
          countryCode: country.code,
          phone: cleanPhone.slice(dialPrefix.length),
        }
      }
    }

    // Default fallback
    return { countryCode: 'IN', phone: cleanPhone }
  }

  const phoneData = getInitialPhoneData(contact?.phone)

  const initialValues = formDraft || {
    name: contact?.name || '',
    email: contact?.email || '',
    countryCode: phoneData.countryCode,
    phone: phoneData.phone,
    tags: contact?.tags || [],
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload: any = {
        name: values.name.trim(),
        tags: values.tags || [],
      }

      const dialCode = getDialCode(values.countryCode)

      // Include email/phone based on type context
      if (type === 'whatsapp') {
        payload.phone = `${dialCode}${values.phone.trim()}`
        payload.type = 'whatsapp'
      } else if (type === 'email') {
        payload.email = values.email.trim()
        payload.type = 'email'
      } else {
        // No explicit type — include both if provided
        payload.email = values.email.trim()
        payload.phone = values.phone ? `${dialCode}${values.phone.trim()}` : undefined
        payload.type = values.email ? 'email' : 'whatsapp'
      }

      if (isEditing && contact) {
        // Spread existing contact to ensure all required fields for PUT are present
        const { id: _, createdAt: __, updatedAt: ___, ...restContact } = contact
        const res = await updateContact({ id: contact.id, ...restContact, ...payload }).unwrap()
        toast.success(res.message || t("status_updated_successfully"))
      } else {
        const res = await createContact(payload).unwrap()
        toast.success(res.message || t('status_updated_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  const getContextLabel = () => {
    if (type === 'whatsapp') return t('whatsapp_contacts', { defaultValue: 'WhatsApp Contact' })
    if (type === 'email') return t('email_contacts', { defaultValue: 'Email Contact' })
    return t('contacts')
  }

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) || country.dial_code.includes(searchTerm),
  )

  const dialogTitle = isEditing ? `${t('edit')} ${getContextLabel()}` : `${t('create')} ${getContextLabel()}`

   return (
     <>
       <Dialog open={isOpen && isContactModalVisible} onOpenChange={handleCloseAll}>
      <DialogContent className="sm:max-w-2xl! max-h-[96vh] max-w-[calc(100%-2rem)]! rounded-border-radius no-scrollbar">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={contactSchemas.create(t, type)}
          onSubmit={handleSubmit}
        >
          {({ dirty, values, setFieldValue }) => (
            <Form className="space-y-4 pt-4">
              <TextInput name="name" label={t('name')} placeholder={t('enter_name')} />

              {/* Email: show for email type or generic (no type) */}
              {type !== 'whatsapp' && <TextInput name="email" label={t('email')} placeholder={t('enter_email')} />}

              {/* Phone: show for whatsapp type or generic (no type) */}
              {type !== 'email' && (
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <Label className="text-sm font-medium mb-2 block">
                      {t('country_code', { defaultValue: 'Code' })}
                    </Label>
                    <Select
                      value={values.countryCode}
                      onValueChange={(val: any) => setFieldValue('countryCode', val)}
                      onOpenChange={(open: any) => !open && setSearchTerm('')}
                    >
                      <SelectTrigger className="h-12 w-full  glass-dark-card inner-card rounded-[8px] shadow-none">
                        <SelectValue placeholder="+91">
                          {(() => {
                            const country = COUNTRIES.find((c) => c.code === values.countryCode)
                            return (
                              <div className="flex items-center gap-4">
                                {country && <Flag countryCode={country.code} size={18} />}
                                <span>{country?.dial_code || '+91'}</span>
                              </div>
                            )
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-60 bg-white! dark:bg-modal-bg-color!"
                        onKeyDown={(e: { key: string | any[]; ctrlKey: any; metaKey: any }) => {
                          // Redirect focus to input if a character is pressed and not currently focused
                          if (
                            e.key.length === 1 &&
                            e.key !== ' ' &&
                            !e.ctrlKey &&
                            !e.metaKey &&
                            document.activeElement !== inputRef.current
                          ) {
                            inputRef.current?.focus()
                          }
                        }}
                      >
                        <div className="sticky top-0 z-10 bg-white dark:bg-black/60" onPointerDown={(e) => e.stopPropagation()}>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              ref={inputRef}
                              autoFocus
                              className="flex h-10 w-full rounded-md border border-input bg-transparent px-8 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                              placeholder={t('search_country', { defaultValue: 'Search country...' })}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onKeyDown={(e) => {
                                e.stopPropagation()
                              }}
                            />
                          </div>
                        </div>
                        <SelectGroup>
                          {filteredCountries.map((country) => (
                            <SelectItem
                              className="dark:hover:bg-modal-bg-color"
                              key={`${country.code}-${country.dial_code}`}
                              value={country.code}
                            >
                              <div className="flex items-center gap-2">
                                <Flag countryCode={country.code} size={18} />
                                <span className="text-sm">
                                  {country.name} ({country.dial_code})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                          {filteredCountries.length === 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {t('no_country_found', { defaultValue: 'No country found' })}
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 mt-2 ">
                    <TextInput name="phone" label={t('phone')} placeholder={t('enter_phone')} />
                  </div>
                </div>
              )}

                {type !== 'whatsapp' && (
                  <TagInput
                    name="tags"
                    label={t('tags')}
                    placeholder={t('select_tags', { defaultValue: 'Select tags' })}
                    onManageClick={() => handleManageTags(values)}
                    tags={snapshotTags}
                    isLoading={isLoadingTags}
                  />
                )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-button-padding!  dark:border-none border-input-border-color! w-full sm:h-12 h-10 rounded-[8px] bg-light-gray text-light-text-color dark:text-white transition-all"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (isEditing && !dirty)}
                  className="bg-primary! text-white  p-button-padding! mr-2 w-full! sm:h-12! h-10 rounded-[8px] disabled:opacity-50 disabled:grayscale"
                >
                  {isLoading && <Loader2 className="animate-spin mr-2" />}
                  {isEditing ? t('update') : t('create')}
                </Button>
              </DialogFooter>
            </Form>
          )}
         </Formik>
       </DialogContent>
       </Dialog>
 
       <TagManagementModal 
         isOpen={isOpen && isTagManagerVisible} 
         onClose={handleBackToContact}
         onSave={handleSaveTags}
       />
     </>
   )
 }
