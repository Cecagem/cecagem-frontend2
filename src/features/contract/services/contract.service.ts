import { cecagemApi } from "@/lib/api-client";
import type { 
  IContractResponse, 
  IContractFilters, 
  IContract, 
  IUpdateDeliverableDto, 
  IContractDeliverable,
  ICreateContractDto,
  IUpdateContractDto,
  IUpdateInstallmentDto,
  IUpdateInstallmentResponse
} from "../types";

const ENDPOINTS = {
  contracts: "/contract",
  contract: (id: string) => `/contract/${id}`,
  deliverable: (contractId: string, deliverableId: string) => `/contract/${contractId}/deliverables/${deliverableId}`,
  installment: (contractId: string, installmentId: string) => `/contract/${contractId}/installments/${installmentId}`,
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

  // Crear un nuevo contrato
  async createContract(data: ICreateContractDto): Promise<IContract> {
    const response = await cecagemApi.post<IContract>(ENDPOINTS.contracts, data);
    return response;
  }

  // Actualizar un contrato
  async updateContract(id: string, data: IUpdateContractDto): Promise<IContract> {
    const response = await cecagemApi.patch<IContract>(ENDPOINTS.contract(id), data);
    return response;
  }

  // Actualizar estado de un entregable
  async updateDeliverable(
    contractId: string, 
    deliverableId: string, 
    data: IUpdateDeliverableDto
  ): Promise<IContractDeliverable> {
    const response = await cecagemApi.patch<IContractDeliverable>(
      ENDPOINTS.deliverable(contractId, deliverableId),
      data
    );
    return response;
  }

  // Actualizar estado de un pago
  async updatePayment(paymentId: string, data: { status: string }): Promise<{ status: string; id: string }> {
    const response = await cecagemApi.patch<{ status: string; id: string }>(
      `/payments/${paymentId}`,
      data
    );
    return response;
  }

  // Actualizar una cuota específica
  async updateInstallment(
    contractId: string,
    installmentId: string,
    data: IUpdateInstallmentDto
  ): Promise<IUpdateInstallmentResponse> {
    const response = await cecagemApi.patch<IUpdateInstallmentResponse>(
      ENDPOINTS.installment(contractId, installmentId),
      data as unknown as Record<string, unknown>
    );
    return response;
  }
}

export const contractService = new ContractService();