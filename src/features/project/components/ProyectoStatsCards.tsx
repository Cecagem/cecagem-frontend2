"use client";

import { FolderOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard, StatsGrid } from "@/components/shared/stats-cards";
import { Proyecto, EstadoProyecto } from "../types";

interface ProyectoStatsCardsProps {
  proyectos: Proyecto[];
  isLoading?: boolean;
}

export function ProyectoStatsCards({ proyectos, isLoading = false }: ProyectoStatsCardsProps) {
  const stats = {
    total: proyectos.length,
    planificacion: proyectos.filter(p => p.estado === EstadoProyecto.PLANIFICACION).length,
    enProgreso: proyectos.filter(p => p.estado === EstadoProyecto.EN_PROGRESO).length,
    enRevision: proyectos.filter(p => p.estado === EstadoProyecto.EN_REVISION).length,
    completados: proyectos.filter(p => p.estado === EstadoProyecto.COMPLETADO).length,
    pausados: proyectos.filter(p => p.estado === EstadoProyecto.PAUSADO).length,
    cancelados: proyectos.filter(p => p.estado === EstadoProyecto.CANCELADO).length,
    montoTotal: proyectos.reduce((acc, p) => acc + p.datoPago.montoTotal, 0),
    vencidos: proyectos.filter(p => new Date(p.fechaFin) < new Date() && p.estado !== EstadoProyecto.COMPLETADO).length,
  };

  return (
    <StatsGrid columns={4}>
      <StatCard
        title="Total Proyectos"
        value={stats.total}
        icon={FolderOpen}
        subtitle={`${stats.completados} completados`}
        loading={isLoading}
      />
      <StatCard
        title="En Progreso"
        value={stats.enProgreso}
        icon={Clock}
        subtitle={`${Math.round((stats.enProgreso / (stats.total || 1)) * 100)}% del total`}
        variant="default"
        loading={isLoading}
      />
      <StatCard
        title="Completados"
        value={stats.completados}
        icon={CheckCircle2}
        subtitle="Proyectos finalizados"
        variant="success"
        loading={isLoading}
      />
      <StatCard
        title="Vencidos"
        value={stats.vencidos}
        icon={AlertCircle}
        subtitle="Requieren atención"
        variant={stats.vencidos > 0 ? "error" : "default"}
        loading={isLoading}
      />
    </StatsGrid>
  );
}
