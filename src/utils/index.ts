import { isBrowser } from './environment'
import { format } from 'date-fns'
import { CookieOptions } from '@/types/app'
import Cookies from 'js-cookie'
import { User } from '../types/auth'

/**
 * COOKIE UTILS
 */

const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60, // 7 days
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (!isBrowser) return

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  let expires: Date | number | undefined = mergedOptions.expires
  if (mergedOptions.maxAge !== undefined && !expires) {
    expires = mergedOptions.maxAge / (24 * 60 * 60)
  }

  const cookieOptions: Cookies.CookieAttributes = {
    expires: expires,
    path: mergedOptions.path,
    domain: mergedOptions.domain,
    secure: mergedOptions.secure,
    sameSite: mergedOptions.sameSite,
  }

  Cookies.set(name, value, cookieOptions)
}

export const getCookie = (name: string): string | null => {
  if (!isBrowser) return null
  return Cookies.get(name) || null
}

export const removeCookie = (name: string, options: CookieOptions = {}): void => {
  if (!isBrowser) return

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  const cookieOptions: Cookies.CookieAttributes = {
    path: mergedOptions.path,
    domain: mergedOptions.domain,
  }

  Cookies.remove(name, cookieOptions)
}

export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null
}

/**
 * AUTH UTILS
 */

const TOKEN_KEY = 'authToken'
const USER_KEY = 'userData'
const ORIGINAL_ADMIN_TOKEN_KEY = 'originalAdminToken'
const ORIGINAL_ADMIN_USER_KEY = 'originalAdminUserData'
const IS_IMPERSONATING_KEY = 'isImpersonating'

const getCookieOptions = () => ({
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
})

export const authUtils = {
  setToken: (token: string): void => {
    if (isBrowser) {
      setCookie(TOKEN_KEY, token, getCookieOptions())
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  getToken: (): string | null => {
    if (isBrowser) {
      const cookieToken = getCookie(TOKEN_KEY)
      if (cookieToken && cookieToken !== 'undefined' && cookieToken !== 'null') return cookieToken
      const localToken = localStorage.getItem(TOKEN_KEY)
      if (localToken && localToken !== 'undefined' && localToken !== 'null') return localToken
    }
    return null
  },

  removeToken: (): void => {
    if (isBrowser) {
      removeCookie(TOKEN_KEY, getCookieOptions())
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  setUser: (user: User): void => {
    if (isBrowser) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },

  getUser: (): User | null => {
    if (isBrowser) {
      const userData = localStorage.getItem(USER_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  removeUser: (): void => {
    if (isBrowser) {
      localStorage.removeItem(USER_KEY)
    }
  },

  setOriginalAdmin: (token: string, user: User): void => {
    if (isBrowser) {
      localStorage.setItem(ORIGINAL_ADMIN_TOKEN_KEY, token)
      localStorage.setItem(ORIGINAL_ADMIN_USER_KEY, JSON.stringify(user))
      localStorage.setItem(IS_IMPERSONATING_KEY, 'true')
    }
  },

  getOriginalAdminToken: (): string | null => {
    if (isBrowser) {
      return localStorage.getItem(ORIGINAL_ADMIN_TOKEN_KEY)
    }
    return null
  },

  getOriginalAdminUser: (): User | null => {
    if (isBrowser) {
      const data = localStorage.getItem(ORIGINAL_ADMIN_USER_KEY)
      return data ? JSON.parse(data) : null
    }
    return null
  },

  isImpersonating: (): boolean => {
    if (isBrowser) {
      return localStorage.getItem(IS_IMPERSONATING_KEY) === 'true'
    }
    return false
  },

  clearImpersonation: (): void => {
    if (isBrowser) {
      localStorage.removeItem(ORIGINAL_ADMIN_TOKEN_KEY)
      localStorage.removeItem(ORIGINAL_ADMIN_USER_KEY)
      localStorage.removeItem(IS_IMPERSONATING_KEY)
    }
  },

  clearAuth: (): void => {
    authUtils.removeToken()
    authUtils.removeUser()
    authUtils.clearImpersonation()
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  },
}

export const getMediaUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('data:')) return path

  const baseUrl = (process.env.NEXT_PUBLIC_STORAGE_URL || '').replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const normalizedPath = cleanPath.startsWith('uploads') ? cleanPath : `uploads/${cleanPath}`

  return `${baseUrl}/${normalizedPath}`
}

export const getUploadPreviewUrl = (path: string | null | undefined): string => {
  if (!path) return ''
  if (path.startsWith('blob:') || path.startsWith('data:')) return path

  const normalizedPath = path
    .replace(/\\/g, '/')
    .replace(/^public\//, '')
    .replace(/^\//, '')

  const mediaUrl = getMediaUrl(normalizedPath)
  if (mediaUrl) return mediaUrl

  const uploadsPath = normalizedPath.replace(/^uploads\//, '')
  return `/api/uploads/${uploadsPath}`
}

export const formatDate = (date: string | number | Date | null | undefined): string => {
  if (!date) return '-'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    return format(d, 'do MMM, yyyy')
  } catch (error) {
    return '-'
  }
}
