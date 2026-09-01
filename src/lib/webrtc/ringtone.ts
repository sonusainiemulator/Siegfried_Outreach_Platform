class WhatsAppRingtone {
  private ctx: AudioContext | null = null
  private isPlaying = false
  private timer: NodeJS.Timeout | null = null

  start() {
    if (this.isPlaying) return
    this.isPlaying = true

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()

      const playBurst = () => {
        if (!this.isPlaying || !this.ctx) return

        const now = this.ctx.currentTime

        // Dual-tone WhatsApp signature frequency (440Hz + 480Hz chime)
        const osc1 = this.ctx.createOscillator()
        const osc2 = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc1.type = 'sine'
        osc2.type = 'sine'
        osc1.frequency.setValueAtTime(440, now)
        osc2.frequency.setValueAtTime(480, now)

        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05)
        gain.gain.setValueAtTime(0.3, now + 1.2)
        gain.gain.linearRampToValueAtTime(0, now + 1.5)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(this.ctx.destination)

        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 1.5)
        osc2.stop(now + 1.5)
      }

      playBurst()
      this.timer = setInterval(playBurst, 2500)
    } catch (e) {
      console.warn('Could not initialize audio ringtone:', e)
    }
  }

  stop() {
    this.isPlaying = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.ctx) {
      try {
        this.ctx.close()
      } catch {}
      this.ctx = null
    }
  }
}

export const ringtonePlayer = new WhatsAppRingtone()
