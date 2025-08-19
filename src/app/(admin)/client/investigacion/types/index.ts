import { z } from "zod";

// Enums
export enum ClienteInvestigacionEstado {
  ACTIVO = "activo",
  INACTIVO = "inactivo",
}

export enum GradoAcademico {
  BACHILLER = "bachiller",
  EGRESADO = "egresado",
  MAESTRIA = "maestria",
}

// Universidades del Perú
export enum Universidad {
  UNMSM = "Universidad Nacional Mayor de San Marcos",
  UNI = "Universidad Nacional de Ingeniería",
  UNFV = "Universidad Nacional Federico Villarreal",
  UNAC = "Universidad Nacional del Callao",
  PUCP = "Pontificia Universidad Católica del Perú",
  UP = "Universidad del Pacífico",
  ULIMA = "Universidad de Lima",
  UPC = "Universidad Peruana de Ciencias Aplicadas",
  USIL = "Universidad San Ignacio de Loyola",
  UTP = "Universidad Tecnológica del Perú",
  OTRA = "Otra Universidad",
}

// Facultades comunes
export enum Facultad {
  INGENIERIA = "Ingeniería",
  MEDICINA = "Medicina",
  DERECHO = "Derecho",
  ECONOMIA = "Economía",
  ADMINISTRACION = "Administración",
  CONTABILIDAD = "Contabilidad",
  PSICOLOGIA = "Psicología",
  COMUNICACIONES = "Comunicaciones",
  EDUCACION = "Educación",
  ARQUITECTURA = "Arquitectura",
  CIENCIAS_SOCIALES = "Ciencias Sociales",
  HUMANIDADES = "Humanidades",
  OTRA = "Otra Facultad",
}

// Zod Schemas
export const ClienteInvestigacionSchema = z.object({
  id: z.string().optional(),
  nombres: z.string().min(2, "Nombres son requeridos"),
  apellidos: z.string().min(2, "Apellidos son requeridos"),
  correo: z.string().email("Email inválido"),
  telefono: z.string().min(9, "Teléfono debe tener al menos 9 dígitos"),
  universidad: z.nativeEnum(Universidad),
  facultad: z.nativeEnum(Facultad),
  carrera: z.string().min(2, "Carrera es requerida"),
  grado: z.nativeEnum(GradoAcademico),
  estado: z.nativeEnum(ClienteInvestigacionEstado),
  fechaCreacion: z.date().optional(),
  fechaActualizacion: z.date().optional(),
});

// Types
export type ClienteInvestigacion = z.infer<typeof ClienteInvestigacionSchema>;
export type ClienteInvestigacionFormData = Omit<ClienteInvestigacion, 'id' | 'fechaCreacion' | 'fechaActualizacion'>;

// Schema alias for compatibility
export const clienteInvestigacionSchema = ClienteInvestigacionSchema;

export interface ClienteInvestigacionStats {
  total: number;
  activos: number;
  inactivos: number;
  bachilleres: number;
  egresados: number;
  maestrias: number;
}

export interface SearchFilters {
  search?: string;
  estado?: ClienteInvestigacionEstado;
  universidad?: Universidad;
  grado?: GradoAcademico;
}

// Component Props Types
export interface ClienteInvestigacionFormProps {
  cliente?: ClienteInvestigacion;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cliente: Omit<ClienteInvestigacion, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clienteName: string;
  isLoading?: boolean;
}

export interface ClienteInvestigacionFiltersProps {
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export interface ClienteInvestigacionStatsCardsProps {
  stats: ClienteInvestigacionStats;
  isLoading: boolean;
}

export interface ClienteInvestigacionTableProps {
  clientes: ClienteInvestigacion[];
  isLoading: boolean;
  onEdit: (cliente: ClienteInvestigacion) => void;
  onDelete: (cliente: ClienteInvestigacion) => void;
}
