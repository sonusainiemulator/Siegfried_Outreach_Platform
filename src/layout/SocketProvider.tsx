'use client'

import { SOCKET } from '@/constants/socket'
import { useSocketHandlers } from '@/hooks/useSocketHandlers'
import { useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import { SocketProviderProps } from '@/types'
import { useEffect, useRef } from 'react'

const SocketProvider = ({ children }: SocketProviderProps) => {
  const { user, token } = useAppSelector((store) => store.auth)
  const prevUserRef = useRef<typeof user>(null)
  useSocketHandlers()

  useEffect(() => {
    if (user && token) {
      // Only connect if not already connected
      if (!socket.connected) {
        socket.connect()
      }

      const handleConnect = () => {
        socket.emit(SOCKET.Emitters.Join_Room, user.id)
      }

      const handleConnectError = (error: Error) => {
        console.error('Socket connection failed:', error)
      }

      socket.on('connect', handleConnect)
      socket.on('connect_error', handleConnectError)

      // If socket is already connected, emit join-room immediately
      if (socket.connected) {
        socket.emit(SOCKET.Emitters.Join_Room, user.id)
      }

      prevUserRef.current = user

      return () => {
        socket.off('connect', handleConnect)
        socket.off('connect_error', handleConnectError)
      }
    } else {
      if (prevUserRef.current && socket.connected) {
        socket.disconnect()
      }
      prevUserRef.current = null
    }
  }, [user, token])

  return <>{children}</>
}

export default SocketProvider
