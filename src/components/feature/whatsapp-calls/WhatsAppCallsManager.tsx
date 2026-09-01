'use client'

import { useWhatsAppCall, WhatsAppCallSession } from '@/context/WhatsAppCallContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  QrCode,
  Plus,
  Trash2,
  LogOut,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  PhoneCall,
} from 'lucide-react'
import React, { useState } from 'react'

export const WhatsAppCallsManager: React.FC = () => {
  const {
    isManagerOpen,
    setIsManagerOpen,
    sessions,
    createSession,
    pairSession,
    deleteSession,
    logoutSession,
    fetchSessions,
    setIsDialerOpen,
  } = useWhatsAppCall()

  const [newSessionName, setNewSessionName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [selectedSessionForQr, setSelectedSessionForQr] = useState<WhatsAppCallSession | null>(null)

  if (!isManagerOpen) return null

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSessionName.trim()) return
    setIsCreating(true)
    const newId = await createSession(newSessionName)
    setIsCreating(false)
    setNewSessionName('')
    if (newId) {
      await pairSession(newId)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">WhatsApp Voice Lines & Call Hub</h3>
                <p className="text-xs text-slate-400">
                  Pair your WhatsApp numbers to receive & place native WebRTC voice calls
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchSessions()}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsManagerOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action: Open Dialer */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Make Outgoing WhatsApp Call</h4>
                <p className="text-xs text-emerald-400/80">Call any customer directly from your browser mic</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsManagerOpen(false)
                setIsDialerOpen(true)
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Open Keypad
            </button>
          </div>

          {/* Connected Lines List */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Active WhatsApp Accounts ({sessions.length})
            </h4>

            {sessions.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-400">
                <QrCode className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-medium">No WhatsApp lines connected yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Create a new line below and scan the QR code to enable incoming & outgoing calls.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{s.name}</h5>
                          {s.status === 'connected' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <AlertCircle className="w-3 h-3" /> Scan QR Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {s.phone || 'Waiting for pairing...'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {s.status !== 'connected' && (
                        <button
                          type="button"
                          onClick={() => {
                            pairSession(s.id)
                            setSelectedSessionForQr(s)
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR</span>
                        </button>
                      )}

                      {s.status === 'connected' && (
                        <button
                          type="button"
                          onClick={() => logoutSession(s.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition"
                          title="Log Out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteSession(s.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QR Code Viewer Modal */}
          {selectedSessionForQr && selectedSessionForQr.qr && (
            <div className="mb-6 p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center">
              <h5 className="text-sm font-bold text-white mb-1">Scan with WhatsApp Mobile App</h5>
              <p className="text-xs text-slate-400 mb-4">
                Open WhatsApp on phone &gt; Settings &gt; Linked Devices &gt; Link a Device
              </p>
              <div className="inline-block p-3 bg-white rounded-2xl shadow-xl">
                <img
                  src={selectedSessionForQr.qr}
                  alt="WhatsApp Pairing QR"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedSessionForQr(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Done Scanning
                </button>
              </div>
            </div>
          )}

          {/* Add New Line Form */}
          <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Connect Another WhatsApp Line
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Line Name (e.g., Real Estate Inquiries, Support Desk)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isCreating || !newSessionName.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreating ? 'Creating...' : 'Add Line'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
