import { z } from "zod";

// Enum para tipos de proyecto
export enum TipoProyecto {
  TESIS = "tesis",
  ARTICULO = "articulo",
  TRABAJO_SUFICIENCIA = "trabajo_suficiencia",
  INVESTIGACION = "investigacion",
  CONSULTORIA = "consultoria",
  ASESORIA = "asesoria",
  OTRO = "otro",
}

// Enum para estado del proyecto
export enum EstadoProyecto {
  PLANIFICACION = "planificacion",
  EN_PROGRESO = "en_progreso",
  EN_REVISION = "en_revision",
  COMPLETADO = "completado",
  PAUSADO = "pausado",
  CANCELADO = "cancelado",
}

// Enum para tipo de pago
export enum TipoPago {
  CONTADO = "contado",
  CUOTAS = "cuotas",
}

// Enum para moneda
export enum Moneda {
  SOLES = "PEN",
  DOLARES = "USD",
}

// Enum para tipo de colaborador
export enum TipoColaborador {
  INTERNO = "interno",
  EXTERNO = "externo",
}

// Enum para entregables predefinidos
export enum EntregablesPredefinidos {
  MARCO_TEORICO = "marco_teorico",
  METODOLOGIA = "metodologia",
  ANALISIS_DATOS = "analisis_datos",
  RESULTADOS = "resultados",
  CONCLUSIONES = "conclusiones",
  BIBLIOGRAFIA = "bibliografia",
  ANEXOS = "anexos",
  PRESENTACION = "presentacion",
  INFORME_FINAL = "informe_final",
  ARTICULO_CIENTIFICO = "articulo_cientifico",
  MANUAL_USUARIO = "manual_usuario",
  CODIGO_FUENTE = "codigo_fuente",
}

// Schema para datos de pago
export const pagoSchema = z.object({
  tipoPago: z.nativeEnum(TipoPago, { message: "Seleccione un tipo de pago" }),
  moneda: z.nativeEnum(Moneda, { message: "Seleccione una moneda" }),
  montoTotal: z.number().min(0.01, "El monto debe ser mayor a 0"),
  numeroCuotas: z.number().min(1).max(12).optional(),
  montoCuota: z.number().min(0.01).optional(),
  fechasPago: z.array(z.date()).optional(),
});

// Schema para entregables
export const entregableSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  fechaEntrega: z.date(),
  completado: z.boolean().default(false),
  esPredefinido: z.boolean().default(false),
  tipoPredefinido: z.nativeEnum(EntregablesPredefinidos).optional(),
});

// Schema principal del proyecto
export const proyectoSchema = z.object({
  id: z.string().optional(),
  
  // Paso 1: Información básica
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  tipoProyecto: z.nativeEnum(TipoProyecto, { message: "Seleccione un tipo de proyecto" }),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  clienteIds: z.array(z.string()).min(1, "Debe seleccionar al menos un cliente"),
  colaboradorId: z.string().min(1, "Debe seleccionar un colaborador"),
  pagoColaborador: z.number().min(0).optional(), // Pago al colaborador externo
  fechaInicio: z.date({ message: "Seleccione una fecha de inicio" }),
  fechaFin: z.date({ message: "Seleccione una fecha de finalización" }),
  estado: z.nativeEnum(EstadoProyecto, { message: "Seleccione un estado" }),
  
  // Paso 2: Información de pago
  datoPago: pagoSchema,
  
  // Paso 3: Entregables
  entregables: z.array(entregableSchema).min(1, "Debe agregar al menos un entregable"),
  
  // Metadatos
  fechaCreacion: z.date().optional(),
  fechaModificacion: z.date().optional(),
  creadoPor: z.string().optional(),
}).refine((data) => {
  return data.fechaFin > data.fechaInicio;
}, {
  message: "La fecha de finalización debe ser posterior a la fecha de inicio",
  path: ["fechaFin"],
}).refine((data) => {
  // Validar cuotas si el tipo de pago es cuotas
  if (data.datoPago.tipoPago === TipoPago.CUOTAS) {
    return data.datoPago.numeroCuotas && data.datoPago.montoCuota;
  }
  return true;
}, {
  message: "Debe especificar el número de cuotas y monto por cuota",
  path: ["datoPago"],
});

export type Proyecto = z.infer<typeof proyectoSchema>;
export type Pago = z.infer<typeof pagoSchema>;
export type Entregable = z.infer<typeof entregableSchema>;

