export function float32ToInt16LE(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2)
  const view = new DataView(buffer)
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]))
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return buffer
}

export function int16LEToFloat32(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer)
  const len = Math.floor(buffer.byteLength / 2)
  const float32Array = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const int16 = view.getInt16(i * 2, true)
    float32Array[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff
  }
  return float32Array
}
