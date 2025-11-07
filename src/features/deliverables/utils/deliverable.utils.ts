import { IDeliverable, IDeliverableFormData } from "../types/deliverable.types";

export const formatDeliverableName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const getStatusVariant = (isActive: boolean) => {
  return isActive ? "default" : "secondary";
};

export const getStatusText = (isActive: boolean): string => {
  return isActive ? "Activo" : "Inactivo";
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const deliverableToFormData = (
  deliverable: IDeliverable
): IDeliverableFormData => {
  return {
    serviceId: deliverable.serviceId,
    name: deliverable.name,
    description: deliverable.description,
    isActive: deliverable.isActive,
  };
};

export const getInitialFormData = (): IDeliverableFormData => {
  return {
    serviceId: "",
    name: "",
    description: "",
    isActive: true,
  };
};

export const validateDeliverableForm = (
  data: IDeliverableFormData
): string[] => {
  const errors: string[] = [];

  if (!data.serviceId.trim()) {
    errors.push("El servicio es requerido");
  }

  if (!data.name.trim()) {
    errors.push("El nombre es requerido");
  }

  if (!data.description.trim()) {
    errors.push("La descripción es requerida");
  }

  return errors;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const getSearchableText = (deliverable: IDeliverable): string => {
  return [
    deliverable.name,
    deliverable.description,
    deliverable.service?.name || "",
  ]
    .join(" ")
    .toLowerCase();
};
