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
import { Separator } from "@/components/ui/separator";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
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
          <div className="space-y-4">
            {/* Header con nombre y estado */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{service.name}</h3>
              </div>
              <Badge
                variant="secondary"
                className={getServiceStatusColor(service.isActive)}
              >
                {getServiceStatusText(service.isActive)}
              </Badge>
            </div>

            <Separator />

            {/* Descripción */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                DESCRIPCIÓN
              </h4>
              <p className="text-sm leading-relaxed">{service.description}</p>
            </div>

            <Separator />

            {/* Precio base */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                PRECIO BASE
              </h4>
              <p className="text-lg font-semibold text-green-600">
                {formatPrice(service.basePrice)}
              </p>
            </div>

            <Separator />

            {/* Información de fechas */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  FECHA DE CREACIÓN
                </h4>
                <p className="text-sm">
                  {formatServiceDate(service.createdAt)}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  ÚLTIMA ACTUALIZACIÓN
                </h4>
                <p className="text-sm">
                  {formatServiceDate(service.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
