import { type UserFilters as IUserFilters } from "@/features/user";

//  ENTITIES

export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  COMPANY: "COMPANY",
  COLLABORATOR_INTERNAL: "COLLABORATOR_INTERNAL",
  COLLABORATOR_EXTERNAL: "COLLABORATOR_EXTERNAL",
  RRHH: "RRHH",
} as const;

export const UserStatus = {
  ACTIVE: true,
  INACTIVE: false,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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
  tradeName?: string | null;
  address?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
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

// REQUEST TYPES

export interface UserFilters extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  role?: UserRole;
  type?: "users_system" | "clients" | "company" | "all";
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
  academicDegree?: string;
  salaryMonth?: number;
  paymentDate?: string;
}

export interface CreateUserCompanyRequest {
  ruc: string;
  businessName: string;
  tradeName?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  role: UserRole;
  isActive?: boolean;
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

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  phone?: string;
  university?: string;
  faculty?: string;
  career?: string;
  academicDegree?: string;
  salaryMonth?: number;
  paymentDate?: string;
}

export interface UpdateUserCompanyRequest {
  ruc?: string;
  businessName?: string;
  tradeName?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateCompleteUserRequest {
  user?: UpdateUserRequest;
  profile?: UpdateUserProfileRequest;
  company?: UpdateUserCompanyRequest;
}

// RESPONSE TYPES

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

export interface UserCompleteResponse extends User {
  profile?: UserProfile;
  company?: UserCompany;
}

export interface DeleteUserResponse {
  message: string;
}

// filtros

export interface UserFiltersProps {
  filters: Partial<IUserFilters>;
  onApplyFilters: (filters: Partial<IUserFilters>) => void;
  onClearFilters: () => void;
}
