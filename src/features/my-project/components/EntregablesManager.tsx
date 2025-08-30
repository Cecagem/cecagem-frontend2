"use client";

import { useState } from "react";
import { CheckCircle, Circle, Clock, AlertCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Entregable } from "../types";

interface EntregablesManagerProps {
  entregables: Entregable[];
  onEntregableUpdate?: (entregableId: string, nuevoEstado: "EN_REVISION") => void;
}

const estadoEntregableIcons = {
  PENDIENTE: Circle,
  EN_PROGRESO: Clock,
  COMPLETADO: CheckCircle,
  EN_REVISION: AlertCircle,
};

const estadoEntregableColors = {
  PENDIENTE: "text-gray-400",
  EN_PROGRESO: "text-yellow-500",
  COMPLETADO: "text-green-500",
  EN_REVISION: "text-blue-500",
};

const estadoEntregableLabels = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En Progreso",
  COMPLETADO: "Completado",
  EN_REVISION: "En Revisión",
};

const estadoEntregableBadgeColors = {
  PENDIENTE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  EN_PROGRESO: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  COMPLETADO: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  EN_REVISION: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export function EntregablesManager({ 
  entregables, 
  onEntregableUpdate 
}: EntregablesManagerProps) {
  const [entregableSeleccionado, setEntregableSeleccionado] = useState<Entregable | null>(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState<"EN_REVISION" | null>(null);
  const [comentarios, setComentarios] = useState("");
  const [cargando, setCargando] = useState(false);
  
  const formatFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(fecha);
  };

  const diasHastaVencimiento = (fecha: Date) => {
    const dias = Math.ceil((fecha.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const handleAccion = (entregable: Entregable, accion: "EN_REVISION") => {
    setEntregableSeleccionado(entregable);
    setAccionSeleccionada(accion);
    setComentarios("");
  };

  const confirmarAccion = async () => {
    if (!entregableSeleccionado || !accionSeleccionada) return;

    setCargando(true);
    
    // Simular llamada a API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onEntregableUpdate) {
        onEntregableUpdate(entregableSeleccionado.id, accionSeleccionada);
      }
      
      // Cerrar modal
      setEntregableSeleccionado(null);
      setAccionSeleccionada(null);
      setComentarios("");
    } catch (error) {
      console.error("Error al actualizar entregable:", error);
    } finally {
      setCargando(false);
    }
  };

  const cancelarAccion = () => {
    setEntregableSeleccionado(null);
    setAccionSeleccionada(null);
    setComentarios("");
  };

  // Ordenar entregables por fecha de entrega
  const entregablesOrdenados = [...entregables].sort((a, b) => 
    a.fechaEntrega.getTime() - b.fechaEntrega.getTime()
  );

  const entregablesPendientes = entregablesOrdenados.filter(e => 
    e.estado === "PENDIENTE" || e.estado === "EN_PROGRESO"
  );
  const entregablesCompletados = entregablesOrdenados.filter(e => 
    e.estado === "COMPLETADO" || e.estado === "EN_REVISION"
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Entregables del Proyecto</span>
            <Badge variant="outline" className="text-sm">
              {entregablesCompletados.length} / {entregables.length} completados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nota informativa */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Nota:</strong> Como colaborador, puedes enviar tus entregables completados a revisión. 
              El administrador del proyecto se encargará de marcarlos como completados una vez revisados.
            </p>
          </div>
          {/* Entregables Pendientes */}
          {entregablesPendientes.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pendientes y En Progreso ({entregablesPendientes.length})
              </h3>
              <div className="space-y-3">
                {entregablesPendientes.map((entregable) => {
                  const IconComponent = estadoEntregableIcons[entregable.estado];
                  const diasRestantes = diasHastaVencimiento(entregable.fechaEntrega);
                  const esUrgente = diasRestantes <= 3 && diasRestantes >= 0;
                  const estaVencido = diasRestantes < 0;

                  return (
                    <div 
                      key={entregable.id}
                      className={`p-4 rounded-lg border transition-all ${
                        estaVencido 
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                          : esUrgente
                          ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <IconComponent className={`h-5 w-5 mt-0.5 ${estadoEntregableColors[entregable.estado]}`} />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-foreground">{entregable.nombre}</h4>
                              <Badge className={estadoEntregableBadgeColors[entregable.estado]}>
                                {estadoEntregableLabels[entregable.estado]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{entregable.descripcion}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Fecha de entrega: {formatFecha(entregable.fechaEntrega)}</span>
                              {estaVencido && (
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                  Vencido hace {Math.abs(diasRestantes)} días
                                </span>
                              )}
                              {esUrgente && !estaVencido && (
                                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                  {diasRestantes === 0 ? "Vence hoy" : `Vence en ${diasRestantes} días`}
                                </span>
                              )}
                              {!esUrgente && !estaVencido && diasRestantes > 0 && (
                                <span>Faltan {diasRestantes} días</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {entregable.estado === "EN_REVISION" ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="gap-2"
                              disabled
                            >
                              <AlertCircle className="h-4 w-4" />
                              En Revisión
                            </Button>
                          ) : entregable.estado === "COMPLETADO" ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="gap-2"
                              disabled
                            >
                              <CheckCircle className="h-4 w-4" />
                              Completado
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="default"
                              className="gap-2"
                              onClick={() => handleAccion(entregable, "EN_REVISION")}
                              disabled={entregable.estado === "PENDIENTE"}
                              title={entregable.estado === "PENDIENTE" ? "Primero debes marcar el entregable como 'En Progreso'" : "Enviar entregable a revisión"}
                            >
                              <Send className="h-4 w-4" />
                              Enviar a Revisión
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Entregables Completados */}
          {entregablesCompletados.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completados y En Revisión ({entregablesCompletados.length})
              </h3>
              <div className="space-y-3">
                {entregablesCompletados.map((entregable) => {
                  const IconComponent = estadoEntregableIcons[entregable.estado];

                  return (
                    <div 
                      key={entregable.id}
                      className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className={`h-5 w-5 mt-0.5 ${estadoEntregableColors[entregable.estado]}`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-foreground">{entregable.nombre}</h4>
                            <Badge className={estadoEntregableBadgeColors[entregable.estado]}>
                              {estadoEntregableLabels[entregable.estado]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{entregable.descripcion}</p>
                          <div className="text-xs text-muted-foreground">
                            Fecha de entrega: {formatFecha(entregable.fechaEntrega)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {entregables.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No hay entregables definidos
              </h3>
              <p className="text-muted-foreground">
                Los entregables aparecerán aquí cuando sean asignados al proyecto.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmación */}
      <Dialog open={!!entregableSeleccionado} onOpenChange={cancelarAccion}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar a Revisión</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres enviar &ldquo;{entregableSeleccionado?.nombre}&rdquo; a revisión?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Comentarios (Obligatorio)
              </label>
              <Textarea
                placeholder="Describe el trabajo realizado y cualquier observación para la revisión..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cancelarAccion} disabled={cargando}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmarAccion} 
              disabled={cargando || !comentarios.trim()}
              className="gap-2"
            >
              {cargando ? (
                <>
                  <Circle className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar a Revisión
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
