"use client";

import { useState, useEffect, useMemo } from "react";
import { Building2, FileText, Calendar, Eye, Check, Users, User, CreditCard } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useCreateContract, useUpdateContract } from "../hooks";
import type { ICreateContractDto, IUpdateContractDto, IContract } from "../types";
import { useUsers } from "@/features/user/hooks/use-users";

import { ContractFormStep1, type Step1FormData } from "./ContractFormStep1";
import { ContractFormStep2, type Step2FormData } from "./ContractFormStep2";
import { ContractFormStep3, type Step3FormData } from "./ContractFormStep3";

// Interfaces para los datos completos del formulario
export interface ContractFormData extends Step1FormData, Step2FormData, Step3FormData {
  selectedDeliverables?: Array<{ id: string; name: string }>;
}

// Interface para las restricciones de edición
export interface EditRestrictions {
  canChangeService: boolean;
  serviceChangeReason?: string;
  canChangeCollaborator: boolean;
  collaboratorChangeReason?: string;
  canEditInstallments: boolean;
  installmentsChangeReason?: string;
  canEditCollaboratorPayments: boolean;
  collaboratorPaymentsChangeReason?: string;
  hasCompletedDeliverables: boolean;
  hasCompletedProjectPayments: boolean;
  hasCompletedCollaboratorPayments: boolean;
  // IDs de entregables que están completados/aprobados y no pueden ser deseleccionados
  lockedDeliverableIds: string[];
}

interface NewContractFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  // Props opcionales para modo modal independiente
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<ContractFormData>;
  onSubmit?: (data: ContractFormData) => void;
  // Props para modo edición
  mode?: "create" | "edit";
  contractToEdit?: IContract;
}

