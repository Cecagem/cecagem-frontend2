// ENTITIES
export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// REQUEST DTOs
export interface CreateServiceRequest {
  name: string;
  description: string;
  basePrice: number;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  basePrice?: number;
  isActive?: boolean;
}

// RESPONSE DTOs
export interface ServiceResponse {
  success: boolean;
  data: Service;
  message: string;
}

export interface ServicesResponse {
  success: boolean;
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

export interface DeleteServiceResponse {
  success: boolean;
  message: string;
}

export interface DeliverablesResponse {
  success: boolean;
  data: Deliverable[];
  message: string;
}

// FILTERS
export interface ServiceFilters {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

// UTILS
export const ServiceStatus = {
  ACTIVE: true,
  INACTIVE: false,
} as const;

export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus];

// CONSTANTS
export const DEFAULT_SERVICE_FILTERS: ServiceFilters = {
  page: 1,
  limit: 10,
};

export const SERVICE_COLORS = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  INACTIVE: "bg-red-100 text-red-800 border-red-200",
} as const;
