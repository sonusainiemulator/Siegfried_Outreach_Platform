'use client'

import StatusPage from '@/components/reusable/StatusPage'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <StatusPage
      title="Page Not Found"
      description="The page you are looking for does not exist."
      errorCode="404"
      icon={FileQuestion}
      showHome={true}
    />
  )
}