// Schema para filtros de búsqueda
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  tipoProyecto: z.nativeEnum(TipoProyecto).optional(),
  estado: z.nativeEnum(EstadoProyecto).optional(),
  colaboradorId: z.string().optional(),
  fechaInicio: z.date().optional(),
  fechaFin: z.date().optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Types para el estado del dashboard
export interface ProyectoStats {
  total: number;
  planificacion: number;
  enProgreso: number;
  enRevision: number;
  completados: number;
  pausados: number;
  cancelados: number;
  montoTotalProyectos: number;
  proyectosVencidos: number;
}

// Types para las opciones de formulario
export interface ClienteOption {
  id: string;
  label: string;
  ruc?: string;
  tipo: 'contable' | 'investigacion';
}

export interface ColaboradorOption {
  id: string;
  label: string;
  especialidad?: string;
  tipo: TipoColaborador;
}

// Labels para los enums
export const tipoProyectoLabels: Record<TipoProyecto, string> = {
  [TipoProyecto.TESIS]: "Tesis",
  [TipoProyecto.ARTICULO]: "Artículo Científico",
  [TipoProyecto.TRABAJO_SUFICIENCIA]: "Trabajo de Suficiencia Profesional",
  [TipoProyecto.INVESTIGACION]: "Investigación",
  [TipoProyecto.CONSULTORIA]: "Consultoría",
  [TipoProyecto.ASESORIA]: "Asesoría",
  [TipoProyecto.OTRO]: "Otro",
};

export const estadoProyectoLabels: Record<EstadoProyecto, string> = {
  [EstadoProyecto.PLANIFICACION]: "Planificación",
  [EstadoProyecto.EN_PROGRESO]: "En Progreso",
  [EstadoProyecto.EN_REVISION]: "En Revisión",
  [EstadoProyecto.COMPLETADO]: "Completado",
  [EstadoProyecto.PAUSADO]: "Pausado",
  [EstadoProyecto.CANCELADO]: "Cancelado",
};

export const entregablesLabels: Record<EntregablesPredefinidos, string> = {
  [EntregablesPredefinidos.MARCO_TEORICO]: "Marco Teórico",
  [EntregablesPredefinidos.METODOLOGIA]: "Metodología",
  [EntregablesPredefinidos.ANALISIS_DATOS]: "Análisis de Datos",
  [EntregablesPredefinidos.RESULTADOS]: "Resultados",
  [EntregablesPredefinidos.CONCLUSIONES]: "Conclusiones",
  [EntregablesPredefinidos.BIBLIOGRAFIA]: "Bibliografía",
  [EntregablesPredefinidos.ANEXOS]: "Anexos",
  [EntregablesPredefinidos.PRESENTACION]: "Presentación",
  [EntregablesPredefinidos.INFORME_FINAL]: "Informe Final",
  [EntregablesPredefinidos.ARTICULO_CIENTIFICO]: "Artículo Científico",
  [EntregablesPredefinidos.MANUAL_USUARIO]: "Manual de Usuario",
  [EntregablesPredefinidos.CODIGO_FUENTE]: "Código Fuente",
};

// Schema de validación separado para el formulario
export const proyectoFormSchema = z.object({
  // Paso 1: Información básica
  titulo: z.string().min(1, "El título es requerido"),
  tipoProyecto: z.nativeEnum(TipoProyecto).optional(),
  descripcion: z.string().optional(),
  clienteIds: z.array(z.string()).min(1, "Debe seleccionar al menos un cliente"),
  colaboradorId: z.string().min(1, "Debe seleccionar un colaborador"),
  pagoColaborador: z.string().optional(), // Como string para el formulario
  fechaInicio: z.date().optional(),
  fechaFin: z.date().optional(),
  estado: z.nativeEnum(EstadoProyecto).optional(),
  
  // Paso 2: Información de pago
  tipoPago: z.nativeEnum(TipoPago).optional(),
  moneda: z.nativeEnum(Moneda).optional(),
  montoTotal: z.string().optional(),
  numeroCuotas: z.string().optional(),
  montoCuota: z.string().optional(),
  
  // Paso 3: Entregables
  entregables: z.array(z.object({
    id: z.string().optional(),
    nombre: z.string(),
    descripcion: z.string().optional(),
    fechaEntrega: z.date(),
    completado: z.boolean().optional(),
    esPredefinido: z.boolean().optional(),
    tipoPredefinido: z.nativeEnum(EntregablesPredefinidos).optional(),
  })),
});

export type ProyectoFormData = z.infer<typeof proyectoFormSchema>;
