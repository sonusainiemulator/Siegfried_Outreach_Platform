'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ConnectedAccountsModalProps } from '@/types/components/socialMedia'
import { CheckCircle2, X } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const ConnectedAccountsModal = ({
  isOpen,
  onClose,
  platform,
  accounts,
  onDisconnect,
}: ConnectedAccountsModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]! bg-white backdrop-blur-xl border-border/40 overflow-hidden rounded-border-radius shadow-2xl p-0!">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <DialogHeader className="sm:p-8 p-6 pb-4! border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl ring-1 ring-white/10 shadow-lg",
              platform.bgColor
            )}>
              <platform.icon className={cn("w-6 h-6", platform.color)} />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-title-color dark:text-white flex items-center gap-3">
                {t(platform.name || '')} {t('social_established_links')}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-muted-foreground opacity-80 uppercase tracking-wider">
                {accounts.length} {accounts.length === 1 ? t('account') : t('accounts')} {t('connected')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="sm:px-8 px-6 py-6 max-h-[450px] overflow-y-auto custom-scrollbar relative z-10 space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="group flex items-center justify-between p-4 rounded-border-radius glass-dark-card glass-card border border-border/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="relative">
                  {account.profilePicture ? (
                    <img
                      src={account.profilePicture}
                      alt={account.accountName}
                      width={48}
                      height={48}
                      className="rounded-xl w-12 h-12 object-cover ring-2 ring-background/50 shadow-md group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-lg text-primary shadow-inner">
                      {account.accountName?.[0] || '?'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-background shadow-sm">
                    <CheckCircle2 className="w-2 h-2 text-white" />
                  </div>
                </div>
                
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-title-color dark:text-white truncate">
                    {account.accountName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                      {(account.followersCount || 0).toLocaleString()} {t('social_reach')}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDisconnect(account.id, account.accountName)}
                className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-destructive hover:text-white transition-all duration-300 shadow-sm group/btn"
              >
                <X className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        <div className="sm:p-8 p-6 pt-4! border-t border-white/10 relative z-10 bg-white/5 dark:bg-white/5">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs glass-card border-border/40 hover:bg-primary hover:text-white transition-all shadow-md"
            onClick={onClose}
          >
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectedAccountsModal
