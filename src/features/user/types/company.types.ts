import { z } from "zod";

// Enums
export enum CompanyEstado {
  ACTIVA = "ACTIVA",
  INACTIVA = "INACTIVA",
}

// Schema de validación
export const CompanySchema = z.object({
  id: z.string(),
  ruc: z
    .string()
    .min(11, "RUC debe tener 11 dígitos")
    .max(11, "RUC debe tener 11 dígitos"),
  razonSocial: z.string().min(1, "Razón social es requerida"),
  nombreComercial: z.string().optional(),
  direccion: z.string().min(1, "Dirección es requerida"),
  nombreContacto: z.string().min(1, "Nombre de contacto es requerido"),
  telefono: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  email: z.string().email("Email debe ser válido"),
  estado: z.nativeEnum(CompanyEstado),
  fechaCreacion: z.date().optional(),
  fechaActualizacion: z.date().optional(),
});

// Types
export type Company = z.infer<typeof CompanySchema>;

export interface CompanyStats {
  total: number;
  activas: number;
  inactivas: number;
  nuevasEsteMes: number;
}

export interface CompanyFilters extends Record<string, unknown> {
  search?: string;
  estado?: CompanyEstado;
}

// props interfaces
export interface CompanyFormProps {
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: Omit<Company, "id">) => Promise<void>;
  isLoading?: boolean;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  isLoading?: boolean;
}

export interface CompanyFiltersProps {
  filters: CompanyFilters;
  onApplyFilters: (filters: CompanyFilters) => void;
  onClearFilters: () => void;
}

export interface CompanyStatsCardsProps {
  stats: CompanyStats;
  isLoading: boolean;
}

export interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

// helpers
export const getEstadoLabel = (estado: CompanyEstado): string => {
  const labels = {
    [CompanyEstado.ACTIVA]: "Activa",
    [CompanyEstado.INACTIVA]: "Inactiva",
  };
  return labels[estado];
};

export const getEstadoColor = (estado: CompanyEstado): string => {
  const colors = {
    [CompanyEstado.ACTIVA]: "bg-green-100 text-green-800",
    [CompanyEstado.INACTIVA]: "bg-red-100 text-red-800",
  };
  return colors[estado];
};
