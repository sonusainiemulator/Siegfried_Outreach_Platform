'use client'

import { UseInternetConnectionReturn } from '@/types'
import { isBrowser, isNavigator } from '@/utils/environment'
import { useCallback, useEffect, useState } from 'react'

const useInternetConnection = (): UseInternetConnectionReturn => {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const checkConnection = useCallback(async () => {
    if (isNavigator && !navigator.onLine) {
      setIsOnline(false)
      setIsChecking(false)
      return
    }

    setIsChecking(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      const response = await fetch(`/favicon.ico?_=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      setIsOnline(response.ok || response.status < 500)
    } catch {
      // Fallback: trust navigator.onLine if fetch fails due to privacy tools/adblockers
      if (isNavigator && navigator.onLine) {
        setIsOnline(true)
      } else {
        setIsOnline(false)
      }
    } finally {
      setIsChecking(false)
    }
  }, [])

  const retry = useCallback(() => {
    checkConnection()
  }, [checkConnection])

  useEffect(() => {
    if (isNavigator) {
      setIsOnline(navigator.onLine)
    }

    const handleOnline = () => {
      setIsOnline(true)
      checkConnection()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setIsChecking(false)
    }

    if (isBrowser) {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [checkConnection])

  return {
    isOnline,
    isChecking,
    retry,
  }
}

export default useInternetConnection
