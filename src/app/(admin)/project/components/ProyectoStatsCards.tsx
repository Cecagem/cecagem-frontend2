"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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

  const statsData = [
    {
      title: "Total Proyectos",
      value: stats.total,
      icon: FolderOpen,
      subtitle: `${stats.completados} completados`,
    },
    {
      title: "En Progreso",
      value: stats.enProgreso,
      icon: Clock,
      subtitle: `${Math.round((stats.enProgreso / (stats.total || 1)) * 100)}% del total`,
    },
    {
      title: "Completados",
      value: stats.completados,
      icon: CheckCircle2,
      subtitle: "Proyectos finalizados",
    },
    {
      title: "Vencidos",
      value: stats.vencidos,
      icon: AlertCircle,
      subtitle: "Requieren atención",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="transition-all hover:shadow-sm">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className="p-2 rounded-md bg-muted/50">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
