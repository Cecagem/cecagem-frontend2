//  ENTITIES

export type UserRole = "SUPER_ADMIN" | "COMPANY" | "CLIENT";

export type DocumentType = "DNI" | "PASSPORT" | "OTHER";

export type AcademicDegree = "Bachiller" | "Licenciado" | "Magister" | "Doctor";

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  university?: string | null;
  faculty?: string | null;
  career?: string | null;
  academicDegree?: AcademicDegree | null;
  salaryMonth?: number | null;
  paymentDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserCompany {
  id: string;
  userId: string;
  ruc: string;
  businessName: string;
  tradeName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile | null;
  company?: UserCompany | null;
}

// REQUEST

export interface UserFilters {
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateUserProfileRequest {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  university?: string;
  faculty?: string;
  career?: string;
  academicDegree?: AcademicDegree;
  salaryMonth?: number;
  paymentDate?: string;
}

export interface CreateUserCompanyRequest {
  ruc: string;
  businessName: string;
  tradeName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface CreateCompleteUserRequest {
  user: CreateUserRequest;
  profile?: CreateUserProfileRequest;
  company?: CreateUserCompanyRequest;
}

export interface UpdateUserRequest {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

// RESPONSE

export interface UsersPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UsersResponse {
  data: User[];
  meta: UsersPaginationMeta;
}
