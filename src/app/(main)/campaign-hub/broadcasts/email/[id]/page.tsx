'use client'

import CampaignWizard from '@/components/feature/broadcast/CampaignWizard'
import { PageProps } from '@/types/components/campaignHub'
import { use } from 'react'

const EditCampaignPage = ({ params }: PageProps) => {
  const resolvedParams = use(params)
  return <CampaignWizard campaignId={resolvedParams.id} />
}

export default EditCampaignPage
