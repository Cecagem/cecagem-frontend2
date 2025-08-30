"use client";

import { Calendar, Users, DollarSign, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Proyecto, TipoProyecto, EstadoProyecto, Moneda } from "../types";

interface ProyectoResumenProps {
  proyecto: Proyecto;
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

export function ProyectoResumen({ proyecto }: ProyectoResumenProps) {
  const formatFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
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

  const entregablesCompletados = proyecto.entregables.filter(e => e.estado === "COMPLETADO").length;
  const totalEntregables = proyecto.entregables.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Información Principal */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl">{proyecto.titulo}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={tipoProyectoColors[proyecto.tipo]}>
                  {tipoProyectoLabels[proyecto.tipo]}
                </Badge>
                <Badge className={estadoProyectoColors[proyecto.estado]}>
                  {estadoProyectoLabels[proyecto.estado]}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descripción
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {proyecto.descripcion}
            </p>
          </div>

          <Separator />

          {/* Fechas y Progreso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha de Inicio</p>
                  <p className="text-sm text-muted-foreground">{formatFecha(proyecto.fechaInicio)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha Tentativa de Finalización</p>
                  <p className="text-sm text-muted-foreground">{formatFecha(proyecto.fechaFinTentativa)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progreso General</span>
                  <span className="text-sm font-bold">{proyecto.progreso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${proyecto.progreso}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Entregables</span>
                  <span className="text-sm font-bold">{entregablesCompletados}/{totalEntregables}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${totalEntregables > 0 ? (entregablesCompletados / totalEntregables) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {diasRestantes > 0 && (
            <div className={`p-3 rounded-lg ${
              diasRestantes <= 7 
                ? "bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800"
                : diasRestantes <= 30
                ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
                : "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800"
            }`}>
              <p className={`text-sm font-medium ${
                diasRestantes <= 7 
                  ? "text-red-700 dark:text-red-300"
                  : diasRestantes <= 30
                  ? "text-yellow-700 dark:text-yellow-300"
                  : "text-green-700 dark:text-green-300"
              }`}>
                {diasRestantes === 1 ? "Queda 1 día" : `Quedan ${diasRestantes} días`} para la fecha tentativa de finalización
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel Lateral */}
      <div className="space-y-6">
        {/* Colaborador */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Colaborador Asignado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-sm font-medium">
                  {proyecto.colaboradorAsignado.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {proyecto.colaboradorAsignado.nombre}
                </p>
                <p className="text-sm text-muted-foreground">
                  {proyecto.colaboradorAsignado.rol}
                </p>
                <p className="text-xs text-muted-foreground">
                  {proyecto.colaboradorAsignado.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes ({proyecto.clientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proyecto.clientes.map((cliente, index) => (
                <div key={cliente.id} className={`${index > 0 ? 'pt-3 border-t' : ''}`}>
                  <p className="font-medium text-sm text-foreground">{cliente.nombre}</p>
                  <p className="text-xs text-muted-foreground">{cliente.email}</p>
                  {cliente.empresa && (
                    <p className="text-xs text-muted-foreground">{cliente.empresa}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información Financiera */}
        {proyecto.monto && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Monto Total</p>
                <p className="text-lg font-bold text-foreground">
                  {formatMoneda(proyecto.monto, proyecto.moneda)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Pago</p>
                <p className="text-sm font-medium text-foreground">
                  {proyecto.tipoPago === "CONTADO" ? "Al contado" : "En cuotas"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moneda</p>
                <p className="text-sm font-medium text-foreground">
                  {proyecto.moneda === "USD" ? "Dólares Americanos" : "Soles Peruanos"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
