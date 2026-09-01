'use client'

import { Toaster } from '@/components/ui/sonner'
import DynamicMetadata from '@/layout/DynamicMetadata'
import InternetConnectionWrapper from '@/layout/InternetConnectionWrapper'
import MaintenanceWrapper from '@/layout/MaintenanceWrapper'
import SocketProvider from '@/layout/SocketProvider'
import i18n from '@/lib/i18n'
import { ProviderProps } from '@/types/app'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { initializeAuth } from '../redux/slices/authSlice'
import { initializeLayout } from '../redux/slices/layoutSlice'
import { store } from '../redux/store'

import { WhatsAppCallProvider } from '@/context/WhatsAppCallContext'
import { WhatsAppVoiceCallHub } from '@/components/feature/whatsapp-calls/WhatsAppVoiceCallHub'

const Providers = ({ children }: ProviderProps) => {
  useEffect(() => {
    store.dispatch(initializeAuth())
    store.dispatch(initializeLayout())
  }, [])

  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SocketProvider>
            <WhatsAppCallProvider>
              <DynamicMetadata />
              <InternetConnectionWrapper>
                <MaintenanceWrapper>
                  {children}
                  <WhatsAppVoiceCallHub />
                </MaintenanceWrapper>
              </InternetConnectionWrapper>
            </WhatsAppCallProvider>
          </SocketProvider>
          <Toaster richColors position="top-right" />
          <NextTopLoader showSpinner={false} />
        </ThemeProvider>
      </I18nextProvider>
    </ReduxProvider>
  )
}

export default Providers
