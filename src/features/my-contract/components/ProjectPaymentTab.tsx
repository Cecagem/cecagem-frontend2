"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, CreditCard, Calendar, Eye } from "lucide-react";
import { IContract, IContractInstallment, IContractPayment } from "@/features/contract/types/contract.types";
import { UploadPaymentModal } from "./UploadPaymentModal";
import { ViewPaymentsModal } from "./ViewPaymentsModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectPaymentTabProps {
  contract: IContract;
}

// Definir interfaces específicas para el estado local
interface SelectedInstallment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  payments: IContractPayment[];
}

export const ProjectPaymentTab = ({ contract }: ProjectPaymentTabProps) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<SelectedInstallment | null>(null);

  const handleUploadPayment = (installment: IContractInstallment) => {
    setSelectedInstallment({
      id: installment.id,
      amount: installment.amount,
      currency: contract.currency,
      description: installment.description || `Cuota ${contract.installments.indexOf(installment) + 1}`,
      payments: installment.payments
    });
    setUploadModalOpen(true);
  };

  const handleViewPayments = (installment: IContractInstallment) => {
    setSelectedInstallment({
      id: installment.id,
      amount: installment.amount,
      currency: contract.currency,
      description: installment.description || `Cuota ${contract.installments.indexOf(installment) + 1}`,
      payments: installment.payments
    });
    setViewModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: contract.currency || 'PEN'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Lista de cuotas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cuotas del Proyecto
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona los pagos de cada cuota de tu proyecto
          </p>
        </CardHeader>
        <CardContent>
          {contract.installments && contract.installments.length > 0 ? (
            <div className="space-y-4">
              {contract.installments.map((installment, index) => {
                // Lógica actualizada siguiendo ContractExpandedView
                const approvedAmount = installment.payments?.reduce((sum, p) => 
                  p.status === 'COMPLETED' ? sum + (p.amount || 0) : sum, 0) || 0;
                const isPaid = approvedAmount >= installment.amount;
                const hasPayments = installment.payments && installment.payments.length > 0;
                const hasPendingPayments = installment.payments?.some(p => p.status === 'PENDING') || false;
                
                return (
                  <div key={installment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{installment.description || `Cuota ${index + 1}`}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{format(new Date(installment.dueDate), 'dd MMM yyyy', { locale: es })}</span>
                          </div>
                          {hasPayments && (
                            <span className="text-xs text-muted-foreground">
                              {installment.payments.length} pago{installment.payments.length !== 1 ? 's' : ''} registrado{installment.payments.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          {isPaid && (
                            <div className="text-sm text-primary font-medium">
                              Pagado: {formatCurrency(approvedAmount)}
                            </div>
                          )}
                          {hasPendingPayments && !isPaid && (
                            <div className="text-sm text-yellow-600 font-medium">
                              En verificación
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex flex-col sm:text-right gap-2">
                        <p className="font-semibold">{formatCurrency(installment.amount)}</p>
                        <Badge 
                          variant={isPaid ? "default" : hasPendingPayments ? "outline" : "secondary"} 
                          className={`w-fit ${hasPendingPayments && !isPaid ? "border-yellow-500 text-yellow-600" : isPaid ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                        >
                          {isPaid ? "Pagado" : hasPendingPayments ? "En Verificación" : "Pendiente"}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {hasPayments && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPayments(installment)}
                            className="flex items-center gap-1 w-full sm:w-auto"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sm:hidden">Ver Pagos</span>
                            <span className="hidden sm:inline">Ver</span>
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant={isPaid ? "outline" : "default"}
                          onClick={() => handleUploadPayment(installment)}
                          className="flex items-center gap-1 w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4" />
                          Subir Pago
                        </Button>
                      </div>
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

      {/* Modales */}
      {selectedInstallment && (
        <>
          <UploadPaymentModal
            open={uploadModalOpen}
            onOpenChange={setUploadModalOpen}
            installmentId={selectedInstallment.id}
            installmentAmount={selectedInstallment.amount}
            installmentCurrency={selectedInstallment.currency}
          />
          
          <ViewPaymentsModal
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
            payments={selectedInstallment.payments}
            installmentDescription={selectedInstallment.description}
          />
        </>
      )}
    </div>
  );
};