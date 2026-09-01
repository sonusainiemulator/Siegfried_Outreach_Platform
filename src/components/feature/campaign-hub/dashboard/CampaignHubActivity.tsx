'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { Column, DataTable } from '@/components/reusable/DataTable'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { Contact, TelegramSubscriber } from '@/types/api'
import { CampaignHubActivityProps } from '@/types/components/campaignHub'
import { useTranslation } from 'react-i18next'

const CampaignHubActivity = ({ recentContacts, recentTelegramSubscribers }: CampaignHubActivityProps) => {
  const { t } = useTranslation()

  const contactColumns: Column<Contact>[] = [
    {
      header: t('name'),
      accessorKey: 'name',
      cell: (contact) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-bold ${getAvatarColorClass(contact.name)}`}
          >
            {contact.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-title-color dark:text-white">{contact.name}</span>
            {contact.email ? <CopyEmailCell email={contact.email} /> : null}
          </div>
        </div>
      ),
    },
    {
      header: t('phone'),
      accessorKey: 'phone',
      cell: (contact) => <span className="text-sm font-medium dark:text-white">{contact.phone || 'N/A'}</span>,
    },
    {
      header: t('date'),
      accessorKey: 'createdAt',
      cell: (contact) => (
        <span className="text-xs text-subtitle-color opacity-70">
          {new Date(contact.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const subscriberColumns: Column<TelegramSubscriber>[] = [
    {
      header: t('subscriber'),
      className: '[@media(max-width:482px)]:min-w-[192px]',
      accessorKey: 'name',
      cell: (sub) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-bold ${getAvatarColorClass(sub.firstName)}`}
          >
            {sub.firstName?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-title-color dark:text-white">
              {sub.firstName} {sub.lastName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'status',
      cell: (sub) => (
        <Badge
          className={cn(
            'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
            sub.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          )}
        >
          {t(sub.status)}
        </Badge>
      ),
    },
    {
      header: t('joined'),
      accessorKey: 'createdAt',
      cell: (sub) => (
        <span className="text-xs text-subtitle-color opacity-70">{new Date(sub.createdAt).toLocaleDateString()}</span>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6">
      <div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            {/* <div className=" text-primary">
              <User size={24} />
            </div> */}
            <h3 className="text-xl font-medium text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
              {t('recent_contacts')}
            </h3>
          </div>
          <Card className="overflow-hidden">
            <DataTable columns={contactColumns} data={recentContacts || []} emptyMessage={t('no_contacts_found')} />
          </Card>
        </div>
      </div>
      <div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            {/* <div className="text-primary">
              <Send size={24} />
            </div> */}
            <h3 className="text-xl font-medium text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
              {t('recent_telegram_subscribers')}
            </h3>
          </div>
          <Card className=" overflow-hidden">
            <DataTable
              columns={subscriberColumns}
              data={recentTelegramSubscribers || []}
              emptyMessage={t('no_subscribers_found')}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CampaignHubActivity
