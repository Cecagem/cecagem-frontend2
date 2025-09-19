// RESPONSE
export interface IContractInstallment {
  id: string;
  contractId: string;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  payments?: {
    id: string;
    installmentId: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
  };
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
  deliverablesPercentage?: number;
  paymentPercentage?: number;
  overallProgress?: number;
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

// filters
export interface IContractFilters {
  page?: number;
  limit?: number;
  search?: string;
  serviceId?: string;
  sortBy?: "createdAt" | "updatedAt" | "startDate" | "endDate";
  sortOrder?: "asc" | "desc";
}

// CREATE CONTRACT

export interface ICreateConctract {
  serviceId: string;
  name: string;
  observation?: string;
  university?: string;
  career?: string;
  costTotal: number;
  currency: "PEN" | "USD";
  startDate: string;
  endDate: string;
  installments: ICreateContractInstallment[];
  userIds: string[];
  deliverableIds: string[];
}

export interface ICreateContractInstallment {
  description: string;
  amount: number;
  dueDate: string;
}

// UPDATE CONTRACT
export interface IUpdateContract {
  serviceId?: string;
  name?: string;
  observation?: string;
  university?: string;
  career?: string;
  costTotal?: number;
  currency?: "PEN" | "USD";
  startDate?: string;
  endDate?: string;
  userIds: string[];
  deliverableIds: string[];
  installments: ICreateContractInstallment[];
}
