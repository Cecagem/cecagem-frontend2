import {
  Proyecto,
  TipoProyecto,
  EstadoProyecto,
  TipoPago,
  Moneda,
  Cliente,
  Colaborador,
  Entregable,
} from "../types";

// Datos de prueba para colaboradores
const colaboradores: Colaborador[] = [
  {
    id: "1",
    nombre: "Ana García",
    email: "ana.garcia@cecagem.com",
    rol: "Investigadora Senior",
    avatar: "AG",
  },
  {
    id: "2",
    nombre: "Carlos Mendoza",
    email: "carlos.mendoza@cecagem.com",
    rol: "Contador",
    avatar: "CM",
  },
  {
    id: "3",
    nombre: "María Rodriguez",
    email: "maria.rodriguez@cecagem.com",
    rol: "Consultora",
    avatar: "MR",
  },
];

// Datos de prueba para clientes
const clientes: Cliente[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@empresa1.com",
    empresa: "Empresa ABC",
  },
  {
    id: "2",
    nombre: "Laura Martínez",
    email: "laura.martinez@empresa2.com",
    empresa: "Corporación XYZ",
  },
  {
    id: "3",
    nombre: "Roberto Silva",
    email: "roberto.silva@startup.com",
    empresa: "StartUp Innovadora",
  },
  {
    id: "4",
    nombre: "Carmen López",
    email: "carmen.lopez@tradicional.com",
    empresa: "Empresa Tradicional",
  },
];

// Datos de prueba para entregables
const entregablesSample: Entregable[] = [
  {
    id: "1",
    nombre: "Marco Teórico",
    descripcion: "Desarrollo del marco teórico de la investigación",
    fechaEntrega: new Date("2024-02-15"),
    estado: "COMPLETADO",
  },
  {
    id: "2",
    nombre: "Metodología",
    descripcion: "Diseño metodológico del proyecto",
    fechaEntrega: new Date("2024-03-01"),
    estado: "EN_REVISION",
  },
  {
    id: "3",
    nombre: "Análisis de Datos",
    descripcion: "Análisis estadístico de los datos recopilados",
    fechaEntrega: new Date("2024-03-20"),
    estado: "EN_PROGRESO",
  },
  {
    id: "4",
    nombre: "Estados Financieros",
    descripcion: "Preparación de estados financieros auditados",
    fechaEntrega: new Date("2024-02-28"),
    estado: "COMPLETADO",
  },
  {
    id: "5",
    nombre: "Informe de Consultoría",
    descripcion: "Documento final con recomendaciones",
    fechaEntrega: new Date("2024-04-15"),
    estado: "PENDIENTE",
  },
  {
    id: "6",
    nombre: "Presentación Ejecutiva",
    descripcion: "Presentación de resultados para stakeholders",
    fechaEntrega: new Date("2024-03-10"),
    estado: "EN_PROGRESO",
  },
  {
    id: "7",
    nombre: "Manual de Usuario",
    descripcion: "Documentación técnica del sistema desarrollado",
    fechaEntrega: new Date("2024-04-01"),
    estado: "PENDIENTE",
  },
  {
    id: "8",
    nombre: "Capacitación Personal",
    descripcion: "Sesiones de capacitación al equipo del cliente",
    fechaEntrega: new Date("2024-04-20"),
    estado: "PENDIENTE",
  },
];

