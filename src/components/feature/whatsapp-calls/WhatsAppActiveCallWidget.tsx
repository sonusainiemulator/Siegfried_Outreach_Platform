'use client'

import { useWhatsAppCall } from '@/context/WhatsAppCallContext'
import { motion } from 'framer-motion'
import { Mic, MicOff, PhoneOff, Volume2, Radio, User } from 'lucide-react'
import React from 'react'

export const WhatsAppActiveCallWidget: React.FC = () => {
  const { activeCall, callDuration, isMuted, toggleMute, endCall } = useWhatsAppCall()

  if (!activeCall) return null

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remaining = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-99999 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-950/80 text-white"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            WhatsApp Call Active
          </span>
        </div>
        <div className="font-mono text-sm font-bold text-white bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
          {formatDuration(callDuration)}
        </div>
      </div>

      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-white truncate">{activeCall.phone}</h4>
          <p className="text-xs text-slate-400">
            {activeCall.direction === 'inbound' ? 'Incoming WhatsApp Line' : 'Outgoing Call'}
          </p>
        </div>

        {/* Dynamic Voice Waveform Animation */}
        <div className="flex items-center gap-0.5 h-6 px-2">
          {[40, 90, 60, 100, 75, 45, 85].map((height, i) => (
            <motion.span
              key={i}
              animate={{ height: isMuted ? '4px' : [`${height * 0.2}%`, `${height}%`, `${height * 0.3}%`] }}
              transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
              className={`w-1 rounded-full ${isMuted ? 'bg-slate-600' : 'bg-emerald-400'}`}
              style={{ minHeight: '4px', maxHeight: '24px' }}
            />
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={toggleMute}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition cursor-pointer ${
            isMuted
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
        </button>

        <button
          type="button"
          onClick={endCall}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 active:scale-95 text-white shadow-md shadow-red-950/50 transition cursor-pointer"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>
      </div>
    </motion.div>
  )
}
