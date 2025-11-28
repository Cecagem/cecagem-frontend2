"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "../utils";
import { Eye, CheckCircle, X, Upload, MessageSquare } from "lucide-react";
import { useUpdateDeliverable } from '../hooks';
import { PaymentModal } from './PaymentModal';
import { RejectDeliverableModal } from './RejectDeliverableModal';
import { UploadPaymentModal } from './UploadPaymentModal';
import { WhatsAppNotificationButton } from "@/components/shared";
import type { IContract, IContractPayment } from "../types";

interface ContractExpandedViewProps {
  contract: IContract;
}

export const ContractExpandedView = ({ contract }: ContractExpandedViewProps) => {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Solo renderizar en el cliente para evitar problemas de SSR
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Leer el tab activo desde los query parameters solo en el cliente
  const activeTabFromUrl = isClient ? (searchParams.get('tab') || 'general') : 'general';
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  
  // Función para cambiar tab y actualizar URL sin recargar
  const handleTabChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.replaceState({}, '', url.pathname + url.search);
    setActiveTab(value);
  };

  // Sincronizar el estado local cuando cambien los query parameters
  useEffect(() => {
    setActiveTab(activeTabFromUrl);
  }, [activeTabFromUrl]);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    payments: IContractPayment[];
    description: string;
    isCollaboratorPayment?: boolean;
  }>({
    open: false,
    payments: [],
    description: "",
    isCollaboratorPayment: false,
  });

  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    contractId: string;
    deliverableId: string;
    deliverableName: string;
  }>({
    open: false,
    contractId: "",
    deliverableId: "",
    deliverableName: "",
  });

  const [uploadPaymentModal, setUploadPaymentModal] = useState<{
    open: boolean;
    contractId: string;
    installmentId?: string;
  }>({
    open: false,
    contractId: "",
    installmentId: "",
  });

  const updateDeliverableMutation = useUpdateDeliverable();

  // Reset modal cuando el contrato cambie
  useEffect(() => {
    setPaymentModal({
      open: false,
      payments: [],
      description: "",
      isCollaboratorPayment: false,
    });
    setRejectModal({
      open: false,
      contractId: "",
      deliverableId: "",
      deliverableName: "",
    });
    setUploadPaymentModal({
      open: false,
      contractId: "",
      installmentId: "",
    });
  }, [contract.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Handlers para acciones
  const handleViewPayments = (payments: IContractPayment[], description: string, isCollaboratorPayment = false) => {
    setPaymentModal({
      open: true,
      payments,
      description,
      isCollaboratorPayment,
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

  const handleRejectDeliverable = (contractId: string, deliverableId: string, deliverableName: string) => {
    setRejectModal({
      open: true,
      contractId,
      deliverableId,
      deliverableName,
    });
  };

  const handleConfirmReject = async (notes: string) => {
    try {
      await updateDeliverableMutation.mutateAsync({
        contractId: rejectModal.contractId,
        deliverableId: rejectModal.deliverableId,
        data: { 
          isCompleted: false,
          isAproved: false,
          notes 
        }
      });
      setRejectModal({
        open: false,
        contractId: "",
        deliverableId: "",
        deliverableName: "",
      });
    } catch (error) {
      console.error('Error al rechazar entregable:', error);
    }
  };

  // Función para verificar si hay un colaborador externo
  const hasExternalCollaborator = () => {
    return contract.contractUsers?.some(
      contractUser => contractUser.user.role === 'COLLABORATOR_EXTERNAL'
    ) || false;
  };

  // Función para obtener el cliente del contrato
  const getContractClient = () => {
    return contract.contractUsers?.find(
      contractUser => contractUser.user.role === 'CLIENT'
    );
  };

  // Handler para abrir modal de subir pago
  const handleUploadPayment = (installmentId: string) => {
    setUploadPaymentModal({
      open: true,
      contractId: contract.id,
      installmentId: installmentId,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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

              {/* Colaboradores y Clientes */}
              <div className="mt-6 pt-4 border-t space-y-4">
                <h4 className="font-semibold">Equipo del Proyecto</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Colaboradores */}
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">Colaborador Asignado</h5>
                    <div className="space-y-2">
                      {contract.contractUsers && contract.contractUsers.length > 0 ? (
                        contract.contractUsers
                          .filter(cu => cu.user.role === 'COLLABORATOR_INTERNAL' || cu.user.role === 'COLLABORATOR_EXTERNAL')
                          .map((contractUser) => (
                            <div key={contractUser.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {contractUser.user.profile.firstName.charAt(0)}{contractUser.user.profile.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {contractUser.user.profile.firstName} {contractUser.user.profile.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {contractUser.user.role === 'COLLABORATOR_INTERNAL' ? 'Colaborador Interno' : 'Colaborador Externo'}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {contractUser.user.profile.career}
                              </Badge>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay colaboradores asignados</p>
                      )}
                    </div>
                  </div>

                  {/* Clientes de Investigación */}
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">Clientes de Investigación</h5>
                    <div className="space-y-2">
                      {contract.contractUsers && contract.contractUsers.length > 0 ? (
                        contract.contractUsers
                          .filter(cu => cu.user.role === 'CLIENT')
                          .map((contractUser) => (
                            <div key={contractUser.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {contractUser.user.profile.firstName.charAt(0)}{contractUser.user.profile.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {contractUser.user.profile.firstName} {contractUser.user.profile.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {contractUser.user.profile.university}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Cliente
                              </Badge>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay clientes asignados</p>
                      )}
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
          {/* Cuotas del Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cuotas de Pago del Contrato</span>
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
                    const approvedAmount = installment.payments?.reduce((sum, p) => 
                      p.status === 'COMPLETED' ? sum + (p.amount || 0) : sum, 0) || 0;
                    const isPaid = approvedAmount >= installment.amount;
                    const hasPayments = installment.payments && installment.payments.length > 0;
                    const hasPendingPayments = installment.payments?.some(p => p.status === 'PENDING') || false;

                    return (
                      <Card key={installment.id} className={`${isPaid ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${isPaid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{installment.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  <span className="block sm:inline">Vence: {formatDate(installment.dueDate)}</span>
                                  <span className="hidden sm:inline"> • </span>
                                  <span className="block sm:inline">{formatCurrency(installment.amount, contract.currency)}</span>
                                </div>
                                {isPaid && (
                                  <div className="text-sm text-primary font-medium">
                                    Pagado: {formatCurrency(approvedAmount, contract.currency)}
                                  </div>
                                )}
                                {hasPendingPayments && !isPaid && (
                                  <div className="text-sm text-yellow-600 font-medium">
                                    En verificación
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                              <Badge variant={isPaid ? "default" : hasPendingPayments ? "outline" : "secondary"} 
                                     className={`self-start sm:self-center ${hasPendingPayments && !isPaid ? "border-yellow-500 text-yellow-600" : ""}`}>
                                {isPaid ? "Pagado" : hasPendingPayments ? "En Verificación" : "Pendiente"}
                              </Badge>
                              
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={!hasPayments}
                                  onClick={() => handleViewPayments(installment.payments || [], installment.description, false)} // Cambiar a false
                                  className="gap-2 w-full sm:w-auto text-xs"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span className="sm:inline">Ver Pagos</span>
                                </Button>

                                {hasExternalCollaborator() && (
                                  <Button
                                    size="sm"
                                    disabled={isPaid}
                                    onClick={() => handleUploadPayment(installment.id)}
                                    className="gap-2 w-full sm:w-auto"
                                  >
                                    <Upload className="h-4 w-4" />
                                    <span className="sm:inline">Subir Pago</span>
                                  </Button>
                                )}

                                {getContractClient() && !isPaid && (
                                  <WhatsAppNotificationButton
                                    userId={getContractClient()!.user.id}
                                    contractId={contract.id}
                                    installmentId={installment.id}
                                    size="sm"
                                    className="w-full sm:w-auto"
                                  >
                                    Notificar Cliente
                                  </WhatsAppNotificationButton>
                                )}
                              </div>
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

          {/* Pagos a Colaboradores */}
          {hasExternalCollaborator() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cuota de Pago al Colaborador</span>
                  <Badge variant="secondary">
                    {contract.contractUsers?.reduce((total, cu) => 
                      total + (cu.installments?.length || 0), 0) || 0} pagos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!contract.contractUsers?.some(cu => cu.installments && cu.installments.length > 0) ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay pagos de colaboradores registrados para este contrato.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contract.contractUsers
                      .filter(cu => cu.user.role === 'COLLABORATOR_EXTERNAL' && cu.installments && cu.installments.length > 0)
                      .map((contractUser) => (
                        <div key={contractUser.id} className="space-y-3">
                          <div className="flex items-center gap-3 pb-2 border-b">
                            <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {contractUser.user.profile.firstName.charAt(0)}{contractUser.user.profile.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {contractUser.user.profile.firstName} {contractUser.user.profile.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">Colaborador Externo</p>
                            </div>
                          </div>
                          
                          {contractUser.installments?.map((installment, index) => {
                            const approvedAmount = installment.payments?.reduce((sum, p) => 
                              p.status === 'COMPLETED' ? sum + (p.amount || 0) : sum, 0) || 0;
                            const isPaid = approvedAmount >= installment.amount;
                            const hasPayments = installment.payments && installment.payments.length > 0;
                            const hasPendingPayments = installment.payments?.some(p => p.status === 'PENDING') || false;

                            return (
                              <Card key={installment.id} className={`ml-4 ${isPaid ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}> 
                                <CardContent>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${isPaid ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                        {index + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-sm">{installment.description}</div>
                                        <div className="text-sm text-muted-foreground">
                                          <span className="block sm:inline">Vence: {formatDate(installment.dueDate)}</span>
                                          <span className="hidden sm:inline"> • </span>
                                          <span className="block sm:inline">{formatCurrency(installment.amount, contract.currency)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                      <Badge variant={isPaid ? "default" : hasPendingPayments ? "outline" : "secondary"} 
                                             className={`self-start sm:self-center text-xs ${isPaid ? "bg-blue-700" : ""} ${hasPendingPayments && !isPaid ? "border-yellow-500 text-yellow-600" : ""}`}>
                                        {isPaid ? "Pagado" : hasPendingPayments ? "En Verificación" : "Pendiente"}
                                      </Badge>
                                      
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          disabled={!hasPayments}
                                          onClick={() => handleViewPayments(installment.payments || [], 
                                            `Pago colaborador - ${contractUser.user.profile.firstName}`, 
                                            true)}
                                          className="gap-2 w-full sm:w-auto text-xs"
                                        >
                                          <Eye className="h-3 w-3" />
                                          <span className="sm:inline">Ver Pagos</span>
                                        </Button>

                                        <Button
                                          size="sm"
                                          disabled={isPaid}
                                          onClick={() => handleUploadPayment(installment.id)}
                                          className="gap-2 w-full sm:w-auto"
                                        >
                                          <Upload className="h-3 w-3" />
                                          <span className="sm:inline">Subir Pago</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                      <Card key={deliverable.id} className={`${isApproved ? 'border-l-4 border-l-green-500/50' : isCompleted ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-muted-foreground'}`}>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                                isApproved ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 
                                isCompleted ? 'bg-primary text-primary-foreground' : 
                                'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{deliverable.deliverable?.name || `Entregable #${index + 1}`}</div>
                                <div className="text-sm text-muted-foreground">
                                  {deliverable.deliverable?.description || 'Sin descripción'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Asignado: {formatDate(deliverable.assignedAt)}
                                </div>
                                {deliverable.completedAt && (
                                  <div className="text-sm text-primary font-medium">
                                    Completado: {formatDate(deliverable.completedAt)}
                                  </div>
                                )}
                                {deliverable.notes && (
                                  <div className="mt-2 p-2 rounded-md bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 flex items-start gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                                    <div className="text-xs wrap-break-word">
                                      <span className="font-semibold text-primary">Observación: </span>
                                      <span className="text-muted-foreground">{deliverable.notes}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant={isCompleted ? "default" : "secondary"} className="w-fit">
                                  {isCompleted ? "Completado" : "En Progreso"}
                                </Badge>
                                {isApproved && (
                                  <Badge variant="default" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 w-fit">
                                    Aprobado
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  size="sm"
                                  variant={canVerify ? "default" : "outline"}
                                  disabled={!canVerify || updateDeliverableMutation.isPending}
                                  onClick={() => handleVerifyDeliverable(contract.id, deliverable.deliverableId)}
                                  className="gap-2 w-full sm:w-auto"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="sm:inline">
                                    {updateDeliverableMutation.isPending ? 'Verificando...' : 
                                     canVerify ? 'Aprobar' : 
                                     isApproved ? 'Aprobado' : 'No Disponible'}
                                  </span>
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={!canVerify || updateDeliverableMutation.isPending}
                                  onClick={() => handleRejectDeliverable(
                                    contract.id, 
                                    deliverable.deliverableId, 
                                    deliverable.deliverable?.name || `Entregable #${index + 1}`
                                  )}
                                  className="gap-2 w-full sm:w-auto"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sm:inline">
                                    {updateDeliverableMutation.isPending ? 'Procesando...' : 'Rechazar'}
                                  </span>
                                </Button>
                              </div>
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
        canManagePayments={!paymentModal.isCollaboratorPayment}
      />

      {/* Modal de rechazo de entregables */}
      <RejectDeliverableModal
        open={rejectModal.open}
        onOpenChange={(open) => setRejectModal(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmReject}
        deliverableName={rejectModal.deliverableName}
        isLoading={updateDeliverableMutation.isPending}
      />

      {/* Modal de subir pago */}
      <UploadPaymentModal
        open={uploadPaymentModal.open}
        onOpenChange={(open) => setUploadPaymentModal(prev => ({ ...prev, open }))}
        contractId={uploadPaymentModal.contractId}
        installmentId={uploadPaymentModal.installmentId}
      />
    </div>
  );
};