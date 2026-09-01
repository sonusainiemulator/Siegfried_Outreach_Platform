import { CodeLanguage, CodeModel, CodeStyle } from '@/types'
import { Braces, Coffee, Cpu, FileJson, Gem, Globe, Layout, Palette, Terminal, Type, Zap } from 'lucide-react'

export const getLanguages = (): CodeLanguage[] => [
  { value: 'javascript', label: 'JavaScript', icon: FileJson, color: '#f7df1e' },
  { value: 'typescript', label: 'TypeScript', icon: Braces, color: '#3178c6' },
  { value: 'python', label: 'Python', icon: Terminal, color: '#3776ab' },
  { value: 'html', label: 'HTML', icon: Layout, color: '#e34f26' },
  { value: 'css', label: 'CSS', icon: Palette, color: '#1572b6' },
  { value: 'php', label: 'PHP', icon: Globe, color: '#777bb4' },
  { value: 'java', label: 'Java', icon: Coffee, color: '#007396' },
  { value: 'c++', label: 'C++', icon: Cpu, color: '#00599c' },
  { value: 'go', label: 'Go', icon: Zap, color: '#00add8' },
  { value: 'ruby', label: 'Ruby', icon: Gem, color: '#cc342d' },
  { value: 'c', label: 'C', icon: Terminal, color: '#a8b9cc' },
  { value: 'csharp', label: 'C#', icon: Braces, color: '#239120' },
]

export const getCodeModels = (): CodeModel[] => [
  {
    value: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    desc: 'Lightning fast & efficient',
    badge: 'Fast',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    value: 'llama-3.3-70b-versatile',
    label: 'Llama 3.3 70B',
    desc: 'Power for complex logic',
    badge: 'Pro',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    value: 'deepseek/deepseek-chat',
    label: 'DeepSeek Chat',
    desc: 'Optimized for coders',
    badge: 'New',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
]

export const getCodeStyles = (): CodeStyle[] => [
  { value: 'clean-modern', label: 'Clean & Modern', icon: Zap },
  { value: 'functional', label: 'Functional', icon: Cpu },
  { value: 'object-oriented', label: 'Object Oriented', icon: Type },
  { value: 'minimal', label: 'Minimalist', icon: Terminal },
]
