'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useAppSelector } from '@/redux/hooks'
import { SupportSidebarProps } from '@/types'
import { ExternalLink, MessageCircle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export const SupportSidebar = ({ onContactClick }: SupportSidebarProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  return (
    <div className="w-full lg:w-[350px] space-y-6 flex flex-col gap-6 lg:gap-8">
      {!isAdmin && (
        <div className="rounded-border-radius p-[1px] mb-0 order-2 lg:order-1">
          <Card className="rounded-border-radius glass-dark-card sm:p-6 p-4 bg-card/60 backdrop-blur-xl border-none space-y-6 overflow-hidden relative">
            <div className="space-y-4 relative z-10">
              <div className="flex gap-2">
                <div className="min-w-12 h-12 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center ">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-title-color dark:text-white">{t('contact_support_title')}</h3>
                  <p className="text-subtitle-color text-sm font-medium mt-1">{t('contact_support_desc')}</p>
                </div>
              </div>
              <Button
                onClick={onContactClick}
                className="w-full sm:h-12 h-10 btn-color text-white text-base rounded-[8px] font-medium flex items-center justify-center gap-2"
              >
                {t('send_message')}
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm font-medium text-subtitle-color">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {t('support_online')}
              </div>
            </div>
          </Card>
        </div>
      )}
      {isAdmin && (
        <Card className="rounded-border-radius glass-dark-card glass-card sm:p-6 p-4 bg-muted/30 border-dashed border-border/60 order-1 lg:order-2">
          <div className="space-y-4">
            <h4 className="text-xl font-medium text-title-color dark:text-white">{t('web_pages_management')}</h4>
            <p className="text-subtitle-color font-medium text-sm">
              {t('admin_support_webpages_desc', {
                defaultValue: 'Easily manage and create additional web pages for your support center.',
              })}
            </p>
            <Button
              onClick={() => router.push(ROUTES.APP_SETTINGS.WEB_PAGES)}
              className="w-full sm:h-12 h-10 btn-color text-white text-base rounded-[8px] font-medium flex items-center justify-center gap-2 group"
            >
              {t('manage_web_pages')}
              <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
