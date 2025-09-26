// Enums para el estado y método de pago
export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED", 
  FAILED = "FAILED"
}

export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  CARD = "CARD",
  YAPE = "YAPE",
  PLIN = "PLIN",
  OTHER = "OTHER"
}

// Interface para crear un nuevo pago
export interface ICreatePaymentDto {
  installmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference?: string;
  [key: string]: unknown;
}

// Interface para la respuesta del pago creado
export interface IPaymentResponse {
  id: string;
  installmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  method: PaymentMethod;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para actualizar un pago
export interface IUpdatePaymentDto {
  status: PaymentStatus;
}

// Interface para la respuesta de actualización de pago
export interface IUpdatePaymentResponse {
  id: string;
  status: PaymentStatus;
}