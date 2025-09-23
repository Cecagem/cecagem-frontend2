import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
} from "lucide-react";
import {
  useServices,
  useDeliverablesByService,
} from "@/features/engagements/hooks/useEngagements";
import { useUsers } from "@/features/user/hooks/use-users";
import { useCreateContract, useUpdateContract } from "../hooks/useContract";
import { MultiUserSelect } from "./MultiUserSelect";
import { CreateDeliverableDialog } from "@/features/deliverables/components/CreateDeliverable";
import { UserForm } from "@/features/user/components/UserForm";
import type {
  IContract,
  ICreateConctract,
  IUpdateContract,
} from "../types/contract.type";
import {
  UserRole,
} from "@/features/user/types/user.types";
import {
  validateNameField,
  validateServiceField,
  validateStartDateField,
  validateEndDateField,
  validateCostTotalField,
  validateDeliverableIdsField,
  validateInstallmentCountField,
} from "../utils/contract.validation";

interface ContractFormStepsProps {
  isOpen: boolean;
  contract?: IContract | null;
  onClose: () => void;
}

export const ContractFormSteps = ({
  isOpen,
  contract,
  onClose,
}: ContractFormStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchClients, setSearchClients] = useState("");
  const [searchCollaborators, setSearchCollaborators] = useState("");
  const [showCreateDeliverable, setShowCreateDeliverable] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const createContractMutation = useCreateContract();
  const updateContractMutation = useUpdateContract();

  const form = useForm({
    defaultValues: {
      serviceId: contract?.serviceId || "",
      name: contract?.name || "",
      observation: contract?.observation || "",
      university: contract?.university || "",
      career: contract?.career || "",
      clientIds: [] as string[],
      collaboratorIds: [] as string[],
      deliverableIds: [] as string[],
      costTotal: contract?.costTotal || 0,
      currency: contract?.currency || ("PEN" as const),
      startDate: contract?.startDate ? contract.startDate.split("T")[0] : "",
      endDate: contract?.endDate ? contract.endDate.split("T")[0] : "",
      paymentType: "cash" as "cash" | "installments",
      installmentCount: 1,
    },
    onSubmit: async ({ value }) => {
      const userIds = [...value.clientIds, ...value.collaboratorIds];

      let contractInstallments = [];
      if (value.paymentType === "installments" && installments.length > 0) {
        contractInstallments = installments;
      } else {
        contractInstallments = [
          {
            description: "Pago único",
            amount: value.costTotal,
            dueDate: value.endDate,
          },
        ];
      }

      const contractData = {
        serviceId: value.serviceId,
        name: value.name,
        observation: value.observation,
        university: value.university,
        career: value.career,
        costTotal: value.costTotal,
        currency: value.currency,
        startDate: value.startDate,
        endDate: value.endDate,
        userIds,
        deliverableIds: value.deliverableIds,
        installments: contractInstallments,
      };

      if (contract) {
        updateContractMutation.mutate({
          contractId: contract.id,
          contractData: contractData as IUpdateContract,
        });
      } else {
        createContractMutation.mutate(contractData as ICreateConctract);
      }
      onClose();
      form.reset();
      setCurrentStep(1);
      setSearchClients("");
      setSearchCollaborators("");
      setServiceId(contract?.serviceId || "");
      setPaymentType("cash");
      setInstallments([]);
    },
  });

  const [serviceId, setServiceId] = useState(contract?.serviceId || "");
  const [paymentType, setPaymentType] = useState<"cash" | "installments">(
    "cash"
  );
  const [installments, setInstallments] = useState<
    Array<{ description: string; amount: number; dueDate: string }>
  >([]);

  const { data: servicesData } = useServices({ isActive: true, limit: 100 });

  // Solo buscar clientes si hay texto de búsqueda
  const { data: clientsData } = useUsers(
    searchClients.length >= 2 ? {
      search: searchClients,
      isActive: true,
      role: UserRole.COLLABORATOR_EXTERNAL,
    } : {}
  );

  const { data: allClientsData } = useUsers({
    isActive: true,
    role: UserRole.COLLABORATOR_EXTERNAL,
  });

  // Solo buscar colaboradores si hay texto de búsqueda  
  const { data: collaboratorsData } = useUsers(
    searchCollaborators.length >= 2 ? {
      search: searchCollaborators,
      isActive: true,
    } : {}
  );

  const { data: allCollaboratorsData } = useUsers({
    isActive: true,
  });
  const { data: deliverablesData } = useDeliverablesByService(serviceId);

  const nextStep = () => {
    if (currentStep === 1) {
      const name = form.getFieldValue("name");
      const serviceId = form.getFieldValue("serviceId");
      const clientIds = form.getFieldValue("clientIds") || [];
      const collaboratorIds = form.getFieldValue("collaboratorIds") || [];

      if (
        !name ||
        !serviceId ||
        (clientIds.length === 0 && collaboratorIds.length === 0)
      ) {
        form.validateAllFields("change");
        return;
      }
    }

    if (currentStep === 2) {
      const deliverableIds = form.getFieldValue("deliverableIds") || [];
      if (deliverableIds.length === 0) {
        form.validateAllFields("change");
        return;
      }
    }

    if (currentStep === 3) {
      const startDate = form.getFieldValue("startDate");
      const endDate = form.getFieldValue("endDate");
      const costTotal = form.getFieldValue("costTotal");

      if (!startDate || !endDate || !costTotal || costTotal <= 0) {
        form.validateAllFields("change");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Información Básica", icon: User },
    { number: 2, title: "Entregables", icon: FileText },
    { number: 3, title: "Fechas y Cuotas", icon: Calendar },
    { number: 4, title: "Resumen", icon: FileText },
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div
              className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2
              ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : ""
              }
              ${isCompleted ? "bg-green-500 text-white border-green-500" : ""}
              ${
                !isActive && !isCompleted ? "border-gray-300 text-gray-500" : ""
              }
            `}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                Paso {step.number}
              </p>
              <p className="text-xs text-gray-500">{step.title}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setSearchClients("");
    setSearchCollaborators("");
    setServiceId(contract?.serviceId || "");
    setPaymentType("cash");
    setInstallments([]);
    onClose();
  };

  const handleUserCreated = () => {
    // Refrescar la lista de usuarios después de crear uno nuevo
    setShowCreateUser(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className={`w-[calc(100%-2rem)] !max-w-4xl !h-auto sm:!w-full overflow-y-auto ${
          currentStep === 4 ? "!max-h-[90vh]" : "!max-h-[85vh]"
        }`}
      >
        <DialogHeader>
          <DialogTitle>
            {contract ? "Editar Contrato" : "Crear Nuevo Contrato"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep === 4) {
              form.handleSubmit();
            }
          }}
        >
          {renderStepIndicator()}

          <div className="p-2">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => validateNameField(value),
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          Nombre del Contrato{" "}
                          <span className="text-red-500 text-xs">
                            (obligatorio)
                          </span>
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Ingrese el nombre del contrato"
                          className={
                            field.state.meta.errors.length > 0
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="serviceId"
                    validators={{
                      onChange: ({ value }) => validateServiceField(value),
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          Servicio{" "}
                          <span className="text-red-500 text-xs">
                            (obligatorio)
                          </span>
                        </Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => {
                            field.handleChange(value);
                            setServiceId(value);
                          }}
                        >
                          <SelectTrigger
                            className={
                              field.state.meta.errors.length > 0
                                ? "border-red-500"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Seleccionar servicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {servicesData?.data?.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="observation">
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name}>Observaciones</Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Observaciones adicionales"
                      />
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-2 gap-6">
                  <form.Field name="university">
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          Universidad (Opcional)
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Nombre de la universidad"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="career">
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>Carrera (Opcional)</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Nombre de la carrera"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>
                        Clientes{" "}
                        <span className="text-red-500 text-xs">
                          (obligatorio)
                        </span>
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCreateUser(true)}
                      >
                        + Cliente
                      </Button>
                    </div>
                    <form.Field
                      name="clientIds"
                      validators={{
                        onChange: ({ value }) =>
                          !value || value.length === 0
                            ? "Debe seleccionar al menos un cliente"
                            : undefined,
                      }}
                    >
                      {(field) => (
                        <div>
                          <MultiUserSelect
                            users={clientsData?.data || []}
                            allUsers={allClientsData?.data || []}
                            selectedIds={field.state.value || []}
                            onSelectionChange={field.handleChange}
                            placeholder="Seleccionar clientes..."
                            searchValue={searchClients}
                            onSearchChange={(value: string) => {
                              setSearchClients(value);
                            }}
                            error={
                              field.state.meta.errors.length > 0
                                ? field.state.meta.errors[0]
                                : undefined
                            }
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>
                        Colaboradores{" "}
                        <span className="text-red-500 text-xs">
                          (obligatorio)
                        </span>
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCreateUser(true)}
                      >
                        + Colaborador
                      </Button>
                    </div>
                    <form.Field
                      name="collaboratorIds"
                      validators={{
                        onChange: ({ value }) =>
                          !value || value.length === 0
                            ? "Debe seleccionar al menos un colaborador"
                            : undefined,
                      }}
                    >
                      {(field) => (
                        <div>
                          <MultiUserSelect
                            users={
                              collaboratorsData?.data?.filter(
                                (collaborator) =>
                                  collaborator.role ===
                                    UserRole.COLLABORATOR_INTERNAL ||
                                  collaborator.role ===
                                    UserRole.COLLABORATOR_EXTERNAL
                              ) || []
                            }
                            allUsers={
                              allCollaboratorsData?.data?.filter(
                                (collaborator) =>
                                  collaborator.role ===
                                    UserRole.COLLABORATOR_INTERNAL ||
                                  collaborator.role ===
                                    UserRole.COLLABORATOR_EXTERNAL
                              ) || []
                            }
                            selectedIds={field.state.value || []}
                            onSelectionChange={field.handleChange}
                            placeholder="Seleccionar colaboradores..."
                            searchValue={searchCollaborators}
                            onSearchChange={(value: string) => {
                              setSearchCollaborators(value);
                            }}
                            error={
                              field.state.meta.errors.length > 0
                                ? field.state.meta.errors[0]
                                : undefined
                            }
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Entregables del Servicio</Label>
                    <p className="text-sm text-gray-500 mb-2">
                      Seleccione los entregables que se incluirán en este
                      contrato
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {form.getFieldValue("deliverableIds")?.length || 0}/
                      {deliverablesData?.data?.length || 0}
                    </Badge>
                    {(() => {
                      const selectedCount =
                        form.getFieldValue("deliverableIds")?.length || 0;
                      const totalCount = deliverablesData?.data?.length || 0;
                      const allSelected =
                        selectedCount === totalCount && totalCount > 0;

                      return (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (allSelected) {
                              form.setFieldValue("deliverableIds", []);
                            } else {
                              const allDeliverableIds =
                                deliverablesData?.data?.map((d) => d.id) || [];
                              form.setFieldValue(
                                "deliverableIds",
                                allDeliverableIds
                              );
                            }
                          }}
                          disabled={
                            !serviceId || !deliverablesData?.data?.length
                          }
                        >
                          {allSelected
                            ? "Deseleccionar todos"
                            : "Seleccionar todos"}
                        </Button>
                      );
                    })()}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowCreateDeliverable(true)}
                      disabled={!serviceId}
                    >
                      + Crear Entregable
                    </Button>
                  </div>
                </div>

                {!serviceId && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      Seleccione primero un servicio en el Paso 1 para crear o
                      ver entregables.
                    </p>
                  </div>
                )}

                <form.Field
                  name="deliverableIds"
                  validators={{
                    onChange: ({ value }) => validateDeliverableIdsField(value),
                  }}
                >
                  {(field) => (
                    <div>
                      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                        {deliverablesData?.data?.map((deliverable) => {
                          const isSelected =
                            field.state.value?.includes(deliverable.id) ||
                            false;

                          const handleToggle = (checked: boolean) => {
                            const currentIds = field.state.value || [];
                            if (checked) {
                              const newIds = [...currentIds, deliverable.id];
                              field.handleChange(newIds);
                            } else {
                              const newIds = currentIds.filter(
                                (id: string) => id !== deliverable.id
                              );
                              field.handleChange(newIds);
                            }
                          };

                          return (
                            <Label
                              key={deliverable.id}
                              htmlFor={`deliverable-${deliverable.id}`}
                              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                                isSelected ? "bg-blue-50 border-blue-200" : ""
                              }`}
                              style={{ userSelect: "none" }}
                            >
                              <Checkbox
                                id={`deliverable-${deliverable.id}`}
                                checked={isSelected}
                                onCheckedChange={handleToggle}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1">
                                <span className="font-medium">
                                  {deliverable.name}
                                </span>
                                {deliverable.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {deliverable.description}
                                  </p>
                                )}
                              </div>
                            </Label>
                          );
                        })}
                        {(!deliverablesData?.data ||
                          deliverablesData.data.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            {serviceId
                              ? "No hay entregables disponibles para este servicio"
                              : "Seleccione un servicio primero"}
                          </div>
                        )}
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-2">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <form.Field
                    name="startDate"
                    validators={{
                      onChange: ({ value }) => validateStartDateField(value),
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          Fecha de Inicio{" "}
                          <span className="text-red-500 text-xs">
                            (obligatorio)
                          </span>
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={
                            field.state.meta.errors.length > 0
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="endDate"
                    validators={{
                      onChange: ({ value }) => {
                        const startDate = form.getFieldValue("startDate");
                        return validateEndDateField(value, startDate);
                      },
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          Fecha de Fin{" "}
                          <span className="text-red-500 text-xs">
                            (obligatorio)
                          </span>
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={
                            field.state.meta.errors.length > 0
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <form.Field
                    name="costTotal"
                    validators={{
                      onChange: ({ value }) => validateCostTotalField(value),
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          Costo Total{" "}
                          <span className="text-red-500 text-xs">
                            (obligatorio)
                          </span>
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min="0"
                          step="0.01"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value) || 0)
                          }
                          placeholder="0.00"
                          className={
                            field.state.meta.errors.length > 0
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="currency">
                    {(field) => (
                      <div>
                        <Label htmlFor={field.name}>Moneda</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as "PEN" | "USD")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar moneda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PEN">Soles (PEN)</SelectItem>
                            <SelectItem value="USD">Dólares (USD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="space-y-4">
                  <form.Field name="paymentType">
                    {(field) => (
                      <div>
                        <Label>Tipo de Pago</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => {
                            field.handleChange(
                              value as "cash" | "installments"
                            );
                            setPaymentType(value as "cash" | "installments");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo de pago" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Al Contado</SelectItem>
                            <SelectItem value="installments">
                              En Cuotas
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>

                  {paymentType === "installments" && (
                    <form.Field
                      name="installmentCount"
                      validators={{
                        onChange: ({ value }) =>
                          validateInstallmentCountField(value),
                      }}
                    >
                      {(field) => (
                        <div>
                          <Label htmlFor={field.name}>
                            Número de Cuotas{" "}
                            <span className="text-red-500 text-xs">
                              (obligatorio)
                            </span>
                          </Label>
                          <Select
                            value={field.state.value.toString()}
                            onValueChange={(value) => {
                              const count = parseInt(value);
                              field.handleChange(count);

                              const costTotal = form.getFieldValue("costTotal");
                              const installmentAmount = costTotal / count;
                              const newInstallments = Array.from(
                                { length: count },
                                (_, i) => ({
                                  description: `Cuota ${i + 1}`,
                                  amount: installmentAmount,
                                  dueDate: "",
                                })
                              );
                              setInstallments(newInstallments);
                            }}
                          >
                            <SelectTrigger
                              className={
                                field.state.meta.errors.length > 0
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Seleccionar número de cuotas" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? "cuota" : "cuotas"}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  )}

                  {paymentType === "installments" &&
                    installments.length > 0 && (
                      <div className="space-y-4">
                        <Label>Editar Cuotas</Label>
                        {installments.map((installment, index) => (
                          <Card key={index} className="p-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Descripción</Label>
                                <Input
                                  value={installment.description}
                                  onChange={(e) => {
                                    const newInstallments = [...installments];
                                    newInstallments[index] = {
                                      ...newInstallments[index],
                                      description: e.target.value,
                                    };
                                    setInstallments(newInstallments);
                                  }}
                                  placeholder="Descripción de la cuota"
                                />
                              </div>
                              <div>
                                <Label>Monto</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={installment.amount}
                                  onChange={(e) => {
                                    const newInstallments = [...installments];
                                    newInstallments[index] = {
                                      ...newInstallments[index],
                                      amount: parseFloat(e.target.value) || 0,
                                    };
                                    setInstallments(newInstallments);
                                  }}
                                  placeholder="0.00"
                                />
                              </div>
                              <div>
                                <Label>Fecha de Vencimiento</Label>
                                <Input
                                  type="date"
                                  value={installment.dueDate}
                                  onChange={(e) => {
                                    const newInstallments = [...installments];
                                    newInstallments[index] = {
                                      ...newInstallments[index],
                                      dueDate: e.target.value,
                                    };
                                    setInstallments(newInstallments);
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-medium">
                    Resumen del Contrato
                  </Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Revise toda la información antes de crear el contrato
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Info basica */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Información Básica
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Nombre:</span>{" "}
                        {form.getFieldValue("name") || "Sin especificar"}
                      </div>
                      <div>
                        <span className="font-medium">Servicio:</span>{" "}
                        {servicesData?.data?.find(
                          (s) => s.id === form.getFieldValue("serviceId")
                        )?.name || "Sin especificar"}
                      </div>
                      <div>
                        <span className="font-medium">Universidad:</span>{" "}
                        {form.getFieldValue("university") || "Sin especificar"}
                      </div>
                      <div>
                        <span className="font-medium">Carrera:</span>{" "}
                        {form.getFieldValue("career") || "Sin especificar"}
                      </div>
                    </div>
                  </div>

                  {/* Usuarios */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">Usuarios</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">
                          Clientes (
                          {form.getFieldValue("clientIds")?.length || 0}):
                        </span>
                        <ul className="ml-4 mt-1">
                          {(clientsData?.data || [])
                            .filter((client) =>
                              (form.getFieldValue("clientIds") || []).includes(
                                client.id
                              )
                            )
                            .map((client) => (
                              <li key={client.id}>
                                • {client.profile?.firstName}{" "}
                                {client.profile?.lastName}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">
                          Colaboradores (
                          {form.getFieldValue("collaboratorIds")?.length || 0}):
                        </span>
                        <ul className="ml-4 mt-1">
                          {(collaboratorsData?.data || [])
                            .filter((collab) =>
                              (
                                form.getFieldValue("collaboratorIds") || []
                              ).includes(collab.id)
                            )
                            .map((collab) => (
                              <li key={collab.id}>
                                • {collab.profile?.firstName}{" "}
                                {collab.profile?.lastName}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Entregables */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">Entregables</h3>
                    <div className="text-sm">
                      <span className="font-medium">
                        Seleccionados (
                        {form.getFieldValue("deliverableIds")?.length || 0}):
                      </span>
                      <ul className="ml-4 mt-1">
                        {(deliverablesData?.data || [])
                          .filter((deliverable) =>
                            (
                              form.getFieldValue("deliverableIds") || []
                            ).includes(deliverable.id)
                          )
                          .map((deliverable) => (
                            <li key={deliverable.id}>• {deliverable.name}</li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {/* Fechas y Costos */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Fechas y Costos
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Fecha Inicio:</span>{" "}
                        {form.getFieldValue("startDate") || "Sin especificar"}
                      </div>
                      <div>
                        <span className="font-medium">Fecha Fin:</span>{" "}
                        {form.getFieldValue("endDate") || "Sin especificar"}
                      </div>
                      <div>
                        <span className="font-medium">Costo Total:</span>{" "}
                        {form.getFieldValue("currency")}{" "}
                        {form.getFieldValue("costTotal") || 0}
                      </div>
                      <div>
                        <span className="font-medium">Tipo de Pago:</span>{" "}
                        {paymentType === "cash" ? "Al Contado" : "En Cuotas"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* payload */}
                <div className="mt-6">
                  <h3 className="font-semibold border-b pb-2 mb-4">
                    Preview del Payload
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="text-xs overflow-auto max-h-64">
                      {JSON.stringify(
                        {
                          serviceId: form.getFieldValue("serviceId"),
                          name: form.getFieldValue("name"),
                          observation: form.getFieldValue("observation"),
                          university: form.getFieldValue("university"),
                          career: form.getFieldValue("career"),
                          costTotal: form.getFieldValue("costTotal"),
                          currency: form.getFieldValue("currency"),
                          startDate: form.getFieldValue("startDate"),
                          endDate: form.getFieldValue("endDate"),
                          userIds: [
                            ...(form.getFieldValue("clientIds") || []),
                            ...(form.getFieldValue("collaboratorIds") || []),
                          ],
                          deliverableIds: form.getFieldValue("deliverableIds"),
                          installments:
                            paymentType === "installments" &&
                            installments.length > 0
                              ? installments
                              : [
                                  {
                                    description: "Pago único",
                                    amount: form.getFieldValue("costTotal"),
                                    dueDate: form.getFieldValue("endDate"),
                                  },
                                ],
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between mt-8">
            <div className="flex gap-2 order-2 sm:order-1">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex gap-2 order-1 sm:order-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>

              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="w-full sm:w-auto"
                >
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  disabled={
                    createContractMutation.isPending ||
                    updateContractMutation.isPending
                  }
                  className="w-full sm:w-auto"
                >
                  {contract ? "Actualizar Contrato" : "Crear Contrato"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* modals para crear */}
      <CreateDeliverableDialog
        open={showCreateDeliverable}
        onOpenChange={setShowCreateDeliverable}
        services={servicesData?.data || []}
      />

      <UserForm
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
        onUserSaved={handleUserCreated}
        mode="create"
      />
    </Dialog>
  );
};
