// ENTITIES
export interface IDeliverable {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  service?: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    isActive: boolean;
  };
}

// DTOs
export interface ICreateDeliverableDto {
  serviceId: string;
  name: string;
  description: string;
  isActive?: boolean;
}

export interface IUpdateDeliverableDto {
  serviceId?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

// FILTERS
export interface IDeliverableFilters {
  search?: string;
  serviceId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// RESPONSES
export interface IDeliverableMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface IDeliverablesResponse {
  data: IDeliverable[];
  meta: IDeliverableMeta;
  message: string;
}

export interface IDeliverableResponse {
  data: IDeliverable;
  message: string;
}

// FORM TYPES
export interface IDeliverableFormData {
  serviceId: string;
  name: string;
  description: string;
  isActive: boolean;
}

// TABLE TYPES
export interface IDeliverableTableFilters {
  search: string;
  serviceId: string;
  isActive: string;
  page: number;
  limit: number;
}
