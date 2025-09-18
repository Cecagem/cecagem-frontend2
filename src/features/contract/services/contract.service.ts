import { cecagemApi } from "@/lib/api-client";
import {
  IContractFilters,
  IContractResponse,
  ICreateConctract,
  IUpdateContract,
} from "@/features/contract";

export class ContractService {
  private readonly baseEndpoint = "/contract";

  async getAll(filters?: IContractFilters): Promise<IContractResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.serviceId) params.append("serviceId", filters.serviceId);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);

    const queryString = params.toString();
    const url = queryString
      ? `${this.baseEndpoint}?${queryString}`
      : this.baseEndpoint;

    return await cecagemApi.get<IContractResponse>(url);
  }

  async getById(id: string): Promise<IContractResponse> {
    return await cecagemApi.get<IContractResponse>(
      `${this.baseEndpoint}/${id}`
    );
  }

  async create(data: ICreateConctract): Promise<IContractResponse> {
    return await cecagemApi.post<IContractResponse>(
      this.baseEndpoint,
      data as unknown as Record<string, unknown>
    );
  }

  async update(id: string, data: IUpdateContract): Promise<IContractResponse> {
    return await cecagemApi.patch<IContractResponse>(
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

export const contractService = new ContractService();
