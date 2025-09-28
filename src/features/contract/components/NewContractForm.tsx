"use client";

import { useState } from "react";
import { Building2, FileText, Calendar, Eye, Check, Users, User, CreditCard } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useCreateContract } from "../hooks";
import type { ICreateContractDto } from "../types";
import { useUsers } from "@/features/user/hooks/use-users";

import { ContractFormStep1, type Step1FormData } from "./ContractFormStep1";
import { ContractFormStep2, type Step2FormData } from "./ContractFormStep2";
import { ContractFormStep3, type Step3FormData } from "./ContractFormStep3";

// Interfaces para los datos completos del formulario
export interface ContractFormData extends Step1FormData, Step2FormData, Step3FormData {}

interface NewContractFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  // Props opcionales para modo modal independiente
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<ContractFormData>;
  onSubmit?: (data: ContractFormData) => void;
}

interface StepInfo {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const NewContractForm = ({ 
  onSuccess,
  onCancel,
  open, 
  onOpenChange, 
  initialData,
  onSubmit 
}: NewContractFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ContractFormData>>(initialData || {});

  // Hook para crear contratos
  const createContractMutation = useCreateContract();

  // Obtener información del colaborador seleccionado
  const { data: usersData } = useUsers({
    limit: 1000, // Obtener todos los usuarios para encontrar el colaborador
  });

  const selectedCollaborator = usersData?.data?.find(user => user.id === formData.collaboratorId);

  const steps: StepInfo[] = [
    { 
      number: 1, 
      title: "Información Básica", 
      icon: Building2, 
      description: "Datos del contrato y participantes" 
    },
    { 
      number: 2, 
      title: "Entregables", 
      icon: FileText, 
      description: "Selección de entregables" 
    },
    { 
      number: 3, 
      title: "Fechas y Pagos", 
      icon: Calendar, 
      description: "Cronograma y configuración financiera" 
    },
    { 
      number: 4, 
      title: "Resumen", 
      icon: Eye, 
      description: "Revisión final antes de crear" 
    },
  ];

  const handleStep1Complete = (data: Step1FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: Step3FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    if (!formData || !isFormDataComplete(formData)) {
      return;
    }

    try {
      const contractData = transformFormDataToDTO(formData as ContractFormData);
      
      // Crear nuevo contrato
      await createContractMutation.mutateAsync(contractData);
      
      // Ejecutar callbacks de éxito
      onSuccess?.();
      onSubmit?.(formData as ContractFormData);
      
      // Cerrar formulario
      handleClose();
    } catch (error) {
      console.error('Error al crear el contrato:', error);
      // Los errores se manejan en los hooks mutations
    }
  };

  // Función helper para verificar si los datos están completos
  const isFormDataComplete = (data: Partial<ContractFormData>): boolean => {
    return !!(
      data.serviceId &&
      data.name &&
      data.university &&
      data.career &&
      data.collaboratorId &&
      data.researchClientIds?.length &&
      data.deliverableIds?.length &&
      data.costTotal &&
      data.currency &&
      data.startDate &&
      data.endDate
    );
  };

  // Función helper para transformar formData a DTO
  const transformFormDataToDTO = (data: ContractFormData): ICreateContractDto => {
    // Combinar colaborador y clientes de investigación en userIds
    const userIds = [data.collaboratorId, ...data.researchClientIds];
    
    return {
      serviceId: data.serviceId,
      name: data.name,
      university: data.university,
      career: data.career,
      observation: data.observation || "",
      costTotal: Number(data.costTotal),
      currency: data.currency,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      userIds: userIds,
      deliverableIds: data.deliverableIds,
      installments: data.installments?.map(installment => ({
        description: installment.description,
        amount: Number(installment.amount),
        dueDate: installment.dueDate.toISOString(),
      })) || [],
      collaboratorPayments: data.collaboratorPayments?.map(payment => ({
        userId: payment.userId,
        amount: Number(payment.amount),
        dueDate: payment.dueDate.toISOString(),
        description: payment.description,
      })) || undefined,
    };
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(initialData || {});
    onOpenChange?.(false);
    onCancel?.();
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || step === 1) {
      setCurrentStep(step);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-8 px-2 sm:px-4 space-y-4 sm:space-y-0">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const isAccessible = step.number <= currentStep || step.number === 1;

        return (
          <div key={step.number} className="flex items-center flex-1 w-full sm:w-auto">
            <div className="flex flex-col items-center w-full sm:w-auto">
              <button
                onClick={() => isAccessible && goToStep(step.number)}
                disabled={!isAccessible}
                className={`
                  flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all
                  ${isCompleted 
                    ? "bg-green-500 border-green-500 text-white" 
                    : isActive 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : isAccessible
                        ? "bg-background border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary"
                        : "bg-muted border-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
              <div className="mt-1 sm:mt-2 text-center max-w-20 sm:max-w-none">
                <div className={`text-xs sm:text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground hidden lg:block">
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`hidden sm:block flex-1 h-0.5 mx-2 sm:mx-4 ${isCompleted ? "bg-green-500" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContractFormStep1
            initialData={{
              serviceId: formData.serviceId || "",
              name: formData.name || "",
              university: formData.university || "",
              career: formData.career || "",
              observation: formData.observation || "",
              collaboratorId: formData.collaboratorId || "",
              researchClientIds: formData.researchClientIds || [],
            }}
            onNext={handleStep1Complete}
          />
        );
      case 2:
        return (
          <ContractFormStep2
            serviceId={formData.serviceId || ""}
            initialData={{
              deliverableIds: formData.deliverableIds || [],
            }}
            onNext={handleStep2Complete}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <ContractFormStep3
            initialData={formData}
            onNext={handleStep3Complete}
            onBack={() => setCurrentStep(2)}
            collaboratorId={formData.collaboratorId}
            collaboratorRole={selectedCollaborator?.role}
            contractName={formData.name}
          />
        );
      case 4:
        return renderSummary();
      default:
        return null;
    }
  };

  const renderSummary = () => (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-4 sm:px-0">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4">
          <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">Resumen del Contrato</h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
          Revise cuidadosamente toda la información antes de crear el contrato
        </p>
      </div>

      {/* Información General - Header destacado */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 sm:p-6 border border-primary/20">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-primary">{formData.name}</h3>
          <p className="text-base sm:text-lg text-muted-foreground">{formData.university} - {formData.career}</p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-full">
            <span className="text-lg sm:text-2xl font-bold">{formData.costTotal} {formData.currency}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Información Básica */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Información del Contrato
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-medium text-muted-foreground">Servicio:</span>
                <span className="text-right max-w-xs">{formData.serviceId}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium text-muted-foreground">Universidad:</span>
                <span className="text-right max-w-xs">{formData.university}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium text-muted-foreground">Carrera:</span>
                <span className="text-right max-w-xs">{formData.career}</span>
              </div>
              {formData.observation && (
                <>
                  <hr className="my-4" />
                  <div>
                    <span className="font-medium text-muted-foreground block mb-2">Observaciones:</span>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {formData.observation}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Participantes */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Participantes
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Colaborador Responsable</span>
                </div>
                <Badge variant="outline" className="ml-6">1 colaborador</Badge>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Clientes de Investigación</span>
                </div>
                <Badge variant="outline" className="ml-6">
                  {formData.researchClientIds?.length || 0} clientes
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entregables */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Entregables del Proyecto
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total de entregables:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {formData.deliverableIds?.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Fechas y Pagos */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Cronograma y Pagos
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground block">Fecha de Inicio</span>
                  <span className="text-lg">{formData.startDate?.toLocaleDateString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground block">Fecha de Fin</span>
                  <span className="text-lg">{formData.endDate?.toLocaleDateString()}</span>
                </div>
              </div>
              
              <hr />
              
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Modalidad de Pago:</span>
                <Badge variant={formData.paymentType === "cash" ? "default" : "secondary"}>
                  {formData.paymentType === "cash" ? "Pago al Contado" : `${formData.installments?.length || 0} Cuotas`}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma de Cuotas */}
      {formData.paymentType === "installments" && formData.installments && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-primary" />
              Cronograma de Cuotas
            </h3>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {formData.installments.map((installment, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {installment.description}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-primary">
                      {installment.amount.toFixed(2)} {formData.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Vence: {installment.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total del Contrato:</span>
                <span className="text-primary">
                  {formData.installments.reduce((sum, inst) => sum + inst.amount, 0).toFixed(2)} {formData.currency}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de navegación */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between pt-8 border-t">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(3)}
          size="lg"
          className="w-full sm:w-auto"
        >
          Anterior: Fechas y Pagos
        </Button>
        
        <Button
          onClick={handleFinalSubmit}
          disabled={createContractMutation.isPending}
          className="text-white w-full sm:w-auto"
          size="lg"
        >
          {createContractMutation.isPending ? (
            "Procesando..."
          ) : (
            "Crear Contrato"
          )}
        </Button>
      </div>
    </div>
  );

  const formContent = (
    <div className="space-y-6">
      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );

  // Si se pasan props de modal, renderizar con Dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl">
              Crear Nuevo Contrato
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Renderizar solo el contenido (para uso dentro de otros modales)
  return formContent;
};