'use client'

import { cn } from '@/lib/utils'
import { FlagProps } from '@/types'
import Image from 'next/image'
import React from 'react'

export const Flag: React.FC<FlagProps> = ({ countryCode, className, size = 20 }) => {
  if (!countryCode) return null

  const code = countryCode.toLowerCase()

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Image
      src={`https://flagcdn.com/w80/${code}.png`}
      width={size}
      height={size}
      alt={`${countryCode} flag`}
      className={cn('inline-block align-middle rounded-sm object-cover overflow-hidden', className)}
      style={{
        aspectRatio: '4/3',
        minWidth: size,
        minHeight: Math.round(size * 0.75),
      }}
      loading="lazy"
      onError={(e) => {
        ;(e.target as HTMLImageElement).src = `https://flagcdn.com/w80/un.png`
      }}
    />
  )
}
