"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckSquare } from "lucide-react";
import { ProyectoResumen } from "./ProyectoResumen";
import { EntregablesManager } from "./EntregablesManager";
import { Proyecto } from "../types";

interface ProyectoDetalleProps {
  proyecto: Proyecto;
}

export function ProyectoDetalle({ proyecto }: ProyectoDetalleProps) {
  const [vistaActiva, setVistaActiva] = useState<"resumen" | "entregables">("entregables");
  const [entregablesActualizados, setEntregablesActualizados] = useState(proyecto.entregables);

  const handleEntregableUpdate = (entregableId: string, nuevoEstado: "EN_REVISION") => {
    setEntregablesActualizados(prev => 
      prev.map(entregable => 
        entregable.id === entregableId 
          ? { ...entregable, estado: nuevoEstado }
          : entregable
      )
    );
    
    // Aquí podrías hacer la llamada a la API para actualizar el estado
    console.log(`Entregable ${entregableId} actualizado a ${nuevoEstado}`);
  };

  // Crear proyecto actualizado con entregables modificados
  const proyectoActualizado = {
    ...proyecto,
    entregables: entregablesActualizados
  };

  return (
    <div className="space-y-6">
      {/* Navegación */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Detalles del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={vistaActiva === "entregables" ? "default" : "outline"}
              size="sm"
              onClick={() => setVistaActiva("entregables")}
              className="gap-2"
            >
              <CheckSquare className="h-4 w-4" />
              Entregables
            </Button>
            <Button
              variant={vistaActiva === "resumen" ? "default" : "outline"}
              size="sm"
              onClick={() => setVistaActiva("resumen")}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Resumen del Proyecto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenido */}
      {vistaActiva === "resumen" && (
        <ProyectoResumen proyecto={proyectoActualizado} />
      )}

      {vistaActiva === "entregables" && (
        <EntregablesManager 
          entregables={entregablesActualizados}
          onEntregableUpdate={handleEntregableUpdate}
        />
      )}
    </div>
  );
}
