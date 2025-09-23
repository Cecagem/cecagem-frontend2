"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, FileText, Tag, Activity } from "lucide-react";
import type { ITransaction, TransactionStatus, TransactionType } from "../types/account.types";
import { TransactionType as TType, TransactionStatus as TStatus } from "../types/account.types";

interface TransactionDetailsModalProps {
  transaction: ITransaction | null;
  isOpen: boolean;
  onClose: () => void;
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

const getTypeLabel = (type: TransactionType): string => {
  return type === TType.INCOME ? "Ingreso" : "Gasto";
};

const getTypeVariant = (type: TransactionType): "default" | "secondary" => {
  return type === TType.INCOME ? "default" : "secondary";
};

export const TransactionDetailsModal = ({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsModalProps) => {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-PE", {
      timeZone: "UTC",
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onClose} // Permitir cierre con X
    >
      <DialogContent 
        className="max-w-2xl w-[90vw] max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => e.preventDefault()} // Prevenir cierre con click fuera
        onEscapeKeyDown={(e) => e.preventDefault()} // Prevenir cierre con ESC
      >
        {/* Header fijo */}
        <DialogHeader className="flex-shrink-0 border-b pb-4 mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Detalles de la Transacción
          </DialogTitle>
        </DialogHeader>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">Monto</p>
                    <p className={`font-semibold text-lg break-words ${transaction.tipo === TType.INCOME ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(parseFloat(transaction.monto))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium break-words">{formatDate(transaction.fecha)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <Badge variant={getTypeVariant(transaction.tipo)} className="mt-1">
                      {getTypeLabel(transaction.tipo)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge variant={getStatusVariant(transaction.estado)} className="mt-1">
                      {getStatusLabel(transaction.estado)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium break-words">{transaction.categoria}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="font-medium break-words">{transaction.descripcion}</p>
                </div>

                {transaction.paymentId && (
                  <div>
                    <p className="text-sm text-muted-foreground">ID de Pago</p>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded break-all">
                      {transaction.paymentId}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};