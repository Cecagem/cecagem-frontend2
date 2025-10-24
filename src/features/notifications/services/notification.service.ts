import { cecagemApi } from "@/lib/api-client";
import { Notification } from "../types/notification.types";

export const notificationService = {
  getUserNotifications: async (limit = 50): Promise<Notification[]> => {
    try {
      const response = await cecagemApi.get<Notification[]>(
        `/notifications/user?limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await cecagemApi.get<{ count: number }>(
        "/notifications/unread-count"
      );
      return response.count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await cecagemApi.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },
};
