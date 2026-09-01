'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import { ROUTES } from '@/constants/routes'
import { createCampaigns } from '@/data/campaignHub'
import { useAppDirection } from '@/hooks/useAppDirection'
import { CampaignHubHeaderProps } from '@/types'
import { ArrowLeft, Plus, SettingsIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const CampaignHubHeader = ({ createOpen, setCreateOpen }: CampaignHubHeaderProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const direction = useAppDirection()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:mb-8 mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <div className="flex items-start flex-col space-x-2">
          <h1 className="text-3xl font-bold text-title-color dark:text-white line-clamp-1 leading-[1.1] title-color">
            {t('campaign_hub')}
          </h1>
        </div>
      </div>
      <div className="flex flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 glass-button glass-header-card rounded-[8px] flex items-center cursor-pointer justify-center">
          <SettingsIcon
            className="w-5 h-5 "
            onClick={() => router.push(ROUTES.CAMPAIGN_HUB.SETTINGS.BOT_PREFERENCES)}
          />
        </div>

        <div onMouseEnter={() => setCreateOpen(true)} onMouseLeave={() => setCreateOpen(false)} className="relative">
          <DropdownMenu open={createOpen} onOpenChange={setCreateOpen} dir={direction}>
            <DropdownMenuTrigger asChild>
              <Button className="p-button-padding! rounded-[8px] font-semibold text-base btn-color text-white px-8 sm:h-12 h-10 transition-all active:scale-95">
                <Plus className="h-4 w-4" strokeWidth={3} />
                {t('create_new_campaign')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-full sm:w-60 bg-white dark:bg-modal-bg-color border-border rounded-[8px] animate-in fade-in zoom-in-95 duration-200"
            >
              {createCampaigns.map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onClick={() => router.push(item.route)}
                  className="font-medium cursor-pointer hover:bg-primary/10 hover:text-primary rounded-[8px] px-3 py-2 transition-colors mb-1 last:mb-0"
                >
                  {t(item.key)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CreditLimitPill />
      </div>
    </div>
  )
}

export default CampaignHubHeader
