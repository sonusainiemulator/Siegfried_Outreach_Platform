'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useDeleteCampaignMutation } from '@/redux/api/campaignApi'
import { CampaignHubRecentCampaignsProps } from '@/types'
import { Mail, MessageCircle, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const CampaignHubRecentCampaigns = ({ recentBroadcasts }: CampaignHubRecentCampaignsProps) => {
  const { t } = useTranslation()
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!campaignToDelete) return
    try {
      await deleteCampaign(campaignToDelete).unwrap()
      toast.success(t('campaign_deleted_successfully'))
      setShowDeleteModal(false)
      setCampaignToDelete(null)
    } catch (error) {
      toast.error(t('failed_to_delete_campaign'))
    }
  }

  const recentColumns: Column<any>[] = [
    {
      header: 'ID',
      cell: (_, idx: number) => (
        <span className="text-sm font-bold text-muted-foreground opacity-50">
          #{typeof idx === 'number' ? idx + 1 : 1}
        </span>
      ),
      className: 'w-[80px] min-w-[60px]',
    },
    {
      header: t('name'),
      accessorKey: 'name',
      className: 'min-w-[200px]',
      cell: (campaign) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-bold ${getAvatarColorClass(
              campaign.name,
            )}`}
          >
            {campaign.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium tracking-tight text-title-color dark:text-white">
              {campaign.name}
            </span>
            {campaign.audience?.lists?.length > 0 && (
              <span className="text-sm font-medium text-subtitle-color ">
                {campaign.audience.lists.map((l: any) => l.name).join(', ')}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'status',
      className: 'min-w-[120px]',
      cell: (campaign) => (
        <Badge
          className={cn(
            'rounded-full px-4 py-1 text-xs font-medium capitalize border shadow-inner',
            campaign.status === 'completed' || campaign.status === 'published'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10'
              : campaign.status === 'scheduled'
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10'
                : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10',
          )}
        >
          {t(campaign.status || 'draft')}
        </Badge>
      ),
    },
    {
      header: t('platform'),
      accessorKey: 'channel',
      className: 'min-w-[100px]',
      cell: (campaign) => (
        <div
          className={cn(
            'w-10 h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500',
            campaign.channel === 'whatsapp'
              ? 'text-(--text-edit)'
              : campaign.channel === 'telegram'
                ? 'text-(--info)'
                : 'text-primary',
          )}
        >
          {campaign.channel === 'whatsapp' ? (
            <MessageCircle className="w-4.5! h-4.5!" />
          ) : campaign.channel === 'telegram' ? (
            <Send className="w-4.5! h-4.5!" />
          ) : campaign.channel === 'email' ? (
            <Mail className="w-4.5! h-4.5!" />
          ) : (
            <MessageCircle />
          )}
        </div>
      ),
    },
    {
      header: t('scheduled_at'),
      accessorKey: 'scheduledAt',
      className: 'min-w-[150px]',
      cell: (campaign) => {
        const displayTime = campaign.status === 'scheduled' ? campaign.scheduledAt : campaign.created_at
        return (
          <div className="flex flex-col">
            <span className="text-xs text-subtitle-color opacity-70 dark:text-white">
              {displayTime ? new Date(displayTime).toLocaleString() : '---'}
            </span>
          </div>
        )
      },
    },
    {
      header: t('actions'),
      className: 'w-[80px]',
      cell: (campaign) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white"
          onClick={() => {
            setCampaignToDelete(campaign.id)
            setShowDeleteModal(true)
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          {/* <div className=" text-primary">
            <Megaphone size={24} />
          </div> */}
          <h3 className="text-xl font-medium text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
            {t('recent_campaigns')}
          </h3>
        </div>
        <div className=" overflow-hidden">
          <DataTable columns={recentColumns} data={recentBroadcasts || []} emptyMessage={t('no_campaigns_found')} />
        </div>

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          isLoading={isDeleting}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title={t('delete_campaign_title')}
          description={t('delete_campaign_description')}
        />
      </div>
    </div>
  )
}

export default CampaignHubRecentCampaigns
