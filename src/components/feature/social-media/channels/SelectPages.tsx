'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { multiplePlatformColors, platformIcons } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { useConnectSocialAccountMutation } from '@/redux/api/socialMediaApi'
import { ApiError, SelectPagesType } from '@/types'
import { authUtils } from '@/utils'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  Edit2,
  ExternalLink,
  Facebook,
  Loader2,
  MapPin,
  Phone,
  Save,
  Store,
  Users,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function SelectPages() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  const platform = (searchParams.get('platform') as keyof typeof platformIcons) || 'facebook'

  const [pages, setPages] = useState<SelectPagesType[]>([])
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [customNameInput, setCustomNameInput] = useState<string>('')

  const [connectAccount, { isLoading: isConnecting }] = useConnectSocialAccountMutation()

  useEffect(() => {
    document.title = `${t('social_node_selection')}`
  }, [t])

  useEffect(() => {
    if (!sessionId || !platform) {
      setError(t('social_invalid_handshake'))
      setLoading(false)
      return
    }

    fetchSessionData()
  }, [sessionId, t])

  const fetchSessionData = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
      const response = await fetch(`${API_BASE_URL}/social-auth/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${authUtils.getToken()}`,
        },
      })
      const data = await response.json()

      if (data.pages && data.pages.length > 0) {
        // Sanitize any mock markers from incoming names
        const sanitized = data.pages.map((p: SelectPagesType) => ({
          ...p,
          name: (p.name || '').replace(/\s*\(Mock\)/gi, '').trim(),
        }))
        setPages(sanitized)
        if (sanitized.length === 1) {
          setSelectedPages(new Set([sanitized[0].id]))
        }
      } else {
        setError(t('social_no_nodes'))
      }
    } catch (err: unknown) {
      console.error('Fetch session error:', err)
      setError(t('social_handshake_failure'))
    } finally {
      setLoading(false)
    }
  }

  const handleStartEditName = (page: SelectPagesType, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPageId(page.id)
    setCustomNameInput(page.name)
  }

  const handleSaveEditName = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!customNameInput.trim()) {
      setEditingPageId(null)
      return
    }
    const clean = customNameInput.replace(/\s*\(Mock\)/gi, '').trim()
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, name: clean } : p))
    )
    setEditingPageId(null)
    toast.success(t('social_business_name_updated', { defaultValue: 'Business name updated!' }))
  }

  const handleCancelEditName = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPageId(null)
  }

  const togglePageSelection = (pageId: string) => {
    const newSelection = new Set(selectedPages)
    if (newSelection.has(pageId)) {
      newSelection.delete(pageId)
    } else {
      newSelection.add(pageId)
    }
    setSelectedPages(newSelection)
  }

  const handleFinalize = async () => {
    if (selectedPages.size === 0) {
      toast.error(t('social_authority_node_required'))
      return
    }

    try {
      const selectedPagesList = pages.filter((p) => selectedPages.has(p.id))
      let lastMessage = ''

      for (const page of selectedPagesList) {
        const res = await connectAccount({
          sessionId,
          platform,
          accountId: page.id,
          accountName: page.name,
        }).unwrap()
        lastMessage = res.message
      }

      toast.success(lastMessage || t('social_nodes_connected', { count: selectedPages.size }))

      setTimeout(() => {
        router.push(ROUTES.SOCIAL_MEDIA.PLATFORMS)
      }, 1000)
    } catch (error) {
      const apiError = error as ApiError
      console.error('Connect error:', error)
      toast.error(apiError?.data?.message || t('social_nexus_integration_fault'))
    }
  }

  const platformData = {
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    icon: platformIcons[platform] || Facebook,
    ...(multiplePlatformColors[platform] || multiplePlatformColors.facebook),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-xl shadow-primary/10" />
          <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground animate-pulse">
            {t('social_scanning_cluster')}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6 text-center">
        <Card className="max-w-md border-destructive/20 bg-card/60 backdrop-blur-xl rounded-[2rem] p-10 space-y-8  ring-1 ring-white/5 mx-auto">
          <div className="w-20 h-20 bg-destructive/10 rounded-[1.5rem] flex items-center justify-center mx-auto text-destructive shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-medium">{t('social_system_fault')}</h3>
            <p className="text-sm font-medium text-muted-foreground opacity-80 leading-relaxed px-4">{error}</p>
          </div>
          <Button
            onClick={() => router.push(ROUTES.SOCIAL_MEDIA.PLATFORMS)}
            className="w-full sm:h-12 h-10 rounded-[8px] font-medium text-base bg-primary! text-white hover:bg-destructive/90 border-none"
          >
            {t('social_abort_operation')}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1300px] mx-auto space-y-8 animate-fade-in pb-24 px-4 md:px-0">
      <div className="relative  overflow-hidden ">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center  ring-1 ring-white/5',
                  platformData.bgColor,
                  platformData.borderColor,
                )}
              >
                <platformData.icon className={cn('w-7 h-7', platformData.color)} />
              </div>
              <div>
                <h1 className="text-xl font-medium ">
                  {platformData.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {platform === 'google' && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="text-sm font-bold text-foreground">
                Google Business Profile Connection
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 w-fit">
              Storefront Setup
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If your live Google Maps locations are not automatically listing below, your Google Cloud project needs the Business Profile APIs enabled:
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href="https://console.developers.google.com/apis/api/mybusinessaccountmanagement.googleapis.com/overview?project=203941120936"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background hover:bg-muted border border-border text-foreground font-medium transition-colors shadow-sm"
            >
              <span>1. Enable Account Management API</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            <a
              href="https://console.developers.google.com/apis/api/mybusinessbusinessinformation.googleapis.com/overview?project=203941120936"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background hover:bg-muted border border-border text-foreground font-medium transition-colors shadow-sm"
            >
              <span>2. Enable Business Information API</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            <a
              href="https://console.developers.google.com/apis/api/mybusiness.googleapis.com/overview?project=203941120936"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background hover:bg-muted border border-border text-foreground font-medium transition-colors shadow-sm"
            >
              <span>3. Enable Google My Business API</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            <a
              href="https://business.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background hover:bg-muted border border-border text-muted-foreground font-medium transition-colors shadow-sm"
            >
              <span>Google Business Profile Manager</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-muted-foreground/80 italic pt-1">
            💡 Tip: You can customize your Business Listing name below using the pencil icon before confirming!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => {
          const isSelected = selectedPages.has(page.id)
          const isEditingThis = editingPageId === page.id
          const meta = (page.metadata || {}) as Record<string, any>
          const isVerifiedLocation = meta.verified === true && !meta.isMock

          return (
            <Card
              key={page.id}
              className={cn(
                'group relative cursor-pointer border-border/40 glass-card rounded-border-radius overflow-hidden transition-all duration-500',
                isSelected
                  ? 'ring-2 ring-primary bg-primary/5 -translate-y-1 shadow-primary/10'
                  : 'hover:-translate-y-1 hover:border-primary/40',
              )}
              onClick={() => togglePageSelection(page.id)}
            >
              <div className="absolute top-6 right-6 z-20">
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-500 transform',
                    isSelected
                      ? 'bg-primary border-primary scale-110 shadow-lg'
                      : 'border-border/30 group-hover:border-primary/40 bg-background/50',
                  )}
                >
                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </div>
              </div>

              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="relative">
                    {page.picture ? (
                      <Image
                        src={page.picture}
                        alt={page.name}
                        width={96}
                        height={96}
                        className={cn(
                          'rounded-[2rem] object-cover ring-4 ring-background shadow-2xl transition-all duration-700',
                          isSelected ? 'ring-primary/40' : 'group-hover:scale-110',
                        )}
                        unoptimized
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-[2rem] bg-muted/30 flex items-center justify-center shadow-inner ring-4 ring-background">
                        {platform === 'google' ? (
                          <Store className="w-10 h-10 text-emerald-600/40" />
                        ) : (
                          <Users className="w-10 h-10 text-muted-foreground/20" />
                        )}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-background border border-border/40 shadow-xl">
                      <platformData.icon className={cn('w-4 h-4', platformData.color)} />
                    </div>
                  </div>

                  <div className="space-y-1.5 w-full">
                    {isEditingThis ? (
                      <div
                        className="flex items-center gap-1.5 justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={customNameInput}
                          onChange={(e) => setCustomNameInput(e.target.value)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-primary bg-background text-foreground font-semibold text-center w-full max-w-[200px] outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditName(page.id, e as any)
                            if (e.key === 'Escape') handleCancelEditName(e as any)
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => handleSaveEditName(page.id, e)}
                          className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                          title="Save Name"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditName}
                          className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors shrink-0"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <h3 className="text-sm font-black uppercase tracking-tight truncate max-w-[200px] group-hover:text-primary transition-colors">
                          {page.name}
                        </h3>
                        {platform === 'google' && (
                          <button
                            type="button"
                            onClick={(e) => handleStartEditName(page, e)}
                            className="p-1 rounded-md text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit Business Listing Name"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {platform === 'google' ? (
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full',
                            isVerifiedLocation
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-primary/10 text-primary border border-primary/20',
                          )}
                        >
                          {isVerifiedLocation ? 'Verified Storefront' : 'Google Business Profile'}
                        </span>
                        {page.category && (
                          <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                            {page.category}
                          </p>
                        )}
                      </div>
                    ) : (
                      page.category && (
                        <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                          {page.category}
                        </p>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-6 pt-4 w-full max-w-[240px] mx-auto border-t border-border/10">
                    <div className="flex-1 text-center">
                      <p className="text-sm font-black text-foreground">
                        {(page.followers_count || 0).toLocaleString()}
                      </p>
                      <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest mt-1">
                        {t('social_reach')}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-border/20" />
                    <div className="flex-1 text-center">
                      <p className="text-sm font-black text-primary">{page.engagement_rate || '0.0'}%</p>
                      <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest mt-1">
                        {t('social_impact')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="fixed bottom-12 left-0 right-0 flex px-6 z-50 pointer-events-none justify-end!">
        <div className="justify-between! p-3  flex items-center gap-3 pointer-events-auto animate-in slide-in-from-bottom-12 duration-700 ring-1 ring-white/10 shadow-primary/10">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.SOCIAL_MEDIA.PLATFORMS)}
            className="rounded-[8px] sm:h-12 h-10 px-8 text-base font-medium bg-subtitle-color/20 text-muted-foreground hover:bg-subtitle-color/20 transition-colors"
          >
            {t('social_abort')}
          </Button>
          <Button
            onClick={handleFinalize}
            disabled={isConnecting || selectedPages.size === 0}
            className="flex-1 rounded-xl sm:h-12 h-10 bg-primary! cursor-pointer  text-white font-medium text-base shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all gap-3 border-none"
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t('social_confirm_nodes', { count: selectedPages.size })}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
