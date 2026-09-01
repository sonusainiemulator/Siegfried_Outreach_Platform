'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useGetPusherSettingsQuery,
  useTestPusherConfigMutation,
  useUpdatePusherSettingsMutation,
} from '@/redux/api/notificationApi'
import { Bell, Key, Loader2, Radio, Save, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function PusherConfig() {
  const { data: pusherData, isLoading: isFetching } = useGetPusherSettingsQuery()
  const [updatePusher, { isLoading: isSaving }] = useUpdatePusherSettingsMutation()
  const [testPusher, { isLoading: isTesting }] = useTestPusherConfigMutation()

  const [appId, setAppId] = useState('')
  const [key, setKey] = useState('')
  const [secret, setSecret] = useState('')
  const [cluster, setCluster] = useState('mt1')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (pusherData?.data) {
      setAppId(pusherData.data.pusher_app_id || '')
      setKey(pusherData.data.pusher_key || '')
      setSecret(pusherData.data.pusher_secret || '')
      setCluster(pusherData.data.pusher_cluster || 'mt1')
      setEnabled(Boolean(pusherData.data.pusher_enabled))
    }
  }, [pusherData])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await updatePusher({
        pusher_app_id: appId.trim(),
        pusher_key: key.trim(),
        pusher_secret: secret.trim(),
        pusher_cluster: cluster.trim() || 'mt1',
        pusher_enabled: enabled,
      }).unwrap()

      toast.success(res.message || 'Pusher configuration saved successfully!')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update Pusher settings.')
    }
  }

  const handleTestConnection = async () => {
    if (!appId.trim() || !key.trim()) {
      toast.error('Please enter App ID and Key before testing.')
      return
    }

    try {
      const res = await testPusher({
        pusher_app_id: appId.trim(),
        pusher_key: key.trim(),
        pusher_secret: secret.trim(),
        pusher_cluster: cluster.trim() || 'mt1',
      }).unwrap()

      if (res.success) {
        toast.success('🎉 Pusher SDK Connection Test Successful!')
      } else {
        toast.error(res.message || 'Pusher test failed.')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Pusher connection test failed.')
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="rounded-[16px] border shadow-sm bg-white dark:bg-card">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Pusher.com Real-time Push API SDK</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Configure Pusher credentials to broadcast instant push notifications & real-time events to SaaS users.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="pusher-switch" className="text-xs font-semibold">
              Enable Pusher SDK
            </Label>
            <Switch id="pusher-switch" checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App ID */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-muted-foreground" /> Pusher App ID
              </Label>
              <Input
                placeholder="e.g. 1234567"
                value={appId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppId(e.target.value)}
                className="font-mono text-xs h-10 rounded-lg"
              />
            </div>

            {/* Key */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-muted-foreground" /> Pusher App Key
              </Label>
              <Input
                placeholder="e.g. 2382f7389a..."
                value={key}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
                className="font-mono text-xs h-10 rounded-lg"
              />
            </div>

            {/* Secret */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <LockIcon className="w-3.5 h-3.5 text-muted-foreground" /> Pusher App Secret
              </Label>
              <Input
                type="password"
                placeholder="e.g. ********"
                value={secret}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecret(e.target.value)}
                className="font-mono text-xs h-10 rounded-lg"
              />
            </div>

            {/* Cluster */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-muted-foreground" /> Pusher Cluster
              </Label>
              <Input
                placeholder="e.g. mt1 or us2 or eu"
                value={cluster}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCluster(e.target.value)}
                className="font-mono text-xs h-10 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || !appId}
              className="h-10 rounded-lg gap-2"
            >
              {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" />}
              Test Connection
            </Button>

            <Button type="submit" disabled={isSaving} className="h-10 rounded-lg bg-primary text-white font-bold gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Pusher Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function LockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