interface StepInfo {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// Helper para formatear fechas sin problemas de zona horaria
const formatDate = (date: Date): string => {
  // Usar UTC para evitar problemas de zona horaria
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

export const NewContractForm = ({
  onSuccess,
  onCancel,
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode = "create",
  contractToEdit,
}: NewContractFormProps) => {

  // ============================================================================
  // FUNCIONES PARA CALCULAR RESTRICCIONES DE EDICIÓN
  // ============================================================================

  // Calcular las restricciones de edición basadas en el estado del contrato
  const calculateEditRestrictions = (contract: IContract | undefined): EditRestrictions => {
    if (!contract) {
      return {
        canChangeService: true,
        canChangeCollaborator: true,
        canEditInstallments: true,
        canEditCollaboratorPayments: true,
        hasCompletedDeliverables: false,
        hasCompletedProjectPayments: false,
        hasCompletedCollaboratorPayments: false,
        lockedDeliverableIds: [],
      };
    }

    // Verificar si hay entregables completados o aprobados
    const hasCompletedDeliverables = contract.contractDeliverables.some(
      cd => cd.isCompleted || cd.isAproved
    );

    // Obtener IDs de entregables que están completados/aprobados (bloqueados)
    const lockedDeliverableIds = contract.contractDeliverables
      .filter(cd => cd.isCompleted || cd.isAproved)
      .map(cd => cd.deliverableId);

    // Verificar si hay pagos completados en las cuotas del proyecto
    const hasCompletedProjectPayments = contract.installments.some(
      inst => inst.payments.some(p => p.status === "COMPLETED")
    );

    // Obtener el colaborador actual
    const currentCollaborator = contract.contractUsers.find(
      cu => cu.user.role === "COLLABORATOR_INTERNAL" || cu.user.role === "COLLABORATOR_EXTERNAL"
    );

    // Verificar si el colaborador externo tiene pagos completados
    const isExternalCollaborator = currentCollaborator?.user.role === "COLLABORATOR_EXTERNAL";
    const hasCompletedCollaboratorPayments = isExternalCollaborator &&
      (currentCollaborator?.installments?.some(
        inst => inst.payments.some(p => p.status === "COMPLETED")
      ) || false);

    return {
      // No se puede cambiar servicio si hay entregables completados/aprobados
      canChangeService: !hasCompletedDeliverables,
      serviceChangeReason: hasCompletedDeliverables
        ? "No se puede cambiar el servicio porque hay entregables completados o aprobados"
        : undefined,

      // No se puede cambiar colaborador si es externo y tiene pagos completados
      canChangeCollaborator: !hasCompletedCollaboratorPayments,
      collaboratorChangeReason: hasCompletedCollaboratorPayments
        ? "No se puede cambiar el colaborador porque ya tiene pagos completados"
        : undefined,

      // No se pueden editar cuotas si hay pagos completados
      canEditInstallments: !hasCompletedProjectPayments,
      installmentsChangeReason: hasCompletedProjectPayments
        ? "No se pueden modificar las cuotas porque ya existen pagos completados"
        : undefined,

      // No se pueden editar pagos de colaborador si ya hay pagos completados
      canEditCollaboratorPayments: !hasCompletedCollaboratorPayments,
      collaboratorPaymentsChangeReason: hasCompletedCollaboratorPayments
        ? "No se pueden modificar los pagos del colaborador porque ya tiene pagos completados"
        : undefined,

      hasCompletedDeliverables,
      hasCompletedProjectPayments,
      hasCompletedCollaboratorPayments,
      lockedDeliverableIds,
    };
  };

  // Calcular restricciones
  const editRestrictions = useMemo(() =>
    calculateEditRestrictions(contractToEdit),
    [contractToEdit]
  );

  // Función para transformar el contrato a datos del formulario
  const transformContractToFormData = (contract: IContract): Partial<ContractFormData> => {
    // Separar colaborador de clientes de investigación
    // El colaborador es el que tiene role COLLABORATOR_INTERNAL o COLLABORATOR_EXTERNAL
    const collaborator = contract.contractUsers.find(
      cu => cu.user.role === "COLLABORATOR_INTERNAL" || cu.user.role === "COLLABORATOR_EXTERNAL"
    );
    const clients = contract.contractUsers.filter(
      cu => cu.user.role === "CLIENT"
    );

    // Determinar tipo de pago basado en las cuotas
    const paymentType = contract.installments.length > 1 ? "installments" : "cash";

    // Transformar cuotas
    const installments = contract.installments.map(inst => ({
      description: inst.description,
      amount: inst.amount,
      dueDate: new Date(inst.dueDate),
    }));

    // Transformar pagos de colaborador (si existen)
    const collaboratorPayments = collaborator?.installments?.map(inst => ({
      userId: collaborator.userId,
      amount: inst.amount,
      dueDate: new Date(inst.dueDate),
      description: inst.description,
    })) || [];

    return {
      serviceId: contract.serviceId,
      name: contract.name,
      university: contract.university,
      career: contract.career,
      observation: contract.observation || "",
      collaboratorId: collaborator?.userId || "",
      researchClientIds: clients.map(c => c.userId),
      deliverableIds: contract.contractDeliverables.map(d => d.deliverableId),
      costTotal: contract.costTotal,
      currency: contract.currency,
      startDate: new Date(contract.startDate),
      endDate: new Date(contract.endDate),
      paymentType: paymentType as "cash" | "installments" | "deliverables",
      installments: installments,
      collaboratorPayments: collaboratorPayments.length > 0 ? collaboratorPayments : undefined,
    };
  };

  // Calcular datos iniciales basados en el modo
  const computedInitialData = useMemo(() => {
    if (mode === "edit" && contractToEdit) {
      return transformContractToFormData(contractToEdit);
    }
    return initialData || {};
  }, [mode, contractToEdit, initialData]);

  // Calcular opciones preseleccionadas desde el contrato (para evitar llamadas API adicionales)
  const preselectedOptions = useMemo(() => {
    if (mode !== "edit" || !contractToEdit) return undefined;

    // Obtener el colaborador del contrato
    const collaborator = contractToEdit.contractUsers.find(
      cu => cu.user.role === "COLLABORATOR_INTERNAL" || cu.user.role === "COLLABORATOR_EXTERNAL"
    );

    // Obtener los clientes del contrato
    const clients = contractToEdit.contractUsers.filter(
      cu => cu.user.role === "CLIENT"
    );

    return {
      // El servicio se obtiene de otra manera, pero podemos usar el nombre del contrato como referencia
      // Para el servicio, necesitamos hacer una query separada ya que no viene en contractToEdit
      service: null as { value: string; label: string } | null,

      collaborator: collaborator ? {
        value: collaborator.userId,
        label: `${collaborator.user.profile.documentNumber} - ${collaborator.user.profile.firstName} ${collaborator.user.profile.lastName}`,
      } : null,

      clients: clients.map(c => ({
        value: c.userId,
        label: `${c.user.profile.documentNumber} - ${c.user.profile.firstName} ${c.user.profile.lastName}`,
      })),
    };
  }, [mode, contractToEdit]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ContractFormData>>(computedInitialData);

  // Actualizar formData cuando cambie el contrato a editar
  useEffect(() => {
    if (mode === "edit" && contractToEdit) {
      setFormData(transformContractToFormData(contractToEdit));
      setCurrentStep(1); // Resetear al paso 1 cuando se abre para editar
    }
  }, [mode, contractToEdit]);

  // Hook para crear contratos
  const createContractMutation = useCreateContract();

  // Hook para actualizar contratos
  const updateContractMutation = useUpdateContract();

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
    // Si el servicio cambió, limpiar los entregables seleccionados
    const serviceChanged = formData.serviceId && formData.serviceId !== data.serviceId;

    if (serviceChanged) {
      // Limpiar entregables del servicio anterior
      setFormData(prev => ({
        ...prev,
        ...data,
        deliverableIds: [] // Resetear entregables
      }));
    } else {
      setFormData(prev => ({ ...prev, ...data }));
    }
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: Step3FormData) => {
    // Simplemente pasar los datos sin modificar nada
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    if (!formData || !isFormDataComplete(formData)) {
      return;
    }

    try {
      if (mode === "edit" && contractToEdit) {
        // Actualizar contrato existente
        const updateData = transformFormDataToUpdateDTO(formData as ContractFormData);
        await updateContractMutation.mutateAsync({
          id: contractToEdit.id,
          data: updateData
        });
      } else {
        // Crear nuevo contrato
        const contractData = transformFormDataToDTO(formData as ContractFormData);
        await createContractMutation.mutateAsync(contractData);
      }

      // Ejecutar callbacks de éxito
      onSuccess?.();
      onSubmit?.(formData as ContractFormData);

      // Cerrar formulario
      handleClose();
    } catch (error) {
      console.error(`Error al ${mode === "edit" ? "actualizar" : "crear"} el contrato:`, error);
      // Los errores se manejan en los hooks mutations
    }
  };

  // Función helper para verificar si los datos están completos
  const isFormDataComplete = (data: Partial<ContractFormData>): boolean => {
    // Para tipo ENTREGABLE, endDate es opcional
    const hasRequiredDates = data.paymentType === "deliverables"
      ? !!data.startDate
      : !!(data.startDate && data.endDate);

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
      hasRequiredDates
    );
  };

  // Función helper para transformar formData a DTO
  const transformFormDataToDTO = (data: ContractFormData): ICreateContractDto => {
    // Combinar colaborador y clientes de investigación en userIds
    const userIds = [data.collaboratorId, ...data.researchClientIds];

    // Determinar si el colaborador seleccionado es externo
    const isExternalCollaborator = selectedCollaborator?.role === "COLLABORATOR_EXTERNAL";

    // Solo incluir collaboratorPayments si el colaborador es externo y hay pagos definidos
    const collaboratorPayments = isExternalCollaborator && data.collaboratorPayments?.length
      ? data.collaboratorPayments.map(payment => ({
        userId: data.collaboratorId,
        amount: Number(payment.amount),
        dueDate: payment.dueDate.toISOString(),
        description: payment.description,
      }))
      : undefined;

    // ✅ Para tipo ENTREGABLE, endDate = startDate, sino usar endDate proporcionado
    const endDate = data.paymentType === "deliverables"
      ? data.startDate.toISOString()
      : (data.endDate?.toISOString() ?? data.startDate.toISOString()); // ✅ Fallback a startDate

    return {
      serviceId: data.serviceId,
      name: data.name,
      university: data.university,
      career: data.career,
      observation: data.observation || "",
      costTotal: Number(data.costTotal),
      currency: data.currency,
      contractType: data.contractType,
      startDate: data.startDate.toISOString(),
      endDate: endDate, // ✅ Ahora siempre tiene un valor
      userIds: userIds,
      deliverableIds: data.deliverableIds,
      installments: data.installments?.map(installment => ({
        description: installment.description,
        amount: Number(installment.amount),
        dueDate: installment.dueDate.toISOString(),
      })) || [],
      // Solo enviar collaboratorPayments si es colaborador externo
      ...(collaboratorPayments && { collaboratorPayments }),
    };
  };

  // Función helper para transformar formData a DTO de actualización
  const transformFormDataToUpdateDTO = (data: ContractFormData): IUpdateContractDto => {
    // Combinar colaborador y clientes de investigación en userIds
    const userIds = [data.collaboratorId, ...data.researchClientIds];

    // Determinar si el colaborador seleccionado es externo
    const isExternalCollaborator = selectedCollaborator?.role === "COLLABORATOR_EXTERNAL";

    // Solo incluir collaboratorPayments si:
    // 1. El colaborador es externo
    // 2. Hay pagos definidos
    // 3. Se pueden editar (no hay pagos completados del colaborador)
    const collaboratorPayments = isExternalCollaborator &&
      data.collaboratorPayments?.length &&
      editRestrictions?.canEditCollaboratorPayments !== false
      ? data.collaboratorPayments.map(payment => ({
        userId: data.collaboratorId,
        amount: Number(payment.amount),
        dueDate: payment.dueDate.toISOString(),
        description: payment.description,
      }))
      : undefined;

    // Solo incluir installments si se pueden editar (no hay pagos completados del proyecto)
    const installments = editRestrictions?.canEditInstallments !== false
      ? data.installments?.map(installment => ({
        description: installment.description,
        amount: Number(installment.amount),
        dueDate: installment.dueDate.toISOString(),
      })) || []
      : undefined;

    // ✅ Para tipo ENTREGABLE, endDate = startDate, sino usar endDate proporcionado
    const endDate = data.paymentType === "deliverables"
      ? data.startDate.toISOString()
      : (data.endDate?.toISOString() ?? data.startDate.toISOString()); // ✅ Fallback a startDate

    const result: IUpdateContractDto = {
      serviceId: data.serviceId,
      name: data.name,
      university: data.university,
      career: data.career,
      observation: data.observation || "",
      costTotal: Number(data.costTotal),
      currency: data.currency,
      contractType: data.contractType,
      startDate: data.startDate.toISOString(),
      endDate: endDate, // ✅ Ahora siempre tiene un valor
      userIds: userIds,
      deliverableIds: data.deliverableIds,
    };

    // Solo agregar installments si se pueden editar
    if (installments !== undefined) {
      result.installments = installments;
    }

    // Solo agregar collaboratorPayments si corresponde
    if (collaboratorPayments) {
      result.collaboratorPayments = collaboratorPayments;
    }

    return result;
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(mode === "edit" && contractToEdit ? transformContractToFormData(contractToEdit) : (initialData || {}));
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
            editRestrictions={mode === "edit" ? editRestrictions : undefined}
            preselectedOptions={preselectedOptions}
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
            editRestrictions={mode === "edit" ? editRestrictions : undefined}
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
            editRestrictions={mode === "edit" ? editRestrictions : undefined}
            numberOfDeliverables={formData.deliverableIds?.length || 0}
            selectedDeliverables={formData.selectedDeliverables}
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
          Revise cuidadosamente toda la información antes de {mode === "edit" ? "guardar los cambios" : "crear el contrato"}
        </p>
      </div>

      {/* Información General - Header destacado */}
      <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-lg p-4 sm:p-6 border border-primary/20">
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
                  <span className="text-lg">{formData.startDate ? formatDate(formData.startDate) : '-'}</span>
                </div>
                {formData.paymentType !== "deliverables" && (
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground block">Fecha de Fin</span>
                    <span className="text-lg">{formData.endDate ? formatDate(formData.endDate) : '-'}</span>
                  </div>
                )}
              </div>

              <hr />

              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Modalidad de Pago:</span>
                <Badge variant={formData.paymentType === "cash" ? "default" : "secondary"}>
                  {formData.paymentType === "cash"
                    ? "Pago al Contado"
                    : formData.paymentType === "deliverables"
                      ? `Por Entregables (${formData.installments?.length || 0})`
                      : `${formData.installments?.length || 0} Cuotas`
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma de Cuotas */}
      {(formData.paymentType === "installments" || formData.paymentType === "deliverables") && formData.installments && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-primary" />
              {formData.paymentType === "deliverables" ? "Pagos por Entregables" : "Cronograma de Cuotas"}
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
                      {formData.paymentType === "deliverables" ? "Fecha:" : "Vence:"} {formatDate(installment.dueDate)}
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
          disabled={createContractMutation.isPending || updateContractMutation.isPending}
          className="text-white w-full sm:w-auto"
          size="lg"
        >
          {(createContractMutation.isPending || updateContractMutation.isPending) ? (
            "Procesando..."
          ) : mode === "edit" ? (
            "Guardar Cambios"
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
        <DialogContent
          className="max-w-6xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl">
              {mode === "edit" ? "Editar Contrato" : "Crear Nuevo Contrato"}
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
