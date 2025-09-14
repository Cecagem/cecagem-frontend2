"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { IDeliverable } from "../types/deliverable.types";
import {
  formatDateTime,
  getStatusVariant,
  getStatusText,
} from "../utils/deliverable.utils";

interface ViewDeliverableDialogProps {
  deliverable: IDeliverable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewDeliverableDialog = ({
  deliverable,
  open,
  onOpenChange,
}: ViewDeliverableDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Detalles del Entregable</span>
          </DialogTitle>
          <DialogDescription>
            Información completa del entregable &quot;{deliverable.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-base font-medium">{deliverable.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="text-base">{deliverable.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Estado:
                </label>
                <Badge variant={getStatusVariant(deliverable.isActive)}>
                  {deliverable.isActive ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {getStatusText(deliverable.isActive)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          {deliverable.service && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Servicio Asociado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre del Servicio
                  </label>
                  <p className="text-base font-medium">
                    {deliverable.service.name}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Descripción del Servicio
                  </label>
                  <p className="text-base">{deliverable.service.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Precio
                  </label>
                  <p className="text-base font-medium text-primary">
                    ${deliverable.service.basePrice.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado del Servicio:
                  </label>
                  <Badge
                    variant={getStatusVariant(deliverable.service.isActive)}
                  >
                    {deliverable.service.isActive ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {getStatusText(deliverable.service.isActive)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Fechas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Creación
                </label>
                <p className="text-base">
                  {formatDateTime(deliverable.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Última Actualización
                </label>
                <p className="text-base">
                  {formatDateTime(deliverable.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ID Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Técnica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID del Entregable
                </label>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {deliverable.id}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID del Servicio
                </label>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {deliverable.serviceId}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
