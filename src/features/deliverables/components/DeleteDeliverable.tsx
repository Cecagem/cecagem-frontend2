"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDeleteDeliverable } from "../hooks/useDeliverables";
import { IDeliverable } from "../types/deliverable.types";
import { getStatusVariant, getStatusText } from "../utils/deliverable.utils";

interface DeleteDeliverableDialogProps {
  deliverable: IDeliverable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteDeliverableDialog = ({
  deliverable,
  open,
  onOpenChange,
}: DeleteDeliverableDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteDeliverable();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMutation.mutateAsync(deliverable.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting deliverable:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirmar Eliminación</span>
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            entregable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Deliverable Info */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Entregable a eliminar:</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Nombre: </span>
                <span className="text-sm">{deliverable.name}</span>
              </div>

              <div>
                <span className="text-sm font-medium">Descripción: </span>
                <span className="text-sm">{deliverable.description}</span>
              </div>

              {deliverable.service && (
                <div>
                  <span className="text-sm font-medium">Servicio: </span>
                  <span className="text-sm">{deliverable.service.name}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Estado: </span>
                <Badge
                  variant={getStatusVariant(deliverable.isActive)}
                  className="text-xs"
                >
                  {getStatusText(deliverable.isActive)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive mb-1">Advertencia</p>
                <p className="text-destructive/80">
                  Al eliminar este entregable:
                </p>
                <ul className="list-disc list-inside mt-2 text-destructive/80 space-y-1">
                  <li>Se perderá toda la información asociada</li>
                  <li>No podrá ser recuperado posteriormente</li>
                  <li>Puede afectar contratos que lo incluyan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              "Eliminando..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
