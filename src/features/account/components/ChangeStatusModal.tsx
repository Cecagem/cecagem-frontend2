"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import type { ITransaction, TransactionStatus } from "../types/account.types";
import { TransactionStatus as TStatus } from "../types/account.types";

interface ChangeStatusModalProps {
  transaction: ITransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, newStatus: TransactionStatus) => void;
  isLoading?: boolean;
}

const getStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "Pendiente",
    [TStatus.COMPLETED]: "Completado",
    [TStatus.CANCELED]: "Cancelado",
  };
  return labels[status];
};

const getStatusVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" => {
  const variants: Record<TransactionStatus, "default" | "secondary" | "destructive"> = {
    [TStatus.PENDING]: "secondary",
    [TStatus.COMPLETED]: "default",
    [TStatus.CANCELED]: "destructive",
  };
  return variants[status];
};

const getStatusDescription = (status: TransactionStatus): string => {
  const descriptions: Record<TransactionStatus, string> = {
    [TStatus.PENDING]: "La transacción está pendiente de procesamiento",
    [TStatus.COMPLETED]: "La transacción se ha completado exitosamente",
    [TStatus.CANCELED]: "La transacción ha sido cancelada",
  };
  return descriptions[status];
};

export const ChangeStatusModal = ({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ChangeStatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus>(
    transaction?.estado || TStatus.PENDING
  );

  if (!transaction) return null;

  const handleConfirm = () => {
    onConfirm(transaction.id, selectedStatus);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const statuses = [TStatus.PENDING, TStatus.COMPLETED, TStatus.CANCELED];

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onClose} // Permitir cierre con X por defecto
    >
      <DialogContent 
        className="max-w-md w-[90vw] max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => e.preventDefault()} // Prevenir cierre con click fuera
        onEscapeKeyDown={(e) => e.preventDefault()} // Prevenir cierre con ESC
      >
        {/* Header fijo */}
        <DialogHeader className="flex-shrink-0 border-b pb-4 mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Cambiar Estado
          </DialogTitle>
        </DialogHeader>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Información de la transacción */}
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-sm text-muted-foreground">Transacción:</span>
              <span className="font-medium text-sm sm:text-base break-words">{transaction.descripcion}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-sm text-muted-foreground">Monto:</span>
              <span className="font-semibold text-sm sm:text-base">
                {formatCurrency(parseFloat(transaction.monto))}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
              <span className="text-sm text-muted-foreground">Estado actual:</span>
              <Badge variant={getStatusVariant(transaction.estado)} className="self-start sm:self-auto">
                {getStatusLabel(transaction.estado)}
              </Badge>
            </div>
          </div>

          {/* Selector de nuevo estado */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Seleccionar nuevo estado:</Label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value) => setSelectedStatus(value as TransactionStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status} className="p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <Badge variant={getStatusVariant(status)} className="text-xs self-start">
                        {getStatusLabel(status)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Vista previa del estado seleccionado */}
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-muted-foreground">Estado seleccionado:</span>
                <Badge variant={getStatusVariant(selectedStatus)} className="self-start">
                  {getStatusLabel(selectedStatus)}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {getStatusDescription(selectedStatus)}
              </p>
            </div>
          </div>

          {/* Botones - ahora dentro del área con scroll */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || selectedStatus === transaction.estado}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? "Cambiando..." : "Confirmar Cambio"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};