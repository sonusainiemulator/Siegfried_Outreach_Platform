import { BACKEND_API_URL } from '@/constants';
import { FileText, ImageIcon } from 'lucide-react';

// Helper to strip simple markdown for plain text formats
export const stripMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')    
    .replace(/__(.*?)__/g, '$1')    
    .replace(/`(.*?)`/g, '$1');     
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isImageFile(file: File) {
  return file.type.startsWith('image/')
}

export function getFileIcon(file: File) {
  if (file.type.startsWith('image/'))
    return <ImageIcon className="w-4 h-4 text-blue-500" />
  return <FileText className="w-4 h-4 text-violet-500" />
}

export const resolveAvatarUrl = (avatarUrl?: string): string | null => {
  if (!avatarUrl) return null
  if (avatarUrl.startsWith('data:') || avatarUrl.startsWith('blob:') || avatarUrl.startsWith('http')) {
    return avatarUrl
  }
  return `${BACKEND_API_URL}/${avatarUrl}`
}

export const formatTimestamp = (): string => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })