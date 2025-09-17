// RESPONSE
export interface IContractInstallment {
  id: string;
  contractId: string;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
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
  notes: string;
  isCompleted: boolean;
  completedAt: string | null;
  assignedAt: string;
}

export interface IProject {
  id: string;
  serviceId: string;
  name: string;
  university: string;
  career: string;
  observation: string;
  costTotal: number;
  currency: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  installments: IContractInstallment[];
  contractUsers: IContractUser[];
  contractDeliverables: IContractDeliverable[];
}

export interface IProjectMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IProjectListResponse {
  data: IProject[];
  meta: IProjectMeta;
}

// filters
export interface IProjectFilters {
  search?: string;
  serviceId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
