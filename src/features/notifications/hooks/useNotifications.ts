import { useEffect } from "react";
import { useAuthStore } from "@/features/auth";
import { initializeSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { useNotificationStore } from "../stores/notification.store";
import { NotificationEvent } from "../types/notification.types";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/cookies";
import { notificationService } from "../services/notification.service";
import { cleanNotificationMessage } from "@/lib/utils";

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isConnected,
    addNotificationEvent,
    setConnected,
    clearNotifications,
    setNotifications,
  } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectSocket();
      clearNotifications();
      return;
    }

    let isMounted = true;

    const initializeNotifications = async () => {
      const userNotifications =
        await notificationService.getUserNotifications();

      if (!isMounted) return;

      setNotifications(userNotifications);

      const token = await getAuthToken();

      if (!token || !isMounted) {
        return;
      }

      const socket = initializeSocket(token);

      socket.on("connect", () => {
        if (isMounted) {
          setConnected(true);
        }
      });

      socket.on("disconnect", () => {
        if (isMounted) {
          setConnected(false);
        }
      });

      socket.on("notification", (event: NotificationEvent) => {
        if (!isMounted) return;

        addNotificationEvent(event);

        toast(event.title, {
          description: cleanNotificationMessage(event.message),
          duration: 5000,
        });

        setTimeout(async () => {
          if (!isMounted) return;

          try {
            const updatedNotifications =
              await notificationService.getUserNotifications();
            setNotifications(updatedNotifications);
          } catch (error) {
            console.error("Error al actualizar notificaciones:", error);
          }
        }, 2000);
      });
    };

    initializeNotifications();

    return () => {
      isMounted = false;
      const currentSocket = getSocket();
      if (currentSocket) {
        currentSocket.off("connect");
        currentSocket.off("disconnect");
        currentSocket.off("notification");
      }
    };
  }, [isAuthenticated, user]);

  return {
    notifications,
    unreadCount,
    isConnected,
  };
};
