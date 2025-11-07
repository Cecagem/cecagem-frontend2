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
  CLIENT = 'CLIENT'
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
  university: string;
  faculty: string;
  career: string;
  academicDegree: AcademicDegree;
  salaryMonth?: number | null;
  paymentDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface para User
export interface IResearchClient {
  id: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: IProfile;
}

// DTOs para crear usuario completo
export interface ICreateUserDto {
  email?: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface ICreateProfileDto {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  university: string;
  faculty: string;
  career: string;
  academicDegree: AcademicDegree;
  salaryMonth?: number;
  paymentDate?: string;
}

export interface ICreateResearchClientDto {
  user: ICreateUserDto;
  profile: ICreateProfileDto;
}

// DTOs para actualizar
export type IUpdateProfileDto = Partial<ICreateProfileDto>;

export type IUpdateUserDto = Partial<Omit<ICreateUserDto, 'password'>>;

export interface IUpdateResearchClientDto {
  user?: IUpdateUserDto;
  profile?: IUpdateProfileDto;
}

// Response types
export interface IResearchClientResponse {
  data: IResearchClient[];
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
export interface IResearchClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  type?: string;
  isActive?: boolean;
}

// Datos para el formulario
export interface IResearchClientFormData {
  // Datos de usuario
  email?: string;
  password?: string;
  isActive: boolean;
  
  // Datos de perfil
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  university: string;
  faculty: string;
  career: string;
  academicDegree: AcademicDegree;
}