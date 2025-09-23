// Interfaces principales
export interface IUser {
  id: string;
  email: string;
  fullName: string;
}

export interface IUserRelation {
  id: string;
  monthlyPayment: number;
  paymentDate: string;
  isActive: boolean;
  user: IUser;
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
  userRelations: IUserRelation[];
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
  };
}

// DTOs para crear empresa
export interface ICreateUserRelationDto {
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
  userRelation: ICreateUserRelationDto;
}

// DTOs para actualizar
export interface IUpdateUserRelationDto {
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
  userRelation?: IUpdateUserRelationDto;
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