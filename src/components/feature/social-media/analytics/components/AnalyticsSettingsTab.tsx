'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Save,
  Clock,
  BellRing,
  Database,
  Layers,
  CheckCircle2,
  RefreshCw,
  Sliders,
} from 'lucide-react'
import {
  useGetAnalyticsSettingsQuery,
  useUpdateAnalyticsSettingsMutation,
} from '@/redux/api/socialAnalyticsApi'
import { toast } from 'sonner'

export const AnalyticsSettingsTab: React.FC = () => {
  const { data: settingsData, isLoading } = useGetAnalyticsSettingsQuery()
  const [updateSettings, { isLoading: isSaving }] = useUpdateAnalyticsSettingsMutation()

  const defaultPlatformSettings = {
    autoSync: true,
    syncFrequency: '6h',
    retentionDays: 90,
    trackDemographics: true,
    alertThresholdEngagementRate: 2.5,
    notifyOnSpikes: true,
  }

  const [settings, setSettings] = useState<any>({
    facebook: { ...defaultPlatformSettings },
    instagram: { ...defaultPlatformSettings, trackStories: true, trackReels: true },
    tiktok: { ...defaultPlatformSettings, alertThresholdEngagementRate: 5.0 },
    twitter: { ...defaultPlatformSettings, trackMentions: true },
    youtube: { ...defaultPlatformSettings, trackDeviceMetrics: true },
  })

  useEffect(() => {
    if (settingsData?.settings && Object.keys(settingsData.settings).length > 0) {
      setSettings((prev: any) => ({
        ...prev,
        ...settingsData.settings,
      }))
    }
  }, [settingsData])

  const handleToggle = (platform: string, field: string, value: boolean) => {
    setSettings((prev: any) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }))
  }

  const handleChange = (platform: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    try {
      await updateSettings({ settings }).unwrap()
      toast.success('Social media analytics settings saved successfully!')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save settings')
    }
  }

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook Settings',
      badge: 'Meta Graph API',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      description: 'Page impressions, engagement heatmaps, sentiment & fan demographics',
    },
    {
      id: 'instagram',
      name: 'Instagram Settings',
      badge: 'Instagram Business API',
      badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
      description: 'Stories metrics, Reels performance, profile actions & audience hourly activity',
    },
    {
      id: 'tiktok',
      name: 'TikTok Settings',
      badge: 'TikTok For Business',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      description: 'Video views, viral velocity, net followers & posting pattern vs engagement',
    },
    {
      id: 'twitter',
      name: 'X (Twitter) Settings',
      badge: 'X API v2',
      badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
      description: 'Retweets, mentions awareness, daily post density & audience growth curve',
    },
    {
      id: 'youtube',
      name: 'YouTube Settings',
      badge: 'YouTube Data & Analytics API',
      badgeColor: 'border-red-500/30 text-red-400 bg-red-500/10',
      description: 'Watch minutes, gained/lost subscribers, likes vs dislikes & viewer device split',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar with save button */}
      <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Multi-Platform Analytics Settings
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure sync intervals, retention policies, and tracking preferences for all integrated channels.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {isSaving ? 'Saving Changes...' : 'Save Settings'}
          </Button>
        </div>
      </Card>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((plat) => {
          const cfg = settings[plat.id] || defaultPlatformSettings
          return (
            <Card key={plat.id} className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                      {plat.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{plat.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono ${plat.badgeColor}`}>
                    {plat.badge}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Auto Sync Switch */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold text-foreground">Live Auto-Sync</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Periodically fetch updated metrics from platform API
                    </p>
                  </div>
                  <Switch
                    checked={cfg.autoSync ?? true}
                    onCheckedChange={(val) => handleToggle(plat.id, 'autoSync', val)}
                  />
                </div>

                {/* Sync Frequency & Retention */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" /> Sync Frequency
                    </Label>
                    <select
                      value={cfg.syncFrequency || '6h'}
                      onChange={(e) => handleChange(plat.id, 'syncFrequency', e.target.value)}
                      className="w-full h-8 rounded-xl bg-background border border-border/50 px-2.5 text-xs text-foreground"
                    >
                      <option value="1h">Every 1 Hour</option>
                      <option value="6h">Every 6 Hours</option>
                      <option value="12h">Every 12 Hours</option>
                      <option value="24h">Daily (24 Hours)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-muted-foreground" /> Data Retention
                    </Label>
                    <select
                      value={cfg.retentionDays || 90}
                      onChange={(e) => handleChange(plat.id, 'retentionDays', Number(e.target.value))}
                      className="w-full h-8 rounded-xl bg-background border border-border/50 px-2.5 text-xs text-foreground"
                    >
                      <option value={30}>30 Days</option>
                      <option value={90}>90 Days</option>
                      <option value={180}>180 Days</option>
                      <option value={365}>1 Year</option>
                      <option value={0}>Unlimited</option>
                    </select>
                  </div>
                </div>

                {/* Additional Toggles */}
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Demographics & Geo Breakdown</span>
                    <Switch
                      checked={cfg.trackDemographics ?? true}
                      onCheckedChange={(val) => handleToggle(plat.id, 'trackDemographics', val)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Viral Spike Notification Alerts</span>
                    <Switch
                      checked={cfg.notifyOnSpikes ?? true}
                      onCheckedChange={(val) => handleToggle(plat.id, 'notifyOnSpikes', val)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
