import { z } from "zod";

// Enums
export enum UserRol {
  ADMINISTRADOR = "administrador",
  RRHH = "rrhh",
  COLABORADOR_INTERNO = "colaborador_interno",
  COLABORADOR_EXTERNO = "colaborador_externo",
}

export enum UserEstado {
  ACTIVO = "activo",
  INACTIVO = "inactivo",
}

// Zod Schemas
export const UserContractSchema = z.object({
  montoPago: z.number().min(0, "El monto debe ser mayor a 0"),
  fechaContrato: z.date(),
});

export const UserBaseSchema = z.object({
  id: z.string().optional(),
  nombres: z.string().min(2, "Nombres son requeridos"),
  apellidos: z.string().min(2, "Apellidos son requeridos"),
  telefono: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  email: z.string().email("Email inválido"),
  rol: z.nativeEnum(UserRol),
  estado: z.nativeEnum(UserEstado),
  fechaCreacion: z.date().optional(),
  fechaActualizacion: z.date().optional(),
});

export const UserSchema = UserBaseSchema.extend({
  contrato: UserContractSchema.optional(),
}).refine((data) => {
  // Si el rol no es Administrador ni Colaborador Externo, el contrato es requerido
  if (data.rol !== UserRol.ADMINISTRADOR && data.rol !== UserRol.COLABORADOR_EXTERNO) {
    return data.contrato !== undefined;
  }
  return true;
}, {
  message: "Los datos de contrato son requeridos para este rol",
  path: ["contrato"],
});

// Types
export type User = z.infer<typeof UserSchema>;
export type UserContract = z.infer<typeof UserContractSchema>;

export interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
  nuevosEsteMes: number;
  porRol: {
    administradores: number;
    rrhh: number;
    colaboradoresInternos: number;
    colaboradoresExternos: number;
  };
}

export interface SearchFilters extends Record<string, unknown> {
  search?: string;
  estado?: UserEstado;
  rol?: UserRol;
}

// Component Props Types
export interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'>) => Promise<void>;
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
export const requiresContract = (rol: UserRol): boolean => {
  return rol !== UserRol.ADMINISTRADOR && rol !== UserRol.COLABORADOR_EXTERNO;
};

export const getRolLabel = (rol: UserRol): string => {
  const labels = {
    [UserRol.ADMINISTRADOR]: "Administrador",
    [UserRol.RRHH]: "RR.HH",
    [UserRol.COLABORADOR_INTERNO]: "Colaborador Interno",
    [UserRol.COLABORADOR_EXTERNO]: "Colaborador Externo",
  };
  return labels[rol];
};

export const getEstadoLabel = (estado: UserEstado): string => {
  const labels = {
    [UserEstado.ACTIVO]: "Activo",
    [UserEstado.INACTIVO]: "Inactivo",
  };
  return labels[estado];
};
