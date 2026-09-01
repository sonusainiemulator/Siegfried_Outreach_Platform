'use client'

import { toast } from 'sonner'
import { ringtonePlayer } from '@/lib/webrtc/ringtone'
import { ActiveVoiceConnection, openWhatsAppVoiceCall } from '@/lib/webrtc/webrtcVoiceEngine'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export interface WhatsAppCallSession {
  id: string
  name: string
  phone?: string
  status: 'connected' | 'connecting' | 'scan_qr' | 'logged_out' | 'disconnected'
  qr?: string
  activeCalls?: number
}

export interface ActiveCallInfo {
  callId: string
  sessionId: string
  peer: string
  phone: string
  direction: 'inbound' | 'outbound'
  startedAt: number
}

export interface IncomingCallInfo {
  callId: string
  sessionId: string
  peer: string
  phone: string
  timestamp: number
}

interface WhatsAppCallContextType {
  sessions: WhatsAppCallSession[]
  activeSession: WhatsAppCallSession | null
  incomingCall: IncomingCallInfo | null
  activeCall: ActiveCallInfo | null
  callDuration: number
  isMuted: boolean
  isConnecting: boolean
  isDialerOpen: boolean
  isManagerOpen: boolean
  setIsDialerOpen: (open: boolean) => void
  setIsManagerOpen: (open: boolean) => void
  fetchSessions: () => Promise<void>
  createSession: (name?: string) => Promise<string | null>
  pairSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
  logoutSession: (sessionId: string) => Promise<void>
  acceptCall: (sessionId: string, callId: string) => Promise<void>
  rejectCall: (sessionId: string, callId: string) => Promise<void>
  endCall: () => Promise<void>
  startOutgoingCall: (phone: string, sessionId?: string) => Promise<void>
  toggleMute: () => void
}

const WhatsAppCallContext = createContext<WhatsAppCallContextType | undefined>(undefined)

