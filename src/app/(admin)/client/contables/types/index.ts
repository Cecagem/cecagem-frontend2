import { z } from "zod";

// Enums
export enum ClienteEstado {
  ACTIVO = "activo",
  INACTIVO = "inactivo",
}

// Zod Schemas
export const ClienteContableSchema = z.object({
  id: z.string().optional(),
  ruc: z.string().min(11, "RUC debe tener 11 dígitos").max(11, "RUC debe tener 11 dígitos"),
  razonSocial: z.string().min(2, "Razón social es requerida"),
  nombreComercial: z.string().min(2, "Nombre comercial es requerido"),
  direccion: z.string().min(5, "Dirección es requerida"),
  nombreContacto: z.string().min(2, "Nombre de contacto es requerido"),
  telefono: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  email: z.string().email("Email inválido"),
  estado: z.nativeEnum(ClienteEstado),
  fechaCreacion: z.date().optional(),
  fechaActualizacion: z.date().optional(),
});

// Types
export type ClienteContable = z.infer<typeof ClienteContableSchema>;

export interface ClienteContableStats {
  total: number;
  activos: number;
  inactivos: number;
  nuevosEsteMes: number;
}

export interface SearchFilters {
  search?: string;
  estado?: ClienteEstado;
}

// Component Props Types
export interface ClienteContableFormProps {
  cliente?: ClienteContable;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cliente: Omit<ClienteContable, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clienteName: string;
  isLoading?: boolean;
}

export interface ClienteFiltersProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export interface ClienteStatsCardsProps {
  stats: ClienteContableStats;
  isLoading: boolean;
}

export interface ClienteTableProps {
  clientes: ClienteContable[];
  isLoading: boolean;
  onEdit: (cliente: ClienteContable) => void;
  onDelete: (cliente: ClienteContable) => void;
}
