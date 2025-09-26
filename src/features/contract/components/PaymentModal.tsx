"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, 
  CreditCard, 
  CheckCircle, 
  X,
  Clock,
  AlertCircle 
} from 'lucide-react';
import type { IContractPayment } from '../types';
import { useUpdatePayment } from '../hooks/useContracts';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: IContractPayment[];
  installmentDescription?: string;
  canManagePayments?: boolean;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  payments,
  installmentDescription = "Cuota",
  canManagePayments = false
}: PaymentModalProps) => {
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const updatePaymentMutation = useUpdatePayment();

  const handleApprovePayment = async (paymentId: string) => {
    setProcessingPayment(paymentId);
    try {
      await updatePaymentMutation.mutateAsync({
        paymentId,
        data: { status: "COMPLETED" }
      });

      // Actualizar la lista de pagos después de aprobar
      onOpenChange(false);
    } catch (error) {
      console.error('Error al aprobar pago:', error);
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    setProcessingPayment(paymentId);
    try {
      await updatePaymentMutation.mutateAsync({
        paymentId,
        data: { status: "FAILED" }
      });

      // Actualizar la lista de pagos después de rechazar
      onOpenChange(false);
    } catch (error) {
      console.error('Error al rechazar pago:', error);
    } finally {
      setProcessingPayment(null);
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <X className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Aprobado';
      case 'FAILED':
        return 'Rechazado';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'FAILED':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pagos de {installmentDescription}
          </DialogTitle>
          <DialogDescription>
            Detalle de los pagos realizados para esta cuota
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          {/* Lista de pagos */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Historial de Pagos
            </h4>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment, index) => (
                  <Card key={payment.id} className={`border-l-4 ${
                    payment.status === 'COMPLETED' ? 'border-l-green-500' : 
                    payment.status === 'FAILED' ? 'border-l-red-500' :
                    payment.status === 'PENDING' ? 'border-l-yellow-500' : 'border-l-gray-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header del pago */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              payment.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30' :
                              payment.status === 'FAILED' ? 'bg-red-100 dark:bg-red-900/30' :
                              payment.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-900/30'
                            }`}>
                              {getPaymentStatusIcon(payment.status)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Pago #{index + 1}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPaymentStatusColor(payment.status)}>
                              {getPaymentStatusText(payment.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Detalles del pago */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Monto</p>
                            <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Método</p>
                            <p className="font-medium">{payment.method}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Nro. Operación</p>
                            <p className="font-mono text-xs">
                              {payment.reference || 'No especificado'}
                            </p>
                          </div>
                        </div>

                        {/* Botones de acción para administradores */}
                        {canManagePayments && payment.status === 'PENDING' && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleApprovePayment(payment.id)}
                              disabled={processingPayment === payment.id}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {processingPayment === payment.id ? 'Aprobando...' : 'Aprobar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectPayment(payment.id)}
                              disabled={processingPayment === payment.id}
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              {processingPayment === payment.id ? 'Rechazando...' : 'Rechazar'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-sm">No hay pagos registrados para esta cuota</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};