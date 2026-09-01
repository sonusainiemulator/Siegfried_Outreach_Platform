import { FeatureItem } from '@/types/components/detectAI'
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  Fingerprint,
  Globe,
  Info,
  LayoutDashboard,
  Loader2,
  Mic,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Video,
  Zap
} from 'lucide-react'

export const detectionMatrixData = {
  getNeuralPerplexity: (aiScore: number) => ({
    label: 'Neural Perplexity',
    val: aiScore > 50 ? 'AI Predicted' : 'Highly Variable',
    level: aiScore > 50 ? 'bad' : 'good',
  }),
  getSyntacticBurstiness: (aiScore: number) => ({
    label: 'Syntactic Burstiness',
    val: aiScore > 70 ? 'Repeatable' : 'Natural Flow',
    level: aiScore > 70 ? 'bad' : 'good',
  }),
  getGlobalHashLookup: (plagScore: number) => ({
    label: 'Global Hash Lookup',
    val: plagScore > 10 ? 'Matches Found' : 'Clean Scan',
    level: plagScore > 10 ? 'bad' : 'good',
  }),
}

export const featureData: FeatureItem[] = [
  {
    icon: Fingerprint,
    title: 'Model Fingerprinting',
    desc: 'Identifies specific structural patterns unique to large language modal outputs',
    color: 'text-primary',
  },
  {
    icon: BrainCircuit,
    title: 'Neural Scanning',
    desc: 'Deep-layer analsis of semantic coherence and probability distribution.',
    color: 'text-emerald-500',
  },
  {
    icon: ShieldCheck,
    title: 'Fact Integrity',
    desc: 'Cross-references claims against global knowledge bases for veracity.',
    color: 'text-destructive',
  },
]

export const lucideIcons = {
  FileText,
  Globe,
  RefreshCw,
  LayoutDashboard,
  ShieldCheck,
  Info,
  ShieldAlert,
  Trash2,
  ArrowRight,
  Loader2,
  Zap,
}

export const gaugeColors = {
  risk: '#ef4444',
  health: '#10b981',
  track: 'rgba(0,0,0,0.05)',
}

export const dots = [0, 0.2, 0.4]

export const tabs = ['history', 'prompts']

export const speechToTextFeatures = [
  {
    titleKey: 'audio_video_support',
    descKey: 'supported_formats',
    icon: Mic,
    color: 'text-primary',
  },
  {
    titleKey: 'high_accuracy',
    descKey: 'powered_by_whisper',
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    titleKey: 'instant_preview',
    descKey: 'review_before_transcribe',
    icon: Video,
    color: 'text-blue-500',
  },
]