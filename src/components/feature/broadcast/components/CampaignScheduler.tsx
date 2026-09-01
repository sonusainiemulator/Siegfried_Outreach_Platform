import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { CampaignSchedulerProps } from '@/types/components/campaigns'
import { formatDate } from '@/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import React from 'react'

export const CampaignScheduler = ({ scheduledAt, setFieldValue, t }: CampaignSchedulerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="flex items-center gap-1">
            {t('schedule_campaign')}
            <span className="text-muted-foreground italic text-xs"></span>
          </Label>
        </div>
        <Switch
          checked={!!scheduledAt}
          onCheckedChange={(checked) => {
            if (checked) {
              setFieldValue('scheduledAt', new Date().toISOString())
              setIsPopoverOpen(true)
            } else {
              setFieldValue('scheduledAt', null)
            }
          }}
        />
      </div>

      {scheduledAt && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal h-12 bg-[unset] shadow-none',
                  !scheduledAt && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                {scheduledAt ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatDate(scheduledAt)}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(scheduledAt), 'p')}
                    </span>
                  </div>
                ) : (
                  <span>{t('pick_a_date')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 space-y-4 bg-white dark:bg-modal-bg-color rounded-2xl">
                <CalendarComponent
                  mode="single"
                  selected={scheduledAt ? new Date(scheduledAt) : undefined}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      const currentDate = scheduledAt ? new Date(scheduledAt) : new Date()
                      date.setHours(currentDate.getHours())
                      date.setMinutes(currentDate.getMinutes())
                      setFieldValue('scheduledAt', date.toISOString())
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border-0"
                />
                {scheduledAt && (
                  <div className="border-t pt-4 space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">{t('time')}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={scheduledAt ? format(new Date(scheduledAt), 'HH:mm') : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (scheduledAt && e.target.value) {
                            const [hours, minutes] = e.target.value.split(':')
                            const newDate = new Date(scheduledAt)
                            newDate.setHours(parseInt(hours), parseInt(minutes))
                            setFieldValue('scheduledAt', newDate.toISOString())
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}
