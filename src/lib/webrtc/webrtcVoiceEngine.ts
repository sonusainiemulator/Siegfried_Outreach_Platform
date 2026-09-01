import {
  CAPTURE_PROCESSOR_NAME,
  CAPTURE_WORKLET_URL,
  PCM_CHANNEL_LABEL,
  PLAYBACK_PROCESSOR_NAME,
  PLAYBACK_WORKLET_URL,
  SAMPLE_RATE,
} from './audioConstants'
import { float32ToInt16LE, int16LEToFloat32 } from './pcm'

export interface ActiveVoiceConnection {
  pc: RTCPeerConnection
  dc: RTCDataChannel
  audioCtx: AudioContext
  micStream: MediaStream
  setMuted: (muted: boolean) => void
  close: () => void
}

export async function openWhatsAppVoiceCall(
  sessionId: string,
  callId: string,
  micDeviceId?: string | null,
): Promise<ActiveVoiceConnection> {
  // 1. Get user microphone stream
  const micStream = await navigator.mediaDevices.getUserMedia({
    audio: micDeviceId
      ? { deviceId: { exact: micDeviceId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    video: false,
  })

  // 2. Setup RTCPeerConnection with DataChannel for 16kHz PCM audio
  const pc = new RTCPeerConnection({
    iceServers: [],
  })

  const dc = pc.createDataChannel(PCM_CHANNEL_LABEL, { ordered: true })
  dc.binaryType = 'arraybuffer'

  // 3. Initialize AudioContext at 16000 Hz
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
  const audioCtx = new AudioCtx({ sampleRate: SAMPLE_RATE })

  await audioCtx.audioWorklet.addModule(CAPTURE_WORKLET_URL)
  await audioCtx.audioWorklet.addModule(PLAYBACK_WORKLET_URL)
  await audioCtx.resume()

  // 4. Connect microphone -> Capture Worklet -> WebRTC DataChannel (Uplink: Browser -> WhatsApp)
  const micSource = audioCtx.createMediaStreamSource(micStream)
  const captureNode = new AudioWorkletNode(audioCtx, CAPTURE_PROCESSOR_NAME)

  captureNode.port.onmessage = (e: MessageEvent<Float32Array>) => {
    if (dc.readyState === 'open') {
      dc.send(float32ToInt16LE(e.data))
    }
  }

  micSource.connect(captureNode)
  captureNode.connect(audioCtx.destination)

  // 5. Connect WebRTC DataChannel -> Playback Worklet -> Speakers (Downlink: WhatsApp -> Browser)
  const playbackNode = new AudioWorkletNode(audioCtx, PLAYBACK_PROCESSOR_NAME)
  const streamDest = audioCtx.createMediaStreamDestination()
  playbackNode.connect(streamDest)
  playbackNode.connect(audioCtx.destination)

  dc.onmessage = (e: MessageEvent<ArrayBuffer>) => {
    if (e.data instanceof ArrayBuffer) {
      playbackNode.port.postMessage(int16LEToFloat32(e.data))
    }
  }

  // 6. Generate SDP offer and complete ICE gathering
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  await new Promise<void>((resolve) => {
    if (pc.iceGatheringState === 'complete') {
      resolve()
    } else {
      const checkState = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', checkState)
          resolve()
        }
      }
      pc.addEventListener('icegatheringstatechange', checkState)
      setTimeout(resolve, 1500) // fallback timeout
    }
  })

  // 7. Exchange SDP with WaCalls WebRTC bridge
  const res = await fetch(`/api/whatsapp-calls/sessions/${sessionId}/calls/${callId}/webrtc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sdp_offer: pc.localDescription?.sdp }),
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || `WebRTC SDP negotiation failed with status ${res.status}`)
  }

  const { sdp_answer } = await res.json()
  await pc.setRemoteDescription({ type: 'answer', sdp: sdp_answer })

  let isMuted = false

  return {
    pc,
    dc,
    audioCtx,
    micStream,
    setMuted: (muted: boolean) => {
      isMuted = muted
      micStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted
      })
    },
    close: () => {
      try {
        micStream.getTracks().forEach((track) => track.stop())
      } catch {}
      try {
        if (audioCtx.state !== 'closed') audioCtx.close()
      } catch {}
      try {
        if (dc.readyState !== 'closed') dc.close()
      } catch {}
      try {
        pc.close()
      } catch {}
    },
  }
}