export function WhatsAppCallProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<WhatsAppCallSession[]>([])
  const [activeSession, setActiveSession] = useState<WhatsAppCallSession | null>(null)
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null)
  const [activeCall, setActiveCall] = useState<ActiveCallInfo | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDialerOpen, setIsDialerOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)

  const voiceConnRef = useRef<ActiveVoiceConnection | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sseRef = useRef<EventSource | null>(null)

  // Fetch WhatsApp voice calling sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/whatsapp-calls/sessions')
      if (res.ok) {
        const data = await res.json()
        const list = data.sessions || []
        setSessions(list)
        if (list.length > 0 && !activeSession) {
          const connected = list.find((s: WhatsAppCallSession) => s.status === 'connected') || list[0]
          setActiveSession(connected)
        }
      }
    } catch (e) {
      console.warn('Failed to fetch WhatsApp call sessions:', e)
    }
  }

  // Connect to SSE event stream for real-time incoming call detection
  useEffect(() => {
    fetchSessions()

    const clientId = `dashboard-${Math.random().toString(36).substring(2, 9)}`
    const sseUrl = `/api/whatsapp-calls/events?clientId=${clientId}`

    try {
      const sse = new EventSource(sseUrl)
      sseRef.current = sse

      sse.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data)
          handleCallEvent(payload.event || payload.type, payload.data || payload)
        } catch {}
      }

      sse.addEventListener('call_incoming', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          handleIncomingCall(data)
        } catch {}
      })

      sse.addEventListener('call_offer', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          handleIncomingCall(data)
        } catch {}
      })

      sse.addEventListener('call_ended', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          handleCallEnded(data.callId || data.id)
        } catch {}
      })

      sse.addEventListener('auth_state', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          fetchSessions()
        } catch {}
      })

      sse.onerror = () => {
        // SSE auto-reconnects
      }

      return () => {
        sse.close()
        sseRef.current = null
      }
    } catch (e) {
      console.warn('Failed to establish SSE stream for WhatsApp calls:', e)
    }
  }, [])

  const handleCallEvent = (eventType: string, data: any) => {
    if (eventType === 'call_incoming' || eventType === 'call_offer' || eventType === 'incoming') {
      handleIncomingCall(data)
    } else if (eventType === 'call_ended' || eventType === 'terminated') {
      handleCallEnded(data.callId || data.id)
    }
  }

  const handleIncomingCall = (data: any) => {
    const rawPhone = data.peer || data.phone || data.from || 'Unknown Caller'
    const phone = rawPhone.replace('@s.whatsapp.net', '').replace(/[^0-9+]/g, '')

    const incoming: IncomingCallInfo = {
      callId: data.callId || data.id,
      sessionId: data.sessionId || data.sid || (activeSession?.id || 'default'),
      peer: data.peer || data.from || phone,
      phone: phone.startsWith('+') ? phone : `+${phone}`,
      timestamp: Date.now(),
    }

    setIncomingCall(incoming)
    ringtonePlayer.start()
    toast.info(`Incoming WhatsApp Call from ${incoming.phone}`, {
      duration: 10000,
    })
  }

  const handleCallEnded = (callId: string) => {
    ringtonePlayer.stop()
    if (incomingCall && incomingCall.callId === callId) {
      setIncomingCall(null)
    }
    if (activeCall && activeCall.callId === callId) {
      if (voiceConnRef.current) {
        voiceConnRef.current.close()
        voiceConnRef.current = null
      }
      setActiveCall(null)
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
      setCallDuration(0)
      toast.success('WhatsApp call ended')
    }
  }

  // Accept incoming call
  const acceptCall = async (sessionId: string, callId: string) => {
    ringtonePlayer.stop()
    setIsConnecting(true)

    try {
      // 1. Tell backend / WaCalls to accept call
      const res = await fetch(`/api/whatsapp-calls/sessions/${sessionId}/calls/${callId}/accept`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(`Failed to accept call (Status: ${res.status})`)
      }

      // 2. Open bidirectional WebRTC voice bridge
      const conn = await openWhatsAppVoiceCall(sessionId, callId)
      voiceConnRef.current = conn

      const current = incomingCall
      setIncomingCall(null)

      const active: ActiveCallInfo = {
        callId,
        sessionId,
        peer: current?.peer || 'WhatsApp Contact',
        phone: current?.phone || 'WhatsApp Call',
        direction: 'inbound',
        startedAt: Date.now(),
      }

      setActiveCall(active)
      setCallDuration(0)

      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      toast.success('WhatsApp call connected!')
    } catch (e: any) {
      toast.error(e.message || 'Error connecting WhatsApp call')
      setIncomingCall(null)
    } finally {
      setIsConnecting(false)
    }
  }

  // Reject / Decline incoming call
  const rejectCall = async (sessionId: string, callId: string) => {
    ringtonePlayer.stop()
    setIncomingCall(null)
    try {
      await fetch(`/api/whatsapp-calls/sessions/${sessionId}/calls/${callId}/reject`, {
        method: 'POST',
      })
    } catch (e) {
      console.warn('Error rejecting call:', e)
    }
  }

  // Hang up / End active call
  const endCall = async () => {
    ringtonePlayer.stop()

    if (voiceConnRef.current) {
      voiceConnRef.current.close()
      voiceConnRef.current = null
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    if (activeCall) {
      const { sessionId, callId } = activeCall
      setActiveCall(null)
      setCallDuration(0)
      try {
        await fetch(`/api/whatsapp-calls/sessions/${sessionId}/calls/${callId}`, {
          method: 'DELETE',
        })
      } catch (e) {
        console.warn('Error ending call:', e)
      }
    }

    if (incomingCall) {
      const { sessionId, callId } = incomingCall
      setIncomingCall(null)
      try {
        await fetch(`/api/whatsapp-calls/sessions/${sessionId}/calls/${callId}/reject`, {
          method: 'POST',
        })
      } catch {}
    }
  }

  // Start outgoing call
  const startOutgoingCall = async (phone: string, customSessionId?: string) => {
    const sid = customSessionId || activeSession?.id || (sessions[0]?.id)
    if (!sid) {
      toast.error('Please link or select a WhatsApp session first in Call Manager')
      setIsManagerOpen(true)
      return
    }

    setIsConnecting(true)
    const cleanPhone = phone.replace(/[^0-9]/g, '')

    try {
      const res = await fetch(`/api/whatsapp-calls/sessions/${sid}/calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to initiate outgoing call')
      }

      const { call } = await res.json()
      const callId = call.callId

      // Open WebRTC bridge
      const conn = await openWhatsAppVoiceCall(sid, callId)
      voiceConnRef.current = conn

      setIsDialerOpen(false)

      const active: ActiveCallInfo = {
        callId,
        sessionId: sid,
        peer: cleanPhone,
        phone: `+${cleanPhone}`,
        direction: 'outbound',
        startedAt: Date.now(),
      }

      setActiveCall(active)
      setCallDuration(0)

      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      toast.success(`Calling +${cleanPhone}...`)
    } catch (e: any) {
      toast.error(e.message || 'Could not place outgoing WhatsApp call')
    } finally {
      setIsConnecting(false)
    }
  }

  // Toggle Microphone Mute
  const toggleMute = () => {
    if (voiceConnRef.current) {
      const newMute = !isMuted
      voiceConnRef.current.setMuted(newMute)
      setIsMuted(newMute)
      toast.info(newMute ? 'Microphone muted' : 'Microphone unmuted')
    }
  }

  // Create new session
  const createSession = async (name: string = 'WhatsApp Voice Line') => {
    try {
      const res = await fetch('/api/whatsapp-calls/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        const data = await res.json()
        await fetchSessions()
        return data.id
      }
    } catch (e) {
      toast.error('Failed to create session')
    }
    return null
  }

  // Pair QR code
  const pairSession = async (sessionId: string) => {
    try {
      await fetch(`/api/whatsapp-calls/sessions/${sessionId}/pair`, {
        method: 'POST',
      })
      await fetchSessions()
    } catch (e) {
      toast.error('Failed to initiate pairing')
    }
  }

  // Delete session
  const deleteSession = async (sessionId: string) => {
    try {
      await fetch(`/api/whatsapp-calls/sessions/${sessionId}`, {
        method: 'DELETE',
      })
      await fetchSessions()
      toast.success('Session deleted')
    } catch (e) {
      toast.error('Failed to delete session')
    }
  }

  // Logout session
  const logoutSession = async (sessionId: string) => {
    try {
      await fetch(`/api/whatsapp-calls/sessions/${sessionId}/logout`, {
        method: 'POST',
      })
      await fetchSessions()
      toast.success('Session logged out')
    } catch (e) {
      toast.error('Failed to logout session')
    }
  }

  return (
    <WhatsAppCallContext.Provider
      value={{
        sessions,
        activeSession,
        incomingCall,
        activeCall,
        callDuration,
        isMuted,
        isConnecting,
        isDialerOpen,
        isManagerOpen,
        setIsDialerOpen,
        setIsManagerOpen,
        fetchSessions,
        createSession,
        pairSession,
        deleteSession,
        logoutSession,
        acceptCall,
        rejectCall,
        endCall,
        startOutgoingCall,
        toggleMute,
      }}
    >
      {children}
    </WhatsAppCallContext.Provider>
  )
}

export function useWhatsAppCall() {
  const context = useContext(WhatsAppCallContext)
  if (!context) {
    throw new Error('useWhatsAppCall must be used within a WhatsAppCallProvider')
  }
  return context
}
