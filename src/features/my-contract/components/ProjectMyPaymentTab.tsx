"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { IContract, ICollaboratorInstallment } from "@/features/contract/types/contract.types";
import { useAuthStore } from "@/features/auth";
import { PaymentModal } from "@/features/contract/components/PaymentModal";

interface ProjectMyPaymentTabProps {
  contract: IContract;
}

export const ProjectMyPaymentTab = ({ contract }: ProjectMyPaymentTabProps) => {
  const [selectedInstallment, setSelectedInstallment] = useState<ICollaboratorInstallment | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Obtener usuario actual
  const { user } = useAuthStore();

  // Obtener las cuotas del colaborador actual
  const getMyCollaboratorPayments = (): ICollaboratorInstallment[] => {
    if (!user?.id || !contract.contractUsers) return [];
    
    const myContractUser = contract.contractUsers.find(cu => cu.userId === user.id);
    return myContractUser?.installments || [];
  };

  const myInstallments = getMyCollaboratorPayments();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: contract.currency || 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  // Función para obtener el estado de la cuota basado en los pagos
  const getInstallmentStatus = (installment: ICollaboratorInstallment) => {
    if (!installment.payments || installment.payments.length === 0) {
      return { 
        status: 'NO_PAYMENTS', 
        label: 'Sin Pagos', 
        badgeClass: 'bg-muted/50 text-muted-foreground border-muted',
        cardClass: 'bg-background border-border'
      };
    }

    const hasCompleted = installment.payments.some(p => p.status === 'COMPLETED');
    const hasPending = installment.payments.some(p => p.status === 'PENDING');
    const hasRejected = installment.payments.some(p => p.status === 'FAILED');

    if (hasCompleted) {
      return { 
        status: 'COMPLETED', 
        label: 'Completado', 
        badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
        cardClass: 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-950/30'
      };
    }
    if (hasPending) {
      return { 
        status: 'PENDING', 
        label: 'Pendiente Validación', 
        badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        cardClass: 'bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50 hover:bg-yellow-50 dark:hover:bg-yellow-950/30'
      };
    }
    if (hasRejected) {
      return { 
        status: 'REJECTED', 
        label: 'Rechazado', 
        badgeClass: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
        cardClass: 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-950/30'
      };
    }

    return { 
      status: 'NO_PAYMENTS', 
      label: 'Sin Pagos', 
      badgeClass: 'bg-muted/50 text-muted-foreground border-muted',
      cardClass: 'bg-background border-border hover:bg-muted/20'
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleViewPayments = (installment: ICollaboratorInstallment) => {
    setSelectedInstallment(installment);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Lista de cuotas */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Mis Pagos de Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {myInstallments.length > 0 ? (
            <div className="space-y-4">
              {myInstallments.map((installment) => {
                const installmentStatus = getInstallmentStatus(installment);
                
                return (
                  <Card 
                    key={installment.id} 
                    className="transition-all duration-200 hover:shadow-md bg-background border-border"
                  >
                    <CardContent className="p-4 sm:p-6">
                      {/* Layout responsive */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Información principal */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getStatusIcon(installmentStatus.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg leading-tight">
                                {installment.description}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span>Vence: {formatDate(installment.dueDate)}</span>
                              </p>
                            </div>
                          </div>
                          
                          {/* Información de monto y pagos */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(installment.amount)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {installment.payments?.length || 0} pago(s) registrado(s)
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-col lg:items-end">
                          <Badge 
                            variant="outline" 
                            className={`${installmentStatus.badgeClass} justify-center sm:justify-start lg:justify-center`}
                          >
                            {installmentStatus.label}
                          </Badge>
                          
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewPayments(installment)}
                            className="flex items-center justify-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Ver y Validar Pagos</span>
                            <span className="sm:hidden">Ver Pagos</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No hay cuotas asignadas</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No tienes cuotas de colaborador asignadas en este proyecto. 
                Las cuotas aparecerán aquí cuando sean configuradas por el administrador.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para ver y validar pagos */}
      {selectedInstallment && (
        <PaymentModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          payments={selectedInstallment.payments || []}
          installmentDescription={selectedInstallment.description}
          canManagePayments={true}
        />
      )}
    </div>
  );
};