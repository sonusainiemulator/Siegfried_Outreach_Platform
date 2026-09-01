import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CampaignInput } from '@/types'
import { formatDate } from '@/utils'
import { format } from 'date-fns'
import { useFormikContext } from 'formik'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const StepReview = () => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<CampaignInput>()

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      <CardHeader>
        <CardTitle>{t('review_launch')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-base">{t('campaign_details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('name')}</p>
                <p className="font-semibold">{values.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('subject')}</p>
                <p className="font-semibold">{values.subject}</p>
              </div>
            </CardContent>
          </Card>

          {/* Audience */}
          <Card className="border-2 glass-dark-card!">
            <CardHeader>
              <CardTitle className="text-base">{t('audience')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('lists')}</p>
                <p className="font-semibold">
                  {values.lists?.length || 0} {t('selected')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('segments')}</p>
                <p className="font-semibold">
                  {values.segments?.length || 0} {t('selected')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('contacts')}</p>
                <p className="font-semibold">
                  {values.contacts?.length || 0} {t('selected')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base">{t('schedule_campaign')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-sm space-y-3">
              <Label className="text-sm font-medium">{t('scheduled_at')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-[unset] shadow-none h-12',
                      !values.scheduledAt && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {values.scheduledAt ? (
                      <div className="flex flex-col">
                        <span className="font-semibold">{formatDate(values.scheduledAt)}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(values.scheduledAt), 'p')}
                        </span>
                      </div>
                    ) : (
                      <span>{t('pick_a_date')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-4">
                    <Calendar
                      mode="single"
                      selected={values.scheduledAt ? new Date(values.scheduledAt) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // Preserve time if already set, otherwise set to current time
                          const currentDate = values.scheduledAt ? new Date(values.scheduledAt) : new Date()
                          date.setHours(currentDate.getHours())
                          date.setMinutes(currentDate.getMinutes())
                          setFieldValue('scheduledAt', date.toISOString())
                        } else {
                          setFieldValue('scheduledAt', null)
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-md border-0"
                    />
                    {values.scheduledAt && (
                      <div className="border-t pt-4 space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">{t('time')}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            value={values.scheduledAt ? format(new Date(values.scheduledAt), 'HH:mm') : ''}
                            onChange={(e) => {
                              if (values.scheduledAt && e.target.value) {
                                const [hours, minutes] = e.target.value.split(':')
                                const newDate = new Date(values.scheduledAt)
                                newDate.setHours(parseInt(hours), parseInt(minutes))
                                setFieldValue('scheduledAt', newDate.toISOString())
                              }
                            }}
                            className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                {values.scheduledAt
                  ? t('scheduled_for') + ' ' + formatDate(values.scheduledAt) + ' ' + format(new Date(values.scheduledAt), 'p')
                  : t('send_now_desc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  )
}

export default StepReview
