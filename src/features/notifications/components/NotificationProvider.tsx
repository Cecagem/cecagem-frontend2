"use client";

import { useNotifications } from "@/features/notifications";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useNotifications();

  return <>{children}</>;
};
