"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useSendStudentNotification, useSendCompanyNotification } from "./use-whatsapp-notification";

// Props para notificación a estudiante
interface StudentNotificationProps {
  userId: string;
  contractId: string;
  installmentId: string;
}

// Props para notificación a empresa
interface CompanyNotificationProps {
  companyId: string;
  installmentId: string;
}

// Props del componente
interface WhatsAppNotificationButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

// Sobrecarga de tipos para autodetección
interface WhatsAppButtonStudentProps extends WhatsAppNotificationButtonProps, StudentNotificationProps {}
interface WhatsAppButtonCompanyProps extends WhatsAppNotificationButtonProps, CompanyNotificationProps {}

type WhatsAppButtonProps = WhatsAppButtonStudentProps | WhatsAppButtonCompanyProps;

export const WhatsAppNotificationButton = (props: WhatsAppButtonProps) => {
  const {
    variant = "default",
    size = "default", 
    className = "",
    children,
    ...notificationData
  } = props;

  const sendStudentNotification = useSendStudentNotification();
  const sendCompanyNotification = useSendCompanyNotification();

  // Autodetectar tipo basado en las props
  const isStudentNotification = 'userId' in notificationData && 'contractId' in notificationData;
  const isCompanyNotification = 'companyId' in notificationData;

  const handleSendNotification = () => {
    if (isStudentNotification) {
      const { userId, contractId, installmentId } = notificationData as StudentNotificationProps;
      sendStudentNotification.mutate({
        userId,
        contractId,
        installmentId,
      });
    } else if (isCompanyNotification) {
      const { companyId, installmentId } = notificationData as CompanyNotificationProps;
      sendCompanyNotification.mutate({
        companyId,
        installmentId,
      });
    }
  };

  const isLoading = sendStudentNotification.isPending || sendCompanyNotification.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      onClick={handleSendNotification}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className={`h-4 w-4 ${size !== 'icon' ? 'mr-2' : ''} animate-spin`} />
      ) : (
        <Send className={`h-4 w-4 ${size !== 'icon' ? 'mr-2' : ''}`} />
      )}
      {size !== 'icon' && (children || "WhatsApp")}
    </Button>
  );
};