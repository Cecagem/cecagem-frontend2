import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  whatsAppNotificationService, 
  StudentNotificationPayload, 
  CompanyNotificationPayload 
} from "./whatsapp-notification.service";

export const useSendStudentNotification = () => {
  return useMutation({
    mutationFn: (payload: StudentNotificationPayload) =>
      whatsAppNotificationService.sendStudentNotification(payload),
    onSuccess: () => {
      toast.success("Notificación WhatsApp enviada correctamente al estudiante");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Error al enviar la notificación WhatsApp al estudiante"
      );
    },
  });
};

export const useSendCompanyNotification = () => {
  return useMutation({
    mutationFn: (payload: CompanyNotificationPayload) =>
      whatsAppNotificationService.sendCompanyNotification(payload),
    onSuccess: () => {
      toast.success("Notificación WhatsApp enviada correctamente a la empresa");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Error al enviar la notificación WhatsApp a la empresa"
      );
    },
  });
};