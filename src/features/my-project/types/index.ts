export enum TipoProyecto {
  INVESTIGACION = "INVESTIGACION",
  CONTABLE = "CONTABLE",
  CONSULTORIA = "CONSULTORIA",
  DESARROLLO = "DESARROLLO",
}

export enum EstadoProyecto {
  PLANIFICACION = "PLANIFICACION",
  EN_PROGRESO = "EN_PROGRESO",
  REVISION = "REVISION",
  COMPLETADO = "COMPLETADO",
  PAUSADO = "PAUSADO",
  CANCELADO = "CANCELADO",
}

export enum TipoPago {
  CONTADO = "CONTADO",
  CUOTAS = "CUOTAS",
}

export enum Moneda {
  DOLARES = "USD",
  SOLES = "PEN",
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  empresa?: string;
}

export interface Colaborador {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string;
}

export interface Entregable {
  id: string;
  nombre: string;
  descripcion: string;
  fechaEntrega: Date;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADO" | "EN_REVISION";
}

export interface Proyecto {
  id: string;
  titulo: string;
  tipo: TipoProyecto;
  estado: EstadoProyecto;
  fechaInicio: Date;
  fechaFinTentativa: Date;
  descripcion: string;
  clientes: Cliente[]; // máximo 3
  colaboradorAsignado: Colaborador;
  tipoPago: TipoPago;
  moneda: Moneda;
  monto?: number;
  entregables: Entregable[];
  progreso: number; // porcentaje 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface ProyectoFilters {
  busqueda: string;
  tipo?: TipoProyecto;
  estado?: EstadoProyecto;
  fechaInicio?: Date;
  fechaFin?: Date;
}
