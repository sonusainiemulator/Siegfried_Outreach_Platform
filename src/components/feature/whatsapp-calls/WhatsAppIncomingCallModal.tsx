'use client'

import { useWhatsAppCall } from '@/context/WhatsAppCallContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, PhoneCall, Volume2, ShieldCheck, User } from 'lucide-react'
import React from 'react'

export const WhatsAppIncomingCallModal: React.FC = () => {
  const { incomingCall, isConnecting, acceptCall, rejectCall } = useWhatsAppCall()

  if (!incomingCall) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-7 shadow-2xl shadow-emerald-950/80 text-center relative overflow-hidden"
        >
          {/* Animated Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* WhatsApp Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            WhatsApp Voice Call
          </div>

          {/* Caller Avatar with Pulsing Waves */}
          <div className="relative mx-auto w-28 h-28 flex items-center justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-emerald-500/30"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.3 }}
              className="absolute inset-2 rounded-full bg-emerald-500/40"
            />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow">
              <PhoneCall className="w-4 h-4 text-white animate-bounce" />
            </div>
          </div>

          {/* Caller Information */}
          <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
            {incomingCall.phone || 'Unknown Contact'}
          </h3>
          <p className="text-sm text-emerald-400 font-medium mb-2">Incoming Audio Call...</p>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 mb-8">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted VoIP</span>
          </div>

          {/* Call Actions (Decline & Accept) */}
          <div className="flex items-center justify-center gap-8">
            {/* Decline Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => rejectCall(incomingCall.sessionId, incomingCall.callId)}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-900/50 transition duration-150 group cursor-pointer"
                title="Decline Call"
              >
                <PhoneOff className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              </button>
              <span className="text-xs font-semibold text-slate-400">Decline</span>
            </div>

            {/* Accept Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={isConnecting}
                onClick={() => acceptCall(incomingCall.sessionId, incomingCall.callId)}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-900/60 transition duration-150 group cursor-pointer disabled:opacity-50"
                title="Answer Call"
              >
                {isConnecting ? (
                  <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Phone className="w-7 h-7 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
              <span className="text-xs font-semibold text-emerald-400">
                {isConnecting ? 'Connecting...' : 'Accept'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
