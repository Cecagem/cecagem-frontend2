"use client";

import {
  Bell,
  CheckCheck,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useNotificationStore } from "@/features/notifications/stores/notification.store";
import { notificationService } from "@/features/notifications/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const BellComponent = () => {
  const { notifications, unreadCount, isConnected } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationStore();

  const handleMarkAsRead = async (notificationId: string) => {
    if (notificationId.startsWith("temp-")) {
      markAsRead(notificationId);
      return;
    }

    try {
      await notificationService.markAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    const icons: Record<string, React.ReactNode> = {
      PAYMENT_PENDING: (
        <DollarSign
          className={cn(iconClass, "text-amber-600 dark:text-amber-400")}
        />
      ),
      PAYMENT_COMPLETED: (
        <CheckCircle2
          className={cn(iconClass, "text-emerald-600 dark:text-emerald-400")}
        />
      ),
      PAYMENT_REJECTED: (
        <XCircle className={cn(iconClass, "text-red-600 dark:text-red-400")} />
      ),
      DELIVERABLE_REJECTED: (
        <AlertTriangle
          className={cn(iconClass, "text-orange-600 dark:text-orange-400")}
        />
      ),
      DELIVERABLE_APPROVED: (
        <FileCheck
          className={cn(iconClass, "text-emerald-600 dark:text-emerald-400")}
        />
      ),
      DELIVERABLE_COMPLETED: (
        <FileText
          className={cn(iconClass, "text-blue-600 dark:text-blue-400")}
        />
      ),
      CONTRACT_CREATED: (
        <FileText
          className={cn(iconClass, "text-purple-600 dark:text-purple-400")}
        />
      ),
      CONTRACT_EXPIRED: (
        <Clock className={cn(iconClass, "text-red-600 dark:text-red-400")} />
      ),
    };
    return (
      icons[type] || (
        <Bell className={cn(iconClass, "text-gray-600 dark:text-gray-400")} />
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1 text-xs"
            >
              {unreadCount >= 100 ? "100+" : unreadCount}
            </Badge>
          )}
          {isConnected && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-sm">Notificaciones</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} sin leer`
                : "No hay notificaciones nuevas"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay notificaciones
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const isUnread = notification.status !== "READ";

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 transition-all cursor-pointer border-l-4",
                      isUnread
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-blue-500 hover:bg-blue-100/50 dark:hover:bg-blue-950/30"
                        : "bg-background border-l-transparent hover:bg-accent/30"
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm leading-tight",
                              isUnread
                                ? "font-semibold text-foreground"
                                : "font-normal text-muted-foreground"
                            )}
                          >
                            {notification.title}
                          </p>
                          {isUnread && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs line-clamp-2 leading-relaxed",
                            isUnread
                              ? "text-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 font-medium">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs" size="sm">
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
