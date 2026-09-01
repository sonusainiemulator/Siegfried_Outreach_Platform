'use client'

import { useWhatsAppCall } from '@/context/WhatsAppCallContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Delete, X, Shield, Smartphone } from 'lucide-react'
import React, { useState } from 'react'

export const WhatsAppDialerModal: React.FC = () => {
  const { isDialerOpen, setIsDialerOpen, startOutgoingCall, isConnecting, sessions, activeSession } =
    useWhatsAppCall()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedSid, setSelectedSid] = useState<string>('')

  if (!isDialerOpen) return null

  const handleKeypadPress = (digit: string) => {
    setPhoneNumber((prev) => prev + digit)
  }

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (!phoneNumber.trim()) return
    startOutgoingCall(phoneNumber, selectedSid || activeSession?.id)
  }

  const keypadKeys = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '+', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">WhatsApp Dialer</h3>
                <p className="text-xs text-slate-400">WebRTC Direct Calling</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDialerOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Selector */}
          {sessions.length > 0 && (
            <div className="mb-3">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Calling Line
              </label>
              <select
                value={selectedSid || activeSession?.id || ''}
                onChange={(e) => setSelectedSid(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.phone || (s.status === 'connected' ? 'Connected' : 'Unpaired')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Phone Display Input */}
          <div className="relative mb-5">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-xl font-mono text-center text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 tracking-wider font-bold"
            />
            {phoneNumber && (
              <button
                type="button"
                onClick={handleDelete}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
              >
                <Delete className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {keypadKeys.map((k) => (
              <button
                key={k.num}
                type="button"
                onClick={() => handleKeypadPress(k.num)}
                className="flex flex-col items-center justify-center h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-95 transition cursor-pointer"
              >
                <span className="text-lg font-bold text-white leading-none">{k.num}</span>
                {k.sub && <span className="text-[9px] font-medium text-slate-400 uppercase mt-0.5">{k.sub}</span>}
              </button>
            ))}
          </div>

          {/* Call Trigger Button */}
          <button
            type="button"
            disabled={!phoneNumber.trim() || isConnecting}
            onClick={handleCall}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isConnecting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Phone className="w-5 h-5 fill-current" />
                <span>Call on WhatsApp</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
