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
import { Package, CheckCircle2, XCircle } from "lucide-react";
import { IDeliverable } from "../types/deliverable.types";
import {
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Detalles del Entregable</span>
          </DialogTitle>
          <DialogDescription>
            Información completa del entregable &quot;{deliverable.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
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
                  <p className="text-base font-medium break-words">{deliverable.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Descripción
                  </label>
                  <p className="text-base break-words">{deliverable.description}</p>
                </div>

                <div className="flex items-center space-x-2 flex-wrap">
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
                    <p className="text-base font-medium break-words">
                      {deliverable.service.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Descripción del Servicio
                    </label>
                    <p className="text-base break-words">{deliverable.service.description}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Precio
                    </label>
                    <p className="text-base font-medium text-primary">
                      ${deliverable.service.basePrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-wrap">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
