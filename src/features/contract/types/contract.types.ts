/* eslint-disable @typescript-eslint/no-explicit-any */
// Enums
export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED", 
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export enum PaymentMethod {
  CARD = "CARD",
  CASH = "CASH", 
  PLIN = "PLIN",
  YAPE = "YAPE",
  BANK_TRANSFER = "BANK_TRANSFER",
  OTHER = "OTHER"
}

export enum UserRole {
  COLLABORATOR_EXTERNAL = "COLLABORATOR_EXTERNAL",
  COLLABORATOR_INTERNAL = "COLLABORATOR_INTERNAL",
  CLIENT = "CLIENT"
}

// Interfaces básicas
export interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  university: string;
  faculty: string;
  career: string;
}

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profile: IUserProfile;
}

export interface IDeliverable {
  id: string;
  name: string;
  description: string;
}

// Interfaces para Contratos
export interface IContractPayment {
  id: string;
  installmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IContractInstallment {
  id: string;
  contractId: string;
  userCompanyId: string | null;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  payments: IContractPayment[];
}

// Nueva interfaz para las cuotas de colaboradores
export interface ICollaboratorInstallment {
  id: string;
  contractId: string | null;
  userCompanyId: string | null;
  contractUserId: string;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  payments: IContractPayment[];
}

export interface IContractUser {
  id: string;
  contractId: string;
  userId: string;
  user: IUser;
  assignedAt: string;
  installments?: ICollaboratorInstallment[] | null;
}

export interface IContractDeliverable {
  id: string;
  contractId: string;
  deliverableId: string;
  deliverable: IDeliverable;
  notes: string | null;
  isCompleted: boolean;
  isAproved: boolean;
  completedAt: string | null;
  assignedAt: string;
}

export interface IContract {
  users: any;
  collaboratorPayments: any;
  deliverableIds: never[];
  userIds: never[];
  id: string;
  serviceId: string;
  name: string;
  university: string;
  career: string;
  observation: string;
  costTotal: number;
  currency: "PEN" | "USD";
  deliverablesPercentage: number;
  paymentPercentage: number;
  overallProgress: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  installments: IContractInstallment[];
  contractUsers: IContractUser[];
  contractDeliverables: IContractDeliverable[];
}

export interface IContractMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IContractResponse {
  data: IContract[];
  meta: IContractMeta;
}

// Filtros para contratos
export interface IContractFilters {
  page?: number;
  limit?: number;
  search?: string;
  serviceId?: string;
  sortBy?: "createdAt" | "updatedAt" | "startDate" | "endDate" | "name";
  sortOrder?: "asc" | "desc";
}

// Estados para filtros
export interface ContractFiltersState {
  search?: string;
  serviceId?: string;
  page: number;
  limit: number;
}

// DTOs para actualizar entregables
export interface IUpdateDeliverableDto {
  notes?: string;
  isCompleted?: boolean;
  isAproved?: boolean;
  [key: string]: unknown;
}

// Nuevo tipo para pagos de colaboradores
export interface ICollaboratorPayment {
  userId: string;
  amount: number;
  dueDate: string;
  description: string;
}

// DTOs para crear contratos
export interface ICreateContractDto {
  serviceId: string;
  name: string;
  university: string;
  career: string;
  observation?: string;
  costTotal: number;
  currency: "PEN" | "USD";
  startDate: string;
  endDate: string;
  userIds: string[];
  deliverableIds: string[];
  installments: {
    description: string;
    amount: number;
    dueDate: string;
  }[];
  collaboratorPayments?: ICollaboratorPayment[];
  [key: string]: unknown;
}

// DTOs para actualizar contratos
export interface IUpdateContractDto {
  serviceId?: string;
  name?: string;
  university?: string;
  career?: string;
  observation?: string;
  costTotal?: number;
  currency?: "PEN" | "USD";
  startDate?: string;
  endDate?: string;
  userIds?: string[];
  deliverableIds?: string[];
  installments?: {
    description: string;
    amount: number;
    dueDate: string;
  }[];
  collaboratorPayments?: ICollaboratorPayment[];
  [key: string]: unknown;
}

// DTOs para actualizar pagos
export interface IUpdatePaymentDto {
  status: PaymentStatus;
}

// Respuesta de actualización de pagos
export interface IUpdatePaymentResponse {
  id: string;
  installmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}