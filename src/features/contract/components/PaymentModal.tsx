"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, CreditCard } from 'lucide-react';
import type { IContractPayment } from '../types';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: IContractPayment[];
  installmentDescription?: string;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  payments,
  installmentDescription = "Cuota"
}: PaymentModalProps) => {
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

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
          {/* Resumen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumen de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pagado</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Transacciones</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {payments.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de pagos */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Historial de Pagos
            </h4>
            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((payment, index) => (
                  <Card key={payment.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
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
                          <Badge variant="secondary" className="font-mono">
                            {formatCurrency(payment.amount)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {payment.id.slice(-8)}
                          </p>
                        </div>
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