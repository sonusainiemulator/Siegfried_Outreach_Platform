"use client";

import { isBrowser, isServer } from "@/utils/environment";
import { useCallback, useEffect, useRef, useState } from "react";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isBlinking, setIsBlinking] = useState(false);
  const permissionRef = useRef<NotificationPermission>("default");
  const originalTitle = useRef<string>("");
  const blinkInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const unreadMessagesRef = useRef<string[]>([]);

  useEffect(() => {
    if (isBrowser) {
      const p = Notification.permission;
      setPermission(p);
      permissionRef.current = p;
      originalTitle.current = document.title;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (isServer || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    permissionRef.current = result;
    return result;
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions & { onClick?: () => void }) => {
    if (permissionRef.current !== "granted" || document.hasFocus()) return;

    try {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        ...options,
      });

      if (options?.onClick) {
        notification.onclick = () => {
          window.focus();
          options.onClick?.();
          notification.close();
        };
      }
    } catch (error) {
      console.error("Failed to send browser notification:", error);
    }
  }, []);

  const startBlinking = useCallback((messages: string[]) => {
    if (document.hasFocus()) return;

    unreadMessagesRef.current = messages;
    setIsBlinking(true);

    if (blinkInterval.current) clearInterval(blinkInterval.current);

    let step = 0;

    // Use the latest original title or current document title if not set
    const baseTitle = originalTitle.current || document.title;

    blinkInterval.current = setInterval(() => {
      const allMessages = [...unreadMessagesRef.current, baseTitle];
      document.title = allMessages[step % allMessages.length];
      step++;
    }, 2000);
  }, []);

  const stopBlinking = useCallback(() => {
    setIsBlinking(false);
    unreadMessagesRef.current = [];
    if (blinkInterval.current) {
      clearInterval(blinkInterval.current);
      blinkInterval.current = null;
    }
    if (originalTitle.current) {
      document.title = originalTitle.current;
    }
  }, []);

  useEffect(() => {
    const handleFocus = () => stopBlinking();
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      if (blinkInterval.current) clearInterval(blinkInterval.current);
    };
  }, [stopBlinking]);

  return {
    permission,
    isBlinking,
    requestPermission,
    sendNotification,
    startBlinking,
    stopBlinking,
    isSupported: isBrowser && "Notification" in window,
  };
};
