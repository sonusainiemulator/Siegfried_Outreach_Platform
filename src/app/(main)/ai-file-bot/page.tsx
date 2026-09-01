'use client'

import FileChat from '@/components/feature/smart-file-chat/FileChat'

const FileChatPage = () => {
  return (
    <div className="h-full flex flex-col min-h-0 gap-4">
      <div className="flex-1 min-h-0 mt-2">
        <FileChat />
      </div>
    </div>
  )
}

export default FileChatPage
