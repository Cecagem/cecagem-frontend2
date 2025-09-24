"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "../utils";
import { Eye, CheckCircle } from "lucide-react";
import { useUpdateDeliverable } from '../hooks';
import { PaymentModal } from './PaymentModal';
import type { IContract, IContractPayment } from "../types";

interface ContractExpandedViewProps {
  contract: IContract;
}

export const ContractExpandedView = ({ contract }: ContractExpandedViewProps) => {
  // Usar directamente los datos del contrato que llegan como prop
  const [activeTab, setActiveTab] = useState("general");
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    payments: IContractPayment[];
    description: string;
  }>({
    open: false,
    payments: [],
    description: "",
  });

  const updateDeliverableMutation = useUpdateDeliverable();

  // Reset modal cuando el contrato cambie
  useEffect(() => {
    setPaymentModal({
      open: false,
      payments: [],
      description: "",
    });
  }, [contract.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    });
  };

  // Handlers para acciones
  const handleViewPayments = (payments: IContractPayment[], description: string) => {
    setPaymentModal({
      open: true,
      payments,
      description,
    });
  };

  const handleVerifyDeliverable = async (contractId: string, deliverableId: string) => {
    try {
      await updateDeliverableMutation.mutateAsync({
        contractId,
        deliverableId,
        data: { isAproved: true }
      });
      // La actualización automática se maneja en el hook
    } catch (error) {
      console.error('Error al verificar entregable:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="payments">Pagos y Cuotas</TabsTrigger>
          <TabsTrigger value="deliverables">Entregables</TabsTrigger>
        </TabsList>

        {/* TAB 1: INFORMACIÓN GENERAL */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre del Proyecto</label>
                  <p className="text-base font-medium mt-1">{contract.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Universidad</label>
                  <p className="text-base mt-1">{contract.university}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Carrera</label>
                  <p className="text-base mt-1">{contract.career}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Costo Total</label>
                  <p className="text-lg font-semibold text-primary mt-1">
                    {formatCurrency(contract.costTotal, contract.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Inicio</label>
                  <p className="text-base mt-1">{formatDate(contract.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Finalización</label>
                  <p className="text-base mt-1">{formatDate(contract.endDate)}</p>
                </div>
              </div>

              {/* Progreso */}
              <div className="mt-6 pt-4 border-t space-y-4">
                <h4 className="font-semibold">Progreso del Proyecto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">General</span>
                      <span className="text-sm font-semibold">{contract.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${contract.overallProgress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Entregables</span>
                      <span className="text-sm font-semibold">{contract.deliverablesPercentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${contract.deliverablesPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Pagos</span>
                      <span className="text-sm font-semibold">{contract.paymentPercentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${contract.paymentPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {contract.observation && (
                <div className="mt-6 pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                  <div className="mt-2 p-3 bg-muted/50 rounded border-l-4 border-l-primary">
                    <p className="text-sm">{contract.observation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PAGOS Y CUOTAS */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cuotas de Pago</span>
                <Badge variant="secondary">
                  {contract.installments?.length || 0} cuotas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!contract.installments || contract.installments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay cuotas de pago registradas para este contrato.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contract.installments.map((installment, index) => {
                    const hasPaidAmount = installment.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
                    const isPaid = hasPaidAmount > 0;
                    const hasPayments = installment.payments && installment.payments.length > 0;

                    return (
                      <Card key={installment.id} className={`${isPaid ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${isPaid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{installment.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  Vence: {formatDate(installment.dueDate)} • {formatCurrency(installment.amount, contract.currency)}
                                </div>
                                {isPaid && (
                                  <div className="text-sm text-primary font-medium">
                                    Pagado: {formatCurrency(hasPaidAmount, contract.currency)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge variant={isPaid ? "default" : "secondary"}>
                                {isPaid ? "Pagado" : "Pendiente"}
                              </Badge>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!hasPayments}
                                onClick={() => handleViewPayments(installment.payments || [], installment.description)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Ver Pagos
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ENTREGABLES */}
        <TabsContent value="deliverables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span>Entregables del Proyecto</span>
                <Badge variant="secondary" className="ml-auto">
                  {contract.contractDeliverables?.length || 0} entregables
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!contract.contractDeliverables || contract.contractDeliverables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay entregables registrados para este contrato.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contract.contractDeliverables.map((deliverable, index) => {
                    const canVerify = deliverable.isCompleted && !deliverable.isAproved;
                    const isApproved = deliverable.isAproved;
                    const isCompleted = deliverable.isCompleted;

                    return (
                      <Card key={deliverable.id} className={`${isApproved ? 'border-l-4 border-l-green-500' : isCompleted ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                isApproved ? 'bg-green-500 text-white' : 
                                isCompleted ? 'bg-primary text-primary-foreground' : 
                                'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">Entregable #{deliverable.deliverableId || `${index + 1}`}</div>
                                <div className="text-sm text-muted-foreground">
                                  Asignado: {formatDate(deliverable.assignedAt)}
                                </div>
                                {deliverable.completedAt && (
                                  <div className="text-sm text-primary font-medium">
                                    Completado: {formatDate(deliverable.completedAt)}
                                  </div>
                                )}
                                {deliverable.notes && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {deliverable.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex gap-2">
                                <Badge variant={isCompleted ? "default" : "secondary"}>
                                  {isCompleted ? "Completado" : "En Progreso"}
                                </Badge>
                                {isApproved && (
                                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                    Aprobado
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                size="sm"
                                variant={canVerify ? "default" : "outline"}
                                disabled={!canVerify || updateDeliverableMutation.isPending}
                                onClick={() => handleVerifyDeliverable(contract.id, deliverable.deliverableId)}
                                className="gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {updateDeliverableMutation.isPending ? 'Verificando...' : 
                                 canVerify ? 'Aprobar' : 
                                 isApproved ? 'Aprobado' : 'No Disponible'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de pagos */}
      <PaymentModal
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal(prev => ({ ...prev, open }))}
        payments={paymentModal.payments}
        installmentDescription={paymentModal.description}
      />
    </div>
  );
};