"use client";

import { useState, useCallback, useMemo } from "react";
import { Proyecto, SearchFilters, TipoProyecto, EstadoProyecto, TipoPago, Moneda, EntregablesPredefinidos } from "../types";

// Stats interface
interface ProyectoStats {
  total: number;
  planificacion: number;
  enProgreso: number;
  enRevision: number;
  completados: number;
  pausados: number;
  cancelados: number;
  vencidos: number;
  montoTotal: number;
}

// Mock data para desarrollo
const mockProyectos: Proyecto[] = [
  {
    id: "1",
    titulo: "Análisis del impacto de la transformación digital en las PYMES peruanas",
    tipoProyecto: TipoProyecto.TESIS,
    descripcion: "Investigación sobre cómo la transformación digital afecta a las pequeñas y medianas empresas en el Perú",
    clienteIds: ["client-1"],
    colaboradorId: "colab-1",
    fechaInicio: new Date("2024-01-15"),
    fechaFin: new Date("2024-06-15"),
    estado: EstadoProyecto.EN_PROGRESO,
    datoPago: {
      tipoPago: TipoPago.CUOTAS,
      moneda: Moneda.SOLES,
      montoTotal: 5000,
      numeroCuotas: 3,
      montoCuota: 1666.67,
    },
    entregables: [
      {
        id: "ent-1",
        nombre: "Marco Teórico",
        fechaEntrega: new Date("2024-02-15"),
        completado: true,
        esPredefinido: true,
        tipoPredefinido: EntregablesPredefinidos.MARCO_TEORICO,
      },
      {
        id: "ent-2", 
        nombre: "Metodología",
        fechaEntrega: new Date("2024-03-15"),
        completado: false,
        esPredefinido: true,
        tipoPredefinido: EntregablesPredefinidos.METODOLOGIA,
      },
    ],
    fechaCreacion: new Date("2024-01-10"),
    fechaModificacion: new Date("2024-11-01"),
    creadoPor: "admin",
  },
  {
    id: "2",
    titulo: "Sistema de gestión académica para institutos técnicos",
    tipoProyecto: TipoProyecto.CONSULTORIA,
    descripcion: "Desarrollo de un sistema web para la gestión académica completa",
    clienteIds: ["client-2"],
    colaboradorId: "colab-2",
    fechaInicio: new Date("2024-02-01"),
    fechaFin: new Date("2024-08-01"),
    estado: EstadoProyecto.PLANIFICACION,
    datoPago: {
      tipoPago: TipoPago.CONTADO,
      moneda: Moneda.DOLARES,
      montoTotal: 8000,
    },
    entregables: [
      {
        id: "ent-3",
        nombre: "Análisis de Requerimientos",
        fechaEntrega: new Date("2024-02-20"),
        completado: false,
        esPredefinido: false,
      },
    ],
    fechaCreacion: new Date("2024-01-25"),
    fechaModificacion: new Date("2024-10-15"),
    creadoPor: "admin",
  },
  {
    id: "3",
    titulo: "Optimización de procesos logísticos",
    tipoProyecto: TipoProyecto.ASESORIA,
    descripcion: "Consultoría para mejorar la eficiencia en la cadena de suministro",
    clienteIds: ["client-3"],
    colaboradorId: "colab-1",
    fechaInicio: new Date("2023-12-01"),
    fechaFin: new Date("2024-03-01"),
    estado: EstadoProyecto.COMPLETADO,
    datoPago: {
      tipoPago: TipoPago.CONTADO,
      moneda: Moneda.SOLES,
      montoTotal: 3500,
    },
    entregables: [
      {
        id: "ent-4",
        nombre: "Informe Final",
        fechaEntrega: new Date("2024-02-28"),
        completado: true,
        esPredefinido: true,
        tipoPredefinido: EntregablesPredefinidos.INFORME_FINAL,
      },
    ],
    fechaCreacion: new Date("2023-11-15"),
    fechaModificacion: new Date("2024-03-05"),
    creadoPor: "admin",
  },
];

export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>(mockProyectos);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Filtrar proyectos
  const filteredProyectos = useMemo(() => {
    return proyectos.filter((proyecto) => {
      const matchesSearch = !filters.search || 
        proyecto.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
        proyecto.descripcion.toLowerCase().includes(filters.search.toLowerCase());

      const matchesTipo = !filters.tipoProyecto || proyecto.tipoProyecto === filters.tipoProyecto;
      const matchesEstado = !filters.estado || proyecto.estado === filters.estado;
      const matchesColaborador = !filters.colaboradorId || proyecto.colaboradorId === filters.colaboradorId;

      return matchesSearch && matchesTipo && matchesEstado && matchesColaborador;
    });
  }, [proyectos, filters]);

  // Calcular estadísticas
  const stats: ProyectoStats = useMemo(() => {
    const total = proyectos.length;
    const planificacion = proyectos.filter(p => p.estado === EstadoProyecto.PLANIFICACION).length;
    const enProgreso = proyectos.filter(p => p.estado === EstadoProyecto.EN_PROGRESO).length;
    const enRevision = proyectos.filter(p => p.estado === EstadoProyecto.EN_REVISION).length;
    const completados = proyectos.filter(p => p.estado === EstadoProyecto.COMPLETADO).length;
    const pausados = proyectos.filter(p => p.estado === EstadoProyecto.PAUSADO).length;
    const cancelados = proyectos.filter(p => p.estado === EstadoProyecto.CANCELADO).length;
    const vencidos = proyectos.filter(p => 
      new Date(p.fechaFin) < new Date() && p.estado !== EstadoProyecto.COMPLETADO
    ).length;
    const montoTotal = proyectos.reduce((acc, p) => acc + p.datoPago.montoTotal, 0);

    return {
      total,
      planificacion,
      enProgreso,
      enRevision,
      completados,
      pausados,
      cancelados,
      vencidos,
      montoTotal,
    };
  }, [proyectos]);

  // Crear proyecto
  const createProyecto = useCallback(async (nuevoProyecto: Omit<Proyecto, "id" | "fechaCreacion">) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const proyecto: Proyecto = {
        ...nuevoProyecto,
        id: `proyecto-${Date.now()}`,
        fechaCreacion: new Date(),
      };
      
      setProyectos(prev => [...prev, proyecto]);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar proyecto
  const updateProyecto = useCallback(async (id: string, proyectoActualizado: Proyecto) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProyectos(prev => 
        prev.map(p => 
          p.id === id 
            ? { ...proyectoActualizado, fechaModificacion: new Date() }
            : p
        )
      );
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar proyecto
  const deleteProyecto = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProyectos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    proyectos: filteredProyectos,
    allProyectos: proyectos,
    stats,
    isLoading,
    filters,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    applyFilters,
    clearFilters,
  };
}
