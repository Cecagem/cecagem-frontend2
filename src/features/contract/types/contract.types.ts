// Interfaces para Contratos
export interface IContractPayment {
  id: string;
  installmentId: string;
  amount: number;
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

export interface IContractUser {
  id: string;
  contractId: string;
  userId: string;
  assignedAt: string;
}

export interface IContractDeliverable {
  id: string;
  contractId: string;
  deliverableId: string;
  notes: string | null;
  isCompleted: boolean;
  isAproved: boolean;
  completedAt: string | null;
  assignedAt: string;
}

export interface IContract {
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
  [key: string]: unknown;
}