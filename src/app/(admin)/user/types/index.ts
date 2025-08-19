import { z } from "zod";

// Enum para roles de usuario
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

// Enum para estado del usuario
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Schema de validación para usuario
export const userSchema = z.object({
  id: z.string().optional(),
  nombres: z.string().min(2, "Los nombres deben tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  correo: z.string().email("Ingrese un correo válido"),
  rol: z.nativeEnum(UserRole, { message: "Seleccione un rol válido" }),
  estado: z.nativeEnum(UserStatus, { message: "Seleccione un estado válido" }),
  fechaCreacion: z.date().optional(),
  fechaModificacion: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;

// Schema para filtros de búsqueda
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  rol: z.nativeEnum(UserRole).optional(),
  estado: z.nativeEnum(UserStatus).optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Types para el estado del dashboard
export interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
  admins: number;
  usuarios: number;
  moderadores: number;
}

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, status: UserStatus) => void;
}

export interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  isLoading?: boolean;
}
