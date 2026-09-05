'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PlatformCardProps } from '@/types/components/socialMedia'
import { CheckCircle2, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import SetupGuideTooltip from '../../social-settings/social/SetupGuideTooltip'
import { platformSetupGuides } from './platformSetupGuides'

import { useState } from 'react'

const PlatformCard = ({
  platform,
  isConnected,
  isConnecting,
  connectedAccounts,
  onConnect,
  onDisconnect,
  onViewAccounts,
}: PlatformCardProps) => {
  const { t } = useTranslation()
  const setupGuide = platformSetupGuides[platform.id]
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  return (
    <Card
      className={cn(
        `group relative glass-dark-card1 rounded-border-radius border-border/40 bg-card/40 backdrop-blur-xl overflow-visible transition-all duration-500 hover:border-primary/40 ${isGuideOpen ? 'z-50 shadow-2xl ring-1 ring-primary/30' : 'z-10'}`,
        isConnected ? '' : '',
      )}
    >
      <CardHeader className="sm:p-6 p-4 pb-0! relative">
        <div className="flex items-start justify-between">
          <div className='flex gap-3'>
            <div
              className={cn(
                'p-4 h-14 w-14 flex items-center justify-center rounded-border-radius transition-all duration-500 group-hover:scale-110 group-hover:rotate-3',
                platform.bgColor,
                'ring-1 ring-white/5',
              )}
            >
              <platform.icon className={cn('w-6 h-6', platform.color)} />
            </div>

            <div className="space-y-1 md:space-y-2">
              <h2 className="text-lg md:text-xl font-medium text-title-color flex items-center gap-2 md:gap-3 mb-0 dark:text-white">
                {t(platform.name || '')}
                {!platform.isAvailable && (
                  <Badge className="text-[7px] md:text-[8px] font-black uppercase bg-muted/40 text-muted-foreground px-1.5 md:px-2 h-4 md:h-5 tracking-widest leading-none">
                    {t('social_roadmap')}
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-subtitle-color font-medium leading-relaxed opacity-70 line-clamp-2">{t(platform.description || '')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            {setupGuide && (
              <SetupGuideTooltip
                title={setupGuide.title}
                steps={setupGuide.steps}
                links={setupGuide.links}
                redirectUri={setupGuide.redirectUri}
                onOpenChange={setIsGuideOpen}
              />
            )}
            {isConnected && (
              <Badge
                variant="outline"
                className="px-3 md:px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium text-[10px] capitalize gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                {t('social_stable')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 pt-3 relative space-y-5">
        {isConnected && (
          <div className="space-y-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                    {t('social_connected_accounts', { defaultValue: 'Connected Accounts' })}
                  </p>
                </div>
                {connectedAccounts.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewAccounts}
                    className="h-6 px-3 rounded-[6px] text-[10px] font-bold border-none hover:bg-primary/10 hover:text-primary transition-all p-0! bg-transparent!"
                  >
                    {t('view_all')}
                  </Button>
                )}
              </div>

              <div className="space-y-3 max-h-[135px] overflow-y-auto no-scrollbar pr-1 block">
                {connectedAccounts.slice(0, 5).map((account) => (
                  <div
                    key={account.id}
                    className="group/item flex items-center justify-between p-3 rounded-[8px] glass-dark-card inner-card border border-border/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        {account.profilePicture ? (
                          <img
                            src={account.profilePicture}
                            alt={account.accountName}
                            width={32}
                            height={32}
                            className="rounded-[8px] w-8 h-8 object-cover ring-2 ring-background/50 shadow-md group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shadow-inner">
                            {account.accountName?.[0] || '?'}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 border border-background shadow-xs">
                          <CheckCircle2 className="w-1.5 h-1.5 text-white" />
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-[11px] font-bold text-title-color dark:text-white truncate">
                          {account.accountName}
                        </p>
                        <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground opacity-60 truncate">
                          {(account.followersCount || 0).toLocaleString()} {t('reach')}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDisconnect(account.id, account.accountName)}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group/btn shrink-0"
                    >
                      <X className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => onConnect(platform.id)}
          disabled={!platform.isAvailable || isConnecting}
          className={cn(
            'w-full sm:h-12 h-10 rounded-[8px] group-hover:bg-primary! group-hover:text-white! text-sm font-medium transition-all duration-300 border-none  p-button-padding! ',
            isConnected
              ? 'bg-light-gray text-foreground hover:bg-primary'
              : 'bg-light-gray! text-light-text-color hover:scale-[1.02] ',
          )}
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : isConnected ? (
            t('social_connect_plus')
          ) : (
            t('social_init_connection')
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default PlatformCard
