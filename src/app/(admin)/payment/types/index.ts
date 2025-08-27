import { z } from "zod";

// Enum para estados de pago de cuotas
export enum EstadoPagoCuota {
  PENDIENTE = "pendiente",
  MARCADO_PAGADO = "marcado_pagado", // Colaborador marcó como pagado
  VALIDADO = "validado", // Admin validó el pago
  RECHAZADO = "rechazado", // Admin rechazó el pago
  VENCIDO = "vencido", // Cuota vencida sin pagar
}

// Enum para tipos de pago del proyecto
export enum TipoPagoProyecto {
  CONTADO = "contado",
  CUOTAS = "cuotas",
}

// Enum para monedas
export enum MonedaPago {
  SOLES = "PEN",
  DOLARES = "USD",
}

// Schema para cuota individual
export const cuotaPagoSchema = z.object({
  id: z.string(),
  numero: z.number(),
  monto: z.number(),
  fechaVencimiento: z.date(),
  fechaPago: z.date().optional(),
  estadoPago: z.nativeEnum(EstadoPagoCuota),
  comprobantePago: z.string().optional(), // URL del comprobante
  observaciones: z.string().optional(),
  marcadoPorColaborador: z.string().optional(), // ID del colaborador
  validadoPorAdmin: z.string().optional(), // ID del admin
  fechaValidacion: z.date().optional(),
});

// Schema para información de pago del proyecto
export const infoPagoProyectoSchema = z.object({
  proyectoId: z.string(),
  tituloProyecto: z.string(),
  tipoProyecto: z.string(),
  colaboradorId: z.string(),
  colaboradorNombre: z.string(),
  clienteIds: z.array(z.string()),
  clienteNombres: z.array(z.string()),
  
  // Información del pago
  tipoPago: z.nativeEnum(TipoPagoProyecto),
  moneda: z.nativeEnum(MonedaPago),
  montoTotal: z.number(),
  
  // Cuotas (si es pago en cuotas)
  cuotas: z.array(cuotaPagoSchema).optional(),
  
  // Estados generales
  fechaInicio: z.date(),
  fechaFin: z.date(),
  estadoProyecto: z.string(),
  
  // Estadísticas calculadas
  totalPagado: z.number(),
  totalPendiente: z.number(),
  cuotasVencidas: z.number(),
  cuotasPendientesValidacion: z.number(),
});

// Types inferidos
export type CuotaPago = z.infer<typeof cuotaPagoSchema>;
export type InfoPagoProyecto = z.infer<typeof infoPagoProyectoSchema>;

// Schema para estadísticas del dashboard
export const estadisticasPagoSchema = z.object({
  totalProyectos: z.number(),
  totalMontoGeneral: z.number(),
  totalPagado: z.number(),
  totalPendiente: z.number(),
  
  // Por estado
  proyectosAlContado: z.number(),
  proyectosEnCuotas: z.number(),
  
  // Cuotas
  totalCuotas: z.number(),
  cuotasPagadas: z.number(),
  cuotasPendientes: z.number(),
  cuotasVencidas: z.number(),
  cuotasPendientesValidacion: z.number(),
  
  // Últimas actualizaciones
  ultimosPagos: z.array(z.object({
    proyectoTitulo: z.string(),
    colaborador: z.string(),
    monto: z.number(),
    fecha: z.date(),
    moneda: z.nativeEnum(MonedaPago),
  })),
});

export type EstadisticasPago = z.infer<typeof estadisticasPagoSchema>;

// Schema para filtros de búsqueda
export const filtrosPagoSchema = z.object({
  busqueda: z.string().optional(),
  tipoPago: z.nativeEnum(TipoPagoProyecto).optional(),
  estadoPago: z.nativeEnum(EstadoPagoCuota).optional(),
  colaboradorId: z.string().optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  moneda: z.nativeEnum(MonedaPago).optional(),
  soloVencidos: z.boolean().optional(),
  soloPendientesValidacion: z.boolean().optional(),
});

export type FiltrosPago = z.infer<typeof filtrosPagoSchema>;

// Labels para los enums
export const estadoPagoCuotaLabels: Record<EstadoPagoCuota, string> = {
  [EstadoPagoCuota.PENDIENTE]: "Pendiente",
  [EstadoPagoCuota.MARCADO_PAGADO]: "Marcado como Pagado",
  [EstadoPagoCuota.VALIDADO]: "Validado",
  [EstadoPagoCuota.RECHAZADO]: "Rechazado",
  [EstadoPagoCuota.VENCIDO]: "Vencido",
};

export const tipoPagoProyectoLabels: Record<TipoPagoProyecto, string> = {
  [TipoPagoProyecto.CONTADO]: "Al Contado",
  [TipoPagoProyecto.CUOTAS]: "En Cuotas",
};
