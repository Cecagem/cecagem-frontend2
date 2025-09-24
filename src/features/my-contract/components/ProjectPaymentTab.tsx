"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, CreditCard, DollarSign, Calendar} from "lucide-react";
import { IContract } from "@/features/contract/types/contract.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectPaymentTabProps {
  contract: IContract;
}

export const ProjectPaymentTab = ({ contract }: ProjectPaymentTabProps) => {
  const [uploadingInstallment, setUploadingInstallment] = useState<string | null>(null);

  const handleUploadPayment = (installmentId: string) => {
    setUploadingInstallment(installmentId);
    // TODO: Implementar lógica de subida de pagos por cuota específica
    setTimeout(() => {
      setUploadingInstallment(null);
    }, 2000);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'pagado':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
      case 'vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de subir pago */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Gestión de Pagos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sube tus comprobantes de pago para mantener actualizado tu proyecto
              </p>
            </div>
            <Button
              onClick={() => handleUploadPayment('general')}
              disabled={uploadingInstallment === 'general'}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploadingInstallment === 'general' ? 'Subiendo...' : 'Subir Pago'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total del Proyecto</p>
                <p className="text-2xl font-bold">{formatCurrency(contract.costTotal || 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pagado</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {contract.installments ? 
                    formatCurrency(
                      contract.installments.reduce((total, installment) => 
                        total + installment.payments.reduce((payTotal, payment) => payTotal + payment.amount, 0), 0
                      )
                    ) : 
                    formatCurrency(0)
                  }
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendiente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {contract.installments ? 
                    formatCurrency(
                      contract.costTotal - contract.installments.reduce((total, installment) => 
                        total + installment.payments.reduce((payTotal, payment) => payTotal + payment.amount, 0), 0
                      )
                    ) : 
                    formatCurrency(contract.costTotal)
                  }
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de cuotas */}
      <Card>
        <CardHeader>
          <CardTitle>Cuotas del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          {contract.installments && contract.installments.length > 0 ? (
            <div className="space-y-4">
              {contract.installments.map((installment, index) => {
                const totalPaid = installment.payments.reduce((sum, payment) => sum + payment.amount, 0);
                const isPaid = totalPaid >= installment.amount;
                const status = isPaid ? 'paid' : 'pending';
                
                return (
                  <div key={installment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{installment.description || `Cuota ${index + 1}`}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(installment.dueDate), 'dd MMM yyyy', { locale: es })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <div>
                        <p className="font-semibold">{formatCurrency(installment.amount)}</p>
                        <Badge className={getPaymentStatusColor(status)}>
                          {isPaid ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                      {!isPaid && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUploadPayment(installment.id)}
                          disabled={uploadingInstallment === installment.id}
                          className="ml-2"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          {uploadingInstallment === installment.id ? 'Subiendo...' : 'Subir'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay cuotas registradas</h3>
              <p className="text-muted-foreground">
                Las cuotas aparecerán aquí cuando sean configuradas por el administrador
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};