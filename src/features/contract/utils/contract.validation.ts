interface ContractFormData {
  name: string;
  serviceId: string;
  observation: string;
  university: string;
  career: string;
  clientIds: string[];
  collaboratorIds: string[];
  deliverableIds: string[];
  costTotal: number;
  currency: "PEN" | "USD";
  startDate: string;
  endDate: string;
  paymentType: "cash" | "installments";
  installmentCount: number;
}

export const validateStep1 = (data: Partial<ContractFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "El nombre del contrato es obligatorio";
  }

  if (!data.serviceId) {
    errors.serviceId = "Debe seleccionar un servicio";
  }

  const hasClients = data.clientIds && data.clientIds.length > 0;
  const hasCollaborators =
    data.collaboratorIds && data.collaboratorIds.length > 0;

  if (!hasClients && !hasCollaborators) {
    errors.users = "Debe seleccionar al menos un cliente o un colaborador";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateStep2 = (data: Partial<ContractFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.deliverableIds || data.deliverableIds.length === 0) {
    errors.deliverableIds = "Debe seleccionar al menos un entregable";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateStep3 = (data: Partial<ContractFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.startDate) {
    errors.startDate = "La fecha de inicio es obligatoria";
  }

  if (!data.endDate) {
    errors.endDate = "La fecha de fin es obligatoria";
  }

  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    errors.endDate = "La fecha de fin debe ser posterior a la de inicio";
  }

  if (!data.costTotal || data.costTotal <= 0) {
    errors.costTotal = "El costo total debe ser mayor a 0";
  }

  if (data.paymentType === "installments") {
    if (
      !data.installmentCount ||
      data.installmentCount < 1 ||
      data.installmentCount > 10
    ) {
      errors.installmentCount = "Debe seleccionar entre 1 y 10 cuotas";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateNameField = (value: string) => {
  if (!value || value.trim() === "") {
    return "El nombre del contrato es obligatorio";
  }
  return undefined;
};

export const validateServiceField = (value: string) => {
  if (!value) {
    return "Debe seleccionar un servicio";
  }
  return undefined;
};

export const validateStartDateField = (value: string) => {
  if (!value) {
    return "La fecha de inicio es obligatoria";
  }
  return undefined;
};

export const validateEndDateField = (value: string, startDate: string) => {
  if (!value) {
    return "La fecha de fin es obligatoria";
  }
  if (startDate && value <= startDate) {
    return "La fecha de fin debe ser posterior a la de inicio";
  }
  return undefined;
};

export const validateCostTotalField = (value: number) => {
  if (!value || value <= 0) {
    return "El costo total debe ser mayor a 0";
  }
  return undefined;
};

export const validateDeliverableIdsField = (value: string[]) => {
  if (!value || value.length === 0) {
    return "Debe seleccionar al menos un entregable";
  }
  return undefined;
};

export const validateInstallmentCountField = (value: number) => {
  if (!value || value < 1 || value > 10) {
    return "Debe seleccionar entre 1 y 10 cuotas";
  }
  return undefined;
};
