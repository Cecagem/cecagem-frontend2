// Enums para tipos de documento y grado académico
export enum DocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  CE = 'CE'
}

export enum AcademicDegree {
  BACHILLER = 'Bachiller',
  LICENCIADO = 'Licenciado',
  MAGISTER = 'Magister',
  DOCTOR = 'Doctor'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  COLLABORATOR_INTERNAL = 'COLLABORATOR_INTERNAL',
  COLLABORATOR_EXTERNAL = 'COLLABORATOR_EXTERNAL',
  RRHH = 'RRHH'
}

// Interface para Profile
export interface IProfile {
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

// Interface para User
export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: IProfile;
}

// DTOs para crear usuario completo
export interface ICreateUserDto {
  user: {
    email: string;
    role: UserRole;
    isActive: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    phone: string;
    university?: string;
    faculty?: string;
    career?: string;
    academicDegree?: AcademicDegree;
    salaryMonth?: number | null;
    paymentDate?: string | null;
  };
}

// DTOs para actualizar usuario completo
export interface IUpdateUserDto {
  user: {
    email: string;
    role: UserRole;
    isActive: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    phone: string;
    university?: string;
    faculty?: string;
    career?: string;
    academicDegree?: AcademicDegree;
    salaryMonth?: number | null;
    paymentDate?: string | null;
  };
}

// Response del backend
export interface IUserResponse {
  data: IUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filtros para búsqueda
export interface IUserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
  type?: string; // Para compatibilidad con el endpoint
}

// Estado de filtros para componentes
export interface UserFiltersState {
  search?: string;
  role?: UserRole;
  status?: boolean;
}

// Datos del formulario
export interface IUserFormData {
  // Información personal
  email: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  
  // Información académica (opcional)
  university?: string;
  faculty?: string;
  career?: string;
  academicDegree?: AcademicDegree;
  
  // Rol
  role: UserRole;
  isActive: boolean;
  
  // Contrato (solo para RRHH y COLLABORATOR_INTERNAL)
  salaryMonth?: number;
  paymentDate?: Date;
}

// Estadísticas
export interface IUserStats {
  total: number;
  active: number;
  inactive: number;
  totalSalaries: number;
  averageSalary: number;
}

// Tipos helper para roles que requieren contrato
export type RoleWithContract = UserRole.RRHH | UserRole.COLLABORATOR_INTERNAL;

// Helper para verificar si un rol requiere contrato
export const requiresContract = (role: UserRole): role is RoleWithContract => {
  return role === UserRole.RRHH || role === UserRole.COLLABORATOR_INTERNAL;
};