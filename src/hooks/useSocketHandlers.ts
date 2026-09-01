'use client'

import { ROUTES } from '@/constants/routes'
import { SOCKET } from '@/constants/socket'
import { useNotifications } from '@/hooks/useNotifications'
import useSettings from '@/hooks/useSettings'
import { adminSettingApi } from '@/redux/api/adminSettingApi'
import { agentApi } from '@/redux/api/agentApi'
import { campaignInboxApi } from '@/redux/api/campaignInboxApi'
import { chatApi } from '@/redux/api/chatApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import { getMediaUrl } from '@/utils'
import { isBrowser, isDocument } from '@/utils/environment'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useSocketHandlers = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const router = useRouter()
  const { settings } = useSettings()
  const { user } = useAppSelector((state) => state.auth)
  const { sendNotification, startBlinking, stopBlinking, requestPermission } = useNotifications()
  const unreadMessagesRef = useRef<string[]>([])

  const notificationIcon = settings?.favicon_notification_logo_url
    ? getMediaUrl(settings.favicon_notification_logo_url)
    : settings?.favicon_url
      ? getMediaUrl(settings.favicon_url)
      : '/favicon.ico';

  useEffect(() => {
    // Request notification permission on mount if user is logged in
    if (user && isBrowser) {
      requestPermission();
    }
  }, [user, requestPermission])

  useEffect(() => {
    if (!user) return

    const handleReceiveMessage = (data: any) => {
      const { conversationId, message, chatbotId, sessionId } = data

      if (conversationId && message) {
        // Update History cache for Human Agent
        dispatch(
          agentApi.util.updateQueryData('getAgentConversationHistory', conversationId, (draft) => {
            if (draft?.conversation) {
              if (!draft.conversation.messages) {
                draft.conversation.messages = []
              }
              // Check if message already exists to avoid duplicates
              const exists = draft.conversation.messages.some((m: any) => {
                const idMatch = (m.id && message.id && m.id === message.id) || (m._id && message._id && m._id === message._id)
                if (idMatch) return true

                const contentMatch = m.content === message.content
                const roleMatch = m.role === message.role
                const timeDiff = Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime())
                const timeMatch = timeDiff < 5000

                return contentMatch && roleMatch && timeMatch
              })

              if (!exists) {
                draft.conversation.messages.push(message)
              }
              if (message.role === 'user') {
                draft.conversation.isUserOnline = true
              }
            }
          })
        )

        // Update Transferred Conversations list cache
        let isNewTransfer = false
        dispatch(
          agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
            if (draft?.conversations) {
              const convIndex = draft.conversations.findIndex((c: any) => c.id === conversationId)
              if (convIndex !== -1) {
                const conv = draft.conversations[convIndex]
                conv.lastMessage = {
                  content: message.content,
                  timestamp: message.timestamp,
                  role: message.role
                }
                conv.lastActivity = message.timestamp

                // If message is from user, they must be online
                if (message.role === 'user') {
                  conv.isUserOnline = true
                }

                // Move to top
                draft.conversations.splice(convIndex, 1)
                draft.conversations.unshift(conv)
              } else {
                isNewTransfer = true
              }
            }
          })
        )

        if (isNewTransfer) {
          dispatch(agentApi.util.invalidateTags(['AgentChat']))
        }

        // For general AI Chat (if applicable)
        dispatch(
          chatApi.util.updateQueryData('getConversationHistory', { id: chatbotId, sessionId }, (draft) => {
            if (draft?.conversation) {
              if (!draft.conversation.messages) {
                draft.conversation.messages = []
              }
              const exists = draft.conversation.messages.some((m: any) => {
                const idMatch = (m.id && message.id && m.id === message.id) || (m._id && message._id && m._id === message._id)
                if (idMatch) return true

                const contentMatch = (m.content === message.content) || (m.text === message.content)
                const roleMatch = (m.role === message.role) || (m.role === (message.role === 'assistant' ? 'bot' : message.role))
                const timeDiff = Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime())
                return contentMatch && roleMatch && timeDiff < 5000
              })

              if (!exists) {
                // AI Chat detail page uses 'text' property
                const mappedMessage = {
                  ...message,
                  text: message.content,
                  role: message.role === 'assistant' ? 'bot' : message.role
                }
                draft.conversation.messages.push(mappedMessage)
              }
            }
          })
        )

        dispatch(
          chatApi.util.updateQueryData('getUserConversations', chatbotId, (draft) => {
            if (draft?.conversations) {
              const convIndex = draft.conversations.findIndex((c: any) => c.sessionId === sessionId || c.id === conversationId)
              if (convIndex !== -1) {
                const conv = draft.conversations[convIndex]
                conv.messageCount = (conv.messageCount || 0) + 1
                conv.lastActivity = message.timestamp

                draft.conversations.splice(convIndex, 1)
                draft.conversations.unshift(conv)
              }
            }
          })
        )

        // Update Campaign Inbox cache
        dispatch(
          campaignInboxApi.util.updateQueryData('getCampaignConversationHistory', conversationId, (draft) => {
            if (draft?.conversation) {
              if (!draft.conversation.messages) {
                draft.conversation.messages = []
              }
              const exists = draft.conversation.messages.some((m: any) =>
                (m.id && message.id && m.id === message.id) || (m._id && message._id && m._id === message._id)
              )
              if (!exists) {
                draft.conversation.messages.push(message)
              }
            }
          })
        )

        dispatch(
          campaignInboxApi.util.updateQueryData('getCampaignConversations', { search: '' }, (draft) => {
            if (draft?.conversations) {
              const convIndex = draft.conversations.findIndex((c: any) => c.id === conversationId)
              if (convIndex !== -1) {
                const conv = draft.conversations[convIndex]
                conv.lastMessage = {
                  content: message.content,
                  timestamp: message.timestamp,
                  role: message.role
                }
                conv.lastActivity = message.timestamp

                draft.conversations.splice(convIndex, 1)
                draft.conversations.unshift(conv)
              }
            }
          })
        )

        // Show notification if tab is not focused
        const senderName = data.senderId || message.senderId || 'User'
        const isCampaign = data.isCampaign || data.type === 'campaign';
        const targetPath = isCampaign ? '/campaign-hub/messages' : ROUTES.CHAT_ASSISTANT.LIVE_AGENT;

        if (message.role !== 'assistant') {
          // Always show toast if it's from a user
          toast.info(t('new_message_from', { name: senderName }), {
            description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
            duration: 5000,
            action: {
              label: t('view'),
              onClick: () =>
                router.push(`${targetPath}?conversationId=${conversationId}&messageId=${message.id || message._id}`),
            },
            actionButtonStyle: {
              backgroundColor: 'var(--blue-highlight)',
              color: 'var(--white'
            },
            classNames: {
              actionButton: 'group-[.toast]:!bg-var(--blue-highlight) group-[.toast]:!text-white',
            }
          })

          if (isDocument && !document.hasFocus()) {
            const notificationTitle = `New message from ${senderName}`;
            unreadMessagesRef.current.push(`${senderName}: ${message.content}`);

            sendNotification(notificationTitle, {
              body: message.content,
              icon: notificationIcon,
              onClick: () => {
                window.focus();
                router.push(`${targetPath}?conversationId=${conversationId}&messageId=${message.id || message._id}`);
              }
            });

            startBlinking(unreadMessagesRef.current);
          } else {

            unreadMessagesRef.current = [];
            stopBlinking();
          }
        }
      }
    }

    const handleUserStatusUpdate = (data: any) => {
      const { conversationId, userId, isOnline, status } = data
      const finalIsOnline = isOnline !== undefined ? isOnline : status === 'online'

      // Update the user's online status in the transferred conversations cache
      dispatch(
        agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
          if (draft?.conversations) {
            draft.conversations.forEach((conv: any) => {
              if (
                (conversationId && (conv.id === conversationId || conv._id === conversationId)) ||
                (userId && (conv.userId === userId || conv.user === userId)) ||
                (data.user && (conv.userId === data.user || conv.user === data.user)) ||
                (data.customerId && (conv.userId === data.customerId || conv.user === data.customerId))
              ) {
                conv.isUserOnline = finalIsOnline
              }
            })
          }
        })
      )
    }

    const handleConversationResolved = (data: any) => {
      const { conversationId } = data

      if (!conversationId) return

      const convId = conversationId.toString()

      // Update the conversation status to 'resolved' in the list cache
      dispatch(
        agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
          if (draft?.conversations) {
            const conv = draft.conversations.find(
              (c: any) => c.id?.toString() === convId || c._id?.toString() === convId
            )
            if (conv) {
              conv.status = 'resolved'
            }
          }
        }),
      )
    }

    // Handle assignment/unassignment updates from admins/assigners
    const handleConversationUpdated = (data: any) => {
      const { conversationId, assignedAgent, status, conversation } = data

      if (!conversationId) return

      const convId = conversationId.toString()
      const assignedAgentId = typeof assignedAgent === 'object' ? assignedAgent?.id : assignedAgent;
      const currentUserId = user?.id;
      const isAssignedToMe = assignedAgentId && currentUserId && assignedAgentId.toString() === currentUserId.toString();



      if (isAssignedToMe) {
        dispatch(agentApi.util.invalidateTags(['AgentChat']))
        return;
      }

      dispatch(
        agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
          if (draft?.conversations) {
            const conv = draft.conversations.find(
              (c: any) => c.id?.toString() === convId || c._id?.toString() === convId
            )
            if (conv) {
              conv.assignedAgent = assignedAgent || null
              conv.status = status

              const convIndex = draft.conversations.findIndex(
                (c: any) => c.id?.toString() === convId || c._id?.toString() === convId
              )
              if (convIndex !== -1) {
                // Move to top for better visibility if status changed or just updated
                const updatedConv = draft.conversations.splice(convIndex, 1)[0]
                draft.conversations.unshift(updatedConv)
              }
            } else {


              if (conversation && (user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'assigner')) {
                draft.conversations.unshift(conversation)
              }
            }
          }
        }),
      )
    }

    const handleNewAgentRequest = (data: any) => {
      // If data includes conversation information, update the list immediately
      if (data.conversation) {
        dispatch(
          agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
            if (draft?.conversations) {
              // Check if conversation already exists
              const existingIndex = draft.conversations.findIndex(
                (c: any) => c.id === data.conversation.id || c._id === data.conversation._id
              )


              const shouldShowConversation =
                !data.conversation.assignedAgent ||
                data.conversation.assignedAgent?.id === user?.id ||
                user?.role === 'super_admin' ||
                (user?.role === 'admin' || user?.role === 'assigner')

              if (shouldShowConversation) {
                if (existingIndex === -1) {

                  draft.conversations.unshift(data.conversation)
                } else {

                  draft.conversations[existingIndex] = data.conversation

                  const conv = draft.conversations.splice(existingIndex, 1)[0]
                  draft.conversations.unshift(conv)
                }
              }
            }
          })
        )
      } else {

        dispatch(agentApi.util.invalidateTags(['AgentChat']))
      }


      toast.info(data.title || t('agent_request'), {
        description: data.message || t('a_user_is_waiting_for_an_agent'),
        duration: 6000,
      })

      // Show browser notification
      if (typeof document !== 'undefined' && !document.hasFocus()) {
        const title = data.title || 'Agent Request';
        const body = data.message || 'A user is waiting for an agent...';
        unreadMessagesRef.current.push(`${title}: ${body}`);

        sendNotification(title, {
          body,
          icon: notificationIcon,
          onClick: () => {
            window.focus();
            if (data.conversation?.id) {
              router.push(`${ROUTES.CHAT_ASSISTANT.LIVE_AGENT}?conversationId=${data.conversation.id}`);
            } else {
              router.push(ROUTES.CHAT_ASSISTANT.LIVE_AGENT);
            }
          }
        });

        startBlinking(unreadMessagesRef.current);
      }
    }

    // Handle conversation transfer events
    const handleConversationTransferred = (data: any) => {
      const { conversation } = data

      if (conversation) {
        dispatch(
          agentApi.util.updateQueryData('getTransferredConversations', {}, (draft) => {
            if (draft?.conversations) {

              const existingIndex = draft.conversations.findIndex(
                (c: any) => c.id === conversation.id || c._id === conversation._id
              )

              // If conversation is assigned to current user or is unassigned (for assigners/admins)
              const shouldShowConversation =
                !conversation.assignedAgent ||
                conversation.assignedAgent?.id === user?.id ||
                user?.role === 'super_admin' ||
                (user?.role === 'admin' || user?.role === 'assigner')

              if (shouldShowConversation) {
                if (existingIndex === -1) {

                  draft.conversations.unshift(conversation)
                } else {

                  draft.conversations[existingIndex] = conversation

                  const conv = draft.conversations.splice(existingIndex, 1)[0]
                  draft.conversations.unshift(conv)
                }
              } else if (existingIndex !== -1) {

                draft.conversations.splice(existingIndex, 1)
              }
            }
          })
        )
      }
    }

    const handleNewNotification = (notification: any) => {
      // If a new conversation is assigned to us, refresh the list immediately
      if (notification.type === 'AGENT_ASSIGNMENT') {
        dispatch(agentApi.util.invalidateTags(['AgentChat']))
      }



      if (notification.type !== 'AGENT_REQUEST') {
        toast.success(notification.title, { description: notification.message })


        if (typeof document !== 'undefined' && !document.hasFocus()) {
          const body = notification.message;
          unreadMessagesRef.current.push(`${notification.title}: ${body}`);

          sendNotification(notification.title, {
            body,
            icon: notificationIcon,
            onClick: () => {
              window.focus();
              if (notification.link) {
                router.push(notification.link);
              }
            }
          });

          startBlinking(unreadMessagesRef.current);
        }
      }
    }

    const handleAdminSettingsUpdated = () => {
      dispatch(adminSettingApi.util.invalidateTags(['AdminSettings']))
      toast.info(t('settings_updated_notification', { defaultValue: 'System settings have been updated.' }))
    }

    // Register listeners
    socket.on(SOCKET.Listeners.Admin_Settings_Updated, handleAdminSettingsUpdated)
    socket.on(SOCKET.Listeners.Receive_Message, handleReceiveMessage)
    socket.on(SOCKET.Listeners.User_Status_Update, handleUserStatusUpdate)
    socket.on(SOCKET.Listeners.Conversation_Resolved, handleConversationResolved)
    socket.on(SOCKET.Listeners.Conversation_Updated, handleConversationUpdated)
    socket.on(SOCKET.Listeners.New_Agent_Request, handleNewAgentRequest)
    socket.on(SOCKET.Listeners.Conversation_Transferred, handleConversationTransferred)
    socket.on(SOCKET.Listeners.New_Notification, handleNewNotification)
    return () => {
      // Unregister listeners
      socket.off(SOCKET.Listeners.Admin_Settings_Updated, handleAdminSettingsUpdated)
      socket.off(SOCKET.Listeners.Receive_Message, handleReceiveMessage)
      socket.off(SOCKET.Listeners.User_Status_Update, handleUserStatusUpdate)
      socket.off(SOCKET.Listeners.Conversation_Resolved, handleConversationResolved)
      socket.off(SOCKET.Listeners.Conversation_Updated, handleConversationUpdated)
      socket.off(SOCKET.Listeners.New_Agent_Request, handleNewAgentRequest)
      socket.off(SOCKET.Listeners.Conversation_Transferred, handleConversationTransferred)
      socket.off(SOCKET.Listeners.New_Notification, handleNewNotification)
    }
  }, [user, dispatch])
}
