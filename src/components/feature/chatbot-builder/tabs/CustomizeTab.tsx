'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textArea'
import { getInteractionTypes } from '@/data/aiChatbot'
import { CustomizeTabProps } from '@/types'
import { useTranslation } from 'react-i18next'
import ChatbotPreview from '../ChatbotPreview'
import { AvatarSection } from './customize/AvatarSection'
import { ColorSection } from './customize/ColorSection'
import { RadiusSection } from './customize/RadiusSection'
import { SurfaceSection } from './customize/SurfaceSection'
import { TypographySection } from './customize/TypographySection'

const CustomizeTab = ({ formData, updateFormField }: CustomizeTabProps) => {
  const { t } = useTranslation()
  const interactionTypes = getInteractionTypes()

  return (
    <div className="space-y-8 sm:p-6 p-2 px-1 sm:px-6 min-h-[600px] flex flex-col">
      {/* Step Header */}
      <div className="px-2">
        <h3 className="text-xl font-medium text-title-color dark:text-white capitalize mb-0">
          {t('personalize_agent', { defaultValue: 'Personalize your agent' })}
        </h3>
        <p className="text-subtitle-color text-base">{t('personalize_desc', { defaultValue: 'Define who your bot is and how it should look' })}</p>
      </div>

      <Tabs defaultValue="identity" className="flex-1 flex flex-col">
        {/* Navigation Tabs at the top */}
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-xl grid-cols-3 bg-muted/20 p-1 rounded-[12px] h-12">
            <TabsTrigger value="identity" className="rounded-[10px] sm:text-sm text-[12px] data-[state=active]:bg-primary data-[state=active]:text-white h-10 p-3 cursor-pointer data-[state=active]:shadow-sm transition-all">
              {t('personality', { defaultValue: 'Personality' })}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-[10px] sm:text-sm text-[12px] data-[state=active]:bg-primary data-[state=active]:text-white h-10 p-3 cursor-pointer data-[state=active]:shadow-sm transition-all">
              {t('appearance', { defaultValue: 'Appearance' })}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-[10px] sm:text-sm text-[12px] data-[state=active]:bg-primary data-[state=active]:text-white h-10 p-3 cursor-pointer data-[state=active]:shadow-sm transition-all">
              {t('advanced', { defaultValue: 'Advanced' })}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Specialized Side-by-Side Area */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative min-h-[500px]">

          {/* Settings Modal-like Panels (Left Side) */}
          <div className="xl:col-span-7 h-full">
            <div className="glass-card glass-dark-card rounded-border-radius sm:p-6 p-4 sticky top-2 backdrop-blur-md">
              <TabsContent value="identity" className="mt-0 space-y-6 animate-scale-in">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    {t('chatbot_name')} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormField('name', e.target.value)}
                    placeholder={t('enter_chatbot_name')}
                    className="rounded-[8px] glass-card border-border/40"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-foreground">
                    {t('interaction_type', { defaultValue: 'Interaction Mode' })}
                  </Label>
                  <Select
                    value={formData.interactionType}
                    onValueChange={(v: 'ai_only' | 'human_only' | 'hybrid') => updateFormField('interactionType', v)}
                  >
                    <SelectTrigger className="rounded-[8px] glass-card border-border/40 h-11">
                      <SelectValue placeholder={t('select_mode')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-border-radius dark:bg-modal-bg-color border-border/40 bg-popover">
                      {interactionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">{t('description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    rows={3}
                    className="rounded-[8px] glass-card border-border/40 resize-none"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="welcome" className="text-sm font-medium text-foreground">{t('welcome_message')}</Label>
                  <Textarea
                    id="welcome"
                    value={formData.welcomeMessage}
                    onChange={(e) => updateFormField('welcomeMessage', e.target.value)}
                    rows={2}
                    className="rounded-[8px] glass-card border-border/40 resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 space-y-8 animate-scale-in max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <AvatarSection formData={formData} updateFormField={updateFormField} />
                <ColorSection formData={formData} updateFormField={updateFormField} />
                <RadiusSection formData={formData} updateFormField={updateFormField} />
                <SurfaceSection formData={formData} updateFormField={updateFormField} />
                <TypographySection formData={formData} updateFormField={updateFormField} />
              </TabsContent>

              <TabsContent value="advanced" className="mt-0 space-y-8 animate-scale-in">
                <div className="space-y-4 bg-muted/10 p-5 rounded-border-radius border border-border/20 glass-card">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">{t('temperature')}</Label>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">{formData.temperature}</span>
                  </div>
                  <Slider
                    value={[formData.temperature]}
                    onValueChange={(v) => updateFormField('temperature', v[0])}
                    min={0} max={1} step={0.1}
                  />
                </div>

                <div className="space-y-4 bg-muted/10 p-5 rounded-border-radius border border-border/20 glass-card">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">{t('max_tokens')}</Label>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">{formData.maxTokens}</span>
                  </div>
                  <Slider
                    value={[formData.maxTokens]}
                    onValueChange={(v) => updateFormField('maxTokens', v[0])}
                    min={100} max={8000} step={100}
                  />
                </div>
              </TabsContent>
            </div>
          </div>

          {/* Live Preview Centered (Right Side) */}
          <div className="xl:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group max-w-[450px] w-full">

              {/* Label above preview */}
              <div className="mb-6 text-center glass-card glass-dark-card backdrop-blur-md p-3 rounded-border-radius border border-border/20 relative z-20">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-sm font-medium text-primary dark:text-primary">
                    {t('real_time_preview', { defaultValue: 'Live Preview' })}
                  </p>
                </div>
                <p className="text-[12px] text-subtitle-color font-medium">
                  {t('preview_updates_hint', { defaultValue: 'Instant visual feedback' })}
                </p>
              </div>

              {/* Decorative ring around preview */}

              <div className="relative rounded-border-radius overflow-hidden sm:ring-8 ring-4 ring-muted/20 mx-auto w-full">
                <ChatbotPreview formData={formData} />
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default CustomizeTab
