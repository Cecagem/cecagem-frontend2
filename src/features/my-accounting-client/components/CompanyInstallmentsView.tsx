"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  Eye, 
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { ICompany, IInstallment, IPayment, IUser } from "@/features/accounting-clients/types/accounting-clients.types";
import { UploadPaymentModal } from "./UploadPaymentModal";
import { ViewPaymentsModal } from "./ViewPaymentsModal";

interface CompanyInstallmentsViewProps {
  company: ICompany;
}

// Definir el tipo extendido para las cuotas con información adicional del contrato
interface ExtendedInstallment extends IInstallment {
  contractId: string;
  contractUser: IUser;
  monthlyPayment: number;
}

export const CompanyInstallmentsView = ({ company }: CompanyInstallmentsViewProps) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<ExtendedInstallment | null>(null);

  // Obtener todas las cuotas de todos los contratos activos
  const allInstallments = company.contract
    ?.filter(contract => contract.isActive)
    ?.flatMap(contract => 
      contract.installments?.map(installment => ({
        ...installment,
        contractId: contract.id,
        contractUser: contract.user,
        monthlyPayment: contract.monthlyPayment
      })) || []
    ) || [];

  // Ordenar por fecha de vencimiento
  const sortedInstallments = allInstallments.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const getInstallmentStatus = (installment: ExtendedInstallment) => {
    if (!installment.payments || installment.payments.length === 0) {
      return { 
        status: "pending", 
        label: "Pendiente", 
        icon: Clock, 
        variant: "secondary" as const,
        iconColor: "text-orange-500"
      };
    }

    const hasCompleted = installment.payments.some((p: IPayment) => p.status === "COMPLETED");
    const hasPending = installment.payments.some((p: IPayment) => p.status === "PENDING");
    const hasFailed = installment.payments.some((p: IPayment) => p.status === "FAILED");

    if (hasCompleted) {
      return { 
        status: "completed", 
        label: "Pagado", 
        icon: CheckCircle, 
        variant: "default" as const,
        iconColor: "text-green-500"
      };
    }
    if (hasPending) {
      return { 
        status: "verification", 
        label: "En Verificación", 
        icon: Clock, 
        variant: "outline" as const,
        iconColor: "text-blue-500"
      };
    }
    if (hasFailed) {
      return { 
        status: "failed", 
        label: "Rechazado", 
        icon: AlertCircle, 
        variant: "destructive" as const,
        iconColor: "text-red-500"
      };
    }

    return { 
      status: "pending", 
      label: "Pendiente", 
      icon: Clock, 
      variant: "secondary" as const,
      iconColor: "text-orange-500"
    };
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const handleUploadPayment = (installment: ExtendedInstallment) => {
    setSelectedInstallment(installment);
    setUploadModalOpen(true);
  };

  const handleViewPayments = (installment: ExtendedInstallment) => {
    setSelectedInstallment(installment);
    setViewModalOpen(true);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (sortedInstallments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cuotas del Proyecto
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona los pagos de cada cuota de tu proyecto
          </p>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay cuotas registradas</h3>
          <p className="text-muted-foreground">
            Esta empresa no tiene cuotas registradas en contratos activos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cuotas de la Empresa
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona los pagos de cada cuota de la empresa
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedInstallments.map((installment, index) => {
              const status = getInstallmentStatus(installment);
              const StatusIcon = status.icon;
              const overdue = isOverdue(installment.dueDate) && status.status === "pending";
              
              // Determinar si el botón debe estar deshabilitado
              const isUploadDisabled = status.status === "completed" || status.status === "verification";
              
              return (
                <div
                  key={installment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted shrink-0">
                      <StatusIcon className={`h-5 w-5 ${status.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {installment.description || `Cuota #${index + 1}`}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 shrink-0" />
                          <span>S/ {installment.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span className={overdue ? 'text-red-600' : ''}>
                            {formatDate(installment.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                      {overdue && (
                        <Badge variant="destructive">
                          Vencida
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      {installment.payments && installment.payments.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPayments(installment)}
                          className="w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver ({installment.payments.length})
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant={isUploadDisabled ? "outline" : "default"}
                        onClick={() => handleUploadPayment(installment)}
                        disabled={isUploadDisabled}
                        className="w-full sm:w-auto"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {status.status === "verification" ? "En Verificación" : "Subir Pago"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
            installmentCurrency="PEN"
          />
          
          <ViewPaymentsModal
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
            payments={selectedInstallment.payments || []}
            installmentDescription={selectedInstallment.description || `Cuota #${sortedInstallments.indexOf(selectedInstallment) + 1}`}
          />
        </>
      )}
    </>
  );
};