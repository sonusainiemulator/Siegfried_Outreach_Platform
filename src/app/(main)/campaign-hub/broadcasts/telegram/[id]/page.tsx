'use client'

import TelegramCampaignForm from '@/components/feature/broadcast/TelegramCampaignForm'
import { useParams } from 'next/navigation'

const EditTelegramCampaignPage = () => {
  const { id } = useParams()
  return <TelegramCampaignForm campaignId={id as string} />
}

export default EditTelegramCampaignPage
