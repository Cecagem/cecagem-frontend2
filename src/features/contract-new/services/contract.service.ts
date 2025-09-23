import { cecagemApi } from "@/lib/api-client";
import type { IContractResponse, IContractFilters, IContract } from "../types";

const ENDPOINTS = {
  contracts: "/contract",
  contract: (id: string) => `/contract/${id}`,
};

export class ContractService {
  // Obtener todos los contratos con filtros y paginación
  async getContracts(filters: Partial<IContractFilters> = {}): Promise<IContractResponse> {
    const params = new URLSearchParams();
    
    // Paginación
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    
    // Filtros
    if (filters.search) params.append("search", filters.search);
    if (filters.serviceId) params.append("serviceId", filters.serviceId);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.contracts}?${queryString}` : ENDPOINTS.contracts;
    
    const response = await cecagemApi.get<IContractResponse>(url);
    return response;
  }

  // Obtener un contrato por ID
  async getContractById(id: string): Promise<IContract> {
    const response = await cecagemApi.get<IContract>(ENDPOINTS.contract(id));
    return response;
  }

  // Eliminar un contrato
  async deleteContract(id: string): Promise<{ message: string }> {
    const response = await cecagemApi.delete<{ message: string }>(ENDPOINTS.contract(id));
    return response;
  }
}

export const contractService = new ContractService();