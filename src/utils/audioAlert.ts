/**
 * Audio Alert Utility for Omnichannel Social Direct Messages
 * Synthesizes a crisp, premium two-tone chime using the Web Audio API.
 * Requires 0 external audio files and works instantaneously across all modern browsers.
 */

const STORAGE_KEY = 'siegfried_social_sound_alert_enabled';

export const isSoundAlertEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
};

export const setSoundAlertEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
};

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
};

/**
 * Plays a clean, professional chime when an incoming social DM arrives.
 * Tone sequence: 587.33Hz (D5) -> 880.00Hz (A5) with bell harmonic overtones.
 */
export const playDmAlertSound = (force = false): void => {
  if (!force && !isSoundAlertEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: A5 (880 Hz) - Higher harmonic ping
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.1);

    gain2.gain.setValueAtTime(0.001, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.35, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.62);
  } catch (err) {
    console.warn('[AudioAlert] Web Audio playback failed:', err);
  }
};
