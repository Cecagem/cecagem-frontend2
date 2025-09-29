// Importar tipos de payment del módulo contract
import { PaymentStatus, PaymentMethod } from '@/features/contract/types/contract.types';

// Interfaces principales
export interface IUser {
  id: string;
  email: string;
  fullName: string;
}

export interface IContract {
  id: string;
  monthlyPayment: number;
  paymentDate: string;
  isActive: boolean;
  user: IUser;
  installments: IInstallment[];
}

// Interface para pagos (similar a IContractPayment)
export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IInstallment {
  id: string;
  amount: number;
  dueDate: string;
  description: string;
  payments: IPayment[];
}

export interface ICompany {
  id: string;
  ruc: string;
  businessName: string;
  tradeName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  contract: IContract[];
  installments: IInstallment[];
}

// Interfaces para colaboradores internos
export interface ICollaboratorInternal {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  profile: {
    firstName: string;
    lastName: string;
    documentNumber: string;
  };
}

// DTOs para crear empresa
export interface ICreateContractDto {
  userId: string;
  monthlyPayment: number;
  paymentDate: string;
  isActive: boolean;
}

export interface ICreateCompanyDto {
  ruc: string;
  businessName: string;
  tradeName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  userRelation: ICreateContractDto;
}

// DTOs para actualizar
export interface IUpdateContractDto {
  userId?: string;
  monthlyPayment?: number;
  paymentDate?: string;
  isActive?: boolean;
}

export interface IUpdateCompanyDto {
  ruc?: string;
  businessName?: string;
  tradeName?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive?: boolean;
  userRelation?: IUpdateContractDto;
}

// Response types
export interface ICompaniesResponse {
  data: ICompany[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ICollaboratorsResponse {
  data: ICollaboratorInternal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Filtros para búsqueda
export interface ICompanyFilters {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  ruc?: string;
  businessName?: string;
  tradeName?: string;
}

// Tipos para select options
export interface ICollaboratorOption {
  value: string;
  label: string;
  email: string;
}