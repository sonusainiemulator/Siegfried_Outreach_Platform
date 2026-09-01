'use client'

import { useEffect, useState } from 'react'

interface IconColorResult {
    /** inline style for the icon container */
    bgStyle: React.CSSProperties
    /** inline text color style for icon / text inside the container */
    textStyle: React.CSSProperties
    /** true while color is being extracted */
    loading: boolean
}

/**
 * Extracts the dominant (average) color from an image and returns
 * a light gradient background + matching text color for the icon wrapper.
 *
 * Falls back to the provided `fallbackClass` if image loading fails or
 * no URL is provided.
 */
export function useIconDominantColor(imageUrl: string | null | undefined): IconColorResult {
    const [bgStyle, setBgStyle] = useState<React.CSSProperties>({})
    const [textStyle, setTextStyle] = useState<React.CSSProperties>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!imageUrl) {
            setBgStyle({})
            setTextStyle({})
            return
        }

        setLoading(true)
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.src = imageUrl

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas')
                const SIZE = 32
                canvas.width = SIZE
                canvas.height = SIZE
                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    setLoading(false)
                    return
                }

                ctx.drawImage(img, 0, 0, SIZE, SIZE)
                const data = ctx.getImageData(0, 0, SIZE, SIZE).data

                let r = 0, g = 0, b = 0, count = 0

                for (let i = 0; i < data.length; i += 4) {
                    const alpha = data[i + 3]
                    // skip transparent pixels
                    if (alpha < 30) continue
                    // skip nearly white pixels (background noise)
                    const pr = data[i], pg = data[i + 1], pb = data[i + 2]
                    if (pr > 230 && pg > 230 && pb > 230) continue

                    r += pr
                    g += pg
                    b += pb
                    count++
                }

                if (count === 0) {
                    // fallback if all pixels were transparent/white
                    setLoading(false)
                    return
                }

                r = Math.round(r / count)
                g = Math.round(g / count)
                b = Math.round(b / count)

                // Build a light gradient using the dominant color
                // "from" = very light tint (mix with white at 12% opacity),
                // "to"   = extremely light tint (mix with white at 5% opacity)
                const fromBg = `rgba(${r}, ${g}, ${b}, 0.14)`
                const toBg = `rgba(${r}, ${g}, ${b}, 0.06)`
                const textColor = `rgba(${Math.round(r * 0.7)}, ${Math.round(g * 0.7)}, ${Math.round(b * 0.7)}, 1)`

                setBgStyle({
                    background: `linear-gradient(135deg, ${fromBg} 0%, ${toBg} 100%)`,
                })
                setTextStyle({ color: textColor })
            } catch {
                // canvas tainted / CORS – silently fall back to default
            } finally {
                setLoading(false)
            }
        }

        img.onerror = () => setLoading(false)
    }, [imageUrl])

    return { bgStyle, textStyle, loading }
}
