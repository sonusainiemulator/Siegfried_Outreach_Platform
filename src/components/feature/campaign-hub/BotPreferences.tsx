'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppDirection } from '@/hooks/useAppDirection'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation, useTestWhatsappConfigMutation, useTestTelegramConfigMutation } from '@/redux/api/userSettingApi'
import { ApiError } from '@/types'
import { Form, Formik } from 'formik'
import { Loader2, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const BotPreferencesSettings = () => {
  const { t } = useTranslation()
  const direction = useAppDirection()
  const { data: userData, isLoading: isFetching } = useGetUserSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation()
  const [testWhatsapp, { isLoading: isTestingWhatsapp }] = useTestWhatsappConfigMutation()
  const [testTelegram, { isLoading: isTestingTelegram }] = useTestTelegramConfigMutation()
  const [activeTab, setActiveTab] = useState('whatsapp')

  if (isFetching) {
    return <Spinner className="h-[60vh]" />
  }

  const telegramInitialValues = {
    botToken: userData?.setting?.telegramConfig?.botToken || '',
  }

  const whatsappInitialValues = {
    provider: userData?.setting?.whatsappConfig?.provider || 'twilio',
    sid: userData?.setting?.whatsappConfig?.sid || '',
    token: userData?.setting?.whatsappConfig?.token || '',
    from: userData?.setting?.whatsappConfig?.from || '',
    environment: userData?.setting?.whatsappConfig?.environment || 'sandbox',
    accessToken: userData?.setting?.whatsappConfig?.accessToken || '',
    phoneNumberId: userData?.setting?.whatsappConfig?.phoneNumberId || '',
    wabaId: userData?.setting?.whatsappConfig?.wabaId || '',
  }

  const handleTelegramSubmit = async (values: typeof telegramInitialValues) => {
    try {
      const res = await updateSettings({ telegramConfig: values }).unwrap()
      toast.success(
        res.message || t('telegram_settings_updated', { defaultValue: 'Telegram settings updated successfully' }),
      )
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update', { defaultValue: 'Failed to update settings' }))
    }
  }

  const handleWhatsappSubmit = async (values: typeof whatsappInitialValues) => {
    try {
      const res = await updateSettings({ whatsappConfig: values }).unwrap()
      toast.success(
        res.message || t('whatsapp_settings_updated', { defaultValue: 'WhatsApp settings updated successfully' }),
      )
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update', { defaultValue: 'Failed to update settings' }))
    }
  }

  const handleTestWhatsapp = async (values: typeof whatsappInitialValues) => {
    try {
      const res = await testWhatsapp({
        provider: values.provider,
        sid: values.sid,
        token: values.token,
        accessToken: values.accessToken,
        phoneNumberId: values.phoneNumberId
      }).unwrap()
      toast.success(res.message || t('connection_successful', { defaultValue: 'Connection successful' }))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('connection_failed', { defaultValue: 'Connection failed' }))
    }
  }

  const handleTestTelegram = async (values: typeof telegramInitialValues) => {
    try {
      const res = await testTelegram({ botToken: values.botToken }).unwrap()
      toast.success(res.message || t('connection_successful', { defaultValue: 'Connection successful' }))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('connection_failed', { defaultValue: 'Connection failed' }))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto">
      <Tabs defaultValue="whatsapp" value={activeTab} onValueChange={setActiveTab} className="w-full" dir={direction}>
        <TabsList className="grid w-full grid-cols-2 lg:w-100 bg-primary/5 p-1 m-auto rounded-border-radius h-12 mb-8 border border-glass-border">
          <TabsTrigger
            value="whatsapp"
            className="rounded-border-radius data-[state=active]:bg-primary data-[state=active]:text-white! dark:data-[state=active]:text-white! transition-all duration-300 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {t('whatsapp', { defaultValue: 'WhatsApp' })}
          </TabsTrigger>
          <TabsTrigger
            value="telegram"
            className="rounded-border-radius data-[state=active]:bg-primary data-[state=active]:text-white! dark:data-[state=active]:text-white! transition-all duration-300 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {t('telegram', { defaultValue: 'Telegram' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="animate-fade-in-up">
          <Card className="rounded-border-radius glass-card glass-dark-card overflow-hidden">
            <CardHeader className="border-b border-light-border-color  py-6">
              <CardTitle className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                </div>
                {t('campaign_hub_whatsapp_settings', { defaultValue: 'WhatsApp Configuration' })}
              </CardTitle>
              <CardDescription className="text-subtitle-color">
                {t('whatsapp_config_desc', {
                  defaultValue: 'Configure Twilio or Meta Official WhatsApp Cloud API provider for WhatsApp communication.',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Formik initialValues={whatsappInitialValues} enableReinitialize onSubmit={handleWhatsappSubmit}>
                {({ values, handleChange, setFieldValue, isSubmitting, dirty }) => (
                  <Form className="space-y-6">
                    <div className="space-y-2 flex flex-col max-w-md">
                      <Label className="text-sm font-medium text-foreground px-1">
                        {t('provider', { defaultValue: 'WhatsApp Provider' })}
                      </Label>
                      <Select
                        value={values.provider}
                        onValueChange={(val: any) => setFieldValue('provider', val)}
                      >
                        <SelectTrigger className="w-full focus:bg-transparent focus:ring-0 transition-all h-12 rounded-[8px] text-foreground inner-card glass-dark-card shadow-none!">
                          <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-900 rounded-[8px] dark:bg-modal-bg-color dark:text-white z-[9999]">
                          <SelectItem value="twilio" className="cursor-pointer">
                            Twilio (Sandbox/API)
                          </SelectItem>
                          <SelectItem value="meta" className="cursor-pointer">
                            Meta Cloud API (Official)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {values.provider === 'meta' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="space-y-4">
                          <div className="space-y-2 flex flex-col">
                            <Label htmlFor="meta_access_token" className="text-sm font-medium text-foreground px-1">
                              Meta System User Access Token
                            </Label>
                            <PasswordInput
                              id="meta_access_token"
                              name="accessToken"
                              placeholder="EAAG..."
                              value={values.accessToken}
                              onChange={handleChange}
                              className="focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                            />
                          </div>
                          <div className="space-y-2 flex flex-col">
                            <Label htmlFor="meta_phone_id" className="text-sm font-medium text-foreground px-1">
                              WhatsApp Phone Number ID
                            </Label>
                            <PasswordInput
                              id="meta_phone_id"
                              name="phoneNumberId"
                              placeholder="1098xxxxxxxxxxx"
                              value={values.phoneNumberId}
                              onChange={handleChange}
                              className="focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2 flex flex-col">
                            <Label htmlFor="meta_waba_id" className="text-sm font-medium text-foreground px-1">
                              WhatsApp Business Account ID (Optional)
                            </Label>
                            <PasswordInput
                              id="meta_waba_id"
                              name="wabaId"
                              placeholder="1027xxxxxxxxxxx"
                              value={values.wabaId}
                              onChange={handleChange}
                              className="focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="space-y-4">
                          <div className="space-y-2 flex flex-col">
                            <Label htmlFor="whatsapp_sid" className="text-sm font-medium text-foreground px-1">
                              {t('whatsapp_sid', { defaultValue: 'Account SID' })}
                            </Label>
                            <PasswordInput
                              id="whatsapp_sid"
                              name="sid"
                              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              value={values.sid}
                              onChange={handleChange}
                              className="focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-2 flex flex-col">
                            <Label htmlFor="whatsapp_token" className="text-sm font-medium text-foreground px-1">
                              {t('whatsapp_token', { defaultValue: 'Auth Token' })}
                            </Label>
                            <PasswordInput
                              id="whatsapp_token"
                              name="token"
                              placeholder="********************************"
                              value={values.token}
                              onChange={handleChange}
                              className="focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2 flex flex-col">
                            <Label htmlFor="whatsapp_phone" className="text-sm font-medium text-foreground px-1">
                              {t('whatsapp_phone', { defaultValue: 'WhatsApp Number' })}
                            </Label>
                            <PasswordInput
                              id="whatsapp_phone"
                              name="from"
                              placeholder="+14155238886"
                              value={values.from}
                              onChange={handleChange}
                              className=" focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-2 flex flex-col">
                            <Label className="text-sm font-medium text-foreground px-1">
                              {t('environment', { defaultValue: 'Environment' })}
                            </Label>
                            <Select
                              value={values.environment}
                              onValueChange={(val: any) => setFieldValue('environment', val)}
                            >
                              <SelectTrigger className="w-full  focus:bg-transparent focus:ring-0 transition-all h-12 rounded-[8px] text-foreground inner-card glass-dark-card shadow-none!">
                                <SelectValue placeholder="Select Environment" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-gray-900 rounded-[8px] dark:bg-modal-bg-color dark:text-white z-[9999]">
                                <SelectItem value="sandbox" className="cursor-pointer">
                                  {t('sandbox', { defaultValue: 'SANDBOX' })}
                                </SelectItem>
                                <SelectItem value="live" className="cursor-pointer">
                                  {t('live', { defaultValue: 'LIVE' })}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestWhatsapp(values)}
                        disabled={
                          isTestingWhatsapp || 
                          (values.provider === 'meta' ? (!values.accessToken || !values.phoneNumberId) : (!values.sid || !values.token))
                        }
                        className="rounded-[8px]! sm:h-12 h-10 px-6! py-2! bg-primary/20! text-primary! hover:bg-primary/30! dark:bg-white/10! dark:text-white! dark:hover:bg-white/20! font-medium transition-all duration-300"
                      >
                        {isTestingWhatsapp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('test_connection', { defaultValue: 'Test Connection' })}
                      </Button>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={isUpdating || isSubmitting || !dirty}
                        className="rounded-[8px]! sm:h-12 h-10 px-6! py-2! btn-color text-white! font-medium transition-all duration-300 disabled:opacity-50 disabled:grayscale"
                      >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save_whatsapp_settings', { defaultValue: 'Save WhatsApp Provider' })}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telegram" className="animate-fade-in-up">
          <Card className="rounded-border-radius glass-card glass-dark-card overflow-hidden">
            <CardHeader className="border-b border-light-border-color py-6">
              <CardTitle className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Send className="w-6 h-6 text-sky-500" />
                </div>
                {t('campaign_hub_telegram', { defaultValue: 'Telegram Bot Configuration' })}
              </CardTitle>
              <CardDescription className="text-subtitle-color">
                {t('telegram_config_desc', {
                  defaultValue: 'Connect your Telegram bot using the token provided by BotFather.',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Formik initialValues={telegramInitialValues} enableReinitialize onSubmit={handleTelegramSubmit}>
                {({ values, handleChange, isSubmitting, dirty }) => (
                  <Form className="space-y-6">
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2 flex flex-col">
                        <Label htmlFor="telegram_token" className="text-sm font-medium text-foreground px-1">
                          {t('access_token', { defaultValue: 'Bot API Token' })}
                        </Label>
                        <PasswordInput
                          id="telegram_token"
                          name="botToken"
                          placeholder="123456789:ABCDefghIJKLmnopQRSTuvwxYZ"
                          value={values.botToken}
                          onChange={handleChange}
                          className="focus:bg-transparent transition-all h-12 border-light-border-color rounded-[8px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-light-border-color">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestTelegram(values)}
                        disabled={isTestingTelegram || !values.botToken}
                        className="rounded-[8px]! sm:h-12 h-10 px-6! py-2! bg-primary/20! text-primary! hover:bg-primary/30! dark:bg-white/10! dark:text-white! dark:hover:bg-white/20! font-medium transition-all duration-300"
                      >
                        {isTestingTelegram && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('test_connection', { defaultValue: 'Test Connection' })}
                      </Button>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={isUpdating || isSubmitting || !dirty}
                        className="rounded-[8px]! sm:h-12 h-10 px-10! py-2! btn-color text-white! font-medium transition-all duration-300 disabled:opacity-50 disabled:grayscale"
                      >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('save_telegram_settings', { defaultValue: 'Save Telegram Bot' })}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BotPreferencesSettings

