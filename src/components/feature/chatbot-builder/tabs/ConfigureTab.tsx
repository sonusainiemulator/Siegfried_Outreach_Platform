'use client'

import { useEffect, useMemo, useState } from 'react'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import Input from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  categories,
  getModels,
  getProviders,
  fetchLiveOpenRouterModels,
  OpenRouterModelOption,
} from '@/data/aiChatbot'
import { ConfigureTabProps } from '@/types'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, Gift, RefreshCw, Search, Sparkles, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ConfigureTab = ({ formData, updateFormField }: ConfigureTabProps) => {
  const { t } = useTranslation()

  const providers = getProviders()
  const allModels = getModels()
  const modelList = (allModels as any)[formData.provider] || []

  // OpenRouter live state
  const [openRouterModels, setOpenRouterModels] = useState<OpenRouterModelOption[]>(
    ((allModels as any).openrouter || []) as OpenRouterModelOption[]
  )
  const [isFetchingModels, setIsFetchingModels] = useState(false)
  const [searchModel, setSearchModel] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'free' | 'deepseek' | 'anthropic' | 'openai' | 'google' | 'meta'>('all')
  const [popoverOpen, setPopoverOpen] = useState(false)

  const loadModels = async (manual = false) => {
    setIsFetchingModels(true)
    try {
      const data = await fetchLiveOpenRouterModels(formData.apiKey)
      if (data.allModels && data.allModels.length > 0) {
        setOpenRouterModels(data.allModels)
        if (manual) {
          toast.success(
            t('models_fetched_success', {
              defaultValue: `Fetched ${data.totalCount} live models (${data.freeCount} Free models)`,
            })
          )
        }
      }
    } catch (err: any) {
      if (manual) {
        toast.error(
          t('models_fetched_error', {
            defaultValue: 'Failed to fetch live models from OpenRouter. Using verified list.',
          })
        )
      }
    } finally {
      setIsFetchingModels(false)
    }
  }

  // Auto fetch when OpenRouter is selected
  useEffect(() => {
    if (formData.provider === 'openrouter') {
      loadModels(false)
      // If no model or mismatched model, default to top live model
      const currentList = openRouterModels.length > 0 ? openRouterModels : ((allModels as any).openrouter || [])
      const hasCurrent = currentList.some((m: any) => m.value === formData.model)
      if (!formData.model || !hasCurrent || formData.model === 'gpt-3.5-turbo') {
        updateFormField('model', 'deepseek/deepseek-v4.1-flash')
      }
    }
  }, [formData.provider])

  const handleProviderChange = (v: 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom') => {
    updateFormField('provider', v)
    if (v === 'openrouter') {
      const openrouterList = openRouterModels.length > 0 ? openRouterModels : ((allModels as any).openrouter || [])
      if (!openrouterList.some((m: any) => m.value === formData.model)) {
        updateFormField('model', 'deepseek/deepseek-v4.1-flash')
      }
    } else {
      const list = (allModels as any)[v] || []
      if (list.length > 0 && !list.some((m: any) => m.value === formData.model)) {
        updateFormField('model', list[0].value)
      }
    }
  }

  // Filtered OpenRouter models
  const freeCount = useMemo(() => {
    return openRouterModels.filter((m) => m.isFree || m.value.endsWith(':free') || m.label.includes('[FREE]')).length
  }, [openRouterModels])

  const filteredModels = useMemo(() => {
    return openRouterModels.filter((m) => {
      const q = searchModel.trim().toLowerCase()
      const matchesSearch = !q || m.label.toLowerCase().includes(q) || m.value.toLowerCase().includes(q)
      if (!matchesSearch) return false

      const isModelFree = m.isFree || m.value.endsWith(':free') || m.label.includes('[FREE]')

      if (activeCategory === 'free') return isModelFree
      if (activeCategory === 'deepseek') return m.value.toLowerCase().includes('deepseek')
      if (activeCategory === 'anthropic') return m.value.toLowerCase().includes('anthropic') || m.value.toLowerCase().includes('claude')
      if (activeCategory === 'openai') return m.value.toLowerCase().includes('openai') || m.value.toLowerCase().includes('gpt') || m.value.toLowerCase().includes('o1') || m.value.toLowerCase().includes('o3')
      if (activeCategory === 'google') return m.value.toLowerCase().includes('google') || m.value.toLowerCase().includes('gemini') || m.value.toLowerCase().includes('gemma')
      if (activeCategory === 'meta') return m.value.toLowerCase().includes('meta') || m.value.toLowerCase().includes('llama')

      return true
    })
  }, [openRouterModels, searchModel, activeCategory])

  const selectedModelObj = useMemo(() => {
    return openRouterModels.find((m) => m.value === formData.model)
  }, [openRouterModels, formData.model])

  const isCurrentModelFree =
    selectedModelObj?.isFree ||
    formData.model?.endsWith(':free') ||
    selectedModelObj?.label?.includes('[FREE]')

  return (
    <div className="space-y-12">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => updateFormField('category', cat.title)}
            className={`cursor-pointer p-5 rounded-border-radius border-2 transition-all relative overflow-hidden group ${
              formData.category === cat.id
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
                : ' inner-card glass-dark-card '
            }`}
          >
            {cat.badge && (
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {cat.badge}
              </span>
            )}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 ${cat.color}`}>
              {cat.icon}
            </div>
            <h4 className={`font-semibold mb-1 ${formData.category === cat.id ? 'text-primary' : 'text-title-color dark:text-white'}`}>
              {cat.title}
            </h4>
            <p className="text-xs text-subtitle-color leading-relaxed">
              {cat.description}
            </p>
          </div>
        ))}
      </div>

      {/* AI Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/20 pt-6">
        {/* Provider */}
        <div className="space-y-2 flex flex-col">
          <Label className="text-sm font-medium text-foreground">
            {t('ai_provider')}
          </Label>
          <Select value={formData.provider} onValueChange={handleProviderChange}>
            <SelectTrigger className="rounded-[8px] h-12 inner-card glass-dark-card border-border/40 bg-muted/20">
              <SelectValue placeholder={t('select_provider')} />
            </SelectTrigger>
            <SelectContent className="rounded-border-radius dark:bg-modal-bg-color border-border/40 bg-white">
              {providers.map((provider: { value: string; label: string }) => (
                <SelectItem key={provider.value} value={provider.value} className="text-foreground dark:hover:bg-dark-gray-accent">
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Key */}
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="apiKey" className="text-sm font-medium text-foreground">
            {t('api_key')} *
          </Label>
          <PasswordInput
            id="apiKey"
            value={formData.apiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormField('apiKey', e.target.value)}
            placeholder={t('enter_api_key')}
            className="rounded-[8px] h-12 inner-card glass-dark-card border-border/40 bg-muted/20"
          />
        </div>

        {/* Model */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              {t('model')}
              {formData.provider === 'openrouter' && (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                  {freeCount} Free Models
                </span>
              )}
            </Label>
            {formData.provider === 'openrouter' && (
              <button
                type="button"
                onClick={() => loadModels(true)}
                disabled={isFetchingModels}
                className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50 transition-all cursor-pointer font-medium"
                title="Fetch live models directly from OpenRouter API"
              >
                <RefreshCw className={cn('w-3 h-3', isFetchingModels && 'animate-spin')} />
                <span>{isFetchingModels ? 'Fetching...' : 'Fetch Latest'}</span>
              </button>
            )}
          </div>

          {formData.provider === 'openrouter' ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rounded-[8px] h-12 inner-card glass-dark-card border border-border/40 bg-muted/20 px-3 flex items-center justify-between text-left text-sm hover:border-primary/50 transition-all focus:outline-none"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    <span className="truncate font-medium text-foreground">
                      {selectedModelObj?.label || formData.model || t('select_model')}
                    </span>
                    {isCurrentModelFree && (
                      <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        FREE ($0)
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0 text-muted-foreground" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-[340px] sm:w-[480px] p-3 rounded-2xl bg-white dark:bg-[#111622] border border-border/60 shadow-2xl z-50 space-y-3"
              >
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchModel}
                    onChange={(e) => setSearchModel(e.target.value)}
                    placeholder="Search model, free, gemma, deepseek, claude..."
                    className="ps-9 pe-8 h-10 text-xs rounded-xl bg-muted/30 border-border/40 focus-visible:ring-primary/20"
                  />
                  {searchModel && (
                    <button
                      type="button"
                      onClick={() => setSearchModel('')}
                      className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0',
                      activeCategory === 'all'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    All ({openRouterModels.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('free')}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors shrink-0',
                      activeCategory === 'free'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                    )}
                  >
                    <Gift className="w-3 h-3" />
                    Free Only ({freeCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('deepseek')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0',
                      activeCategory === 'deepseek'
                        ? 'bg-primary text-white'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                    )}
                  >
                    DeepSeek
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('anthropic')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0',
                      activeCategory === 'anthropic'
                        ? 'bg-primary text-white'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                    )}
                  >
                    Claude
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('openai')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0',
                      activeCategory === 'openai'
                        ? 'bg-primary text-white'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                    )}
                  >
                    OpenAI
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('google')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0',
                      activeCategory === 'google'
                        ? 'bg-primary text-white'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                    )}
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('meta')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0',
                      activeCategory === 'meta'
                        ? 'bg-primary text-white'
                        : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                    )}
                  >
                    Llama
                  </button>
                </div>

                {/* Model List */}
                <div className="max-h-64 overflow-y-auto space-y-1 pe-1 custom-scrollbar">
                  {filteredModels.length === 0 ? (
                    <div className="py-6 text-center space-y-2">
                      <p className="text-xs text-muted-foreground">
                        No models matched &quot;{searchModel}&quot;
                      </p>
                      {searchModel.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            updateFormField('model', searchModel.trim())
                            setPopoverOpen(false)
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
                        >
                          Use custom ID: &quot;{searchModel.trim()}&quot;
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredModels.map((model) => {
                      const isFree =
                        model.isFree ||
                        model.value.endsWith(':free') ||
                        model.label.includes('[FREE]')
                      const isSelected = model.value === formData.model

                      return (
                        <button
                          type="button"
                          key={model.value}
                          onClick={() => {
                            updateFormField('model', model.value)
                            setPopoverOpen(false)
                          }}
                          className={cn(
                            'w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group',
                            isSelected
                              ? 'bg-primary/10 border border-primary/30'
                              : 'hover:bg-muted/40 border border-transparent'
                          )}
                        >
                          <div className="flex-1 min-w-0 pe-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold truncate text-foreground">
                                {model.label}
                              </span>
                              {isFree && (
                                <span className="shrink-0 px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  FREE
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">
                              {model.value}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                      )
                    })
                  )}
                </div>

                {/* Footer status */}
                <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    Showing {filteredModels.length} of {openRouterModels.length} models
                  </span>
                  <button
                    type="button"
                    onClick={() => loadModels(true)}
                    disabled={isFetchingModels}
                    className="text-primary hover:underline font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={cn('w-3 h-3', isFetchingModels && 'animate-spin')} />
                    Live Sync
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Select value={formData.model} onValueChange={(v: string) => updateFormField('model', v)}>
              <SelectTrigger className="rounded-[8px] h-12 inner-card glass-dark-card border-border/40 bg-muted/20">
                <SelectValue placeholder={t('select_model')} />
              </SelectTrigger>
              <SelectContent className="rounded-border-radius bg-white dark:bg-modal-bg-color border-border/40 max-h-72">
                {modelList.map((model: { value: string; label: string }) => (
                  <SelectItem key={model.value} value={model.value} className="text-foreground dark:hover:bg-dark-gray-accent">
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* AI Persona & System Instructions (e.g. Calendly, Rules, Tone) */}
      <div className="border-t border-border/20 pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Label htmlFor="systemInstruction" className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('system_instructions', { defaultValue: 'System Instructions & AI Persona' })}
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('system_instructions_desc', {
                defaultValue: 'Define your bot’s identity, personality, rules, and actions (e.g. Calendly appointment booking link).',
              })}
            </p>
          </div>

          {/* Quick Prompt Starters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const calendlyTemplate = `You are Christopher Siegfried's official virtual assistant on christophersiegfried.com.
Your primary role is to answer questions professionally, introduce services, and help visitors book appointments.

APPOINTMENT BOOKING RULES:
1. Whenever a user asks to book an appointment, schedule a consultation, set up a call, or meet, always provide the Calendly link enthusiastically:
   "You can book an appointment directly on Christopher Siegfried's calendar here: [Schedule on Calendly](https://calendly.com/YOUR_LINK) — pick any date and time that fits your schedule!"
2. Never tell the user that you cannot book appointments. Instead, guide them directly to the Calendly link above.
3. Keep responses warm, concise, professional, and helpful.`
                updateFormField('systemInstruction', calendlyTemplate)
                toast.success('Calendly & Appointment template applied!')
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all"
            >
              📅 Calendly Booking Prompt
            </button>

            <button
              type="button"
              onClick={() => {
                const leadGenTemplate = `You are a friendly and helpful business assistant.
Your goal is to assist visitors, capture their interest, and direct them to book a discovery call.
When they express interest or ask to speak to someone, guide them to our booking link: [Schedule Meeting](https://calendly.com/YOUR_LINK).`
                updateFormField('systemInstruction', leadGenTemplate)
                toast.success('Lead Generation template applied!')
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              💼 Lead Generation
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="systemInstruction"
            rows={5}
            value={formData.systemInstruction || ''}
            onChange={(e) => updateFormField('systemInstruction', e.target.value)}
            placeholder={`e.g. You are Christopher Siegfried's assistant. When visitors ask to book an appointment or schedule a meeting, always guide them to our Calendly link: https://calendly.com/your-name`}
            className="w-full p-4 rounded-xl text-sm inner-card glass-dark-card border border-border/40 bg-muted/10 focus:border-primary/50 focus:outline-none transition-all resize-y leading-relaxed text-foreground placeholder:text-muted-foreground/60"
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 mt-1">
            <span>Markdown links like <code>[Book Call](https://calendly.com/...)</code> render as clickable buttons.</span>
            <span>{(formData.systemInstruction || '').length} characters</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigureTab
