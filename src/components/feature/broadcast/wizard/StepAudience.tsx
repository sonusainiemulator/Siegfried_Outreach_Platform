import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetContactsQuery } from '@/redux/api/contactApi'
import { useGetContactGroupsQuery } from '@/redux/api/contactGroupApi'
import { useGetSegmentsQuery } from '@/redux/api/segmentApi'
import { CampaignInput, SelectionItem } from '@/types'
import { useFormikContext } from 'formik'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import SelectionList from './SelectionList'

const StepAudience = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { values, setFieldValue } = useFormikContext<CampaignInput>()

  const { data: listsData } = useGetContactGroupsQuery({ type: values.channel as 'email' | 'whatsapp' })
  const { data: segmentsData } = useGetSegmentsQuery()
  const { data: contactsData } = useGetContactsQuery({ type: values.channel as 'email' | 'whatsapp', limit: 1000 })

  const mapToSelectionItems = (data: any[] | undefined): SelectionItem[] => {
    return (data || []).map((item) => ({
      id: item.id || (item as any)._id,
      name: item.name || item.email || item.phone,
      description: item.description || (item.email && item.name !== item.email ? item.email : ''),
    }))
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      <CardHeader>
        <CardTitle>{t('audience')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectionList
            title={t('select_groups')}
            items={mapToSelectionItems(listsData?.lists)}
            selectedIds={values.lists || []}
            onSelectionChange={(newIds) => setFieldValue('lists', newIds)}
            emptyMessage={t('no_groups_available')}
            selectionLabel={t('groups_selected')}
            searchPlaceholder={t('search_groups', { defaultValue: 'Search groups...' })}
          />

          <SelectionList
            title={t('select_audiences')}
            items={mapToSelectionItems(segmentsData?.segments)}
            selectedIds={values.segments || []}
            onSelectionChange={(newIds) => setFieldValue('segments', newIds)}
            emptyMessage={t('no_audiences_available')}
            selectionLabel={t('audiences_selected')}
            searchPlaceholder={t('search_audiences', { defaultValue: 'Search audiences...' })}
          />

          <SelectionList
            title={t('individual_contacts', { defaultValue: 'Individual Contacts' })}
            items={mapToSelectionItems(contactsData?.contacts)}
            selectedIds={values.contacts || []}
            onSelectionChange={(newIds) => setFieldValue('contacts', newIds)}
            emptyMessage={t('no_contacts_available')}
            selectionLabel={t('contacts_selected')}
            actionLabel={t('create_contact', { defaultValue: 'Create Contact' })}
            onAction={() => router.push(`/campaign-hub/contacts${values.channel ? `?type=${values.channel}` : ''}`)}
            searchPlaceholder={t('search_contacts', { defaultValue: 'Search contacts...' })}
          />
        </div>

      </CardContent>
    </div>
  )
}

export default StepAudience
