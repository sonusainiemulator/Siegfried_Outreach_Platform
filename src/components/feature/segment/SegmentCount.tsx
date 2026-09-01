'use client'

import { useGetContactsQuery } from '@/redux/api/contactApi'
import { SegmentCountProps } from '@/types/components/campaigns'
import { calculateSegmentSize } from '@/utils/segmentFilter'
import { useMemo } from 'react'

export function SegmentCount({ conditions }: SegmentCountProps) {
  const { data, isLoading } = useGetContactsQuery({ limit: 1000 })

  const count = useMemo(() => {
    if (!data?.contacts) return 0
    return calculateSegmentSize(data.contacts, conditions)
  }, [data?.contacts, conditions])

  if (isLoading) {
    return <span className="animate-pulse">...</span>
  }

  return <span>{count}</span>
}
