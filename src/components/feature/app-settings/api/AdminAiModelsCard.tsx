'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Coins, CheckCircle2, Save, Loader2, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetAiModelsQuery, useUpdateAiModelsMutation } from '@/redux/api/aiSocialApi'

export const AdminAiModelsCard = () => {
  const { t } = useTranslation()
  const { data: modelsData, isLoading, refetch } = useGetAiModelsQuery(undefined)
  const [updateAiModels, { isLoading: isSaving }] = useUpdateAiModelsMutation()
  const [models, setModels] = useState<any[]>([])

  useEffect(() => {
    if (modelsData?.data) {
      setModels(JSON.parse(JSON.stringify(modelsData.data)))
    }
  }, [modelsData])

  const handleMultiplierChange = (modelId: string, value: number) => {
    setModels((prev) =>
      prev.map((m) => (m.modelId === modelId ? { ...m, multiplier: value } : m))
    )
  }

  const handleToggleActive = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) => (m.modelId === modelId ? { ...m, isActive: !m.isActive } : m))
    )
  }

  const handleSave = async () => {
    try {
      await updateAiModels({ models }).unwrap()
      toast.success('AI Model Pricing Matrix updated successfully!')
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update model pricing')
    }
  }

  return (
    <div className="col-span-full group glass-dark-card relative sm:p-6 p-4 rounded-border-radius! border inner-card border-border/40 hover:border-primary/40 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-title-color dark:text-white flex items-center gap-2">
              AI Models & Credit Pricing Matrix
              <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                Admin Configurable
              </Badge>
            </h4>
            <p className="text-sm text-muted-foreground font-medium">
              Configure per-model credit multipliers for the AI Planner, Post Wizard, and Copywriting engines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-9 gap-1.5 text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="premium"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || models.length === 0}
            className="h-9 gap-1.5 text-xs font-bold cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Pricing Matrix
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((m) => (
          <div
            key={m.modelId}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
              m.isActive
                ? 'bg-background/60 border-border/60'
                : 'bg-muted/20 border-border/30 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h5 className="font-bold text-sm text-foreground">{m.name}</h5>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{m.provider}</span>
                </div>
                {m.badge && (
                  <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-primary/10 text-primary">
                    {m.badge}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {m.description || 'General purpose LLM generation engine'}
              </p>
            </div>

            <div className="pt-3 border-t border-border/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Credit Multiplier:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10.0"
                    value={m.multiplier}
                    onChange={(e) => handleMultiplierChange(m.modelId, parseFloat(e.target.value) || 1.0)}
                    className="w-18 h-8 px-2 text-center text-xs font-mono font-bold rounded-lg border border-border bg-background text-foreground"
                  />
                  <span className="text-xs font-bold text-primary">x</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(m.modelId)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    m.isActive
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {m.isActive ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminAiModelsCard
