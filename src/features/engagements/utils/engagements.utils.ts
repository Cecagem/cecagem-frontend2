import { z } from "zod";
import { Service, SERVICE_COLORS } from "../types/engagements.type";

export const getServiceStatusColor = (isActive: boolean): string => {
  return isActive ? SERVICE_COLORS.ACTIVE : SERVICE_COLORS.INACTIVE;
};

export const getServiceStatusText = (isActive: boolean): string => {
  return isActive ? "Activo" : "Inactivo";
};

export const formatServiceDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(price);
};

export const truncateDescription = (
  text: string,
  maxLength: number = 100
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  basePrice: z
    .number()
    .min(0.01, "El precio debe ser mayor a 0")
    .max(100000, "El precio no puede exceder S/. 100,000"),
});

export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .optional(),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  basePrice: z
    .number()
    .min(0.01, "El precio debe ser mayor a 0")
    .max(100000, "El precio no puede exceder S/. 100,000")
    .optional(),
  isActive: z.boolean().optional(),
});

export const filterServicesBySearch = (
  services: Service[],
  searchTerm: string
): Service[] => {
  if (!searchTerm.trim()) return services;

  const search = searchTerm.toLowerCase().trim();
  return services.filter(
    (service) =>
      service.name.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search)
  );
};

export const sortServices = (
  services: Service[],
  sortBy: "name" | "createdAt" | "updatedAt" = "name",
  order: "asc" | "desc" = "asc"
): Service[] => {
  return [...services].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
};
