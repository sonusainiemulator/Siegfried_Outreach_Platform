'use client'

import WhatsAppCampaignForm from '@/components/feature/broadcast/WhatsAppCampaignForm'
import { useParams } from 'next/navigation'

const EditWhatsAppCampaignPage = () => {
  const { id } = useParams()
  return <WhatsAppCampaignForm campaignId={id as string} />
}

export default EditWhatsAppCampaignPage
