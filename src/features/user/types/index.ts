import { z } from "zod";

// Enums - Solo roles permitidos para creación
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN", 
  ADMIN = "ADMIN",
  COLLABORATOR_EXTERNAL = "COLLABORATOR_EXTERNAL",
  COLLABORATOR_INTERNAL = "COLLABORATOR_INTERNAL",
  RRHH = "RRHH",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum DocumentType {
  DNI = "DNI",
  PASSPORT = "PASSPORT",
  CE = "CE",
}

// Zod Schemas
export const UserProfileSchema = z.object({
  firstName: z.string().min(2, "Nombres son requeridos"),
  lastName: z.string().min(2, "Apellidos son requeridos"),
  documentType: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(8, "Número de documento inválido"),
  phone: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  // Campos opcionales para COLABORADOR_INTERNO y RRHH
  salaryMonth: z.number().min(0, "El salario debe ser mayor a 0").optional(),
  paymentDate: z.string().optional(), // ISO string date
});

export const UserDataSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.nativeEnum(UserRole),
});

export const UserFormSchema = z.object({
  user: UserDataSchema,
  profile: UserProfileSchema,
});

// Schema para la respuesta de la API
export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  profile: UserProfileSchema.extend({
    id: z.string(),
    userId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }).optional(),
});

// Types
export type User = z.infer<typeof UserResponseSchema>;
export type UserFormData = z.infer<typeof UserFormSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserData = z.infer<typeof UserDataSchema>;

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  byRole: {
    superAdmin: number;
    admin: number;
    collaboratorExternal: number;
    collaboratorInternal: number;
    rrhh: number;
  };
}

export interface SearchFilters extends Record<string, unknown> {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
}

// Component Props Types
export interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isLoading?: boolean;
}

export interface UserFiltersProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export interface UserStatsCardsProps {
  stats: UserStats;
  isLoading: boolean;
}

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// Helper functions
export const requiresSalary = (role: UserRole): boolean => {
  return role === UserRole.COLLABORATOR_INTERNAL || role === UserRole.RRHH;
};

export const getRoleLabel = (role: UserRole): string => {
  const labels = {
    [UserRole.SUPER_ADMIN]: "Super Administrador",
    [UserRole.ADMIN]: "Administrador",
    [UserRole.COLLABORATOR_INTERNAL]: "Colaborador Interno",
    [UserRole.COLLABORATOR_EXTERNAL]: "Colaborador Externo",
    [UserRole.RRHH]: "RR.HH",
  };
  return labels[role];
};

export const getStatusLabel = (status: UserStatus): string => {
  const labels = {
    [UserStatus.ACTIVE]: "Activo",
    [UserStatus.INACTIVE]: "Inactivo",
  };
  return labels[status];
};

export const getDocumentTypeLabel = (type: DocumentType): string => {
  const labels = {
    [DocumentType.DNI]: "DNI",
    [DocumentType.PASSPORT]: "Pasaporte",
    [DocumentType.CE]: "Carné de Extranjería",
  };
  return labels[type];
};

// Lista de roles disponibles para el formulario
export const availableRoles = [
  { value: UserRole.SUPER_ADMIN, label: getRoleLabel(UserRole.SUPER_ADMIN) },
  { value: UserRole.ADMIN, label: getRoleLabel(UserRole.ADMIN) },
  { value: UserRole.COLLABORATOR_EXTERNAL, label: getRoleLabel(UserRole.COLLABORATOR_EXTERNAL) },
  { value: UserRole.COLLABORATOR_INTERNAL, label: getRoleLabel(UserRole.COLLABORATOR_INTERNAL) },
  { value: UserRole.RRHH, label: getRoleLabel(UserRole.RRHH) },
];

// Lista de tipos de documento
export const documentTypes = [
  { value: DocumentType.DNI, label: getDocumentTypeLabel(DocumentType.DNI) },
  { value: DocumentType.PASSPORT, label: getDocumentTypeLabel(DocumentType.PASSPORT) },
  { value: DocumentType.CE, label: getDocumentTypeLabel(DocumentType.CE) },
];
