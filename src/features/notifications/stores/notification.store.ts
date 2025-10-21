import { create } from "zustand";
import { Notification, NotificationEvent } from "../types/notification.types";

let notificationCounter = 0;

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  addNotification: (notification: Notification) => void;
  addNotificationEvent: (event: NotificationEvent) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  setConnected: (connected: boolean) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  addNotificationEvent: (event) =>
    set((state) => {
      const isDuplicate = state.notifications.some(
        (n) => n.title === event.title && n.message === event.message
      );

      if (isDuplicate) {
        return state;
      }

      const uniqueId = `temp-${Date.now()}-${++notificationCounter}`;

      return {
        notifications: [
          {
            id: uniqueId,
            userId: "",
            type: event.type,
            title: event.title,
            message: event.message,
            channels: ["SYSTEM"],
            status: "SENT",
            payload: event.payload,
            createdAt: new Date().toISOString(),
            sentAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      };
    }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: "READ" as const } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        status: "READ" as const,
      })),
      unreadCount: 0,
    })),

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => n.status !== "READ").length,
    }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setConnected: (connected) => set({ isConnected: connected }),

  clearNotifications: () =>
    set({ notifications: [], unreadCount: 0, isConnected: false }),
}));
