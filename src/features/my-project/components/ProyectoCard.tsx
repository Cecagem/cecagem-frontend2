"use client";

import { Calendar, Users, DollarSign, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Proyecto, TipoProyecto, EstadoProyecto, Moneda } from "../types";

interface ProyectoCardProps {
  proyecto: Proyecto;
  onViewDetails: (id: string) => void;
}

const tipoProyectoLabels = {
  [TipoProyecto.INVESTIGACION]: "Investigación",
  [TipoProyecto.CONTABLE]: "Contable",
  [TipoProyecto.CONSULTORIA]: "Consultoría",
  [TipoProyecto.DESARROLLO]: "Desarrollo",
};

const estadoProyectoLabels = {
  [EstadoProyecto.PLANIFICACION]: "Planificación",
  [EstadoProyecto.EN_PROGRESO]: "En Progreso",
  [EstadoProyecto.REVISION]: "Revisión",
  [EstadoProyecto.COMPLETADO]: "Completado",
  [EstadoProyecto.PAUSADO]: "Pausado",
  [EstadoProyecto.CANCELADO]: "Cancelado",
};

const estadoProyectoColors = {
  [EstadoProyecto.PLANIFICACION]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [EstadoProyecto.EN_PROGRESO]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  [EstadoProyecto.REVISION]: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  [EstadoProyecto.COMPLETADO]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  [EstadoProyecto.PAUSADO]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  [EstadoProyecto.CANCELADO]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const tipoProyectoColors = {
  [TipoProyecto.INVESTIGACION]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  [TipoProyecto.CONTABLE]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [TipoProyecto.CONSULTORIA]: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
  [TipoProyecto.DESARROLLO]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export function ProyectoCard({ proyecto, onViewDetails }: ProyectoCardProps) {
  const formatFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(fecha);
  };

  const formatMoneda = (amount: number, moneda: Moneda) => {
    const symbol = moneda === Moneda.DOLARES ? "$" : "S/";
    
    return `${symbol} ${new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const diasRestantes = Math.ceil(
    (proyecto.fechaFinTentativa.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 cursor-pointer" 
          onClick={() => onViewDetails(proyecto.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {proyecto.titulo}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {proyecto.descripcion}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(proyecto.id);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={tipoProyectoColors[proyecto.tipo]}>
            {tipoProyectoLabels[proyecto.tipo]}
          </Badge>
          <Badge className={estadoProyectoColors[proyecto.estado]}>
            {estadoProyectoLabels[proyecto.estado]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{proyecto.progreso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${proyecto.progreso}%` }}
            />
          </div>
        </div>

        {/* Fechas */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Inicio: {formatFecha(proyecto.fechaInicio)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Fin: {formatFecha(proyecto.fechaFinTentativa)}</span>
          </div>
          {diasRestantes > 0 && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              diasRestantes <= 7 
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                : diasRestantes <= 30
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            }`}>
              {diasRestantes} días
            </span>
          )}
        </div>

        {/* Colaborador */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {proyecto.colaboradorAsignado.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {proyecto.colaboradorAsignado.nombre}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {proyecto.colaboradorAsignado.rol}
            </p>
          </div>
        </div>

        {/* Clientes */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {proyecto.clientes.slice(0, 2).map((cliente) => (
              <Badge key={cliente.id} variant="outline" className="text-xs">
                {cliente.nombre}
              </Badge>
            ))}
            {proyecto.clientes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{proyecto.clientes.length - 2} más
              </Badge>
            )}
          </div>
        </div>

        {/* Monto */}
        {proyecto.monto && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Monto</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {formatMoneda(proyecto.monto, proyecto.moneda)}
              </p>
              <p className="text-xs text-muted-foreground">
                {proyecto.tipoPago === "CONTADO" ? "Al contado" : "En cuotas"}
              </p>
            </div>
          </div>
        )}

        {/* Entregables */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Entregables</span>
          <span className="font-medium">
            {proyecto.entregables.filter(e => e.estado === "COMPLETADO").length} / {proyecto.entregables.length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
