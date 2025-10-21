import { cecagemApi } from "@/lib/api-client";

// Tipos para las notificaciones
export interface StudentNotificationPayload {
  userId: string;
  contractId: string;
  installmentId: string;
}

export interface CompanyNotificationPayload {
  companyId: string;
  installmentId: string;
}

export interface NotificationResponse {
  message: string;
  success: boolean;
}

export class WhatsAppNotificationService {
  // Enviar notificación a estudiante
  async sendStudentNotification(payload: StudentNotificationPayload): Promise<NotificationResponse> {
    return await cecagemApi.post<NotificationResponse>(
      "/notifications/installment-student",
      payload as unknown as Record<string, unknown>
    );
  }

  // Enviar notificación a empresa
  async sendCompanyNotification(payload: CompanyNotificationPayload): Promise<NotificationResponse> {
    return await cecagemApi.post<NotificationResponse>(
      "/notifications/installment-company", 
      payload as unknown as Record<string, unknown>
    );
  }
}

export const whatsAppNotificationService = new WhatsAppNotificationService();