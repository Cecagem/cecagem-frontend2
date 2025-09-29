"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getServiceStatusColor,
  getServiceStatusText,
  formatServiceDate,
  formatPrice,
} from "../utils/engagements.utils";
import { Service } from "../types/engagements.type";

interface ViewServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export function ViewServiceDialog({
  open,
  onOpenChange,
  service,
}: ViewServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Detalles del Servicio</DialogTitle>
          <DialogDescription>
            Información completa del servicio seleccionado.
          </DialogDescription>
        </DialogHeader>

        {!service ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay datos del servicio disponibles
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Información Básica</span>
                  <Badge
                    variant="secondary"
                    className={getServiceStatusColor(service.isActive)}
                  >
                    {getServiceStatusText(service.isActive)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    NOMBRE
                  </h4>
                  <p className="text-base font-medium">{service.name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    DESCRIPCIÓN
                  </h4>
                  <p className="text-sm leading-relaxed">{service.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información Financiera */}
            <Card>
              <CardHeader>
                <CardTitle>Información Financiera</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    PRECIO BASE
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(service.basePrice)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información de Auditoría */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Auditoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      FECHA DE CREACIÓN
                    </h4>
                    <p className="text-sm">
                      {formatServiceDate(service.createdAt)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      ÚLTIMA ACTUALIZACIÓN
                    </h4>
                    <p className="text-sm">
                      {formatServiceDate(service.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón de cierre */}
            <DialogFooter className="gap-2 border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
