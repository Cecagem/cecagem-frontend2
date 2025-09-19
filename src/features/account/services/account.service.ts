import { cecagemApi } from "@/lib/api-client";
import {
  ICreateTransactionDto,
  IUpdateTransactionDto,
  ITransactionFilters,
  ITransactionsResponse,
  ITransactionResponse,
  ITransactionStats,
} from "../types/account.types";

export class TransactionService {
  async getAll(filters?: ITransactionFilters): Promise<ITransactionsResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.tipo) params.append("tipo", filters.tipo);
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.categoria) params.append("categoria", filters.categoria);
    if (filters?.fechaInicio) params.append("fechaInicio", filters.fechaInicio);
    if (filters?.fechaFin) params.append("fechaFin", filters.fechaFin);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/transactions?${queryString}`
      : "/transactions";

    return await cecagemApi.get<ITransactionsResponse>(url);
  }

  async getById(id: string): Promise<ITransactionResponse> {
    return await cecagemApi.get<ITransactionResponse>(
      `/transactions/${id}`
    );
  }

  async create(data: ICreateTransactionDto): Promise<ITransactionResponse> {
    return await cecagemApi.post<ITransactionResponse>(
      "/transactions",
      data as unknown as Record<string, unknown>
    );
  }

  async update(
    id: string,
    data: IUpdateTransactionDto
  ): Promise<ITransactionResponse> {
    return await cecagemApi.patch<ITransactionResponse>(
      `/transactions/${id}`,
      data as unknown as Record<string, unknown>
    );
  }

  async delete(id: string): Promise<{ message: string }> {
    return await cecagemApi.delete<{ message: string }>(
      `/transactions/${id}`
    );
  }

  async getStats(): Promise<ITransactionStats> {
    try {
      // Intentar obtener stats del endpoint específico
      return await cecagemApi.get<ITransactionStats>("/transactions/stats");
    } catch {
      // Si el endpoint no existe, calcular localmente
      console.warn("Endpoint /transactions/stats no disponible, calculando localmente");
      return await this.calculateStatsLocally();
    }
  }

  private async calculateStatsLocally(): Promise<ITransactionStats> {
    // Obtener todas las transacciones
    const response = await this.getAll();
    const transactions = response.data || [];
    
    // Filtrar solo las transacciones completadas
    const completedTransactions = transactions.filter(t => t.estado === "COMPLETED");
    
    const totalIncome = completedTransactions
      .filter(t => t.tipo === "INCOME")
      .reduce((sum, t) => sum + parseFloat(t.monto || "0"), 0);
      
    const totalExpenses = completedTransactions
      .filter(t => t.tipo === "EXPENSE")
      .reduce((sum, t) => sum + parseFloat(t.monto || "0"), 0);
      
    const totalBalance = totalIncome - totalExpenses;
    
    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      transactionCount: completedTransactions.length,
    };
  }
}

export const transactionService = new TransactionService();