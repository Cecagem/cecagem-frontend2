export type NotificationType =
  | "USER_CREATED"
  | "CONTRACT_CREATED"
  | "CONTRACT_EXPIRED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_REJECTED"
  | "DELIVERABLE_COMPLETED"
  | "DELIVERABLE_APPROVED"
  | "DELIVERABLE_REJECTED"
  | "TRANSACTION_CREATED"
  | "COMPANY_INSTALLMENT"
  | "INSTALLMENT_STUDENT"
  | "INSTALLMENT_COMPANY";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "READ";

export type NotificationChannel = "SYSTEM" | "EMAIL" | "WHATSAPP";

export interface NotificationPayload {
  contractId?: string;
  paymentId?: string;
  transactionId?: string;
  companyId?: string;
  userId?: string;
  amount?: string;
  currency?: string;
  dueDate?: string;
  contractName?: string;
  serviceName?: string;
  companyName?: string;
  userName?: string;
  category?: string;
  password?: string;
  deliverableId?: string;
  daysPassed?: number;
  installmentId?: string;
  daysPastDue?: number;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string | null;
  message: string | null;
  channels: NotificationChannel[];
  status: NotificationStatus;
  payload: NotificationPayload | null;
  createdAt: string;
  sentAt: string | null;
}

export interface NotificationEvent {
  type: NotificationType;
  title: string;
  message: string;
  payload: NotificationPayload;
  timestamp: Date;
}
