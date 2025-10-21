"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NotificationProvider } from "@/features/notifications/components/NotificationProvider";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotificationProvider>
        <AppSidebar variant="floating" />
        <>{children}</>
      </NotificationProvider>
    </SidebarProvider>
  );
}
