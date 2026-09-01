'use client'

import { ChatPanelProps } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChatHeader, ChatInput, MessageList } from './components'

const ChatPanel = ({
  conversation,
  messages,
  isHistoryLoading,
  isViewingHistory,
  replyText,
  isReplying,
  canReply,
  canManageAgents,
  agents,
  role,
  userId,
  scrollRef,
  attachedFiles,
  isCampaign,
  onReplyChange,
  onSendReply,
  onResolve,
  onAssignAgent,
  onBackToActive,
  onAttachedFilesChange,
  onToggleDetails,
  onToggleList,
  highlightMessageId,
  onImageClick,
}: ChatPanelProps) => {

  const [showScrollButton, setShowScrollButton] = useState(false)
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [prevHighlightMessageId, setPrevHighlightMessageId] = useState<string | null>(null)
  
  if (highlightMessageId !== prevHighlightMessageId && highlightMessageId && messages.length > 0) {
    setPrevHighlightMessageId(highlightMessageId)
    setActiveHighlightId(highlightMessageId)
  }

  // Scroll to and highlight specific message
  useEffect(() => {
    if (highlightMessageId && messages.length > 0) {
      const element = messageRefs.current.get(highlightMessageId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const timer = setTimeout(() => {
        setActiveHighlightId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightMessageId, messages.length])

  // Auto-scroll logic strictly on send
  const scrollToBottom = useCallback(() => {
    if (scrollRef && 'current' in scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50
    setShowScrollButton(!isAtBottom)
  }

  useEffect(() => {
    // eslint-disable-next-line
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (!showScrollButton) {
      // eslint-disable-next-line
      scrollToBottom()
    }
  }, [messages.length, showScrollButton, scrollToBottom])

  // Drag & drop logic
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDraggingOver(false)
      const dropped = Array.from(e.dataTransfer.files)
      if (dropped.length > 0) {
        onAttachedFilesChange([...attachedFiles, ...dropped])
      }
    },
    [attachedFiles, onAttachedFilesChange],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <ChatHeader
        conversation={conversation}
        canManageAgents={canManageAgents}
        agents={agents}
        role={role}
        userId={userId}
        isCampaign={isCampaign}
        canReply={canReply}
        onToggleList={onToggleList}
        onToggleDetails={onToggleDetails}
        onAssignAgent={onAssignAgent}
        onResolve={onResolve}
      />

      <MessageList
        scrollRef={scrollRef}
        onScroll={handleScroll}
        isViewingHistory={isViewingHistory}
        onBackToActive={onBackToActive}
        isHistoryLoading={isHistoryLoading}
        messages={messages}
        conversation={conversation}
        activeHighlightId={activeHighlightId}
        showScrollButton={showScrollButton}
        scrollToBottom={scrollToBottom}
        onImageClick={onImageClick}
        messageRefs={messageRefs}
      />


      <ChatInput
        conversation={conversation}
        replyText={replyText}
        isReplying={isReplying}
        canReply={canReply}
        attachedFiles={attachedFiles}
        onReplyChange={onReplyChange}
        onSendReply={onSendReply}
        onAttachedFilesChange={onAttachedFilesChange}
        scrollToBottom={scrollToBottom}
        isDraggingOver={isDraggingOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        dropZoneRef={dropZoneRef}
      />
    </div>
  )
}

export default ChatPanel
