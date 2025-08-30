"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  PauseCircle,
  DollarSign,
  TrendingUp 
} from "lucide-react";
import { Proyecto, EstadoProyecto } from "../types";

interface ProyectoStatsProps {
  proyectos: Proyecto[];
}

export function ProyectoStats({ proyectos }: ProyectoStatsProps) {
  const totalProyectos = proyectos.length;
  const proyectosCompletados = proyectos.filter(p => p.estado === EstadoProyecto.COMPLETADO).length;
  const proyectosEnProgreso = proyectos.filter(p => p.estado === EstadoProyecto.EN_PROGRESO).length;
  const proyectosPausados = proyectos.filter(p => p.estado === EstadoProyecto.PAUSADO).length;

  const progresoPromedio = proyectos.length > 0 
    ? Math.round(proyectos.reduce((acc, p) => acc + p.progreso, 0) / proyectos.length)
    : 0;

  const montoTotal = proyectos.reduce((acc, p) => {
    if (!p.monto) return acc;
    // Convertir todo a dólares para simplicidad (asumiendo 1 USD = 3.8 PEN)
    const montoEnUSD = p.moneda === "USD" ? p.monto : p.monto / 3.8;
    return acc + montoEnUSD;
  }, 0);

  const stats = [
    {
      title: "Total Proyectos",
      value: totalProyectos.toString(),
      description: "Proyectos asignados",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Completados",
      value: proyectosCompletados.toString(),
      description: `${totalProyectos > 0 ? Math.round((proyectosCompletados / totalProyectos) * 100) : 0}% del total`,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50",
    },
    {
      title: "En Progreso",
      value: proyectosEnProgreso.toString(),
      description: "Proyectos activos",
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
    },
    {
      title: "Pausados",
      value: proyectosPausados.toString(),
      description: "Requieren atención",
      icon: PauseCircle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
    },
    {
      title: "Progreso Promedio",
      value: `${progresoPromedio}%`,
      description: "Avance general",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Valor Total",
      value: `$${Math.round(montoTotal).toLocaleString()}`,
      description: "USD estimado",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