// Datos de prueba para proyectos
const proyectosMock: Proyecto[] = [
  {
    id: "1",
    titulo: "Análisis de Mercado Tecnológico 2024",
    tipo: TipoProyecto.INVESTIGACION,
    estado: EstadoProyecto.EN_PROGRESO,
    fechaInicio: new Date("2024-01-15"),
    fechaFinTentativa: new Date("2024-04-30"),
    descripcion:
      "Investigación exhaustiva del mercado tecnológico peruano con enfoque en startups y empresas emergentes.",
    clientes: [clientes[0], clientes[1]],
    colaboradorAsignado: colaboradores[0],
    tipoPago: TipoPago.CUOTAS,
    moneda: Moneda.DOLARES,
    monto: 15000,
    entregables: [entregablesSample[0], entregablesSample[1], entregablesSample[2], entregablesSample[5]],
    progreso: 65,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "2",
    titulo: "Auditoría Financiera Anual",
    tipo: TipoProyecto.CONTABLE,
    estado: EstadoProyecto.REVISION,
    fechaInicio: new Date("2024-02-01"),
    fechaFinTentativa: new Date("2024-03-15"),
    descripcion:
      "Auditoría completa de los estados financieros del ejercicio 2023 según normas internacionales.",
    clientes: [clientes[2]],
    colaboradorAsignado: colaboradores[1],
    tipoPago: TipoPago.CONTADO,
    moneda: Moneda.SOLES,
    monto: 25000,
    entregables: [entregablesSample[3]],
    progreso: 90,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    id: "3",
    titulo: "Consultoría Estratégica Digital",
    tipo: TipoProyecto.CONSULTORIA,
    estado: EstadoProyecto.PLANIFICACION,
    fechaInicio: new Date("2024-03-01"),
    fechaFinTentativa: new Date("2024-06-30"),
    descripcion:
      "Desarrollo de estrategia digital integral para transformación empresarial y optimización de procesos.",
    clientes: [clientes[3], clientes[0], clientes[1]],
    colaboradorAsignado: colaboradores[2],
    tipoPago: TipoPago.CUOTAS,
    moneda: Moneda.DOLARES,
    monto: 30000,
    entregables: [entregablesSample[4]],
    progreso: 15,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-28"),
  },
  {
    id: "4",
    titulo: "Estudio de Factibilidad Económica",
    tipo: TipoProyecto.INVESTIGACION,
    estado: EstadoProyecto.COMPLETADO,
    fechaInicio: new Date("2023-11-01"),
    fechaFinTentativa: new Date("2024-01-31"),
    descripcion:
      "Análisis de viabilidad económica para nuevo proyecto de inversión en el sector manufacturero.",
    clientes: [clientes[2]],
    colaboradorAsignado: colaboradores[0],
    tipoPago: TipoPago.CONTADO,
    moneda: Moneda.SOLES,
    monto: 18000,
    entregables: [entregablesSample[0], entregablesSample[2]],
    progreso: 100,
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    titulo: "Implementación Sistema Contable",
    tipo: TipoProyecto.DESARROLLO,
    estado: EstadoProyecto.EN_PROGRESO,
    fechaInicio: new Date("2024-02-10"),
    fechaFinTentativa: new Date("2024-05-15"),
    descripcion:
      "Desarrollo e implementación de sistema contable personalizado con integración ERP.",
    clientes: [clientes[1]],
    colaboradorAsignado: colaboradores[1],
    tipoPago: TipoPago.CUOTAS,
    moneda: Moneda.DOLARES,
    monto: 45000,
    entregables: [entregablesSample[1], entregablesSample[3], entregablesSample[6], entregablesSample[7]],
    progreso: 40,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-02-28"),
  },
  {
    id: "6",
    titulo: "Asesoría Tributaria Especializada",
    tipo: TipoProyecto.CONTABLE,
    estado: EstadoProyecto.PAUSADO,
    fechaInicio: new Date("2024-01-20"),
    fechaFinTentativa: new Date("2024-04-20"),
    descripcion:
      "Asesoramiento especializado en normativa tributaria y optimización fiscal para empresa multinacional.",
    clientes: [clientes[3]],
    colaboradorAsignado: colaboradores[1],
    tipoPago: TipoPago.CUOTAS,
    moneda: Moneda.SOLES,
    monto: 20000,
    entregables: [entregablesSample[2], entregablesSample[4]],
    progreso: 25,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-10"),
  },
];

export class ProyectosService {
  // Simular delay de API
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async obtenerMisProyectos(): Promise<Proyecto[]> {
    await this.delay(800);
    return proyectosMock;
  }

  async obtenerProyectoPorId(id: string): Promise<Proyecto | null> {
    await this.delay(500);
    return proyectosMock.find((p) => p.id === id) || null;
  }

  async buscarProyectos(busqueda: string): Promise<Proyecto[]> {
    await this.delay(300);
    const termino = busqueda.toLowerCase();
    return proyectosMock.filter(
      (proyecto) =>
        proyecto.titulo.toLowerCase().includes(termino) ||
        proyecto.descripcion.toLowerCase().includes(termino) ||
        proyecto.colaboradorAsignado.nombre.toLowerCase().includes(termino) ||
        proyecto.clientes.some((cliente) =>
          cliente.nombre.toLowerCase().includes(termino)
        )
    );
  }

  async filtrarProyectos(filtros: {
    tipo?: TipoProyecto;
    estado?: EstadoProyecto;
  }): Promise<Proyecto[]> {
    await this.delay(400);
    return proyectosMock.filter((proyecto) => {
      if (filtros.tipo && proyecto.tipo !== filtros.tipo) return false;
      if (filtros.estado && proyecto.estado !== filtros.estado) return false;
      return true;
    });
  }
}

export const proyectosService = new ProyectosService();
