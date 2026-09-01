import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const avatarColors = [
  'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600 dark:from-pink-500/10 dark:to-transparent dark:text-pink-400',
  'bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 dark:from-purple-500/10 dark:to-transparent dark:text-purple-400',
  'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 dark:from-blue-500/10 dark:to-transparent dark:text-blue-400',
  'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 dark:from-emerald-500/10 dark:to-transparent dark:text-emerald-400',
  'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 dark:from-amber-500/10 dark:to-transparent dark:text-amber-400',
  'bg-gradient-to-br from-red-100 to-red-50 text-red-600 dark:from-red-500/10 dark:to-transparent dark:text-red-400',
  'bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/10 dark:to-transparent dark:text-indigo-400',
  'bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-600 dark:from-cyan-500/10 dark:to-transparent dark:text-cyan-400',
]



export function getAvatarColorClass(name: string | undefined | null) {
  if (!name) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}
