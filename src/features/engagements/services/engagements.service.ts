import { cecagemApi } from "@/lib/api-client";
import {
  ServiceFilters,
  ServicesResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
  DeleteServiceResponse,
  DeliverablesResponse,
} from "../types/engagements.type";

class EngagementService {
  private readonly baseEndpoint = "/engagements";

  async getServices(
    filters?: Partial<ServiceFilters>
  ): Promise<ServicesResponse> {
    const params = new URLSearchParams();

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.isActive !== undefined) {
      params.append("isActive", filters.isActive.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseEndpoint}?${queryString}`
      : this.baseEndpoint;

    return await cecagemApi.get<ServicesResponse>(url);
  }

  async getServiceById(serviceId: string): Promise<ServiceResponse> {
    return await cecagemApi.get<ServiceResponse>(
      `${this.baseEndpoint}/${serviceId}`
    );
  }

  async createService(
    serviceData: CreateServiceRequest
  ): Promise<ServiceResponse> {
    return await cecagemApi.post<ServiceResponse>(
      this.baseEndpoint,
      serviceData as unknown as Record<string, unknown>
    );
  }

  async updateService(
    serviceId: string,
    serviceData: UpdateServiceRequest
  ): Promise<ServiceResponse> {
    return await cecagemApi.patch<ServiceResponse>(
      `${this.baseEndpoint}/${serviceId}`,
      serviceData as unknown as Record<string, unknown>
    );
  }

  async deleteService(serviceId: string): Promise<DeleteServiceResponse> {
    return await cecagemApi.delete<DeleteServiceResponse>(
      `${this.baseEndpoint}/${serviceId}`
    );
  }

  async getDeliverablesByServiceId(
    serviceId: string
  ): Promise<DeliverablesResponse> {
    return await cecagemApi.get<DeliverablesResponse>(
      `${this.baseEndpoint}/${serviceId}/deliverables`
    );
  }
}

const engagementApiService = new EngagementService();

export const engagementService = {
  getServices: (filters?: Partial<ServiceFilters>) =>
    engagementApiService.getServices(filters),

  getServiceById: (serviceId: string) =>
    engagementApiService.getServiceById(serviceId),

  createService: (serviceData: CreateServiceRequest) =>
    engagementApiService.createService(serviceData),

  updateService: (serviceId: string, serviceData: UpdateServiceRequest) =>
    engagementApiService.updateService(serviceId, serviceData),

  deleteService: (serviceId: string) =>
    engagementApiService.deleteService(serviceId),

  getDeliverablesByServiceId: (serviceId: string) =>
    engagementApiService.getDeliverablesByServiceId(serviceId),
} as const;
