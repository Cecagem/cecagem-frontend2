import { cecagemApi } from "@/lib/api-client";
import {
  ICreateDeliverableDto,
  IUpdateDeliverableDto,
  IDeliverableFilters,
  IDeliverablesResponse,
  IDeliverableResponse,
} from "../types/deliverable.types";

export class DeliverableService {
  private readonly baseEndpoint = "/deliverables";

  async getAll(filters?: IDeliverableFilters): Promise<IDeliverablesResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.serviceId) params.append("serviceId", filters.serviceId);
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseEndpoint}?${queryString}`
      : this.baseEndpoint;

    return await cecagemApi.get<IDeliverablesResponse>(url);
  }

  async getById(id: string): Promise<IDeliverableResponse> {
    return await cecagemApi.get<IDeliverableResponse>(
      `${this.baseEndpoint}/${id}`
    );
  }

  async create(data: ICreateDeliverableDto): Promise<IDeliverableResponse> {
    return await cecagemApi.post<IDeliverableResponse>(
      this.baseEndpoint,
      data as unknown as Record<string, unknown>
    );
  }

  async update(
    id: string,
    data: IUpdateDeliverableDto
  ): Promise<IDeliverableResponse> {
    return await cecagemApi.patch<IDeliverableResponse>(
      `${this.baseEndpoint}/${id}`,
      data as unknown as Record<string, unknown>
    );
  }

  async delete(id: string): Promise<{ message: string }> {
    return await cecagemApi.delete<{ message: string }>(
      `${this.baseEndpoint}/${id}`
    );
  }
}

export const deliverableService = new DeliverableService();
