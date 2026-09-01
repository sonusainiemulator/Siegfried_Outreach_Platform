'use client'

import { Button } from '@/components/ui/button'
import { ActiveChannelsTableProps } from '@/types'
import { Copy, Info, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ActiveChannelsTable = ({ activeChannels, onCopyWebhook, onDeleteChannel }: ActiveChannelsTableProps) => {
  const { t } = useTranslation()

  if (activeChannels.length === 0) return null

  return (
    <div className="border border-glass-border rounded-border-radius overflow-hidden backdrop-blur-md">
      <table className="w-full text-left">
        <thead className=" border-b border-glass-border">
          <tr>
            <th className="px-6 py-4 text-xs font-medium text-foreground">
              {t('channel', { defaultValue: 'Channel' })}
            </th>
            <th className="px-6 py-4 text-xs font-medium text-foreground">
              {t('channel_id', { defaultValue: 'Channel ID' })}
            </th>
            <th className="px-6 py-4 text-xs font-medium text-foreground">{t('action', { defaultValue: 'Action' })}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-glass-border custom-scrollbar overflow-auto">
          {activeChannels.map((ch) => (
            <tr key={ch.id} className=" transition-colors">
              <td className="px-6 py-4 font-bold capitalize text-sm md575:min-w-[140px]">{ch.type}</td>
              <td className="px-6 py-4 font-medium text-muted-foreground text-sm md575:min-w-[140px]">
                {ch.channelId || 'N/A'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyWebhook(ch.id)}
                    className="rounded-xl border-glass-border bg-unset hover:bg-primary/10 hover:text-primary h-8 font-bold text-[11px] "
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    {t('copy_webhook', { defaultValue: 'Copy Webhook' })}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => onDeleteChannel(ch.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActiveChannelsTable
